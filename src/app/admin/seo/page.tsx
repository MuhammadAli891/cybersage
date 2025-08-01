'use client';

import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
  seoScore: number;
  issues: string[];
}

export default function SEOToolsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (data.posts) {
        // Calculate SEO scores for each post
        const postsWithSEO = data.posts.map((post: any) => {
          const issues = [];
          let score = 100;

          if (!post.metaDescription) {
            issues.push('Missing meta description');
            score -= 20;
          } else if (post.metaDescription.length < 50) {
            issues.push('Meta description too short');
            score -= 10;
          } else if (post.metaDescription.length > 160) {
            issues.push('Meta description too long');
            score -= 10;
          }

          if (!post.title || post.title.length < 30) {
            issues.push('Title too short');
            score -= 15;
          } else if (post.title.length > 60) {
            issues.push('Title too long');
            score -= 15;
          }

          if (!post.slug) {
            issues.push('Missing URL slug');
            score -= 10;
          }

          if (!post.featuredImage) {
            issues.push('Missing featured image');
            score -= 10;
          }

          return {
            ...post,
            seoScore: Math.max(0, score),
            issues
          };
        });

        setPosts(postsWithSEO);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">SEO Tools</h1>
            <p className="text-gray-600 mt-1">Optimize your posts for search engines</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* SEO Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average SEO Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(Math.round(posts.reduce((sum, post) => sum + post.seoScore, 0) / posts.length))}`}>
                    {posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + post.seoScore, 0) / posts.length) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Posts Need SEO</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {posts.filter(post => post.seoScore < 80).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Optimized Posts</p>
                  <p className="text-2xl font-bold text-green-600">
                    {posts.filter(post => post.seoScore >= 80).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-gray-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Posts SEO Analysis */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">SEO Analysis</h2>
              <p className="text-gray-600 text-sm mt-1">Review and optimize your posts</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getScoreBgColor(post.seoScore)} ${getScoreColor(post.seoScore)}`}>
                          {post.seoScore}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <i className="fas fa-link mr-1"></i>
                            /{post.slug}
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-eye mr-1"></i>
                            {post.metaDescription ? `${post.metaDescription.length}/160` : '0/160'} chars
                          </span>
                        </div>
                        
                        {post.issues.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-red-600 mb-2">Issues found:</p>
                            <ul className="space-y-1">
                              {post.issues.map((issue, index) => (
                                <li key={index} className="text-sm text-red-600 flex items-center">
                                  <i className="fas fa-times-circle mr-2"></i>
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Optimize post"
                      >
                        <i className="fas fa-magic"></i>
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors" title="View post">
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Tips */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Title Optimization</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Keep titles between 30-60 characters</li>
                  <li>• Include primary keywords</li>
                  <li>• Make them compelling and clickable</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Meta Descriptions</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Keep between 150-160 characters</li>
                  <li>• Include call-to-action</li>
                  <li>• Summarize the content accurately</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">URL Structure</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Use descriptive, keyword-rich slugs</li>
                  <li>• Keep URLs short and readable</li>
                  <li>• Avoid special characters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Content Quality</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Include relevant images</li>
                  <li>• Use proper heading structure</li>
                  <li>• Write for your audience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimize Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimize: {selectedPost.title}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write a compelling meta description..."
                  defaultValue={selectedPost.metaDescription}
                />
                <p className="text-xs text-gray-500 mt-1">150-160 characters recommended</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Issues to Fix
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedPost.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <i className="fas fa-magic mr-2"></i>
                Optimize Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 