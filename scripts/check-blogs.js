import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

async function checkBlogs() {
  try {
    console.log('📊 Checking blogs in Firestore...\n');
    
    const blogsRef = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogsRef);
    
    console.log(`Total blogs in database: ${querySnapshot.size}`);
    console.log('---');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📝 ${data.title}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Views: ${data.views}`);
      console.log('');
    });
    
    if (querySnapshot.size === 0) {
      console.log('⚠️  No blogs found in database');
    } else {
      console.log(`✅ Successfully found ${querySnapshot.size} blogs`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking blogs:', error.message);
    process.exit(1);
  }
}

checkBlogs();
