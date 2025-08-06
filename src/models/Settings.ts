import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'CyberSage',
  },
  siteDescription: {
    type: String,
    default: 'Find the Answers Just When you Think of the Questions',
  },
  siteUrl: {
    type: String,
    default: 'https://cybersage.com',
  },
  adminEmail: {
    type: String,
    default: 'admin@cybersage.com',
  },
  postsPerPage: {
    type: Number,
    default: 10,
  },
  enableComments: {
    type: Boolean,
    default: true,
  },
  enableSocialSharing: {
    type: Boolean,
    default: true,
  },
  enableNewsletter: {
    type: Boolean,
    default: false,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently performing maintenance. Please check back soon!',
  },
  // SEO Settings
  defaultMetaTitle: {
    type: String,
    default: 'CyberSage - Tech Blog',
  },
  defaultMetaDescription: {
    type: String,
    default: 'Latest technology insights and tutorials',
  },
  // Social Media
  facebookUrl: {
    type: String,
    default: '',
  },
  twitterUrl: {
    type: String,
    default: '',
  },
  instagramUrl: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema); 