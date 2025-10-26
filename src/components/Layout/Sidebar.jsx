import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, BookOpen, BarChart, GitBranch, Shuffle, Database, Lock, Binary } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'sorting', name: 'Sorting', count: 12, icon: Shuffle },
    { id: 'searching', name: 'Searching', count: 8, icon: Search },
    { id: 'graph', name: 'Graph', count: 25, icon: GitBranch },
    { id: 'tree', name: 'Tree', count: 18, icon: Binary },
    { id: 'dynamic', name: 'Dynamic Programming', count: 32, icon: BarChart },
    { id: 'greedy', name: 'Greedy', count: 15, icon: Database },
    { id: 'backtracking', name: 'Backtracking', count: 14, icon: Lock }
  ]

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          const isActive = location.pathname.includes(`/dsa/algorithms/${category.id}`)
          
          return (
            <Link
              key={category.id}
              to={`/dsa/algorithms/${category.id}`}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="flex-shrink-0 h-5 w-5 mr-3" />
              <span className="flex-1">{category.name}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {category.count}
              </span>
            </Link>
          )
        })}
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No categories found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar;