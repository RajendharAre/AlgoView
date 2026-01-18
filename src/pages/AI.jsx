import { motion } from 'framer-motion'
import { Brain, Zap, Clock, Users, TrendingUp } from 'lucide-react'

const AI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hold on, We are building this very soon you can access this
          </p>
        </motion.div>

        {/* Coming Soon Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">
              Personalized algorithm suggestions based on your learning progress and goals
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Difficulty</h3>
            <p className="text-gray-600">
              Automatically adjusts challenge level based on your performance and understanding
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Learning</h3>
            <p className="text-gray-600">
              Connect with peers and learn together through AI-facilitated group sessions
            </p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Coming Soon</h3>
              <p className="text-gray-600">We're working hard to bring you amazing AI features</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>
          
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">65%</span> complete - Stay tuned for updates!
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Want to be notified when AI features are ready?
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg">
            Notify Me
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default AI