'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: string;
  createdAt: string;
  views: number;
}

interface CategoryData {
  name: string;
  description: string;
  totalPosts: number;
}

interface CategoryPageClientProps {
  posts: Post[];
  categoryData: CategoryData;
  categorySlug: string;
}

// Skeleton Loading Component
const PostSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-white/20"></div>
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-16 h-3 bg-white/30 rounded"></div>
        <div className="w-12 h-3 bg-white/30 rounded"></div>
      </div>
      <div className="w-full h-6 bg-white/30 rounded mb-3"></div>
      <div className="w-3/4 h-4 bg-white/20 rounded mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="w-20 h-3 bg-white/30 rounded"></div>
        <div className="w-24 h-3 bg-white/30 rounded"></div>
      </div>
    </div>
  </div>
);

export default function CategoryPageClient({ posts, categoryData, categorySlug }: CategoryPageClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top gradient bar with social icons */}
      <div className="tech-gradient">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center space-x-3">
          <a aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a aria-label="Pinterest" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-pinterest-p"></i>
          </a>
          <a aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-youtube"></i>
          </a>
          <a aria-label="Telegram" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-telegram-plane"></i>
          </a>
        </div>
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="glass-nav sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-extrabold select-none hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 tech-gradient rounded-lg flex items-center justify-center mr-2">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <span className="text-cyan-300 text-xl font-extrabold">Cyber</span>
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent text-xl font-extrabold">Sage</span>
            </div>
          </Link>
          <ul className="hidden md:flex space-x-8 text-sm font-semibold text-white">
            <li><Link href="/category/news" className="hover:text-cyan-300 transition-colors duration-300">News</Link></li>
            <li><Link href="/category/global-tech-news" className="hover:text-cyan-300 transition-colors duration-300">Global Tech News</Link></li>
            <li><Link href="/category/internet" className="hover:text-cyan-300 transition-colors duration-300">Internet</Link></li>
            <li><Link href="/category/tech" className="hover:text-cyan-300 transition-colors duration-300">Tech</Link></li>
            <li><Link href="/category/business" className="hover:text-cyan-300 transition-colors duration-300">Business</Link></li>
            <li><Link href="/category/gaming" className="hover:text-cyan-300 transition-colors duration-300">Gaming</Link></li>
            <li><Link href="/category/social-media" className="hover:text-cyan-300 transition-colors duration-300">Social Media</Link></li>
          </ul>
        </div>
      </nav>

      {/* Category Header */}
      <section className="pt-20 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            {categoryData.name}
          </h1>
          <p className="text-cyan-100 text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
            {categoryData.description}
          </p>
          <div className="flex items-center justify-center space-x-4 text-cyan-200">
            <span className="flex items-center">
              <i className="fas fa-file-alt mr-2"></i>
              {categoryData.totalPosts} posts
            </span>
            <span className="flex items-center">
              <i className="fas fa-eye mr-2"></i>
              {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()} views
            </span>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            // Skeleton Loading
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <article key={post._id} className="glass-card overflow-hidden card-3d group cursor-pointer hover:scale-105 transition-transform duration-300">
                  <img 
                    alt={post.title} 
                    className="w-full h-48 object-cover" 
                    src={post.featuredImage || "https://picsum.photos/400/200?random=1"} 
                  />
                  <div className="p-6">
                    <div className="flex items-center text-cyan-200 text-xs mb-3 space-x-2">
                      <i className="far fa-calendar-alt"></i>
                      <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                      <span className="flex items-center">
                        <i className="fas fa-eye mr-1"></i>
                        {post.views.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-lg leading-tight mb-3 group-hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-cyan-100 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-200 text-xs">{post.author}</span>
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-folder-open text-cyan-400 text-6xl mb-6"></i>
              <h3 className="text-white text-2xl font-semibold mb-4">No posts found</h3>
              <p className="text-cyan-100 mb-6">No posts available in this category yet.</p>
              <Link 
                href="/" 
                className="tech-gradient text-white text-sm px-6 py-3 rounded-full button-hover font-semibold"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Footer with better contrast */}
      <footer className="glass-nav py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-white text-sm">
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">About Us</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Contact Us</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Tech Trends</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Cyber Security</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Windows</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Fintech</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Browsing</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Cloud Storage</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Buyer Guides</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">VPN</Link>
            <Link className="hover:text-cyan-300 transition-colors duration-300" href="#">Smartphones</Link>
          </nav>
          <p className="mb-4 text-white text-lg font-semibold">Community Forum</p>
          <p className="mb-2 text-white">All content © copyright <strong className="text-cyan-300">cybersage</strong></p>
          <p className="mb-2 text-white text-sm">
            All Rights Reserved. For more information on this site, please read our Terms of Use, Privacy Policy
          </p>
          <p className="mb-6 text-white text-sm">Do Not Sell My Personal Information</p>
          <div className="flex items-center justify-center space-x-2 text-cyan-300 font-extrabold text-xl cursor-pointer select-none">
            <div className="w-8 h-8 tech-gradient rounded-lg flex items-center justify-center mr-2">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <span className="text-xl font-extrabold">Cyber</span>
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent text-xl font-extrabold">Sage</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 