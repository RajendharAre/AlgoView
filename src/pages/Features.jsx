import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  Code2,
  Blocks,
  Sparkles,
  Users,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Workflow,
  ChevronRight,
  Play,
  Compass,
  FileCode2,
  MessageSquare,
  GitBranch
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { APP_COLORS, APP_SHADOWS } from '../constants/sitePalette'

const COLORS = APP_COLORS
const SHADOWS = APP_SHADOWS

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
}

const staggerParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08
    }
  }
}

const coreFeatures = [
  {
    title: 'Interactive DSA Visualizations',
    description: 'Step-wise execution for sorting, searching, graph, and dynamic programming with live controls and algorithm insights.',
    icon: Blocks
  },
  {
    title: 'AI Learning Companion',
    description: 'Context-aware assistant for quick concept explanations, debugging support, and interview-style guidance.',
    icon: Brain
  },
  {
    title: 'Practice And Tracking',
    description: 'Structured problem practice with progress metrics that help users measure consistency and growth.',
    icon: TrendingUp
  },
  {
    title: 'Developer Learning Hub',
    description: 'Tutorials, code examples, Q and A, and community resources collected in one practical flow.',
    icon: BookOpen
  },
  {
    title: 'Collaborative Idea Space',
    description: 'Create, explore, and refine project ideas with an integrated community feedback loop.',
    icon: Users
  },
  {
    title: 'Scalable Product Foundation',
    description: 'Clean architecture and reusable components that make feature expansion straightforward.',
    icon: Code2
  }
]

const productPillars = [
  {
    title: 'Learn By Seeing',
    description: 'Visual behavior first, then formal explanation.',
    icon: Play
  },
  {
    title: 'Learn By Building',
    description: 'Development resources turn concepts into real code.',
    icon: FileCode2
  },
  {
    title: 'Learn By Discussing',
    description: 'Ideas and discussions strengthen depth and clarity.',
    icon: MessageSquare
  },
  {
    title: 'Learn By Iterating',
    description: 'Progress loops and feedback improve long-term mastery.',
    icon: GitBranch
  }
]

const featureTracks = [
  {
    label: 'DSA Suite',
    points: ['Algorithm explorer', 'Visualization engine', 'Practice workflow', 'Discussion support'],
    icon: Compass
  },
  {
    label: 'Development Suite',
    points: ['Tutorial reading', 'Code examples', 'Video resources', 'Q and A system'],
    icon: Workflow
  },
  {
    label: 'AI Suite',
    points: ['Prompt-based help', 'Response formatting', 'History tracking', 'Fast follow-up flow'],
    icon: Sparkles
  }
]

