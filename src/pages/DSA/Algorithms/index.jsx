import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, BarChart, GitBranch, Shuffle, Database, Lock } from 'lucide-react'
import AlgorithmCard from '../../../components/DSA/AlgorithmCard'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../../../utils/algorithmConstants'
import useDebounce from '../../../hooks/useDebounce'

const DSAAlgorithms = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        Showing {filteredAlgorithms.length} of {algorithmsWithDifficulty.length} algorithms
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algorithm, index) => (
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
    </div>
  )
}

export default DSAAlgorithms