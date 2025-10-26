import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Bell, Lock, Palette, Globe, Save, X } from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    notifications: {
      email: true,
      push: false,
      newsletter: true
    },
    theme: 'light',
    language: 'en'
  })

  const handleSave = (e) => {
    e.preventDefault()
    // Handle save logic here
    console.log('Saving settings:', formData)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="border-b md:border-b-0 md:border-r border-gray-200 md:w-64 flex-shrink-0">
              <nav className="flex md:flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium ${
                    activeTab === 'notifications'
                      ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell size={16} />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium ${
                    activeTab === 'security'
                      ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock size={16} />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium ${
                    activeTab === 'appearance'
                      ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Palette size={16} />
                  Appearance
                </button>
                <button
                  onClick={() => setActiveTab('language')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium ${
                    activeTab === 'language'
                      ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Globe size={16} />
                  Language
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <form onSubmit={handleSave}>
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.email"
                            checked={formData.notifications.email}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.push"
                            checked={formData.notifications.push}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                          <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.newsletter"
                            checked={formData.notifications.newsletter}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'language' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Language</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} className="inline mr-1" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={16} className="inline mr-1" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings