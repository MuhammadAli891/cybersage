'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TiptapEditor from '@/components/TiptapEditor';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  showOnHomepage: boolean;
  metaDescription: string;
  featuredImage: string;
  author: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const editorRef = useRef<{ getCurrentContent: () => string }>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
    published: false,
    showOnHomepage: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    noIndex: false,
    featuredImage: '',
    author: ''
  });

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/post/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        setFormData({
          title: data.post.title,
          slug: data.post.slug,
          content: data.post.content,
          category: data.post.category,
          published: data.post.published,
          showOnHomepage: data.post.showOnHomepage,
          metaTitle: data.post.metaTitle || '',
          metaDescription: data.post.metaDescription,
          metaKeywords: data.post.metaKeywords || '',
          canonicalUrl: data.post.canonicalUrl || '',
          noIndex: data.post.noIndex || false,
          featuredImage: data.post.featuredImage,
          author: data.post.author
        });
      } else {
        alert('Failed to fetch post');
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to fetch post');
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const content = editorRef.current?.getCurrentContent() || formData.content;
      
      const response = await fetch(`/api/post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content,
        }),
      });

      if (response.ok) {
        // Clear cache after successful update
        try {
          await fetch('/api/cache/clear', { method: 'POST' });
          console.log('✅ Cache cleared after post update');
        } catch (cacheError) {
          console.error('❌ Error clearing cache:', cacheError);
        }
        
        alert('Post updated successfully!');
        router.push('/admin/posts');
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Post not found</p>
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
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-gray-600 mt-1">Update your blog post</p>
            </div>
            <button
              onClick={() => router.push('/admin/posts')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Posts
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
              {/* Main Content */}
              <div className="lg:col-span-3 p-6 lg:p-8 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Post Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                    <div className="text-sm text-gray-500">
                      Write your post content here...
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <TiptapEditor
                      ref={editorRef}
                      content={formData.content}
                    />
                  </div>
                </div>

                                 {/* SEO & Media */}
                 <div className="bg-white rounded-lg p-4 shadow-sm border">
                   <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO & Media</h2>
                   
                   <div className="space-y-4">
                     <div>
                       <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                         Meta Title
                       </label>
                       <input
                         type="text"
                         id="metaTitle"
                         name="metaTitle"
                         value={formData.metaTitle}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="SEO title for search engines..."
                         maxLength={60}
                       />
                       <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                     </div>
                     
                     <div>
                       <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                         Meta Description
                       </label>
                       <textarea
                         id="metaDescription"
                         name="metaDescription"
                         value={formData.metaDescription}
                         onChange={handleInputChange}
                         rows={3}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Brief description for search engines..."
                         maxLength={160}
                       />
                       <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                     </div>
                     
                     <div>
                       <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                         Meta Keywords
                       </label>
                       <input
                         type="text"
                         id="metaKeywords"
                         name="metaKeywords"
                         value={formData.metaKeywords}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="keyword1, keyword2, keyword3"
                       />
                       <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                     </div>
                     
                     <div>
                       <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                         Canonical URL
                       </label>
                       <input
                         type="url"
                         id="canonicalUrl"
                         name="canonicalUrl"
                         value={formData.canonicalUrl}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="https://example.com/post-url"
                       />
                       <p className="text-xs text-gray-500 mt-1">Leave empty to use default URL</p>
                     </div>
                     
                     <div className="flex items-center">
                       <input
                         type="checkbox"
                         id="noIndex"
                         name="noIndex"
                         checked={formData.noIndex}
                         onChange={handleInputChange}
                         className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                       />
                       <label htmlFor="noIndex" className="ml-2 block text-sm text-gray-900">
                         No Index (Hide from search engines)
                       </label>
                     </div>
                     
                     <div>
                       <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                         Featured Image URL
                       </label>
                       <input
                         type="url"
                         id="featuredImage"
                         name="featuredImage"
                         value={formData.featuredImage}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="https://res.cloudinary.com/..."
                       />
                     </div>
                   </div>
                 </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1 bg-gray-50 p-6 lg:p-8 border-l border-gray-200">
                {/* Publish Settings */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        Publish immediately
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showOnHomepage"
                        name="showOnHomepage"
                        checked={formData.showOnHomepage}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showOnHomepage" className="ml-2 block text-sm text-gray-900">
                        Show on Homepage Blog Section
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 bg-gray-50 p-4 rounded-b-lg border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 