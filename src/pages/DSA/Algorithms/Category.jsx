import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart, GitBranch, Shuffle, Database, Lock, BookOpen, Search } from 'lucide-react'

const DSAAlgorithmCategory = () => {
  const { category } = useParams()

  const categoryInfo = {
    sorting: { name: 'Sorting Algorithms', icon: Shuffle, description: 'Algorithms for arranging elements in a specific order' },
    searching: { name: 'Searching Algorithms', icon: Search, description: 'Algorithms for finding specific elements in data structures' },
    graph: { name: 'Graph Algorithms', icon: GitBranch, description: 'Algorithms for traversing and analyzing graph structures' },
    tree: { name: 'Tree Algorithms', icon: BookOpen, description: 'Algorithms for working with tree data structures' },
    dynamic: { name: 'Dynamic Programming', icon: BarChart, description: 'Algorithms that solve complex problems by breaking them down' },
    greedy: { name: 'Greedy Algorithms', icon: Database, description: 'Algorithms that make locally optimal choices' },
    backtracking: { name: 'Backtracking Algorithms', icon: Lock, description: 'Algorithms that explore all possible solutions' }
  }

  const categoryData = categoryInfo[category] || { 
    name: 'Algorithms', 
    icon: BookOpen, 
    description: 'Collection of algorithms' 
  }

  const Icon = categoryData.icon

  // Sample algorithms for each category
  const algorithmsByCategory = {
    sorting: [
      { id: 'bubble-sort', name: 'Bubble Sort', difficulty: 'Easy', description: 'Simple sorting algorithm that repeatedly steps through the list' },
      { id: 'selection-sort', name: 'Selection Sort', difficulty: 'Easy', description: 'In-place comparison sorting algorithm' },
      { id: 'insertion-sort', name: 'Insertion Sort', difficulty: 'Easy', description: 'Simple sorting algorithm that builds final sorted array' },
      { id: 'merge-sort', name: 'Merge Sort', difficulty: 'Medium', description: 'Efficient, stable sorting algorithm using divide-and-conquer' },
      { id: 'quick-sort', name: 'Quick Sort', difficulty: 'Medium', description: 'Highly efficient sorting algorithm using partitioning' },
      { id: 'heap-sort', name: 'Heap Sort', difficulty: 'Medium', description: 'Comparison based sorting algorithm using binary heap' }
    ],
    searching: [
      { id: 'linear-search', name: 'Linear Search', difficulty: 'Easy', description: 'Simple search algorithm that checks each element' },
      { id: 'binary-search', name: 'Binary Search', difficulty: 'Easy', description: 'Search algorithm that finds position of target in sorted array' }
    ],
    graph: [
      { id: 'dfs', name: 'Depth First Search', difficulty: 'Medium', description: 'Graph traversal algorithm exploring as far as possible' },
      { id: 'bfs', name: 'Breadth First Search', difficulty: 'Medium', description: 'Graph traversal algorithm exploring neighbor nodes first' },
      { id: 'dijkstra', name: 'Dijkstra Algorithm', difficulty: 'Hard', description: 'Algorithm for finding shortest paths in weighted graph' },
      { id: 'bellman-ford', name: 'Bellman Ford Algorithm', difficulty: 'Hard', description: 'Algorithm for computing shortest paths in weighted graph' },
      { id: 'floyd-warshall', name: 'Floyd Warshall Algorithm', difficulty: 'Hard', description: 'Algorithm for finding shortest paths in weighted graph' },
      { id: 'kruskal', name: 'Kruskal Algorithm', difficulty: 'Hard', description: 'Algorithm for finding minimum spanning tree' },
      { id: 'prims', name: 'Prim\'s Algorithm', difficulty: 'Hard', description: 'Algorithm for finding minimum spanning tree' }
    ]
  }

  const algorithms = algorithmsByCategory[category] || []

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link to="/dsa/algorithms" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={18} className="mr-2" />
          Back to All Algorithms
        </Link>
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryData.name}</h1>
            <p className="text-gray-600">{categoryData.description}</p>
          </div>
        </div>
      </div>

      {/* Algorithms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algorithm, index) => (
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

      {algorithms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No algorithms in this category</h3>
          <p className="text-gray-500">This category is coming soon!</p>
        </div>
      )}
    </div>
  )
}

export default DSAAlgorithmCategory