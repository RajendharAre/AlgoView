import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCtf7yKvJlHjEjuOhIhvEqNv-VWJ_y3jT4',
  authDomain: 'algorithm-visualizer-b963c.firebaseapp.com',
  projectId: 'algorithm-visualizer-b963c',
  storageBucket: 'algorithm-visualizer-b963c.appspot.com',
  messagingSenderId: '644676218614',
  appId: '1:644676218614:web:c3d6b9ee0e1ee01c98e1b9',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const testBlog = {
  title: 'Test Blog 4',
  slug: 'test-blog-4',
  excerpt: 'This is a full test',
  content: 'Test content here with timestamps',
  category: 'DSA & Algorithms',
  tags: ['test', 'blog'],
  keywords: 'test,blog,dsa',
  authorEmail: 'test@algoview.me',
  authorId: 'test-author-id',
  status: 'published',
}

async function testAddBlog() {
  try {
    console.log('🧪 Testing blog addition...')
    console.log('Data being sent:', JSON.stringify(testBlog, null, 2))

    const blogsRef = collection(db, 'blogs')
    const docData = {
      ...testBlog,
      views: 0,
      readTime: '5 min',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(blogsRef, docData)

    console.log('✅ Blog added successfully with ID:', docRef.id)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
    process.exit(1)
  }
}

testAddBlog()
