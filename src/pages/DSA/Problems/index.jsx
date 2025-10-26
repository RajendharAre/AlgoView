import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, Target, Trophy, Users } from 'lucide-react'

const DSAProblems = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSheet, setSelectedSheet] = useState('all')

  const problemSheets = [
    { id: 'all', name: 'All Problems', count: 1200 },
    { id: 'striver', name: 'Striver Sheet', count: 184, description: 'Curated by Raj Vikramaditya (Striver)' },
    { id: 'love-babbar', name: 'Love Babbar 450', count: 450, description: 'Popular problem sheet for interview prep' },
    { id: 'neetcode', name: 'NeetCode 150', count: 150, description: 'Curated by NeetCode for coding interviews' },
    { id: 'blind-75', name: 'Blind 75', count: 75, description: 'Essential coding interview problems' }
  ]

  const problems = [
    { id: 'two-sum', name: 'Two Sum', sheet: 'striver', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
    { id: 'reverse-linked-list', name: 'Reverse Linked List', sheet: 'striver', difficulty: 'Easy', tags: ['Linked List'] },
    { id: 'valid-parentheses', name: 'Valid Parentheses', sheet: 'striver', difficulty: 'Easy', tags: ['Stack', 'String'] },
    { id: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', sheet: 'striver', difficulty: 'Easy', tags: ['Linked List', 'Recursion'] },
    { id: 'best-time-to-buy-sell-stock', name: 'Best Time to Buy and Sell Stock', sheet: 'striver', difficulty: 'Easy', tags: ['Array', 'DP'] },
    { id: 'valid-palindrome', name: 'Valid Palindrome', sheet: 'love-babbar', difficulty: 'Easy', tags: ['Two Pointers', 'String'] }
  ]

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSheet = selectedSheet === 'all' || problem.sheet === selectedSheet
    return matchesSearch && matchesSheet
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Sheets</h1>
        <p className="text-gray-600">Practice problems from popular sheets used by top tech companies</p>
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
              placeholder="Search problems or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {problemSheets.map(sheet => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name} ({sheet.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problem Sheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {problemSheets.filter(sheet => sheet.id !== 'all').map((sheet, index) => (
          <motion.div
            key={sheet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {sheet.count} problems
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{sheet.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{sheet.description}</p>
            <div className="flex justify-between items-center">
              <Link
                to={`/dsa/problems/${sheet.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Problems
              </Link>
              <div className="flex items-center text-gray-500 text-sm">
                <Users size={14} className="mr-1" />
                <span>1.2k practicing</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Problems</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredProblems.map((problem, index) => (
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
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <Link 
                      to={`/dsa/practice/${problem.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
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
                  <span className="text-sm text-gray-500 mr-4">
                    {problemSheets.find(s => s.id === problem.sheet)?.name}
                  </span>
                  <Link
                    to={`/dsa/practice/${problem.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Solve
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DSAProblems