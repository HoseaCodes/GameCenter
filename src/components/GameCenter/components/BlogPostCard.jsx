import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaClock } from 'react-icons/fa';
import styles from './BlogPostCard.module.css';

const BlogPostCard = ({ article, featured }) => {
  console.log(article);
  if (!article) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const defaultImage = '';

  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.imageContainer}>
        <img 
          src={article.images || article.secure_url || defaultImage} 
          alt={article.title || 'Blog post'} 
          className={styles.image}
          onError={(e) => {
            e.target.src = defaultImage;
            e.target.onerror = null;
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.categories}>
          {Array.isArray(article.categories) && article.categories.map((category, index) => (
            <span key={index} className={styles.category}>
              {category}
            </span>
          ))}
        </div>
        <Link to={`/blog/${article._id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{article.title || 'Untitled Post'}</h2>
        </Link>
        {article.subtitle && <h3 className={styles.subtitle}>{article.subtitle}</h3>}
        <p className={styles.description}>
          {article.description || article.excerpt || 'No description available'}
        </p>
        <div className={styles.meta}>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <FaHeart className={styles.icon} />
              {article.likes || 0}
            </span>
            <span className={styles.stat}>
              <FaComment className={styles.icon} />
              {Array.isArray(article.comments) ? article.comments.length : 0}
            </span>
            <span className={styles.stat}>
              <FaClock className={styles.icon} />
              {formatDate(article.createdAt)}
            </span>
          </div>
          <Link to={`/blog/${article._id}`} className={styles.readMore}>
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
