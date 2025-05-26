import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import BlogService from '../shared/BlogService';
import BlogPostCard from '../components/BlogPostCard';
import styles from './BlogHome.module.css';

const MIN_ARTICLES_FOR_FEATURED = 5;

const BlogHome = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('game');
  const [error, setError] = useState(null);

  const fetchFeaturedArticles = async () => {
    try {
      const data = await BlogService.getFeaturedArticles();
      if (data && Array.isArray(data.articles)) {
        // Filter featured articles to only show game-related ones
        const gameFeatured = data.articles.filter(article => 
          Array.isArray(article.categories) && 
          article.categories.some(cat => cat.toLowerCase() === 'game')
        );
        setFeaturedArticles(gameFeatured);
      } else {
        setFeaturedArticles([]);
      }
    } catch (err) {
      console.error('Error fetching featured articles:', err);
      setFeaturedArticles([]);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        category: 'game' // Always filter for game category
      };
      if (searchQuery) filters.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'game') {
        filters.category = selectedCategory;
      }
      
      const data = await BlogService.getArticles(filters);
      
      if (data && Array.isArray(data.articles)) {
        // Filter articles to ensure they have 'game' in categories
        const gameArticles = data.articles.filter(article => 
          Array.isArray(article.categories) && 
          article.categories.some(cat => cat.toLowerCase() === 'game')
        );
        
        setArticles(gameArticles);

        // Only fetch featured articles if we have enough total articles
        if (gameArticles.length >= MIN_ARTICLES_FOR_FEATURED) {
          fetchFeaturedArticles();
        } else {
          setFeaturedArticles([]); // Clear featured articles if not enough total articles
        }
        
        // Extract unique categories from game articles
        const allCategories = new Set();
        gameArticles.forEach(article => {
          if (article.categories && Array.isArray(article.categories)) {
            article.categories.forEach(category => allCategories.add(category));
          }
        });
        setCategories(Array.from(allCategories));
      } else {
        console.warn('Unexpected API response format:', data);
        setArticles([]);
        setCategories([]);
        setFeaturedArticles([]);
      }
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching articles:', err);
      setArticles([]);
      setCategories([]);
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchArticles();
  }, []); // Empty dependency array for initial fetch only

  // Debounced search and category filter
  useEffect(() => {
    if (!loading) { // Only run if not in initial loading state
      const debounceTimer = setTimeout(() => {
        fetchArticles();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, selectedCategory]); // Dependencies that trigger search

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? 'game' : category);
  };

  if (loading && !articles.length) { // Only show loading state if no articles yet
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading game articles...</p>
      </div>
    );
  }

  return (
    <div className={styles.blogHome}>
      <div className={styles.header}>
        <h1>Game Blog</h1>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search game articles..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchArticles} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {articles.length >= MIN_ARTICLES_FOR_FEATURED && featuredArticles.length > 0 && (
            <section className={styles.featured}>
              <h2>Featured Game Articles</h2>
              <div className={styles.featuredGrid}>
                {featuredArticles.map(article => (
                  <BlogPostCard 
                    key={article._id || article.id} 
                    article={article} 
                    featured 
                  />
                ))}
              </div>
            </section>
          )}

          <div className={styles.categories}>
            <button
              className={`${styles.categoryButton} ${selectedCategory === 'game' ? styles.active : ''}`}
              onClick={() => handleCategorySelect('game')}
            >
              All Games
            </button>
            {categories.map(category => (
              category.toLowerCase() !== 'game' && (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              )
            ))}
          </div>

          <div className={styles.articlesGrid}>
            {articles.length > 0 ? (
              articles.map(article => (
                <BlogPostCard 
                  key={article._id || article.id} 
                  article={article} 
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No game articles found</p>
                {(searchQuery || selectedCategory !== 'game') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('game');
                    }} 
                    className={styles.clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogHome;
