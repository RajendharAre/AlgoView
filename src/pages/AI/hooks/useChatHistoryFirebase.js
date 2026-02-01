/**
 * Reusable hook for managing chat history with Firebase Firestore
 * Handles real-time chat synchronization, message management, and CRUD operations
 * Follows strict separation of concerns pattern
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../../lib/firebase';
import { generateChatTitle, updateChatTitle } from '../utils/chatTitleGenerator';

/**
 * Custom hook for Firebase chat history management with user authentication
 * @param {Object} currentUser - Current authenticated user object from Firebase Auth
 * @returns {Object} Chat history state and management functions
 */
export function useChatHistoryFirebase(currentUser) {
  // State management
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [lastMessages, setLastMessages] = useState({});
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  
  // Use user UID as the identifier
  const userId = currentUser?.uid;
  
  // Refs for cleanup and state tracking
  const chatsUnsubscribeRef = useRef(null);
  const messagesUnsubscribeRef = useRef(null);
  const isInitializedRef = useRef(false);
  const activeChatIdRef = useRef(activeChatId);
  const pendingMessagesRef = useRef(new Map());

  // Update ref when activeChatId changes
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Fetch all chats for the authenticated user in real-time
  const fetchUserChats = useCallback(() => {
    // Do nothing if user is not authenticated
    if (!userId) {
      setChats([]);
      setMessages([]);
      setActiveChatId(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Prevent duplicate listeners
    if (chatsUnsubscribeRef.current) {
      chatsUnsubscribeRef.current();
      chatsUnsubscribeRef.current = null;
    }

    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const chatsQuery = query(chatsRef, orderBy('updatedAt', 'desc'));
      
      chatsUnsubscribeRef.current = onSnapshot(chatsQuery, 
        (snapshot) => {
          const chatList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            lastMessage: lastMessages[doc.id] || ''
          }));
          
          setChats(chatList);
          setLoading(false);
          setError(null);
          
          // If no active chat and we have chats, select the first one
          if (!activeChatIdRef.current && chatList.length > 0) {
            setActiveChatId(chatList[0].id);
          }
        },
        (error) => {
          // Handle permission-denied errors gracefully
          if (error.code === 'permission-denied') {
            setChats([]);
            setMessages([]);
            setActiveChatId(null);
            setError(new Error('Permission denied. Please log in to access your chats.'));
          } else if (error.code === 'unauthenticated') {
            setChats([]);
            setMessages([]);
            setActiveChatId(null);
            setError(new Error('Authentication required. Please log in.'));
          } else {
            setError(new Error(`Failed to load chats: ${error.message}`));
          }
          setLoading(false);
        }
      );
    } catch (error) {
      setError(new Error(`Failed to initialize chat system: ${error.message}`));
      setLoading(false);
    }
  }, [userId, lastMessages]);

  // Fetch messages for the active chat in real-time
  const fetchActiveChatMessages = useCallback(() => {
    // Reset messages when switching chats
    setMessages([]);
    setOptimisticMessages([]);
    // Do nothing if user is not authenticated or no active chat
    if (!userId || !activeChatId) {
      setMessages([]);
      setOptimisticMessages([]);
      return;
    }

    // Prevent duplicate listeners
    if (messagesUnsubscribeRef.current) {
      messagesUnsubscribeRef.current();
      messagesUnsubscribeRef.current = null;
    }

    try {
      const messagesRef = collection(db, 'users', userId, 'chats', activeChatId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'), orderBy('__name__', 'asc'));
      
      messagesUnsubscribeRef.current = onSnapshot(messagesQuery,
        (snapshot) => {
          const messageList = snapshot.docs.map(doc => {
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
          
          // Ensure messages are properly sorted by creation time
          const sortedMessages = [...messageList].sort((a, b) => {
            // First sort by createdAt
            const timeDiff = a.createdAt.getTime() - b.createdAt.getTime();
            if (timeDiff !== 0) return timeDiff;
            // Then sort by document ID as tiebreaker
            return a.id.localeCompare(b.id);
          });
          
          console.log('Firestore snapshot received:', messageList.length, 'messages');
          console.log('Sorted messages:', sortedMessages);
          
          // Filter out any pending optimistic messages that have been confirmed
          const confirmedMessageIds = new Set(sortedMessages.map(msg => msg.id));
          const filteredOptimistic = optimisticMessages.filter(
            msg => !confirmedMessageIds.has(msg.tempId || msg.id)
          );
          
          setMessages(sortedMessages);
          setOptimisticMessages(filteredOptimistic);
          setError(null);
          
          // Update last message for this chat
          if (sortedMessages.length > 0) {
            const lastMessage = sortedMessages[sortedMessages.length - 1];
            setLastMessages(prev => ({
              ...prev,
              [activeChatId]: lastMessage.content.substring(0, 50)
            }));
          }
        },
        (error) => {
          console.error('Error in messages subscription:', error);
          // Handle permission-denied errors gracefully
          if (error.code === 'permission-denied') {
            setMessages([]);
            setError(new Error('Permission denied. You can only access messages in your own chats.'));
          } else if (error.code === 'unauthenticated') {
            setMessages([]);
            setError(new Error('Authentication required to access messages.'));
          } else {
            setError(new Error(`Failed to load messages: ${error.message}`));
          }
        }
      );
    } catch (error) {
      setError(new Error(`Failed to initialize message listener: ${error.message}`));
    }
  }, [userId, activeChatId]);

  // Create new chat
  const createNewChat = useCallback(async (title = 'New Chat') => {
    if (!userId) {
      const error = new Error('User must be logged in to create chat');
      setError(error);
      throw error;
    }

    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const chatDoc = await addDoc(chatsRef, {
        title,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Automatically select the new chat
      setActiveChatId(chatDoc.id);
      setError(null);
      return chatDoc.id;
    } catch (error) {
      const userError = new Error(`Failed to create new chat: ${error.message}`);
      setError(userError);
      throw userError;
    }
  }, [userId]);

  // Select active chat
  const selectChat = useCallback((chatId) => {
    if (chats.some(chat => chat.id === chatId) && chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
  }, [chats, activeChatId]);

  // Delete chat and its messages
  const deleteChat = useCallback(async (chatId) => {
    if (!userId || !chatId) return;

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
      
      // Remove from lastMessages cache
      setLastMessages(prev => {
        const newLastMessages = { ...prev };
        delete newLastMessages[chatId];
        return newLastMessages;
      });
      
      // If deleted chat was active, select another chat or clear active chat
      if (activeChatId === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
      }
      
      setError(null);
    } catch (error) {
      const userError = new Error(`Failed to delete chat: ${error.message}`);
      setError(userError);
      throw userError;
    }
  }, [userId, activeChatId, chats]);

  // Send message to active chat with optimistic updates
  const sendMessage = useCallback(async (role, content) => {
    if (!userId || !activeChatId || !content?.trim()) {
      const error = new Error('Missing required parameters: userId, activeChatId, or content');
      setError(error);
      throw error;
    }

    const trimmedContent = content.trim();
    setIsSending(true);
    
    // Create optimistic message
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage = {
      id: tempId,
      tempId: tempId,
      role,
      content: trimmedContent,
      createdAt: new Date(),
      isOptimistic: true
    };
    
    // Add to pending messages map
    pendingMessagesRef.current.set(tempId, optimisticMessage);
    
    // Add to optimistic messages array immediately
    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    
    try {
      // Add message to chat
      const messagesRef = collection(db, 'users', userId, 'chats', activeChatId, 'messages');
      const messageData = {
        role,
        content: trimmedContent,
        createdAt: serverTimestamp()
      };
      
      const messageRef = await addDoc(messagesRef, messageData);
      console.log(`Message added to Firestore with ID: ${messageRef.id}`, { role, content: trimmedContent });
      console.log('Active chat ID when sending message:', activeChatId);
      
      // Update chat's updatedAt timestamp
      const chatRef = doc(db, 'users', userId, 'chats', activeChatId);
      await updateDoc(chatRef, {
        updatedAt: serverTimestamp()
      });
      
      // Generate and update chat title for first user message
      if (role === 'user') {
        try {
          // Check if this is the first message in the chat
          const messagesQuery = query(collection(db, 'users', userId, 'chats', activeChatId, 'messages'));
          const messagesSnapshotCount = await new Promise((resolve) => {
            const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
              resolve(snapshot.size);
              unsubscribe();
            });
          });
          
          // Update title if this is likely the first user message
          if (messagesSnapshotCount <= 2) {
            const newTitle = generateChatTitle(trimmedContent);
            await updateChatTitle(userId, activeChatId, newTitle);
          }
        } catch (titleError) {
          // Don't throw - title update is not critical
        }
      }
      
      // Remove from pending messages
      pendingMessagesRef.current.delete(tempId);
      
      setError(null);
      return messageRef.id;
    } catch (error) {
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      pendingMessagesRef.current.delete(tempId);
      
      const userError = new Error(`Failed to send message: ${error.message}`);
      setError(userError);
      throw userError;
    } finally {
      setIsSending(false);
    }
  }, [userId, activeChatId]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      if (chatsUnsubscribeRef.current) {
        chatsUnsubscribeRef.current();
        chatsUnsubscribeRef.current = null;
      }
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
    };
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User logged in - re-fetch chats
        if (!isInitializedRef.current) {
          fetchUserChats();
          isInitializedRef.current = true;
        }
      } else {
        // User logged out - clear everything
        if (chatsUnsubscribeRef.current) {
          chatsUnsubscribeRef.current();
          chatsUnsubscribeRef.current = null;
        }
        if (messagesUnsubscribeRef.current) {
          messagesUnsubscribeRef.current();
          messagesUnsubscribeRef.current = null;
        }
        setChats([]);
        setMessages([]);
        setActiveChatId(null);
        setLastMessages({});
        setError(null);
        setLoading(false);
        isInitializedRef.current = false;
      }
    });

    // Cleanup auth listener
    return () => {
      unsubscribeAuth();
      // Also cleanup any existing Firestore listeners
      if (chatsUnsubscribeRef.current) {
        chatsUnsubscribeRef.current();
        chatsUnsubscribeRef.current = null;
      }
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
    };
  }, [fetchUserChats]);

  // Update messages listener when active chat changes
  useEffect(() => {
    fetchActiveChatMessages();
    
    // Cleanup messages listener when component unmounts or activeChatId changes
    return () => {
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
    };
  }, [fetchActiveChatMessages, activeChatId, userId]);

  // Combine messages with optimistic messages
  const allMessages = useMemo(() => {
    // Combine confirmed and optimistic messages, sort by timestamp
    const combined = [
      ...messages,
      ...optimisticMessages.filter(optMsg => 
        !messages.some(confMsg => confMsg.id === optMsg.tempId || confMsg.id === optMsg.id)
      )
    ];
    
    return combined.sort((a, b) => {
      const timeA = a.createdAt.getTime();
      const timeB = b.createdAt.getTime();
      if (timeA !== timeB) return timeA - timeB;
      return (a.id || '').localeCompare(b.id || '');
    });
  }, [messages, optimisticMessages]);

  // Derived state
  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  return {
    // State
    chats,
    activeChatId,
    activeChat,
    messages: allMessages,
    loading,
    error,
    isSending,
    
    // Actions
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
    
    // Utilities
    clearError: () => setError(null)
  };
}