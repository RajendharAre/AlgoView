import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Clock3, ShieldCheck, BookOpen, ExternalLink, Send, CheckCircle2 } from 'lucide-react'

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

const Support = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Submit Request
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
