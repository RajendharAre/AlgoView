import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Target, ChevronDown, ChevronRight, Grid3X3, FileText, Link as LinkIcon, Package, ClipboardList, Repeat2, ArrowLeftRight, Coins, Search, TreePine, Globe, TrendingUp, Zap, User, Check, AlertTriangle } from 'lucide-react';
import { validateProblemSolved, fetchRecentSubmissions } from '../../../services/leetcodeService';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { doc, setDoc, getDoc, onSnapshot, deleteField, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Mock data for DSA problems - this would ideally come from an API
const DSA_CATEGORIES = {
  arrays: {
    name: 'Arrays',
    icon: <Grid3X3 className="h-5 w-5" />,
    problems: [
      { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', leetcodeSlug: 'two-sum', completed: false },
      { id: 'best-time-to-buy-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', leetcodeSlug: 'best-time-to-buy-and-sell-stock', completed: false },
      { id: 'contains-duplicate', title: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', leetcodeSlug: 'contains-duplicate', completed: false },
      { id: 'product-of-array-except-self', title: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', leetcodeSlug: 'product-of-array-except-self', completed: false },
      { id: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', leetcodeSlug: 'maximum-subarray', completed: false },
      { id: '3sum', title: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/', leetcodeSlug: '3sum', completed: false },
      { id: 'container-with-most-water', title: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', leetcodeSlug: 'container-with-most-water', completed: false },
      { id: 'find-median-from-data-stream', title: 'Find Median from Data Stream', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', leetcodeSlug: 'find-median-from-data-stream', completed: false },
    ]
  },
  strings: {
    name: 'Strings',
    icon: <FileText className="h-5 w-5" />,
    problems: [
      { id: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', leetcodeSlug: 'longest-substring-without-repeating-characters', completed: false },
      { id: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', leetcodeSlug: 'longest-palindromic-substring', completed: false },
      { id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', leetcodeSlug: 'group-anagrams', completed: false },
      { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', completed: false },
      { id: 'implement-strstr', title: 'Implement strStr()', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/implement-strstr/', leetcodeSlug: 'implement-strstr', completed: false },
      { id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', leetcodeSlug: 'valid-anagram', completed: false },
    ]
  },
  linkedList: {
    name: 'Linked List',
    icon: <LinkIcon className="h-5 w-5" />,
    problems: [
      { id: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', leetcodeSlug: 'reverse-linked-list', completed: false },
      { id: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', leetcodeSlug: 'merge-two-sorted-lists', completed: false },
      { id: 'palindrome-linked-list', title: 'Palindrome Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/', leetcodeSlug: 'palindrome-linked-list', completed: false },
      { id: 'linked-list-cycle', title: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', leetcodeSlug: 'linked-list-cycle', completed: false },
      { id: 'remove-nth-node-from-end', title: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', leetcodeSlug: 'remove-nth-node-from-end-of-list', completed: false },
      { id: 'odd-even-linked-list', title: 'Odd Even Linked List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/odd-even-linked-list/', leetcodeSlug: 'odd-even-linked-list', completed: false },
    ]
  },
  stack: {
    name: 'Stack',
    icon: <Package className="h-5 w-5" />,
    problems: [
      { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', leetcodeSlug: 'valid-parentheses', completed: false },
      { id: 'min-stack', title: 'Min Stack', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', leetcodeSlug: 'min-stack', completed: false },
      { id: 'evaluate-reverse-polish-notation', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', leetcodeSlug: 'evaluate-reverse-polish-notation', completed: false },
      { id: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/', leetcodeSlug: 'generate-parentheses', completed: false },
    ]
  },
  queue: {
    name: 'Queue',
    icon: <ClipboardList className="h-5 w-5" />,
    problems: [
      { id: 'implement-queue-using-stacks', title: 'Implement Queue using Stacks', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/', leetcodeSlug: 'implement-queue-using-stacks', completed: false },
      { id: 'number-of-recent-calls', title: 'Number of Recent Calls', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/number-of-recent-calls/', leetcodeSlug: 'number-of-recent-calls', completed: false },
      { id: 'design-circular-queue', title: 'Design Circular Queue', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/design-circular-queue/', leetcodeSlug: 'design-circular-queue', completed: false },
    ]
  },
  recursion: {
    name: 'Recursion',
    icon: <Repeat2 className="h-5 w-5" />,
    problems: [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', leetcodeSlug: 'climbing-stairs', completed: false },
      { id: 'fibonacci-number', title: 'Fibonacci Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/', leetcodeSlug: 'fibonacci-number', completed: false },
      { id: 'factorial-trailing-zeroes', title: 'Factorial Trailing Zeroes', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/factorial-trailing-zeroes/', leetcodeSlug: 'factorial-trailing-zeroes', completed: false },
    ]
  },
  backtracking: {
    name: 'Backtracking',
    icon: <ArrowLeftRight className="h-5 w-5" />,
    problems: [
      { id: 'letter-combinations-of-phone-number', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-phone-number/', leetcodeSlug: 'letter-combinations-of-phone-number', completed: false },
      { id: 'n-queens', title: 'N-Queens', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', leetcodeSlug: 'n-queens', completed: false },
      { id: 'sudoku-solver', title: 'Sudoku Solver', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/', leetcodeSlug: 'sudoku-solver', completed: false },
      { id: 'combination-sum', title: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', leetcodeSlug: 'combination-sum', completed: false },
    ]
  },
  greedy: {
    name: 'Greedy',
    icon: <Coins className="h-5 w-5" />,
    problems: [
      { id: 'assign-cookies', title: 'Assign Cookies', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/assign-cookies/', leetcodeSlug: 'assign-cookies', completed: false },
      { id: 'lemonade-change', title: 'Lemonade Change', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/lemonade-change/', leetcodeSlug: 'lemonade-change', completed: false },
      { id: 'gas-station', title: 'Gas Station', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/gas-station/', leetcodeSlug: 'gas-station', completed: false },
      { id: 'jump-game', title: 'Jump Game', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', leetcodeSlug: 'jump-game', completed: false },
    ]
  },
  binarySearch: {
    name: 'Binary Search',
    icon: <Search className="h-5 w-5" />,
    problems: [
      { id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', leetcodeSlug: 'binary-search', completed: false },
      { id: 'search-insert-position', title: 'Search Insert Position', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/search-insert-position/', leetcodeSlug: 'search-insert-position', completed: false },
      { id: 'find-first-and-last-position', title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', leetcodeSlug: 'find-first-and-last-position-of-element-in-sorted-array', completed: false },
      { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', leetcodeSlug: 'search-in-rotated-sorted-array', completed: false },
    ]
  },
  trees: {
    name: 'Trees',
    icon: <TreePine className="h-5 w-5" />,
    problems: [
      { id: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', leetcodeSlug: 'maximum-depth-of-binary-tree', completed: false },
      { id: 'same-tree', title: 'Same Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', leetcodeSlug: 'same-tree', completed: false },
      { id: 'invert-binary-tree', title: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', leetcodeSlug: 'invert-binary-tree', completed: false },
      { id: 'validate-binary-search-tree', title: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', leetcodeSlug: 'validate-binary-search-tree', completed: false },
      { id: 'maximum-path-sum', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', leetcodeSlug: 'binary-tree-maximum-path-sum', completed: false },
    ]
  },
  graphs: {
    name: 'Graphs',
    icon: <Globe className="h-5 w-5" />,
    problems: [
      { id: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', leetcodeSlug: 'number-of-islands', completed: false },
      { id: 'clone-graph', title: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', leetcodeSlug: 'clone-graph', completed: false },
      { id: 'course-schedule', title: 'Course Schedule', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', leetcodeSlug: 'course-schedule', completed: false },
      { id: 'alien-dictionary', title: 'Alien Dictionary', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', leetcodeSlug: 'alien-dictionary', completed: false },
    ]
  },
  dynamicProgramming: {
    name: 'Dynamic Programming',
    icon: <TrendingUp className="h-5 w-5" />,
    problems: [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', leetcodeSlug: 'climbing-stairs', completed: false },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', leetcodeSlug: 'coin-change', completed: false },
      { id: 'longest-common-subsequence', title: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', leetcodeSlug: 'longest-common-subsequence', completed: false },
      { id: 'word-break', title: 'Word Break', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-break/', leetcodeSlug: 'word-break', completed: false },
    ]
  },
  bitManipulation: {
    name: 'Bit Manipulation',
    icon: <Zap className="h-5 w-5" />,
    problems: [
      { id: 'single-number', title: 'Single Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/single-number/', leetcodeSlug: 'single-number', completed: false },
      { id: 'number-of-1-bits', title: 'Number of 1 Bits', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/', leetcodeSlug: 'number-of-1-bits', completed: false },
      { id: 'counting-bits', title: 'Counting Bits', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/', leetcodeSlug: 'counting-bits', completed: false },
      { id: 'reverse-bits', title: 'Reverse Bits', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/', leetcodeSlug: 'reverse-bits', completed: false },
    ]
  }
};

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800'
};

const DIFFICULTY_ORDER = {
  Easy: 1,
  Medium: 2,
  Hard: 3
};

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, getLeetCodeUsername } = useProfile(user?.uid);
  
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingProblemId, setVerifyingProblemId] = useState(null);
  
  // State to force re-renders when needed
  const [forceRerender, setForceRerender] = useState(0);
  
  // Load user sessions to track solving state
  const [userSessions, setUserSessions] = useState({});
  
  // Get LeetCode username from profile
  const leetcodeUsername = getLeetCodeUsername();


  // Load user data from Firebase on mount
  useEffect(() => {
    if (!user) return;
    
    console.log('=== INITIALIZING USER DATA ===');
    console.log('User UID:', user.uid);
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      console.log('=== REAL-TIME LISTENER TRIGGERED ===');
      console.log('Document snapshot exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('Loaded user data from Firebase:', userData);
        
        // Load completed problems
        if (userData.completedProblems) {
          setCompletedProblems(new Set(Object.keys(userData.completedProblems).filter(
            problemId => userData.completedProblems[problemId]
          )));
        }
        
        // Load user sessions
        if (userData.sessions) {
          setUserSessions(userData.sessions || {});
        } else {
          setUserSessions({});
        }
        
        // LeetCode username is loaded via useProfile hook
        console.log('LeetCode username will be loaded via useProfile hook');
      } else {
        console.log('Document does not exist, initializing empty user document');
        
        // Initialize empty user document
        try {
          await setDoc(doc(db, 'users', user.uid), {
            completedProblems: {},
            sessions: {},
            leetcodeUsername: ''
          }, { merge: true });
          
          console.log('✅ Empty user document initialized');
          
          // Set initial empty states
          setUserSessions({});
          setCompletedProblems(new Set());
          // LeetCode username is managed via useProfile hook
        } catch (error) {
          console.error('❌ Error initializing user document:', error);
        }
      }
      
      console.log('=== REAL-TIME LISTENER UPDATE COMPLETE ===');
    });
    
    return () => unsubscribe();
  }, [user]);


  

  

  
  // Save problem session data when a user starts solving
  const saveSolveSession = async (problemId, leetcodeSlug, timestamp) => {
    if (!user) {
      console.log('No user authenticated, skipping session save for:', problemId);
      return;
    }
    
    const sessionData = {
      problemId,
      leetcodeSlug,
      clickedAt: timestamp
    };
    
    console.log('=== SAVE SESSION DEBUG ===');
    console.log('Problem ID:', problemId);
    console.log('LeetCode Slug:', leetcodeSlug);
    console.log('Timestamp:', timestamp);
    console.log('User UID:', user.uid);
    console.log('Session Data to Save:', sessionData);
    
    try {
      // Clear any existing sessions before creating a new one
      console.log('Clearing existing sessions before creating new session for:', problemId);
      
      // Only keep the new session, clearing any previous ones
      const updatedSessions = {
        [problemId]: sessionData
      };
      
      await setDoc(doc(db, 'users', user.uid), {
        sessions: updatedSessions
      }, { merge: true });
      
      console.log('✅ Session data saved successfully to Firebase (old sessions cleared)');
      
      // Manually update the userSessions state to reflect only the new session
      // Use callback form to ensure we're working with the latest state
      setUserSessions(prev => ({
        [problemId]: sessionData
      }));
      console.log('✅ UserSessions state updated with new session (old sessions cleared)');
      
      // Verify the save by reading it back immediately
      console.log('Verifying save by reading back from Firebase...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Read back user data:', userData);
        if (userData.sessions && userData.sessions[problemId]) {
          console.log('✅ Session verified in Firebase:', userData.sessions[problemId]);
        } else {
          console.log('❌ Session NOT found in Firebase after save');
          console.log('Available sessions:', userData.sessions);
        }
      } else {
        console.log('❌ User document not found after save');
      }
      
    } catch (error) {
      console.error('❌ Error saving session to Firebase:', error);
      throw error;
    }
  };
  

  

  




  // Helper function to determine if a problem is currently being solved
  const isSolving = (problemId) => {
    // A problem is considered 'solving' if there's a session for it but it's not yet completed
    const session = userSessions[problemId];
    const isSession = !!session;
    const isCompleted = completedProblems.has(problemId);
    
    // Only consider the problem as 'solving' if it has an active session and is not completed
    return isSession && !isCompleted;
  };
  
  // Clear the current solving session when user navigates away or starts a new problem
  const clearCurrentSession = async (problemId) => {
    if (!user) {
      console.log('No user authenticated, skipping session clear for:', problemId);
      return;
    }
    
    console.log('Clearing current session for problem:', problemId);
    
    try {
      // Fetch current document
      const currentDoc = await getDoc(doc(db, 'users', user.uid));
      let currentData = {};
      if (currentDoc.exists()) {
        currentData = currentDoc.data();
      }
      
      // Remove the session for this problem
      const updatedSessions = { ...currentData.sessions };
      delete updatedSessions[problemId];
      
      await setDoc(doc(db, 'users', user.uid), {
        sessions: updatedSessions
      }, { merge: true });
      
      console.log('✅ Session cleared from Firebase for problem:', problemId);
      
      // Update local state
      setUserSessions(prev => {
        const newState = { ...prev };
        delete newState[problemId];
        return newState;
      });
      
    } catch (error) {
      console.error('❌ Error clearing session from Firebase:', error);
    }
  };
  
  // Start solving a problem
  const startSolve = async (problem) => {
    if (!user) {
      alert('Please log in to track your progress');
      return;
    }
    
    // Clear any existing sessions before starting a new one
    if (Object.keys(userSessions).length > 0) {
      console.log('Clearing existing sessions before starting new problem:', problem.id);
      for (const existingProblemId of Object.keys(userSessions)) {
        await clearCurrentSession(existingProblemId);
      }
    }
    
    const slugToSave = problem.leetcodeSlug || problem.id;
    const timestamp = Date.now();
    
    console.log('Starting solve for problem:', problem.id, 'slug:', slugToSave, 'timestamp:', timestamp);
    
    // Save session to Firebase
    await saveSolveSession(problem.id, slugToSave, timestamp);
    
    console.log('Session saved, opening LeetCode...');
    
    // Open LeetCode in new tab
    window.open(problem.leetcodeUrl, '_blank');
    
    // Show confirmation message
    alert(`Session started for "${problem.title}"!\n\nAfter solving on LeetCode, click "Verify" to confirm completion.`);
  };
  
  
  // Verify a problem completion against LeetCode
  const verifyProblem = async (problem) => {
    console.log('\n=== VERIFY DEBUG START ===');
    console.log('Problem ID:', problem.id);
    console.log('Problem Object:', problem);
    console.log('User UID:', user?.uid);
    console.log('Username:', leetcodeUsername);
    console.log('Current userSessions state:', userSessions);
    console.log('Current completedProblems:', [...completedProblems]);
    
    console.log('\n=== STEP 1: Checking prerequisites ===');
    
    // First check if user has provided LeetCode username
    if (!leetcodeUsername) {
      console.log('❌ No LeetCode username found');
      
      // Show popup prompting user to add LeetCode profile in Profile page
      alert('LeetCode profile not found. Please add your LeetCode profile in your Profile page first.');
      navigate('/profile');
      return;
    }
    
    console.log('✅ LeetCode username found:', leetcodeUsername);
    
    console.log('\n=== STEP 2: Fetching session from Firebase ===');
    
    // IMPORTANT: Always fetch fresh session data from Firebase to avoid race conditions
    let session = null;
    
    if (user) {
      console.log('Attempting to fetch user document from Firebase for UID:', user.uid);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('Firebase response received');
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('✅ User document exists. Raw data:', userData);
          
          // Check if sessions field exists
          if (userData.sessions) {
            console.log('✅ Sessions field exists:', userData.sessions);
            
            // Get the session for this specific problem
            if (userData.sessions[problem.id]) {
              session = userData.sessions[problem.id];
              console.log('✅ Session found for problem', problem.id, ':', session);
            } else {
              console.log('❌ No session found for problem:', problem.id);
              console.log('Available sessions in Firebase:', Object.keys(userData.sessions || {}));
            }
          } else {
            console.log('❌ No sessions field in user document');
            console.log('User document structure:', Object.keys(userData));
          }
        } else {
          console.log('❌ User document does not exist in Firebase for UID:', user.uid);
        }
      } catch (error) {
        console.error('❌ Error fetching session from Firebase:', error);
        console.error('Error details:', error.message);
      }
    } else {
      console.log('❌ No user object available');
    }
    
    console.log('\n=== STEP 3: Session validation ===');
    
    // Check if session exists
    if (!session) {
      console.log('❌ NO SESSION FOUND for problem:', problem.id);
      console.log('This is why you see the "Please click Solve first" message');
      
      // Show detailed error with possible causes
      alert(
        'Session not found for this problem. Possible causes:\n\n' +
        '1. You may not have clicked "Solve" yet\n' +
        '2. Session data failed to save to Firebase\n' +
        '3. You might be using a different browser/device\n' +
        '4. Firebase authentication issue\n\n' +
        'Please try clicking "Solve" again and check the console for errors.'
      );
      return;
    }
    
    console.log('✅ Session found and validated:', session);
    console.log('Session clicked at:', new Date(session.clickedAt).toLocaleString());
    console.log('Current time:', new Date().toLocaleString());
    
    console.log('\n=== STEP 4: Preparing verification ===');
    
    // Determine the slug to use for verification
    const slugToCheck = problem.leetcodeSlug || session.leetcodeSlug || problem.id;
    
    console.log('Verification parameters:', {
      uiSlug: problem.leetcodeSlug,
      sessionSlug: session.leetcodeSlug,
      finalSlug: slugToCheck,
      sessionClickedAt: session.clickedAt,
      readableTime: new Date(session.clickedAt).toLocaleString()
    });
    
    // Additional debugging for the validation
    console.log('Preparing to validate problem solved with:', {
      username: leetcodeUsername,
      slug: slugToCheck,
      clickedAt: session.clickedAt,
      clickedAtDate: new Date(session.clickedAt).toISOString(),
      currentTime: new Date().toISOString()
    });
    
    // Set loading state
    setVerifyingProblemId(problem.id);
    
    try {
      console.log('\n=== STEP 5: Calling LeetCode API ===');
      console.log('Calling validateProblemSolved with:', {
        username: leetcodeUsername,
        slug: slugToCheck,
        clickedAt: session.clickedAt
      });
          
      // Validate if the user has solved this problem since starting the session
      const isSolved = await validateProblemSolved(
        leetcodeUsername,
        slugToCheck,
        session.clickedAt
      );
          
      console.log('\n=== STEP 6: Processing validation result ===');
      console.log('Validation result:', isSolved);
          
      // If the primary validation failed, try a more lenient check (any accepted submission)
      let finalResult = isSolved;
      if (!isSolved) {
        console.log('Primary validation failed, trying fallback check for any accepted submission...');
        try {
          const allSubmissions = await fetchRecentSubmissions(leetcodeUsername);
          console.log('All fetched submissions:', allSubmissions);
          console.log('Looking for slug:', slugToCheck);
          
          // Log all submission slugs for debugging
          console.log('All submission slugs:', allSubmissions.map(s => s.titleSlug));
          
          // Check for exact match first
          // Handle both string and numeric status codes
          const exactMatch = allSubmissions.find(submission => 
            submission.titleSlug === slugToCheck &&
            (submission.status === 'Accepted' || submission.status === 10)
          );
          
          if (exactMatch) {
            console.log('✅ Found exact match:', exactMatch);
          } else {
            console.log('❌ No exact match found for slug:', slugToCheck);
            // Look for partial matches
            const partialMatches = allSubmissions.filter(submission => 
              submission.titleSlug && submission.titleSlug.includes(slugToCheck)
            );
            console.log('Partial matches found:', partialMatches);
          }
          
          const fallbackCheck = !!exactMatch;
          console.log('Fallback validation result:', fallbackCheck);
          finalResult = fallbackCheck;
        } catch (fallbackError) {
          console.error('Fallback validation also failed:', fallbackError);
          console.error('Fallback error details:', fallbackError.message);
          finalResult = false;
        }
      }
            
      if (finalResult) {
        // Mark the problem as completed in Firebase
        // Use nested object structure for completedProblems
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
        
        // Update local state
        setCompletedProblems(prev => {
          const newSet = new Set(prev);
          newSet.add(problem.id);
          return newSet;
        });
        

        // Remove the session data since it's verified
        // Use updateDoc with deleteField for removing nested fields
        await updateDoc(doc(db, 'users', user.uid), {
          [`sessions.${problem.id}`]: deleteField(),
        });
        

        
        alert('🎉 Problem verified successfully! Great job!\n\n✨');
        
        // Force re-render
        setForceRerender(prev => prev + 1);
      } else {
        alert(
          '❌ No accepted submission found yet.\n\n' +
          'Please make sure:\n' +
          '1. You submitted a correct solution on LeetCode\n' +
          '2. Your submission status is "Accepted"\n' +
          '3. Your LeetCode profile is public\n' +
          '4. Recent submissions are visible\n\n' +
          'Wait a moment and try verifying again.'
        );
      }
    } catch (error) {
      console.error('Error during verification process:', error);
      
      alert(
        '❌ Error verifying problem.\n\n' +
        'Please check:\n' +
        '1. Your LeetCode username is correct\n' +
        '2. Your profile is public\n' +
        '3. You have internet connection\n' +
        '4. Backend server is running (localhost:5000)\n\n' +
        'Check browser console for detailed error information.'
      );
    } finally {
      // Reset loading state
      setVerifyingProblemId(null);
    }
  };

  // Calculate progress for each category
  const calculateProgress = (categoryName) => {
    const category = DSA_CATEGORIES[categoryName];
    if (!category) return { percentage: 0, completed: 0, total: 0 };
    
    const totalProblems = category.problems.length;
    const completedCount = category.problems.filter(problem => 
      completedProblems.has(problem.id)
    ).length;
    
    const percentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;
    
    return { percentage, completed: completedCount, total: totalProblems };
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const allProblems = Object.values(DSA_CATEGORIES).flatMap(cat => cat.problems);
    const totalProblems = allProblems.length;
    const completedCount = allProblems.filter(problem => 
      completedProblems.has(problem.id)
    ).length;
    
    const percentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;
    
    return { percentage, completed: completedCount, total: totalProblems };
  };

  const toggleCategory = (categoryKey) => {
    // If the clicked category is already open, close it; otherwise, open it
    setActiveCategory(activeCategory === categoryKey ? null : categoryKey);
  };

  const handleProblemComplete = (problemId) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      newSet.add(problemId);
      return newSet;
    });
  };

  const handleProblemUncomplete = (problemId) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      newSet.delete(problemId);
      return newSet;
    });
  };

  const toggleProblemCompletion = (problemId) => {
    if (completedProblems.has(problemId)) {
      handleProblemUncomplete(problemId);
    } else {
      handleProblemComplete(problemId);
    }
  };

  // Group problems by difficulty within each category
  const groupProblemsByDifficulty = (problems) => {
    const grouped = {
      Easy: [],
      Medium: [],
      Hard: []
    };
    
    problems.forEach(problem => {
      grouped[problem.difficulty].push(problem);
    });
    
    return grouped;
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                DSA Practice Problems
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Practice coding problems from LeetCode organized by category and difficulty
              </p>
            </div>
            
            {/* LeetCode Username Display */}
            <div className="flex flex-col items-end">
              {!user ? (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Please log in to use the practice features
                </div>
              ) : (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-600">
                    {leetcodeUsername ? `LeetCode: ${leetcodeUsername}` : 'No LeetCode profile set'}
                  </span>
                  <button
                    onClick={() => navigate('/profile')}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </div>
              )}
              {user && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Public profile required for verification</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-sm font-medium text-gray-600">
              {overallProgress.completed} / {overallProgress.total} problems completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress.percentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-sm font-medium text-gray-600">{overallProgress.percentage}%</span>
          </div>
        </div>



        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Categories with Problems */}
        <div className="space-y-4">
          {Object.entries(DSA_CATEGORIES).map(([key, category]) => {
            const progress = calculateProgress(key);
            const isExpanded = activeCategory === key;
            
            // Filter problems based on search term
            const filteredProblems = category.problems.filter(problem =>
              problem.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Group problems by difficulty
            const groupedProblems = groupProblemsByDifficulty(filteredProblems);
            
            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(key)}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <span className="ml-3 text-sm text-gray-500">
                      ({progress.completed}/{progress.total} completed)
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Problems Section */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    {/* Easy Problems */}
                    {groupedProblems.Easy.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-green-800 mb-3 flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Easy ({groupedProblems.Easy.length})
                        </h4>
                        <div className="space-y-3">
                          {groupedProblems.Easy.map((problem) => (
                            <div 
                              key={problem.id} 
                              className={`p-4 rounded-lg border-l-4 ${
                                completedProblems.has(problem.id) 
                                  ? 'border-l-green-500 bg-green-50' 
                                  : 'border-l-blue-500 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h5 className="font-medium text-gray-900 mr-3">
                                      {problem.title}
                                    </h5>
                                    {completedProblems.has(problem.id) && (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                  <button
                                    onClick={() => startSolve(problem)}
                                    disabled={!user}
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      user 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                  >
                                    <Target className="h-3 w-3 mr-1" />
                                    {isSolving(problem.id) ? 'Solving...' : 'Solve'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Verify button clicked for problem:', problem.id, {
                                        completed: completedProblems.has(problem.id),
                                        hasUsername: !!leetcodeUsername,
                                        isVerifying: verifyingProblemId === problem.id,
                                        sessions: userSessions[problem.id],
                                        clickedAt: userSessions[problem.id]?.clickedAt,
                                        allSessions: userSessions
                                      });
                                      verifyProblem(problem);
                                    }}
                                    disabled={
                                      completedProblems.has(problem.id) ||
                                      !leetcodeUsername ||
                                      verifyingProblemId === problem.id
                                    }
                                    data-problem-id={problem.id}
                                    data-action="verify"
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      completedProblems.has(problem.id)
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : (leetcodeUsername ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                    }`}
                                  >
                                    {verifyingProblemId === problem.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Verifying...
                                      </>
                                    ) : completedProblems.has(problem.id) ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verified
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verify
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Medium Problems */}
                    {groupedProblems.Medium.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-yellow-800 mb-3 flex items-center">
                          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                          Medium ({groupedProblems.Medium.length})
                        </h4>
                        <div className="space-y-3">
                          {groupedProblems.Medium.map((problem) => (
                            <div 
                              key={problem.id} 
                              className={`p-4 rounded-lg border-l-4 ${
                                completedProblems.has(problem.id) 
                                  ? 'border-l-green-500 bg-green-50' 
                                  : 'border-l-blue-500 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h5 className="font-medium text-gray-900 mr-3">
                                      {problem.title}
                                    </h5>
                                    {completedProblems.has(problem.id) && (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                  <button
                                    onClick={() => startSolve(problem)}
                                    disabled={!user}
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      user 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                  >
                                    <Target className="h-3 w-3 mr-1" />
                                    {isSolving(problem.id) ? 'Solving...' : 'Solve'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Verify button clicked for problem:', problem.id, {
                                        completed: completedProblems.has(problem.id),
                                        hasUsername: !!leetcodeUsername,
                                        isVerifying: verifyingProblemId === problem.id,
                                        sessions: userSessions[problem.id],
                                        clickedAt: userSessions[problem.id]?.clickedAt,
                                        allSessions: userSessions
                                      });
                                      verifyProblem(problem);
                                    }}
                                    disabled={
                                      completedProblems.has(problem.id) ||
                                      !leetcodeUsername ||
                                      verifyingProblemId === problem.id
                                    }
                                    data-problem-id={problem.id}
                                    data-action="verify"
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      completedProblems.has(problem.id)
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : (leetcodeUsername ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                    }`}
                                  >
                                    {verifyingProblemId === problem.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Verifying...
                                      </>
                                    ) : completedProblems.has(problem.id) ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verified
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verify
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Hard Problems */}
                    {groupedProblems.Hard.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-red-800 mb-3 flex items-center">
                          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          Hard ({groupedProblems.Hard.length})
                        </h4>
                        <div className="space-y-3">
                          {groupedProblems.Hard.map((problem) => (
                            <div 
                              key={problem.id} 
                              className={`p-4 rounded-lg border-l-4 ${
                                completedProblems.has(problem.id) 
                                  ? 'border-l-green-500 bg-green-50' 
                                  : 'border-l-blue-500 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h5 className="font-medium text-gray-900 mr-3">
                                      {problem.title}
                                    </h5>
                                    {completedProblems.has(problem.id) && (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                  <button
                                    onClick={() => startSolve(problem)}
                                    disabled={!user}
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      user 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                  >
                                    <Target className="h-3 w-3 mr-1" />
                                    {isSolving(problem.id) ? 'Solving...' : 'Solve'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Verify button clicked for problem:', problem.id, {
                                        completed: completedProblems.has(problem.id),
                                        hasUsername: !!leetcodeUsername,
                                        isVerifying: verifyingProblemId === problem.id,
                                        sessions: userSessions[problem.id],
                                        clickedAt: userSessions[problem.id]?.clickedAt,
                                        allSessions: userSessions
                                      });
                                      verifyProblem(problem);
                                    }}
                                    disabled={
                                      completedProblems.has(problem.id) ||
                                      !leetcodeUsername ||
                                      verifyingProblemId === problem.id
                                    }
                                    data-problem-id={problem.id}
                                    data-action="verify"
                                    className={`inline-flex items-center px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                                      completedProblems.has(problem.id)
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : (leetcodeUsername ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                    }`}
                                  >
                                    {verifyingProblemId === problem.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Verifying...
                                      </>
                                    ) : completedProblems.has(problem.id) ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verified
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Verify
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* No problems found message */}
                    {filteredProblems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No problems match your search criteria in this category.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Practice;