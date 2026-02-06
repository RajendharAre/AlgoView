# Practice Page - Comprehensive Testing Guide

## Overview
This document covers all test cases for the Practice page including auto-verification, popups, problem data, and UI functionality.

---

## 1. PROBLEM DATA TESTS

### 1.1 Check for Duplicates
**Test Case:** Verify no duplicate problems across all 300 problems
```
Steps:
1. Open browser console (F12 → Console)
2. Paste this code:
   const problems = Object.values(window.__PROBLEMS__ || {}).flatMap(cat => cat.problems || []);
   const titles = problems.map(p => p.title);
   const duplicates = titles.filter((title, idx) => titles.indexOf(title) !== idx);
   console.log('Duplicates found:', duplicates);
   console.log('Total problems:', problems.length);
```
**Expected Result:**
- Duplicates array should be empty: `[]`
- Total should be exactly 300 problems
✅ **PASS** / ❌ **FAIL**

---

### 1.2 Check Problem Links
**Test Case:** Verify all LeetCode links are valid
```
Steps:
1. Click on 5 random problems from different categories:
   - Arrays: "Two Sum"
   - Strings: "Valid Palindrome"
   - Hash Table: "Happy Number"
   - Math: "Palindrome Number"
   - Database: "Combine Two Tables"

2. Each should open: https://leetcode.com/problems/{slug}/
3. Page should NOT show 404 error
```
**Expected Result:**
- All 5 problems load on LeetCode with valid content
✅ **PASS** / ❌ **FAIL**

---

### 1.3 Check No Placeholder Problems
**Test Case:** Verify no "Easy Problem 1", "Medium Problem 1" type placeholders
```
Steps:
1. Open browser console (F12 → Console)
2. Paste:
   const problems = Object.values(window.__PROBLEMS__ || {}).flatMap(cat => cat.problems || []);
   const placeholders = problems.filter(p => /Problem \d+/.test(p.title));
   console.log('Placeholders found:', placeholders);
```
**Expected Result:**
- Placeholders array should be empty: `[]`
✅ **PASS** / ❌ **FAIL**

---

### 1.4 Check Problem Distribution
**Test Case:** Verify 30 problems per category, 10 per difficulty
```
Steps:
1. In console, paste:
   const categories = ['arrays', 'strings', 'hashTable', 'math', 'dynamicProgramming', 
                       'sorting', 'greedy', 'depthFirstSearch', 'binarySearch', 'database'];
   categories.forEach(cat => {
     const probs = window.__PROBLEMS__?.[cat]?.problems || [];
     const easy = probs.filter(p => p.difficulty === 'Easy').length;
     const medium = probs.filter(p => p.difficulty === 'Medium').length;
     const hard = probs.filter(p => p.difficulty === 'Hard').length;
     console.log(`${cat}: Total=${probs.length}, Easy=${easy}, Medium=${medium}, Hard=${hard}`);
   });
```
**Expected Result:**
- Each category: Total=30, Easy=10, Medium=10, Hard=10
✅ **PASS** / ❌ **FAIL**

---

## 2. AUTO-VERIFICATION TESTS

### 2.1 Auto-Verification on Page Load (UNSOLVED)
**Test Case:** Popup shows when user comes back after NOT solving problem
```
Steps:
1. Open Practice page
2. Click on any problem (e.g., "Two Sum" from Arrays)
3. On LeetCode page → DO NOT SOLVE, just go back immediately
4. Return to Practice page
5. Wait 2-3 seconds (watch for loading spinner on the problem row)
6. Check if RED popup appears
```
**Expected Result:**
- After 2-3 seconds, red popup shows:
  - Title: "Solution Not Yet Accepted"
  - Message: "You may not have solved the problem or your solution is not accepted yet. Please solve it on LeetCode and get an Accepted status."
  - Problem title shows (e.g., "Two Sum")
✅ **PASS** / ❌ **FAIL**

---

### 2.2 Auto-Verification on Page Load (SOLVED)
**Test Case:** Popup shows success when user solves problem
```
Steps:
1. Open Practice page
2. Click on "Fibonacci Number" (Easy DP problem)
3. Go to LeetCode → Check if you've already solved it
   - If YES → Go back to Practice page, skip to step 6
   - If NO → Solve it quickly (if possible) or find a problem you've solved
4. Return to Practice page
5. Wait 2-3 seconds (watch for loading spinner)
6. Check if GREEN popup appears
```
**Expected Result:**
- After 2-3 seconds, green popup shows:
  - Title: "🎉 Problem Verified Successfully!"
  - Message: "Great job! Your solution has been accepted on LeetCode."
  - Problem title shows
  - Problem row shows checkmark icon ✓
✅ **PASS** / ❌ **FAIL**

---

