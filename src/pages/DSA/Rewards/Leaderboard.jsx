import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, User } from 'lucide-react'

const DSARewardsLeaderboard = () => {
  const [timeRange, setTimeRange] = useState('all-time')

  // Mock leaderboard data
  const leaderboard = [
    { id: 1, name: 'Alex Johnson', points: 2450, avatar: null, rank: 1 },
    { id: 2, name: 'Sarah Chen', points: 2100, avatar: null, rank: 2 },
    { id: 3, name: 'Mike Rodriguez', points: 1850, avatar: null, rank: 3 },
    { id: 4, name: 'Emma Wilson', points: 1720, avatar: null, rank: 4 },
    { id: 5, name: 'David Kim', points: 1650, avatar: null, rank: 5 },
    { id: 6, name: 'Priya Patel', points: 1580, avatar: null, rank: 6 },
    { id: 7, name: 'James Brown', points: 1420, avatar: null, rank: 7 },
    { id: 8, name: 'Lisa Zhang', points: 1350, avatar: null, rank: 8 },
    { id: 9, name: 'Robert Davis', points: 1280, avatar: null, rank: 9 },
    { id: 10, name: 'Maria Garcia', points: 1200, avatar: null, rank: 10 },
  ]

  const getCurrentUserRank = () => {
    // Mock current user data
    return {
      name: 'You',
      points: 1150,
      rank: 12
    }
  }

  const currentUser = getCurrentUserRank()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-gray-600 mt-1">Top contributors ranked by points</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">This Week</option>
                  <option value="monthly">This Month</option>
                  <option value="all-time">All Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Current User Rank */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <span className="text-blue-600 font-bold">#{currentUser.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{currentUser.name}</h3>
                    <p className="text-sm text-gray-600">{currentUser.points} points</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    user.rank <= 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10">
                    {user.rank === 1 ? (
                      <Trophy className="text-yellow-500" size={24} />
                    ) : user.rank === 2 ? (
                      <Medal className="text-gray-400" size={24} />
                    ) : user.rank === 3 ? (
                      <Medal className="text-amber-700" size={24} />
                    ) : (
                      <span className="text-gray-500 font-medium">#{user.rank}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <User size={20} className="text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="font-bold text-gray-900">{user.points}</span>
                    <span className="text-gray-500 ml-1">points</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                10
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DSARewardsLeaderboard