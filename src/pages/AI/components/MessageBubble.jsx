/**
 * Message bubble component — ChatGPT-style full-width rows
 * User messages: right-aligned bubble with user avatar on right
 * Assistant messages: left-aligned full-width with bot avatar on left
 */

import { User, Bot } from 'lucide-react';
import FormattedResponse from './FormattedResponse';

export function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user';

  const renderContent = () => {
    if (isUser) {
      return <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>;
    }
    return <FormattedResponse content={message.content} />;
  };

  return (
    <div
      className={`group flex ${isUser ? 'justify-end' : 'justify-start'} py-3`}
      data-testid="message-bubble"
    >
      <div className={`flex items-start gap-3 ${isUser ? 'max-w-[85%] sm:max-w-xl' : 'max-w-[85%] sm:max-w-2xl w-full'}`}>
        {/* Bot avatar */}
        {!isUser && (
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[var(--accent,#10a37f)] text-white mt-0.5"
            role="img" aria-label="AI Assistant"
          >
            <Bot className="w-4 h-4" data-testid="bot-icon" />
          </div>
        )}

        {/* Content */}
        <div
          className={`
            rounded-2xl overflow-hidden
            ${isUser
              ? 'bg-[var(--bg-user-msg,#2b2f36)] text-[var(--text-primary,#ececf1)] px-4 py-2.5 rounded-br-sm'
              : 'bg-[var(--bg-assistant-msg,#444654)] text-[var(--text-primary,#ececf1)] px-4 py-3 rounded-bl-sm w-full'
            }
          `}
        >
          {renderContent()}
        </div>

        {/* User avatar */}
        {isUser && (
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#565869] text-[var(--text-primary,#ececf1)] mt-0.5"
            role="img" aria-label="You"
          >
            <User className="w-4 h-4" data-testid="user-icon" />
          </div>
        )}
      </div>
    </div>
  );
}

