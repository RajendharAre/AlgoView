// Top 10 LeetCode categories with 30 UNIQUE problems each (10 Easy, 10 Medium, 10 Hard)
// NO DUPLICATES - Each problem appears only once across all 300 problems
import { UNIQUE_PROBLEMS, getRandomAcceptance } from './uniqueProblems';

export const PROBLEM_CATEGORIES = {
  arrays: {
    id: 'arrays',
    name: 'Arrays',
    iconName: 'Grid3X3',
    slug: 'array',
    description: 'Array manipulation and problems',
    totalProblems: 2080,
    displayProblems: 30,
  },
  strings: {
    id: 'strings',
    name: 'Strings',
    iconName: 'FileText',
    slug: 'string',
    description: 'String manipulation and pattern matching',
    totalProblems: 844,
    displayProblems: 30,
  },
  hashTable: {
    id: 'hashTable',
    name: 'Hash Table',
    iconName: 'Package',
    slug: 'hash-table',
    description: 'Hash map and dictionary problems',
    totalProblems: 771,
    displayProblems: 30,
  },
  math: {
    id: 'math',
    name: 'Math',
    iconName: 'Coins',
    slug: 'math',
    description: 'Mathematical problems and algorithms',
    totalProblems: 649,
    displayProblems: 30,
  },
  dynamicProgramming: {
    id: 'dynamicProgramming',
    name: 'Dynamic Programming',
    iconName: 'TrendingUp',
    slug: 'dynamic-programming',
    description: 'DP optimization problems',
    totalProblems: 636,
    displayProblems: 30,
  },
  sorting: {
    id: 'sorting',
    name: 'Sorting',
    iconName: 'ArrowLeftRight',
    slug: 'sorting',
    description: 'Sorting algorithms and problems',
    totalProblems: 495,
    displayProblems: 30,
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy',
    iconName: 'Repeat2',
    slug: 'greedy',
    description: 'Greedy algorithm problems',
    totalProblems: 455,
    displayProblems: 30,
  },
  depthFirstSearch: {
    id: 'depthFirstSearch',
    name: 'Depth-First Search',
    iconName: 'TreePine',
    slug: 'depth-first-search',
    description: 'DFS graph traversal problems',
    totalProblems: 333,
    displayProblems: 30,
  },
  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    iconName: 'Search',
    slug: 'binary-search',
    description: 'Binary search algorithms',
    totalProblems: 333,
    displayProblems: 30,
  },
  database: {
    id: 'database',
    name: 'Database',
    iconName: 'Globe',
    slug: 'database',
    description: 'SQL and database problems',
    totalProblems: 310,
    displayProblems: 30,
  },
};

// Helper function to generate problems for a category (uses UNIQUE problems)
export const generateSampleProblems = (categoryId, categoryName, count = 30) => {
  const problems = [];
  
  // Map category names to their unique problems
  const categoryKeyMap = {
    'Arrays': 'arrays',
    'Strings': 'strings',
    'Hash Table': 'hashTable',
    'Math': 'math',
    'Dynamic Programming': 'dynamicProgramming',
    'Sorting': 'sorting',
    'Greedy': 'greedy',
    'Depth-First Search': 'depthFirstSearch',
    'Binary Search': 'binarySearch',
    'Database': 'database',
  };

  const categoryKey = categoryKeyMap[categoryName];
  const categoryProblems = UNIQUE_PROBLEMS[categoryKey] || [];

  // Create problems with unique acceptance rates
  let problemNumber = 1;
  categoryProblems.forEach((problemData, index) => {
    const difficulty = index < 10 ? 'Easy' : index < 20 ? 'Medium' : 'Hard';

    problems.push({
      id: `${categoryId}-${index + 1}`,
      number: problemNumber++,
      title: problemData.title,
      difficulty: difficulty,
      categories: [categoryName],
      acceptance: getRandomAcceptance(), // Random unique per problem instance
      leetcodeUrl: `https://leetcode.com/problems/${problemData.slug}/`,
      leetcodeSlug: problemData.slug,
      isSolved: false,
      isFavourite: false,
    });
  });

  return problems;
};

// Export all problems for all categories
export const generateAllProblems = () => {
  const allProblems = [];

  Object.entries(PROBLEM_CATEGORIES).forEach(([key, category]) => {
    const categoryProblems = generateSampleProblems(category.id, category.name, 30);
    allProblems.push(...categoryProblems);
  });

  return allProblems;
};

// Convert flat problems array into DSA_CATEGORIES structure for UI
// Note: Icons are mapped in Practice.jsx where React is available
export const getDSACategoriesWithProblems = (iconMap) => {
  const dsaCategories = {};

  Object.entries(PROBLEM_CATEGORIES).forEach(([key, category]) => {
    const categoryProblems = generateSampleProblems(category.id, category.name, 30);
    
    dsaCategories[key] = {
      name: category.name,
      icon: iconMap[category.iconName],
      problems: categoryProblems
    };
  });

  return dsaCategories;
};
