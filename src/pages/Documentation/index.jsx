import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Code2,
  Brain,
  BarChart2,
  PlayCircle,
  FileText,
  ChevronRight,
  Menu,
  X,
  Search,
  ExternalLink,
  GitBranch,
  Zap,
  Users,
  CheckCircle,
  Info,
  AlertTriangle,
  Hash,
  Shuffle,
  Target,
  Terminal,
  ArrowRight,
} from 'lucide-react'
import { APP_COLORS, APP_SHADOWS } from '../../constants/sitePalette'

const COLORS = APP_COLORS
const SHADOWS = APP_SHADOWS
const BLUE = '#3b82f6'
const BLUE_BG = '#eff6ff'

// ─── Navigation Config ────────────────────────────────────────────────────────
const NAV = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: PlayCircle,
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'quick-start', label: 'Quick Start' },
      { id: 'account-setup', label: 'Account Setup' },
    ],
  },
  {
    id: 'visualizations',
    label: 'Algorithm Visualizations',
    icon: BarChart2,
    items: [
      { id: 'viz-overview', label: 'Overview' },
      { id: 'sorting', label: 'Sorting Algorithms' },
      { id: 'searching', label: 'Searching Algorithms' },
      { id: 'graphs', label: 'Graph Algorithms' },
      { id: 'dynamic-programming', label: 'Dynamic Programming' },
    ],
  },
  {
    id: 'practice',
    label: 'Practice & Problems',
    icon: Code2,
    items: [
      { id: 'problem-library', label: 'Problem Library' },
      { id: 'practice-mode', label: 'Practice Mode' },
    ],
  },
  {
    id: 'ai-companion',
    label: 'AI Companion',
    icon: Brain,
    items: [
      { id: 'ai-overview', label: 'Overview' },
      { id: 'ai-usage', label: 'How to Use' },
      { id: 'ai-tips', label: 'Best Practices' },
    ],
  },
  {
    id: 'dev-hub',
    label: 'Development Hub',
    icon: BookOpen,
    items: [
      { id: 'tutorials', label: 'Tutorials' },
      { id: 'code-examples', label: 'Code Examples' },
      { id: 'community', label: 'Community' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    icon: FileText,
    items: [
      { id: 'shortcuts', label: 'Keyboard Shortcuts' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'faq', label: 'FAQ' },
    ],
  },
]

const ALL_IDS = NAV.flatMap(s => s.items.map(i => i.id))

// ─── Sub-components ───────────────────────────────────────────────────────────
const DocNote = ({ type = 'info', children }) => {
  const cfg = {
    info: { Icon: Info, bg: BLUE_BG, border: BLUE, text: '#1d4ed8', label: 'Note' },
    tip: { Icon: CheckCircle, bg: '#f0fdf4', border: '#22c55e', text: '#15803d', label: 'Tip' },
    warning: {
      Icon: AlertTriangle,
      bg: '#fffbeb',
      border: '#f59e0b',
      text: '#b45309',
      label: 'Warning',
    },
  }[type]
  return (
    <div
      className="flex gap-3 rounded-xl p-4 my-5 text-sm"
      style={{ backgroundColor: cfg.bg, borderLeft: `4px solid ${cfg.border}` }}
    >
      <cfg.Icon size={15} style={{ color: cfg.border, flexShrink: 0, marginTop: 2 }} />
      <div style={{ color: cfg.text }}>
        <strong>{cfg.label}:</strong> {children}
      </div>
    </div>
  )
}

const CodeBlock = ({ code, lang }) => (
  <div
    className="rounded-2xl overflow-hidden my-5"
    style={{ backgroundColor: '#1e1e2e', boxShadow: SHADOWS.sm }}
  >
    {lang && (
      <div
        className="flex items-center px-4 py-2 border-b"
        style={{ borderColor: '#2d2d3e', backgroundColor: '#16162a' }}
      >
        <span
          className="text-[11px] font-mono uppercase tracking-wider"
          style={{ color: '#7c7c99' }}
        >
          {lang}
        </span>
      </div>
    )}
    <pre
      className="p-5 text-sm overflow-x-auto font-mono leading-relaxed"
      style={{ color: '#cdd6f4', margin: 0 }}
    >
      <code>{code}</code>
    </pre>
  </div>
)

const Step = ({ n, title, desc }) => (
  <div className="flex gap-4 mb-5">
    <div
      className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
      style={{ backgroundColor: BLUE }}
    >
      {n}
    </div>
    <div>
      <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text.primary }}>
        {title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
        {desc}
      </p>
    </div>
  </div>
)

