import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Firestore Collections Structure:
 *
 * blogs (collection)
 *   └── blogId (document)
 *         title
 *         slug (auto-generated from title)
 *         excerpt
 *         content (markdown)
 *         author (userId)
 *         authorEmail
 *         category (DSA | Web Development)
 *         tags (array)
 *         keywords (SEO keywords)
 *         relatedVisualizer
 *         createdAt
 *         updatedAt
 *         status (published | pending-approval | draft | rejected)
 *         views (counter)
 *         readTime
 */

const blogsCollection = collection(db, 'blogs');

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Get all published blogs with real-time listener
export const getPublishedBlogsListener = (callback, errorHandler) => {
  // Try primary query first
  let unsubscribe;
  let usedFallback = false;

  const setupQuery = () => {
    // If primary failed, use fallback (sort on client)
    const q = usedFallback 
      ? query(blogsCollection, where('status', '==', 'published'))
      : query(
          blogsCollection,
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const blogs = [];
        snapshot.forEach((doc) => {
          blogs.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        // If using fallback, sort client-side
        if (usedFallback) {
          blogs.sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          });
        }
        
        callback(blogs);
      },
      (error) => {
        // Check if index is still building
        if (error.code === 'failed-precondition' && !usedFallback) {
          console.warn('⏳ Firestore indexes building, using client-side sort...');
          usedFallback = true;
          setupQuery(); // Retry with fallback query
          return;
        }

        console.error('Error fetching blogs:', error);
        errorHandler && errorHandler(error);
      }
    );
  };

  setupQuery();
  return () => unsubscribe?.();
};

// Get pending approval blogs for admins
export const getPendingBlogsListener = (callback, errorHandler) => {
  let unsubscribe;
  let usedFallback = false;

  const setupQuery = () => {
    const q = usedFallback 
      ? query(blogsCollection, where('status', '==', 'pending-approval'))
      : query(
          blogsCollection,
          where('status', '==', 'pending-approval'),
          orderBy('createdAt', 'desc')
        );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const blogs = [];
        snapshot.forEach((doc) => {
          blogs.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        if (usedFallback) {
          blogs.sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          });
        }
        
        callback(blogs);
      },
      (error) => {
        if (error.code === 'failed-precondition' && !usedFallback) {
          console.warn('⏳ Firestore indexes building, using client-side sort for pending blogs...');
          usedFallback = true;
          setupQuery();
          return;
        }

        console.error('Error fetching pending blogs:', error);
        errorHandler && errorHandler(error);
      }
    );
  };

  setupQuery();
  return () => unsubscribe?.();
};

// Get single blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    const q = query(
      blogsCollection,
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
};

// Submit new blog
export const submitBlog = async (blogData, userId, userEmail) => {
  try {
    console.log('🔥 Firebase submitBlog called with:', { userId, userEmail });

    const slug = generateSlug(blogData.title);

    // Check if slug already exists
    const existingBlog = await getDocs(query(blogsCollection, where('slug', '==', slug)));
    if (!existingBlog.empty) {
      return { success: false, error: 'A blog with this title already exists' };
    }

    const newBlog = {
      title: blogData.title,
      slug: slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      authorId: userId,
      authorEmail: userEmail,
      category: blogData.category,
      tags: blogData.tags.split(',').map(tag => tag.trim()),
      keywords: blogData.keywords,
      relatedVisualizer: blogData.relatedVisualizer || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending-approval', // Default status - admin must approve
      views: 0,
      readTime: blogData.readTime || calculateReadTime(blogData.content),
    };

    console.log('🔥 Saving blog with data:', newBlog);

    const docRef = await addDoc(blogsCollection, newBlog);

    // Track event for analytics
    console.log(`📝 Blog submitted: ${slug} by ${userEmail}`);

    return { success: true, id: docRef.id, slug: slug };
  } catch (error) {
    console.error('🔴 Error submitting blog:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { success: false, error: error.message };
  }
};

// Approve blog (admin only)
export const approveBlog = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      status: 'published',
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error approving blog:', error);
    return { success: false, error: error.message };
  }
};

// Reject blog (admin only)
export const rejectBlog = async (blogId, reason = '') => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting blog:', error);
    return { success: false, error: error.message };
  }
};

// Update blog view count
export const incrementBlogViews = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Error updating blog views:', error);
  }
};

// Edit blog (author or admin only)
export const editBlog = async (blogId, updates) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // If title changed, regenerate slug
    if (updates.title) {
      const newSlug = generateSlug(updates.title);
      const existingBlog = await getDocs(
        query(blogsCollection, where('slug', '==', newSlug), where('id', '!=', blogId))
      );
      if (!existingBlog.empty) {
        return { success: false, error: 'A blog with this title already exists' };
      }
      updateData.slug = newSlug;
    }

    await updateDoc(blogRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error editing blog:', error);
    return { success: false, error: error.message };
  }
};

// Delete blog (author or admin only)
export const deleteBlog = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await deleteDoc(blogRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: error.message };
  }
};

// Get blogs by category
export const getBlogsByCategory = async (category) => {
  try {
    const q = query(
      blogsCollection,
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const blogs = [];
    snapshot.forEach((doc) => {
      blogs.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return blogs;
  } catch (error) {
    // Fallback: query without orderBy if index is building
    if (error.code === 'failed-precondition') {
      console.warn('⏳ Index building, fetching without sort order...');
      try {
        const fallbackQ = query(
          blogsCollection,
          where('status', '==', 'published'),
          where('category', '==', category)
        );
        const snapshot = await getDocs(fallbackQ);

        const blogs = [];
        snapshot.forEach((doc) => {
          blogs.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        // Sort client-side
        blogs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        return blogs;
      } catch (fallbackError) {
        console.error('Error in fallback query:', fallbackError);
        return [];
      }
    }

    console.error('Error fetching blogs by category:', error);
    return [];
  }
};

// Search blogs
export const searchBlogs = async (searchTerm) => {
  try {
    const q = query(
      blogsCollection,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const searchLower = searchTerm.toLowerCase();
    const results = [];

    snapshot.forEach((doc) => {
      const blog = doc.data();
      if (
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      ) {
        results.push({
          id: doc.id,
          ...blog,
        });
      }
    });

    return results;
  } catch (error) {
    // Fallback: query without orderBy if index is building
    if (error.code === 'failed-precondition') {
      console.warn('⏳ Index building, searching without sort order...');
      try {
        const fallbackQ = query(
          blogsCollection,
          where('status', '==', 'published')
        );
        const snapshot = await getDocs(fallbackQ);

        const searchLower = searchTerm.toLowerCase();
        const results = [];

        snapshot.forEach((doc) => {
          const blog = doc.data();
          if (
            blog.title.toLowerCase().includes(searchLower) ||
            blog.excerpt.toLowerCase().includes(searchLower) ||
            blog.content.toLowerCase().includes(searchLower) ||
            (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          ) {
            results.push({
              id: doc.id,
              ...blog,
            });
          }
        });

        return results;
      } catch (fallbackError) {
        console.error('Error in fallback search:', fallbackError);
        return [];
      }
    }

    console.error('Error searching blogs:', error);
    return [];
  }
};

// Calculate read time (rough estimate: 200 words per minute)
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min`;
};

// Get user's drafted/pending blogs
export const getUserBlogs = async (userId) => {
  try {
    const q = query(
      blogsCollection,
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const blogs = [];
    snapshot.forEach((doc) => {
      blogs.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return blogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
};
