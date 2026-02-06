import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Grid3X3, FileText, Package, ClipboardList, Repeat2, ArrowLeftRight, Coins, Search, TreePine, Globe, TrendingUp, User, AlertTriangle, Star } from 'lucide-react';
import { validateProblemSolved, fetchRecentSubmissions } from '../../../services/leetcodeService';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getDSACategoriesWithProblems, PROBLEM_CATEGORIES } from './data/problemsData';
import VerificationPopup from './components/VerificationPopup';

// ─── Icon map for categories ───────────────────────────────────
const iconMap = {
  Grid3X3: <Grid3X3 className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  ClipboardList: <ClipboardList className="h-5 w-5" />,
  Repeat2: <Repeat2 className="h-5 w-5" />,
  ArrowLeftRight: <ArrowLeftRight className="h-5 w-5" />,
  Coins: <Coins className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  TreePine: <TreePine className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
};

const DSA_CATEGORIES = getDSACategoriesWithProblems(iconMap);

const DIFFICULTY_COLORS = {
  Easy: 'text-green-600 bg-green-50',
  Medium: 'text-amber-600 bg-amber-50',
  Hard: 'text-red-600 bg-red-50',
};
const DIFFICULTY_ORDER = { Easy: 1, Medium: 2, Hard: 3 };

