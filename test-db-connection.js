const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/cybersage-blog?retryWrites=true&w=majority&appName=cybersage-blog';

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

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📡 MONGODB_URI length:', MONGODB_URI.length);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully');
    
    // Test categories
    console.log('\n📂 Testing categories...');
    const categories = await Category.find({}).sort({ name: 1 });
    console.log('📂 Found categories:', categories.length);
    console.log('📂 Categories:', categories.map(c => ({ name: c.name, slug: c.slug })));
    
    // Test posts
    console.log('\n📝 Testing posts...');
    const allPosts = await Post.find({}).sort({ createdAt: -1 });
    console.log('📝 Total posts:', allPosts.length);
    
    const homepagePosts = await Post.find({ 
      published: true, 
      showOnHomepage: true 
    }).sort({ createdAt: -1 });
    console.log('🏠 Homepage posts:', homepagePosts.length);
    console.log('🏠 Homepage posts:', homepagePosts.map(p => ({ title: p.title, category: p.category })));
    
    // Test specific queries
    console.log('\n🔍 Testing specific queries...');
    
    // Query 1: Homepage posts
    const query1 = await Post.find({ 
      published: true, 
      showOnHomepage: true 
    }).limit(8).lean();
    console.log('Query 1 (Homepage posts):', query1.length);
    
    // Query 2: Categories with post count
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({ 
          category: category.name,
          published: true 
        });
        return {
          name: category.name,
          slug: category.slug,
          postCount
        };
      })
    );
    console.log('Query 2 (Categories with count):', categoriesWithCount);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDatabaseConnection(); 