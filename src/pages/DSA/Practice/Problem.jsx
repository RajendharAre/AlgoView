import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Code, Terminal } from 'lucide-react'

const DSAProblemPractice = () => {
  const { problemId } = useParams()
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  \n}')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [timeLimit, setTimeLimit] = useState(1000)

  // Mock problem data
  const problem = {
    id: problemId || 'two-sum',
    title: problemId ? `Problem: ${problemId}` : 'Two Sum',
    difficulty: 'Medium',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ]
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setOutput('Running code...')
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('Code executed successfully!\nOutput: [0, 1]')
      setIsRunning(false)
    }, 1500)
  }

  const handleReset = () => {
    setCode('// Write your solution here\nfunction solution() {\n  \n}')
    setOutput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Problem Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">Problem ID: {problem.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings size={16} />
                  Settings
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Problem Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{problem.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Examples</h2>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="font-mono text-sm">
                      <div className="text-gray-600">Input:</div>
                      <div className="text-gray-900 mb-2">{example.input}</div>
                      <div className="text-gray-600">Output:</div>
                      <div className="text-gray-900 mb-2">{example.output}</div>
                      <div className="text-gray-600">Explanation:</div>
                      <div className="text-gray-700">{example.explanation}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Solution.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">Time Limit: {timeLimit}ms</div>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
                  spellCheck="false"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Pause size={16} />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Run Code
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              {/* Output */}
              {output && (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
                    <Terminal size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Output</span>
                  </div>
                  <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DSAProblemPractice