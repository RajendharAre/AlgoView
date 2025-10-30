import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Shuffle, 
  GitBranch, 
  Search as SearchIcon, 
  Binary, 
  BarChart, 
  Database, 
  Lock,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({
    sorting: false,
    searching: false,
    graph: false
  })

  // Initially expand the first category (sorting) as requested
  useEffect(() => {
    setExpandedCategories(prev => ({
      ...prev,
      sorting: true
    }))
  }, [])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: Shuffle,
      algorithms: [
        { id: 'bubbleSort', name: 'Bubble Sort' },
        { id: 'selectionSort', name: 'Selection Sort' },
        { id: 'insertionSort', name: 'Insertion Sort' },
        { id: 'mergeSort', name: 'Merge Sort' },
        { id: 'quickSort', name: 'Quick Sort' }
      ]
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      icon: SearchIcon,
      algorithms: [
        { id: 'linearSearch', name: 'Linear Search' },
        { id: 'binarySearch', name: 'Binary Search' }
      ]
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      icon: GitBranch,
      algorithms: [
        { id: 'dfs', name: 'Depth First Search' },
        { id: 'bfs', name: 'Breadth First Search' },
        { id: 'dijkstra', name: 'Dijkstra Algorithm' }
      ]
    }
  ]

  const filteredCategories = categories.map(category => {
    const filteredAlgorithms = category.algorithms.filter(algorithm =>
      algorithm.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return {
      ...category,
      algorithms: filteredAlgorithms
    }
  }).filter(category => category.algorithms.length > 0 || searchTerm === '')

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search algorithms..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          const isExpanded = expandedCategories[category.id]
          
          return (
            <div key={category.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="pb-2">
                  {category.algorithms.map((algorithm) => (
                    <Link
                      key={algorithm.id}
                      to={`/dsa/visualization/${algorithm.id}`}
                      className="block px-4 py-2 ml-8 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {algorithm.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar