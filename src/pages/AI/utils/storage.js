/**
 * Firebase Firestore storage utilities for chat messages
 * Centralized storage operations with proper error handling
 */

import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

/**
 * Create a new chat session
 * @param {string} userId - User ID
 * @param {string} title - Chat title
 * @returns {Promise<string>} Chat session ID
 */
export async function createChatSession(userId, title = 'New Chat') {
  try {
    const chatRef = await addDoc(collection(db, 'users', userId, 'chats'), {
      title,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return chatRef.id;
  } catch (error) {
    throw new Error(`Failed to create chat session: ${error.message}`);
  }
}

/**
 * Add a message to a chat session
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @param {Object} messageData - Message data
 * @returns {Promise<string>} Message ID
 */
export async function addMessage(userId, chatId, messageData) {
  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const messageRef = await addDoc(messagesRef, {
      role: messageData.role,
      content: messageData.content,
      createdAt: serverTimestamp()
    });
    return messageRef.id;
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
}

/**
 * Subscribe to chat messages in real-time
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @param {Function} callback - Callback function to receive messages
 * @param {number} limitCount - Number of messages to fetch (default: 50)
 * @returns {Function} Unsubscribe function
 */
export function subscribeToMessages(userId, chatId, callback, limitCount = 50) {
  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const q = query(
      messagesRef,
      orderBy('createdAt', 'asc'),
      // limit(limitCount) // Removed limit for now to show all messages
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle timestamp conversion properly
        let createdAt;
        if (data.createdAt?.toDate) {
          // Firebase Timestamp
          createdAt = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          // Already a Date object
          createdAt = data.createdAt;
        } else {
          // Fallback to current time
          createdAt = data.createdAt || new Date();
        }
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAt
        };
      });
      
      callback(messages, null);
    }, (error) => {
      callback([], error);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to messages: ${error.message}`);
  }
}

/**
 * Update chat session timestamp
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @returns {Promise<void>}
 */
export async function updateChatTimestamp(userId, chatId) {
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    // Don't throw error as this is non-critical
    console.warn('Failed to update chat timestamp:', error.message);
  }
}

/**
 * Delete a chat and all its messages
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @returns {Promise<void>}
 */
export async function deleteChat(userId, chatId) {
  try {
    // Delete all messages first
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const messagesSnapshot = await new Promise((resolve) => {
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        resolve(snapshot);
        unsubscribe();
      });
    });
    
    // Delete each message
    const deletePromises = messagesSnapshot.docs.map(messageDoc =>
      deleteDoc(doc(db, 'users', userId, 'chats', chatId, 'messages', messageDoc.id))
    );
    await Promise.all(deletePromises);
    
    // Delete the chat document
    await deleteDoc(doc(db, 'users', userId, 'chats', chatId));
  } catch (error) {
    throw new Error(`Failed to delete chat: ${error.message}`);
  }
}

/**
 * Get chat session data
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @returns {Promise<Object|null>} Chat session data or null if not found
 */
export async function getChatSession(userId, chatId) {
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      return {
        id: chatSnap.id,
        ...chatSnap.data(),
        createdAt: chatSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: chatSnap.data().updatedAt?.toDate() || new Date()
      };
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to get chat session: ${error.message}`);
  }
}

// Helper function to format message for storage
export function formatMessageForStorage(message) {
  return {
    role: message.role,
    content: message.content,
    createdAt: serverTimestamp()
  };
}

// Helper function to format message for display
export function formatMessageForDisplay(firestoreMessage) {
  return {
    id: firestoreMessage.id,
    content: firestoreMessage.content,
    role: firestoreMessage.role,
    createdAt: firestoreMessage.createdAt
  };
}