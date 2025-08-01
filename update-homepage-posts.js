const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/cybersage-blog?retryWrites=true&w=majority&appName=cybersage-blog';

async function updateHomepagePosts() {
  try {
    console.log('🔧 Updating posts to show on homepage...');
    
    await mongoose.connect(MONGODB_URI);
    
    // Get the Post model
    const Post = mongoose.model('Post', new mongoose.Schema({
      title: String,
      slug: String,
      content: String,
      excerpt: String,
      featuredImage: String,
      category: String,
      tags: [String],
      featured: Boolean,
      published: Boolean,
      showOnHomepage: Boolean,
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String,
      canonicalUrl: String,
      noIndex: Boolean,
      views: Number,
      author: String
    }, { timestamps: true }));
    
    // Update first 8 published posts to show on homepage
    const result = await Post.updateMany(
      { published: true },
      { $set: { showOnHomepage: true } },
      { limit: 8 }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} posts to show on homepage`);
    
    // Check how many posts now have showOnHomepage: true
    const homepagePosts = await Post.countDocuments({ showOnHomepage: true, published: true });
    console.log(`📊 Total posts set to show on homepage: ${homepagePosts}`);
    
    await mongoose.disconnect();
    console.log('✅ Script completed!');
    
  } catch (error) {
    console.error('❌ Error updating posts:', error);
  }
}

updateHomepagePosts(); 