### 2.3 Auto-Verification on Window Focus
**Test Case:** Verification also triggers when switching tabs
```
Steps:
1. Open Practice page in Tab A
2. Click a problem → opens in LeetCode (Tab B)
3. DO NOT solve, wait 5 seconds, then click Tab A to bring focus back
4. Wait 2-3 seconds
5. Check if popup appears
```
**Expected Result:**
- Popup shows automatically when focusing back on Practice tab
✅ **PASS** / ❌ **FAIL**

---

### 2.4 No Popup for Already Checked Problems
**Test Case:** Same problem doesn't show popup twice in one session
```
Steps:
1. Complete test 2.1 (get unsolved popup)
2. Close popup (click "Got it")
3. Manually click refresh button (🔄) on same problem
4. Check if popup shows again
```
**Expected Result:**
- Popup shows again because you manually triggered it
- But in automatic checks, it won't re-verify same problem
✅ **PASS** / ❌ **FAIL**

---

## 3. MANUAL VERIFICATION TESTS

### 3.1 Manual Verify Button
**Test Case:** Clicking refresh icon manually verifies problem
```
Steps:
1. Find any problem row
2. Look for refresh icon (🔄) next to bookmark star
3. Click it
4. Watch for loading spinner on the icon
5. Wait for popup to appear
```
**Expected Result:**
- Icon shows spinning animation
- Popup appears after API call completes
- Shows either success or failure message
✅ **PASS** / ❌ **FAIL**

---

### 3.2 Verify Button Disabled During Check
**Test Case:** Can't spam verify button while checking
```
Steps:
1. Click refresh icon on a problem
2. Immediately click it again
3. Button should be disabled
```
**Expected Result:**
- Button appears grayed out during verification
- Can't click it multiple times
✅ **PASS** / ❌ **FAIL**

---

## 4. POPUP TESTS

### 4.1 Popup Appearance
**Test Case:** Popup displays correctly
```
Steps:
1. Trigger any popup (auto or manual)
2. Check:
   - Dark overlay covers page ✓
   - White box centered on screen ✓
   - Icon in correct color (green/red) ✓
   - Title is readable ✓
   - Message is readable ✓
   - Problem title shown ✓
   - Close button (X) visible ✓
   - "Got it" button visible ✓
```
**Expected Result:**
- All visual elements present and properly styled
✅ **PASS** / ❌ **FAIL**

---

### 4.2 Popup Close Functionality
**Test Case:** Popup closes properly
```
Steps:
1. Trigger any popup
2. Click either:
   a) "Got it" button, OR
   b) X button in top right
3. Popup should disappear
```
**Expected Result:**
- Popup closes immediately
- Dark overlay disappears
- Page is interactive again
✅ **PASS** / ❌ **FAIL**

---

### 4.3 Multiple Popups (Edge Case)
**Test Case:** Handle multiple problems verifying simultaneously
```
Steps:
1. Click refresh buttons on 3 different problems quickly
2. Wait for results
```
**Expected Result:**
- Popups appear one after another (not simultaneously)
- Each can be closed independently
✅ **PASS** / ❌ **FAIL**

---

## 5. UI/FUNCTIONALITY TESTS

### 5.1 Category Filtering
**Test Case:** Filter by category works
```
Steps:
1. Click on "Arrays" category filter
2. Only Arrays problems should show
3. Click on "Strings"
4. Only Strings problems should show
5. Click "All Categories"
6. All 300 problems should show
```
**Expected Result:**
- Filtering works correctly
- Shows correct number of problems per category
✅ **PASS** / ❌ **FAIL**

---

### 5.2 Search Functionality
**Test Case:** Search filters problems correctly
```
Steps:
1. Type "Two Sum" in search box
2. Only "Two Sum" should appear
3. Clear search
4. All 300 problems visible
5. Search "Medium"
6. All Medium difficulty problems show
```
**Expected Result:**
- Search works case-insensitive
- Shows all matching problems
✅ **PASS** / ❌ **FAIL**

---

### 5.3 Sort Functionality
**Test Case:** Sorting options work
```
Steps:
1. Click Sort dropdown
2. Select "Difficulty"
3. Should sort: Easy → Medium → Hard
4. Select "Acceptance Rate"
5. Should sort by % (low to high)
6. Select "Title"
7. Should sort alphabetically
```
**Expected Result:**
- All sort options work correctly
✅ **PASS** / ❌ **FAIL**

---

### 5.4 Bookmark/Favorite
**Test Case:** Can bookmark problems
```
Steps:
1. Click star icon on any problem
2. Star should turn yellow ⭐
3. Click again
4. Star should turn gray
5. Refresh page
6. Bookmark state should persist
```
**Expected Result:**
- Star icon toggles color
- State saved to Firebase
- Persists after refresh
✅ **PASS** / ❌ **FAIL**

