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
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-white transition-all duration-200 cursor-pointer"
            style={isDropdownOpen ? { borderColor: '#343a40', boxShadow: '0 0 0 3px rgba(52,58,64,0.12)', backgroundColor: '#fff' } : {}}
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                  'Sort by...'}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c757d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
              {SORT_OPTIONS.map((option, idx) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                    sortBy === option.value
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
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
