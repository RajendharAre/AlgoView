import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  Zap,
  Code,
  Lightbulb,
  BookOpen,
  Brain,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

const EnhancedHome = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      avatar: '👩‍🎓',
      content: 'This platform transformed how I understand algorithms. The visualizations make complex concepts clear!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: '👨‍💻',
      content: 'The interactive learning helped me ace my technical interviews. Highly recommended!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'CS Professor',
      avatar: '👩‍🏫',
      content: "I recommend this to all my students. It's the best tool for teaching algorithms!",
      rating: 5,
    },
  ]

  const stats = [
    { id: 1, value: '200+', label: 'Algorithms', icon: Code },
    { id: 2, value: '50K+', label: 'Users', icon: Users },
    { id: 3, value: '1M+', label: 'Visualizations', icon: TrendingUp },
  ]

  const features = [
    {
      title: 'Interactive Visualizations',
      description: 'Watch algorithms come alive with real-time step-by-step animations',
      icon: '🎨',
      delay: 0,
    },
    {
      title: 'Complete Learning Path',
      description: 'From basics to advanced: sorting, searching, graphs, and dynamic programming',
      icon: '📚',
      delay: 0.1,
    },
    {
      title: 'Practice Problems',
      description: 'Solve real coding problems and track your progress',
      icon: '⚙️',
      delay: 0.2,
    },
    {
      title: 'Community Discussions',
      description: 'Learn from others and share your insights with the community',
      icon: '💬',
      delay: 0.3,
    },
    {
      title: 'Time & Space Analysis',
      description: 'Understand algorithm complexity with visual explanations',
      icon: '📊',
      delay: 0.4,
    },
    {
      title: 'Mobile Friendly',
      description: 'Learn algorithms anywhere, anytime on any device',
      icon: '📱',
      delay: 0.5,
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Intersection Observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true)
      }
    })

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                  <Sparkles size={16} />
                  Welcome to Algorithm Visualizer
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
              >
                Master Algorithms With Interactive Visualizations
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Learn data structures and algorithms through beautiful step-by-step animations. Perfect for students, educators, and developers.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 pt-4"
              >
                <Link to="/dsa">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play size={20} />
                    Start Learning
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Learn More
                    <ChevronRight size={20} />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right side - Illustration/Feature showcase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative w-full max-w-md h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl border border-blue-200 dark:border-blue-900/50 p-8 backdrop-blur">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                <div className="relative h-full flex flex-col items-center justify-center space-y-4">
                  <div className="text-6xl">🎨</div>
                  <p className="text-center font-bold text-gray-700 dark:text-gray-300">Interactive Visualizations</p>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">Watch algorithms execute step by step</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600"
              >
                <div className="text-4xl mb-2">{stat.icon && <stat.icon size={40} className="mx-auto text-blue-600 dark:text-blue-400 mb-2" />}</div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Effective Learning
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to master algorithms</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Loved by Learners & Educators
          </motion.h2>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
              "{testimonials[currentTestimonial].content}"
            </p>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</p>
                <p className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </motion.div>

          {/* Testimonial indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Master Algorithms?</h2>
            <p className="text-lg mb-8 opacity-90">Join thousands of students and professionals learning algorithms the right way.</p>
            <Link to="/dsa">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Get Started Free
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EnhancedHome
