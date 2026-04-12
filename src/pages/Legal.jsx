import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, ShieldCheck, FileText, Cookie, Mail } from 'lucide-react'

const legalPages = [
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your data.',
    icon: ShieldCheck,
    to: '/privacy',
  },
  {
    title: 'Terms of Service',
    description: 'Rules, responsibilities, and platform usage terms.',
    icon: FileText,
    to: '/terms',
  },
  {
    title: 'Cookie Policy',
    description: 'How cookies and similar technologies are used.',
    icon: Cookie,
    to: '/cookies',
  },
  {
    title: 'Contact',
    description: 'Reach support for account, billing, and product queries.',
    icon: Mail,
    to: '/contact',
  },
]

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 mb-5">
            <Scale className="h-4 w-4" />
            Legal Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Legal and Compliance
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Review our policies and legal terms in one place. These documents explain your rights,
            responsibilities, and how AlgoView handles data and platform usage.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {legalPages.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 grid place-content-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <Link
                  to={item.to}
                  className="inline-flex items-center mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Open
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
