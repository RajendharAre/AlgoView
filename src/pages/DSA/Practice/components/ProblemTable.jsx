import ProblemRow from './ProblemRow';

const ProblemTable = ({
  problems,
  completedProblems,
  favoriteProblems,
  autoCheckingProblems,
  onSolveClick,
  onFavoriteClick,
  onVerifyClick,
}) => {
  if (!problems || problems.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-gray-500 text-lg">
          No problems found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 sticky top-0">
        <div className="col-span-1">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            Status
          </span>
        </div>
        <div className="col-span-6">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            Title
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            Difficulty
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            Acceptance
          </span>
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {problems.map((problem) => (
          <ProblemRow
            key={problem.id}
            problem={problem}
            isCompleted={completedProblems.has(problem.id)}
            isFavorite={favoriteProblems.has(problem.id)}
            isAutoChecking={autoCheckingProblems.has(problem.id)}
            onSolveClick={() => onSolveClick(problem)}
            onFavoriteClick={() => onFavoriteClick(problem.id)}
            onVerifyClick={() => onVerifyClick(problem)}
          />
        ))}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <span>
          {completedProblems.size} of {problems.length} solved
        </span>
      </div>
    </div>
  );
};

export default ProblemTable;
