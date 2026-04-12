import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function TermsOfService() {
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
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms of Service</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: March 20, 2026</p>

          <div className="mt-8 space-y-7 text-slate-700 leading-7">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By accessing or using AlgoView, you agree to these Terms of Service. If you do not
                agree, you should not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. User Accounts</h2>
              <p className="mt-2">
                You are responsible for maintaining account confidentiality and for all activity
                under your account. Provide accurate registration details and update them when
                needed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Acceptable Use</h2>
              <p className="mt-2">
                You agree not to misuse the service, attempt unauthorized access, distribute
                malicious content, or violate laws and third-party rights while using AlgoView.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Intellectual Property</h2>
              <p className="mt-2">
                Platform content, design, and software are protected by intellectual property laws.
                You may not reproduce or distribute proprietary materials without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Service Availability</h2>
              <p className="mt-2">
                We may modify, suspend, or discontinue features at any time. We do not guarantee
                uninterrupted availability or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Limitation of Liability</h2>
              <p className="mt-2">
                To the maximum extent allowed by law, AlgoView is not liable for indirect,
                incidental, or consequential damages arising from use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Contact</h2>
              <p className="mt-2">
                For legal questions about these terms, contact support@algoview.app.
              </p>
            </section>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
