import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Code, Lightbulb, BookOpen, User, TrendingUp } from 'lucide-react'
import { SiThealgorithms } from 'react-icons/si'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user)
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      algorithmsMastered: 0,
      hoursPracticed: 0,
      ideasExplored: 0,
      resourcesSaved: 0
    },
    recentActivity: [],
    completedProblems: 0,
    totalProblems: 0
  });

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Calculate stats based on user data
        let completedProblems = 0;
        let hoursPracticed = 0;
        let ideasExplored = 0;
        let resourcesSaved = 0;
        
        // Count completed problems
        if (userData.completedProblems) {
          completedProblems = Object.keys(userData.completedProblems).filter(
            problemId => userData.completedProblems[problemId]
          ).length;
        }
        
        // Calculate hours practiced (placeholder - would need actual time tracking)
        // For now, we'll estimate based on number of completed problems
        hoursPracticed = Math.min(200, Math.floor(completedProblems * 0.5)); // Approximate 0.5 hours per problem
        
        // Count ideas explored (would come from a separate ideas collection)
        // For now, using a placeholder based on activity level
        ideasExplored = Math.min(50, Math.floor(completedProblems * 0.3));
        
        // Count resources saved (would come from user's saved items)
        // For now, using a placeholder based on activity
        resourcesSaved = Math.min(100, Math.floor(completedProblems * 0.7));
        
        // Update dashboard data
        setDashboardData({
          stats: {
            algorithmsMastered: completedProblems,
            hoursPracticed: hoursPracticed,
            ideasExplored: ideasExplored,
            resourcesSaved: resourcesSaved
          },
          recentActivity: [
            {
              id: 1,
              action: `Completed ${completedProblems} algorithms`,
              time: 'Just now',
              type: 'problem-completion'
            },
            // Add more activity items based on user data
            ...(userData.sessions ? Object.entries(userData.sessions).map(([problemId, session], idx) => ({
              id: idx + 2,
              action: `Started solving ${problemId.replace(/-/g, ' ')}`,
              time: new Date(session.clickedAt).toLocaleString(),
              type: 'problem-start'
            })) : [])
          ].slice(0, 4), // Limit to 4 recent activities
          completedProblems,
          totalProblems: completedProblems // Simplified for now
        });
      }
    });
    
    return () => unsubscribe();
  }, [user]);

  // // Original static data (kept for reference)
  // const stats = [
  //   { name: 'Algorithms Mastered', value: '12', icon: SiThealgorithms },
  //   { name: 'Hours Practiced', value: '24', icon: TrendingUp },
  //   { name: 'Projects Completed', value: '5', icon: Code },
  //   { name: 'Ideas Explored', value: '18', icon: Lightbulb }
  // ]

  // const recentActivity = [
  //   { id: 1, action: 'Completed Bubble Sort Visualization', time: '2 hours ago' },
  //   { id: 2, action: 'Started Merge Sort Tutorial', time: '1 day ago' },
  //   { id: 3, action: 'Saved Dijkstra Algorithm to Favorites', time: '2 days ago' },
  //   { id: 4, action: 'Posted idea: "Graph Algorithms in Game Development"', time: '3 days ago' }
  // ]

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
        {
          [
            { name: 'Algorithms Mastered', value: (dashboardData.stats.algorithmsMastered || 0).toString(), icon: SiThealgorithms },
            { name: 'Hours Practiced', value: (dashboardData.stats.hoursPracticed || 0).toString(), icon: TrendingUp },
            { name: 'Ideas Shared', value: (dashboardData.stats.ideasExplored || 0).toString(), icon: Lightbulb },
            { name: 'Resources Saved', value: (dashboardData.stats.resourcesSaved || 0).toString(), icon: BookOpen }
          ].map((stat, index) => {
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
              {dashboardData.recentActivity.map((activity) => (
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
                  <SiThealgorithms className="h-5 w-5 text-purple-600" />
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