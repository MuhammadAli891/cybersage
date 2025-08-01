const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/?retryWrites=true&w=majority&appName=cybersage-blog';

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, index: true },
  description: { type: String, maxlength: 200 },
  color: { type: String, default: '#3B82F6' },
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  metaKeywords: { type: String, maxlength: 200 },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
}, { timestamps: true });

// Post Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  category: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Boolean, default: false },
  showOnHomepage: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  metaKeywords: { type: String, maxlength: 200 },
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function addTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Add test categories
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and insights',
        color: '#3B82F6'
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and tips',
        color: '#10B981'
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development guides and tutorials',
        color: '#F59E0B'
      },
      {
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'Artificial Intelligence and Machine Learning',
        color: '#8B5CF6'
      }
    ];

    await Category.insertMany(categories);
    console.log('Added categories:', categories.map(c => c.name));

    // Add test posts
    const posts = [
      {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        excerpt: 'Learn how to build modern web applications with Next.js',
        content: 'Next.js is a powerful React framework that makes building full-stack web applications simple and efficient...',
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        category: 'Web Development',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'Introduction to MongoDB',
        slug: 'introduction-to-mongodb',
        excerpt: 'Understanding NoSQL databases with MongoDB',
        content: 'MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents...',
        featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        category: 'Technology',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'React Hooks Explained',
        slug: 'react-hooks-explained',
        excerpt: 'Master React Hooks for better component development',
        content: 'React Hooks are functions that allow you to use state and other React features in functional components...',
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        category: 'Programming',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'Machine Learning Basics',
        slug: 'machine-learning-basics',
        excerpt: 'Start your journey into machine learning',
        content: 'Machine learning is a subset of artificial intelligence that enables computers to learn without being explicitly programmed...',
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        category: 'AI & Machine Learning',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        excerpt: 'Write better code with TypeScript',
        content: 'TypeScript adds static typing to JavaScript, making your code more reliable and maintainable...',
        featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        category: 'Programming',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'Deploying to Vercel',
        slug: 'deploying-to-vercel',
        excerpt: 'How to deploy your Next.js app to Vercel',
        content: 'Vercel is a cloud platform for static sites and serverless functions that fits perfectly with Next.js...',
        featuredImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        category: 'Web Development',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'API Development with Node.js',
        slug: 'api-development-with-nodejs',
        excerpt: 'Build robust APIs with Node.js and Express',
        content: 'Node.js is a powerful runtime for building scalable network applications...',
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        category: 'Programming',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      },
      {
        title: 'CSS Grid Layout',
        slug: 'css-grid-layout',
        excerpt: 'Master CSS Grid for modern layouts',
        content: 'CSS Grid is a powerful layout system that allows you to create complex web layouts with ease...',
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: 'Web Development',
        author: 'CyberSage Team',
        published: true,
        showOnHomepage: true
      }
    ];

    await Post.insertMany(posts);
    console.log('Added posts:', posts.map(p => p.title));

    console.log('✅ Test data added successfully!');
    console.log('📊 Categories:', categories.length);
    console.log('📝 Posts:', posts.length);
    console.log('🏠 Homepage posts:', posts.filter(p => p.showOnHomepage).length);

  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestData(); 