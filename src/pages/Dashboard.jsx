import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Cpu, Code, Lightbulb, BookOpen, User, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user)

  const stats = [
    { name: 'Algorithms Mastered', value: '12', icon: Cpu },
    { name: 'Hours Practiced', value: '24', icon: TrendingUp },
    { name: 'Projects Completed', value: '5', icon: Code },
    { name: 'Ideas Explored', value: '18', icon: Lightbulb }
  ]

  const recentActivity = [
    { id: 1, action: 'Completed Bubble Sort Visualization', time: '2 hours ago' },
    { id: 2, action: 'Started Merge Sort Tutorial', time: '1 day ago' },
    { id: 3, action: 'Saved Dijkstra Algorithm to Favorites', time: '2 days ago' },
    { id: 4, action: 'Posted idea: "Graph Algorithms in Game Development"', time: '3 days ago' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mt-2"
        >
          Here's what's happening with your learning journey today.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Cpu className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Practice Algorithms</p>
                  <p className="text-xs text-gray-500">Visualize and master algorithms</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Explore Ideas</p>
                  <p className="text-xs text-gray-500">Discover new project ideas</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Study References</p>
                  <p className="text-xs text-gray-500">Access comprehensive materials</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Update Profile</p>
                  <p className="text-xs text-gray-500">Manage your account settings</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard