import React, { memo, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DocumentationViewer Component
 * Modal/drawer for viewing embedded documentation
 * Handles both embedded iframe content and opening external links
 */
const DocumentationViewer = memo(({
  isOpen,
  onClose,
  documentation,
  isLoading
}) => {
  // Early returns BEFORE any hooks
  if (!documentation || !isOpen || !documentation.embedAllowed) {
    return null;
  }

  const { title, description, docUrl } = documentation;

  // Now we can safely call hooks (always in same order)
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-12 bottom-12 left-12 right-12 z-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <FaSpinner size={32} className="text-blue-500" />
                    </motion.div>
                  </div>
                )}

                {/* Embedded Content - For future use */}
                <div className="w-full h-full">
                  <iframe
                    src={docUrl}
                    title={title}
                    className="w-full h-full border-0"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-modals"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium">ESC</kbd> to close
                </p>
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <FaExternalLinkAlt size={14} />
                  Open Full Page
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

DocumentationViewer.displayName = 'DocumentationViewer';

export default DocumentationViewer;
