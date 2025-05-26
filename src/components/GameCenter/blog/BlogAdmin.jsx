import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus, 
  FaArchive, 
  FaChartBar,
  FaComment,
  FaHeart
} from 'react-icons/fa';
import BlogService from '../shared/BlogService';
import styles from './BlogAdmin.module.css';

const BlogAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft, archived
  const [sortBy, setSortBy] = useState('date'); // date, likes, comments
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedArticles, setSelectedArticles] = useState(new Set());

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getArticles({ status: filter });
      const sortedArticles = sortArticles(response.data);
      setArticles(sortedArticles);
      setError(null);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortArticles = (articlesToSort) => {
    return [...articlesToSort].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'likes':
          comparison = (b.likes || 0) - (a.likes || 0);
          break;
        case 'comments':
          comparison = (b.comments?.length || 0) - (a.comments?.length || 0);
          break;
        default: // date
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const handleSort = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setArticles(sortArticles(articles));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await BlogService.deleteArticle(id);
      setArticles(articles.filter(article => article._id !== id));
    } catch (err) {
      setError('Failed to delete article. Please try again.');
      console.error('Error deleting article:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedArticles.size} articles?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedArticles).map(id => BlogService.deleteArticle(id))
      );
      setArticles(articles.filter(article => !selectedArticles.has(article._id)));
      setSelectedArticles(new Set());
    } catch (err) {
      setError('Failed to delete some articles. Please try again.');
      console.error('Error in bulk delete:', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await BlogService.updateStatus(id, { status });
      fetchArticles();
    } catch (err) {
      setError('Failed to update article status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  const toggleArticleSelection = (id) => {
    const newSelection = new Set(selectedArticles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedArticles(newSelection);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className={styles.loading}>Loading articles...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Blog Administration</h1>
        <Link to="/blog/new" className={styles.newButton}>
          <FaPlus /> New Article
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'published' ? styles.active : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'draft' ? styles.active : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'archived' ? styles.active : ''}`}
            onClick={() => setFilter('archived')}
          >
            Archived
          </button>
        </div>

        {selectedArticles.size > 0 && (
          <button 
            className={styles.deleteButton}
            onClick={handleBulkDelete}
          >
            <FaTrash /> Delete Selected ({selectedArticles.size})
          </button>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkbox}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedArticles(new Set(articles.map(a => a._id)));
                    } else {
                      setSelectedArticles(new Set());
                    }
                  }}
                  checked={selectedArticles.size === articles.length}
                />
              </th>
              <th>Title</th>
              <th className={styles.sortable} onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.sortable} onClick={() => handleSort('likes')}>
                <FaHeart /> {sortBy === 'likes' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.sortable} onClick={() => handleSort('comments')}>
                <FaComment /> {sortBy === 'comments' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article._id)}
                    onChange={() => toggleArticleSelection(article._id)}
                  />
                </td>
                <td className={styles.title}>{article.title}</td>
                <td>{formatDate(article.createdAt)}</td>
                <td>{article.likes || 0}</td>
                <td>{article.comments?.length || 0}</td>
                <td>
                  <select
                    value={article.status || 'draft'}
                    onChange={(e) => handleStatusChange(article._id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className={styles.actions}>
                  <Link 
                    to={`/blog/${article._id}`}
                    className={styles.actionButton}
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/blog/edit/${article._id}`}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className={`${styles.actionButton} ${styles.delete}`}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.noResults}>
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogAdmin;
