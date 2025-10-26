import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Gift, Trophy, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const DSARewards = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user data
  const userPoints = 1150
  const rank = 12

  // Mock recent activities
  const recentActivities = [
    { id: 1, action: 'Completed Two Sum problem', points: 50, date: '2023-06-15' },
    { id: 2, action: 'Submitted algorithm explanation', points: 100, date: '2023-06-14' },
    { id: 3, action: 'Participated in discussion', points: 20, date: '2023-06-13' },
    { id: 4, action: 'Solved Binary Search problem', points: 50, date: '2023-06-12' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Rewards & Recognition</h1>
            <p className="text-gray-600 mt-1">Earn points and redeem exciting rewards</p>
          </div>

          {/* Stats Overview */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Your Points</p>
                    <p className="text-2xl font-bold text-gray-900">{userPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Current Rank</p>
                    <p className="text-2xl font-bold text-gray-900">#{rank}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">+250</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
                onClick={() => setActiveTab('activities')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recent Activities
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Earn Points</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Solve Problems</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Earn 10-100 points for solving DSA problems based on difficulty
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Contribute Content</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Earn 50-200 points for submitting explanations, tutorials, or visualizations
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Participate in Discussions</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Earn 10-50 points for asking questions, answering, or contributing to discussions
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Complete Challenges</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Earn bonus points for completing weekly or monthly coding challenges
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Redeem Rewards</h2>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Gift className="text-white" size={32} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Ready to Redeem?</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          You have {userPoints} points available to exchange for exciting rewards
                        </p>
                      </div>
                      <Link
                        to="/dsa/rewards/redeem"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View Rewards
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="font-bold text-gray-900">+{activity.points}</span>
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

export default DSARewards