const FeaturesHeroIllustration = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 430"
    fill="none"
    aria-hidden="true"
    className="w-full max-w-[500px]"
  >
    {/* ── Monitor frame ── */}
    <rect x="90" y="38" width="330" height="232" rx="14" stroke="#212529" strokeWidth="2.5" fill="white" />
    <rect x="100" y="48" width="310" height="212" rx="7" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="1" />

    {/* ── Monitor stand + base ── */}
    <rect x="233" y="270" width="48" height="28" rx="4" stroke="#212529" strokeWidth="2" fill="#e9ecef" />
    <rect x="198" y="296" width="118" height="12" rx="6" stroke="#212529" strokeWidth="2" fill="#dee2e6" />

    {/* ── Chart axes ── */}
    <line x1="128" y1="62" x2="128" y2="232" stroke="#495057" strokeWidth="1.5" />
    <line x1="128" y1="232" x2="392" y2="232" stroke="#495057" strokeWidth="1.5" />

    {/* ── Grid lines ── */}
    <line x1="128" y1="195" x2="392" y2="195" stroke="#dee2e6" strokeWidth="1" strokeDasharray="5,4" />
    <line x1="128" y1="158" x2="392" y2="158" stroke="#dee2e6" strokeWidth="1" strokeDasharray="5,4" />
    <line x1="128" y1="121" x2="392" y2="121" stroke="#dee2e6" strokeWidth="1" strokeDasharray="5,4" />
    <line x1="128" y1="84" x2="392" y2="84" stroke="#dee2e6" strokeWidth="1" strokeDasharray="5,4" />

    {/* ── Bars ── */}
    <rect x="148" y="175" width="34" height="57" rx="4" fill="#e9ecef" stroke="#343a40" strokeWidth="1.5" />
    <rect x="200" y="130" width="34" height="102" rx="4" fill="#ced4da" stroke="#343a40" strokeWidth="1.5" />
    <rect x="252" y="148" width="34" height="84" rx="4" fill="#e9ecef" stroke="#343a40" strokeWidth="1.5" />
    <rect x="304" y="94" width="34" height="138" rx="4" fill="#343a40" stroke="#212529" strokeWidth="1.5" />
    <rect x="356" y="138" width="34" height="94" rx="4" fill="#ced4da" stroke="#343a40" strokeWidth="1.5" />

    {/* ── Chart title placeholder ── */}
    <rect x="108" y="56" width="95" height="8" rx="3" fill="#ced4da" />
    <rect x="108" y="69" width="58" height="6" rx="3" fill="#dee2e6" />

    {/* ── Trend line ── */}
    <polyline
      points="165,177 217,132 269,150 321,96 373,140"
      stroke="#3b82f6"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="165" cy="177" r="4.5" fill="white" stroke="#212529" strokeWidth="2" />
    <circle cx="217" cy="132" r="4.5" fill="white" stroke="#212529" strokeWidth="2" />
    <circle cx="269" cy="150" r="4.5" fill="white" stroke="#212529" strokeWidth="2" />
    <circle cx="321" cy="96" r="5.5" fill="#3b82f6" stroke="#212529" strokeWidth="2" />
    <circle cx="373" cy="140" r="4.5" fill="white" stroke="#212529" strokeWidth="2" />

    {/* ── Floating stat card (top-right) ── */}
    <rect x="400" y="22" width="112" height="68" rx="10" fill="white" stroke="#212529" strokeWidth="1.5" />
    <rect x="400" y="22" width="112" height="6" rx="10" fill="#343a40" />
    <rect x="410" y="38" width="48" height="6" rx="2" fill="#dee2e6" />
    <rect x="410" y="49" width="66" height="11" rx="3" fill="#212529" />
    <rect x="410" y="65" width="36" height="5" rx="2" fill="#ced4da" />
    <polyline points="464,62 469,54 474,62" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="469" y1="54" x2="469" y2="72" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="400" y1="105" x2="420" y2="105" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="5,4" />

    {/* ── Floating mini-chart card (left) ── */}
    <rect x="4" y="142" width="100" height="90" rx="10" fill="white" stroke="#212529" strokeWidth="1.5" />
    <rect x="4" y="142" width="100" height="6" rx="10" fill="#3b82f6" />
    <rect x="14" y="158" width="42" height="5" rx="2" fill="#dee2e6" />
    <rect x="14" y="168" width="62" height="9" rx="3" fill="#212529" />
    <rect x="14" y="182" width="30" height="5" rx="2" fill="#ced4da" />
    {/* mini bars */}
    <line x1="60" y1="220" x2="98" y2="220" stroke="#495057" strokeWidth="1" />
    <rect x="62" y="200" width="9" height="20" rx="2" fill="#e9ecef" stroke="#495057" strokeWidth="1" />
    <rect x="74" y="193" width="9" height="27" rx="2" fill="#343a40" stroke="#212529" strokeWidth="1" />
    <rect x="86" y="197" width="9" height="23" rx="2" fill="#ced4da" stroke="#495057" strokeWidth="1" />
    {/* dashed connector to screen */}
    <line x1="104" y1="185" x2="145" y2="185" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="5,4" />

    {/* ── Floating badge card (bottom-right) ── */}
    <rect x="396" y="246" width="118" height="50" rx="10" fill="white" stroke="#212529" strokeWidth="1.5" />
    <circle cx="416" cy="271" r="11" fill="#f8f9fa" stroke="#212529" strokeWidth="1.5" />
    <polyline points="411,271 415,276 423,263" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="432" y="261" width="56" height="6" rx="2" fill="#dee2e6" />
    <rect x="432" y="272" width="42" height="5" rx="2" fill="#ced4da" />

    {/* ── Small floating pill (bottom-left of screen) ── */}
    <rect x="8" y="316" width="180" height="36" rx="18" fill="white" stroke="#212529" strokeWidth="1.5" />
    <circle cx="26" cy="334" r="9" fill="#343a40" />
    <rect x="44" y="328" width="52" height="7" rx="3" fill="#dee2e6" />
    <rect x="104" y="328" width="32" height="7" rx="3" fill="#3b82f6" opacity="0.7" />
    <rect x="44" y="339" width="80" height="5" rx="2" fill="#ced4da" />

    {/* ── Laptop keyboard bar ── */}
    <rect x="90" y="308" width="330" height="16" rx="7" fill="#e9ecef" stroke="#212529" strokeWidth="1.5" />
    <rect x="220" y="312" width="74" height="8" rx="4" fill="#dee2e6" />

    {/* ── Decorative dots ── */}
    <circle cx="62" cy="54" r="5" fill="#dee2e6" />
    <circle cx="76" cy="54" r="5" fill="#ced4da" />
    <circle cx="90" cy="54" r="5" fill="#343a40" opacity="0.4" />
    <circle cx="475" cy="160" r="5" fill="#3b82f6" opacity="0.6" />
    <circle cx="488" cy="178" r="3.5" fill="#ced4da" />
    <circle cx="470" cy="192" r="3" fill="#dee2e6" />
  </svg>
)

