import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Target, Users, CheckCircle } from 'lucide-react'

const DSAProblemSheet = () => {
  const { sheetId } = useParams()

  const sheetInfo = {
    striver: { 
      name: 'Striver Sheet', 
      description: 'Curated by Raj Vikramaditya (Striver) - 184 problems covering all essential DSA topics',
      totalProblems: 184,
      completed: 24
    },
    'love-babbar': { 
      name: 'Love Babbar 450', 
      description: 'Popular problem sheet for interview preparation with 450 handpicked problems',
      totalProblems: 450,
      completed: 0
    },
    neetcode: { 
      name: 'NeetCode 150', 
      description: 'Curated by NeetCode for coding interviews with 150 essential problems',
      totalProblems: 150,
      completed: 0
    },
    'blind-75': { 
      name: 'Blind 75', 
      description: 'Essential coding interview problems frequently asked in top tech companies',
      totalProblems: 75,
      completed: 0
    }
  }

  const sheetData = sheetInfo[sheetId] || { 
    name: 'Problem Sheet', 
    description: 'Collection of coding problems',
    totalProblems: 0,
    completed: 0
  }

  // Sample problems for each sheet
  const problemsBySheet = {
    striver: [
      { id: 'set-matrix-zeroes', name: 'Set Matrix Zeroes', difficulty: 'Medium', tags: ['Array'], completed: true },
      { id: 'pascal-triangle', name: 'Pascal Triangle', difficulty: 'Easy', tags: ['Array'], completed: true },
      { id: 'next-permutation', name: 'Next Permutation', difficulty: 'Medium', tags: ['Array'], completed: false },
      { id: 'max-subarray', name: 'Maximum Subarray', difficulty: 'Medium', tags: ['Array', 'DP'], completed: false },
      { id: 'sort-colors', name: 'Sort Colors', difficulty: 'Medium', tags: ['Array', 'Two Pointers'], completed: false }
    ],
    'love-babbar': [
      { id: 'reverse-array', name: 'Reverse Array', difficulty: 'Easy', tags: ['Array'], completed: false },
      { id: 'max-min-array', name: 'Find Maximum and Minimum', difficulty: 'Easy', tags: ['Array'], completed: false }
    ]
  }

  const problems = problemsBySheet[sheetId] || []

  const completionPercentage = sheetData.totalProblems > 0 
    ? Math.round((sheetData.completed / sheetData.totalProblems) * 100) 
    : 0

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link to="/dsa/problems" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={18} className="mr-2" />
          Back to All Problem Sheets
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sheetData.name}</h1>
            <p className="text-gray-600 mt-2">{sheetData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-gray-500">Completed</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">{sheetData.completed} of {sheetData.totalProblems} problems completed</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users size={18} className="mr-1" />
            <span>2.4k practicing this sheet</span>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Problems</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {problem.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <Link 
                      to={`/dsa/practice/${problem.id}`}
                      className={`text-lg font-medium hover:text-blue-600 ${
                        problem.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {problem.name}
                    </Link>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                        problem.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800' 
                          : problem.difficulty === 'Medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <div className="flex space-x-1">
                        {problem.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link
                    to={`/dsa/practice/${problem.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {problem.completed ? 'Review' : 'Solve'}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {problems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No problems in this sheet</h3>
            <p className="text-gray-500">This sheet is coming soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DSAProblemSheet