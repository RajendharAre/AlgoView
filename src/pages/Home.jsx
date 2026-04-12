import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import InteractiveFeatureCard from '../components/InteractiveFeatureCard'
import Testimonial3DCard from '../components/Testimonial3DCard'
import {
  getApprovedExperiencesListener,
  submitPlatformExperience,
} from '../services/experienceService'
import {
  Star,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Brain,
  Users,
  BookOpen,
  Rocket,
  GraduationCap,
  UserRound,
} from 'lucide-react'
import {
  SiThealgorithms,
  SiGoogle,
  SiAmazon,
  SiMeta,
  SiNetflix,
  SiAdobe,
  SiAccenture,
  SiGoldmansachs,
  SiSpotify,
  SiApple,
  SiTesla,
  SiTcs,
  SiInfosys,
  SiWipro,
  SiCisco,
  SiFlipkart,
} from 'react-icons/si'
import { APP_COLORS, APP_SHADOWS } from '../constants/sitePalette'

const COLORS = APP_COLORS
const SHADOWS = APP_SHADOWS

const Home = () => {
  const { user } = useAuth()

  // Set Home page meta tags for SEO
  usePageMeta(
    'AlgoView - Interactive Algorithm Visualizer & DSA Learning Platform',
    'Master data structures and algorithms with visual step-by-step animations. Practice with our interactive algorithm visualizer, code examples, tutorials, and interview preparation tools.',
    'algorithm visualizer, DSA, data structures, algorithms, coding interview, practice platform, learning'
  )

  // Roadmap data - structured and reusable
  const roadmapData = [
    {
      id: 1,
      title: 'Programming Basics',
      category: 'basics',
      difficulty: 'Beginner',
      side: 'left',
    },
    {
      id: 2,
      title: 'Arrays & Strings',
      category: 'arrays-strings',
      difficulty: 'Beginner',
      side: 'right',
    },
    { id: 3, title: 'Recursion', category: 'recursion', difficulty: 'Intermediate', side: 'left' },
    {
      id: 4,
      title: 'Searching & Sorting',
      category: 'searching-sorting',
      difficulty: 'Intermediate',
      side: 'right',
    },
    {
      id: 5,
      title: 'Linked List',
      category: 'linked-list',
      difficulty: 'Intermediate',
      side: 'left',
    },
    {
      id: 6,
      title: 'Stack & Queue',
      category: 'stack-queue',
      difficulty: 'Intermediate',
      side: 'right',
    },
    { id: 7, title: 'Hashing', category: 'hashing', difficulty: 'Intermediate', side: 'left' },
    { id: 8, title: 'Trees', category: 'trees', difficulty: 'Advanced', side: 'right' },
    { id: 9, title: 'Graphs', category: 'graphs', difficulty: 'Advanced', side: 'left' },
    { id: 10, title: 'Greedy', category: 'greedy', difficulty: 'Advanced', side: 'right' },
    {
      id: 11,
      title: 'Dynamic Programming',
      category: 'dynamic-programming',
      difficulty: 'Advanced',
      side: 'left',
    },
    {
      id: 12,
      title: 'Advanced Topics',
      category: 'advanced-topics',
      difficulty: 'Expert',
      side: 'center',
    },
  ]

  // Intersection Observer for stats animation
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [isMarqueePaused, setIsMarqueePaused] = useState(false)
  const [communityTestimonials, setCommunityTestimonials] = useState([])
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    name: user?.displayName || '',
    role: 'student',
    specificRole: '',
    institution: '',
    rating: 5,
    emotions: [],
    experience: '',
  })

  const emotionOptions = [
    'Helped me understand',
    'Reduced anxiety',
    'Saved study time',
    'Made it fun',
  ]

  const ratingLabels = {
    1: '1.0 — Poor',
    2: '2.0 — Fair',
    3: '3.0 — Okay',
    4: '4.0 — Good',
    5: '5.0 — Excellent',
  }

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
  const baseTestimonials = [
    {
      id: 1,
      name: 'Harish',
      role: '3rd Year BE Student, CSE, MVSR',
      avatarIcon: GraduationCap,
      content:
        'The step-by-step visualization flow helped me finally understand recursion and sorting internally, not just for exams. I now practice daily because AlgoView makes every topic feel clear and practical.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Vishnu',
      role: '2nd Year BE Student, ECE, MVSR',
      avatarIcon: GraduationCap,
      content:
        'I come from ECE, so coding speed was a challenge for me. The platform broke down each algorithm in a friendly way, and my confidence in problem solving improved a lot in just a few weeks.',
      rating: 4.5,
    },
    {
      id: 3,
      name: 'Rajesh Kulkarni',
      role: 'HOD, CSE (Allied), MVSREC',
      avatarIcon: UserRound,
      content:
        'As a faculty member, I look for tools that genuinely improve conceptual depth. AlgoView stands out because students can observe algorithm behavior visually and discuss complexity tradeoffs with clarity. It supports both classroom teaching and independent preparation effectively.',
      rating: 5,
    },
    {
      id: 4,
      name: 'Neelakanta Rao',
      role: 'Assistant Professor, CSE, MVSREC',
      avatarIcon: UserRound,
      content:
        'I use AlgoView to reinforce difficult classes because the animations bridge the gap between theory and implementation. The explanation flow is clean, and students engage more during doubt sessions after using this platform.',
      rating: 5,
    },
    {
      id: 5,
      name: 'Manoj',
      role: 'B.Com Student, Loyola Degree College',
      avatarIcon: GraduationCap,
      content:
        'I am not from a CS background, but this platform made coding feel less intimidating and more structured. Even basic problems now make sense to me.',
      rating: 5,
    },
    {
      id: 6,
      name: 'Shiva Kumar',
      role: 'B.Tech Data Science, GRIET',
      avatarIcon: GraduationCap,
      content:
        'What I liked most is the combination of visual algorithm flow, practice, and guidance in one place. It helped me build better logic and improve how I explain solutions in interviews.',
      rating: 4.3,
    },
  ]

  const testimonials = [...baseTestimonials, ...communityTestimonials]
  const marqueeTestimonials = [...testimonials, ...testimonials]

  // Stats data
  const stats = [
    { id: 1, value: 24, label: 'Algorithms', suffix: '+' },
    { id: 2, value: 100, label: 'Users', suffix: '+' },
    { id: 3, value: 50, label: 'Visualizations', suffix: '+' },
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
    { name: 'Flipkart', icon: SiFlipkart },
  ]

  // Features data
  const features = [
    {
      title: '200+ Algorithm Visualizations',
      description: 'Interactive visualizations for sorting, searching, graph algorithms, and more.',
      icon: SiThealgorithms,
      link: '/dsa/algorithms',
    },
    {
      title: 'AI-Powered Mock Interviews',
      description: 'Practice coding interviews with intelligent AI feedback and analysis.',
      icon: Brain,
      link: '/interview',
    },
    {
      title: 'Collaborative Learning',
      description: 'Share ideas and collaborate with the community on projects.',
      icon: Users,
      link: '/ideas',
    },
    {
      title: 'Development Resources',
      description: 'Tutorials, code examples, and best practices for developers.',
      icon: BookOpen,
      link: '/development',
    },
  ]

  // How it works steps
  const steps = [
    {
      id: 1,
      title: 'Choose Algorithm',
      description: 'Select from our library of algorithms across various categories.',
    },
    {
      id: 2,
      title: 'Visualize Execution',
      description: 'Watch step-by-step execution with interactive controls.',
    },
    {
      id: 3,
      title: 'Master the Concept',
      description: 'Practice with quizzes and challenges to solidify understanding.',
    },
  ]

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

  // Keep feedback form name synced when user signs in/out
  useEffect(() => {
    if (user?.displayName) {
      setFeedbackForm(prev => ({ ...prev, name: prev.name || user.displayName }))
    }
  }, [user])

  // Load approved experiences from Firestore
  useEffect(() => {
    const unsubscribe = getApprovedExperiencesListener(
      items => {
        const mapped = items.map(item => ({
          id: item.id,
          name: item.name,
          role: `${item.specificRole || item.role}${item.institution ? `, ${item.institution}` : ''}`,
          userType: item.userType || item.role || 'student',
          avatarIcon: item.userType === 'teacher' ? UserRound : GraduationCap,
          content: item.experience || item.content,
          rating: Number(item.rating || 5),
        }))
        setCommunityTestimonials(mapped)
      },
      () => {
        // Keep base testimonials available even if dynamic loading fails.
      }
    )

    return () => unsubscribe()
  }, [])

  const handleFeedbackChange = e => {
    const { name, value } = e.target
    setFeedbackForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleToggle = role => {
    setFeedbackForm(prev => ({ ...prev, role }))
  }

  const handleRatingSelect = rating => {
    setFeedbackForm(prev => ({ ...prev, rating }))
  }

  const handleEmotionToggle = emotion => {
    setFeedbackForm(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(item => item !== emotion)
        : [...prev.emotions, emotion],
    }))
  }

  const handleFeedbackSubmit = async e => {
    e.preventDefault()
    setFeedbackError('')
    setFeedbackSuccess('')

    if (!user) {
      setFeedbackError('Please login first to share your experience.')
      return
    }

    setSubmittingFeedback(true)

    try {
      await submitPlatformExperience({
        user,
        name: feedbackForm.name,
        role: feedbackForm.role,
        specificRole: feedbackForm.specificRole,
        institution: feedbackForm.institution,
        rating: feedbackForm.rating,
        emotions: feedbackForm.emotions,
        experience: feedbackForm.experience,
        timestamp: Date.now(),
        status: 'pending',
      })

      setFeedbackSuccess('Thank you. Your experience was submitted and is pending review.')
      setFeedbackForm(prev => ({
        ...prev,
        role: 'student',
        specificRole: '',
        institution: '',
        rating: 5,
        emotions: [],
        experience: '',
      }))
    } catch (error) {
      setFeedbackError(error?.message || 'Unable to submit your feedback right now.')
    } finally {
      setSubmittingFeedback(false)
    }
  }

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
              Master complex algorithms through interactive visualizations. Understand data
              structures and algorithms like never before.
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
                  boxShadow: SHADOWS.md,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.lg)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
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
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = COLORS.bg.secondary
                  e.currentTarget.style.boxShadow = SHADOWS.sm
                }}
                onMouseLeave={e => {
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
              className="mt-12 text-sm"
              style={{ color: COLORS.text.tertiary }}
            >
              Trusted by students and teachers across colleges
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
                  color: '#ffffff',
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
                  color: COLORS.text.tertiary,
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
                  style={{ top: `${40 + index * 85}px` }}
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
                            boxShadow: SHADOWS.md,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.lg)}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
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
              borderWidth: '0 0 0 4px',
            }}
          >
            <h4
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ color: COLORS.text.primary }}
            >
              <Rocket className="w-5 h-5" />
              Your Learning Journey
            </h4>
            <p style={{ color: COLORS.text.secondary }}>
              Follow the curved path to master DSA progressively. Beginner topics build foundations,
              intermediate topics develop problem-solving skills, and advanced topics prepare you
              for complex challenges. Click any node to practice problems for that topic.
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
                  boxShadow: SHADOWS.sm,
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
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
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
                    boxShadow: SHADOWS.md,
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
                    boxShadow: SHADOWS.sm,
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
              Trusted by Students and Teachers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg max-w-3xl mx-auto font-light"
              style={{ color: COLORS.text.secondary }}
            >
              Real experiences shared by learners and faculty using AlgoView in classrooms and
              self-study
            </motion.p>
          </div>

          {/* Testimonials Marquee */}
          <div className="overflow-hidden">
            <div
              className="flex w-max gap-6"
              onMouseEnter={() => setIsMarqueePaused(true)}
              onMouseLeave={() => setIsMarqueePaused(false)}
              style={{
                animation: 'testimonialMarquee 42s linear infinite',
                animationPlayState: isMarqueePaused ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {marqueeTestimonials.map((testimonial, index) => (
                <div key={`${testimonial.id}-marquee-${index}`} className="shrink-0">
                  <Testimonial3DCard testimonial={testimonial} COLORS={COLORS} SHADOWS={SHADOWS} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-12 rounded-xl border p-4 sm:p-6"
            style={{ backgroundColor: '#f8fafc', borderColor: COLORS.border.light }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div
                className="rounded-xl border p-5 sm:p-6 w-full"
                style={{ backgroundColor: '#ffffff', borderColor: COLORS.border.light }}
              >
                <h3 className="text-[15px] font-semibold mb-4">Share Your Experience</h3>

                {!user ? (
                  <div
                    className="rounded-lg border px-4 py-3"
                    style={{ borderColor: COLORS.border.light }}
                  >
                    <p className="text-[13px] mb-3" style={{ color: COLORS.text.secondary }}>
                      Please login to submit your experience.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold"
                      style={{ backgroundColor: '#111827', color: '#ffffff' }}
                    >
                      Login to Share Feedback
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    {feedbackError ? (
                      <p className="text-[13px] text-red-600">{feedbackError}</p>
                    ) : null}
                    {feedbackSuccess ? (
                      <p className="text-[13px] text-green-600">{feedbackSuccess}</p>
                    ) : null}

                    <div>
                      <p
                        className="text-[12px] uppercase tracking-[0.08em] mb-2"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        I am a
                      </p>
                      <div className="inline-flex rounded-lg gap-2">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle('student')}
                          className="px-4 py-2 rounded-lg text-[13px] font-medium border"
                          style={{
                            backgroundColor:
                              feedbackForm.role === 'student' ? '#111827' : '#ffffff',
                            color: feedbackForm.role === 'student' ? '#ffffff' : '#4b5563',
                            borderColor:
                              feedbackForm.role === 'student' ? '#111827' : COLORS.border.light,
                          }}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleToggle('teacher')}
                          className="px-4 py-2 rounded-lg text-[13px] font-medium border"
                          style={{
                            backgroundColor:
                              feedbackForm.role === 'teacher' ? '#111827' : '#ffffff',
                            color: feedbackForm.role === 'teacher' ? '#ffffff' : '#4b5563',
                            borderColor:
                              feedbackForm.role === 'teacher' ? '#111827' : COLORS.border.light,
                          }}
                        >
                          Teacher
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-[12px] uppercase tracking-[0.08em] mb-2"
                          style={{ color: COLORS.text.tertiary }}
                        >
                          Name
                        </p>
                        <input
                          name="name"
                          value={feedbackForm.name}
                          onChange={handleFeedbackChange}
                          placeholder="Your name"
                          required
                          className="w-full rounded-lg border px-3 py-2 text-[14px]"
                          style={{ borderColor: COLORS.border.light }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[12px] uppercase tracking-[0.08em] mb-2"
                          style={{ color: COLORS.text.tertiary }}
                        >
                          College / Institution
                        </p>
                        <input
                          name="institution"
                          value={feedbackForm.institution}
                          onChange={handleFeedbackChange}
                          placeholder="College / Institution"
                          required
                          className="w-full rounded-lg border px-3 py-2 text-[14px]"
                          style={{ borderColor: COLORS.border.light }}
                        />
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-[12px] uppercase tracking-[0.08em] mb-2"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        Role
                      </p>
                      <input
                        name="specificRole"
                        value={feedbackForm.specificRole}
                        onChange={handleFeedbackChange}
                        placeholder="e.g. 3rd Year BE Student"
                        required
                        className="w-full rounded-lg border px-3 py-2 text-[14px]"
                        style={{ borderColor: COLORS.border.light }}
                      />
                    </div>

                    <div>
                      <p
                        className="text-[12px] uppercase tracking-[0.08em] mb-2"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        Rating
                      </p>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(value => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingSelect(value)}
                            className="p-0.5"
                            aria-label={`Rate ${value} stars`}
                          >
                            <Star
                              className="w-6 h-6"
                              style={{
                                color: '#EF9F27',
                                fill: value <= feedbackForm.rating ? '#EF9F27' : 'transparent',
                                stroke: value <= feedbackForm.rating ? '#EF9F27' : '#cbd5e1',
                                strokeWidth: 1.5,
                              }}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-[12px] mt-1" style={{ color: COLORS.text.secondary }}>
                        {ratingLabels[feedbackForm.rating]}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-[12px] uppercase tracking-[0.08em] mb-2"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        How did it feel?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {emotionOptions.map(emotion => {
                          const isActive = feedbackForm.emotions.includes(emotion)
                          return (
                            <button
                              key={emotion}
                              type="button"
                              onClick={() => handleEmotionToggle(emotion)}
                              className="px-3 py-1.5 rounded-full text-[12px] border"
                              style={{
                                backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                                color: isActive ? '#1f2937' : '#6b7280',
                                borderColor: isActive ? '#c7d2fe' : COLORS.border.light,
                              }}
                            >
                              {emotion}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-[12px] uppercase tracking-[0.08em] mb-2"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        Experience
                      </p>
                      <textarea
                        name="experience"
                        value={feedbackForm.experience}
                        onChange={handleFeedbackChange}
                        rows={6}
                        maxLength={300}
                        placeholder="Describe your experience in detail…"
                        required
                        className="w-full rounded-lg border px-3 py-2 text-[14px]"
                        style={{ borderColor: COLORS.border.light }}
                      />
                      <p
                        className="text-[12px] mt-1 text-right"
                        style={{ color: COLORS.text.tertiary }}
                      >
                        {feedbackForm.experience.length} / 300
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="w-full px-5 py-2.5 rounded-lg text-[14px] font-semibold"
                      style={{
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        opacity: submittingFeedback ? 0.8 : 1,
                      }}
                    >
                      {submittingFeedback ? 'Submitting...' : 'Submit experience'}
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-4 w-full">
                <div
                  className="rounded-xl border p-5"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.border.light }}
                >
                  <h4 className="text-[15px] font-semibold mb-4">How it works</h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Log in and fill the form',
                        description: 'Select your role, rate your experience, and add details.',
                      },
                      {
                        title: 'Under review',
                        description: 'The team reviews it for quality within 24 hours.',
                      },
                      {
                        title: 'Published in the marquee',
                        description: 'Your entry goes live and helps future learners.',
                      },
                    ].map((step, index) => (
                      <div key={step.title} className="flex gap-3">
                        <div
                          className="h-6 w-6 rounded-full border flex items-center justify-center text-[12px] font-semibold shrink-0"
                          style={{ borderColor: COLORS.border.light, color: COLORS.text.secondary }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p
                            className="text-[14px] font-medium"
                            style={{ color: COLORS.text.primary }}
                          >
                            {step.title}
                          </p>
                          <p className="text-[13px]" style={{ color: COLORS.text.secondary }}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-xl border p-5"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.border.light }}
                >
                  <h4 className="text-[15px] font-semibold mb-4">Recent contributions</h4>
                  <div className="space-y-3">
                    {(communityTestimonials.length ? communityTestimonials : testimonials)
                      .slice(0, 2)
                      .map(item => {
                        const initials = item.name
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                        const isTeacher = (item.userType || '').toLowerCase() === 'teacher'

                        return (
                          <div
                            key={`recent-${item.id}`}
                            className="rounded-lg border p-3"
                            style={{ borderColor: COLORS.border.light }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
                                style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}
                              >
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[14px] font-medium truncate">{item.name}</p>
                                <span
                                  className="inline-flex px-2 py-0.5 rounded-full text-[12px]"
                                  style={{
                                    backgroundColor: isTeacher ? '#dcfce7' : '#dbeafe',
                                    color: isTeacher ? '#166534' : '#1d4ed8',
                                  }}
                                >
                                  {isTeacher ? 'Teacher' : 'Student'}
                                </span>
                              </div>
                            </div>
                            <p
                              className="text-[13px] truncate"
                              style={{ color: COLORS.text.secondary }}
                            >
                              "{item.content}"
                            </p>
                          </div>
                        )
                      })}
                  </div>
                </div>

                <div
                  className="rounded-xl border p-5"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.border.light }}
                >
                  <h4 className="text-[15px] font-semibold mb-3">Trust signal</h4>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#fff7ed' }}
                    >
                      <Star className="w-5 h-5" style={{ color: '#EF9F27', fill: '#EF9F27' }} />
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold leading-none">
                        {(
                          testimonials.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
                          (testimonials.length || 1)
                        ).toFixed(1)}
                      </p>
                      <p className="text-[12px] mb-0.5" style={{ color: COLORS.text.secondary }}>
                        avg rating
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] mt-2" style={{ color: COLORS.text.secondary }}>
                    from {testimonials.length} verified reviews
                  </p>
                </div>
              </div>
            </div>
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
                answer:
                  'Yes, our core algorithm visualizations are completely free. Everyone should have access to quality computer science education.',
              },
              {
                question: 'Do I need coding experience?',
                answer:
                  'Our platform is designed for all skill levels. Our visualizations help make complex algorithms understandable.',
              },
              {
                question: 'How many algorithms are available?',
                answer:
                  'We offer 200+ algorithm visualizations across sorting, searching, graph theory, and more.',
              },
              {
                question: 'Can I use this for interview prep?',
                answer:
                  'Absolutely! Many users have landed jobs at top tech companies after preparing with our platform.',
              },
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
                  boxShadow: SHADOWS.xs,
                }}
              >
                <details className="group p-6">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold">
                    <span>{faq.question}</span>
                    <ChevronDown
                      className="w-5 h-5 group-open:rotate-180 transition-transform"
                      style={{ color: COLORS.text.tertiary }}
                    />
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
                : 'Start learning with our interactive visualizations today. No credit card required.'}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dsa/algorithms"
                className="px-8 py-4 font-semibold rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: COLORS.text.primary,
                  color: COLORS.bg.surface,
                  boxShadow: SHADOWS.md,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = SHADOWS.lg)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = SHADOWS.md)}
              >
                {user ? 'Explore Algorithms' : 'Explore Now'}
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-4 font-semibold rounded-lg border-2 transition-all duration-300"
                  style={{
                    borderColor: COLORS.text.primary,
                    color: COLORS.text.primary,
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
                    color: COLORS.text.primary,
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
