import axios from 'axios';

const API_URL = 'https://hoseacodes.herokuapp.com/api/articles';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    // Return just the data
    return response.data;
  },
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error('Error setting up request');
    }
  }
);

const BlogService = {
  // Get all articles with optional filters
  getArticles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : '';
      return await api.get(url);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  },
  
  // Get article by ID
  getArticleById: async (id) => {
    try {
      return await api.get(`/${id}`);
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  },
  
  // Create new article
  createArticle: async (articleData) => {
    try {
      return await api.post('', articleData);
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error;
    }
  },
  
  // Update article
  updateArticle: async (id, articleData) => {
    try {
      return await api.put(`/${id}`, articleData);
    } catch (error) {
      console.error(`Failed to update article ${id}:`, error);
      throw error;
    }
  },
  
  // Delete article
  deleteArticle: async (id) => {
    try {
      return await api.delete(`/${id}`);
    } catch (error) {
      console.error(`Failed to delete article ${id}:`, error);
      throw error;
    }
  },
  
  // Like article
  likeArticle: async (id, likes) => {
    try {
      return await api.put(`/like/${id}`, { likes });
    } catch (error) {
      console.error(`Failed to update likes for article ${id}:`, error);
      throw error;
    }
  },
  
  // Update article comment
  updateComment: async (id, commentData) => {
    try {
      return await api.put(`/comment/${id}`, commentData);
    } catch (error) {
      console.error(`Failed to update comments for article ${id}:`, error);
      throw error;
    }
  },
  
  // Toggle draft or archive status
  updateStatus: async (id, status) => {
    try {
      return await api.patch(`/conditional/${id}`, status);
    } catch (error) {
      console.error(`Failed to update status for article ${id}:`, error);
      throw error;
    }
  },

  // Get articles by category
  getArticlesByCategory: async (category) => {
    try {
      return await api.get(`?category=${encodeURIComponent(category)}`);
    } catch (error) {
      console.error(`Failed to fetch articles for category ${category}:`, error);
      throw error;
    }
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    try {
      return await api.get('?featured=true');
    } catch (error) {
      console.error('Failed to fetch featured articles:', error);
      throw error;
    }
  },

  // Search articles
  searchArticles: async (query) => {
    try {
      return await api.get(`?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error(`Failed to search articles with query ${query}:`, error);
      throw error;
    }
  }
};

export default BlogService;
