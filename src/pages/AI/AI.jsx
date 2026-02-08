/**
 * AI Page Container
 * Main page component that orchestrates all chat components
 * Follows strict separation of concerns pattern - routing logic only
 */

import { useEffect, useState } from 'react';
import './styles/markdown.css';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ChatSidebar } from './components/ChatSidebar';
import ChatDeletePopup from './components/ChatDeletePopup';
import { useChatHistoryFirebase } from './hooks/useChatHistoryFirebase';
import { useChatInput } from './hooks/useChatInput';
import { generateResponse } from './utils/responseGenerator';

import { useAuth } from '../../hooks/useAuth';

/**
 * AI Page Container Component
 * @returns {JSX.Element} Main AI chat interface
 */
export default function AI() {
  const { user: currentUser } = useAuth();
  const [isShowingDeletePopup, setIsShowingDeletePopup] = useState(false);
  
  const {
    chats,
    messages: chatMessages, 
    activeChatId,
    loading: isLoading,
    isSending,
    error, 
    sendMessage: sendFirebaseMessage, 
    createNewChat,
    selectChat,
    deleteChat,
    clearError
  } = useChatHistoryFirebase(currentUser);

  // Initialize chat on first load if none exists
  useEffect(() => {
    if (!activeChatId && !isLoading && currentUser && chats.length === 0) {
      createNewChat('AlgoView AI Chat');
    }
  }, [activeChatId, isLoading, createNewChat, currentUser, chats.length]);
  
  const { input, setInput, clearInput } = useChatInput();

  // Handle message submission with ChatGPT-like behavior
  const handleSubmit = async (content) => {
    if (!content.trim() || isLoading || isSending || !activeChatId) return;

    const userMessage = content.trim();
    clearInput();
    
    try {
      // Step 1: Send user message (optimistic update handled by hook)
      console.log('📤 User message:', userMessage);
      await sendFirebaseMessage('user', userMessage);
      
      // Step 2: Generate AI response with proper prompting
      console.log('🤖 Generating AI response...');
      const aiResponse = await generateResponse(userMessage);
      console.log('✅ AI response generated');
      
      // Step 3: Send AI response (optimistic update handled by hook)
      await sendFirebaseMessage('assistant', aiResponse);
      
    } catch (err) {
      console.error('❌ Error in message handling:', err);
      
      // Send a helpful error message
      const errorMessage = `I encountered an error while processing your request. This might be because:
- The Gemini API key is not configured (add VITE_GEMINI_API_KEY to .env)
- There's a network connectivity issue
- The API service is temporarily unavailable

Please try again, or make sure your API key is properly configured for better responses.`;
      try {
        await sendFirebaseMessage('assistant', errorMessage);
      } catch (sendError) {
        console.error('Failed to send error message:', sendError);
      }
    }
  };

  // Handle copy functionality
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Handle clear chat (delete current chat)
  const handleClear = async () => {
    if (activeChatId) {
      setIsShowingDeletePopup(true);
    }
  };

  // Confirm deletion of the chat
  const handleConfirmDelete = async () => {
    if (activeChatId) {
      try {
        await deleteChat(activeChatId);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  // Clear error when user interacts
  const handleErrorClear = () => {
    clearError();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={selectChat}
        onCreateChat={createNewChat}
        onDeleteChat={deleteChat}
        loading={isLoading}
        error={error}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <Header 
          title="AlgoView AI"
          subtitle="Algorithm Assistant"
          isOnline={true}
          onClear={handleClear}
          disabled={isLoading || isSending}
        />

        {/* Chat Window - Takes remaining space */}
        <ChatWindow
          messages={chatMessages}
          onCopy={handleCopy}
        />

        {/* Fixed Input Area at Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="w-full max-w-3xl mx-auto px-4 py-4">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onCopy={handleCopy}
              isLoading={isSending}
              disabled={!activeChatId || isSending}
              placeholder="Message AlgoView AI..."
            />
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-sm">
            <span className="text-sm flex-1">{error.message || 'An error occurred'}</span>
            <button 
              onClick={handleErrorClear}
              className="text-white hover:text-gray-200 font-bold text-lg"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {/* Chat Delete Confirmation Popup */}
        <ChatDeletePopup
          isOpen={isShowingDeletePopup}
          onClose={() => setIsShowingDeletePopup(false)}
          onConfirm={handleConfirmDelete}
          chatTitle={chats.find(c => c.id === activeChatId)?.title || 'this chat'}
        />
      </div>
    </div>
  );
}