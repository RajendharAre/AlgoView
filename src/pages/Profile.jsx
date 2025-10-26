import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, MapPin, Link as LinkIcon, Edit3, Camera, Save, X } from 'lucide-react'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    location: '',
    website: '',
    bio: ''
  })

  const handleSave = () => {
    // In a real app, this would save to a database
    setIsEditing(false)
    console.log('Profile updated:', profileData)
  }

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={profileData.name} 
                  className="h-32 w-32 rounded-full border-4 border-white"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-4 border-white flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                  <Camera size={16} className="text-gray-700" />
                </button>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Edit3 size={16} className="mr-1" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 rounded px-2 py-1 w-full md:w-auto"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name || 'User'}</h1>
              )}
              <div className="flex items-center text-gray-600 mt-1">
                <Mail size={16} className="mr-2" />
                <span>{profileData.email}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Joined {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700">
                  {profileData.bio || 'No bio available. Add a bio to tell others about yourself.'}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="bg-gray-50 rounded px-2 py-1 flex-1"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {profileData.location || 'No location specified'}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <LinkIcon size={18} className="text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="bg-gray-50 rounded px-2 py-1 flex-1"
                      placeholder="Website URL"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {profileData.website ? (
                        <a href={profileData.website} className="text-blue-600 hover:underline">
                          {profileData.website}
                        </a>
                      ) : (
                        'No website specified'
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Algorithms Mastered</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Hours Practiced</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Ideas Shared</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">42</div>
                <div className="text-sm text-gray-600">Resources Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile