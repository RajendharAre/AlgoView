import { useState } from 'react';
import { Users, Code, BookOpen, Trophy, Calendar, Star, Github, Twitter, Mail, MapPin } from 'lucide-react';

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
      icon: "📊"
    },
    {
      title: "Hands-on Practice",
      description: "Implement and test algorithms directly in your browser",
      icon: "💻"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey and achievements",
      icon: "📈"
    },
    {
      title: "Community Support",
      description: "Connect with fellow learners and experts for guidance",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Algorithm Visualizer</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Empowering developers and students to master algorithms through interactive visualization and hands-on practice
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'mission'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mission
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'team'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Founded in 2023, Algorithm Visualizer began as a passion project to help students and developers 
                      understand complex algorithms through interactive visualization. What started as a simple concept 
                      has grown into a comprehensive platform serving thousands of users worldwide.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our platform combines cutting-edge visualization technology with educational best practices to 
                      create an engaging learning experience that makes algorithm comprehension accessible to everyone.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Excellence in Education</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Accessibility for All</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Continuous Innovation</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Community-Driven Growth</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-4">
                    At Algorithm Visualizer, we believe that understanding algorithms shouldn't be a barrier to 
                    becoming a great developer. Our mission is to democratize computer science education by making 
                    complex algorithms accessible, understandable, and enjoyable for everyone.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We strive to create an environment where learners can experiment, make mistakes, and grow at 
                    their own pace. Through interactive visualizations, comprehensive explanations, and practical 
                    exercises, we aim to bridge the gap between theoretical knowledge and practical application.
                  </p>
                  <div className="bg-blue-50 p-6 rounded-lg mt-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Vision Statement</h3>
                    <p className="text-blue-800">
                      To become the world's leading platform for algorithm education, empowering millions of 
                      developers to excel in their careers and contribute to technological advancement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                <p className="text-gray-600 mb-8">
                  A diverse group of passionate individuals dedicated to revolutionizing how people learn algorithms.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Our Journey</h3>
                  <p className="text-gray-600 mb-4">
                    We're always looking for talented individuals who share our passion for education and technology.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Github className="h-4 w-4 mr-2" />
                      Contribute
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you and help improve your learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">contact@algorithmvisualizer.com</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">San Francisco, CA</p>
            </div>
            <div className="text-center">
              <Twitter className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <p className="text-gray-300">@algo_visualizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;