const ProblemHeader = ({
  totalProblems,
  completedCount,
  leetcodeUsername,
  completionPercentage,
}) => {
  return (
    <div className="px-6 py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              LeetCode Practice
            </h1>
            <p className="text-gray-600">
              Master data structures and algorithms
            </p>
          </div>
          {leetcodeUsername && (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Connected</p>
              <p className="text-blue-600 font-semibold">@{leetcodeUsername}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {completedCount} of {totalProblems} problems solved
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemHeader;
