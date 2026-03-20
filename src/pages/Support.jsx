import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Clock3, ShieldCheck, BookOpen, ExternalLink, Send, CheckCircle2 } from 'lucide-react'
import { sendSupportRequest } from '../services/supportService'

const contactCards = [
  {
    title: 'Email Support',
    description: 'Best for account issues, billing questions, and bug reports.',
    action: 'support@algoview.app',
    href: 'mailto:support@algoview.app',
    icon: Mail
  },
  {
    title: 'Community Q&A',
    description: 'Ask questions and get help from learners and contributors.',
    action: 'Open Community',
    href: '/development/community',
    icon: MessageCircle
  },
  {
    title: 'Documentation',
    description: 'Find setup guides, workflow docs, and feature walkthroughs.',
    action: 'Read Documentation',
    href: '/documentation',
    icon: BookOpen
  }
]

const faqs = [
  {
    q: 'How quickly will I get a response?',
    a: 'Most support requests receive a response within 24 hours on business days.'
  },
  {
    q: 'What details should I include for a bug report?',
    a: 'Include steps to reproduce, your browser and OS, screenshots, and any console errors.'
  },
  {
    q: 'Can I request a new algorithm visualization?',
    a: 'Yes. Share your request in Community with expected behavior and sample input/output.'
  },
  {
    q: 'Where can I track product updates?',
    a: 'Check the Documentation page and Development Hub sections for newly released content.'
  }
]

const SupportHeroIllustration = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 420"
    fill="none"
    aria-hidden="true"
    className="w-full max-w-[500px]"
  >
    {/* Main help desk panel */}
    <rect x="84" y="38" width="352" height="248" rx="16" fill="white" stroke="#1e293b" strokeWidth="2.5" />
    <rect x="96" y="50" width="328" height="224" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

    {/* Header strip */}
    <rect x="96" y="50" width="328" height="34" rx="10" fill="#e2e8f0" />
    <circle cx="115" cy="67" r="4" fill="#94a3b8" />
    <circle cx="129" cy="67" r="4" fill="#cbd5e1" />
    <circle cx="143" cy="67" r="4" fill="#3b82f6" opacity="0.7" />
    <rect x="164" y="62" width="122" height="10" rx="4" fill="#94a3b8" />

    {/* Left chat list */}
    <rect x="110" y="100" width="106" height="158" rx="8" fill="white" stroke="#dbeafe" strokeWidth="1.2" />
    <rect x="120" y="112" width="72" height="8" rx="3" fill="#cbd5e1" />
    <rect x="120" y="126" width="84" height="30" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
    <circle cx="130" cy="141" r="6" fill="#3b82f6" opacity="0.25" />
    <rect x="141" y="136" width="56" height="6" rx="2" fill="#93c5fd" />
    <rect x="120" y="164" width="84" height="30" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
    <circle cx="130" cy="179" r="6" fill="#94a3b8" opacity="0.35" />
    <rect x="141" y="174" width="56" height="6" rx="2" fill="#cbd5e1" />
    <rect x="120" y="202" width="84" height="30" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
    <circle cx="130" cy="217" r="6" fill="#94a3b8" opacity="0.35" />
    <rect x="141" y="212" width="56" height="6" rx="2" fill="#cbd5e1" />

    {/* Active ticket area */}
    <rect x="230" y="100" width="180" height="158" rx="8" fill="white" stroke="#dbeafe" strokeWidth="1.2" />
    <rect x="244" y="114" width="80" height="8" rx="3" fill="#94a3b8" />
    <rect x="244" y="129" width="46" height="6" rx="3" fill="#cbd5e1" />

    {/* Message bubbles */}
    <rect x="244" y="146" width="112" height="26" rx="8" fill="#eff6ff" />
    <rect x="254" y="155" width="91" height="8" rx="3" fill="#60a5fa" opacity="0.5" />
    <rect x="274" y="179" width="122" height="28" rx="8" fill="#f1f5f9" />
    <rect x="284" y="189" width="98" height="8" rx="3" fill="#94a3b8" opacity="0.55" />
    <rect x="244" y="214" width="104" height="26" rx="8" fill="#dbeafe" />
    <rect x="254" y="223" width="84" height="8" rx="3" fill="#3b82f6" opacity="0.45" />

    {/* Input bar */}
    <rect x="230" y="265" width="180" height="21" rx="10" fill="white" stroke="#bfdbfe" strokeWidth="1.2" />
    <rect x="242" y="272" width="92" height="7" rx="3" fill="#cbd5e1" />
    <circle cx="392" cy="275" r="7" fill="#3b82f6" />
    <polyline points="389,275 392,272 395,275" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="392" y1="272" x2="392" y2="279" stroke="white" strokeWidth="1.6" strokeLinecap="round" />

    {/* Floating support badge */}
    <rect x="14" y="132" width="84" height="98" rx="12" fill="white" stroke="#1e293b" strokeWidth="1.6" />
    <rect x="14" y="132" width="84" height="8" rx="12" fill="#3b82f6" />
    <circle cx="56" cy="168" r="18" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.2" />
    <path d="M49 168h14M56 161v14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    <rect x="30" y="196" width="52" height="7" rx="3" fill="#cbd5e1" />
    <rect x="38" y="208" width="36" height="6" rx="3" fill="#dbeafe" />

    {/* Floating checklist card */}
    <rect x="398" y="300" width="106" height="70" rx="12" fill="white" stroke="#1e293b" strokeWidth="1.6" />
    <rect x="410" y="316" width="48" height="7" rx="3" fill="#94a3b8" />
    <circle cx="414" cy="336" r="5.5" fill="#dbeafe" stroke="#60a5fa" />
    <polyline points="411,336 414,339 418,333" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="424" y="333" width="62" height="6" rx="3" fill="#cbd5e1" />
    <circle cx="414" cy="350" r="5.5" fill="#dbeafe" stroke="#60a5fa" />
    <polyline points="411,350 414,353 418,347" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="424" y="347" width="48" height="6" rx="3" fill="#cbd5e1" />

    {/* Base shadow and decorative lines */}
    <rect x="132" y="300" width="256" height="14" rx="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
    <line x1="98" y1="334" x2="164" y2="334" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4" />
    <line x1="354" y1="334" x2="398" y2="334" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4" />
  </svg>
)

const Support = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await sendSupportRequest({
        ...form,
        source: 'support-page',
        subject: `Support request (${form.topic})`
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Unable to send request right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 mb-5">
              <ShieldCheck className="h-4 w-4" />
              Support Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              We are here to help you keep learning without blockers
            </h1>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Reach out for technical issues, account help, or platform guidance. Pick the fastest support path below.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600">
              <Clock3 className="h-4 w-4 text-blue-600" />
              Typical response time: within 24 hours (business days)
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex justify-center"
          >
            <SupportHeroIllustration />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 grid place-content-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <p className="mt-5 text-sm font-medium text-blue-700">{item.action}</p>
              </motion.a>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Send us a message</h3>
            <p className="text-slate-600 mb-6">Share your issue and we will follow up quickly.</p>

            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Request received</p>
                  <p className="text-sm mt-1">Thanks for contacting support. We will get back to you at the email you provided.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Your email"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  name="topic"
                  value={form.topic}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General help</option>
                  <option value="account">Account and login</option>
                  <option value="billing">Billing and plans</option>
                  <option value="bug">Bug report</option>
                  <option value="feature">Feature request</option>
                </select>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Explain your issue in detail..."
                  rows={6}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.q}</p>
                  <p className="text-sm text-slate-600 mt-2">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Support