// ─── sessionStorage keys ───────────────────────────────────────
const SS_LAST_CLICKED = 'practice_lastClickedProblemId';
const SS_POPUP_PREFIX = 'practice_popupShown_';
const ssGet = (k) => sessionStorage.getItem(k);
const ssSet = (k, v) => sessionStorage.setItem(k, v);
const ssRemove = (k) => sessionStorage.removeItem(k);
const ssPopupKey = (id) => `${SS_POPUP_PREFIX}${id}`;

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────
const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLeetCodeUsername } = useProfile(user?.uid);

  // ─── State ───────────────────────────────────────────────────
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('difficulty');
  const [userSessions, setUserSessions] = useState({});

  // Single deterministic popup — no queue, no lock, no stacking
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    problemTitle: '',
  });

  // ─── Refs ────────────────────────────────────────────────────
  const currentProblemRef = useRef(null);   // The ONE active problem
  const focusTimerRef = useRef(null);       // 1-second-delay timer
  const autoDismissRef = useRef(null);      // Auto-dismiss timer
  const isInitialLoad = useRef(true);       // Suppress focus on first load
  const popupStats = useRef({ shown: 0, perProblem: {} }); // POPUP_TESTER stats

  const leetcodeUsername = getLeetCodeUsername();

  // ─── showPopup ───────────────────────────────────────────────
  const showPopup = useCallback((type, title, message, problemTitle, autoDismissMs = 6000) => {
    // Kill any pending auto-dismiss
    if (autoDismissRef.current) { clearTimeout(autoDismissRef.current); autoDismissRef.current = null; }

    console.log(`[POPUP] Show: "${title}" | problem="${problemTitle}" | dismiss=${autoDismissMs}ms`);
    setPopup({ isOpen: true, type, title, message, problemTitle });

    // Track stats
    popupStats.current.shown++;
    const pid = currentProblemRef.current?.id || 'unknown';
    popupStats.current.perProblem[pid] = (popupStats.current.perProblem[pid] || 0) + 1;

    if (autoDismissMs > 0) {
      autoDismissRef.current = setTimeout(() => {
        console.log(`[POPUP] Auto-dismiss: "${title}"`);
        setPopup((p) => ({ ...p, isOpen: false }));
        autoDismissRef.current = null;
      }, autoDismissMs);
    }
  }, []);

  // ─── closePopup ──────────────────────────────────────────────
  const closePopup = useCallback(() => {
    if (autoDismissRef.current) { clearTimeout(autoDismissRef.current); autoDismissRef.current = null; }
    console.log('[POPUP] Closed by user');
    setPopup((p) => ({ ...p, isOpen: false }));
  }, []);

  // ─── clearAllPopupState: total cleanup on problem switch ────
  const clearAllPopupState = useCallback(() => {
    if (autoDismissRef.current) { clearTimeout(autoDismissRef.current); autoDismissRef.current = null; }
    if (focusTimerRef.current) { clearTimeout(focusTimerRef.current); focusTimerRef.current = null; }
    setPopup({ isOpen: false, type: 'info', title: '', message: '', problemTitle: '' });
  }, []);

  // ─── verifyProblem (manual only — no auto-verify) ───────────
  const verifyProblem = useCallback(async (problem) => {
    if (!leetcodeUsername || !user) return;

    let session = null;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) session = snap.data().sessions?.[problem.id];
    } catch (e) {
      console.error('[VERIFY] Firebase read error:', e.message);
      return;
    }
    if (!session) {
      showPopup('warning', 'No Active Session',
        'You need to click on the problem first to open it on LeetCode before verifying.',
        problem.title, 6000);
      return;
    }

    const slug = problem.leetcodeSlug || session.leetcodeSlug || problem.id;

    try {
      let solved = await validateProblemSolved(leetcodeUsername, slug, session.clickedAt);

      if (!solved) {
        try {
          const subs = await fetchRecentSubmissions(leetcodeUsername);
          solved = subs.some((s) => s.titleSlug === slug && (s.status === 'Accepted' || s.status === 10));
        } catch { solved = false; }
      }

      if (solved) {
        // Firebase update in background
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.exists() ? snap.data() : {};
const favObj = {};
          favorites.forEach((favId) => { favObj[favId] = true; });
          Promise.all([
            setDoc(doc(db, 'users', user.uid), { completedProblems: { ...data.completedProblems, [problem.id]: true }, favorites: favObj }, { merge: true }),
          updateDoc(doc(db, 'users', user.uid), { [`sessions.${problem.id}`]: deleteField() }),
        ]).catch((err) => console.error('[VERIFY] Firebase update error:', err));

        setCompletedProblems((prev) => new Set([...prev, problem.id]));
        ssRemove(ssPopupKey(problem.id));
        ssRemove(SS_LAST_CLICKED);
        currentProblemRef.current = null;

        showPopup('success', '🎉 Problem Verified!',
          'Great job! Your solution has been accepted on LeetCode.',
          problem.title, 5000);
      } else {
        showPopup('error', 'Solution Not Yet Accepted',
          'Your solution is not accepted yet.\n\nPlease solve it on LeetCode and get an Accepted status.',
          problem.title, 6000);
      }
    } catch (error) {
      console.error('[VERIFY] Error:', error.message);
      showPopup('error', 'Verification Error',
        'Could not verify your solution.\n\nPlease check:\n1. Your LeetCode username is correct\n2. Your profile is public\n3. Backend server is running',
        problem.title, 8000);
    }
  }, [user, leetcodeUsername, showPopup]);

  // ─── handleProblemClick: SINGLE CLICK = instant open ────────
  const handleProblemClick = useCallback((problem) => {
    // 1. Clear ALL previous popup state (complete isolation)
    clearAllPopupState();

    // 2. Auth check
    if (!user) {
      showPopup('warning', 'Authentication Required',
        'Please log in to track your progress.', '', 6000);
      return;
    }

    // 3. LeetCode profile check
    if (!leetcodeUsername) {
      showPopup('warning', 'LeetCode Profile Required',
        'Please add your LeetCode username in your profile settings.', '', 6000);
      return;
    }

    // 4. Set current problem (ONLY this problem can generate popups)
    currentProblemRef.current = problem;

    // 5. Clean sessionStorage for old problem
    const oldId = ssGet(SS_LAST_CLICKED);
    if (oldId && oldId !== problem.id) {
      ssRemove(ssPopupKey(oldId));
    }
    ssSet(SS_LAST_CLICKED, problem.id);
    ssRemove(ssPopupKey(problem.id)); // fresh click = allow popup again

    // 6. IMMEDIATELY open LeetCode (no delay, no intermediate state)
    console.log(`[CLICK] Opening: ${problem.title} → ${problem.leetcodeUrl}`);
    window.open(problem.leetcodeUrl, '_blank');

    // 7. Save session to Firebase in background
    const sessionData = {
      problemId: problem.id,
      leetcodeSlug: problem.leetcodeSlug || problem.id,
      clickedAt: Date.now(),
    };
    setDoc(doc(db, 'users', user.uid), { sessions: { [problem.id]: sessionData } }, { merge: true })
      .catch((err) => console.error('[SESSION] Save failed:', err));
    setUserSessions((prev) => ({ ...prev, [problem.id]: sessionData }));
  }, [user, leetcodeUsername, clearAllPopupState, showPopup]);

  // ─── Window focus: validate & show "please solve" popup (1s delay) ──
  useEffect(() => {
    const handleFocus = async () => {
      // Skip initial page load
      if (isInitialLoad.current) {
        console.log('[FOCUS] Initial load — skipped');
        return;
      }

      const lastId = ssGet(SS_LAST_CLICKED);
      if (!lastId) return;

      // Already shown for this problem?
      if (ssGet(ssPopupKey(lastId))) {
        console.log(`[FOCUS] Popup already shown for ${lastId} — skipped`);
        return;
      }

      // Must match current problem (isolation)
      if (!currentProblemRef.current || currentProblemRef.current.id !== lastId) return;

      // Already completed in our state?
      if (completedProblems.has(lastId)) return;

      const problem = currentProblemRef.current;

      // Clear any existing timer
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

      // 1000ms delay then check LeetCode and show popup if needed
      focusTimerRef.current = setTimeout(async () => {
        // Final guards
        if (currentProblemRef.current?.id !== lastId) return;
        if (ssGet(ssPopupKey(lastId))) return;
        if (!leetcodeUsername || !user) return;

        // Check LeetCode directly for recent submission
        let isSolved = false;
        try {
          const session = userSessions[lastId];
          if (session) {
            const slug = problem.leetcodeSlug || session.leetcodeSlug || problem.id;
            isSolved = await validateProblemSolved(leetcodeUsername, slug, session.clickedAt);
            
            if (!isSolved) {
              try {
                const subs = await fetchRecentSubmissions(leetcodeUsername);
                isSolved = subs.some((s) => s.titleSlug === slug && (s.status === 'Accepted' || s.status === 10));
              } catch { isSolved = false; }
            }
          }
        } catch (e) {
          console.error('[FOCUS] Validation error:', e.message);
        }

        // If solved on LeetCode, mark as complete
        if (isSolved) {
          console.log(`[FOCUS] ✅ Detected accepted solution for: ${problem.title} — marking complete`);
          const snap = await getDoc(doc(db, 'users', user.uid));
          const data = snap.exists() ? snap.data() : {};
          const favObj = {};
          favorites.forEach((favId) => { favObj[favId] = true; });
          Promise.all([
            setDoc(doc(db, 'users', user.uid), { completedProblems: { ...data.completedProblems, [problem.id]: true }, favorites: favObj }, { merge: true }),
            updateDoc(doc(db, 'users', user.uid), { [`sessions.${problem.id}`]: deleteField() }),
          ]).catch((err) => console.error('[FOCUS] Firebase update error:', err));
          
          setCompletedProblems((prev) => new Set([...prev, problem.id]));
          ssRemove(ssPopupKey(problem.id));
          ssRemove(SS_LAST_CLICKED);
          currentProblemRef.current = null;
          return;
        }

        // Not solved yet — show popup
        console.log(`[FOCUS] Showing "please solve" for: ${problem.title}`);
        ssSet(ssPopupKey(lastId), 'true'); // Mark shown (once per problem per session)

        showPopup('warning', 'Problem Not Yet Solved',
          `Please solve "${problem.title}" on LeetCode and get an Accepted status, then click the verify button (↻) to check your progress.`,
          problem.title, 8000);

        focusTimerRef.current = null;
      }, 1000);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, [completedProblems, showPopup, user, leetcodeUsername, userSessions, favorites, verifyProblem]);

  // Ensure user dependency is available for toggleFavorite closure
  useEffect(() => {}, [user]);

  // Mark initial load complete after 2s
  useEffect(() => {
    const t = setTimeout(() => { isInitialLoad.current = false; }, 2000);
    return () => clearTimeout(t);
  }, []);

  // ─── Firebase listener ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), async (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.completedProblems) {
          setCompletedProblems(new Set(Object.keys(d.completedProblems).filter((id) => d.completedProblems[id])));
        }
        if (d.favorites) {
          setFavorites(new Set(Object.keys(d.favorites).filter((id) => d.favorites[id])));
        }
        setUserSessions(d.sessions || {});
      } else {
        try {
          await setDoc(doc(db, 'users', user.uid), { completedProblems: {}, favorites: {}, sessions: {} }, { merge: true });
        } catch (e) { console.error('[FIREBASE] Init error:', e); }
        setUserSessions({});
        setCompletedProblems(new Set());
        setFavorites(new Set());
      }
    });
    return () => unsub();
  }, [user]);

  // ─── POPUP_TESTER: browser console utility ──────────────────
  useEffect(() => {
    const allProblems = Object.values(DSA_CATEGORIES).flatMap((c) => c.problems);

    window.POPUP_TESTER = {
      trigger: (problemId) => {
        const p = allProblems.find((x) => x.id === problemId);
        if (!p) { console.error(`❌ Problem "${problemId}" not found`); return; }
        currentProblemRef.current = p;
        ssSet(SS_LAST_CLICKED, problemId);
        ssRemove(ssPopupKey(problemId));
        const t0 = performance.now();
        showPopup('warning', 'Problem Not Yet Solved',
          `Please solve "${p.title}" on LeetCode and get an Accepted status, then click the verify button.`,
          p.title, 8000);
        ssSet(ssPopupKey(problemId), 'true');
        console.log(`✅ Popup triggered for "${p.title}" in ${(performance.now() - t0).toFixed(2)}ms`);
      },

      reset: (problemId) => {
        if (problemId) {
          ssRemove(ssPopupKey(problemId));
          console.log(`🔄 Reset popup state for: ${problemId}`);
        } else {
          for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const k = sessionStorage.key(i);
            if (k?.startsWith(SS_POPUP_PREFIX)) ssRemove(k);
          }
          ssRemove(SS_LAST_CLICKED);
          currentProblemRef.current = null;
          clearAllPopupState();
          popupStats.current = { shown: 0, perProblem: {} };
          console.log('🔄 Reset ALL popup state');
        }
      },

      stats: () => {
        const lastClicked = ssGet(SS_LAST_CLICKED);
        const shownList = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k?.startsWith(SS_POPUP_PREFIX)) shownList[k.replace(SS_POPUP_PREFIX, '')] = true;
        }
        const result = {
          totalPopupsShown: popupStats.current.shown,
          perProblem: { ...popupStats.current.perProblem },
          sessionStorage: { lastClickedProblemId: lastClicked, popupShownFor: shownList },
          currentProblem: currentProblemRef.current ? { id: currentProblemRef.current.id, title: currentProblemRef.current.title } : null,
          popupOpen: popup.isOpen,
          popupContent: popup.isOpen ? { type: popup.type, title: popup.title } : null,
        };
        console.table(result);
        return result;
      },

      simulateReturn: () => {
        console.log('🔁 Simulating return from LeetCode...');
        isInitialLoad.current = false;
        setTimeout(() => window.dispatchEvent(new Event('focus')), 100);
      },

      close: () => closePopup(),

      testSwitch: (idA, idB) => {
        const pA = allProblems.find((x) => x.id === idA);
        const pB = allProblems.find((x) => x.id === idB);
        if (!pA || !pB) { console.error('❌ Problem IDs not found'); return; }
        console.log(`🧪 Clicking "${pA.title}"...`);
        currentProblemRef.current = pA;
        ssSet(SS_LAST_CLICKED, pA.id);
        ssRemove(ssPopupKey(pA.id));
        showPopup('warning', 'Problem Not Yet Solved', `Popup for ${pA.title}`, pA.title, 8000);
        ssSet(ssPopupKey(pA.id), 'true');
        setTimeout(() => {
          console.log(`🧪 Switching to "${pB.title}"...`);
          clearAllPopupState();
          currentProblemRef.current = pB;
          ssRemove(ssPopupKey(pA.id));
          ssSet(SS_LAST_CLICKED, pB.id);
          ssRemove(ssPopupKey(pB.id));
          console.log(`✅ Switched: popup for "${pA.title}" cleared. Current: "${pB.title}"`);
          window.POPUP_TESTER.stats();
        }, 2000);
      },

      listProblems: (count = 20) => {
        const list = allProblems.slice(0, count).map((p) => ({ id: p.id, title: p.title, difficulty: p.difficulty }));
        console.table(list);
        return list;
      },

      verify: async (problemId) => {
        const p = allProblems.find((x) => x.id === problemId);
        if (!p) { console.error(`❌ Problem "${problemId}" not found`); return; }
        console.log(`🔍 Verifying "${p.title}"...`);
        await verifyProblem(p);
      },
    };

    console.log('✅ POPUP_TESTER ready. Commands:');
    console.log('   POPUP_TESTER.trigger(problemId)');
    console.log('   POPUP_TESTER.reset(problemId?)');
    console.log('   POPUP_TESTER.stats()');
    console.log('   POPUP_TESTER.simulateReturn()');
    console.log('   POPUP_TESTER.close()');
    console.log('   POPUP_TESTER.testSwitch(idA, idB)');
    console.log('   POPUP_TESTER.listProblems(20)');
    console.log('   POPUP_TESTER.verify(problemId)');
  }, [showPopup, closePopup, clearAllPopupState, verifyProblem, favorites]);

  // ─── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => () => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
  }, []);

  // ─── Derived data ───────────────────────────────────────────
  const overallProgress = (() => {
    const all = Object.values(DSA_CATEGORIES).flatMap((c) => c.problems);
    const done = all.filter((p) => completedProblems.has(p.id)).length;
    return { completed: done, total: all.length };
  })();

  const sortProblems = (list) => {
    const sorted = [...list];
    if (sortBy === 'difficulty') sorted.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    else if (sortBy === 'acceptance') sorted.sort((a, b) => (b.acceptance || 0) - (a.acceptance || 0));
    else if (sortBy === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  };

  const getAllProblems = () => {
    const problems = Object.values(DSA_CATEGORIES).flatMap((c) => c.problems);
    return problems.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filteredProblems = activeCategory
    ? (DSA_CATEGORIES[activeCategory]?.problems || []).filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : getAllProblems();

  const sortedProblems = sortProblems(filteredProblems);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      
      // Save to Firebase
      if (user) {
        const favObj = {};
        s.forEach((favId) => { favObj[favId] = true; });
        setDoc(doc(db, 'users', user.uid), { favorites: favObj }, { merge: true })
          .catch((err) => console.error('[FAVORITE] Save error:', err));
      }
      
      return s;
    });
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                DSA Practice Problems
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Practice LeetCode problems organized by topic and difficulty
              </p>
            </div>
            <div className="flex flex-col items-end">
              {!user ? (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Please log in
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {leetcodeUsername || 'No LeetCode profile'}
                  </span>
                  <button onClick={() => navigate('/profile')} className="p-1 text-blue-600 hover:text-blue-800" title="Edit profile">
                    <User className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 py-4">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Topics
              </button>
              {Object.entries(DSA_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-1 ${activeCategory === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & sort */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="difficulty">Difficulty</option>
                  <option value="acceptance">Acceptance Rate</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{overallProgress.completed}</span>
                <span className="text-gray-500">/{overallProgress.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProblems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No problems found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
              <div className="col-span-1">Status</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Acceptance</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Rows — NO loading spinners */}
            <div className="divide-y divide-gray-200">
              {sortedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors ${completedProblems.has(problem.id) ? 'bg-green-50' : ''}`}
                >
                  {/* Status — simple icon, NO spinner */}
                  <div className="col-span-1 flex justify-center">
                    {completedProblems.has(problem.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  {/* Title — single click opens immediately */}
                  <div className="col-span-6">
                    <button
                      onClick={() => handleProblemClick(problem)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium text-left"
                      title={!user ? 'Log in to solve' : 'Click to solve on LeetCode'}
                    >
                      {problem.title}
                    </button>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Acceptance */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">{problem.acceptance}%</span>
                  </div>

                  {/* Actions: verify + bookmark */}
                  <div className="col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => verifyProblem(problem)}
                      className="p-1.5 rounded transition-colors text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                      title="Verify solution on LeetCode"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleFavorite(problem.id)}
                      className={`p-1.5 rounded transition-colors ${favorites.has(problem.id) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                      title="Bookmark problem"
                    >
                      <Star className="h-4 w-4" fill={favorites.has(problem.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Single verification popup */}
      <VerificationPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        problemTitle={popup.problemTitle}
      />
    </div>
  );
};

export default Practice;
