import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaEye, FaStar, FaTimes } from 'react-icons/fa';

export default function TutorialCard({ tutorial }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`star-${i}`} className="text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half-star" className="text-yellow-400 opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <>
      {/* Card */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
          <img
            src={tutorial.imageUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
          {tutorial.isPremium && (
            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <FaStar size={12} />
              Premium
            </div>
          )}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <button
              onClick={() => setShowDetails(true)}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View Details
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category & Difficulty */}
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {tutorial.category}
            </span>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
              {tutorial.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition">
            {tutorial.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {tutorial.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tutorial.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {tutorial.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{tutorial.tags.length - 2} more</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between mb-4 pb-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderStars(tutorial.rating)}
              </div>
              <span className="text-sm font-semibold text-gray-900">{tutorial.rating}</span>
              <span className="text-xs text-gray-600">({tutorial.ratingCount})</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <FaClock size={14} />
              <span>{tutorial.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FaEye size={14} />
              <span>{tutorial.views || 0} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="text-xs text-gray-600 border-t border-gray-200 pt-3">
            By <span className="font-semibold text-gray-900">{tutorial.author}</span>
          </div>

          {/* Read Button */}
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Start Learning
          </button>
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDetails(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{tutorial.title}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {tutorial.category}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaClock className="text-blue-600" /></div>
                  <div className="text-xs text-gray-600 mt-1">Duration</div>
                  <div className="text-lg font-bold">{tutorial.duration} min</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaEye className="text-blue-600" /></div>
                  <div className="text-xs text-gray-600 mt-1">Views</div>
                  <div className="text-lg font-bold">{tutorial.views || 0}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaStar className="text-blue-600" /></div>
                  <div className="text-xs text-gray-600 mt-1">Rating</div>
                  <div className="text-lg font-bold">{tutorial.rating}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaStar className="text-blue-600" /></div>
                  <div className="text-xs text-gray-600 mt-1">Reviews</div>
                  <div className="text-lg font-bold">{tutorial.ratingCount || 0}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{tutorial.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Author</div>
                <div className="text-lg font-bold text-gray-900">{tutorial.author}</div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg">
                {tutorial.isPremium ? 'Unlock Premium to Learn' : 'Start Learning Now'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
