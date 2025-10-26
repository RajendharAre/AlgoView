import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Play, Save, Upload, Download, Settings, BookOpen, Target } from 'lucide-react'

const DSAPractice = () => {
  const [code, setCode] = useState(`// Write your solution here
function solution() {
  // Your code goes here
  return;
}

// Test cases
console.log(solution());
`)
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' }
  ]

  const problems = [
    { id: 'two-sum', name: 'Two Sum', difficulty: 'Easy', acceptance: '45%' },
    { id: 'reverse-linked-list', name: 'Reverse Linked List', difficulty: 'Easy', acceptance: '68%' },
    { id: 'valid-parentheses', name: 'Valid Parentheses', difficulty: 'Easy', acceptance: '39%' },
    { id: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', difficulty: 'Easy', acceptance: '50%' },
    { id: 'best-time-to-buy-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', acceptance: '53%' }
  ]

  const handleRunCode = () => {
    setOutput('Running code...\nOutput will appear here')
    // In a real implementation, this would execute the code
    setTimeout(() => {
      setOutput('Code executed successfully!\nNo output returned.')
    }, 1000)
  }

  const handleSaveCode = () => {
    // In a real implementation, this would save the code
    alert('Code saved successfully!')
  }

  return (
    <div className="flex h-full">
      {/* Problem List Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Problems</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {problems.map((problem) => (
              <Link
                key={problem.id}
                to={`/dsa/practice/${problem.id}`}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{problem.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        problem.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800' 
                          : problem.difficulty === 'Medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {problem.acceptance}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Code Practice</h1>
              <p className="text-gray-600">Solve problems in our integrated development environment</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              <button
                onClick={handleSaveCode}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleRunCode}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Play size={16} className="mr-2" />
                Run
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full font-mono text-sm p-4 border-0 focus:ring-0 resize-none"
              spellCheck="false"
            />
          </div>
          
          {/* Output Panel */}
          <div className="h-48 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Output</h3>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Upload size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Download size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 font-mono text-sm whitespace-pre-wrap h-32 overflow-y-auto">
              {output || 'Run your code to see output here'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DSAPractice