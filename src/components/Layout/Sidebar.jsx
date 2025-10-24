import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Search, Filter } from 'lucide-react'
import { ALGORITHMS } from '../../utils/algorithmConstants'

const COLORS = {
  tekhelet: '#3d348b', // Deep blue
  slateBlue: '#7678ed', // Purple-blue
  yellow: '#f7b801', // Selective Yellow
  tangerine: '#f18701', // Orange
  persimmon: '#f35b04', // Red-orange
}

const Sidebar = ({ selectedAlgorithm, onAlgorithmSelect }) => {
  const algorithmGroups = {
    'Sorting Algorithms': [
      'bubbleSort',
      'quickSort',
      'mergeSort',
      'insertionSort',
      'selectionSort',
    ],
    'Searching Algorithms': ['linearSearch', 'binarySearch'],
    'Graph Algorithms': ['dijkstra', 'bfs', 'dfs'],
  }

  // Track which group is open (accordion style)
  const [openGroup, setOpenGroup] = useState('Sorting Algorithms')
  const [searchTerm, setSearchTerm] = useState('')

  const toggleGroup = category => {
    setOpenGroup(prev => (prev === category ? null : category))
  }

  // Filter algorithms based on search term
  const filteredAlgorithms = {}
  if (searchTerm) {
    Object.entries(algorithmGroups).forEach(([category, algorithms]) => {
      const filtered = algorithms.filter(algoId => {
        const algoName = ALGORITHMS[algoId.toUpperCase()]?.name || algoId
        return algoName.toLowerCase().includes(searchTerm.toLowerCase())
      })
      if (filtered.length > 0) {
        filteredAlgorithms[category] = filtered
      }
    })
  }

  const displayAlgorithms = searchTerm ? filteredAlgorithms : algorithmGroups

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Algorithms</h2>

        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(displayAlgorithms).map(([category, algorithms]) => {
          const isOpen = openGroup === category

          return (
            <div key={category} className="mb-3">
              {/* Category Header */}
              <button
                onClick={() => toggleGroup(category)}
                className="flex justify-between items-center w-full px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>{category}</span>
                {isOpen ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}
              </button>

              {/* Dropdown Items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-1"
                  >
                    <div className="space-y-1 ml-2">
                      {algorithms.map(algoId => {
                        const isActive = selectedAlgorithm === algoId
                        const algoName = ALGORITHMS[algoId.toUpperCase()]?.name || algoId
                        return (
                          <button
                            key={algoId}
                            onClick={() => onAlgorithmSelect(algoId)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {algoName}
                          </button>
                        )
                      })}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {searchTerm && Object.keys(displayAlgorithms).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">No algorithms found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          {Object.values(algorithmGroups).flat().length} algorithms available
        </p>
      </div>
    </div>
  )
}

export default Sidebar
