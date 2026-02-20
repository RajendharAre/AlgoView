import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, BarChart, GitBranch, Shuffle, Database, Lock, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import AlgorithmCard from '../../../components/DSA/AlgorithmCard'
import StyledDropdown from '../../../components/Common/StyledDropdown'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../../../utils/algorithmConstants'
import useDebounce from '../../../hooks/useDebounce'

const DSAAlgorithms = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const algorithmsPerPage = 12
  
  // Use debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Convert ALGORITHMS object to array and add difficulty levels
  const algorithmsWithDifficulty = useMemo(() => {
    return Object.values(ALGORITHMS).map(algo => ({
      ...algo,
      difficulty: algo.category === ALGORITHM_CATEGORIES.SORTING ? 'Medium' : 
                  algo.category === ALGORITHM_CATEGORIES.SEARCHING ? 'Easy' : 
                  algo.category === ALGORITHM_CATEGORIES.GRAPH ? 'Hard' : 'Medium'
    }))
  }, [])

  const categories = [
    { id: 'all', name: 'All Algorithms', count: algorithmsWithDifficulty.length },
    { id: ALGORITHM_CATEGORIES.SORTING, name: 'Sorting', count: algorithmsWithDifficulty.filter(a => a.category === ALGORITHM_CATEGORIES.SORTING).length, icon: Shuffle },
    { id: ALGORITHM_CATEGORIES.SEARCHING, name: 'Searching', count: algorithmsWithDifficulty.filter(a => a.category === ALGORITHM_CATEGORIES.SEARCHING).length, icon: Search },
    { id: ALGORITHM_CATEGORIES.GRAPH, name: 'Graph', count: algorithmsWithDifficulty.filter(a => a.category === ALGORITHM_CATEGORIES.GRAPH).length, icon: GitBranch },
    { id: ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING, name: 'Dynamic Programming', count: algorithmsWithDifficulty.filter(a => a.category === ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING).length, icon: BarChart },
    { id: ALGORITHM_CATEGORIES.PATHFINDING, name: 'Pathfinding', count: algorithmsWithDifficulty.filter(a => a.category === ALGORITHM_CATEGORIES.PATHFINDING).length, icon: Database }
  ]

  const filteredAlgorithms = useMemo(() => {
    return algorithmsWithDifficulty.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                            algo.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || algo.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [algorithmsWithDifficulty, debouncedSearchTerm, selectedCategory])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Paginate the filtered algorithms
  const indexOfLastAlgorithm = currentPage * algorithmsPerPage
  const indexOfFirstAlgorithm = indexOfLastAlgorithm - algorithmsPerPage
  const currentAlgorithms = filteredAlgorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm)

  // Calculate total pages
  const totalPages = Math.ceil(filteredAlgorithms.length / algorithmsPerPage)

  return (
    <div className="p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Explore Algorithms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Algorithm Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl">Discover and visualize algorithms with detailed explanations, complexity analysis, and interactive tutorials</p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">Search Algorithms</label>
            <input
              type="text"
              placeholder="Find an algorithm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none top-9">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex-1 md:flex-none md:min-w-96">
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">Algorithm Category</label>
            <StyledDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select algorithm type"
              options={categories.map(cat => ({
                value: cat.id,
                label: `${cat.name} (${cat.count})`
              }))}
              accentColor="#3b82f6"
            />
          </div>
        </div>
      </div>

      {/* Results count and info */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">
            {filteredAlgorithms.length === 0 
              ? 'No results found' 
              : `Showing ${(indexOfFirstAlgorithm + 1)}-${Math.min(indexOfLastAlgorithm, filteredAlgorithms.length)} of ${filteredAlgorithms.length}`
            }
          </span>
        </div>
        {filteredAlgorithms.length > 0 && (
          <span className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
            {filteredAlgorithms.length} Total
          </span>
        )}
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAlgorithms.map((algorithm, index) => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200"
        >
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Algorithms Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your search term or filter criteria to find what you're looking for</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {filteredAlgorithms.length > 0 && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center space-x-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300 hover:border-blue-400'
            }`}
          >
            <ChevronLeft className="h-4 w-4 inline" />
          </button>
          
          <div className="flex items-center space-x-2 px-4">
            <span className="text-sm font-semibold text-gray-700">
              Page <span className="text-blue-600">{currentPage}</span> of <span className="text-blue-600">{totalPages}</span>
            </span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300 hover:border-blue-400'
            }`}
          >
            <ChevronRight className="h-4 w-4 inline" />
          </button>
        </div>
      )}
    </div>
  )
}

export default DSAAlgorithms