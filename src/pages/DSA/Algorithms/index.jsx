import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, BarChart, GitBranch, Shuffle, Database, Lock } from 'lucide-react'

const DSAAlgorithms = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Algorithms', count: 200 },
    { id: 'sorting', name: 'Sorting', count: 12, icon: Shuffle },
    { id: 'searching', name: 'Searching', count: 8, icon: Search },
    { id: 'graph', name: 'Graph', count: 25, icon: GitBranch },
    { id: 'tree', name: 'Tree', count: 18, icon: BookOpen },
    { id: 'dynamic', name: 'Dynamic Programming', count: 32, icon: BarChart },
    { id: 'greedy', name: 'Greedy', count: 15, icon: Database },
    { id: 'backtracking', name: 'Backtracking', count: 14, icon: Lock }
  ]

  const algorithms = [
    { id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting', difficulty: 'Easy', description: 'Simple sorting algorithm that repeatedly steps through the list' },
    { id: 'merge-sort', name: 'Merge Sort', category: 'sorting', difficulty: 'Medium', description: 'Efficient, stable sorting algorithm using divide-and-conquer' },
    { id: 'quick-sort', name: 'Quick Sort', category: 'sorting', difficulty: 'Medium', description: 'Highly efficient sorting algorithm using partitioning' },
    { id: 'binary-search', name: 'Binary Search', category: 'searching', difficulty: 'Easy', description: 'Search algorithm that finds position of target in sorted array' },
    { id: 'dfs', name: 'Depth First Search', category: 'graph', difficulty: 'Medium', description: 'Graph traversal algorithm exploring as far as possible' },
    { id: 'bfs', name: 'Breadth First Search', category: 'graph', difficulty: 'Medium', description: 'Graph traversal algorithm exploring neighbor nodes first' },
    { id: 'dijkstra', name: 'Dijkstra Algorithm', category: 'graph', difficulty: 'Hard', description: 'Algorithm for finding shortest paths in weighted graph' }
  ]

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          algo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || algo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Algorithm Library</h1>
        <p className="text-gray-600">Explore our comprehensive collection of 200+ algorithms with visualizations</p>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {categories.map((category) => {
          const Icon = category.icon || BookOpen
          return (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-lg p-4 border cursor-pointer transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-blue-100 rounded-lg mb-2">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.count} algorithms</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Algorithms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algorithm, index) => (
          <motion.div
            key={algorithm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{algorithm.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{algorithm.category}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                algorithm.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-800' 
                  : algorithm.difficulty === 'Medium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {algorithm.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{algorithm.description}</p>
            <div className="flex justify-between items-center">
              <Link
                to={`/dsa/visualization/${algorithm.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Visualize
              </Link>
              <Link
                to={`/dsa/practice/${algorithm.id}`}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Practice
              </Link>
            </div>
          </motion.div>
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