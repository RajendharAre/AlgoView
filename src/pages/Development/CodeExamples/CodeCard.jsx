import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaTimes, FaCopy, FaCheck } from 'react-icons/fa';

const languageColors = {
  javascript: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', icon: '⚙️' },
  python: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: '🐍' },
  java: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: '☕' },
  cpp: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: '⚡' },
  go: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-700', icon: '🐹' }
};

export default function CodeCard({ codeExample }) {
  const [copied, setCopied] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColors = languageColors[codeExample.language] || languageColors.javascript;
  const codePreview = codeExample.code.split('\n').slice(0, 8).join('\n');
  const hasMoreCode = codeExample.code.split('\n').length > 8;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} size={12} />
      );
    }
    return stars;
  };

  return (
    <>
      {/* Card */}
      <motion.div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Language Header */}
        <div className={`p-4 border-b ${langColors.bg} border-gray-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{langColors.icon}</span>
              <div>
                <div className="text-xs text-gray-600">Language</div>
                <div className={`font-bold ${langColors.text}`}>
                  {codeExample.language.charAt(0).toUpperCase() + codeExample.language.slice(1)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Complexity</div>
              <div className="font-bold text-gray-900">{codeExample.complexity}</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="p-4 flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {codeExample.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {codeExample.description}
          </p>

          {/* Code Preview */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-hidden">
            <pre className="text-xs text-gray-100 font-mono line-clamp-5">
              <code>{codePreview}</code>
            </pre>
            {hasMoreCode && (
              <div className="text-xs text-gray-500 mt-2 text-center">
                ... [{codeExample.code.split('\n').length} lines]
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {codeExample.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats & Rating */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {renderStars(codeExample.rating)}
                <span className="text-sm font-semibold text-gray-900 ml-1">
                  {codeExample.rating}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                📋 {codeExample.copies} copies
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {copied ? (
              <>
                <FaCheck size={14} /> Copied
              </>
            ) : (
              <>
                <FaCopy size={14} /> Copy Code
              </>
            )}
          </button>
          <button
            onClick={() => setShowFullCode(true)}
            className="flex-1 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
          >
            View Full
          </button>
        </div>
      </motion.div>

      {/* Full Code Modal */}
      {showFullCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullCode(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{codeExample.title}</h2>
                <p className="text-gray-600 mt-1">{codeExample.description}</p>
              </div>
              <button
                onClick={() => setShowFullCode(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Code */}
            <div className="p-6">
              {/* Language & Complexity Bar */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{langColors.icon}</span>
                    <span className={`font-bold text-lg ${langColors.text}`}>
                      {codeExample.language.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Time Complexity: <span className="font-bold">{codeExample.complexity}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <FaCheck size={14} className="inline mr-1" /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <FaCopy size={14} className="inline mr-1" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Full Code */}
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto mb-6">
                <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
                  <code>{codeExample.code}</code>
                </pre>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {codeExample.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                    <FaStar size={12} /> Rating
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(codeExample.rating)}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mt-1">{codeExample.rating}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                    <FaCopy size={12} /> Copies
                  </div>
                  <div className="text-lg font-bold text-gray-900">{codeExample.copies}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Language</div>
                  <div className="text-lg font-bold text-gray-900">
                    {codeExample.language.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg">
                Use This Code
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
