const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/cybersage-blog?retryWrites=true&w=majority&appName=cybersage-blog';

async function resetHomepagePosts() {
  try {
    console.log('🔧 Resetting homepage posts to only 4...');
    
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
    
    // First, set all posts to not show on homepage
    await Post.updateMany(
      { published: true },
      { $set: { showOnHomepage: false } }
    );
    
    console.log('✅ Reset all posts to not show on homepage');
    
    // Now set only first 4 published posts to show on homepage
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).limit(4);
    
    for (const post of posts) {
      await Post.updateOne(
        { _id: post._id },
        { $set: { showOnHomepage: true } }
      );
      console.log(`✅ Set "${post.title}" to show on homepage`);
    }
    
    // Check final count
    const homepagePosts = await Post.countDocuments({ showOnHomepage: true, published: true });
    console.log(`📊 Total posts set to show on homepage: ${homepagePosts}`);
    
    await mongoose.disconnect();
    console.log('✅ Script completed!');
    
  } catch (error) {
    console.error('❌ Error resetting posts:', error);
  }
}

resetHomepagePosts(); 