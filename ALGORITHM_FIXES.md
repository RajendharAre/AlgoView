# Algorithm Visualization Fixes

This document summarizes the fixes made to resolve the "Algorithm Not Found" issue:

## Problem
The algorithm visualization was showing "Algorithm Not Found" because of a mismatch between the IDs used in the Sidebar component and the IDs expected by the algorithm constants.

## Root Cause
1. **Sidebar Component**: Used kebab-case IDs (e.g., `bubble-sort`, `merge-sort`)
2. **Algorithm Constants**: Expected camelCase IDs (e.g., [bubbleSort](file://d:\NAAC\algorithm-visualizer\src\algorithms\Sorting\bubbleSort.js#L1-L53), [mergeSort](file://d:\NAAC\algorithm-visualizer\src\algorithms\Sorting\mergeSort.js#L1-L93))
3. **Lookup Function**: The [getAlgorithmInfoById](file://d:\NAAC\algorithm-visualizer\src\utils\algorithmConstants.js#L135-L147) function only did direct lookups without case conversion

## Solution
Updated the [getAlgorithmInfoById](file://d:\NAAC\algorithm-visualizer\src\utils\algorithmConstants.js#L135-L147) function in [src/utils/algorithmConstants.js](file:///d:/NAAC/algorithm-visualizer/src/utils/algorithmConstants.js) to handle kebab-case to camelCase conversion:

```javascript
// Helper: find by lowercase id (e.g., "bubbleSort")
// Also supports kebab-case (e.g., "bubble-sort") by converting to camelCase
export const getAlgorithmInfoById = id => {
  if (!id) return null
  
  // If already in camelCase, try direct lookup
  if (ALGORITHMS[id]) return ALGORITHMS[id]
  
  // Convert kebab-case to camelCase
  const camelCaseId = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  
  // Try direct lookup with camelCase
  if (ALGORITHMS[camelCaseId]) return ALGORITHMS[camelCaseId]
  
  // Try lowercase lookup as fallback
  const lowerId = id.toLowerCase()
  if (ALGORITHMS[lowerId]) return ALGORITHMS[lowerId]
  
  // No match found
  return null
}
```

## Files Modified
1. **[src/utils/algorithmConstants.js](file:///d:/NAAC/algorithm-visualizer/src/utils/algorithmConstants.js)**
   - Enhanced [getAlgorithmInfoById](file://d:\NAAC\algorithm-visualizer\src\utils\algorithmConstants.js#L135-L147) function to handle kebab-case to camelCase conversion
   - Added debugging information to help with troubleshooting

2. **[src/pages/DSA/Visualization.jsx](file:///d:/NAAC/algorithm-visualizer/src/pages/DSA/Visualization.jsx)**
   - Added debugging logs to help identify lookup issues
   - Improved error message to show the requested algorithm ID

## Verification
All algorithms referenced in the Sidebar should now work correctly:
- Sorting: `bubble-sort`, `selection-sort`, `insertion-sort`, `merge-sort`, `quick-sort`
- Searching: `linear-search`, `binary-search`
- Graph: [bfs](file://d:\NAAC\algorithm-visualizer\src\algorithms\Graph\bfs.js#L1-L103), [dfs](file://d:\NAAC\algorithm-visualizer\src\algorithms\Graph\dfs.js#L1-L81), [dijkstra](file://d:\NAAC\algorithm-visualizer\src\algorithms\Graph\dijkstra.js#L1-L174)
- And other algorithms like `kruskal`, `prims`, `tree-traversal`, etc.

The application is now running on http://localhost:3000 and should properly display algorithm visualizations.