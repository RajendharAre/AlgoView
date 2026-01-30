import { useEffect, useRef, useState } from "react";

import {
  Bot,
  User,
  Send,
  Trash2,
  Copy,
  RefreshCw,
} from "lucide-react";

/**
 * AlgoView AI – Production-Safe ChatGPT-Style Page
 * Works with Vite + React Router (lazy import safe)
 */

export default function AI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        `<p>👋 Hi! I'm <strong>AlgoView AI</strong>.</p>
        <p>I can help you:</p>
        <ul>
          <li>Explain algorithms</li>
          <li>Analyze code</li>
          <li>Visualize steps</li>
          <li>Understand time &amp; space complexity</li>
        </ul>
        <p>Paste some code or ask a question to get started!</p>`
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response (safe placeholder)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: generateResponse(userMessage.content),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 900);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          `<p>🧹 Chat cleared.</p>
          <p>Ask me anything about algorithms or code!</p>`
      },
    ]);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              AlgoView AI
            </h1>
            <p className="text-xs text-gray-500">Algorithm Assistant</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onCopy={handleCopy}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl text-sm">
                Thinking<span className="animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AlgoView AI..."
            rows={1}
            className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------- */
/* Message Bubble Component  */
/* ------------------------- */

function MessageBubble({ message, onCopy }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            isUser
              ? "ml-3 bg-indigo-500"
              : "mr-3 bg-gradient-to-r from-indigo-500 to-purple-600"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        <div
          className={`relative px-4 py-3 rounded-2xl text-sm ${
            isUser
              ? "bg-indigo-500 text-white rounded-tr-none"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          )}

          {!isUser && (
            <button
              onClick={() => onCopy(message.content)}
              className="absolute -bottom-6 right-0 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- */
/* Safe AI Response Generator */
/* ------------------------- */

function generateResponse(input) {
  const text = input.toLowerCase();

  if (text.includes("merge sort")) {
    return (
      `<h3>Merge Sort Explained</h3>
      <p>Merge Sort is a <strong>divide and conquer</strong> algorithm.</p>
      <p><strong>Steps:</strong></p>
      <ol>
        <li>Divide the array into halves</li>
        <li>Recursively sort each half</li>
        <li>Merge the sorted halves</li>
      </ol>
      <p><strong>Time Complexity:</strong> O(n log n)<br/>
      <strong>Space Complexity:</strong> O(n)</p>`
    );
  }

  if (text.includes("bubble sort")) {
    return (
      `<h3>Bubble Sort Explained</h3>
      <p>Bubble Sort repeatedly compares adjacent elements and swaps them.</p>
      <p><strong>Time Complexity:</strong> O(n²)<br/>
      <strong>Best Case:</strong> O(n)<br/>
      <strong>Space Complexity:</strong> O(1)</p>`
    );
  }

  if (text.includes("binary search")) {
    return (
      `<h3>Binary Search Explained</h3>
      <p>Binary Search works on <strong>sorted arrays</strong> by repeatedly halving the search space.</p>
      <p><strong>Time Complexity:</strong> O(log n)<br/>
      <strong>Space Complexity:</strong> O(1)</p>`
    );
  }

  return (
    `<p>Thanks for your question! 👍</p>
    <p>I can help explain algorithms, analyze code, or guide you step by step.</p>
    <p>Try asking about <strong>sorting</strong>, <strong>searching</strong>, or paste some code.</p>`
  );
}