import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Calendar, MapPin, Link as LinkIcon, Mail, Trophy, TrendingUp } from 'lucide-react'

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user data
  const mockUser = {
    id: userId || '12345',
    name: userId ? `User ${userId}` : 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joinDate: '2023-01-15',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    bio: 'Passionate about algorithms and data structures. Love to help others learn through visualization.',
    stats: {
      points: 2450,
      rank: 12,
      contributions: 42,
      discussions: 18
    },
    achievements: [
      { id: 1, name: 'First Problem Solved', date: '2023-01-20' },
      { id: 2, name: '50 Points Earned', date: '2023-02-15' },
      { id: 3, name: 'Top Contributor', date: '2023-03-10' }
    ]
  }

  useEffect(() => {
    // Simulate fetching user data
    setUser(mockUser)
  }, [userId])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={32} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-blue-200" />
                    <span className="text-sm text-blue-100">{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-blue-200" />
                    <span className="text-sm text-blue-100">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700">{user.bio}</p>
              {user.website && (
                <div className="flex items-center gap-2 mt-3">
                  <LinkIcon size={16} className="text-gray-500" />
                  <a href={user.website} className="text-blue-600 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Trophy className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-blue-700">Points</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.points}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-purple-700">Rank</p>
                    <p className="text-xl font-bold text-gray-900">#{user.stats.rank}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Mail className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-green-700">Contributions</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.contributions}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <User className="text-yellow-600" size={20} />
                  <div>
                    <p className="text-sm text-yellow-700">Discussions</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.discussions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Achievements
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Trophy className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Completed Dynamic Programming Challenge</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Submitted Graph Algorithms Tutorial</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Started Discussion on Binary Trees</p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Trophy className="text-yellow-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                          <p className="text-sm text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile