import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaVideo, FaFileAlt, FaUsers, FaQuestionCircle } from 'react-icons/fa';

export default function Development() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: FaBook,
      description: 'Comprehensive step-by-step guides covering DSA, Web Development, and more.',
      color: 'from-blue-500 to-blue-600',
      path: '/development/tutorials'
    },
    {
      id: 'codes',
      label: 'Code Examples',
      icon: FaCode,
      description: 'Ready-to-use code snippets with syntax highlighting in multiple languages.',
      color: 'from-purple-500 to-purple-600',
      path: '/development/code-examples'
    },
    {
      id: 'videos',
      label: 'Video Courses',
      icon: FaVideo,
      description: 'Curated video courses from top platforms for visual learners.',
      color: 'from-red-500 to-red-600',
      path: '/development/videos'
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: FaFileAlt,
      description: 'Official documentation and reference guides for popular technologies.',
      color: 'from-amber-500 to-amber-600',
      path: '/development/documentation'
    },
    {
      id: 'community',
      label: 'Community',
      icon: FaUsers,
      description: 'Connect with developers on Discord, Telegram, Reddit, and GitHub.',
      color: 'from-green-500 to-green-600',
      path: '/development/community'
    },
    {
      id: 'qa',
      label: 'Q&A Forum',
      icon: FaQuestionCircle,
      description: 'Popular questions and answers from the community.',
      color: 'from-indigo-500 to-indigo-600',
      path: '/development/qa'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Development Hub</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Master DSA, Web Development, DevOps, and more with tutorials, code examples, video courses, and community resources.
          </p>
        </div>
      </motion.div>

      {/* Section Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Color Header */}
                  <div className={`h-24 bg-gradient-to-r ${section.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="text-white text-4xl" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {section.label}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                      {section.description}
                    </p>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(section.path)}
                      className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${section.color} hover:shadow-lg transition-all duration-300`}
                    >
                      Explore
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={FaBook} label="Tutorials" value="50+" />
            <StatCard icon={FaCode} label="Code Examples" value="100+" />
            <StatCard icon={FaVideo} label="Video Courses" value="200+" />
            <StatCard icon={FaUsers} label="Community Members" value="10K+" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg p-6 border border-gray-200 text-center"
    >
      <Icon className="text-blue-600 text-3xl mx-auto mb-3" />
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </motion.div>
  );
}