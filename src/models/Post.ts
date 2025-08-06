import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this post.'],
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.'],
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot be more than 200 characters'],
  },
  featuredImage: {
    type: String,
    required: [true, 'Please provide a featured image.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
  },
  tags: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  showOnHomepage: {
    type: Boolean,
    default: false,
  },
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot be more than 60 characters'],
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters'],
  },
  metaKeywords: {
    type: String,
    maxlength: [200, 'Meta keywords cannot be more than 200 characters'],
  },
  canonicalUrl: {
    type: String,
  },
  noIndex: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    default: 'Admin',
  },
}, {
  timestamps: true,
});

// Add indexes for better performance
PostSchema.index({ category: 1, published: 1 });
PostSchema.index({ showOnHomepage: 1, published: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ views: -1 });

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 