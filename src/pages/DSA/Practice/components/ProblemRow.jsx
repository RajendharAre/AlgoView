import { CheckCircle, Star, RefreshCw } from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: 'text-green-600 bg-green-50',
  Medium: 'text-amber-600 bg-amber-50',
  Hard: 'text-red-600 bg-red-50',
};

const ProblemRow = ({
  problem,
  isCompleted,
  isFavorite,
  isAutoChecking,
  onSolveClick,
  onFavoriteClick,
  onVerifyClick,
}) => {
  return (
    <div
      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors ${
        isCompleted ? 'bg-green-50' : ''
      } ${isAutoChecking ? 'bg-blue-50' : ''}`}
    >
      {/* Status */}
      <div className="col-span-1 flex justify-center">
        {isAutoChecking ? (
          <div className="animate-spin">
            <div className="h-5 w-5 rounded-full border-2 border-[#a7d1d9] border-t-[#c3e6ec]"></div>
          </div>
        ) : isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
        )}
      </div>

      {/* Title */}
      <div className="col-span-6">
        <button
          onClick={onSolveClick}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium text-left"
          title="Click to solve on LeetCode"
        >
          {problem.title}
        </button>
      </div>

      {/* Difficulty */}
      <div className="col-span-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            DIFFICULTY_COLORS[problem.difficulty]
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Acceptance Rate */}
      <div className="col-span-2">
        <span className="text-sm text-gray-600">{problem.acceptance}%</span>
      </div>

      {/* Bookmark Icon */}
      <div className="col-span-1 flex justify-end gap-1">
        <button
          onClick={onVerifyClick}
          disabled={isAutoChecking}
          className={`p-1.5 rounded transition-colors ${
            isAutoChecking
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
          title="Verify solution on LeetCode"
        >
          <RefreshCw className={`h-4 w-4 ${isAutoChecking ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onFavoriteClick}
          className={`p-1.5 rounded transition-colors ${
            isFavorite
              ? 'text-yellow-500 bg-yellow-50'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
          }`}
          title="Bookmark problem"
        >
          <Star
            className="h-4 w-4"
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </div>
  );
};

export default ProblemRow;
