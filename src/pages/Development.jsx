import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaVideo, FaFileAlt, FaUsers, FaQuestionCircle } from 'react-icons/fa';

// Semantic color tokens from grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
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
    primary: '#343a40', // gunmetal
    secondary: '#6c757d', // slate-grey
  }
};

export default function Development() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: FaBook,
      description: 'Comprehensive step-by-step guides covering Web Development, DevOps, and more.',
      accentColor: COLORS.accent.primary,
      path: '/development/tutorials'
    },
    {
      id: 'codes',
      label: 'Code Examples',
      icon: FaCode,
      description: 'Ready-to-use code snippets with syntax highlighting in multiple languages.',
      accentColor: COLORS.accent.primary,
      path: '/development/code-examples'
    },
    {
      id: 'videos',
      label: 'Video Courses',
      icon: FaVideo,
      description: 'Curated video courses from top platforms for visual learners.',
      accentColor: COLORS.accent.primary,
      path: '/development/videos'
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: FaFileAlt,
      description: 'Official documentation and reference guides for popular technologies.',
      accentColor: COLORS.accent.primary,
      path: '/development/documentation'
    },
    {
      id: 'community',
      label: 'Community',
      icon: FaUsers,
      description: 'Connect with developers on Discord, Telegram, Reddit, and GitHub.',
      accentColor: COLORS.accent.primary,
      path: '/development/community'
    },
    {
      id: 'qa',
      label: 'Q&A Forum',
      icon: FaQuestionCircle,
      description: 'Popular questions and answers from the community.',
      accentColor: COLORS.accent.primary,
      path: '/development/qa'
    }
  ];

  return (
    <div style={{ backgroundColor: COLORS.bg.primary }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: COLORS.bg.primary, borderBottomColor: COLORS.border.light }}
        className="bg-white border-b py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.text.primary }}>Development Hub</h1>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.text.secondary }}>
            Master Web Development, DevOps, and more with tutorials, code examples, video courses, and community resources.
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
                <div style={{ backgroundColor: COLORS.bg.primary, borderColor: COLORS.border.light }} className="h-full rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Color Header */}
                  <div style={{ backgroundColor: COLORS.bg.secondary }} className="h-24 flex items-center justify-center">
                    <Icon className="text-4xl" style={{ color: section.accentColor }} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text.primary }}>
                      {section.label}
                    </h3>
                    <p className="text-sm mb-6 line-clamp-3" style={{ color: COLORS.text.secondary }}>
                      {section.description}
                    </p>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(section.path)}
                      style={{ backgroundColor: section.accentColor, color: COLORS.bg.primary }}
                      className="w-full py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
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
        style={{ backgroundColor: COLORS.bg.primary, borderTopColor: COLORS.border.light }}
        className="border-t py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={FaBook} label="Tutorials" value="50+" accentColor={COLORS.accent.primary} />
            <StatCard icon={FaCode} label="Code Examples" value="100+" accentColor={COLORS.accent.secondary} />
            <StatCard icon={FaVideo} label="Video Courses" value="200+" accentColor={COLORS.accent.primary} />
            <StatCard icon={FaUsers} label="Community Members" value="10K+" accentColor={COLORS.accent.primary} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accentColor }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{ backgroundColor: COLORS.bg.primary, borderColor: COLORS.border.light }}
      className="rounded-lg p-6 border text-center"
    >
      <Icon className="text-3xl mx-auto mb-3" style={{ color: accentColor }} />
      <div className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>{value}</div>
      <div className="text-sm mt-1" style={{ color: COLORS.text.secondary }}>{label}</div>
    </motion.div>
  );
}