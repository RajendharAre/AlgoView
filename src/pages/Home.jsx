import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
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
  ArrowRight,
  Zap,
  Sparkles,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Crown,
  Shield,
  Award,
  Circle,
  Square,
  Triangle,
  RotateCcw,
  RefreshCw,
  Rocket,
  Target,
  Trophy,
  CreditCard,
  X
} from 'lucide-react'
import { SiThealgorithms, SiGoogle, SiAmazon, SiMeta, SiNetflix, SiAdobe, SiAccenture, SiGoldmansachs, SiSpotify, SiApple, SiTesla, SiTcs, SiInfosys, SiWipro, SiCisco, SiFlipkart } from 'react-icons/si'

const Home = () => {
  const { user } = useAuth();
  
  // State for testimonials carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  
  // Intersection Observer for stats animation
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Update dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // State for custom cursor
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  
  // State for trusted developers badge
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // State for announcement bar
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  
  // State for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Mouse move handler for custom cursor
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Mouse enter/leave handlers for custom cursor
  const handleMouseEnter = () => setCursorVisible(true);
  const handleMouseLeave = () => setCursorVisible(false);
  
  // Scroll effect for trusted developers badge
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // Spring animations
  const springConfig = { stiffness: 100, damping: 15 };
  const cardSpring = useSpring(0, springConfig);
  
  // Progress indicator that follows scroll
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Function to show confetti
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };
  
  // Tilt effect for cards
  const handleCardMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = (x - centerX) / 20;
    const rotateX = (centerY - y) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  
  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };
  
  // Ripple effect function
  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'This platform transformed how I prepare for technical interviews. The visualizations helped me ace my Google interview and land my dream job!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Senior Developer at Meta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'The mock interview feature is incredible. It helped me improve my problem-solving speed by 200% and boosted my confidence for coding challenges.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Tech Lead at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'I recommend this to my team members. It\'s the most effective way to master algorithms and data structures for system design interviews.',
      rating: 5
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Full Stack Developer at Netflix',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      content: 'As someone who switched careers into tech, this platform made complex algorithms approachable and helped me secure a role at Netflix.',
      rating: 5
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
    { name: 'Google', icon: SiGoogle, color: 'text-blue-500', bgColor: 'bg-white' },
    { name: 'Meta', icon: SiMeta, color: 'text-blue-600', bgColor: 'bg-white' },
    { name: 'Apple', icon: SiApple, color: 'text-gray-800', bgColor: 'bg-white' },
    { name: 'Amazon', icon: SiAmazon, color: 'text-orange-500', bgColor: 'bg-white' },
    { name: 'Netflix', icon: SiNetflix, color: 'text-red-600', bgColor: 'bg-white' },
    { name: 'Tesla', icon: SiTesla, color: 'text-red-600', bgColor: 'bg-white' },
    { name: 'Adobe', icon: SiAdobe, color: 'text-pink-600', bgColor: 'bg-white' },
    { name: 'Accenture', icon: SiAccenture, color: 'text-blue-600', bgColor: 'bg-white' },
    { name: 'Goldman Sachs', icon: SiGoldmansachs, color: 'text-blue-800', bgColor: 'bg-white' },
    { name: 'Spotify', icon: SiSpotify, color: 'text-green-500', bgColor: 'bg-white' },
    { name: 'TCS', icon: SiTcs, color: 'text-blue-600', bgColor: 'bg-white' },
    { name: 'Infosys', icon: SiInfosys, color: 'text-red-600', bgColor: 'bg-white' },
    { name: 'Wipro', icon: SiWipro, color: 'text-blue-500', bgColor: 'bg-white' },
    { name: 'Cisco', icon: SiCisco, color: 'text-blue-600', bgColor: 'bg-white' },
    { name: 'Flipkart', icon: SiFlipkart, color: 'text-orange-500', bgColor: 'bg-white' }

  ];
  
  // Features data
  const features = [
    {
      title: '200+ Algorithm Visualizations',
      description: 'Interactive visualizations for sorting, searching, graph algorithms, and more.',
      icon: SiThealgorithms,
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
    <>
      {showAnnouncement && (
      <div className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">New: 50 graph algorithms added</span>
          </div>
          <button 
            className="text-sm text-cyan-100 hover:text-white transition-colors"
            onClick={() => setShowAnnouncement(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      )}
      
      {/* Progress indicator that follows scroll */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div 
          className="relative overflow-hidden rounded-3xl text-white py-20 mb-16"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Animated 3D floating elements */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/3 w-20 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          
          {/* Parallax background elements */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600"
            style={{
              y: backgroundY,
              scale: backgroundScale,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-blue-500/10 to-indigo-600/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-400/20 via-purple-500/10 to-pink-500/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent opacity-30"></div>
          </motion.div>
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10"></div>
          
          {/* Ray Cursor */}
          {cursorVisible && (
            <>
              <motion.div
                className="fixed w-1 h-1 bg-cyan-400 rounded-full pointer-events-none z-50"
                style={{
                  left: cursorPosition.x,
                  top: cursorPosition.y,
                }}
              />

              <motion.div
                className="fixed w-40 h-40 pointer-events-none z-40"
                style={{
                  left: cursorPosition.x - 80,
                  top: cursorPosition.y - 80,
                  background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)"
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </>
          )}
          
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            {/* Trusted developers badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white/90">Trusted by 10K+ developers</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border border-white/20"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 border border-white/20"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 border border-white/20"></div>
                </div>
              </div>
            </motion.div>
            
            {/* Logo Cloud */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <p className="text-sm text-white/70 text-center mb-6">Used by students and engineers at</p>
              <div className="relative w-full overflow-hidden">
                <div className="marquee">
                  <div className="marquee__group">
                    {companyLogos.map((logo, index) => (
                      <div key={`logo1-${index}`} className="logo-item">
                        <div className="logo-circle">
                          {React.createElement(logo.icon, {
                            className: `${logo.color} w-full h-full`,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="marquee__group">
                    {companyLogos.map((logo, index) => (
                      <div key={`logo2-${index}`} className="logo-item">
                        <div className="logo-circle">
                          {React.createElement(logo.icon, {
                            className: `${logo.color} w-full h-full`,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-medium text-white/90">New: Advanced Visualizations</span>
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  Visualize Algorithms
                </span>
                <br />
                <span className="text-white">in Real-Time</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-white/80 font-light"
              >
                Master complex algorithms through interactive visualizations. 
                Understand data structures and algorithms like never before.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 flex items-center justify-center overflow-hidden"
                  onClick={(e) => { createRipple(e); triggerConfetti(); }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-white/20 rounded-2xl opacity-0"
                    whileTap={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  />
                </Link>
                <Link
                  to="/dsa"
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 transition-all duration-300 hover:bg-white/20 flex items-center justify-center overflow-hidden"
                  onClick={(e) => { createRipple(e); triggerConfetti(); }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Algorithms
                    <Zap className="w-5 h-5" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/10 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </div>
            
            {/* Mockup screenshot of algorithm visualizer */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative mx-auto max-w-2xl"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-white/10 transform -rotate-1 md:-rotate-2 lg:-rotate-3">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-slate-400 font-mono">algorithm-visualizer.js</div>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded bg-slate-600"></div>
                        <div className="w-4 h-4 rounded bg-slate-600"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="text-emerald-400 text-sm font-mono">function</div>
                        <div className="text-cyan-400 text-sm font-mono">quickSort</div>
                        <div className="text-slate-400 text-sm font-mono">(arr, low, high) {`{`}</div>
                      </div>
                      <div className="flex gap-2 pl-4">
                        <div className="text-slate-400 text-sm font-mono">if</div>
                        <div className="text-slate-400 text-sm font-mono">(low &lt; high) {`{`}</div>
                      </div>
                      <div className="flex gap-2 pl-8">
                        <div className="text-purple-400 text-sm font-mono">let</div>
                        <div className="text-amber-400 text-sm font-mono">pi</div>
                        <div className="text-slate-400 text-sm font-mono">=</div>
                        <div className="text-cyan-400 text-sm font-mono">partition</div>
                        <div className="text-slate-400 text-sm font-mono">(arr, low, high);</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-32 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg border border-white/10"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="py-16 mb-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
              >
                Try Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Live Demo</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
              >
                Experience algorithm visualization firsthand without signing up
              </motion.p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/30 shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-2 text-sm font-medium">Interactive Algorithm Demo</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Interactive Code Editor */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-cyan-300">Try Bubble Sort</h3>
                    <div className="bg-slate-800 rounded-xl p-4 font-mono text-sm">
                      <div className="text-emerald-400">function <span className="text-cyan-400">bubbleSort</span>(arr) {'{'}</div>
                      <div className="ml-4 text-slate-300">for (<span className="text-purple-400">let</span> i = <span className="text-amber-400">0</span>; i &lt; arr.length; i++) {'{'}</div>
                      <div className="ml-8 text-slate-300">for (<span className="text-purple-400">let</span> j = <span className="text-amber-400">0</span>; j &lt; arr.length - i - <span className="text-amber-400">1</span>; j++) {'{'}</div>
                      <div className="ml-12 text-slate-300">if (arr[j] &gt; arr[j + <span className="text-amber-400">1</span>]) {'{'}</div>
                      <div className="ml-16 text-slate-300">// Swap elements</div>
                      <div className="ml-16 text-slate-300">[arr[j], arr[j + <span className="text-amber-400">1</span>]] = [arr[j + <span className="text-amber-400">1</span>], arr[j]];</div>
                      <div className="ml-12 text-slate-300">{'}'}</div>
                      <div className="ml-8 text-slate-300">{'}'}</div>
                      <div className="ml-4 text-slate-300">{'}'}</div>
                      <div className="text-emerald-400">{'return'} arr;</div>
                      <div className="text-emerald-400">{'}'}</div>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg text-sm font-medium">
                        Run Algorithm
                      </button>
                      <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium">
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {/* Visualization Area */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-cyan-300">Visualization</h3>
                    <div className="bg-slate-900 rounded-xl p-6 h-64 flex items-center justify-center">
                      <div className="flex items-end justify-center gap-1 h-40 w-full">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-6 bg-gradient-to-t from-cyan-500 to-emerald-500 rounded-t-sm"
                            initial={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
                            animate={{
                              height: [`${Math.floor(Math.random() * 60) + 20}%`, `${Math.floor(Math.random() * 60) + 40}%`, `${Math.floor(Math.random() * 60) + 20}%`],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-4 text-center">Watch your algorithm execute step-by-step with visual feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Improved Structure */}
        <div className="py-16 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2710%27 height=%2710%27 viewBox=%270 0 10 10%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect width=%2710%27 height=%2710%27 fill=%27white%27 opacity=%270.02%27/%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="text-center mb-16 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
            >
              Powerful Learning Platform
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
            >
              Everything you need to master algorithms and advance your programming skills
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.1 * index, 
                    duration: 0.6, 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 15 
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="group relative bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-cyan-300/50 transition-all duration-300 shadow-lg shadow-slate-100/20 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-visible"
                  onMouseMove={(e) => handleCardMouseMove(e, index)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-white"></div>
                  </div>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%272%27 cy=%272%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                  
                  {/* Most Popular badge for first card - properly aligned */}
                  {index === 0 && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 whitespace-nowrap"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(251, 191, 36, 0.7)",
                          "0 0 0 10px rgba(251, 191, 36, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Most Popular
                    </motion.div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Animated icon container */}
                    <motion.div 
                      className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, 5, -5, 0],
                        transition: { duration: 0.5, repeat: 1, ease: "easeInOut" }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <Icon className="h-6 w-6 text-white relative z-10" />
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                    </motion.div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-slate-600 mb-4 text-sm group-hover:text-slate-700 transition-colors duration-300">{feature.description}</p>
                    
                    {/* Preview animation for each feature */}
                    <div className="mb-4 h-20 flex items-center justify-center bg-slate-800/10 rounded-lg overflow-hidden">
                      <motion.div
                        className="text-cyan-500 text-xs font-mono"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      >
                        {index === 0 && (
                          <div className="text-center">
                            <div className="text-emerald-400 font-mono text-xs">function sort() {'{'}</div>
                            <div className="text-slate-400 font-mono text-xs ml-2">// visualizing...</div>
                            <div className="flex mt-1 space-x-1">
                              <div className="w-2 h-4 bg-cyan-500 rounded-sm animate-pulse"></div>
                              <div className="w-2 h-4 bg-emerald-500 rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-4 bg-purple-500 rounded-sm animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="text-center">
                            <div className="text-purple-400 font-mono text-xs">async interview() {'{'}</div>
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-ping"></div>
                              <span className="text-xs text-slate-500">AI feedback</span>
                            </div>
                            <div className="text-amber-400 text-xs mt-1">✓ Optimal solution</div>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <div className="text-xs text-slate-500">collaborating...</div>
                          </div>
                        )}
                        {index === 3 && (
                          <div className="text-center">
                            <div className="text-amber-400 font-mono text-xs">resources = []</div>
                            <div className="flex mt-2 space-x-1 justify-center">
                              <div className="w-3 h-3 border border-cyan-400 rounded-sm animate-pulse"></div>
                              <div className="w-3 h-3 border border-emerald-400 rounded-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                              <div className="w-3 h-3 border border-purple-400 rounded-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    
                    <Link
                      to={feature.link}
                      className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors text-sm group-hover:underline underline-offset-4 relative z-10"
                      onClick={(e) => { createRipple(e); triggerConfetti(); }}
                    >
                      Explore
                      <motion.div
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="py-16 mb-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
              >
                Why Choose Us Over <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">YouTube/Books?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
              >
                See how our interactive approach outperforms traditional learning methods
              </motion.p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-lg font-bold text-slate-900 border-b border-slate-200">Feature</th>
                    <th className="p-4 text-lg font-bold text-cyan-600 border-b border-slate-200">AlgoView</th>
                    <th className="p-4 text-lg font-bold text-slate-600 border-b border-slate-200">YouTube Tutorials</th>
                    <th className="p-4 text-lg font-bold text-slate-600 border-b border-slate-200">Text Books</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { feature: "Interactive Visualization", algo: true, youtube: false, books: false },
                    { feature: "Step-by-Step Execution", algo: true, youtube: false, books: false },
                    { feature: "Real-time Feedback", algo: true, youtube: false, books: false },
                    { feature: "Hands-on Practice", algo: true, youtube: false, books: false },
                    { feature: "Immediate Understanding", algo: true, youtube: true, books: false },
                    { feature: "Visual Pattern Recognition", algo: true, youtube: true, books: false },
                    { feature: "Customizable Speed", algo: true, youtube: true, books: true },
                    { feature: "Repeatable Learning", algo: true, youtube: true, books: true },
                    { feature: "Engagement & Retention", algo: true, youtube: true, books: false },
                    { feature: "Problem-Solving Practice", algo: true, youtube: false, books: false },
                  ].map((item, index) => (
                    <motion.tr 
                      key={item.feature}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <td className="p-4 font-medium text-slate-700">{item.feature}</td>
                      <td className="p-4">{item.algo ? <Check className="w-5 h-5 text-emerald-500 inline" /> : <X className="w-5 h-5 text-red-400 inline" />}</td>
                      <td className="p-4">{item.youtube ? <Check className="w-5 h-5 text-emerald-500 inline" /> : <X className="w-5 h-5 text-red-400 inline" />}</td>
                      <td className="p-4">{item.books ? <Check className="w-5 h-5 text-emerald-500 inline" /> : <X className="w-5 h-5 text-red-400 inline" />}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div 
          ref={statsRef}
          className="py-16 rounded-3xl mb-16"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * index }}
                  className="relative p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-lg text-slate-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works - Professional Process Section */}
        <div className="py-16 mb-16 relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.03%27%3E%3Cpath d=%27M0 40L40 0H20L0 20ZM20 40L40 20H30L20 30Z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                  
          <div className="text-center mb-16 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
            >
              Master algorithms in three simple steps
            </motion.p>
          </div>
                  
          {/* Progress bar */}
          <div className="relative z-10 mb-12">
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
          </div>
                  
          {/* Horizontal layout with centered alignment */}
          <div className="relative z-10">
            <div className="flex justify-center space-x-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="flex flex-col items-center text-center w-80"
                >
                  {/* Step number with realistic gradient */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg">
                    {step.id}
                  </div>
                          
                  {/* Card with realistic design */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 w-full group">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors duration-300">{step.title}</h3>
                    <p className="text-slate-600 mb-4 group-hover:text-slate-700 transition-colors duration-300">{step.description}</p>
                            
                    {/* Realistic preview visualization */}
                    <div className="mb-4 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative border border-slate-200/50">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.05%27%3E%3Crect x=%270%27 y=%270%27 width=%274%27 height=%274%27 rx=%272%27/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                              
                      {index === 0 && (
                        <div className="relative z-10 text-center">
                          <div className="text-cyan-600 font-bold mb-2">SELECT</div>
                          <div className="flex flex-wrap justify-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded flex items-center justify-center text-white text-xs font-bold">S</div>
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">G</div>
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">T</div>
                          </div>
                          <div className="text-xs text-slate-500">Sorting, Graph, Tree</div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="relative z-10 text-center">
                          <div className="text-emerald-600 font-bold mb-2">EXECUTE</div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <div className="text-xs text-slate-500">Step-by-step</div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="relative z-10 text-center">
                          <div className="text-purple-600 font-bold mb-2">MASTER</div>
                          <div className="flex justify-center gap-1 mb-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                          </div>
                          <div className="text-xs text-slate-500">Practice & Assess</div>
                        </div>
                      )}
                    </div>
                            
                    <div className="text-xs text-slate-500 font-medium">
                      {index === 0 && "Choose from 200+ algorithms"}
                      {index === 1 && "Watch live visualization"}
                      {index === 2 && "Validate your knowledge"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
                    
            {/* Connecting arrows between steps */}
            <div className="flex justify-center max-w-6xl mx-auto mt-12">
              <div className="flex items-center space-x-8">
                {steps.slice(0, -1).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials - Premium Authentic Reviews */}
        <div className="py-16 mb-16 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2730%27 height=%2730%27 viewBox=%270 0 30 30%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.02%27%3E%3Ccircle cx=%271%27 cy=%271%27 r=%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="text-center mb-16 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
            >
              Trusted by Developers Worldwide
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
            >
              Real stories from real developers who transformed their skills
            </motion.p>
          </div>
          
          {/* Card stack effect for testimonials */}
          <div className="relative max-w-6xl mx-auto mb-12">
            <div className="flex overflow-x-auto space-x-6 pb-8 px-4 scrollbar-hide snap-x snap-mandatory">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="snap-start flex-shrink-0 w-80"
                >
                  {/* Tweet-style testimonial card */}
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                    {/* Verified badge */}
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-white"></div>
                    </div>
                    
                    {/* Avatar with Ken Burns effect */}
                    <div className="relative mb-4">
                      <motion.div
                        className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      
                      {/* Company logo overlay */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {testimonial.role.includes('Google') ? 'G' : 
                         testimonial.role.includes('Microsoft') ? 'M' : 
                         testimonial.role.includes('Meta') ? 'M' : 'S'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                      
                      {/* Social proof icons */}
                      <div className="flex space-x-2">
                        <Twitter className="w-4 h-4 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" />
                        <Linkedin className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                      </div>
                    </div>
                    
                    {/* Animated star ratings */}
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1, duration: 0.4 }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Content with metrics */}
                    <p className="text-slate-700 text-sm mb-4 relative">
                      "{testimonial.content} 
                      <span className="text-emerald-600 font-semibold">Increased my coding confidence by 300%</span>"
                    </p>
                    
                    {/* Metrics badge */}
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      <Rocket className="w-3 h-3" />
                      {index === 0 ? '+300% Confidence' : index === 1 ? '+400% Efficiency' : '+250% Knowledge'}
                    </div>
                    
                    {/* Video testimonial option */}
                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                      <button className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                        <Play className="w-4 h-4" />
                        Watch video testimonial
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Swipe hint for mobile */}
            <div className="hidden md:flex items-center justify-center space-x-2 text-slate-500 text-sm mt-4">
              <div className="animate-bounce">←</div>
              <span>Swipe to see more</span>
              <div className="animate-bounce">→</div>
            </div>
          </div>
          
          {/* Infinite horizontal scroll of testimonials */}
          <div className="relative overflow-hidden py-8">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`${testimonial.id}-${index}`} className="inline-block mx-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    "{testimonial.content.split('.')[0]}..."
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .marquee {
              display: flex;
              width: 200%;
              overflow: hidden;
            }
            .marquee__group {
              display: flex;
              width: 50%;
              flex-shrink: 0;
              justify-content: space-around;
              align-items: center;
              animation: marquee 30s linear infinite;
            }
            .logo-item {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-circle {
              width: 48px;
              height: 48px;
              background: white;
              border-radius: 9999px;
              padding: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .snap-x {
              scroll-snap-type: x mandatory;
            }
            .snap-start {
              scroll-snap-align: start;
            }
          `}</style>
        </div>

        {/* FAQ Section */}
        <div className="py-16 mb-16 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
              >
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Questions</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light"
              >
                Everything you need to know about the platform
              </motion.p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "Is it really free?",
                  answer: "Yes, our core algorithm visualizations and learning tools are completely free forever. We believe everyone should have access to quality computer science education."
                },
                {
                  question: "Do I need coding experience?",
                  answer: "Our platform is designed for all skill levels. Whether you're a beginner or experienced developer, our visualizations help make complex algorithms understandable."
                },
                {
                  question: "How many algorithms are available?",
                  answer: "We offer 200+ algorithm visualizations across sorting, searching, graph theory, dynamic programming, and more. New visualizations are added monthly."
                },
                {
                  question: "Can I use this for interview prep?",
                  answer: "Absolutely! Many users have landed jobs at top tech companies after preparing with our platform. We include mock interview features and real interview questions."
                },
                {
                  question: "What browsers do you support?",
                  answer: "Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <details className="group p-6">
                    <summary className="flex items-center justify-between cursor-pointer text-slate-800 font-medium">
                      <span>{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section - Split Layout with Conversion Optimization */}
        <div className="py-16 mb-16 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-emerald-500/5"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          {/* Floating animated shapes */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <div className="relative z-10 max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left side - Compelling copy */}
              <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white">
                    Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Developer Potential</span>
                  </h2>
                  <p className="text-lg md:text-xl mb-6 text-slate-300">
                    Join 250 developers who transformed their algorithm mastery journey with our interactive platform.
                  </p>
                  
                  {/* Live counter */}
                  <div className="mb-8">
                    <div className="text-2xl font-bold text-cyan-400">
                      <Counter value={250}>+</Counter>
                      <span className="text-sm ml-2 text-slate-400">developers already joined</span>
                    </div>
                  </div>
                  
                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm">
                      <Shield className="w-4 h-4" />
                      Free forever
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm">
                      <CreditCard className="w-4 h-4" />
                      No credit card
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm">
                      <RotateCcw className="w-4 h-4" />
                      Cancel anytime
                    </div>
                  </div>
                  
                  {/* Urgency element */}
                  <div className="mb-8">
                    <div className="text-sm text-amber-400 font-medium mb-2">Today's unlock: 1,000+ visualizations</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  {/* Email capture form */}
                  <div className="mb-8">
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="email" 
                        placeholder="Enter your email to get started" 
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                        onClick={(e) => { createRipple(e); triggerConfetti(); }}
                      >
                        Start Free
                      </button>
                    </form>
                  </div>
                  
                  {/* Testimonial snippet */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-slate-300">Trusted by 4.9/5 from 2,500+ reviews</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Right side - Visual preview */}
              <div className="p-12 flex flex-col justify-center bg-white">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">What You'll Get</h3>
                  <p className="text-slate-600 mb-6">Interactive visualizations that make algorithms click instantly.</p>
                  
                  {/* Feature highlights carousel */}
                  <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-sm text-slate-600 font-medium">Algorithm Visualization</span>
                    </div>
                    <div className="h-48 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%230ea5e9%27 fill-opacity=%270.1%27%3E%3Crect x=%270%27 y=%270%27 width=%274%27 height=%274%27 rx=%272%27/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-cyan-600 font-mono text-sm mb-4">function bubbleSort(arr) {'{'}</div>
                        <div className="flex justify-center space-x-1 mb-2">
                          <motion.div
                            className="w-4 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-t-sm"
                            animate={{
                              height: ['1.5rem', '0.5rem', '1.5rem'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0
                            }}
                          ></motion.div>
                          <motion.div
                            className="w-4 h-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-t-sm"
                            animate={{
                              height: ['1rem', '1.5rem', '1rem'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.2
                            }}
                          ></motion.div>
                          <motion.div
                            className="w-4 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-t-sm"
                            animate={{
                              height: ['2rem', '1rem', '2rem'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.4
                            }}
                          ></motion.div>
                          <motion.div
                            className="w-4 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-sm"
                            animate={{
                              height: ['1.25rem', '2rem', '1.25rem'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.6
                            }}
                          ></motion.div>
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Interactive Sorting Visualization</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video modal button */}
                  <button 
                    className="w-full mb-6 group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg border border-slate-700"
                    onClick={(e) => { createRipple(e); /* Open video modal */ }}
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-cyan-400" />
                      <span>See it in action</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  {/* FAQ Accordion */}
                  <div className="border-t border-slate-200 pt-6">
                    <details className="mb-3 group">
                      <summary className="flex items-center justify-between cursor-pointer text-slate-800 font-medium">
                        <span>Is it really free?</span>
                        <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-2 text-slate-600 text-sm">Yes, our core algorithm visualizations and learning tools are completely free forever. We believe everyone should have access to quality computer science education.</p>
                    </details>
                    <details className="mb-3 group">
                      <summary className="flex items-center justify-between cursor-pointer text-slate-800 font-medium">
                        <span>Do I need coding experience?</span>
                        <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-2 text-slate-600 text-sm">Our platform is designed for all skill levels. Whether you're a beginner or experienced developer, our visualizations help make complex algorithms understandable.</p>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-slate-800 font-medium">
                        <span>How many algorithms are available?</span>
                        <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-2 text-slate-600 text-sm">We offer 200+ algorithm visualizations across sorting, searching, graph theory, dynamic programming, and more. New visualizations are added monthly.</p>
                    </details>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Prominent CTA button */}
            <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative inline-block"
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-cyan-500/25"
                  onClick={(e) => { createRipple(e); triggerConfetti(); }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Learning Now
                    <ArrowRight className="w-6 h-6" />
                  </span>
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      

    </>
  )
}

export default Home