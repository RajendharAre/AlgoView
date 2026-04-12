import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPolicy() {
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
            <ShieldCheck className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: March 20, 2026</p>

          <div className="mt-8 space-y-7 text-slate-700 leading-7">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Information We Collect</h2>
              <p className="mt-2">
                We collect information you provide directly (name, email, profile details), usage
                data (pages visited, feature interactions), and technical data (device, browser, IP
                logs) to operate and improve AlgoView.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. How We Use Information</h2>
              <p className="mt-2">
                We use your information to provide core platform functionality, secure accounts,
                personalize learning experiences, communicate updates, and diagnose technical
                issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Data Sharing</h2>
              <p className="mt-2">
                We do not sell personal data. We may share limited information with trusted service
                providers for hosting, analytics, authentication, and customer support under strict
                contractual protections.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Data Retention</h2>
              <p className="mt-2">
                We retain data as long as required for service delivery, legal compliance, and
                dispute resolution. You can request account deletion, and we will process it
                according to applicable laws and technical constraints.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Security</h2>
              <p className="mt-2">
                We apply reasonable administrative and technical safeguards to protect data. No
                online system is completely risk-free, so users should also maintain strong account
                security practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Your Rights</h2>
              <p className="mt-2">
                Depending on your jurisdiction, you may have rights to access, correct, delete, or
                restrict processing of personal data. Contact us at support@algoview.app for
                privacy-related requests.
              </p>
            </section>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
