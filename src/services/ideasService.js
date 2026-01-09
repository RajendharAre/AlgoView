import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  increment, 
  getDoc,
  setDoc,
  deleteDoc,
  getCountFromServer,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Firestore Collections Structure:
 * 
 * ideas (collection)
 *   └── ideaId (document)
 *         title
 *         description
 *         authorId
 *         authorName
 *         createdAt
 *         likeCount
 *         commentCount
 *         tags
 *
 *         likes (subcollection)
 *             └── userId → { timestamp }
 *
 *         comments (subcollection)
 *             └── commentId
 *                 userId
 *                 authorName
 *                 text
 *                 createdAt
 */

// Collection references
const ideasCollection = collection(db, 'ideas');

// Get all ideas with real-time listener
export const getIdeasListener = (callback, errorHandler) => {
  const q = query(ideasCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const ideas = [];
      snapshot.forEach((doc) => {
        ideas.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(ideas);
    },
    (error) => {
      console.error('Error fetching ideas:', error);
      errorHandler && errorHandler(error);
    }
  );
};

// Submit a new idea
export const submitIdea = async (ideaData, userId, userName) => {
  try {
    const newIdea = {
      title: ideaData.title,
      description: ideaData.description,
      authorId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      likeCount: 0,
      commentCount: 0,
      tags: ideaData.tags || [],
    };

    const docRef = await addDoc(ideasCollection, newIdea);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting idea:', error);
    return { success: false, error: error.message };
  }
};

// Like an idea (using atomic operations to prevent race conditions)
export const likeIdea = async (ideaId, userId) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const likeRef = doc(db, 'ideas', ideaId, 'likes', userId);
    
    // Check if user already liked this idea
    const likeDoc = await getDoc(likeRef);
    
    if (likeDoc.exists()) {
      // User already liked, so unlike it
      await deleteDoc(likeRef);
      await updateDoc(ideaRef, {
        likeCount: increment(-1)
      });
      return { success: true, liked: false };
    } else {
      // User hasn't liked yet, so like it
      await setDoc(likeRef, {
        timestamp: serverTimestamp()
      });
      await updateDoc(ideaRef, {
        likeCount: increment(1)
      });
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error liking idea:', error);
    return { success: false, error: error.message };
  }
};

// Check if a user has liked an idea
export const checkUserLike = async (ideaId, userId) => {
  try {
    const likeRef = doc(db, 'ideas', ideaId, 'likes', userId);
    const likeDoc = await getDoc(likeRef);
    return likeDoc.exists();
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
};

// Add a comment to an idea
export const addComment = async (ideaId, userId, userName, commentText) => {
  try {
    const commentsCollection = collection(db, 'ideas', ideaId, 'comments');
    const ideaRef = doc(db, 'ideas', ideaId);
    
    const newComment = {
      userId,
      authorName: userName,
      text: commentText,
      createdAt: serverTimestamp(),
    };
    
    const commentRef = await addDoc(commentsCollection, newComment);
    
    // Increment comment count atomically
    await updateDoc(ideaRef, {
      commentCount: increment(1)
    });
    
    return { success: true, id: commentRef.id };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

// Get comments for an idea with real-time listener
export const getCommentsListener = (ideaId, callback, errorHandler) => {
  const commentsCollection = collection(db, 'ideas', ideaId, 'comments');
  const q = query(commentsCollection, orderBy('createdAt', 'asc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const comments = [];
      snapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(comments);
    },
    (error) => {
      console.error('Error fetching comments:', error);
      errorHandler && errorHandler(error);
    }
  );
};

// Get a single idea
export const getIdea = async (ideaId) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const ideaSnap = await getDoc(ideaRef);
    
    if (ideaSnap.exists()) {
      return {
        id: ideaSnap.id,
        ...ideaSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting idea:', error);
    return null;
  }
};