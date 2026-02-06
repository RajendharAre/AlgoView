// Test utility script - Run in browser console
// Copy and paste individual test functions as needed

// ============================================================
// 1. PROBLEM DATA TESTS
// ============================================================

// Test 1.1: Check for duplicate problems
function testDuplicates() {
  console.log('🧪 Testing for duplicate problems...');
  
  // Try to access problems from the page
  const categories = document.querySelectorAll('[data-category]');
  const allProblems = [];
  
  // Collect all problem titles
  const problemTitles = document.querySelectorAll('[data-problem-title]');
  problemTitles.forEach(el => {
    allProblems.push(el.textContent.trim());
  });
  
  if (allProblems.length === 0) {
    console.warn('⚠️ Could not find problems in DOM. Make sure page is fully loaded.');
    return;
  }
  
  // Find duplicates
  const duplicates = allProblems.filter((title, idx) => allProblems.indexOf(title) !== idx);
  
  if (duplicates.length === 0) {
    console.log('✅ TEST PASSED: No duplicate problems found');
  } else {
    console.log('❌ TEST FAILED: Found ' + duplicates.length + ' duplicate problems');
    console.log('Duplicates:', [...new Set(duplicates)]);
  }
  
  console.log(`📊 Total problems: ${allProblems.length}`);
  return duplicates.length === 0;
}

// Test 1.2: Check problem links
function testProblemLinks() {
  console.log('🧪 Testing problem links...');
  
  const problemLinks = document.querySelectorAll('[data-problem-link]');
  let validLinks = 0;
  let invalidLinks = 0;
  
  problemLinks.forEach((link, idx) => {
    const href = link.href;
    if (href && href.includes('leetcode.com/problems/')) {
      validLinks++;
      if (idx < 5) {
        console.log(`✓ Valid: ${href}`);
      }
    } else {
      invalidLinks++;
      console.log(`✗ Invalid: ${href}`);
    }
  });
  
  console.log(`✅ Valid links: ${validLinks}`);
  console.log(`❌ Invalid links: ${invalidLinks}`);
  
  return invalidLinks === 0;
}

// Test 1.3: Check for placeholder problems
function testNoPlaceholders() {
  console.log('🧪 Testing for placeholder problems...');
  
  const problemTitles = document.querySelectorAll('[data-problem-title]');
  const placeholders = [];
  
  problemTitles.forEach(el => {
    const title = el.textContent.trim();
    if (/^(Easy|Medium|Hard) Problem \d+$/.test(title)) {
      placeholders.push(title);
    }
  });
  
  if (placeholders.length === 0) {
    console.log('✅ TEST PASSED: No placeholder problems found');
  } else {
    console.log('❌ TEST FAILED: Found ' + placeholders.length + ' placeholder problems');
    console.log('Examples:', placeholders.slice(0, 5));
  }
  
  return placeholders.length === 0;
}

// Test 1.4: Check problem distribution
function testProblemDistribution() {
  console.log('🧪 Testing problem distribution...');
  
  const categories = ['Arrays', 'Strings', 'Hash Table', 'Math', 'Dynamic Programming', 
                      'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search', 'Database'];
  
  categories.forEach(cat => {
    const problems = document.querySelectorAll(`[data-category="${cat}"] [data-problem-title]`);
    const easy = Array.from(problems).filter(p => p.closest('[data-difficulty="Easy"]')).length;
    const medium = Array.from(problems).filter(p => p.closest('[data-difficulty="Medium"]')).length;
    const hard = Array.from(problems).filter(p => p.closest('[data-difficulty="Hard"]')).length;
    
    const total = easy + medium + hard;
    const status = total === 30 && easy === 10 && medium === 10 && hard === 10 ? '✅' : '❌';
    
    console.log(`${status} ${cat}: Total=${total}, Easy=${easy}, Medium=${medium}, Hard=${hard}`);
  });
}

// ============================================================
// 2. AUTO-VERIFICATION TESTS
// ============================================================

// Test 2.1: Monitor auto-verification on page load
function testAutoVerificationOnLoad() {
  console.log('🧪 Testing auto-verification on page load...');
  console.log('⏱️ Waiting 2-3 seconds for auto-verification to complete...');
  
  const startTime = Date.now();
  
  // Monitor for popup
  const checkPopup = () => {
    const popup = document.querySelector('[data-verification-popup]');
    if (popup && popup.style.display !== 'none') {
      const elapsed = Date.now() - startTime;
      console.log(`✅ Popup appeared after ${elapsed}ms`);
      console.log(`Popup type: ${popup.getAttribute('data-popup-type')}`);
      return true;
    }
    return false;
  };
  
  // Check every 500ms for up to 5 seconds
  let checks = 0;
  const interval = setInterval(() => {
    checks++;
    if (checkPopup() || checks > 10) {
      clearInterval(interval);
      if (checks > 10) {
        console.log('❌ TEST FAILED: No popup appeared after 5 seconds');
      }
    }
  }, 500);
}

// Test 2.2: Check verification spinner
function testVerificationSpinner() {
  console.log('🧪 Testing verification spinner...');
  
  const spinners = document.querySelectorAll('[data-verification-spinner]');
  
  if (spinners.length > 0) {
    console.log(`✅ Found ${spinners.length} verification spinner(s) visible`);
    spinners.forEach((spinner, idx) => {
      const problemTitle = spinner.closest('[data-problem-row]')?.getAttribute('data-problem-title');
      console.log(`  ${idx + 1}. Problem: ${problemTitle}`);
    });
  } else {
    console.log('ℹ️ No spinners currently visible (verification may be complete)');
  }
}

