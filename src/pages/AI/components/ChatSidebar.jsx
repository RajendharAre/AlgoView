/**
 * Chat sidebar component with real-time Firestore integration
 * Displays chat list with smooth transitions and proper error handling
 */

import { Plus, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import ChatDeletePopup from './ChatDeletePopup';

/**
 * Chat sidebar component
 * @param {Object} props
 * @param {Array} props.chats - Array of chat sessions from Firestore
 * @param {Function} props.onSelectChat - Chat selection handler
 * @param {Function} props.onCreateChat - Create new chat handler
 * @param {Function} props.onDeleteChat - Delete chat handler
 * @param {string} props.activeChatId - Currently active chat ID
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.error - Error object if any
 */
export function ChatSidebar({ 
  chats = [], 
  onSelectChat, 
  onCreateChat, 
  onDeleteChat,
  activeChatId,
  loading = false,
  error = null
}) {
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [isShowingDeletePopup, setIsShowingDeletePopup] = useState(false);
  const [pendingDeleteChatId, setPendingDeleteChatId] = useState(null);

  const handleCreateChat = async () => {
    try {
      await onCreateChat('New Chat');
    } catch (error) {
      // Error handling is managed by the parent component
    }
  };

  const handleSelectChat = (chatId) => {
    if (chatId !== activeChatId) {
      onSelectChat(chatId);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    setPendingDeleteChatId(chatId);
    setIsShowingDeletePopup(true);
  };

  // Confirm deletion of the chat from popup
  const handleConfirmDelete = async () => {
    if (pendingDeleteChatId) {
      try {
        setDeletingChatId(pendingDeleteChatId);
        await onDeleteChat(pendingDeleteChatId);
      } catch (error) {
        // Error handling is managed by the parent component
      } finally {
        setDeletingChatId(null);
        setPendingDeleteChatId(null);
      }
    }
  };

  const getChatPreview = (chat) => {
    if (chat.lastMessage) {
      return chat.lastMessage.length > 30 
        ? chat.lastMessage.substring(0, 30) + '...'
        : chat.lastMessage;
    }
    return 'No messages yet';
  };

  if (loading) {
    return (
      <aside className="w-64 border-r bg-white dark:bg-gray-900 hidden md:block">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chats
            </h2>
            <div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 border-r bg-white dark:bg-gray-900 hidden md:block">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chats
            </h2>
            <button
              onClick={handleCreateChat}
              disabled={loading}
              className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
              aria-label="New chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-3">
              <div className="w-6 h-6 text-red-500 dark:text-red-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium mb-1">
              Error Loading Chats
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              {error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
            >
              Reload
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hidden md:block">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat History
              </h2>
              <button
                onClick={handleCreateChat}
                disabled={loading}
                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                aria-label="New chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 px-2">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                    <div className="w-6 h-6 text-gray-300 dark:text-gray-600">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  No chats yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  Create your first chat to get started
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-lg mb-1 ${
                    chat.id === activeChatId
                      ? 'bg-blue-500 text-white dark:bg-blue-600'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <button
                    onClick={() => handleSelectChat(chat.id)}
                    className="w-full text-left p-3 pr-12"
                  >
                    <div className={`font-medium truncate text-sm mb-1 ${
                      chat.id === activeChatId
                        ? 'text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {chat.title || 'Untitled Chat'}
                    </div>
                    <div className={`text-xs truncate ${
                      chat.id === activeChatId
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {getChatPreview(chat)}
                    </div>
                    <div className={`text-xs ${
                      chat.id === activeChatId
                        ? 'text-blue-200'
                        : 'text-gray-400 dark:text-gray-500'
                    } mt-1`}>
                      {chat.updatedAt?.toLocaleDateString([], { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </button>
                  
                  {/* Action Buttons */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectChat(chat.id);
                      }}
                      className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                      aria-label="Open chat"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      disabled={deletingChatId === chat.id}
                      className="p-1.5 rounded-md bg-white/20 hover:bg-red-500/50 text-white transition-colors duration-200 disabled:opacity-50"
                      aria-label="Delete chat"
                    >
                      {deletingChatId === chat.id ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Chat Delete Confirmation Popup */}
      <ChatDeletePopup
        isOpen={isShowingDeletePopup}
        onClose={() => {
          setIsShowingDeletePopup(false);
          setPendingDeleteChatId(null);
        }}
        onConfirm={handleConfirmDelete}
        chatTitle={chats.find(c => c.id === pendingDeleteChatId)?.title || 'this chat'}
      />
    </>
  );
}