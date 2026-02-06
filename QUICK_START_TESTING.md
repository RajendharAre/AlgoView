# Quick Start Testing Guide

## How to Test the Practice Page

### Step 1: Open DevTools Console
1. Open Practice page: `http://localhost:3000/dsa/practice`
2. Press `F12` to open Developer Tools
3. Click on "Console" tab

### Step 2: Load Test Utilities
Copy and paste this into the console and press Enter:
```javascript
const script = document.createElement('script');
script.src = '/src/tests/practice-page-tests.js';
document.body.appendChild(script);
```

Or manually copy contents of `tests/practice-page-tests.js` into console.

### Step 3: Run Tests

#### Quick Validation (All Basic Tests)
```javascript
runAllBasicTests()
```

This will test:
- ✅ No duplicate problems
- ✅ No placeholder problems  
- ✅ Valid LeetCode links
- ✅ Correct problem distribution (30 per category, 10 per difficulty)

#### Individual Tests

**Check Problem Data:**
```javascript
testDuplicates()        // Verify no duplicates
testNoPlaceholders()    // Verify no "Easy Problem 1" types
testProblemLinks()      // Verify links work
```

**Check Auto-Verification:**
```javascript
testAutoVerificationOnLoad()   // Watch for popup on load
testVerificationSpinner()      // Check if spinner appears
```

**Check Popups:**
```javascript
getPopupInfo()          // See current popup details
testPopupVisibility()   // Check if popup is visible
```

**Check UI:**
```javascript
getProblemCount()       // See total problems loaded
testCategoryFilter('Arrays')  // Test category filtering
getAutoCheckingProblems()  // See which problems are being verified
```

---

## Manual Testing Checklist

### ✅ Quick Verification (5 minutes)
- [ ] Page loads (no console errors)
- [ ] All 300 problems visible in console: `getProblemCount()`
- [ ] No duplicates: `testDuplicates()`
- [ ] No placeholders: `testNoPlaceholders()`

### ✅ Auto-Verification (10 minutes)
1. [ ] Open Practice page
2. [ ] Click on a problem (go to LeetCode)
3. [ ] **Don't solve it** - just go back
4. [ ] Wait 2-3 seconds
5. [ ] RED popup should appear
6. [ ] Close popup
7. [ ] Repeat with a problem you've already solved
8. [ ] GREEN popup should appear

### ✅ Manual Verification (5 minutes)
1. [ ] Find any problem row
2. [ ] Click the refresh icon (🔄)
3. [ ] Wait for popup
4. [ ] Check popup shows correct message

### ✅ UI Functionality (10 minutes)
- [ ] Filter by category works
- [ ] Search works
- [ ] Sort works
- [ ] Bookmark (star) works
- [ ] Status icons display correctly (circle, checkmark, spinner)

### ✅ Data Persistence (5 minutes)
1. [ ] Verify a problem (mark solved)
2. [ ] Refresh page (Ctrl+R)
3. [ ] Problem should still show as solved

---

## What to Check For

### ✅ Console (Should be clean)
```javascript
// Check for errors
console.log(
  document.querySelectorAll('[data-problem-row]').length + ' problems loaded'
)
```

Look for:
- No red error messages ❌
- No warning messages about missing data ⚠️
- "300 problems loaded" message ✅

### ✅ Network Tab (Should be clean)
1. Open DevTools → Network tab
2. Refresh page
3. Look for:
   - No 404 errors ❌
   - No failed API calls ❌
   - All JS/CSS loads successfully ✅

### ✅ Performance
1. Open DevTools → Performance tab
2. Click Record
3. Interact with page for 10 seconds
4. Stop recording
5. Check:
   - FCP (First Contentful Paint): < 2s ✅
   - LCP (Largest Contentful Paint): < 3s ✅
   - No red marks (jank) ✅

---

## Common Issues & Solutions

### Issue: Popup not showing
**Solution:**
```javascript
// Check if popup exists
document.querySelector('[data-verification-popup]')

// Check if popup is hidden
document.querySelector('[data-verification-popup]').style.display

// Force show for testing
document.querySelector('[data-verification-popup]').style.display = 'flex'
```

### Issue: No spinners showing during verification
**Solution:**
```javascript
// Check if verification is running
getAutoCheckingProblems()

// Manually trigger verification
document.querySelector('[data-verification-button]')?.click()
```

### Issue: Problems not loading
**Solution:**
```javascript
// Check if category data exists
console.log(Object.keys(DSA_CATEGORIES))

// Check problem count
getProblemCount()

// Force refresh
window.location.reload()
```

### Issue: Links showing 404
**Solution:**
```javascript
// Check first 5 problem links
document.querySelectorAll('[data-problem-button]').forEach((btn, i) => {
  if (i < 5) console.log(btn.href)
})
```

---

## Test Results Template

Copy and fill this out:

```
DATE: _______________
TESTER: ______________
BROWSER: ____________

PROBLEM DATA:
  [ ] 300 problems loaded: YES / NO
  [ ] No duplicates: YES / NO
  [ ] No placeholders: YES / NO
  [ ] Valid links: YES / NO
  
AUTO-VERIFICATION:
  [ ] Popup on unsolved problem: YES / NO
  [ ] Popup on solved problem: YES / NO
  [ ] 2-3 second delay works: YES / NO
  [ ] Window focus triggers check: YES / NO
  
MANUAL VERIFICATION:
  [ ] Refresh button works: YES / NO
  [ ] Spinner shows: YES / NO
  [ ] Popup appears: YES / NO
  
UI:
  [ ] Category filter works: YES / NO
  [ ] Search works: YES / NO
  [ ] Sort works: YES / NO
  [ ] Bookmarks persist: YES / NO
  [ ] Status icons correct: YES / NO
  
ERRORS:
  Console errors: _______________
  Network errors: _______________
  API failures: _______________
  
NOTES:
_________________________________________
_________________________________________
```

---

## Report Issues

If you find a bug, provide:
1. What you were trying to do
2. What happened
3. What should happen
4. Browser & OS
5. Console error messages (if any)

Example:
```
Issue: Popup not showing after going back from LeetCode
Steps:
  1. Click "Two Sum" problem
  2. Return from LeetCode after 5 seconds
  3. Wait 2-3 seconds
Expected: Red popup says "Solution Not Yet Accepted"
Actual: No popup appears
Browser: Chrome 120 on Windows 10
Error: (paste console errors here)
```

---

## All Test Functions Available

```
BATCH:
  runAllBasicTests()

DATA TESTS:
  testDuplicates()
  testNoPlaceholders()
  testProblemLinks()
  testProblemDistribution()

VERIFICATION TESTS:
  testAutoVerificationOnLoad()
  testVerificationSpinner()

POPUP TESTS:
  testPopupVisibility()
  testPopupClose()
  testPopupClosed()

UI TESTS:
  testProblemButtons()
  testCategoryFilter('Arrays')

HELPERS:
  getPopupInfo()
  getProblemCount()
  getAutoCheckingProblems()
```

Happy testing! 🧪✅
