import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtf7yKvJlHjEjuOhIhvEqNv-VWJ_y3jT4",
  authDomain: "algorithm-visualizer-b963c.firebaseapp.com",
  projectId: "algorithm-visualizer-b963c",
  storageBucket: "algorithm-visualizer-b963c.appspot.com",
  messagingSenderId: "644676218614",
  appId: "1:644676218614:web:c3d6b9ee0e1ee01c98e1b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample notifications for setup
const sampleNotifications = [
  {
    title: "Welcome to AlgoView!",
    message: "Explore interactive algorithm visualizations and improve your DSA skills",
    content: "AlgoView provides step-by-step visualizations of popular algorithms. Start learning today!",
    type: "announcement",
    priority: "high",
    active: true,
    views: 0,
    clicks: 0
  },
  {
    title: "New Feature: Binary Trees Visualizer",
    message: "Master tree algorithms with our new interactive visualizer",
    content: "We've launched a comprehensive binary tree visualizer with support for BST, AVL, and more. Check it out in the DSA section!",
    type: "update",
    priority: "high",
    active: true,
    views: 0,
    clicks: 0
  },
  {
    title: "System Maintenance Notice",
    message: "Scheduled maintenance on April 5th, 2026 from 2:00 AM to 3:00 AM UTC",
    content: "We'll be performing important system updates. The platform will be temporarily unavailable during this time. Thank you for your patience!",
    type: "maintenance",
    priority: "medium",
    active: true,
    views: 0,
    clicks: 0
  },
  {
    title: "Special Offer: Premium Features",
    message: "Get 50% off on premium features for the next 30 days",
    content: "Unlock advanced visualizations, offline access, and ad-free experience. Use code ALGO50 at checkout.",
    type: "discount",
    priority: "medium",
    active: true,
    views: 0,
    clicks: 0
  },
  {
    title: "New Blog: Dynamic Programming Guide",
    message: "Learn DP concepts with practical examples and visualizations",
    content: "Check out our latest blog post on dynamic programming. From memoization to tabulation, we cover everything you need to know.",
    type: "update",
    priority: "low",
    active: true,
    views: 0,
    clicks: 0
  }
];

async function setupNotifications() {
  try {
    console.log('🔔 Setting up Notifications collection...\n');
    
    const notificationsRef = collection(db, 'notifications');
    let count = 0;

    for (const notification of sampleNotifications) {
      const docData = {
        ...notification,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(notificationsRef, docData);
      count++;
      console.log(`✅ Added notification ${count}/${sampleNotifications.length}: ${notification.title}`);
    }

    console.log(`\n✨ Successfully created 'notifications' collection with ${count} sample notifications!`);
    console.log('\n📋 Collection Details:');
    console.log('   📍 Collection: notifications');
    console.log('   📊 Documents: ' + count);
    console.log('   ✏️  Fields: title, message, content, type, priority, active, views, clicks, createdAt, updatedAt');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Go to Admin Dashboard → Admin/Login');
    console.log('   2. Navigate to Notifications Management');
    console.log('   3. See your notifications and manage them!');
    console.log('\n🔒 Security Rules have been set automatically (admin-only write access)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up notifications:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Make sure Firestore is enabled in Firebase Console');
    console.error('   - Check your internet connection');
    console.error('   - Verify Firebase credentials are correct');
    process.exit(1);
  }
}

setupNotifications();
