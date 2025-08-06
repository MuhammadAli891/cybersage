'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleClearCache = async () => {
    try {
      console.log('🧹 Admin clearing cache...');
      
      // Clear browser cache for homepage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('homepage-posts-cache');
        sessionStorage.removeItem('homepage-posts-cache');
        
        // Force browser to reload homepage cache
        const homepageUrl = `${window.location.origin}/api/posts/homepage`;
        await fetch(homepageUrl, { 
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
          cache: 'no-store'
        });
      }
      
      // Call server cache clear API
      const response = await fetch('/api/cache/clear', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cache cleared:', result);
        alert('Cache cleared successfully! Homepage will refresh on next visit.');
      } else {
        console.error('❌ Failed to clear cache');
        alert('Failed to clear cache');
      }
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      alert('Error clearing cache');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">CyberSage</span>
          </div>
          
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-tachometer-alt w-5"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/posts" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-file-alt w-5"></i>
              <span>Posts</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-folder w-5"></i>
              <span>Categories</span>
            </Link>
            <Link href="/admin/seo" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-search w-5"></i>
              <span>SEO Tools</span>
            </Link>
            <Link href="/admin/analytics" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-chart-bar w-5"></i>
              <span>Analytics</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <i className="fas fa-cog w-5"></i>
              <span>Settings</span>
            </Link>
          </nav>

          {/* Cache Management Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">System Tools</h3>
            <button
              onClick={handleClearCache}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <i className="fas fa-broom w-5"></i>
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@cybersage.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 