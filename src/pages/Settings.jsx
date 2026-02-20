import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('notifications')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success', 'error', or null
  const [formData, setFormData] = useState({
    notifications: {
      email: true,
      ideas: true,
      discussions: true,
      achievements: true
    },
    security: {
      twoFactor: false
    },
    language: 'en',
    privacy: {
      profilePublic: true,
      showActivity: true
    }
  })

  // Load user settings from Firebase
  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid))
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.settings) {
          setFormData(prev => ({ ...prev, ...data.settings }))
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSaveStatus(null)

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        settings: formData,
        updatedAt: new Date()
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const keys = name.split('.')
    
    if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and preferences</p>
        </motion.div>

        {/* Settings Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-0">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <nav className="flex md:flex-col p-4 md:p-0">
                {[
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Lock },
                  { id: 'privacy', label: 'Privacy', icon: MdOutlinePrivacyTip },
                  { id: 'language', label: 'Language', icon: Globe }
                ].map((tab) => {
                  const Icon = typeof tab.icon === 'string' ? null : tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 md:py-4 text-sm font-medium rounded-lg md:rounded-none md:border-l-4 transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 md:border-blue-500 md:bg-transparent'
                          : 'text-gray-700 hover:bg-gray-100 md:border-transparent'
                      }`}
                    >
                      {Icon ? (
                        <Icon size={18} />
                      ) : (
                        <span className="text-lg">{tab.icon}</span>
                      )}
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-8">
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                      <p className="text-sm text-gray-600 mb-6">Choose which notifications you'd like to receive</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: 'email',
                          label: 'Email Notifications',
                          description: 'Get notified via email about important updates'
                        },
                        {
                          id: 'ideas',
                          label: 'Ideas & Discussions',
                          description: 'Receive updates when someone replies to your ideas'
                        },
                        {
                          id: 'discussions',
                          label: 'Discussion Forums',
                          description: 'Get notified about discussion thread activity'
                        },
                        {
                          id: 'achievements',
                          label: 'Achievements',
                          description: 'Celebrate milestones and achievements'
                        }
                      ].map((notif) => (
                        <div
                          key={notif.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{notif.label}</h3>
                            <p className="text-xs text-gray-600 mt-1">{notif.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name={`notifications.${notif.id}`}
                              checked={formData.notifications[notif.id]}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                      <p className="text-sm text-gray-600 mb-6">Keep your account secure</p>
                    </div>

                    <div className="space-y-4">
                      {/* Change Password */}
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-xs text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="security.twoFactor"
                            checked={formData.security.twoFactor}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
                      <p className="text-sm text-gray-600 mb-6">Control who can see your information</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Public Profile</h3>
                          <p className="text-xs text-gray-600 mt-1">Allow others to view your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.profilePublic"
                            checked={formData.privacy.profilePublic}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Show Activity</h3>
                          <p className="text-xs text-gray-600 mt-1">Display your recent learning activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.showActivity"
                            checked={formData.privacy.showActivity}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Danger Zone */}
                      <div className="mt-8 p-4 border border-red-200 bg-red-50 rounded-xl">
                        <h3 className="text-sm font-semibold text-red-900 mb-3">Danger Zone</h3>
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete Account
                        </button>
                        <p className="text-xs text-red-700 mt-2">This action cannot be undone</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Language Tab */}
                {activeTab === 'language' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Language</h2>
                      <p className="text-sm text-gray-600 mb-6">Choose your preferred language</p>
                    </div>

                    <div>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="fr">Français (French)</option>
                        <option value="de">Deutsch (German)</option>
                        <option value="zh">中文 (Chinese)</option>
                        <option value="ja">日本語 (Japanese)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Save Status */}
                {saveStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-4 rounded-lg ${
                      saveStatus === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {saveStatus === 'success' ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span className="text-sm font-medium">
                      {saveStatus === 'success'
                        ? 'Settings saved successfully!'
                        : 'Error saving settings. Please try again.'}
                    </span>
                  </motion.div>
                )}

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings