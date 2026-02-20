import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaTimes, FaCopy, FaCheck, FaClipboardList } from 'react-icons/fa';

// Grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
    dark: '#343a40',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6c757d',
    muted: '#adb5bd',
    light: '#f8f9fa',
  },
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
  },
  star: '#f59e0b',
};

const TAG_COLORS = { bg: '#e0e7ff', text: '#4338ca' };

// Language accent colors
const LANG_COLORS = {
  javascript: { dot: '#f7df1e', name: 'JavaScript' },
  python: { dot: '#3776ab', name: 'Python' },
  java: { dot: '#ed8b00', name: 'Java' },
  cpp: { dot: '#00599c', name: 'C++' },
  go: { dot: '#00add8', name: 'Go' },
  typescript: { dot: '#3178c6', name: 'TypeScript' },
  sql: { dot: '#cc2927', name: 'SQL' },
};

// VS Code Dark+ inspired syntax colors
const SYNTAX = {
  keyword: '#569cd6',
  string: '#ce9178',
  comment: '#6a9955',
  number: '#b5cea8',
  func: '#dcdcaa',
  variable: '#9cdcfe',
  default: '#d4d4d4',
};

const ALL_KEYWORDS = new Set([
  'function', 'const', 'let', 'var', 'if', 'else', 'return', 'for', 'while',
  'class', 'new', 'this', 'import', 'export', 'from', 'async', 'await',
  'try', 'catch', 'throw', 'typeof', 'instanceof', 'null', 'undefined',
  'true', 'false', 'default', 'switch', 'case', 'break', 'continue',
  'extends', 'super', 'yield', 'of', 'in', 'do', 'void', 'delete',
  'def', 'elif', 'except', 'finally', 'with', 'as', 'lambda', 'pass',
  'raise', 'self', 'global', 'nonlocal', 'del', 'assert', 'not', 'and',
  'or', 'is', 'None', 'True', 'False', 'print',
  // SQL keywords
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'ALTER', 'TABLE', 'VIEW', 'INDEX', 'DATABASE', 'SCHEMA', 'INTO', 'VALUES',
  'SET', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'USING',
  'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT', 'OFFSET',
  'WITH', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT', 'ALL', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
  'IS', 'NULL', 'EXISTS', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK',
  'TRANSACTION', 'BEGIN', 'START', 'SAVEPOINT', 'TRUNCATE', 'EXPLAIN',
  'ANALYZE', 'WINDOW', 'PARTITION', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
  'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'SUM', 'COUNT', 'AVG',
  'MIN', 'MAX', 'DISTINCT', 'CAST', 'COALESCE', 'NULLIF',
]);

function highlightCode(code) {
  return code.split('\n').map((line, lineIdx) => {
    const tokens = [];
    let i = 0;
    while (i < line.length) {
      if ((line[i] === '/' && line[i + 1] === '/') || (line[i] === '#' && (i === 0 || /\s/.test(line[i - 1])))) {
        tokens.push({ type: 'comment', value: line.slice(i) });
        i = line.length;
        continue;
      }
      if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) { if (line[j] === '\\') j++; j++; }
        tokens.push({ type: 'string', value: line.slice(i, j + 1) });
        i = j + 1;
        continue;
      }
      if (/\d/.test(line[i]) && (i === 0 || /[\s(,=+\-*/<>[\]{};:]/.test(line[i - 1]))) {
        let j = i;
        while (j < line.length && /[\d.]/.test(line[j])) j++;
        tokens.push({ type: 'number', value: line.slice(i, j) });
        i = j;
        continue;
      }
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[\w$]/.test(line[j])) j++;
        const word = line.slice(i, j);
        if (ALL_KEYWORDS.has(word)) {
          tokens.push({ type: 'keyword', value: word });
        } else if (/^\s*\(/.test(line.slice(j))) {
          tokens.push({ type: 'func', value: word });
        } else {
          tokens.push({ type: 'variable', value: word });
        }
        i = j;
        continue;
      }
      tokens.push({ type: 'default', value: line[i] });
      i++;
    }
    return (
      <div key={lineIdx} style={{ minHeight: '1.4em' }}>
        {tokens.map((token, tIdx) => (
          <span key={tIdx} style={{ color: SYNTAX[token.type] || SYNTAX.default }}>
            {token.value}
          </span>
        ))}
      </div>
    );
  });
}

