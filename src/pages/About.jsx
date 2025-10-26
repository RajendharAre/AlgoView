import { motion } from 'framer-motion'
import { Users, Target, Zap, Globe } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by developers for developers with community feedback at the core.'
    },
    {
      icon: Target,
      title: 'Precision Focused',
      description: 'Accurate visualizations that help you understand exactly how algorithms work.'
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      description: 'Fast, responsive interface that works seamlessly across all devices.'
    },
    {
      icon: Globe,
      title: 'Globally Accessible',
      description: 'Available to learners and developers worldwide, completely free.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          About Algorithm Visualizer
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          We're on a mission to make complex algorithms accessible and understandable 
          for developers, students, and educators worldwide.
        </motion.p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            At Algorithm Visualizer, we believe that understanding algorithms shouldn't be difficult. 
            Traditional learning methods often fall short when it comes to visualizing how algorithms 
            work step-by-step.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our platform bridges that gap by providing interactive, visual representations of complex 
            algorithms, making it easier for anyone to grasp fundamental concepts in computer science.
          </p>
          <p className="text-lg text-gray-600">
            Whether you're a student preparing for technical interviews, a developer looking to 
            optimize your code, or an educator seeking better teaching tools, Algorithm Visualizer 
            is designed to support your journey.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What Sets Us Apart</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">Interactive visualizations that show every step</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">Comprehensive coverage of algorithms and data structures</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">Completely free and open-source</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">Regular updates with new algorithms and features</p>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          Why Choose Algorithm Visualizer
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Team/Community Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Algorithm Visualizer is more than just a tool - it's a community of learners and educators 
          passionate about making computer science education better for everyone.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#"
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Contribute on GitHub
          </a>
          <a
            href="#"
            className="px-6 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white hover:bg-white/10 transition-all duration-300"
          >
            Join Our Discord
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default About