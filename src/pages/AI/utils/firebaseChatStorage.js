/**
 * Firebase Firestore storage utilities for chat messages
 * Handles all Firestore operations for the AI chat system
 */

import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }
}

/**
 * Add a message to a chat session
 * @param {string} userId - User ID
 * @param {string} chatId - Chat session ID
 * @param {Object} messageData - Message data
 * @param {string} messageData.content - Message content
 * @param {string} messageData.role - Message role
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
    console.error('Error adding message:', error);
    throw new Error('Failed to send message');
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
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      callback(messages);
    }, (error) => {
      console.error('Error subscribing to messages:', error);
      callback([], error);
    });
  } catch (error) {
    console.error('Error setting up message subscription:', error);
    throw new Error('Failed to subscribe to messages');
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
    console.error('Error updating chat timestamp:', error);
    // Don't throw error as this is non-critical
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
    console.error('Error getting chat session:', error);
    throw new Error('Failed to get chat session');
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
    timestamp: firestoreMessage.createdAt,
    type: firestoreMessage.role
  };
}