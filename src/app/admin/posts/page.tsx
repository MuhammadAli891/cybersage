'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  showOnHomepage: boolean;
  views: number;
  createdAt: string;
  author: string;
  featuredImage: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts for admin...');
      // Fetch all posts for admin (including unpublished)
      const response = await fetch('/api/posts?all=true');
      const data = await response.json();
      
      console.log('Posts data:', data);
      
      if (data.posts) {
        setPosts(data.posts);
        console.log(`Loaded ${data.posts.length} posts`);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/post/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter(post => post._id !== postId));
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Posts</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts ({posts.length} total)</p>
            </div>
            <Link href="/admin/posts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <i className="fas fa-plus mr-2"></i>
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Posts
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by title or category..."
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <i className="fas fa-times mr-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 lg:p-6 border-b">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                All Posts ({filteredPosts.length} of {posts.length})
              </h2>
            </div>
            
            {filteredPosts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <div key={post._id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                              {post.showOnHomepage && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                  Homepage
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <i className="fas fa-tag mr-1"></i>
                                {post.category}
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-clock mr-1"></i>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-eye mr-1"></i>
                                {post.views || 0} views
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-user mr-1"></i>
                                {post.author}
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-link mr-1"></i>
                                /{post.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/edit-post/${post._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit post"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="View post"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete post"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
                <p className="text-gray-500 mb-4">
                  {posts.length === 0 ? 'No posts yet' : 'No posts match your filters'}
                </p>
                {posts.length === 0 && (
                  <Link href="/admin/posts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Create Your First Post
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 