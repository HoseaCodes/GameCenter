// Mock data for development
const mockArticles = [
  {
    id: '1',
    title: 'Getting Started with React Gaming',
    subtitle: 'A comprehensive guide to building games with React',
    description: 'Learn how to create engaging games using React and modern web technologies.',
    markdown: `# Getting Started with React Gaming

## Introduction
React is a powerful library for building user interfaces, and it's great for creating interactive games.

## Key Concepts
1. State Management
2. Component Lifecycle
3. Performance Optimization

## Code Example
\`\`\`javascript
function GameComponent() {
  const [score, setScore] = useState(0);
  // Game logic here
}
\`\`\`
`,
    imageUrl: 'https://via.placeholder.com/800x400',
    categories: ['React', 'Gaming', 'Tutorial'],
    status: 'published',
    author: 'Dominique Hosea',
    createdAt: '2025-05-11T16:00:00.000Z',
    updatedAt: '2025-05-11T16:00:00.000Z',
    likes: 42,
    comments: [],
    featured: true
  },
  {
    id: '2',
    title: 'Building a Speed Typing Game',
    subtitle: 'Create an engaging typing game with React',
    description: 'Step-by-step guide to building a speed typing game with React.',
    markdown: `# Building a Speed Typing Game

## Features
- Real-time typing feedback
- WPM calculation
- Accuracy tracking
- Timer functionality

## Implementation Details
Learn how to implement these features using React hooks and custom components.
`,
    imageUrl: 'https://via.placeholder.com/800x400',
    categories: ['React', 'Gaming', 'Tutorial'],
    status: 'published',
    author: 'Dominique Hosea',
    createdAt: '2025-05-11T15:00:00.000Z',
    updatedAt: '2025-05-11T15:00:00.000Z',
    likes: 38,
    comments: [],
    featured: true
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MockBlogService = {
  // Get all articles with optional filters
  getArticles: async (filters = {}) => {
    await delay(500); // Simulate network delay
    let filteredArticles = [...mockArticles];
    
    if (filters.category) {
      filteredArticles = filteredArticles.filter(article => 
        article.categories.includes(filters.category)
      );
    }
    
    if (filters.status) {
      filteredArticles = filteredArticles.filter(article => 
        article.status === filters.status
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower)
      );
    }

    return { data: filteredArticles };
  },
  
  // Get article by ID
  getArticleById: async (id) => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    return { data: article };
  },
  
  // Create new article
  createArticle: async (articleData) => {
    await delay(500);
    const newArticle = {
      ...articleData,
      id: String(mockArticles.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    mockArticles.push(newArticle);
    return { data: newArticle };
  },
  
  // Update article
  updateArticle: async (id, articleData) => {
    await delay(500);
    const index = mockArticles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');
    
    mockArticles[index] = {
      ...mockArticles[index],
      ...articleData,
      updatedAt: new Date().toISOString()
    };
    return { data: mockArticles[index] };
  },
  
  // Delete article
  deleteArticle: async (id) => {
    await delay(300);
    const index = mockArticles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');
    mockArticles.splice(index, 1);
    return { data: { success: true } };
  },
  
  // Like article
  likeArticle: async (id, likes) => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    article.likes = likes;
    return { data: article };
  },
  
  // Update article comment
  updateComment: async (id, commentData) => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    article.comments.push(commentData);
    return { data: article };
  },
  
  // Toggle draft or archive status
  updateStatus: async (id, status) => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    article.status = status;
    return { data: article };
  },

  // Get articles by category
  getArticlesByCategory: async (category) => {
    await delay(300);
    const filtered = mockArticles.filter(article => 
      article.categories.includes(category)
    );
    return { data: filtered };
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    await delay(300);
    const featured = mockArticles.filter(article => article.featured);
    return { data: featured };
  },

  // Search articles
  searchArticles: async (query) => {
    await delay(300);
    const searchLower = query.toLowerCase();
    const results = mockArticles.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower)
    );
    return { data: results };
  }
};

export default MockBlogService;
