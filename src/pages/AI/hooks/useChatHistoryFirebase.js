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

  // Create new chat
  const createNewChat = useCallback(async (title = 'New Chat') => {
    if (!userId) {
      const error = new Error('User must be logged in to create chat');
      setError(error);
      console.error('createNewChat failed:', error.message);
      throw error;
    }

    try {
      console.log('Creating new chat with title:', title, 'for user:', userId);
      const chatsRef = collection(db, 'users', userId, 'chats');
      const chatDoc = await addDoc(chatsRef, {
        title,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Chat created successfully:', chatDoc.id);
      
      // Automatically select the new chat
      setActiveChatId(chatDoc.id);
      setError(null);
      return chatDoc.id;
    } catch (error) {
      console.error('Error creating chat:', error);
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
      console.error('sendMessage failed:', error.message);
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
    
    console.log('Creating optimistic message:', { tempId, role, contentLength: trimmedContent.length });
    
    // Add to optimistic messages array immediately for instant UI feedback
    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    
    try {
      // Add message to Firestore
      const messagesRef = collection(db, 'users', userId, 'chats', activeChatId, 'messages');
      const messageData = {
        role,
        content: trimmedContent,
        createdAt: serverTimestamp()
      };
      
      console.log('Saving message to Firestore:', { role, contentLength: trimmedContent.length, chatId: activeChatId });
      const messageRef = await addDoc(messagesRef, messageData);
      console.log(`Message saved to Firestore with ID: ${messageRef.id}`);
      
      // Update chat's updatedAt timestamp to show it in sidebar
      const chatRef = doc(db, 'users', userId, 'chats', activeChatId);
      await updateDoc(chatRef, {
        updatedAt: serverTimestamp()
      });
      console.log('Chat updatedAt timestamp updated');
      
      // Generate and update chat title for first user message
      if (role === 'user') {
        try {
          const newTitle = generateChatTitle(trimmedContent);
          await updateChatTitle(userId, activeChatId, newTitle);
          console.log('Chat title updated to:', newTitle);
        } catch (titleError) {
          console.warn('Title update failed (non-critical):', titleError.message);
        }
      }
      
      // Remove optimistic message - real message will appear from Firestore listener
      setOptimisticMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      
      setError(null);
      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      
      const userError = new Error(`Failed to send message: ${error.message}`);
      setError(userError);
      throw userError;
    } finally {
      setIsSending(false);
    }
  }, [userId, activeChatId]);

  // Initialize chat listener when userId changes
  useEffect(() => {
    console.log('Setting up auth listener, current userId:', userId);
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        console.log('User authenticated, setting up chats listener:', user.uid);
        // Set up the real-time chats listener
        const chatsRef = collection(db, 'users', user.uid, 'chats');
        const chatsQuery = query(chatsRef, orderBy('updatedAt', 'desc'));
        
        if (chatsUnsubscribeRef.current) {
          chatsUnsubscribeRef.current();
        }
        
        chatsUnsubscribeRef.current = onSnapshot(chatsQuery, 
          (snapshot) => {
            const chatList = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(),
                updatedAt: data.updatedAt?.toDate?.() || new Date(),
                lastMessage: lastMessages[doc.id] || ''
              };
            });
            
            console.log('Chats loaded:', chatList.length);
            setChats(chatList);
            setLoading(false);
            setError(null);
            
            // Auto-select first chat if none selected
            if (!activeChatIdRef.current && chatList.length > 0) {
              console.log('Auto-selecting first chat:', chatList[0].id);
              setActiveChatId(chatList[0].id);
            }
          },
          (error) => {
            console.error('Error loading chats:', error);
            setError(new Error(`Failed to load chats: ${error.message}`));
            setLoading(false);
          }
        );
      } else {
        console.log('User not authenticated');
        setChats([]);
        setMessages([]);
        setActiveChatId(null);
        setError(null);
        setLoading(false);
        if (chatsUnsubscribeRef.current) {
          chatsUnsubscribeRef.current();
          chatsUnsubscribeRef.current = null;
        }
        if (messagesUnsubscribeRef.current) {
          messagesUnsubscribeRef.current();
          messagesUnsubscribeRef.current = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Set up messages listener when active chat changes
  useEffect(() => {
    if (!userId || !activeChatId) {
      console.log('Clearing messages - no userId or activeChatId');
      setMessages([]);
      setOptimisticMessages([]);
      
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
      return;
    }

    console.log('Setting up messages listener for chat:', activeChatId);
    
    // Clean up previous listener
    if (messagesUnsubscribeRef.current) {
      messagesUnsubscribeRef.current();
      messagesUnsubscribeRef.current = null;
    }

    try {
      const messagesRef = collection(db, 'users', userId, 'chats', activeChatId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
      
      messagesUnsubscribeRef.current = onSnapshot(messagesQuery,
        (snapshot) => {
          const messageList = snapshot.docs.map(doc => {
            const data = doc.data();
            
            let createdAt;
            if (data.createdAt?.toDate) {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt instanceof Date) {
              createdAt = data.createdAt;
            } else {
              createdAt = new Date();
            }
            
            return {
              id: doc.id,
              ...data,
              createdAt: createdAt
            };
          });
          
          console.log('Messages loaded for chat:', activeChatId, '- count:', messageList.length);
          
          // Update last message
          if (messageList.length > 0) {
            const lastMsg = messageList[messageList.length - 1];
            setLastMessages(prev => ({
              ...prev,
              [activeChatId]: lastMsg.content?.substring(0, 50) || 'No preview'
            }));
          }
          
          setMessages(messageList);
          setOptimisticMessages(prev => 
            prev.filter(opt => 
              !messageList.some(msg => msg.id === opt.tempId || msg.id === opt.id)
            )
          );
          setError(null);
        },
        (error) => {
          console.error('Error loading messages:', error);
          setError(new Error(`Failed to load messages: ${error.message}`));
        }
      );
    } catch (error) {
      console.error('Error setting up messages listener:', error);
      setError(new Error(`Failed to set up messages: ${error.message}`));
    }
  }, [userId, activeChatId]);

  // Combine messages with optimistic messages
  const allMessages = useMemo(() => {
    // Combine confirmed and optimistic messages
    const combined = [
      ...messages,
      ...optimisticMessages.filter(optMsg => 
        // Only include optimistic if it hasn't been confirmed in Firestore
        !messages.some(msg => 
          msg.id === optMsg.tempId || 
          msg.id === optMsg.id ||
          (msg.role === optMsg.role && 
           msg.content === optMsg.content &&
           Math.abs(msg.createdAt.getTime() - optMsg.createdAt.getTime()) < 1000)
        )
      )
    ];
    
    // Sort by creation time
    return combined.sort((a, b) => {
      const timeA = a.createdAt?.getTime?.() || 0;
      const timeB = b.createdAt?.getTime?.() || 0;
      return timeA - timeB;
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