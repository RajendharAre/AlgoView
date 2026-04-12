import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Clock3, Send, CheckCircle2 } from 'lucide-react'
import { sendSupportRequest } from '../services/supportService'

const channels = [
  {
    title: 'Email Support',
    detail: 'support@algoview.app',
    description: 'Best for account, billing, and technical issues.',
    icon: Mail,
    href: 'mailto:support@algoview.app',
  },
  {
    title: 'Community Help',
    detail: 'Development Community',
    description: 'Get help from maintainers and learners.',
    icon: MessageCircle,
    href: '/development/community',
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await sendSupportRequest({
        ...form,
        topic: 'contact',
        source: 'contact-page',
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Unable to send message right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Contact Us</h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Need help with AlgoView? Reach out through the channels below and we will assist you.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 text-blue-600" />
            Typical response time: within 24 hours (business days)
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {channels.map((channel, idx) => {
              const Icon = channel.icon
              return (
                <motion.a
                  key={channel.title}
                  href={channel.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 grid place-content-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{channel.title}</h2>
                  <p className="text-sm text-slate-600 mt-2">{channel.description}</p>
                  <p className="text-sm font-medium text-blue-700 mt-3">{channel.detail}</p>
                </motion.a>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Send a message</h2>
            <p className="text-sm text-slate-600 mb-6">
              Fill this form and then send your request to support email. Backend email delivery can
              be added next.
            </p>

            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Message sent</p>
                  <p className="text-sm mt-1">
                    Thanks for contacting us. Your message has been delivered to the support inbox.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={6}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
