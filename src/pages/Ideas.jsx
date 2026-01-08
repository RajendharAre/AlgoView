import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Plus, MessageCircle, Heart, Share2, Filter, Search } from 'lucide-react';

const Ideas = () => {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "Algorithm Visualization Platform",
      description: "Interactive platform for visualizing different algorithms with step-by-step breakdowns",
      author: "John Doe",
      date: "2024-01-15",
      likes: 24,
      comments: 8,
      tags: ["DSA", "Education", "Visualization"],
      featured: true
    },
    {
      id: 2,
      title: "Code Interview Simulator",
      description: "Realistic coding interview environment with timer and video recording",
      author: "Jane Smith",
      date: "2024-01-10",
      likes: 18,
      comments: 5,
      tags: ["Interview", "Practice", "Assessment"]
    },
    {
      id: 3,
      title: "Collaborative Learning Platform",
      description: "Real-time collaborative coding environment for peer learning",
      author: "Mike Johnson",
      date: "2024-01-08",
      likes: 32,
      comments: 12,
      tags: ["Collaboration", "Learning", "Real-time"]
    },
    {
      id: 4,
      title: "AI-Powered Code Reviewer",
      description: "Automated code review system with suggestions and best practices",
      author: "Sarah Williams",
      date: "2024-01-05",
      likes: 15,
      comments: 3,
      tags: ["AI", "Review", "Automation"]
    },
    {
      id: 5,
      title: "Algorithm Performance Analyzer",
      description: "Tool to compare time and space complexity of different algorithms visually",
      author: "David Brown",
      date: "2024-01-02",
      likes: 27,
      comments: 9,
      tags: ["Analysis", "Performance", "Comparison"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = ['DSA', 'Education', 'Visualization', 'Interview', 'Practice', 'Collaboration', 'Learning', 'AI', 'Review', 'Analysis', 'Performance', 'Automation', 'Real-time'];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => idea.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
                Ideas & Suggestions
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Share your ideas and explore innovative concepts for our platform
              </p>
            </div>
            <Link
              to="#"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Idea
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {idea.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2">
                  <span className="text-white text-sm font-medium">Featured Idea</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {idea.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {idea.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {idea.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>by {idea.author}</span>
                    <span>{new Date(idea.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{idea.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{idea.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;