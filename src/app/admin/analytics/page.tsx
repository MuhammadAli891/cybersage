'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  monthlyViews: number[];
  topPosts: Array<{
    title: string;
    views: number;
    category: string;
  }>;
  categoryStats: Array<{
    name: string;
    count: number;
    views: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    totalViews: 0,
    totalCategories: 0,
    monthlyViews: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    topPosts: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (data.posts) {
        const posts = data.posts;
        const totalViews = posts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);
        const categories = [...new Set(posts.map((post: any) => post.category))];
        
        // Calculate category stats
        const categoryStats = categories.map(category => {
          const categoryPosts = posts.filter((post: any) => post.category === category);
          const categoryViews = categoryPosts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);
          return {
            name: category as string,
            count: categoryPosts.length,
            views: categoryViews
          };
        });

        // Get top posts
        const topPosts = posts
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((post: any) => ({
            title: post.title,
            views: post.views || 0,
            category: post.category
          }));

        setAnalytics({
          totalPosts: posts.length,
          totalViews,
          totalCategories: categories.length,
          monthlyViews: [1200, 1900, 3000, 5000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], // Mock data
          topPosts,
          categoryStats
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
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
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your blog performance and insights</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalPosts}</p>
                  <p className="text-sm text-green-600 mt-1">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+25% this month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-eye text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalCategories}</p>
                  <p className="text-sm text-blue-600 mt-1">+2 new</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-folder text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Views/Post</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalPosts > 0 ? Math.round(analytics.totalViews / analytics.totalPosts) : 0}
                  </p>
                  <p className="text-sm text-green-600 mt-1">+8% this month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Posts */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Posts</h2>
                <p className="text-gray-600 text-sm mt-1">Most viewed posts this month</p>
              </div>
              
              <div className="p-6">
                {analytics.topPosts.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topPosts.map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{post.title}</h3>
                            <p className="text-xs text-gray-500">{post.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{post.views.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-chart-bar text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
                <p className="text-gray-600 text-sm mt-1">Views by category</p>
              </div>
              
              <div className="p-6">
                {analytics.categoryStats.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.categoryStats.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                            <p className="text-xs text-gray-500">{category.count} posts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{category.views.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-folder text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-500">No categories yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Views Chart */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Views Trend</h2>
            <div className="h-64 flex items-end space-x-2">
              {analytics.monthlyViews.map((views, index) => {
                const maxViews = Math.max(...analytics.monthlyViews);
                const height = maxViews > 0 ? (views / maxViews) * 100 : 0;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t" style={{ height: `${height}%` }}>
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{months[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Performance Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Post consistently to maintain engagement
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Use relevant keywords in your titles
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Include high-quality images in your posts
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Growth Opportunities</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Focus on your top-performing categories
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Optimize posts with low view counts
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Consider creating more content in popular topics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 