---

### 5.5 Problem Status Icons
**Test Case:** Status indicators display correctly
```
Steps:
1. Find a solved problem (checkmark ✓)
2. Find an unsolved problem (circle ○)
3. During verification, should show spinner
```
**Expected Result:**
- All three states visible and correct
✅ **PASS** / ❌ **FAIL**

---

## 6. FIREBASE INTEGRATION TESTS

### 6.1 Data Persistence
**Test Case:** User data saves to Firebase
```
Steps:
1. Verify a problem (mark it solved)
2. Refresh page completely (Ctrl+R)
3. Check if the problem still shows as solved
```
**Expected Result:**
- Problem still marked with checkmark after refresh
- Data persisted in Firebase
✅ **PASS** / ❌ **FAIL**

---

### 6.2 Real-time Updates
**Test Case:** Changes reflect in real-time
```
Steps:
1. Open Practice page in 2 browser tabs (same account)
2. In Tab A, bookmark a problem
3. Check Tab B - should update automatically without refresh
```
**Expected Result:**
- Tab B updates automatically within 1-2 seconds
✅ **PASS** / ❌ **FAIL**

---

## 7. ERROR HANDLING TESTS

### 7.1 No LeetCode Profile
**Test Case:** Show popup if user doesn't have LeetCode profile set
```
Steps:
1. Use account with no LeetCode profile
2. Click any problem
```
**Expected Result:**
- Modal popup shows: "LeetCode Profile Required"
- Message: "Please add your LeetCode profile in your profile settings to continue."
- Option to "Go to Profile"
✅ **PASS** / ❌ **FAIL**

---

### 7.2 Network Error Handling
**Test Case:** Handle API/network failures gracefully
```
Steps:
1. Turn off internet (or use offline mode)
2. Try to verify a problem
3. Turn internet back on
4. Try again
```
**Expected Result:**
- Error popup shows with helpful message
- Can retry without page breaking
- Spinner stops spinning
✅ **PASS** / ❌ **FAIL**

---

### 7.3 Not Logged In
**Test Case:** Show message if user not logged in
```
Steps:
1. Logout from app
2. Go to Practice page
3. Try to click a problem
```
**Expected Result:**
- Problem link disabled (grayed out)
- Message shows: "Log in to solve"
✅ **PASS** / ❌ **FAIL**

---

## 8. PERFORMANCE TESTS

### 8.1 Page Load Time
**Test Case:** Check page loads in reasonable time
```
Steps:
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Check total time
```
**Expected Result:**
- Page loads within 3 seconds
- All 300 problems load without lag
- No console errors
✅ **PASS** / ❌ **FAIL**

---

### 8.2 Memory Leaks
**Test Case:** Check for memory leaks during verification
```
Steps:
1. Open DevTools → Memory tab
2. Take heap snapshot
3. Verify 5 problems
4. Take another heap snapshot
5. Compare sizes
```
**Expected Result:**
- No significant memory increase (< 10MB)
- Event listeners cleaned up properly
✅ **PASS** / ❌ **FAIL**

---

## 9. MOBILE/RESPONSIVENESS TESTS

### 9.1 Mobile Layout
**Test Case:** Check mobile responsiveness
```
Steps:
1. Open DevTools
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on iPhone 12 (390x844)
4. Test on iPad (768x1024)
5. Test on Android (375x667)
```
**Expected Result:**
- Layout adapts to screen size
- All buttons clickable
- Text readable
- Popup displays properly on all sizes
✅ **PASS** / ❌ **FAIL**

---

## 10. BROWSER COMPATIBILITY TESTS

**Test on:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Check:**
- Page loads ✓
- Popups display ✓
- Verification works ✓
- No console errors ✓

---

## TESTING CHECKLIST

```
□ All 300 problems loaded
□ No duplicates exist
□ No placeholder problems exist
□ All LeetCode links work
□ Auto-verification on load (2-3 sec)
□ Auto-verification on window focus
□ Popup shows for unsolved problems
□ Popup shows for solved problems
□ Manual verify button works
□ Category filtering works
□ Search works
□ Sort works
□ Bookmarks persist
□ Firebase saves data
□ Error handling works
□ Mobile responsive
□ No console errors
□ No memory leaks
□ Performance acceptable (< 3s load)
```

---

## KNOWN ISSUES LOG

Track any issues found here:

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Example: Popup not closing | High | FIXED | X button was not working |
| | | | |
| | | | |

---

## TEST RESULTS SUMMARY

**Date:** ________________
**Tester:** ________________
**Browser:** ________________

**Total Tests:** 30
**Passed:** ___
**Failed:** ___
**Skipped:** ___

**Critical Issues:** ___
**Major Issues:** ___
**Minor Issues:** ___

**Sign-off:** ________________
