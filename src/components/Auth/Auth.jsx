import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import { motion } from 'framer-motion'
import { Brain, Zap, BarChart3 } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Algorithm Visualizer
            </h1>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight tracking-tight">
            Understand Algorithms
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 leading-tight tracking-tight">
              Through Visualization
            </span>
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Interactive visualizations to help you understand how algorithms work step by step.
            Learn faster with our intuitive interface.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl min-h-[80px]">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">200+ Algorithms</p>
                <p className="text-xs text-gray-600">Comprehensive library</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl min-h-[80px]">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Interactive</p>
                <p className="text-xs text-gray-600">Step-by-step control</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl min-h-[80px]">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Track Progress</p>
                <p className="text-xs text-gray-600">Save your learning</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="w-full max-w-md flex-shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 relative ${
                  isLogin ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
                {isLogin && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="tabIndicator"
                  />
                )}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 relative ${
                  !isLogin ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
                {!isLogin && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="tabIndicator"
                  />
                )}
              </button>
            </div>

            {/* Auth Form Container - Single container for both forms */}
            <div className="p-6 md:p-8">
              <div className="w-full">
                {/* Login Form */}
                <motion.div
                  key="login"
                  initial={false}
                  animate={{
                    opacity: isLogin ? 1 : 0,
                    zIndex: isLogin ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-full ${isLogin ? 'block' : 'hidden'}`}
                >
                  <Login onSwitchToRegister={() => setIsLogin(false)} />
                </motion.div>

                {/* Register Form */}
                <motion.div
                  key="register"
                  initial={false}
                  animate={{
                    opacity: !isLogin ? 1 : 0,
                    zIndex: !isLogin ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-full ${!isLogin ? 'block' : 'hidden'}`}
                >
                  <Register onSwitchToLogin={() => setIsLogin(true)} />
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
