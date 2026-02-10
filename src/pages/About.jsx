import { useState } from 'react';
import { Users, Code, BookOpen, Trophy, Calendar, Star, Github, Twitter, Mail, MapPin, Grid3X3, Laptop2, TrendingUp, Users2, Linkedin } from 'lucide-react';

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
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
}

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in React and modern JavaScript frameworks.",
      avatar: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=AJ"
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      bio: "Design specialist focused on creating intuitive and beautiful user experiences.",
      avatar: "https://via.placeholder.com/100x100/ef4444/ffffff?text=SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Backend Engineer",
      bio: "Database and API expert ensuring scalable and efficient server-side solutions.",
      avatar: "https://via.placeholder.com/100x100/10b981/ffffff?text=MR"
    },
    {
      name: "Emily Davis",
      role: "Frontend Specialist",
      bio: "React enthusiast passionate about creating responsive and accessible interfaces.",
      avatar: "https://via.placeholder.com/100x100/f59e0b/ffffff?text=ED"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Algorithms", value: "50+", icon: Code },
    { label: "Completed", value: "100%", icon: Trophy },
    { label: "Uptime", value: "99.9%", icon: Calendar }
  ];

  const features = [
    {
      title: "Interactive Visualizations",
      description: "See algorithms come to life with step-by-step visual representations",
      icon: <Grid3X3 className="h-8 w-8" style={{ color: COLORS.text.primary }} />
    },
    {
      title: "Hands-on Practice",
      description: "Implement and test algorithms directly in your browser",
      icon: <Laptop2 className="h-8 w-8" style={{ color: COLORS.text.primary }} />
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey and achievements",
      icon: <TrendingUp className="h-8 w-8" style={{ color: COLORS.text.primary }} />
    },
    {
      title: "Community Support",
      description: "Connect with fellow learners and experts for guidance",
      icon: <Users2 className="h-8 w-8" style={{ color: COLORS.text.primary }} />
    }
  ];

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="py-16" style={{ backgroundColor: COLORS.bg.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.text.primary }}>About AlgoView</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: COLORS.text.secondary }}>
              Empowering developers and students to master algorithms through interactive visualization and hands-on practice
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12" style={{ backgroundColor: COLORS.bg.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8" style={{ color: COLORS.text.primary }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: COLORS.text.primary }}>{stat.value}</div>
                <div style={{ color: COLORS.text.secondary }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16" style={{ backgroundColor: COLORS.bg.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>Why Choose Us?</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.text.secondary }}>
              Our platform offers unique features designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border text-center" style={{ backgroundColor: COLORS.bg.surface, borderColor: COLORS.border.light, boxShadow: SHADOWS.sm }}>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>{feature.title}</h3>
                <p style={{ color: COLORS.text.secondary }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="p-1 rounded-lg" style={{ backgroundColor: COLORS.bg.secondary }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: activeTab === 'overview' ? COLORS.bg.surface : 'transparent',
                  color: activeTab === 'overview' ? COLORS.text.primary : COLORS.text.secondary,
                  boxShadow: activeTab === 'overview' ? SHADOWS.sm : 'none'
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: activeTab === 'mission' ? COLORS.bg.surface : 'transparent',
                  color: activeTab === 'mission' ? COLORS.text.primary : COLORS.text.secondary,
                  boxShadow: activeTab === 'mission' ? SHADOWS.sm : 'none'
                }}
              >
                Mission
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: activeTab === 'team' ? COLORS.bg.surface : 'transparent',
                  color: activeTab === 'team' ? COLORS.text.primary : COLORS.text.secondary,
                  boxShadow: activeTab === 'team' ? SHADOWS.sm : 'none'
                }}
              >
                Team
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg p-8 border" style={{ backgroundColor: COLORS.bg.surface, borderColor: COLORS.border.light, boxShadow: SHADOWS.sm }}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.text.primary }}>Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="mb-4" style={{ color: COLORS.text.secondary }}>
                      Founded in 2023, AlgoView began as a passion project to help students and developers 
                      understand complex algorithms through interactive visualization. What started as a simple concept 
                      has grown into a comprehensive platform serving thousands of users worldwide.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our platform combines cutting-edge visualization technology with educational best practices to 
                      create an engaging learning experience that makes algorithm comprehension accessible to everyone.
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.bg.tertiary, borderColor: COLORS.border.light }}>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text.primary }}>Our Values</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Star className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: COLORS.accent.warning }} />
                        <span style={{ color: COLORS.text.secondary }}>Excellence in Education</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: COLORS.accent.warning }} />
                        <span style={{ color: COLORS.text.secondary }}>Accessibility for All</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: COLORS.accent.warning }} />
                        <span style={{ color: COLORS.text.secondary }}>Continuous Innovation</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: COLORS.accent.warning }} />
                        <span style={{ color: COLORS.text.secondary }}>Community-Driven Growth</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.text.primary }}>Our Mission</h2>
                <div className="prose max-w-none">
                  <p className="mb-4" style={{ color: COLORS.text.secondary }}>
                    At AlgoView, we believe that understanding algorithms shouldn't be a barrier to 
                    becoming a great developer. Our mission is to democratize computer science education by making 
                    complex algorithms accessible, understandable, and enjoyable for everyone.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We strive to create an environment where learners can experiment, make mistakes, and grow at 
                    their own pace. Through interactive visualizations, comprehensive explanations, and practical 
                    exercises, we aim to bridge the gap between theoretical knowledge and practical application.
                  </p>
                  <div className="p-6 rounded-lg mt-6 border" style={{ backgroundColor: COLORS.bg.tertiary, borderColor: COLORS.border.light }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>Vision Statement</h3>
                    <p style={{ color: COLORS.text.secondary }}>
                      To become the world's leading platform for algorithm education, empowering millions of 
                      developers to excel in their careers and contribute to technological advancement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.text.primary }}>Meet Our Team</h2>
                <p className="mb-8" style={{ color: COLORS.text.secondary }}>
                  A diverse group of passionate individuals dedicated to revolutionizing how people learn algorithms.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="border rounded-lg p-6 text-center transition-shadow" style={{ backgroundColor: COLORS.bg.surface, borderColor: COLORS.border.light, boxShadow: SHADOWS.sm }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.md} onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.sm}>
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>{member.name}</h3>
                      <p className="font-medium mb-2" style={{ color: COLORS.text.primary }}>{member.role}</p>
                      <p className="text-sm" style={{ color: COLORS.text.secondary }}>{member.bio}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8" style={{ borderTopColor: COLORS.border.light, borderTopWidth: '1px' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text.primary }}>Join Our Journey</h3>
                  <p className="mb-4" style={{ color: COLORS.text.secondary }}>
                    We're always looking for talented individuals who share our passion for education and technology.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center px-4 py-2 rounded-lg transition-all" style={{ backgroundColor: COLORS.text.primary, color: COLORS.bg.surface, boxShadow: SHADOWS.sm }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = SHADOWS.md} onMouseLeave={(e) => e.currentTarget.style.boxShadow = SHADOWS.sm}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </button>
                    <a href="https://github.com/RajendharAre/AlgoView" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 rounded-lg border transition-colors" style={{ borderColor: COLORS.border.light, color: COLORS.text.primary }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.bg.secondary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Github className="h-4 w-4 mr-2" />
                      Contribute
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 text-white" style={{ backgroundColor: COLORS.text.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.bg.surface }}>Get In Touch</h2>
            <p className="max-w-2xl mx-auto" style={{ color: COLORS.bg.secondary }}>
              Have questions or feedback? We'd love to hear from you and help improve your learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-3" style={{ color: COLORS.bg.secondary }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.bg.surface }}>Email Us</h3>
              <p style={{ color: COLORS.bg.secondary }}>contact@algorithmvisualizer.com</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3" style={{ color: COLORS.bg.secondary }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.bg.surface }}>Visit Us</h3>
              <p style={{ color: COLORS.bg.secondary }}>Telangana, India</p>
            </div>
            <div className="text-center">
              <Twitter className="h-8 w-8 mx-auto mb-3" style={{ color: COLORS.bg.secondary }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.bg.surface }}>Follow Us</h3>
              <p style={{ color: COLORS.bg.secondary }}>@algo_visualizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;