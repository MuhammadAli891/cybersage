'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  views: number;
  createdAt: string;
  author: string;
}

interface Category {
  _id: string;
  name: string;
  postCount: number;
}

interface Stats {
  totalPosts: number;
  totalViews: number;
  categories: number;
  thisMonth: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalViews: 0,
    categories: 0,
    thisMonth: '+0%'
  });

  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Fetch all posts for admin (including unpublished)
      const postsResponse = await fetch('/api/posts?all=true');
      const postsData = await postsResponse.json();
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      console.log('Dashboard posts data:', postsData);
      console.log('Dashboard categories data:', categoriesData);
      
      if (postsData.posts) {
        setRecentPosts(postsData.posts.slice(0, 4));
        
        // Calculate stats
        const totalViews = postsData.posts.reduce((sum: number, post: Post) => sum + (post.views || 0), 0);
        const categoriesCount = categoriesData.categories ? categoriesData.categories.length : 0;
        
        setStats({
          totalPosts: postsData.posts.length,
          totalViews,
          categories: categoriesCount,
          thisMonth: '+12%'
        });
        
        console.log(`Dashboard stats: ${postsData.posts.length} posts, ${totalViews} views, ${categoriesCount} categories`);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Database connected successfully", type: "success", time: "Just now" },
    { id: 2, action: "MongoDB Atlas setup completed", type: "info", time: "2 minutes ago" },
    { id: 3, action: "Admin panel ready for posts", type: "primary", time: "5 minutes ago" },
    { id: 4, action: "Categories system implemented", type: "success", time: "10 minutes ago" }
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to your CyberSage admin panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{stats.totalPosts}</p>
                <p className="text-sm text-green-600 mt-1">+{Math.min(stats.totalPosts, 3)} this week</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600 text-lg lg:text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+15% this month</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-eye text-green-600 text-lg lg:text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{stats.categories}</p>
                <p className="text-sm text-blue-600 mt-1">+1 new category</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-folder text-purple-600 text-lg lg:text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{stats.thisMonth}</p>
                <p className="text-sm text-green-600 mt-1">Growth rate</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-orange-600 text-lg lg:text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Posts</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your latest blog posts</p>
              </div>
              <div className="p-4 lg:p-6">
                {recentPosts.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900 line-clamp-1 text-sm lg:text-base">{post.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full mt-2 sm:mt-0 ${
                              post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-500 mb-4">No posts yet</p>
                    <Link href="/admin/posts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Create Your First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-gray-600 text-sm mt-1">Latest system updates</p>
              </div>
              <div className="p-4 lg:p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' :
                        activity.type === 'primary' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 