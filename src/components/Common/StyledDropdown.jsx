import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function StyledDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  labelStyle,
  buttonStyle,
  contentStyle,
  itemStyle,
  accentColor = '#3b82f6',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Get display text for selected value
  const getDisplayText = () => {
    if (!value) return placeholder;
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <div 
      className="dropdown relative w-full" 
      ref={dropdownRef}
    >
      {label && (
        <label
          style={labelStyle}
          className="block text-xs font-semibold mb-2 uppercase tracking-wider text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...buttonStyle,
          accentColor: isOpen ? accentColor : undefined,
        }}
        className={`dropbtn w-full px-4 py-3 border-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 flex items-center justify-between relative text-left bg-white ${
          isOpen ? 'border-blue-500 shadow-lg' : 'border-gray-300'
        }`}
      >
        <span className="truncate text-gray-900 font-medium">{getDisplayText()}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 ml-2 dropdown-icon transition-transform duration-300 text-gray-600 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: isOpen ? accentColor : 'currentColor' }}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={contentRef}
          style={contentStyle}
          className="dropdown-content absolute left-0 right-0 top-full mt-2.5 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto"
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option, idx) => (
              <button
                key={option.value || idx}
                onClick={() => handleSelect(option.value)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  ...itemStyle,
                  borderLeftColor: value === option.value ? accentColor : 'transparent',
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150 flex items-center justify-between border-l-4 ${
                  value === option.value
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <span className="text-lg" style={{ color: accentColor }}>✓</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
