import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, Target, Trophy, Users } from 'lucide-react'

const DSAProblems = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSheet, setSelectedSheet] = useState('all')

  const problemSheets = [
    { id: 'all', name: 'All Problems', count: 1200 },
    { id: 'striver', name: 'Striver Sheet', count: 184, description: 'Curated by Raj Vikramaditya (Striver)', url: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z' },
    { id: 'love-babbar', name: 'Love Babbar 450', count: 450, description: 'Popular problem sheet for interview prep', url: 'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view' },
    { id: 'neetcode', name: 'NeetCode 150', count: 150, description: 'Curated by NeetCode for coding interviews', url: 'https://leetcode.com/problem-list/plakya4j/' },
    { id: 'blind-75', name: 'Blind 75', count: 75, description: 'Essential coding interview problems', url: 'https://leetcode.com/problem-list/oizxjoit/' },
    { id: 'apna-college', name: 'Apna College', count: 200, description: 'DSA sheet from Apna College YouTube channel', url: 'https://docs.google.com/spreadsheets/d/1hXserPuxVoWMG9Hs7y8wVdRCJTcj3xMBAEYUOXQ5Xag/edit?pli=1&gid=0#gid=0' }
  ]

// Individual problems data is not used when only showing sheets

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Sheets</h1>
        <p className="text-gray-600">Practice problems from popular sheets used by top tech companies</p>
      </div>

      {/* Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-gray-600">
            Select a sheet to view its problems
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
              <a
                href={sheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Problems
              </a>
              <div className="flex items-center text-gray-500 text-sm">
                <Users size={14} className="mr-1" />
                <span>1.2k practicing</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


    </div>
  )
}

export default DSAProblems