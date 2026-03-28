// Script to remove duplicate blogs from Firestore
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filenameNew = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filenameNew);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function removeDuplicateBlogs() {
  try {
    console.log('🔍 Fetching all blogs...');
    const blogsSnapshot = await db.collection('blogs').get();
    
    if (blogsSnapshot.empty) {
      console.log('📭 No blogs found');
      process.exit(0);
      return;
    }

    const blogs = [];
    const titleMap = new Map(); // Map to track titles and their document IDs

    blogsSnapshot.forEach(doc => {
      const blog = doc.data();
      blogs.push({
        id: doc.id,
        ...blog
      });
    });

    console.log(`📚 Found ${blogs.length} total blogs`);

    // Group by title to find duplicates
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

    // Remove duplicates (keep first, delete rest)
    let deletedCount = 0;
    for (const duplicate of duplicates) {
      console.log(`\n🗑️  Removing duplicates of: "${duplicate.title}"`);
      console.log(`   Keeping: ${duplicate.docIds[0]}`);
      
      // Delete all except the first one
      for (let i = 1; i < duplicate.docIds.length; i++) {
        const docId = duplicate.docIds[i];
        await db.collection('blogs').doc(docId).delete();
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

// Run the deduplication
removeDuplicateBlogs();
