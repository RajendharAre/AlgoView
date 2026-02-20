import React, { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * VideoModal Component
 * Displays video player in modal with iframe embed
 * Handles keyboard shortcuts (Escape) and outside clicks
 * Simplified - shows only title, description, and video player
 */
const VideoModal = memo(({
  video,
  isOpen,
  onClose
}) => {
  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!video) return null;

  const { title, videoUrl, description } = video;

  // Validate video URL
  const isValidUrl = videoUrl && videoUrl.includes('embed');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700 z-10">
                <h2 className="text-xl font-bold text-white line-clamp-1 flex-1">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
                  aria-label="Close modal"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative w-full bg-black aspect-video">
                {isValidUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={videoUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="text-center">
                      <p className="text-white text-lg font-semibold mb-2">Video URL Invalid</p>
                      <p className="text-gray-400 text-sm">The video source could not be loaded</p>
                      {videoUrl && (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Watch on YouTube
                          <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="px-6 py-6 space-y-4 border-t border-gray-200">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

                {/* Description */}
                {description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Course Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 flex-wrap">
                  {isValidUrl && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <FaExternalLinkAlt size={14} />
                      Open on YouTube
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Close
                  </button>
                </div>

                {/* Keyboard Hint */}
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                  💡 Press ESC to close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

VideoModal.displayName = 'VideoModal';

export default VideoModal;
