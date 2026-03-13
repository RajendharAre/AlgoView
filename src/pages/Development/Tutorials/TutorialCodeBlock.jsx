import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaCheck } from 'react-icons/fa';

const COLORS = {
  bg: { primary: '#f8f9fa', secondary: '#e9ecef' },
  text: { primary: '#212529', tertiary: '#6c757d' },
  border: { light: '#dee2e6' },
};

export default function TutorialCodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ border: `1px solid ${COLORS.border.light}`, borderRadius: 8, overflow: 'hidden', margin: '1rem 0' }}>
      <div style={{ background: COLORS.bg.secondary, padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border.light}` }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text.tertiary, textTransform: 'uppercase' }}>{language}</span>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: COLORS.text.tertiary, fontSize: 12 }}>
          {copied ? <><FaCheck size={12} /> Copied</> : <><FaCopy size={12} /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={oneLight} customStyle={{ margin: 0, padding: '1rem', fontSize: 13, background: '#fafbfc' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
