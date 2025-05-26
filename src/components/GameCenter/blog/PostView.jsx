import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaComment, FaClock, FaArrowLeft } from 'react-icons/fa';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';
import BlogService from '../shared/BlogService';
import styles from './PostView.module.css';

const PostView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getArticleById(id);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load article. Please try again later.');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const newLikes = (article.likes || 0) + 1;
      await BlogService.likeArticle(id, newLikes);
      setArticle({ ...article, likes: newLikes });
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newComment = {
        content: comment,
        createdAt: new Date().toISOString()
      };

      await BlogService.updateComment(id, newComment);
      setArticle({
        ...article,
        comments: [...(article.comments || []), newComment]
      });
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className={styles.loading}>Loading article...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!article) return <div className={styles.error}>Article not found</div>;

  const DOMPurify = createDOMPurify();
  const sanitizedHtml = DOMPurify.sanitize(marked(article.markdown || ''));

  return (
    <div className={styles.postView}>
      <Link to="/blog" className={styles.backLink}>
        <FaArrowLeft /> Back to Blog
      </Link>

      <article className={styles.article}>
        {article.image && (
          <div className={styles.imageContainer}>
            <img src={article.image} alt={article.title} className={styles.image} />
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.categories}>
            {article.categories?.map((category, index) => (
              <span key={index} className={styles.category}>
                {category}
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          {article.subtitle && <h2 className={styles.subtitle}>{article.subtitle}</h2>}
          
          <div className={styles.meta}>
            <span className={styles.date}>
              <FaClock /> {formatDate(article.createdAt)}
            </span>
            <div className={styles.stats}>
              <button onClick={handleLike} className={styles.likeButton}>
                <FaHeart /> {article.likes || 0}
              </button>
              <span className={styles.commentCount}>
                <FaComment /> {article.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        <div className={styles.comments}>
          <h3>Comments</h3>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
            <button type="submit" className={styles.submitButton}>
              Post Comment
            </button>
          </form>

          <div className={styles.commentList}>
            {article.comments?.map((comment, index) => (
              <div key={index} className={styles.commentItem}>
                <p className={styles.commentContent}>{comment.content}</p>
                <span className={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            ))}
            {!article.comments?.length && (
              <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostView;
