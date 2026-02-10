import { motion } from 'framer-motion'
import { Code, BookOpen, Video, FileText, Users, MessageSquare } from 'lucide-react'

// Semantic color tokens from grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
    surface: '#ffffff',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6c757d',
    muted: '#adb5bd',
  },
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
  },
  accent: {
    warning: '#f59e0b',
  }
}

// Subtle shadow system for depth
const SHADOWS = {
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
}

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
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: COLORS.text.primary }}
        >
          Development Resources
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl max-w-3xl mx-auto"
          style={{ color: COLORS.text.secondary }}
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
              className="rounded-xl p-6 border transition-all duration-300"
              style={{
                backgroundColor: COLORS.bg.surface,
                borderColor: COLORS.border.light,
                boxShadow: SHADOWS.md
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.lg}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.md}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.bg.secondary }}>
                <Icon className="h-6 w-6" style={{ color: COLORS.text.primary }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text.primary }}>{resource.title}</h3>
              <p className="mb-4" style={{ color: COLORS.text.secondary }}>{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: COLORS.text.tertiary }}>{resource.count}</span>
                <button className="font-medium transition-colors" style={{ color: COLORS.text.primary }}>
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
        className="mt-16 rounded-2xl p-8 text-center"
        style={{
          backgroundColor: COLORS.text.primary,
          color: COLORS.bg.surface
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.bg.surface }}>Want to Contribute?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: COLORS.bg.secondary }}>
          Share your knowledge and help grow our development community by contributing tutorials, 
          code examples, or documentation.
        </p>
        <button className="px-8 py-3 font-bold rounded-lg transition-all duration-300" 
          style={{
            backgroundColor: COLORS.bg.surface,
            color: COLORS.text.primary,
            boxShadow: SHADOWS.lg
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.lg}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.md}
          href="https://github.com/RajendharAre/AlgoView"
        >
          Become a Contributor
        </button>
      </motion.div>
    </div>
  )
}

export default Development