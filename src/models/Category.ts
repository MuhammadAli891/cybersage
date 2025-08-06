import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name.'],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a category slug.'],
    index: true,
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  color: {
    type: String,
    default: '#3B82F6',
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
}, {
  timestamps: true,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema); 