import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Search, Star, User, BookOpen } from 'lucide-react';
import { validateProblemSolved, fetchRecentSubmissions } from '../../../services/leetcodeService';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Import components
import ProblemHeader from './components/ProblemHeader';
import CategoryFilter from './components/CategoryFilter';
import SearchAndSort from './components/SearchAndSort';
import ProblemTable from './components/ProblemTable';
import MissingProfilePopup from './components/MissingProfilePopup';

// Import problem data
import { PROBLEM_CATEGORIES, generateAllProblems } from './data/problemsData';

const DIFFICULTY_ORDER = {
  Easy: 1,
  Medium: 2,
  Hard: 3
};

const PracticeRefactored = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, getLeetCodeUsername } = useProfile(user?.uid);
  
  // State Management
  const [allProblems, setAllProblems] = useState([]);
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [autoCheckingProblems, setAutoCheckingProblems] = useState(new Set());
  const [favoriteProblems, setFavoriteProblems] = useState(new Set());
  const [userSessions, setUserSessions] = useState({});
  const [checkedProblems, setCheckedProblems] = useState(new Set());
  const [showMissingProfilePopup, setShowMissingProfilePopup] = useState(false);

  const leetcodeUsername = getLeetCodeUsername();

  // Initialize problems data on mount
  useEffect(() => {
    const problems = generateAllProblems();
    setAllProblems(problems);
    // Set first category as default
    const firstCategoryId = Object.keys(PROBLEM_CATEGORIES)[0];
    setSelectedCategory(firstCategoryId);
  }, []);

  // Load user data from Firebase
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Load completed problems
        if (userData.completedProblems) {
          setCompletedProblems(new Set(
            Object.keys(userData.completedProblems).filter(
              problemId => userData.completedProblems[problemId]
            )
          ));
        }
        
        // Load user sessions
        if (userData.sessions) {
          setUserSessions(userData.sessions);
        }
        
        // Load favorites
        if (userData.favorites) {
          setFavoriteProblems(new Set(Object.keys(userData.favorites).filter(
            problemId => userData.favorites[problemId]
          )));
        }
      } else {
        // Initialize empty user document
        await setDoc(doc(db, 'users', user.uid), {
          completedProblems: {},
          sessions: {},
          favorites: {}
        }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-verify on window focus
  useEffect(() => {
    if (!user || !leetcodeUsername || allProblems.length === 0) return;

    const handleWindowFocus = async () => {
      console.log('=== AUTO-CHECK ON WINDOW FOCUS ===');
      
      for (const problemId of Object.keys(userSessions)) {
        if (!completedProblems.has(problemId) && !checkedProblems.has(problemId)) {
          const problem = allProblems.find(p => p.id === problemId);
          if (problem) {
            console.log(`Auto-checking: ${problem.title}`);
            await verifyProblem(problem, true);
          }
        }
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [user, leetcodeUsername, userSessions, completedProblems, checkedProblems, allProblems]);

  // Get filtered and sorted problems
  const filteredProblems = useMemo(() => {
    let problems = allProblems;

    // Filter by category
    if (selectedCategory) {
      problems = problems.filter(p => p.categories.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery) {
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return problems;
  }, [allProblems, selectedCategory, searchQuery]);

  // Sort problems
  const sortedProblems = useMemo(() => {
    const sorted = [...filteredProblems];
    
    if (sortBy === 'difficulty-asc') {
      sorted.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    } else if (sortBy === 'difficulty-desc') {
      sorted.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
    } else if (sortBy === 'acceptance-asc') {
      sorted.sort((a, b) => (a.acceptance || 0) - (b.acceptance || 0));
    } else if (sortBy === 'acceptance-desc') {
      sorted.sort((a, b) => (b.acceptance || 0) - (a.acceptance || 0));
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return sorted;
  }, [filteredProblems, sortBy]);

  // Calculate progress
  const completionPercentage = useMemo(() => {
    if (filteredProblems.length === 0) return 0;
    const completed = filteredProblems.filter(p => completedProblems.has(p.id)).length;
    return Math.round((completed / filteredProblems.length) * 100);
  }, [filteredProblems, completedProblems]);

  // Save solve session
  const saveSolveSession = async (problemId, leetcodeSlug) => {
    if (!user) return;

    const sessionData = {
      problemId,
      leetcodeSlug,
      clickedAt: Date.now()
    };

    try {
      // Clear existing sessions and save new one
      await setDoc(doc(db, 'users', user.uid), {
        sessions: { [problemId]: sessionData }
      }, { merge: true });

      setUserSessions({ [problemId]: sessionData });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Start solving a problem
  const startSolve = async (problem) => {
    if (!user) {
      alert('Please log in to track your progress');
      return;
    }

    if (!leetcodeUsername) {
      setShowMissingProfilePopup(true);
      return;
    }

    await saveSolveSession(problem.id, problem.leetcodeSlug);
    window.open(problem.leetcodeUrl, '_blank');
  };

  // Verify problem completion
  const verifyProblem = async (problem, isAutoCheck = false) => {
    if (!leetcodeUsername || !userSessions[problem.id]) return;

    if (isAutoCheck) {
      setAutoCheckingProblems(prev => new Set([...prev, problem.id]));
    }

    try {
      const session = userSessions[problem.id];
      const slugToCheck = problem.leetcodeSlug || session.leetcodeSlug;

      // Validate with LeetCode API
      const isSolved = await validateProblemSolved(
        leetcodeUsername,
        slugToCheck,
        session.clickedAt
      );

      if (isSolved) {
        // Mark as completed
        const currentDoc = await getDoc(doc(db, 'users', user.uid));
        let currentData = {};
        if (currentDoc.exists()) {
          currentData = currentDoc.data();
        }

        const updatedCompletedProblems = {
          ...currentData.completedProblems,
          [problem.id]: true
        };

        await setDoc(doc(db, 'users', user.uid), {
          completedProblems: updatedCompletedProblems,
        }, { merge: true });

        setCompletedProblems(prev => {
          const newSet = new Set(prev);
          newSet.add(problem.id);
          return newSet;
        });

        // Remove session
        await updateDoc(doc(db, 'users', user.uid), {
          [`sessions.${problem.id}`]: deleteField(),
        });

        setCheckedProblems(prev => new Set([...prev, problem.id]));

        if (!isAutoCheck) {
          alert('🎉 Problem verified successfully!');
        }
      } else if (!isAutoCheck) {
        alert('❌ Problem not solved yet. Please complete it on LeetCode.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (!isAutoCheck) {
        alert('Error verifying problem. Please try again.');
      }
    } finally {
      if (isAutoCheck) {
        setAutoCheckingProblems(prev => {
          const newSet = new Set(prev);
          newSet.delete(problem.id);
          return newSet;
        });
      }
    }
  };

  // Toggle favorite
  const toggleFavorite = async (problemId) => {
    setFavoriteProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });

    if (user) {
      try {
        const currentDoc = await getDoc(doc(db, 'users', user.uid));
        let currentData = {};
        if (currentDoc.exists()) {
          currentData = currentDoc.data();
        }

        const newStatus = !favoriteProblems.has(problemId);
        const updatedFavorites = {
          ...currentData.favorites,
          [problemId]: newStatus
        };

        await setDoc(doc(db, 'users', user.uid), {
          favorites: updatedFavorites,
        }, { merge: true });
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    }
  };

  // Get category array
  const categories = Object.entries(PROBLEM_CATEGORIES).map(([key, value]) => ({
    id: key,
    name: value.name,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ProblemHeader
        totalProblems={filteredProblems.length}
        completedCount={sortedProblems.filter(p => completedProblems.has(p.id)).length}
        leetcodeUsername={leetcodeUsername}
        completionPercentage={completionPercentage}
      />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Search and Sort */}
      <SearchAndSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalProblems={filteredProblems.length}
        completedCount={sortedProblems.filter(p => completedProblems.has(p.id)).length}
      />

      {/* Problem Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProblemTable
          problems={sortedProblems}
          completedProblems={completedProblems}
          favoriteProblems={favoriteProblems}
          autoCheckingProblems={autoCheckingProblems}
          onSolveClick={startSolve}
          onFavoriteClick={toggleFavorite}
        />
      </div>

      {/* Missing Profile Popup */}
      <MissingProfilePopup
        isOpen={showMissingProfilePopup}
        onClose={() => setShowMissingProfilePopup(false)}
        onNavigateToProfile={() => {
          setShowMissingProfilePopup(false);
          navigate('/profile');
        }}
      />
    </div>
  );
};

export default PracticeRefactored;
