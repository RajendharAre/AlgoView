import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal, BookOpen, Code, Globe, FileQuestion } from 'lucide-react'

const AlgorithmCard = ({ algorithm }) => {
  const [showMenu, setShowMenu] = useState(false)

  // Map difficulty levels to styles
  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Map categories to badges
  const getCategoryBadge = (category) => {
    const categoryMap = {
      sorting: { name: 'Sorting', color: 'bg-blue-100 text-blue-800' },
      searching: { name: 'Searching', color: 'bg-purple-100 text-purple-800' },
      graph: { name: 'Graph', color: 'bg-green-100 text-green-800' },
      dp: { name: 'Dynamic Programming', color: 'bg-yellow-100 text-yellow-800' },
      pathfinding: { name: 'Pathfinding', color: 'bg-indigo-100 text-indigo-800' }
    }
    
    const categoryInfo = categoryMap[category] || { name: category, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
        {categoryInfo.name}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{algorithm.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {getCategoryBadge(algorithm.category)}
            {algorithm.difficulty && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyStyle(algorithm.difficulty)}`}>
                {algorithm.difficulty}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <MoreHorizontal size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <BookOpen size={16} className="mr-2" />
                View Article
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Code size={16} className="mr-2" />
                See Code
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Globe size={16} className="mr-2" />
                Real-world Examples
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FileQuestion size={16} className="mr-2" />
                Interview Questions
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{algorithm.description}</p>
      
      {algorithm.complexity && (
        <div className="mb-4 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Time:</span>
            <span className="font-medium text-gray-900">{algorithm.complexity.time?.average || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Space:</span>
            <span className="font-medium text-gray-900">{algorithm.complexity.space || 'N/A'}</span>
          </div>
        </div>
      )}
      
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
    </div>
  )
}

export default AlgorithmCard