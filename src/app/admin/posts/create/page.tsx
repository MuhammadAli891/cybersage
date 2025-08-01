'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for heavy components
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  loading: () => <div className="w-full h-64 bg-gray-700 animate-pulse rounded-lg"></div>,
  ssr: false
});

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export default function CreatePost() {
  const router = useRouter();
  const editorRef = useRef<{ getCurrentContent: () => string }>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    noIndex: false,
    published: false,
    showOnHomepage: false
  });

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
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current content from editor manually
      const currentContent = editorRef.current?.getCurrentContent() || formData.content;
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: currentContent,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author: 'Admin'
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600 mt-1">Add a new blog post to your CyberSage blog</p>
            </div>
            <Link href="/admin" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

             <div className="p-4 lg:p-6">
         <div className="max-w-7xl mx-auto">
           <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
               {/* Main Content */}
               <div className="lg:col-span-3 p-6 lg:p-8">
                {/* Title */}
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
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                {/* Slug */}
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
                    placeholder="post-url-slug"
                    required
                  />
                </div>

                                 {/* Content */}
                 <div className="mt-8">
                   <div className="flex items-center justify-between mb-4">
                     <label className="block text-lg font-semibold text-gray-900">
                       Content *
                     </label>
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

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the post..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/200 characters</p>
                </div>
              </div>

                             {/* Sidebar */}
               <div className="lg:col-span-1 bg-gray-50 p-6 lg:p-8 border-l border-gray-200">
                                 {/* Publish Settings */}
                 <div className="bg-white rounded-lg p-4 shadow-sm border">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
                  
                  <div className="space-y-4">
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
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

                                                  {/* SEO Settings */}
                 <div className="bg-white rounded-lg p-4 shadow-sm border mt-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                   
                   <div className="space-y-4">
                     <div>
                       <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                         Meta Title
                       </label>
                       <input
                         type="text"
                         id="metaTitle"
                         name="metaTitle"
                         value={formData.metaTitle || ''}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="SEO title for search engines..."
                         maxLength={60}
                       />
                       <p className="text-xs text-gray-500 mt-1">{(formData.metaTitle || '').length}/60 characters</p>
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
                         placeholder="SEO description for search engines..."
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
                         value={formData.metaKeywords || ''}
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
                         value={formData.canonicalUrl || ''}
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
                         checked={formData.noIndex || false}
                         onChange={handleInputChange}
                         className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                       />
                       <label htmlFor="noIndex" className="ml-2 block text-sm text-gray-900">
                         No Index (Hide from search engines)
                       </label>
                     </div>
                   </div>
                 </div>

                                 {/* Featured Image */}
                 <div className="bg-white rounded-lg p-4 shadow-sm border mt-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                  
                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste Cloudinary URL here</p>
                  </div>

                  {formData.featuredImage && (
                    <div className="mt-4">
                      <img
                        src={formData.featuredImage}
                        alt="Featured image preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

                         {/* Submit Buttons */}
             <div className="flex items-center justify-between pt-6 border-t mt-8 bg-gray-50 p-4 rounded-b-lg">
               <Link href="/admin" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
                 Cancel
               </Link>
               <div className="flex space-x-3">
                 <button
                   type="button"
                   onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
                   disabled={loading}
                 >
                   Save as Draft
                 </button>
                 <button
                   type="submit"
                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                   disabled={loading}
                 >
                   {loading ? (
                     <>
                       <i className="fas fa-spinner fa-spin mr-2"></i>
                       Creating...
                     </>
                   ) : (
                     <>
                       <i className="fas fa-paper-plane mr-2"></i>
                       {formData.published ? 'Publish Post' : 'Create Post'}
                     </>
                   )}
                 </button>
               </div>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
} 