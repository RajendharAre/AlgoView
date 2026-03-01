/**
 * Chat Delete Confirmation Popup — ChatGPT-style dark modal
 * Shows top-center with dark overlay
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
      {/* Full-screen backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Popup */}
      <div className="bg-[var(--bg-sidebar,#202123)] border border-[var(--input-border,#2b2f36)] rounded-lg shadow-2xl max-w-md w-full mx-4 relative z-50 text-[var(--text-primary,#ececf1)]">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-[var(--input-border,#2b2f36)]">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 border border-red-700/50">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-red-200">Delete Chat?</h3>
            <p className="text-sm text-[var(--text-secondary,#8e8ea0)] mt-1 truncate">{chatTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary,#8e8ea0)] hover:text-[var(--text-primary,#ececf1)] transition-colors flex-shrink-0 self-start"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-[var(--text-primary,#ececf1)] leading-relaxed">
            This action cannot be undone. All messages in this chat will be permanently deleted.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#18191f] px-6 py-4 border-t border-[var(--input-border,#2b2f36)] rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--bg-user-msg,#2b2f36)] hover:bg-[#3a3f46] text-[var(--text-primary,#ececf1)] transition-colors"
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
