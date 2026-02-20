import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

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
  accentColor = '#343a40',
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
    <div className="dropdown" ref={dropdownRef}>
      {label && (
        <label
          style={labelStyle}
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...buttonStyle,
          borderColor: isOpen ? accentColor : buttonStyle?.borderColor,
          boxShadow: isOpen ? `0 0 0 3px ${accentColor}20` : 'none',
          color: '#000000',
        }}
        className="w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-between relative text-left bg-white"
      >
        <span style={{ color: '#000000' }}>{getDisplayText()}</span>
        <FaChevronDown
          size={11}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#000000' }}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={contentRef}
          style={contentStyle}
          className="dropdown-content absolute right-0 left-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {options.map((option, idx) => (
            <button
              key={option.value || idx}
              onClick={() => handleSelect(option.value)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                ...itemStyle,
                backgroundColor: value === option.value ? '#e9ecef' : 'white',
                fontWeight: value === option.value ? '600' : '400',
                color: '#000000',
              }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-gray-100 text-gray-900"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
