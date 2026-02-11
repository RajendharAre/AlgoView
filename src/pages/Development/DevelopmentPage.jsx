import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TutorialsSection from './Tutorials/TutorialsSection';
import CodeExamplesSection from './CodeExamples/CodeExamplesSection';

// Placeholder components (will build others next)
const CodeExamplesPlaceholder = () => <div className="p-8 text-center text-gray-500">Coming Soon: Code Examples</div>;
const VideosPlaceholder = () => <div className="p-8 text-center text-gray-500">Coming Soon: Video Courses</div>;
const DocsPlaceholder = () => <div className="p-8 text-center text-gray-500">Coming Soon: Documentation</div>;
const CommunityPlaceholder = () => <div className="p-8 text-center text-gray-500">Coming Soon: Community</div>;
const QAPlaceholder = () => <div className="p-8 text-center text-gray-500">Coming Soon: Q&A Forum</div>;

export default function DevelopmentPage() {
  const [activeSection, setActiveSection] = useState('tutorials');

  const sections = [
    { id: 'tutorials', label: 'Tutorials', icon: '📚' },
    { id: 'codes', label: 'Code Examples', icon: '💻' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'docs', label: 'Documentation', icon: '📖' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'qa', label: 'Q&A', icon: '❓' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'tutorials':
        return <TutorialsSection />;
      case 'codes':
        return <CodeExamplesSection />;
      case 'videos':
        return <VideosPlaceholder />;
      case 'docs':
        return <DocsPlaceholder />;
      case 'community':
        return <CommunityPlaceholder />;
      case 'qa':
        return <QAPlaceholder />;
      default:
        return <TutorialsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Development Hub</h1>
          <p className="text-lg text-gray-600">
            Master DSA, Web Development, and more with tutorials, code examples, and community resources.
          </p>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeSection === section.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {renderSection()}
      </motion.div>
    </div>
  );
}
