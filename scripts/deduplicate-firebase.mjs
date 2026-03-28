// Script to deduplicate blogs using Firebase Web SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function removeDuplicateBlogs() {
  try {
    console.log('🔍 Fetching all blogs...');
    const blogsRef = collection(db, 'blogs');
    const blogsSnapshot = await getDocs(blogsRef);
    
    if (blogsSnapshot.empty) {
      console.log('📭 No blogs found');
      process.exit(0);
      return;
    }

    const blogs = [];
    const titleMap = new Map();

    blogsSnapshot.forEach(docSnap => {
      const blog = docSnap.data();
      blogs.push({
        id: docSnap.id,
        ...blog
      });
    });

    console.log(`📚 Found ${blogs.length} total blogs`);

    // Group by title
    blogs.forEach(blog => {
      const title = blog.title.toLowerCase().trim();
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title).push(blog.id);
    });

    // Find duplicates
    const duplicates = [];
    titleMap.forEach((docIds, title) => {
      if (docIds.length > 1) {
        duplicates.push({
          title,
          docIds
        });
      }
    });

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      process.exit(0);
      return;
    }

    console.log(`⚠️  Found ${duplicates.length} duplicate entries`);

    // Remove duplicates
    let deletedCount = 0;
    for (const duplicate of duplicates) {
      console.log(`\n🗑️  Removing duplicates of: "${duplicate.title}"`);
      console.log(`   Keeping: ${duplicate.docIds[0]}`);
      
      for (let i = 1; i < duplicate.docIds.length; i++) {
        const docId = duplicate.docIds[i];
        await deleteDoc(doc(db, 'blogs', docId));
        console.log(`   Deleted: ${docId}`);
        deletedCount++;
      }
    }

    console.log(`\n✅ Successfully removed ${deletedCount} duplicate blogs!`);
    console.log(`📊 Remaining blogs: ${blogs.length - deletedCount}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    process.exit(1);
  }
}

removeDuplicateBlogs();