// ============================================================
// 3. POPUP TESTS
// ============================================================

// Test 3.1: Check popup visibility
function testPopupVisibility() {
  console.log('🧪 Testing popup visibility...');
  
  const popup = document.querySelector('[data-verification-popup]');
  
  if (!popup) {
    console.log('ℹ️ No popup currently visible');
    return;
  }
  
  const isVisible = popup.style.display !== 'none' && popup.offsetHeight > 0;
  
  if (isVisible) {
    console.log('✅ Popup is visible');
    
    // Check elements
    const title = popup.querySelector('[data-popup-title]');
    const message = popup.querySelector('[data-popup-message]');
    const closeBtn = popup.querySelector('[data-popup-close]');
    const gotItBtn = popup.querySelector('[data-popup-gotit]');
    
    console.log(`  Title: ${title ? '✓' : '✗'}`);
    console.log(`  Message: ${message ? '✓' : '✗'}`);
    console.log(`  Close button: ${closeBtn ? '✓' : '✗'}`);
    console.log(`  Got it button: ${gotItBtn ? '✓' : '✗'}`);
  } else {
    console.log('❌ Popup not visible');
  }
}

// Test 3.2: Test popup close functionality
function testPopupClose() {
  console.log('🧪 Testing popup close...');
  
  const popup = document.querySelector('[data-verification-popup]');
  const closeBtn = popup?.querySelector('[data-popup-close]');
  const gotItBtn = popup?.querySelector('[data-popup-gotit]');
  
  if (!closeBtn && !gotItBtn) {
    console.log('❌ No close buttons found');
    return;
  }
  
  console.log('Click the X button or "Got it" button to close the popup');
  console.log('Then run: testPopupClosed() to verify closure');
}

function testPopupClosed() {
  const popup = document.querySelector('[data-verification-popup]');
  const isVisible = popup && popup.style.display !== 'none';
  
  if (!isVisible) {
    console.log('✅ Popup successfully closed');
  } else {
    console.log('❌ Popup still visible');
  }
}

// ============================================================
// 4. UI TESTS
// ============================================================

// Test 4.1: Check all problem buttons are clickable
function testProblemButtons() {
  console.log('🧪 Testing problem buttons...');
  
  const problemButtons = document.querySelectorAll('[data-problem-button]');
  let clickable = 0;
  let disabled = 0;
  
  problemButtons.forEach(btn => {
    if (btn.disabled || btn.hasAttribute('disabled')) {
      disabled++;
    } else {
      clickable++;
    }
  });
  
  console.log(`✅ Clickable: ${clickable}`);
  console.log(`⚠️ Disabled: ${disabled}`);
  console.log(`📊 Total: ${problemButtons.length}`);
}

// Test 4.2: Test category filter
function testCategoryFilter(category) {
  console.log(`🧪 Testing category filter: ${category}...`);
  
  const categoryButton = Array.from(document.querySelectorAll('[data-category-filter]'))
    .find(btn => btn.textContent.includes(category));
  
  if (categoryButton) {
    categoryButton.click();
    console.log(`✅ Clicked ${category} filter`);
    
    setTimeout(() => {
      const problemRows = document.querySelectorAll('[data-problem-row]');
      console.log(`📊 Showing ${problemRows.length} problems for ${category}`);
    }, 500);
  } else {
    console.log(`❌ Could not find ${category} filter button`);
  }
}

// ============================================================
// BATCH TESTS
// ============================================================

// Run all basic tests
function runAllBasicTests() {
  console.log('🚀 Running all basic tests...\n');
  
  console.log('--- PROBLEM DATA TESTS ---');
  testDuplicates();
  testNoPlaceholders();
  testProblemLinks();
  
  console.log('\n--- UI TESTS ---');
  testProblemButtons();
  testProblemDistribution();
  
  console.log('\n✅ Basic tests complete! Check results above.');
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Get current popup info
function getPopupInfo() {
  const popup = document.querySelector('[data-verification-popup]');
  if (!popup) {
    console.log('No popup visible');
    return;
  }
  
  return {
    type: popup.getAttribute('data-popup-type'),
    title: popup.querySelector('[data-popup-title]')?.textContent,
    message: popup.querySelector('[data-popup-message]')?.textContent,
    problemTitle: popup.querySelector('[data-popup-problem]')?.textContent,
  };
}

// Get problem count
function getProblemCount() {
  return document.querySelectorAll('[data-problem-row]').length;
}

// Get currently auto-checking problems
function getAutoCheckingProblems() {
  const spinners = document.querySelectorAll('[data-verification-spinner]');
  return Array.from(spinners).map(s => 
    s.closest('[data-problem-row]')?.getAttribute('data-problem-title')
  );
}

// ============================================================
// EXPORT FOR GLOBAL USE
// ============================================================

console.log(`
✅ Test utilities loaded! Available functions:

BASIC TESTS:
  - runAllBasicTests()
  - testDuplicates()
  - testNoPlaceholders()
  - testProblemLinks()
  - testProblemDistribution()
  - testProblemButtons()

AUTO-VERIFICATION TESTS:
  - testAutoVerificationOnLoad()
  - testVerificationSpinner()

POPUP TESTS:
  - testPopupVisibility()
  - testPopupClose()
  - testPopupClosed()

UI TESTS:
  - testCategoryFilter('Arrays')
  
HELPERS:
  - getPopupInfo()
  - getProblemCount()
  - getAutoCheckingProblems()

Try: runAllBasicTests()
`);
