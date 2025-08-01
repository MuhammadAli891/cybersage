'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: string;
  createdAt: string;
  views: number;
  tags: string[];
  metaDescription: string;
  metaTitle?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  category: string;
  author: string;
  createdAt: string;
  views: number;
}

interface Props {
  post: Post;
}

export default function SinglePostPage({ post }: Props) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    // Fetch related posts from same category
    fetchRelatedPosts(post.category, post._id);
  }, [post.category, post._id]);

  const fetchRelatedPosts = async (category: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/posts?category=${encodeURIComponent(category)}&limit=8`);
      const data = await response.json();
      
      if (data.posts) {
        // Filter out current post and get up to 8 related posts
        const filtered = data.posts
          .filter((p: RelatedPost) => p._id !== excludeId)
          .slice(0, 8);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

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

      {/* Main Content - Full White Background */}
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header */}
          <article className="mb-12">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="bg-purple-600 text-white text-xs font-semibold rounded-full px-3 py-1">
                {post.category}
              </span>
            </div>

            {/* Title - Special Wider Container for Single Line */}
            <div className="max-w-6xl mx-auto mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight w-full text-center">
                {post.title}
              </h1>
            </div>

            {/* Author and Date - Simplified */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{post.author}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="blog-post-content">
              <div 
                className="text-gray-900 leading-relaxed text-lg" 
                dangerouslySetInnerHTML={{ __html: post.content }}>
              </div>
            </div>
          </article>

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2 cursor-pointer hover:text-purple-600 transition-colors">
                  {post.author}
                </h3>
                <p className="text-gray-600 text-sm mb-2">Tech Journalist</p>
                <div className="flex items-center text-gray-700 text-sm">
                  <span>in</span>
                  <i className="fab fa-linkedin text-blue-600 ml-2 text-lg"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">RELATED POSTS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost._id} href={`/posts/${relatedPost.slug}`} className="group">
                    <article className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
                      <img 
                        src={relatedPost.featuredImage || "https://picsum.photos/400/200?random=1"} 
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-1">
                        {relatedPost.category}
                      </span>
                      <div className="p-4">
                        <div className="flex items-center text-gray-600 text-xs mb-2">
                          <i className="far fa-calendar-alt mr-1"></i>
                          {new Date(relatedPost.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="text-gray-900 font-semibold text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-3">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-xs">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            <i className="fas fa-user text-gray-500 text-xs"></i>
                          </div>
                          {relatedPost.author}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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