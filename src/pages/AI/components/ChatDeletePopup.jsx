/**
 * Chat Delete Confirmation Popup
 * Shows at the top-center of the page
 * Allows user to confirm or cancel chat deletion
 */

import { AlertTriangle, X } from 'lucide-react';

const ChatDeletePopup = ({ isOpen, onClose, onConfirm, chatTitle = 'this chat' }) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center pt-6 z-50">
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      {/* Popup - Top Center */}
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 relative z-50">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-red-900">
              Delete Chat?
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {chatTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-start"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            This action cannot be undone. All messages in this chat will be permanently deleted.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDeletePopup;
