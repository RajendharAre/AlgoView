import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaVideo } from 'react-icons/fa';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import VideoFilters from './VideoFilters';
import { videosConfig, getTopics, getDifficulties } from '../../../utils/videosConfig';

// Color scheme
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
  },
  border: {
    light: '#dee2e6',
  },
  accent: {
    primary: '#343a40',
  }
};

/**
 * VideosPage Component
 * Main page for video courses with filtering and modal player
 * Implements lazy loading and performance optimization
 */
export default function VideosPage() {
  const navigate = useNavigate();

  // State Management
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Get filter options
  const topics = useMemo(() => getTopics(), []);
  const difficulties = useMemo(() => getDifficulties(), []);

  // Filter and search videos
  const filteredVideos = useMemo(() => {
    return videosConfig.filter(video => {
      // Search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.topic.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Topic filter
      if (selectedTopic && video.topic !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && video.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedTopic, selectedDifficulty]);

  // Handle video play
  const handlePlayVideo = useCallback((video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300); // delay to allow animation
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTopic('');
    setSelectedDifficulty('');
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: COLORS.bg.primary,
          borderBottomColor: COLORS.border.light
        }}
        className="border-b py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/development')}
            style={{ color: COLORS.text.primary }}
            className="flex items-center gap-2 hover:opacity-80 mb-4 font-semibold text-sm transition-opacity"
          >
            <FaArrowLeft size={16} />
            Back to Development Hub
          </button>

          {/* Title Section */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{ backgroundColor: `${COLORS.accent.primary}20` }}
                className="p-2 rounded-lg"
              >
                <FaVideo size={24} style={{ color: COLORS.accent.primary }} />
              </div>
              <h1 style={{ color: COLORS.text.primary }} className="text-4xl font-bold">
                Video Courses
              </h1>
            </div>
            <p style={{ color: COLORS.text.secondary }} className="text-lg mt-2">
              Curated video courses from top platforms for visual learners. Master new skills with hands-on video content.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <VideoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            onClearFilters={handleClearFilters}
            resultCount={filteredVideos.length}
            topics={topics}
            difficulties={difficulties}
            accentColor={COLORS.accent.primary}
          />
        </motion.div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
                accentColor={COLORS.accent.primary}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16"
          >
            <div
              style={{
                backgroundColor: COLORS.bg.secondary,
                borderColor: COLORS.border.light
              }}
              className="rounded-xl p-8 border-2 border-dashed text-center"
            >
              <FaVideo
                size={48}
                style={{ color: COLORS.text.secondary }}
                className="mx-auto mb-4 opacity-50"
              />
              <h2 style={{ color: COLORS.text.primary }} className="text-2xl font-bold mb-2">
                No Videos Found
              </h2>
              <p style={{ color: COLORS.text.secondary }} className="mb-6 text-lg">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                onClick={handleClearFilters}
                style={{
                  backgroundColor: COLORS.accent.primary,
                  color: '#ffffff'
                }}
                className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
