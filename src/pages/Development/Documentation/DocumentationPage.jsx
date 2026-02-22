import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import {
  documentationConfig,
  getDocCategories,
  getDocDifficulties,
  filterDocumentation
} from '@/utils/documentationConfig';
import DocumentationFilters from './components/DocumentationFilters';
import DocumentationList from './components/DocumentationList';
import DocumentationViewer from './components/DocumentationViewer';

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

/**
 * DocumentationPage Component
 * Production-ready knowledge base interface
 * Similar to LeetCode problem list, developer portal aesthetic
 */
const DocumentationPage = () => {
  const navigate = useNavigate();
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Viewer state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get filter options
  const categories = useMemo(() => getDocCategories(), []);
  const difficulties = useMemo(() => getDocDifficulties(), []);

  // Filter documentation
  const filteredDocumentation = useMemo(() => {
    return filterDocumentation({
      docs: documentationConfig,
      searchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Handle row click
  const handleRowClick = useCallback((doc) => {
    // External links - open in new tab immediately
    if (!doc.embedAllowed) {
      window.open(doc.docUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Embeddable content - open in viewer
    setSelectedDoc(doc);
    setIsLoading(true);
    setIsViewerOpen(true);
    // Simulate loading (iframe will load asynchronously)
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle viewer close
  const handleViewerClose = useCallback(() => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedDoc(null), 300);
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ 
          backgroundColor: COLORS.bg.primary, 
          borderBottomColor: COLORS.border.light 
        }}
        className="border-b py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/development')}
            style={{ color: COLORS.text.primary }}
            className="flex items-center gap-2 hover:opacity-80 mb-4 font-semibold"
          >
            <FaArrowLeft size={16} />
            Back to Development Hub
          </button>
          <h1 style={{ color: COLORS.text.primary }} className="text-4xl font-bold mb-2">Documentation</h1>
          <p style={{ color: COLORS.text.secondary }} className="text-lg">
            Comprehensive knowledge base & reference materials covering React, JavaScript, Node.js, Firebase, and more.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          difficulties={difficulties}
          colors={COLORS}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Results */}
          {filteredDocumentation.length !== documentationConfig.length && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(52, 58, 64, 0.05)',
                borderColor: COLORS.border.light
              }}
              className="mb-6 p-4 border rounded-lg text-sm"
            >
              <strong style={{ color: COLORS.text.primary }}>Filtered results:</strong> 
              <span style={{ color: COLORS.text.secondary }}> Showing {filteredDocumentation.length} of {documentationConfig.length} entries</span>
            </motion.div>
          )}

          {/* Documentation List */}
          <DocumentationList
            documentation={filteredDocumentation}
            onRowClick={handleRowClick}
            accentColor={COLORS.accent.primary}
            colors={COLORS}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ color: COLORS.text.secondary }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm"
      >
        <p>
          💡 Tip: Click on any documentation entry to open it. External links open in a new tab.
        </p>
      </motion.div>

      {/* Documentation Viewer Modal */}
      <DocumentationViewer
        isOpen={isViewerOpen}
        onClose={handleViewerClose}
        documentation={selectedDoc}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DocumentationPage;
