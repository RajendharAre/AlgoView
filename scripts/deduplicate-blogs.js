// Script to remove duplicate blogs from Firestore
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (error) {
  console.error('Firebase already initialized or key not found:', error.message);
}

const db = admin.firestore();

async function removeDuplicateBlogs() {
  try {
    console.log('🔍 Fetching all blogs...');
    const blogsSnapshot = await db.collection('blogs').get();
    
    if (blogsSnapshot.empty) {
      console.log('📭 No blogs found');
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

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
  } finally {
    process.exit(0);
  }
}

// Run the deduplication
removeDuplicateBlogs();
