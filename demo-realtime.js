// Demo script to showcase dynamic real-time behavior
// Open this in multiple browser tabs to see real-time synchronization

console.log('🚀 DYNAMIC REAL-TIME DEMO STARTED');
console.log('Open multiple tabs to see real-time synchronization!');

// Simulate user interactions across different "clients"
const simulateMultiUserActivity = () => {
  const userIds = ['user-1', 'user-2', 'user-3'];
  const problems = ['two-sum', '3sum', 'container-with-most-water'];
  
  console.log('\\n=== MULTI-USER SIMULATION ===');
  
  // Simulate different users solving problems
  userIds.forEach((userId, userIndex) => {
    setTimeout(() => {
      const problem = problems[userIndex];
      console.log(`\\n👤 User ${userId} started solving ${problem}`);
      
      // Simulate session creation
      const sessionData = {
        problemId: problem,
        leetcodeSlug: problem,
        clickedAt: Date.now()
      };
      
      // In a real scenario, this would update Firebase
      // For demo, we'll just log the activity
      console.log(`✅ Session created for ${userId}:`, sessionData);
      
      // Simulate verification after some time
      setTimeout(() => {
        console.log(`✅ User ${userId} verified ${problem} successfully!`);
        console.log(`🔄 All other users should see this update in real-time`);
      }, 3000 + (userIndex * 1000));
      
    }, userIndex * 2000);
  });
};

// Start the simulation
simulateMultiUserActivity();

console.log('\\n💡 TIPS FOR TESTING:');
console.log('1. Open http://localhost:3000/dsa/practice in multiple browser tabs');
console.log('2. Use different browsers or incognito windows');
console.log('3. Solve the same problem in different tabs');
console.log('4. Watch how changes appear instantly across all tabs');
console.log('5. Try completing a problem in one tab - it should show as completed in others');

// Monitor localStorage changes to demonstrate real-time updates
window.addEventListener('storage', (event) => {
  if (event.key === 'firebase-mock-sync') {
    console.log('🔄 REAL-TIME UPDATE DETECTED!');
    console.log('Key:', event.key);
    console.log('New Value:', event.newValue);
    try {
      const data = JSON.parse(event.newValue);
      console.log('Broadcast Data:', data);
    } catch (e) {
      console.error('Error parsing broadcast data:', e);
    }
  }
});

console.log('\\n🎯 SYSTEM IS NOW FULLY DYNAMIC AND REAL-TIME!');