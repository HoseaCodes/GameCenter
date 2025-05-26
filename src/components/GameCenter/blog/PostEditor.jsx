import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaEye, FaTimes, FaImage, FaTag } from 'react-icons/fa';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';
import BlogService from '../shared/BlogService';
import styles from './PostEditor.module.css';

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    markdown: '',
    image: '',
    categories: [],
    isDraft: true
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (id) {
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await BlogService.getArticleById(id);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load article. Please try again later.');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      categories: [...new Set([...prev.categories, newCategory.trim()])]
    }));
    setNewCategory('');
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await BlogService.updateArticle(id, formData);
      } else {
        await BlogService.createArticle(formData);
      }
      navigate('/blog');
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error('Error saving article:', err);
      setLoading(false);
    }
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  if (loading) return <div className={styles.loading}>Loading editor...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const sanitizedHtml = createDOMPurify.sanitize(marked.parse(formData.markdown || ''));

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <h1>{id ? 'Edit Article' : 'Create New Article'}</h1>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={togglePreview}
            className={`${styles.button} ${preview ? styles.active : ''}`}
          >
            <FaEye /> Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`${styles.button} ${styles.primary}`}
            disabled={loading}
          >
            <FaSave /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.editPanel} ${preview ? styles.hidden : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Article title"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="subtitle">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Article subtitle (optional)"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the article"
                rows="3"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="image">Featured Image URL</label>
              <div className={styles.imageInput}>
                <FaImage className={styles.imageIcon} />
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Categories</label>
              <div className={styles.categoryInput}>
                <div className={styles.categoryForm}>
                  <FaTag className={styles.tagIcon} />
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className={styles.addButton}
                  >
                    Add
                  </button>
                </div>
                <div className={styles.categories}>
                  {formData.categories.map((category, index) => (
                    <span key={index} className={styles.category}>
                      {category}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className={styles.removeCategory}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="markdown">Content (Markdown)</label>
              <textarea
                id="markdown"
                name="markdown"
                value={formData.markdown}
                onChange={handleInputChange}
                placeholder="Write your article in Markdown format"
                rows="20"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="isDraft"
                  checked={formData.isDraft}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'isDraft',
                      value: e.target.checked
                    }
                  })}
                />
                Save as draft
              </label>
            </div>
          </form>
        </div>

        <div className={`${styles.previewPanel} ${!preview ? styles.hidden : ''}`}>
          <div className={styles.articlePreview}>
            <h1>{formData.title}</h1>
            {formData.subtitle && <h2>{formData.subtitle}</h2>}
            {formData.image && (
              <img src={formData.image} alt={formData.title} className={styles.previewImage} />
            )}
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
