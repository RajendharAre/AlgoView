/**
 * AI Page Container
 * Main page component that orchestrates all chat components
 * Follows strict separation of concerns pattern - routing logic only
 */

import { useEffect, useState } from 'react'
import './styles/markdown.css'
import { Header } from './components/Header'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { ChatSidebar } from './components/ChatSidebar'
import ChatDeletePopup from './components/ChatDeletePopup'
import { useChatHistoryFirebase } from './hooks/useChatHistoryFirebase'
import { useChatInput } from './hooks/useChatInput'
import { generateResponse } from './utils/responseGenerator'
import { Menu } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

/**
 * AI Page Container Component
 * @returns {JSX.Element} Main AI chat interface
 */
export default function AI() {
  const { user: currentUser } = useAuth()
  const [isShowingDeletePopup, setIsShowingDeletePopup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    clearError,
  } = useChatHistoryFirebase(currentUser)

  // Initialize chat on first load if none exists
  useEffect(() => {
    if (!activeChatId && !isLoading && currentUser && chats.length === 0) {
      createNewChat('AlgoView AI Chat')
    }
  }, [activeChatId, isLoading, createNewChat, currentUser, chats.length])

  const { input, setInput, clearInput } = useChatInput()

  // Handle message submission with ChatGPT-like behavior
  const handleSubmit = async content => {
    if (!content.trim() || isLoading || isSending || !activeChatId) return

    const userMessage = content.trim()
    clearInput()

    try {
      // Step 1: Send user message (optimistic update handled by hook)
      console.log('📤 User message:', userMessage)
      await sendFirebaseMessage('user', userMessage)

      // Step 2: Generate AI response with proper prompting
      console.log('🤖 Generating AI response...')
      const aiResponse = await generateResponse(userMessage)
      console.log('✅ AI response generated')

      // Step 3: Send AI response (optimistic update handled by hook)
      await sendFirebaseMessage('assistant', aiResponse)
    } catch (err) {
      console.error('❌ Error in message handling:', err)

      // Send a helpful error message
      const errorMessage = `I encountered an error while processing your request. This might be because:
- The Gemini API key is not configured (add VITE_GEMINI_API_KEY to .env)
- There's a network connectivity issue
- The API service is temporarily unavailable

Please try again, or make sure your API key is properly configured for better responses.`
      try {
        await sendFirebaseMessage('assistant', errorMessage)
      } catch (sendError) {
        console.error('Failed to send error message:', sendError)
      }
    }
  }

  // Handle copy functionality
  const handleCopy = text => {
    navigator.clipboard.writeText(text)
  }

  // Handle clear chat (delete current chat)
  const handleClear = async () => {
    if (activeChatId) {
      setIsShowingDeletePopup(true)
    }
  }

  // Confirm deletion of the chat
  const handleConfirmDelete = async () => {
    if (activeChatId) {
      try {
        await deleteChat(activeChatId)
      } catch (err) {
        // Error is handled by the hook
      }
    }
  }

  // Clear error when user interacts
  const handleErrorClear = () => {
    clearError()
  }

  return (
    <div
      className="flex h-[calc(100vh-4rem)] min-h-[500px] bg-[var(--bg-primary,#343541)] text-[var(--text-primary,#ececf1)] relative"
      style={{
        /* ChatGPT palette — single source of truth for all child components */
        '--bg-primary': '#343541',
        '--bg-sidebar': '#202123',
        '--bg-user-msg': '#2b2f36',
        '--bg-assistant-msg': '#444654',
        '--text-primary': '#ececf1',
        '--text-secondary': '#8e8ea0',
        '--accent': '#10a37f',
        '--input-bg': '#ffffff',
        '--input-border': '#d1d5db',
        '--input-text': '#111827',
        '--input-placeholder': '#6b7280',
      }}
    >
      {/* Mobile sidebar overlay — covers full viewport */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — slides in on mobile, static on desktop (~260 px) */}
      <div
        className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={id => {
            selectChat(id)
            setSidebarOpen(false)
          }}
          onCreateChat={title => {
            createNewChat(title)
            setSidebarOpen(false)
          }}
          onDeleteChat={deleteChat}
          loading={isLoading}
          error={error}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — compact on mobile */}
        <header
          className="border-b border-[var(--bg-sidebar,#202123)] bg-[var(--bg-primary,#343541)] py-2 px-3 sm:px-4 flex items-center flex-shrink-0"
          role="banner"
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 mr-2 rounded-lg text-[var(--text-primary,#ececf1)] hover:bg-[var(--bg-user-msg,#2b2f36)] transition-colors"
            aria-label="Open chat history"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Header
            title="AlgoView AI"
            subtitle="Algorithm Assistant"
            isOnline={true}
            onClear={handleClear}
            disabled={isLoading || isSending}
          />
        </header>

        {/* Chat Window — fills remaining space */}
        <ChatWindow messages={chatMessages} isLoading={isSending} onCopy={handleCopy} />

        {/* Input bar — sticks to bottom */}
        <div className="border-t border-[var(--bg-sidebar,#202123)] bg-[var(--bg-primary,#343541)] flex-shrink-0 sticky bottom-0">
          <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
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
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[var(--bg-assistant-msg,#444654)] text-[var(--text-primary,#ececf1)] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-sm mx-4 border border-red-500/40">
            <span className="text-sm flex-1">{error.message || 'An error occurred'}</span>
            <button
              onClick={handleErrorClear}
              className="text-[var(--text-secondary,#8e8ea0)] hover:text-[var(--text-primary,#ececf1)] font-bold text-lg flex-shrink-0 leading-none"
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
  )
}
