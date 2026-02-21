import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  Shuffle, 
  GitBranch, 
  BarChart,
  Search as SearchIcon, 
  ChevronRight,
  ChevronDown
} from 'lucide-react'

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({
    sorting: false,
    searching: false,
    graph: false,
    tree: false,
    dynamic: false,
    greedy: false,
    backtracking: false
  })

  const location = useLocation()

  // Handle navigation and category expansion/collapse
  useEffect(() => {
    // Check if we're in the DSA section with algorithm routes
    const isDSAAlgorithmRoute = location.pathname.includes('bubbleSort') || 
                               location.pathname.includes('selectionSort') ||
                               location.pathname.includes('insertionSort') ||
                               location.pathname.includes('mergeSort') ||
                               location.pathname.includes('quickSort') ||
                               location.pathname.includes('heapSort') ||
                               location.pathname.includes('bucketSort') ||
                               location.pathname.includes('linearSearch') || 
                               location.pathname.includes('binarySearch') ||
                               location.pathname.includes('aStar') ||
                               location.pathname.includes('dfs') || 
                               location.pathname.includes('bfs') || 
                               location.pathname.includes('dijkstra') ||
                               location.pathname.includes('bellmanFord') ||
                               location.pathname.includes('floydWarshall') ||
                               location.pathname.includes('kruskal') ||
                               location.pathname.includes('prim') ||
                               location.pathname.includes('topologicalSort') ||
                               location.pathname.includes('kosaraju') ||
                               location.pathname.includes('fibonacci') ||
                               location.pathname.includes('coinChange') ||
                               location.pathname.includes('knapsack') ||
                               location.pathname.includes('longestCommonSubsequence') ||
                               location.pathname.includes('editDistance');
    
    if (isDSAAlgorithmRoute) {
      // Auto-expand the category that matches the current route
      if (location.pathname.includes('bubbleSort') || 
          location.pathname.includes('selectionSort') ||
          location.pathname.includes('insertionSort') ||
          location.pathname.includes('mergeSort') ||
          location.pathname.includes('quickSort') ||
          location.pathname.includes('heapSort') ||
          location.pathname.includes('bucketSort')) {
        setExpandedCategories(prev => ({
          ...prev,
          sorting: true,
          searching: false,
          graph: false,
          tree: false,
          dynamic: false,
          greedy: false,
          backtracking: false
        }));
      } else if (location.pathname.includes('linearSearch') || 
                 location.pathname.includes('binarySearch') ||
                 location.pathname.includes('aStar')) {
        setExpandedCategories(prev => ({
          ...prev,
          sorting: false,
          searching: true,
          graph: false,
          tree: false,
          dynamic: false,
          greedy: false,
          backtracking: false
        }));
      } else if (location.pathname.includes('dfs') || 
                 location.pathname.includes('bfs') || 
                 location.pathname.includes('dijkstra') ||
                 location.pathname.includes('bellmanFord') ||
                 location.pathname.includes('floydWarshall') ||
                 location.pathname.includes('graphColoring') ||
                 location.pathname.includes('kruskal') ||
                 location.pathname.includes('prim') ||
                 location.pathname.includes('topologicalSort') ||
                 location.pathname.includes('kosaraju')) {
        setExpandedCategories(prev => ({
          ...prev,
          sorting: false,
          searching: false,
          graph: true,
          tree: false,
          dynamic: false,
          greedy: false,
          backtracking: false
        }));
      } else if (location.pathname.includes('fibonacci') ||
                 location.pathname.includes('coinChange') ||
                 location.pathname.includes('knapsack') ||
                 location.pathname.includes('longestCommonSubsequence') ||
                 location.pathname.includes('editDistance')) {
        setExpandedCategories(prev => ({
          ...prev,
          sorting: false,
          searching: false,
          graph: false,
          tree: false,
          dynamic: true, // DP algorithms
          greedy: false,
          backtracking: false
        }));
      }
    } else {
      // If navigating away from DSA section, close all dropdowns
      setExpandedCategories(prev => {
        const newExpanded = {};
        Object.keys(prev).forEach(key => {
          newExpanded[key] = false;
        });
        return newExpanded;
      });
    }
  }, [location.pathname])

  // Toggle category with controlled behavior - only one open at a time
  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      // If the clicked category is already open, close it
      if (prev[category]) {
        return {
          ...prev,
          [category]: false
        };
      } else {
        // Close all categories and open only the clicked one
        const newExpanded = {};
        Object.keys(prev).forEach(key => {
          newExpanded[key] = key === category;
        });
        return newExpanded;
      }
    });
  }

  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: Shuffle,
      algorithms: [
        { id: 'bubbleSort', name: 'Bubble Sort' },
        { id: 'bucketSort', name: 'Bucket Sort' },
        { id: 'heapSort', name: 'Heap Sort' },
        { id: 'insertionSort', name: 'Insertion Sort' },
        { id: 'mergeSort', name: 'Merge Sort' },
        { id: 'quickSort', name: 'Quick Sort' },
        { id: 'selectionSort', name: 'Selection Sort' }
      ]
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      icon: SearchIcon,
      algorithms: [
        { id: 'aStar', name: 'A* Pathfinding' },
        { id: 'binarySearch', name: 'Binary Search' },
        { id: 'linearSearch', name: 'Linear Search' }
      ]
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      icon: GitBranch,
      algorithms: [
        { id: 'bellmanFord', name: 'Bellman-Ford Algorithm' },
        { id: 'bfs', name: 'Breadth First Search' },
        { id: 'dfs', name: 'Depth First Search' },
        { id: 'dijkstra', name: 'Dijkstra Algorithm' },
        { id: 'floydWarshall', name: 'Floyd-Warshall Algorithm' },
        { id: 'graphColoring', name: 'Graph Coloring' },
        { id: 'kosaraju', name: 'Kosaraju\'s Algorithm' },
        { id: 'kruskal', name: 'Kruskal\'s Algorithm' },
        { id: 'prim', name: 'Prim\'s Algorithm' },
        { id: 'topologicalSort', name: 'Topological Sort' }
      ]
    },
    {
      id: 'dynamic',
      name: 'DP Algorithms',
      icon: BarChart,
      algorithms: [
        { id: 'knapsack', name: '0/1 Knapsack' },
        { id: 'coinChange', name: 'Coin Change' },
        { id: 'editDistance', name: 'Edit Distance' },
        { id: 'fibonacci', name: 'Fibonacci' },
        { id: 'longestCommonSubsequence', name: 'Longest Common Subsequence' }
      ]
    }
  ]

  const filteredCategories = categories.map(category => {
    const filteredAlgorithms = category.algorithms
      .filter(algorithm =>
        algorithm.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name))
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
          <input
            type="text"
            placeholder="Search algorithms..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
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
                      className={`block px-4 py-2 ml-8 text-sm rounded-md transition-colors ${
                        location.pathname.includes(algorithm.id)
                          ? 'bg-blue-100 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
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
