import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, BarChart, GitBranch, Shuffle, Database, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import AlgorithmCard from '../../../components/DSA/AlgorithmCard'
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Algorithm Library</h1>
        <p className="text-gray-600">Explore our comprehensive collection of algorithms with visualizations</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className=""
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {(indexOfFirstAlgorithm + 1)}-{Math.min(indexOfLastAlgorithm, filteredAlgorithms.length)} of {filteredAlgorithms.length} algorithms
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAlgorithms.map((algorithm, index) => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No algorithms found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredAlgorithms.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4 inline" />
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
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