import { useState, useMemo } from 'react';

// Hook for searching content
export const useSearch = (items, searchableFields = ['title', 'description', 'tags']) => {
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowercaseSearch = searchTerm.toLowerCase();

    return items.filter(item => {
      return searchableFields.some(field => {
        const value = item[field];

        if (Array.isArray(value)) {
          return value.some(v =>
            typeof v === 'string' && v.toLowerCase().includes(lowercaseSearch)
          );
        }

        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercaseSearch);
        }

        return false;
      });
    });
  }, [items, searchTerm, searchableFields]);

  return { searchTerm, setSearchTerm, results };
};

// Hook for filtering content
export const useFilter = (items, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const results = useMemo(() => {
    return items.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true; // Skip empty filters

        const itemValue = item[key];

        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }

        return itemValue === filterValue;
      });
    });
  }, [items, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return { filters, updateFilter, clearFilters, results };
};

// Hook for sorting content
export const useSort = (items, initialSort = { field: 'rating', order: 'desc' }) => {
  const [sort, setSort] = useState(initialSort);

  const results = useMemo(() => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      let comparison = 0;

      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue - bValue;
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sort]);

  const updateSort = (field, order = 'asc') => {
    setSort({ field, order });
  };

  return { sort, updateSort, results };
};

// Combined hook for search + filter + sort
export const useContentFilter = (
  items,
  searchableFields = ['title', 'description'],
  initialFilters = {},
  initialSort = { field: 'rating', order: 'desc' }
) => {
  const { searchTerm, setSearchTerm, results: searchResults } = useSearch(items, searchableFields);
  const { filters, updateFilter, clearFilters, results: filteredResults } = useFilter(searchResults, initialFilters);
  const { sort, updateSort, results: sortedResults } = useSort(filteredResults, initialSort);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sort,
    updateSort,
    results: sortedResults,
    count: sortedResults.length
  };
};

// Hook for pagination
export const usePagination = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