const AlgoRow = ({ name, complexity, space, stable }) => (
  <tr className="border-b text-sm" style={{ borderColor: COLORS.border.light }}>
    <td className="py-3 pr-4 font-semibold" style={{ color: COLORS.text.primary }}>
      {name}
    </td>
    <td className="py-3 pr-4 font-mono text-xs" style={{ color: COLORS.text.secondary }}>
      {complexity}
    </td>
    <td className="py-3 pr-4 font-mono text-xs" style={{ color: COLORS.text.secondary }}>
      {space}
    </td>
    <td className="py-3">
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: stable === 'Yes' ? '#f0fdf4' : '#fef2f2',
          color: stable === 'Yes' ? '#15803d' : '#991b1b',
        }}
      >
        {stable}
      </span>
    </td>
  </tr>
)

const ShortcutRow = ({ keys, action }) => (
  <div
    className="flex items-center justify-between py-3 border-b"
    style={{ borderColor: COLORS.border.light }}
  >
    <span className="text-sm" style={{ color: COLORS.text.secondary }}>
      {action}
    </span>
    <div className="flex items-center gap-1.5">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
          style={{
            backgroundColor: COLORS.bg.secondary,
            border: `1px solid ${COLORS.border.medium}`,
            color: COLORS.text.primary,
          }}
        >
          {k}
        </kbd>
      ))}
    </div>
  </div>
)

