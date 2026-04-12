import { motion } from 'framer-motion'
import { Cookie } from 'lucide-react'

const cookieTypes = [
  {
    type: 'Essential Cookies',
    purpose: 'Required for login, security, and core site functionality.',
    examples: 'Session tokens, authentication state',
  },
  {
    type: 'Performance Cookies',
    purpose: 'Help us understand feature usage and improve performance.',
    examples: 'Analytics events, page timing',
  },
  {
    type: 'Preference Cookies',
    purpose: 'Remember your settings and personalized experience.',
    examples: 'Theme choice, language selection',
  },
]

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 mb-5">
            <Cookie className="h-4 w-4" />
            Cookie Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Cookie Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: March 20, 2026</p>

          <div className="mt-8 space-y-7 text-slate-700 leading-7">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. What Are Cookies?</h2>
              <p className="mt-2">
                Cookies are small text files stored on your device to help websites remember your
                session and preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. How We Use Cookies</h2>
              <p className="mt-2">
                We use cookies to keep you logged in, improve site performance, understand usage
                trends, and personalize your experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Cookie Categories</h2>
              <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Purpose</th>
                      <th className="px-4 py-3 font-semibold">Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieTypes.map(row => (
                      <tr key={row.type} className="border-t border-slate-200">
                        <td className="px-4 py-3 font-medium text-slate-900">{row.type}</td>
                        <td className="px-4 py-3">{row.purpose}</td>
                        <td className="px-4 py-3">{row.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Managing Cookies</h2>
              <p className="mt-2">
                You can control or delete cookies through browser settings. Disabling essential
                cookies may impact login and core platform functionality.
              </p>
            </section>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