const FeatureCard = ({ item }) => {
  const Icon = item.icon

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: COLORS.bg.surface,
        borderColor: COLORS.border.light,
        boxShadow: SHADOWS.soft
      }}
    >
      <div
        className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: COLORS.bg.secondary, color: COLORS.accent.primary }}
      >
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.text.primary }}>{item.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>{item.description}</p>
    </motion.article>
  )
}

const Features = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg.primary }}>
      <section className="relative overflow-hidden border-b" style={{ borderColor: COLORS.border.light }}>
        <div
          className="absolute -top-32 -left-16 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(142, 213, 0, 0.12)' }}
        />
        <div
          className="absolute top-12 right-0 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(33, 37, 41, 0.07)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">

            {/* ── Left: text content ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
                style={{
                  borderColor: COLORS.border.medium,
                  backgroundColor: COLORS.bg.surface,
                  color: COLORS.text.secondary
                }}
              >
                <ShieldCheck size={15} />
                <span className="text-xs sm:text-sm font-semibold tracking-wide">Platform Features</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6" style={{ color: COLORS.text.primary }}>
                One Platform For
                <span className="block" style={{ color: COLORS.accent.primary }}>
                  Learning, Practice, And Development.
                </span>
              </h1>

              <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: COLORS.text.secondary }}>
                AlgoView combines algorithm understanding, implementation practice, and modern development learning into a single, consistent workflow.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: COLORS.text.primary,
                    color: COLORS.bg.surface,
                    boxShadow: SHADOWS.card
                  }}
                >
                  {user ? 'Go To Dashboard' : 'Start With AlgoView'}
                  <ChevronRight size={18} />
                </Link>

                <Link
                  to="/dsa/algorithms"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border text-sm sm:text-base transition-colors"
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.bg.surface
                  }}
                >
                  Explore Algorithms
                  <Blocks size={17} />
                </Link>
              </div>
            </motion.div>

            {/* ── Right: illustration ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.18 }}
              className="hidden lg:flex justify-center items-center"
            >
              <FeaturesHeroIllustration />
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerParent}
            className="mb-10"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-3" style={{ color: COLORS.text.primary }}>
              Core Capabilities
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-2xl text-sm sm:text-base" style={{ color: COLORS.text.secondary }}>
              Built for students and developers who want clarity, momentum, and practical results.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            variants={staggerParent}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {coreFeatures.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border p-6 sm:p-8 lg:p-10"
            style={{
              borderColor: COLORS.border.light,
              backgroundColor: COLORS.bg.surface,
              boxShadow: SHADOWS.soft
            }}
          >
            <h3 className="text-2xl sm:text-3xl font-black mb-5" style={{ color: COLORS.text.primary }}>
              Learning Model That Scales
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productPillars.map((pillar, index) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: COLORS.border.light,
                      backgroundColor: COLORS.bg.primary
                    }}
                  >
                    <Icon size={18} style={{ color: COLORS.accent.primary }} className="mb-3" />
                    <h4 className="font-bold text-base mb-1" style={{ color: COLORS.text.primary }}>{pillar.title}</h4>
                    <p className="text-sm" style={{ color: COLORS.text.tertiary }}>{pillar.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-black mb-8"
            style={{ color: COLORS.text.primary }}
          >
            Product Tracks
          </motion.h3>

          <div className="grid lg:grid-cols-3 gap-5">
            {featureTracks.map((track, index) => {
              const Icon = track.icon
              return (
                <motion.article
                  key={track.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="rounded-2xl border p-6"
                  style={{
                    backgroundColor: COLORS.bg.surface,
                    borderColor: COLORS.border.light,
                    boxShadow: SHADOWS.soft
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.bg.secondary, color: COLORS.accent.primary }}
                    >
                      <Icon size={18} />
                    </div>
                    <h4 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>{track.label}</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {track.points.map((point) => (
                      <li key={point} className="text-sm flex items-center gap-2" style={{ color: COLORS.text.secondary }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 border-t" style={{ borderColor: COLORS.border.light }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl p-8 sm:p-10 text-center"
            style={{
              backgroundColor: COLORS.text.primary,
              boxShadow: SHADOWS.card
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: COLORS.text.muted }}>
              Ready To Build Momentum
            </p>
            <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4" style={{ color: COLORS.bg.surface }}>
              Move From Learning Concepts To Solving Real Problems Faster.
            </h4>
            <p className="text-sm sm:text-base max-w-2xl mx-auto mb-7" style={{ color: COLORS.border.medium }}>
              Start using AlgoView to structure your DSA journey, sharpen implementation quality, and keep your development growth consistent.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dsa/algorithms"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#3b82f6',
                  color: COLORS.text.primary
                }}
              >
                Start Exploring
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/development"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm sm:text-base"
                style={{
                  borderColor: COLORS.text.secondary,
                  color: COLORS.bg.primary
                }}
              >
                Open Development Hub
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Features
