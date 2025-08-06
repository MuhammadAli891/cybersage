// Configuration for environment variables
export const config = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/cybersage-blog?retryWrites=true&w=majority&appName=cybersage-blog',
  
  // Site URL
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Routes
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
};

// Helper function to get the correct site URL
export function getSiteUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
} 