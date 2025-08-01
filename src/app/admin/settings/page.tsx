'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'CyberSage',
    siteDescription: 'Find the Answers Just When you Think of the Questions',
    siteUrl: 'https://cybersage.com',
    adminEmail: 'admin@cybersage.com',
    postsPerPage: 10,
    enableComments: true,
    enableSocialSharing: true,
    enableNewsletter: false,
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon!'
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'fas fa-cog' },
    { id: 'content', name: 'Content', icon: 'fas fa-file-alt' },
    { id: 'social', name: 'Social', icon: 'fas fa-share-alt' },
    { id: 'advanced', name: 'Advanced', icon: 'fas fa-tools' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your blog settings</p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          id="siteName"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          id="siteUrl"
                          name="siteUrl"
                          value={settings.siteUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        id="siteDescription"
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        id="adminEmail"
                        name="adminEmail"
                        value={settings.adminEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Settings</h3>
                    
                    <div>
                      <label htmlFor="postsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                        Posts Per Page
                      </label>
                      <select
                        id="postsPerPage"
                        name="postsPerPage"
                        value={settings.postsPerPage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={5}>5 posts</option>
                        <option value={10}>10 posts</option>
                        <option value={15}>15 posts</option>
                        <option value={20}>20 posts</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableComments"
                          name="enableComments"
                          checked={settings.enableComments}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enableComments" className="ml-2 block text-sm text-gray-900">
                          Enable comments on posts
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableNewsletter"
                          name="enableNewsletter"
                          checked={settings.enableNewsletter}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enableNewsletter" className="ml-2 block text-sm text-gray-900">
                          Enable newsletter subscription
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Settings</h3>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableSocialSharing"
                        name="enableSocialSharing"
                        checked={settings.enableSocialSharing}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableSocialSharing" className="ml-2 block text-sm text-gray-900">
                        Enable social sharing buttons
                      </label>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Social Media Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://facebook.com/cybersage"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://twitter.com/cybersage"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://instagram.com/cybersage"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/company/cybersage"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                        Enable maintenance mode
                      </label>
                    </div>

                    {settings.maintenanceMode && (
                      <div>
                        <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-2">
                          Maintenance Message
                        </label>
                        <textarea
                          id="maintenanceMessage"
                          name="maintenanceMessage"
                          value={settings.maintenanceMessage}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter maintenance message..."
                        />
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <i className="fas fa-exclamation-triangle text-yellow-400 mr-3 mt-1"></i>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Maintenance mode will make your site inaccessible to visitors. Only enable this when performing updates.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Database Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Connection:</strong> MongoDB Atlas</p>
                        <p><strong>Status:</strong> Connected</p>
                        <p><strong>Posts:</strong> {settings.postsPerPage} per page</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-8">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <i className={`fas fa-save mr-2 ${saving ? 'animate-spin' : ''}`}></i>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 