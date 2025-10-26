import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, Code, Lightbulb, BookOpen } from 'lucide-react'

const Home = () => {
  const features = [
    {
      title: 'Algorithm Visualization',
      description: 'Visualize complex algorithms step-by-step to understand how they work.',
      icon: Cpu,
      link: '/dsa'
    },
    {
      title: 'Development Resources',
      description: 'Access tutorials, code examples, and best practices for software development.',
      icon: Code,
      link: '/development'
    },
    {
      title: 'Ideas & Projects',
      description: 'Explore innovative ideas and projects to inspire your next creation.',
      icon: Lightbulb,
      link: '/ideas'
    },
    {
      title: 'References',
      description: 'Comprehensive reference materials for algorithms, data structures, and more.',
      icon: BookOpen,
      link: '/references'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Algorithm <span className="text-blue-600">Visualizer</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
        >
          Master complex algorithms through interactive visualizations, explore development resources, 
          and bring your ideas to life with our comprehensive platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/dsa"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Visualizing
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center"
                >
                  Explore
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of developers and students mastering algorithms through visualization.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}

export default Home