export default function CodeCard({ codeExample }) {
  const [copied, setCopied] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = LANG_COLORS[codeExample.language] || LANG_COLORS.javascript;
  const codePreview = codeExample.code.split('\n').slice(0, 8).join('\n');
  const hasMoreCode = codeExample.code.split('\n').length > 8;

  const highlightedPreview = useMemo(() => highlightCode(codePreview), [codePreview]);
  const highlightedFull = useMemo(() => highlightCode(codeExample.code), [codeExample.code]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} style={{ color: i < Math.floor(rating) ? COLORS.star : COLORS.border.light }} size={12} />
      );
    }
    return stars;
  };

  return (
    <>
      {/* Card */}
      <motion.div style={{ backgroundColor: COLORS.bg.primary, borderColor: COLORS.border.light }} className="h-full rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Language Header */}
        <div style={{ backgroundColor: COLORS.bg.secondary, borderBottomColor: COLORS.border.light }} className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ color: lang.dot }} className="text-xl font-bold">●</div>
              <div>
                <div style={{ color: COLORS.text.tertiary }} className="text-xs">Language</div>
                <div style={{ color: COLORS.text.primary }} className="font-bold">
                  {lang.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div style={{ color: COLORS.text.tertiary }} className="text-xs">Complexity</div>
              <div style={{ color: COLORS.text.primary }} className="font-bold">{codeExample.complexity}</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="p-4 flex-1">
          <h3 style={{ color: COLORS.text.primary }} className="text-lg font-bold mb-2">
            {codeExample.title}
          </h3>

          <p style={{ color: COLORS.text.secondary }} className="text-sm mb-4">
            {codeExample.description}
          </p>

          {/* Code Preview with Syntax Highlighting */}
          <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px' }} className="p-4 mb-4 overflow-hidden">
            <pre className="text-xs font-mono" style={{ lineHeight: '1.4' }}>
              <code>{highlightedPreview}</code>
            </pre>
            {hasMoreCode && (
              <div style={{ color: COLORS.text.muted }} className="text-xs mt-2 text-center">
                ... [{codeExample.code.split('\n').length} lines]
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {codeExample.tags.map((tag, i) => (
              <span key={i} style={{ backgroundColor: TAG_COLORS.bg, color: TAG_COLORS.text }} className="text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats & Rating */}
          <div style={{ borderTopColor: COLORS.border.light }} className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {renderStars(codeExample.rating)}
                <span style={{ color: COLORS.text.primary }} className="text-sm font-semibold ml-1">
                  {codeExample.rating}
                </span>
              </div>
              <span style={{ color: COLORS.text.tertiary }} className="text-xs flex items-center gap-1">
                <FaClipboardList size={12} /> {codeExample.copies} copies
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ borderTopColor: COLORS.border.light }} className="p-4 border-t flex gap-2">
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: copied ? COLORS.text.tertiary : COLORS.bg.dark,
              color: COLORS.text.light
            }}
            className="flex-1 py-2 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <FaCheck size={14} /> Copied
              </>
            ) : (
              <>
                <FaCopy size={14} /> Copy Code
              </>
            )}
          </button>
          <button
            onClick={() => setShowFullCode(true)}
            style={{
              backgroundColor: COLORS.bg.tertiary,
              color: COLORS.text.primary
            }}
            className="flex-1 py-2 rounded-lg font-semibold hover:opacity-80 transition text-sm"
          >
            View Full
          </button>
        </div>
      </motion.div>

      {/* Full Code Modal */}
      {showFullCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullCode(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: COLORS.bg.primary }}
            className="rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full"
          >
            {/* Modal Header */}
            <div style={{ backgroundColor: COLORS.bg.primary, borderBottomColor: COLORS.border.light }} className="sticky top-0 border-b p-6 flex justify-between items-start">
              <div>
                <h2 style={{ color: COLORS.text.primary }} className="text-2xl font-bold">{codeExample.title}</h2>
                <p style={{ color: COLORS.text.secondary }} className="mt-1">{codeExample.description}</p>
              </div>
              <button
                onClick={() => setShowFullCode(false)}
                style={{ color: COLORS.text.tertiary }}
                className="hover:opacity-70 text-xl"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Code */}
            <div className="p-6">
              {/* Language & Complexity Bar */}
              <div style={{ borderBottomColor: COLORS.border.light }} className="flex justify-between items-center mb-4 pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div style={{ color: lang.dot }} className="text-2xl font-bold">●</div>
                    <span style={{ color: COLORS.text.primary }} className="font-bold text-lg">
                      {lang.name}
                    </span>
                  </div>
                  <div style={{ color: COLORS.text.secondary }}>
                    Complexity: <span className="font-bold">{codeExample.complexity}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    backgroundColor: copied ? COLORS.text.tertiary : COLORS.bg.dark,
                    color: COLORS.text.light
                  }}
                  className="py-2 px-4 rounded-lg font-semibold transition hover:opacity-90"
                >
                  {copied ? (
                    <>
                      <FaCheck size={14} className="inline mr-1" /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <FaCopy size={14} className="inline mr-1" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Full Code */}
              <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px' }} className="rounded-lg p-6 overflow-x-auto mb-6">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words" style={{ lineHeight: '1.4' }}>
                  <code>{highlightedFull}</code>
                </pre>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 style={{ color: COLORS.text.primary }} className="text-lg font-bold mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {codeExample.tags.map((tag, i) => (
                    <span key={i} style={{ backgroundColor: TAG_COLORS.bg, color: TAG_COLORS.text }} className="px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div style={{ color: COLORS.text.tertiary }} className="text-sm mb-1 flex items-center gap-1">
                    <FaStar size={12} /> Rating
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(codeExample.rating)}
                  </div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold mt-1">{codeExample.rating}</div>
                </div>
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div style={{ color: COLORS.text.tertiary }} className="text-sm mb-1 flex items-center gap-1">
                    <FaCopy size={12} /> Copies
                  </div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{codeExample.copies}</div>
                </div>
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div style={{ color: COLORS.text.tertiary }} className="text-sm mb-1">Language</div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">
                    {lang.name}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button style={{ backgroundColor: COLORS.bg.dark, color: COLORS.text.light }} className="w-full py-3 rounded-lg font-bold hover:opacity-90 transition text-lg">
                Use This Code
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