const GlTerm = ({ term, def }) => (
  <div className="py-3.5 border-b" style={{ borderColor: COLORS.border.light }}>
    <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text.primary }}>
      {term}
    </p>
    <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
      {def}
    </p>
  </div>
)

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b" style={{ borderColor: COLORS.border.light }}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between py-4 text-left transition-colors hover:opacity-80"
      >
        <span className="font-semibold text-sm pr-4" style={{ color: COLORS.text.primary }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronRight size={16} style={{ color: COLORS.text.tertiary }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Doc Heading Helper ───────────────────────────────────────────────────────
const DocH2 = ({ id, label }) => (
  <h2
    id={id}
    className="text-xl sm:text-2xl font-black mt-12 mb-4 flex items-center gap-2 scroll-mt-20"
    style={{ color: COLORS.text.primary }}
  >
    <Hash size={16} style={{ color: BLUE, flexShrink: 0 }} />
    {label}
  </h2>
)

const DocH3 = ({ children }) => (
  <h3 className="text-base font-bold mt-7 mb-2" style={{ color: COLORS.text.primary }}>
    {children}
  </h3>
)

const DocP = ({ children }) => (
  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: COLORS.text.secondary }}>
    {children}
  </p>
)

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = ({ activeId, onItemClick, mobileOpen, onClose }) => {
  const [openSections, setOpenSections] = useState(() => NAV.map(s => s.id))
  const [query, setQuery] = useState('')

  const toggle = id => setOpenSections(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))

  const filtered = query.trim()
    ? NAV.map(s => ({
        ...s,
        items: s.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : NAV

  const handleClick = id => {
    onItemClick(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (onClose) onClose()
  }

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: COLORS.border.light }}
      >
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: BLUE }}
        >
          <BookOpen size={14} color="white" />
        </div>
        <div>
          <p className="font-black text-sm leading-none" style={{ color: COLORS.text.primary }}>
            AlgoView
          </p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: COLORS.text.muted }}>
            Documentation
          </p>
        </div>
        <span
          className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{ backgroundColor: BLUE_BG, color: BLUE }}
        >
          v1.0
        </span>
      </div>

      {/* Search */}
      <div
        className="px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: COLORS.border.light }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search docs…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
            style={{
              borderColor: COLORS.border.medium,
              backgroundColor: COLORS.bg.secondary,
              color: COLORS.text.primary,
            }}
          />
          <Search
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: COLORS.text.muted }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {filtered.map(section => {
          const Icon = section.icon
          const isOpen = openSections.includes(section.id) || query.trim() !== ''
          return (
            <div key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gray-100"
                style={{ color: COLORS.text.muted }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={12} />
                  {section.label}
                </div>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronRight size={11} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-3 pb-1">
                      {section.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleClick(item.id)}
                          className="w-full text-left pl-3 pr-2 py-1.5 rounded-lg text-sm transition-all"
                          style={{
                            color: activeId === item.id ? BLUE : COLORS.text.secondary,
                            backgroundColor: activeId === item.id ? BLUE_BG : 'transparent',
                            fontWeight: activeId === item.id ? 600 : 400,
                            borderLeft:
                              activeId === item.id ? `2px solid ${BLUE}` : '2px solid transparent',
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Bottom link */}
      <div
        className="px-5 py-3 border-t flex-shrink-0"
        style={{ borderColor: COLORS.border.light }}
      >
        <Link
          to="/dsa/algorithms"
          className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
          style={{ color: BLUE }}
        >
          <ExternalLink size={11} /> Open Algorithm Library
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r sticky top-0 h-screen overflow-hidden"
        style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col shadow-2xl lg:hidden overflow-hidden"
              style={{ backgroundColor: COLORS.bg.surface }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: COLORS.text.tertiary }}
              >
                <X size={16} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Documentation = () => {
  const [activeId, setActiveId] = useState('introduction')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Scrollspy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-15% 0% -75% 0%', threshold: 0 }
    )
    ALL_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Active section label for breadcrumb
  const activeSec = NAV.find(s => s.items.some(i => i.id === activeId))
  const activeItem = activeSec?.items.find(i => i.id === activeId)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: COLORS.bg.primary }}>
      <Sidebar
        activeId={activeId}
        onItemClick={setActiveId}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 min-w-0">
        {/* Content */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 py-8 max-w-4xl">
          {/* Top bar (mobile) */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg border transition-colors hover:bg-gray-100"
              style={{ borderColor: COLORS.border.medium }}
            >
              <Menu size={16} style={{ color: COLORS.text.secondary }} />
            </button>
            <span className="text-xs font-semibold" style={{ color: COLORS.text.muted }}>
              AlgoView Docs
            </span>
          </div>

          {/* Breadcrumb */}
          <div
            className="hidden lg:flex items-center gap-2 mb-8 text-xs"
            style={{ color: COLORS.text.muted }}
          >
            <span>Docs</span>
            <ChevronRight size={12} />
            <span>{activeSec?.label}</span>
            <ChevronRight size={12} />
            <span style={{ color: BLUE, fontWeight: 600 }}>{activeItem?.label}</span>
          </div>

          {/* ─ GETTING STARTED ─────────────────────────────────────────── */}
          <section>
            <DocH2 id="introduction" label="Introduction" />
            <DocP>
              AlgoView is an interactive algorithm learning platform built for developers, students,
              and interview candidates. It combines step-by-step visual execution, an AI-powered
              learning companion, a structured problem library, and a rich development hub — all in
              one place.
            </DocP>
            <DocP>
              Whether you're a complete beginner getting familiar with sorting algorithms or an
              experienced developer brushing up before a system design round, AlgoView adapts to
              your pace and learning style.
            </DocP>

            <div className="grid sm:grid-cols-3 gap-4 my-6">
              {[
                {
                  icon: BarChart2,
                  title: 'Visualize',
                  desc: 'See algorithms execute step by step with live controls.',
                },
                {
                  icon: Target,
                  title: 'Practice',
                  desc: 'Solve curated DSA problems with real code execution.',
                },
                {
                  icon: Brain,
                  title: 'Learn with AI',
                  desc: 'Ask questions and get instant contextual explanations.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: COLORS.border.light,
                    backgroundColor: COLORS.bg.surface,
                    boxShadow: SHADOWS.xs,
                  }}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: BLUE_BG }}
                  >
                    <Icon size={15} style={{ color: BLUE }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: COLORS.text.primary }}>
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: COLORS.text.secondary }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <DocNote type="info">
              This documentation covers the AlgoView platform — features, navigation, and best
              practices. For the Development Hub (tutorials, code examples), see the{' '}
              <Link to="/development" className="underline font-semibold">
                Development section
              </Link>
              .
            </DocNote>

            {/* ── Quick Start ── */}
            <DocH2 id="quick-start" label="Quick Start" />
            <DocP>Get up and running with AlgoView in under five minutes.</DocP>

            <Step
              n={1}
              title="Create an account"
              desc="Visit the homepage and click Sign Up. Register using your email address. You'll receive a verification link to activate your account."
            />
            <Step
              n={2}
              title="Navigate to the DSA section"
              desc="After logging in you'll land on the Dashboard. Click DSA in the top navigation to access the Algorithm Library, Problems, and Practice sections."
            />
            <Step
              n={3}
              title="Pick an algorithm to visualize"
              desc="Browse the Algorithm Library, choose a category (Sorting, Searching, Graph, DP), then click any algorithm card to open its interactive visualizer."
            />
            <Step
              n={4}
              title="Control the execution"
              desc="Use the Play, Pause, Step Forward, Step Backward, and Speed controls to walk through the algorithm at your own pace. Hover over nodes or bars to inspect values live."
            />
            <Step
              n={5}
              title="Ask the AI companion"
              desc="Click the AI icon (top-right) at any time to open the chat assistant. Ask about time complexity, request a code example, or get a plain-English explanation of the current algorithm."
            />

            <DocNote type="tip">
              You can use the algorithm visualizer without logging in, but features like progress
              tracking, saved notes, and the AI companion require a free account.
            </DocNote>

            {/* ── Account Setup ── */}
            <DocH2 id="account-setup" label="Account Setup" />
            <DocP>
              Once registered, complete your profile to unlock personalized learning tracks and
              streak tracking.
            </DocP>

            <DocH3>Profile Configuration</DocH3>
            <ul className="text-sm space-y-2 mb-5 pl-4" style={{ color: COLORS.text.secondary }}>
              {[
                'Navigate to Settings → Profile to set your display name and avatar.',
                'Add your target role (e.g. Frontend, Backend, Full-Stack) and experience level.',
                'Connect your GitHub profile to enable code submission history.',
                'Set your weekly practice goal in Settings → Preferences.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle
                    size={13}
                    style={{ color: '#22c55e', flexShrink: 0, marginTop: 3 }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <DocNote type="warning">
              Email verification is required to access the AI companion and the Practice code
              editor. Check your spam folder if the verification email doesn't arrive within a few
              minutes.
            </DocNote>
          </section>

          {/* ─ VISUALIZATIONS ──────────────────────────────────────────── */}
          <section>
            <DocH2 id="viz-overview" label="Visualizations — Overview" />
            <DocP>
              AlgoView's visualizer renders each algorithmic step as an animated frame. You can
              pause at any point, inspect state, and move forwards or backwards through the
              execution history.
            </DocP>

            <div
              className="rounded-2xl border overflow-hidden my-5"
              style={{ borderColor: COLORS.border.light }}
            >
              <div
                className="px-5 py-3 border-b"
                style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: COLORS.text.muted }}
                >
                  Visualizer Controls
                </p>
              </div>
              <div className="divide-y" style={{ divideColor: COLORS.border.light }}>
                {[
                  ['Play / Pause', 'Start or pause the automatic execution.'],
                  ['Step Forward', 'Advance to the next single execution step.'],
                  ['Step Backward', 'Rewind to the previous step.'],
                  ['Speed Slider', 'Adjust animation speed from 0.25× to 4×.'],
                  ['Reset', 'Restore the input to its initial state.'],
                  ['Randomise Input', 'Generate a new random dataset for the algorithm.'],
                  ['Custom Input', 'Enter your own array, graph, or string manually.'],
                ].map(([ctrl, desc]) => (
                  <div key={ctrl} className="flex items-start gap-4 px-5 py-3 text-sm">
                    <span
                      className="font-semibold w-36 flex-shrink-0"
                      style={{ color: COLORS.text.primary }}
                    >
                      {ctrl}
                    </span>
                    <span style={{ color: COLORS.text.secondary }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sorting ── */}
            <DocH2 id="sorting" label="Sorting Algorithms" />
            <DocP>
              The Sorting visualizer supports seven classic comparison-based and
              non-comparison-based algorithms. Each step highlights the currently compared elements
              in blue, swapped elements in red, and sorted elements in green.
            </DocP>

            <div
              className="overflow-x-auto rounded-2xl border my-5"
              style={{ borderColor: COLORS.border.light }}
            >
              <table className="w-full text-left" style={{ backgroundColor: COLORS.bg.surface }}>
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      borderColor: COLORS.border.light,
                      backgroundColor: COLORS.bg.secondary,
                    }}
                  >
                    {['Algorithm', 'Avg. Time', 'Space', 'Stable'].map(h => (
                      <th
                        key={h}
                        className="py-3 px-4 text-xs font-bold uppercase tracking-wider"
                        style={{ color: COLORS.text.muted }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: COLORS.border.light }}>
                  <AlgoRow name="Bubble Sort" complexity="O(n²)" space="O(1)" stable="Yes" />
                  <AlgoRow name="Selection Sort" complexity="O(n²)" space="O(1)" stable="No" />
                  <AlgoRow name="Insertion Sort" complexity="O(n²)" space="O(1)" stable="Yes" />
                  <AlgoRow name="Merge Sort" complexity="O(n log n)" space="O(n)" stable="Yes" />
                  <AlgoRow name="Quick Sort" complexity="O(n log n)" space="O(log n)" stable="No" />
                  <AlgoRow name="Heap Sort" complexity="O(n log n)" space="O(1)" stable="No" />
                  <AlgoRow name="Counting Sort" complexity="O(n + k)" space="O(k)" stable="Yes" />
                </tbody>
              </table>
            </div>

            <DocNote type="tip">
              Use Bubble Sort or Insertion Sort first when learning — their step counts are easy to
              follow. Switch to Merge Sort or Quick Sort once you're comfortable tracking recursive
              splits.
            </DocNote>

            {/* ── Searching ── */}
            <DocH2 id="searching" label="Searching Algorithms" />
            <DocP>
              The Searching visualizer highlights the current comparison index in the array and
              marks the target element once found. Both linear and interval-based search strategies
              are covered.
            </DocP>
            <ul className="text-sm space-y-3 mb-5 pl-0" style={{ color: COLORS.text.secondary }}>
              {[
                [
                  'Linear Search',
                  'Scans each element sequentially. O(n) time. Works on unsorted arrays.',
                ],
                [
                  'Binary Search',
                  'Halves the search space each step. O(log n). Requires a sorted array.',
                ],
                [
                  'Jump Search',
                  'Jumps by √n blocks then searches linearly. O(√n). Good for sorted arrays.',
                ],
                [
                  'Interpolation Search',
                  'Estimates position by value. O(log log n) on uniform distributions.',
                ],
                [
                  'Exponential Search',
                  'Doubles the range until the key falls within it, then applies Binary Search.',
                ],
              ].map(([name, desc]) => (
                <li key={name} className="flex gap-3">
                  <span
                    className="font-semibold w-44 flex-shrink-0"
                    style={{ color: COLORS.text.primary }}
                  >
                    {name}
                  </span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            {/* ── Graphs ── */}
            <DocH2 id="graphs" label="Graph Algorithms" />
            <DocP>
              The Graph visualizer renders a live node-and-edge graph using Cytoscape.js. Visited
              nodes pulse blue, the current frontier is yellow, and finalized shortest-path edges
              are highlighted in green.
            </DocP>

            <div className="grid sm:grid-cols-2 gap-4 my-5">
              {[
                {
                  icon: GitBranch,
                  name: 'BFS',
                  desc: 'Breadth-First Search — explore level by level. Used for shortest path in unweighted graphs.',
                },
                {
                  icon: GitBranch,
                  name: 'DFS',
                  desc: 'Depth-First Search — explore as deep as possible before backtracking. Used for cycle detection and topological sort.',
                },
                {
                  icon: Zap,
                  name: "Dijkstra's",
                  desc: 'Shortest path in weighted graphs with non-negative edges. Greedy priority queue approach.',
                },
                {
                  icon: Target,
                  name: 'A* Search',
                  desc: "Heuristic-guided shortest path. Faster than Dijkstra's on spatial graphs with a good heuristic.",
                },
                {
                  icon: Users,
                  name: "Kruskal's MST",
                  desc: 'Minimum Spanning Tree — builds the cheapest connected subgraph using union-find.',
                },
                {
                  icon: Shuffle,
                  name: "Prim's MST",
                  desc: "Grows the MST greedily from a start node. Complements Kruskal's for dense graphs.",
                },
              ].map(({ icon: Icon, name, desc }) => (
                <div
                  key={name}
                  className="flex gap-3 rounded-2xl border p-4"
                  style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: BLUE_BG }}
                  >
                    <Icon size={14} style={{ color: BLUE }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5" style={{ color: COLORS.text.primary }}>
                      {name}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: COLORS.text.secondary }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <DocNote type="info">
              You can edit the graph directly in the visualizer — drag nodes, add edges, and change
              edge weights before running any algorithm.
            </DocNote>

            {/* ── DP ── */}
            <DocH2 id="dynamic-programming" label="Dynamic Programming" />
            <DocP>
              DP visualizations render a filled memoization table frame-by-frame, so you can see
              exactly how subproblems build up into the final solution.
            </DocP>
            <ul className="text-sm space-y-2.5 mb-5 pl-0" style={{ color: COLORS.text.secondary }}>
              {[
                [
                  'Fibonacci Sequence',
                  'Classic top-down and bottom-up memoization. Highlights overlapping subproblems.',
                ],
                [
                  'Longest Common Subsequence',
                  'Builds a 2D DP table row by row. Shows optimal substructure clearly.',
                ],
                [
                  '0/1 Knapsack',
                  'Capacity vs. items table. Trace back the selected items after the table is filled.',
                ],
                [
                  'Matrix Chain Multiplication',
                  'Shows the cost savings of optimal parenthesization.',
                ],
                [
                  'Coin Change',
                  'Minimum coins needed to make a target value. Standard BFS/DP comparison.',
                ],
              ].map(([name, desc]) => (
                <li key={name} className="flex gap-3 text-sm">
                  <span
                    className="font-semibold w-56 flex-shrink-0"
                    style={{ color: COLORS.text.primary }}
                  >
                    {name}
                  </span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            <DocNote type="tip">
              The DP table cells colour from white → light-blue → dark-blue as they are filled.
              Cells on the optimal path are highlighted gold after completion.
            </DocNote>
          </section>

          {/* ─ PRACTICE ────────────────────────────────────────────────── */}
          <section>
            <DocH2 id="problem-library" label="Problem Library" />
            <DocP>
              The Problem Library contains a curated set of DSA problems organised by topic,
              difficulty, and company tag. Each problem includes a description, constraints,
              examples, and hints.
            </DocP>

            <DocH3>Filtering Problems</DocH3>
            <ul className="text-sm space-y-2 mb-5 pl-0" style={{ color: COLORS.text.secondary }}>
              {[
                'Use the Difficulty filter to show only Easy, Medium, or Hard problems.',
                'Filter by Topic to focus on a specific area (Arrays, Trees, Graphs, DP, etc.).',
                'Use the Search bar to find problems by name or keyword.',
                'Click any problem card to open its description and start solving.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: BLUE }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <DocH2 id="practice-mode" label="Practice Mode" />
            <DocP>
              Practice Mode opens an in-browser code editor (Monaco) with the problem statement on
              the left and the editor on the right. Write your solution, run it against public test
              cases, then submit for full evaluation.
            </DocP>

            <CodeBlock
              lang="JavaScript — Example starter template"
              code={`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map()
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    map.set(nums[i], i)
  }
  
  return []
}`}
            />

            <DocNote type="info">
              Currently supported languages: JavaScript, Python, Java, and C++. Language support is
              expanding — check the Development Hub announcements for updates.
            </DocNote>
          </section>

          {/* ─ AI COMPANION ────────────────────────────────────────────── */}
          <section>
            <DocH2 id="ai-overview" label="AI Companion — Overview" />
            <DocP>
              The AlgoView AI is a context-aware learning assistant embedded directly into the
              platform. It understands the algorithm you are currently viewing and can answer
              questions, explain complexity, generate code examples, and guide your thinking without
              giving answers away.
            </DocP>

            <div className="grid sm:grid-cols-2 gap-4 my-5">
              {[
                { label: 'Explain complexity', eg: '"Why is Merge Sort O(n log n)?"' },
                { label: 'Code examples', eg: '"Show me BFS in Python."' },
                { label: 'Debugging help', eg: '"Why does my recursion hit a stack overflow?"' },
                { label: 'Interview coaching', eg: '"Ask me a medium-level Graph question."' },
              ].map(({ label, eg }) => (
                <div
                  key={label}
                  className="rounded-xl border p-4"
                  style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
                >
                  <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text.primary }}>
                    {label}
                  </p>
                  <p className="text-xs italic" style={{ color: COLORS.text.tertiary }}>
                    {eg}
                  </p>
                </div>
              ))}
            </div>

            <DocH2 id="ai-usage" label="How to Use" />
            <Step
              n={1}
              title="Open the AI panel"
              desc="Click the brain icon in the top navigation bar, or use the keyboard shortcut Ctrl + K."
            />
            <Step
              n={2}
              title="Type your question"
              desc="Ask anything related to algorithms, data structures, time/space complexity, or your current problem. The AI has context about the currently open algorithm."
            />
            <Step
              n={3}
              title="Review the response"
              desc="Responses include plain-English explanations, formatted code blocks, and complexity analysis where relevant."
            />
            <Step
              n={4}
              title="Continue the conversation"
              desc="The AI maintains conversation history within the session. You can ask follow-up questions naturally without restating context."
            />

            <CodeBlock
              lang="Example conversation"
              code={`You:  What's the time complexity of the BFS algorithm shown?

AI:   BFS visits each vertex and edge exactly once, giving O(V + E)
      time complexity, where V is the number of vertices and E is
      the number of edges.
      
      Space complexity is O(V) for the queue in the worst case
      (when all vertices are at the same BFS level).

You:  Can you show me the implementation in Python?

AI:   from collections import deque

      def bfs(graph, start):
          visited = set()
          queue   = deque([start])
          visited.add(start)
          
          while queue:
              node = queue.popleft()
              print(node)
              for neighbor in graph[node]:
                  if neighbor not in visited:
                      visited.add(neighbor)
                      queue.append(neighbor)
`}
            />

            <DocH2 id="ai-tips" label="Best Practices" />
            <ul className="text-sm space-y-3 mb-5" style={{ color: COLORS.text.secondary }}>
              {[
                [
                  'Be specific',
                  'Instead of "explain sorting", ask "why does Quick Sort degrade to O(n²) on sorted arrays?"',
                ],
                [
                  'Use it for hints, not answers',
                  "If you're attempting a problem, ask for a hint or the algorithm category — not the full solution.",
                ],
                [
                  'Ask for comparisons',
                  '"Compare DFS and BFS for cycle detection"  produces more useful context than asking about each in isolation.',
                ],
                [
                  'Code review',
                  'Paste your solution and ask "what is the time complexity of this code?" for instant analysis.',
                ],
                [
                  'Interview simulation',
                  'Ask the AI to act as an interviewer and walk you through a mock DSA session.',
                ],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <CheckCircle
                    size={14}
                    style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }}
                  />
                  <span>
                    <strong style={{ color: COLORS.text.primary }}>{title}:</strong> {desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ─ DEV HUB ─────────────────────────────────────────────────── */}
          <section>
            <DocH2 id="tutorials" label="Tutorials" />
            <DocP>
              The Tutorials section in the Development Hub contains written step-by-step guides on
              implementing algorithms from scratch, understanding complexity proofs, and building
              common data structures. Each tutorial includes an estimated reading time, difficulty
              level, and code snippets.
            </DocP>
            <Link
              to="/development/tutorials"
              className="inline-flex items-center gap-2 my-3 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: BLUE }}
            >
              Browse Tutorials <ArrowRight size={14} />
            </Link>

            <DocH2 id="code-examples" label="Code Examples" />
            <DocP>
              Code Examples provides ready-to-run implementations across JavaScript, Python, Java,
              and C++. Each snippet is annotated with inline comments and includes a complexity
              summary block at the top.
            </DocP>
            <Link
              to="/development/code-examples"
              className="inline-flex items-center gap-2 my-3 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: BLUE }}
            >
              Browse Code Examples <ArrowRight size={14} />
            </Link>

            <DocH2 id="community" label="Community" />
            <DocP>
              The Community section hosts Q&amp;A threads, algorithm discussions, and weekly
              challenge announcements. Upvote helpful answers, follow contributors, and share your
              own solutions for peer review.
            </DocP>
            <Link
              to="/development/community"
              className="inline-flex items-center gap-2 my-3 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: BLUE }}
            >
              Join the Community <ArrowRight size={14} />
            </Link>
          </section>

          {/* ─ REFERENCE ───────────────────────────────────────────────── */}
          <section>
            <DocH2 id="shortcuts" label="Keyboard Shortcuts" />
            <DocP>Master these shortcuts to speed up your workflow inside the platform.</DocP>

            <div
              className="rounded-2xl border overflow-hidden my-5"
              style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
            >
              <div
                className="px-5 py-3 border-b"
                style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: COLORS.text.muted }}
                >
                  Global
                </p>
              </div>
              <div className="px-5">
                <ShortcutRow keys={['Ctrl', 'K']} action="Open AI Companion" />
                <ShortcutRow keys={['Ctrl', '/']} action="Focus search bar" />
                <ShortcutRow keys={['Ctrl', ']']} action="Next algorithm in category" />
                <ShortcutRow keys={['Ctrl', '[']} action="Previous algorithm in category" />
              </div>
              <div
                className="px-5 py-3 border-t border-b"
                style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: COLORS.text.muted }}
                >
                  Visualizer
                </p>
              </div>
              <div className="px-5">
                <ShortcutRow keys={['Space']} action="Play / Pause animation" />
                <ShortcutRow keys={['→']} action="Step forward one frame" />
                <ShortcutRow keys={['←']} action="Step backward one frame" />
                <ShortcutRow keys={['R']} action="Reset to initial state" />
                <ShortcutRow keys={['Shift', '+']} action="Increase animation speed" />
                <ShortcutRow keys={['Shift', '−']} action="Decrease animation speed" />
              </div>
              <div
                className="px-5 py-3 border-t border-b"
                style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: COLORS.text.muted }}
                >
                  Practice Editor
                </p>
              </div>
              <div className="px-5">
                <ShortcutRow keys={['Ctrl', 'Enter']} action="Run code against test cases" />
                <ShortcutRow keys={['Ctrl', 'Shift', 'Enter']} action="Submit solution" />
                <ShortcutRow keys={['Ctrl', 'Z']} action="Undo last edit" />
                <ShortcutRow keys={['Alt', 'Shift', 'F']} action="Format / prettify code" />
              </div>
            </div>

            {/* ── Glossary ── */}
            <DocH2 id="glossary" label="Glossary" />
            <DocP>Key terms used throughout the platform and documentation.</DocP>
            <div
              className="rounded-2xl border px-5 my-5"
              style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
            >
              <GlTerm
                term="Algorithm"
                def="A finite sequence of well-defined instructions for solving a class of problems or computing a result."
              />
              <GlTerm
                term="Big-O Notation"
                def="A mathematical notation describing the upper-bound growth rate of an algorithm's time or space requirements as input size approaches infinity."
              />
              <GlTerm
                term="Data Structure"
                def="A format for organising, managing, and storing data that allows efficient access and modification. Examples: arrays, linked lists, trees, graphs, hash maps."
              />
              <GlTerm
                term="Memoization"
                def="An optimisation technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again."
              />
              <GlTerm
                term="Dynamic Programming (DP)"
                def="A method for solving complex problems by breaking them into overlapping subproblems, solving each once, and storing their solutions."
              />
              <GlTerm
                term="Greedy Algorithm"
                def="An algorithm that makes the locally optimal choice at each step with the hope of finding a global optimum."
              />
              <GlTerm
                term="Traversal"
                def="The process of visiting (checking or updating) each node in a tree or graph exactly once."
              />
              <GlTerm
                term="Complexity (Time / Space)"
                def="A measure of the computational resources (time or memory) an algorithm requires relative to its input size."
              />
              <GlTerm
                term="In-place Algorithm"
                def="An algorithm that transforms its input using only a small, constant amount of extra space beyond the input itself."
              />
              <GlTerm
                term="Stable Sort"
                def="A sorting algorithm that preserves the relative order of equal elements in the output."
              />
            </div>

            {/* ── FAQ ── */}
            <DocH2 id="faq" label="FAQ" />
            <div
              className="rounded-2xl border px-5 my-5"
              style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.surface }}
            >
              <FaqItem
                q="Is AlgoView free to use?"
                a="Core features — algorithm visualizations, the problem library, and the development hub — are free for all registered users. Advanced AI companion usage and premium problem sets may be part of a future paid tier."
              />
              <FaqItem
                q="Which programming languages are supported in the practice editor?"
                a="JavaScript, Python, Java, and C++ are currently supported. TypeScript and Go support are planned for an upcoming release."
              />
              <FaqItem
                q="Can I visualize my own custom graph or array?"
                a="Yes — the visualizer allows you to edit the input directly before running. For graphs, you can add/remove nodes and edges and set custom edge weights from the canvas."
              />
              <FaqItem
                q="How does the AI know what algorithm I'm looking at?"
                a="The AI companion receives the name and category of the currently active algorithm as context when you open a chat session. You can also manually paste code or describe a problem for broader questions."
              />
              <FaqItem
                q="Can I contribute new problems or tutorials?"
                a="Yes. Use the Contribute section under DSA to propose new problems, or submit a tutorial draft via the Development Hub. All contributions are reviewed before publication."
              />
              <FaqItem
                q="Does AlgoView work offline?"
                a="The platform requires an internet connection for AI features and code execution. Algorithm visualizations and the documentation are cached for offline reading after the first visit."
              />
              <FaqItem
                q="How do I report a bug or suggest a feature?"
                a="Use the Feedback button in the bottom-right corner of any page, or open a thread in the Community Q&A section. Critical bugs can also be reported via the GitHub repository linked in the footer."
              />
            </div>

            {/* End of docs CTA */}
            <div
              className="mt-14 mb-8 rounded-3xl p-8 text-center border"
              style={{ borderColor: COLORS.border.light, backgroundColor: COLORS.bg.secondary }}
            >
              <p
                className="text-xs uppercase tracking-widest font-bold mb-2"
                style={{ color: COLORS.text.muted }}
              >
                You're all set
              </p>
              <h4 className="text-xl font-black mb-3" style={{ color: COLORS.text.primary }}>
                Start Exploring AlgoView
              </h4>
              <p className="text-sm max-w-md mx-auto mb-6" style={{ color: COLORS.text.secondary }}>
                Head over to the Algorithm Library to begin your first visualization, or jump into
                Practice Mode to test your problem-solving skills.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dsa/algorithms"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: BLUE }}
                >
                  Algorithm Library <ArrowRight size={14} />
                </Link>
                <Link
                  to="/dsa/problems"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.bg.surface,
                  }}
                >
                  Problem Library
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ─ Right TOC (desktop xl) ─────────────────────────────────── */}
        <aside className="hidden xl:block w-52 flex-shrink-0 sticky top-0 h-screen overflow-y-auto py-10 px-4">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ color: COLORS.text.muted }}
          >
            On this page
          </p>
          <nav className="space-y-0.5">
            {NAV.map(section => (
              <div key={section.id} className="mb-3">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2"
                  style={{ color: COLORS.text.muted }}
                >
                  {section.label}
                </p>
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveId(item.id)
                      const el = document.getElementById(item.id)
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="w-full text-left px-2 py-1 rounded-lg text-xs transition-all"
                    style={{
                      color: activeId === item.id ? BLUE : COLORS.text.tertiary,
                      backgroundColor: activeId === item.id ? BLUE_BG : 'transparent',
                      fontWeight: activeId === item.id ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  )
}

export default Documentation
