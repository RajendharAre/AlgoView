import { Search, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'difficulty-asc', label: 'Difficulty (Easy → Hard)' },
  { value: 'difficulty-desc', label: 'Difficulty (Hard → Easy)' },
  { value: 'acceptance-asc', label: 'Acceptance (Low → High)' },
  { value: 'acceptance-desc', label: 'Acceptance (High → Low)' },
];

const SearchAndSort = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalProblems,
  completedCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                  'Sort by...'}
              </span>
            </div>
            <span
              className={`text-gray-400 transition-transform ${
                isDropdownOpen ? 'transform rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-full sm:w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700'
                  } ${option !== SORT_OPTIONS[SORT_OPTIONS.length - 1] ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          <span className="font-semibold text-gray-700">{completedCount}</span>
          <span> / {totalProblems}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort;
