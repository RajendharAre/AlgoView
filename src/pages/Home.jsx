import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  Cpu, 
  Code, 
  Lightbulb, 
  BookOpen, 
  Brain, 
  Users, 
  ChevronRight, 
  Star,
  Linkedin,
  Github,
  Twitter,
  Play,
  Pause,
  ArrowRight
} from 'lucide-react'

const Home = () => {
  // State for testimonials carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  
  // Intersection Observer for stats animation
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'This platform transformed how I understand algorithms. The visualizations make complex concepts easy to grasp!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'The mock interview feature helped me land my dream job. The AI feedback is incredibly detailed and helpful.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'CS Professor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'I recommend this to all my students. It\'s the best tool for teaching algorithms I\'ve ever used.',
      rating: 5
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Self-taught Developer',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'As someone without a CS background, this platform made learning algorithms accessible and fun.',
      rating: 5
    }
  ]

  // Stats data
  const stats = [
    { id: 1, value: 200, label: 'Algorithms', suffix: '+' },
    { id: 2, value: 10, label: 'Users', suffix: 'K+' },
    { id: 3, value: 50, label: 'Visualizations', suffix: 'K+' }
  ]

  // Features data
  const features = [
    {
      title: '200+ Algorithm Visualizations',
      description: 'Interactive visualizations for sorting, searching, graph algorithms, and more.',
      icon: Cpu,
      link: '/dsa'
    },
    {
      title: 'AI-Powered Mock Interviews',
      description: 'Practice coding interviews with intelligent AI feedback and performance analysis.',
      icon: Brain,
      link: '/interview'
    },
    {
      title: 'Collaborative Learning',
      description: 'Share ideas, collaborate on projects, and learn from the community.',
      icon: Users,
      link: '/ideas'
    },
    {
      title: 'Development Resources',
      description: 'Comprehensive tutorials, code examples, and best practices for developers.',
      icon: BookOpen,
      link: '/development'
    }
  ]

  // How it works steps
  const steps = [
    {
      id: 1,
      title: 'Choose Algorithm',
      description: 'Select from 200+ algorithms across various categories like sorting, searching, and graph theory.'
    },
    {
      id: 2,
      title: 'Visualize Execution',
      description: 'Watch step-by-step execution with interactive controls to pause, rewind, and explore.'
    },
    {
      id: 3,
      title: 'Master the Concept',
      description: 'Practice with quizzes, challenges, and real-world applications to solidify understanding.'
    }
  ]

  // Auto-advance testimonials
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isPlaying, testimonials.length])

  // Intersection Observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Animated counter for stats
  const Counter = ({ value, suffix }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!statsVisible) return
      
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.ceil(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }, [value, statsVisible])
    
    return (
      <span>
        {count}
        {suffix}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 mb-20">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64">
              <motion.div
                className="absolute inset-0 border-4 border-white opacity-20 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-4 border-2 border-white opacity-30 rounded-full"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="absolute inset-8 flex items-center justify-center">
                <Cpu className="w-16 h-16 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Master Algorithms Through
            <span className="block text-yellow-300">Interactive Visualization</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90"
          >
            Transform the way you learn algorithms with our cutting-edge visualization platform. 
            Understand complex concepts through interactive step-by-step animations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dsa"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center group"
            >
              Explore Algorithms
              <Cpu className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Powerful Learning Platform
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need to master algorithms and advance your programming skills
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center group"
                >
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div 
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl mb-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="p-6"
              >
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xl text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 mb-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Master algorithms in three simple steps
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <div className={`text-center md:text-${index % 2 === 0 ? 'right' : 'left'} pr-8 md:pr-16`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4">
                      {step.id}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-600 md:hidden"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="py-16 mb-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join thousands of satisfied learners who transformed their algorithm knowledge
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h3>
                <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
              </div>
              
              <div className="flex mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 text-lg italic mb-8">
                "{testimonials[currentTestimonial].content}"
              </p>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 mb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-center text-white p-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Start Your Journey Today
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-10 max-w-2xl mx-auto opacity-90"
          >
            Join thousands of developers and students mastering algorithms through visualization
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Sign Up Free
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">Algorithm<span className="text-blue-600">Visualizer</span></span>
            </div>
            <p className="text-gray-600 mb-4">
              Master algorithms through interactive visualization and practice.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-gray-600 hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link to="/tutorials" className="text-gray-600 hover:text-blue-600 transition-colors">Tutorials</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">Support</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-blue-600 transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Algorithm Visualizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home