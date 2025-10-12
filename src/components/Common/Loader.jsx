import { Brain } from 'lucide-react';

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-500" />
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700">Loading Algorithm Visualizer</p>
      <p className="mt-2 text-sm text-gray-500">Preparing your visualization experience...</p>
    </div>
  </div>
);

export default Loader;