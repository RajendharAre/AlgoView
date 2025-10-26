import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Lightbulb, Heart, MessageCircle, Share2 } from 'lucide-react'

const Ideas = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Ideas' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'ai', name: 'AI/ML' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'iot', name: 'IoT' },
    { id: 'gaming', name: 'Gaming' }
  ]

  const ideas = [
    {
      id: 1,
      title: 'Algorithm Visualization Platform',
      description: 'A web platform to visualize complex algorithms step-by-step with interactive controls.',
      author: 'Alex Johnson',
      category: 'web',
      likes: 24,
      comments: 8,
      tags: ['react', 'd3.js', 'algorithms']
    },
    {
      id: 2,
      title: 'Smart Home Automation System',
      description: 'IoT-based home automation system with voice control and mobile app integration.',
      author: 'Sarah Williams',
      category: 'iot',
      likes: 42,
      comments: 15,
      tags: ['iot', 'arduino', 'mobile']
    },
    {
      id: 3,
      title: 'AI-Powered Code Review Assistant',
      description: 'Machine learning model that automatically reviews code for best practices and potential bugs.',
      author: 'Michael Chen',
      category: 'ai',
      likes: 67,
      comments: 23,
      tags: ['ai', 'ml', 'devtools']
    },
    {
      id: 4,
      title: 'Decentralized Social Media Platform',
      description: 'Blockchain-based social media platform with user-owned data and token rewards.',
      author: 'Emma Rodriguez',
      category: 'blockchain',
      likes: 89,
      comments: 31,
      tags: ['blockchain', 'ethereum', 'web3']
    },
    {
      id: 5,
      title: 'AR Navigation App for Campuses',
      description: 'Augmented reality navigation app for university campuses with indoor positioning.',
      author: 'David Kim',
      category: 'mobile',
      likes: 35,
      comments: 12,
      tags: ['ar', 'mobile', 'navigation']
    },
    {
      id: 6,
      title: 'Procedural World Generation for Games',
      description: 'Algorithm for generating infinite, unique game worlds with realistic terrain and ecosystems.',
      author: 'James Wilson',
      category: 'gaming',
      likes: 56,
      comments: 19,
      tags: ['gaming', 'algorithms', 'graphics']
    }
  ]

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Innovation Ideas
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Discover inspiring project ideas, share your concepts, and collaborate with our community 
          of innovators and developers.
        </motion.p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
              <Plus size={18} className="mr-2" />
              New Idea
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {categories.find(cat => cat.id === idea.category)?.name}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h3>
              <p className="text-gray-600 mb-4">{idea.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {idea.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  by {idea.author}
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                    <Heart size={16} className="mr-1" />
                    <span className="text-sm">{idea.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                    <MessageCircle size={16} className="mr-1" />
                    <span className="text-sm">{idea.comments}</span>
                  </button>
                  <button className="text-gray-500 hover:text-blue-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default Ideas