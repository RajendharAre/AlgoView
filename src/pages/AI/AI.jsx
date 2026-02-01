/**
 * AI Page Container
 * Main page component that orchestrates all chat components
 * Follows strict separation of concerns pattern - routing logic only
 */

import { useEffect } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ChatSidebar } from './components/ChatSidebar';
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
      const userMessageId = await sendFirebaseMessage('user', userMessage);
      
      // Step 2: Generate AI response
      console.log('Generating AI response for:', userMessage);
      const aiResponse = await generateResponse(userMessage);
      console.log('Generated AI response:', aiResponse);
      
      // Step 3: Send AI response (optimistic update handled by hook)
      await sendFirebaseMessage('assistant', aiResponse);
      
    } catch (err) {
      console.error('Error in message handling:', err);
      
      // Send a fallback error message to maintain conversation flow
      const errorMessage = `<div class="ai-response"><p>Sorry, I encountered an error processing your request. Please try again.</p></div>`;
      try {
        await sendFirebaseMessage('assistant', errorMessage);
      } catch (sendError) {
        console.error('Failed to send fallback message:', sendError);
        // Even if we can't send the fallback, we've logged the original error
      }
    }
  };

  // Handle copy functionality
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Handle clear chat (delete current chat)
  const handleClear = async () => {
    if (activeChatId && window.confirm('Delete this chat and all messages?')) {
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
      <div className="flex-1 flex flex-col h-full max-h-screen">
        {/* Header */}
        <Header 
          title="AlgoView AI"
          subtitle="Algorithm Assistant"
          isOnline={true}
          onClear={handleClear}
          disabled={isLoading || isSending}
        />

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
          <ChatWindow
            messages={chatMessages}
            isLoading={isLoading}
            isSending={isSending}
            onCopy={handleCopy}
            loadingText="AI is thinking..."
          />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onCopy={handleCopy}
              isLoading={isSending}
              disabled={!activeChatId || isLoading || isSending}
              placeholder="Message AlgoView AI..."
            />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-md">
            <span className="text-sm flex-1">{error.message || 'An error occurred'}</span>
            <button 
              onClick={handleErrorClear}
              className="text-white hover:text-gray-200 font-bold text-lg ml-2"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}