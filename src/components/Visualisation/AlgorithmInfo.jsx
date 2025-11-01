import { Dice5, RefreshCcw, Play } from 'lucide-react'

const AlgorithmInfo = ({ 
  algoInfo
}) => {
  return (
    <div className="space-y-4">
      {/* Complexity Analysis Panel */}
      {algoInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mx-4 md:mx-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Complexity Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-700 font-medium uppercase tracking-wide">Time Complexity</div>
              <div className="mt-1">
                <div className="text-sm text-gray-600">Best: {algoInfo.complexity?.time?.best || 'N/A'}</div>
                <div className="text-sm text-gray-600">Average: {algoInfo.complexity?.time?.average || 'N/A'}</div>
                <div className="text-sm text-gray-600">Worst: {algoInfo.complexity?.time?.worst || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-purple-700 font-medium uppercase tracking-wide">Space Complexity</div>
              <div className="mt-1 text-gray-700 font-medium">{algoInfo.complexity?.space || 'N/A'}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 font-medium uppercase tracking-wide">Properties</div>
              <div className="mt-1">
                <div className="text-sm text-gray-600">
                  Stable: {algoInfo.stable !== undefined ? (algoInfo.stable ? 'Yes' : 'No') : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  In-place: {algoInfo.inPlace !== undefined ? (algoInfo.inPlace ? 'Yes' : 'No') : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Display Panel */}
      {algoInfo?.code && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mx-4 md:mx-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Implementation</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium flex justify-between items-center">
              <span>JavaScript Implementation</span>
              <button 
                onClick={() => navigator.clipboard.writeText(algoInfo.code.javascript)}
                className="text-gray-300 hover:text-white"
              >
                Copy Code
              </button>
            </div>
            <pre className="p-4 bg-gray-50 text-sm overflow-x-auto max-h-60">
              <code>{algoInfo.code.javascript}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlgorithmInfo