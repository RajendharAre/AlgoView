import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import InteractiveFeatureCard from '../components/InteractiveFeatureCard'
import Testimonial3DCard from '../components/Testimonial3DCard'
import { 
  Star,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Brain,
  Users,
  BookOpen,
  Rocket
} from 'lucide-react'
import { SiThealgorithms, SiGoogle, SiAmazon, SiMeta, SiNetflix, SiAdobe, SiAccenture, SiGoldmansachs, SiSpotify, SiApple, SiTesla, SiTcs, SiInfosys, SiWipro, SiCisco, SiFlipkart } from 'react-icons/si'

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
    success: '#10b981',
    warning: '#f59e0b',
    green: '#8ed500',
  }
}

// Subtle shadow system for depth
const SHADOWS = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
}

const Home = () => {
  const { user } = useAuth();
  
  // Roadmap data - structured and reusable
  const roadmapData = [
    { id: 1, title: 'Programming Basics', category: 'basics', difficulty: 'Beginner', side: 'left' },
    { id: 2, title: 'Arrays & Strings', category: 'arrays-strings', difficulty: 'Beginner', side: 'right' },
    { id: 3, title: 'Recursion', category: 'recursion', difficulty: 'Intermediate', side: 'left' },
    { id: 4, title: 'Searching & Sorting', category: 'searching-sorting', difficulty: 'Intermediate', side: 'right' },
    { id: 5, title: 'Linked List', category: 'linked-list', difficulty: 'Intermediate', side: 'left' },
    { id: 6, title: 'Stack & Queue', category: 'stack-queue', difficulty: 'Intermediate', side: 'right' },
    { id: 7, title: 'Hashing', category: 'hashing', difficulty: 'Intermediate', side: 'left' },
    { id: 8, title: 'Trees', category: 'trees', difficulty: 'Advanced', side: 'right' },
    { id: 9, title: 'Graphs', category: 'graphs', difficulty: 'Advanced', side: 'left' },
    { id: 10, title: 'Greedy', category: 'greedy', difficulty: 'Advanced', side: 'right' },
    { id: 11, title: 'Dynamic Programming', category: 'dynamic-programming', difficulty: 'Advanced', side: 'left' },
    { id: 12, title: 'Advanced Topics', category: 'advanced-topics', difficulty: 'Expert', side: 'center' }
  ]
  
  // State for testimonials carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  
  // Intersection Observer for stats animation
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

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
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'This platform transformed how I prepare for technical interviews. The visualizations helped me ace my Google interview!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Senior Developer at Meta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'The interactive visualizations are incredible. It helped me improve my problem-solving speed significantly.',
      rating: 4.3
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Tech Lead at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'I recommend this to my team members. The most effective way to master algorithms and data structures.',
      rating: 4.5
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Full Stack Developer at Netflix',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'As someone who switched careers into tech, this platform made complex algorithms approachable and easy to understand.',
      rating: 4.7
    }
  ]

  // Stats data
  const stats = [
    { id: 1, value: 10, label: 'Algorithms', suffix: '+' },
    { id: 2, value: 100, label: 'Users', suffix: '+' },
    { id: 3, value: 50, label: 'Visualizations', suffix: '+' }
  ]

  // Company logos data
  const companyLogos = [
    { name: 'Google', icon: SiGoogle },
    { name: 'Meta', icon: SiMeta },
    { name: 'Apple', icon: SiApple },
    { name: 'Amazon', icon: SiAmazon },
    { name: 'Netflix', icon: SiNetflix },
    { name: 'Tesla', icon: SiTesla },
    { name: 'Adobe', icon: SiAdobe },
    { name: 'Accenture', icon: SiAccenture },
    { name: 'Goldman Sachs', icon: SiGoldmansachs },
    { name: 'Spotify', icon: SiSpotify },
    { name: 'TCS', icon: SiTcs },
    { name: 'Infosys', icon: SiInfosys },
    { name: 'Wipro', icon: SiWipro },
    { name: 'Cisco', icon: SiCisco },
    { name: 'Flipkart', icon: SiFlipkart }
  ]
  
  // Features data
  const features = [
    {
      title: '200+ Algorithm Visualizations',
      description: 'Interactive visualizations for sorting, searching, graph algorithms, and more.',
      icon: SiThealgorithms,
      link: '/dsa/algorithms'
    },
    {
      title: 'AI-Powered Mock Interviews',
      description: 'Practice coding interviews with intelligent AI feedback and analysis.',
      icon: Brain,
      link: '/interview'
    },
    {
      title: 'Collaborative Learning',
      description: 'Share ideas and collaborate with the community on projects.',
      icon: Users,
      link: '/ideas'
    },
    {
      title: 'Development Resources',
      description: 'Tutorials, code examples, and best practices for developers.',
      icon: BookOpen,
      link: '/development'
    }
  ]

  // How it works steps
  const steps = [
    {
      id: 1,
      title: 'Choose Algorithm',
      description: 'Select from our library of algorithms across various categories.'
    },
    {
      id: 2,
      title: 'Visualize Execution',
      description: 'Watch step-by-step execution with interactive controls.'
    },
    {
      id: 3,
      title: 'Master the Concept',
      description: 'Practice with quizzes and challenges to solidify understanding.'
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

  return (
    <div className="bg-white" style={{ color: COLORS.text.primary }}>
      {/* Hero Section */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ backgroundColor: COLORS.bg.secondary }}
            >
              <Star className="w-4 h-4" style={{ color: COLORS.accent.warning }} />
              <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                New: Advanced Visualizations
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              style={{ color: COLORS.text.primary }}
            >
              Visualize Algorithms in Real-Time
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light"
              style={{ color: COLORS.text.secondary }}
            >
              Master complex algorithms through interactive visualizations. Understand data structures and algorithms like never before.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/dsa/algorithms"
                className="group px-8 py-4 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: COLORS.text.primary,
                  color: COLORS.bg.surface,
                  boxShadow: SHADOWS.md
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.lg}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.md}
              >
                Explore Algorithms
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 font-semibold rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: COLORS.text.primary,
                  color: COLORS.text.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.bg.secondary
                  e.currentTarget.style.boxShadow = SHADOWS.sm
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-sm" style={{ color: COLORS.text.tertiary }}
            >
              Trusted by 1000+ developers learning algorithms
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Learning Roadmap Section */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Learning Roadmap
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg max-w-3xl mx-auto font-light mb-8"
              style={{ color: COLORS.text.secondary }}
            >
              Follow a structured path from fundamentals to advanced algorithms
            </motion.p>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                onClick={() => {}}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                style={{
                  backgroundColor: COLORS.text.primary,
                  color: '#ffffff'
                }}
              >
                DSA Roadmap
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                disabled
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: COLORS.border.light,
                  color: COLORS.text.tertiary
                }}
              >
                Development Roadmap <span className="text-xs ml-2">Coming Soon</span>
              </motion.button>
            </div>
          </div>

          {/* DSA Roadmap - Data-Driven Curved Learning Path */}
          <div className="relative w-full max-w-5xl mx-auto" style={{ minHeight: '1080px' }}>
            {/* SVG Curved Flow Path - Connects all nodes in proper sequence 1→2→3...→12 */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 0, left: 0, top: 0 }}
              viewBox="0 0 1000 1080"
              preserveAspectRatio="none"
            >
              {/* Single continuous smooth curve connecting all 12 nodes sequentially */}
              <path
                d="M 100 40
                   C 200 65, 800 100, 900 125
                   C 800 155, 200 185, 100 210
                   C 200 240, 800 270, 900 295
                   C 800 320, 200 355, 100 380
                   C 200 410, 800 440, 900 465
                   C 800 490, 200 525, 100 550
                   C 200 580, 800 610, 900 635
                   C 800 660, 200 695, 100 720
                   C 200 750, 800 780, 900 805
                   C 800 830, 200 865, 100 890
                   C 200 920, 400 960, 500 975"
                fill="none"
                stroke={COLORS.border.medium}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Nodes Container - Generated from data */}
            <div className="relative z-10 w-full h-full">
              {roadmapData.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className={`absolute ${node.side === 'left' ? 'left-0 md:left-12' : node.side === 'right' ? 'right-0 md:right-12' : 'left-1/2 transform -translate-x-1/2'}`}
                  style={{ top: `${40 + (index * 85)}px` }}
                >
                  <Link
                    to={`/dsa/algorithms?topic=${node.category}`}
                    className="group block no-underline"
                  >
                    <div className="flex flex-col items-center">
                      {/* Node Circle with Sequential Badge */}
                      <div className="relative">
                        <div
                          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:scale-110 cursor-pointer"
                          style={{
                            backgroundColor: '#a8aab5',
                            boxShadow: SHADOWS.md
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.lg}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.md}
                        >
                          {node.id}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h4
                        className="text-sm md:text-base font-semibold mt-3 group-hover:text-blue-600 transition-colors text-center w-28"
                        style={{ color: COLORS.text.primary }}
                      >
                        {node.title}
                      </h4>
                      

                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roadmap Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.96, duration: 0.6 }}
            className="mt-24 max-w-4xl mx-auto p-6 rounded-lg border-l-4"
            style={{
              backgroundColor: COLORS.bg.secondary,
              borderColor: COLORS.text.primary,
              borderWidth: '0 0 0 4px'
            }}
          >
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: COLORS.text.primary }}>
              <Rocket className="w-5 h-5" />
              Your Learning Journey
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              Follow the curved path to master DSA progressively. Beginner topics build foundations, intermediate topics develop problem-solving skills, and advanced topics prepare you for complex challenges. Click any node to practice problems for that topic.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Powerful Learning Platform
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg max-w-3xl mx-auto font-light"
              style={{ color: COLORS.text.secondary }}
            >
              Everything you need to master algorithms and advance your programming skills
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <InteractiveFeatureCard feature={feature} COLORS={COLORS} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        ref={statsRef}
        className="border-b py-20"
        style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="p-8 rounded-xl"
                style={{
                  backgroundColor: COLORS.bg.surface,
                  boxShadow: SHADOWS.sm
                }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-medium" style={{ color: COLORS.text.secondary }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg max-w-3xl mx-auto font-light"
              style={{ color: COLORS.text.secondary }}
            >
              Master algorithms in three simple steps
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="relative mb-12">
            <div className="h-1 rounded-full" style={{ backgroundColor: COLORS.border.medium }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: COLORS.text.primary }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6"
                  style={{
                    backgroundColor: COLORS.bg.secondary,
                    color: COLORS.text.primary,
                    boxShadow: SHADOWS.md
                  }}
                >
                  {step.id}
                </div>

                {/* Card */}
                <div
                  className="p-6 rounded-xl border"
                  style={{
                    backgroundColor: COLORS.bg.surface,
                    borderColor: COLORS.border.light,
                    boxShadow: SHADOWS.sm
                  }}
                >
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p style={{ color: COLORS.text.tertiary }}>{step.description}</p>
                </div>

                {/* Connector arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-7">
                    <ChevronRight style={{ color: COLORS.border.medium }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Trusted by Developers Worldwide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg max-w-3xl mx-auto font-light"
              style={{ color: COLORS.text.secondary }}
            >
              Real stories from developers who transformed their skills
            </motion.p>
          </div>

          {/* Testimonials Grid with 3D Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Testimonial3DCard
                  testimonial={testimonial}
                  COLORS={COLORS}
                  SHADOWS={SHADOWS}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Is it really free?',
                answer: 'Yes, our core algorithm visualizations are completely free. Everyone should have access to quality computer science education.'
              },
              {
                question: 'Do I need coding experience?',
                answer: "Our platform is designed for all skill levels. Our visualizations help make complex algorithms understandable."
              },
              {
                question: 'How many algorithms are available?',
                answer: 'We offer 200+ algorithm visualizations across sorting, searching, graph theory, and more.'
              },
              {
                question: 'Can I use this for interview prep?',
                answer: 'Absolutely! Many users have landed jobs at top tech companies after preparing with our platform.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: COLORS.bg.surface,
                  borderColor: COLORS.border.light,
                  boxShadow: SHADOWS.xs
                }}
              >
                <details className="group p-6">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold">
                    <span>{faq.question}</span>
                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" style={{ color: COLORS.text.tertiary }} />
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: COLORS.text.secondary }}>
                    {faq.answer}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20" style={{ backgroundColor: COLORS.bg.secondary }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {user ? 'Continue Your Learning Journey' : 'Ready to Master Algorithms?'}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: COLORS.text.secondary }}>
              {user 
                ? 'Explore more algorithms and advance your programming skills with our interactive visualizations.'
                : 'Start learning with our interactive visualizations today. No credit card required.'
              }
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dsa/algorithms"
                className="px-8 py-4 font-semibold rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: COLORS.text.primary,
                  color: COLORS.bg.surface,
                  boxShadow: SHADOWS.md
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.lg}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.md}
              >
                {user ? 'Explore Algorithms' : 'Explore Now'}
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 font-semibold rounded-lg border-2 transition-all duration-300"
                  style={{
                    borderColor: COLORS.text.primary,
                    color: COLORS.text.primary
                  }}
                >
                  Sign Up Free
                </Link>
              )}
              {user && (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 font-semibold rounded-lg border-2 transition-all duration-300"
                  style={{
                    borderColor: COLORS.text.primary,
                    color: COLORS.text.primary
                  }}
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
