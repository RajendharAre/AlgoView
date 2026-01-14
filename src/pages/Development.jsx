import { motion } from 'framer-motion'
import { Code, BookOpen, Video, FileText, Users, MessageSquare } from 'lucide-react'

const Development = () => {
  const resources = [
    {
      title: 'Tutorials',
      description: 'Step-by-step guides for various programming concepts and technologies.',
      icon: BookOpen,
      count: '24 tutorials'
    },
    {
      title: 'Code Examples',
      description: 'Practical code snippets and examples for common development tasks.',
      icon: Code,
      count: '156 examples'
    },
    {
      title: 'Video Courses',
      description: 'Comprehensive video courses on modern development practices.',
      icon: Video,
      count: '12 courses'
    },
    {
      title: 'Documentation',
      description: 'Detailed documentation for libraries, frameworks, and tools.',
      icon: FileText,
      count: '48 docs'
    },
    {
      title: 'Community',
      description: 'Connect with other developers and share knowledge.',
      icon: Users,
      count: '2.4k members'
    },
    {
      title: 'Q&A Forum',
      description: 'Ask questions and get answers from experienced developers.',
      icon: MessageSquare,
      count: '1.1k questions'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Development Resources
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Access comprehensive tutorials, code examples, and learning materials to enhance your 
          development skills across multiple technologies and frameworks.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => {
          const Icon = resource.icon
          return (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{resource.count}</span>
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Explore
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Want to Contribute?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Share your knowledge and help grow our development community by contributing tutorials, 
          code examples, or documentation.
        </p>
        <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg" href="https://github.com/RajendharAre/AlgoView">
          Become a Contributor
        </button>
      </motion.div>
    </div>
  )
}

export default Development