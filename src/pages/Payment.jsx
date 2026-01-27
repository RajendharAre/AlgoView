import { motion } from 'framer-motion'
import { Check, Star, Shield, CreditCard, Zap } from 'lucide-react'

const Payment = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with algorithm visualization',
      features: [
        'Access to basic algorithms',
        'Limited visualizations per day',
        'Community support',
        'Basic profile'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Ideal for serious learners and developers',
      features: [
        'Access to all algorithms',
        'Unlimited visualizations',
        'Priority support',
        'Advanced profile',
        'Save and share visualizations',
        'Early access to new features'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: 'per month',
      description: 'For teams and educational institutions',
      features: [
        'Everything in Pro plan',
        'Team collaboration tools',
        'Custom organization branding',
        'Dedicated account manager',
        'API access',
        'Advanced analytics'
      ],
      popular: false
    }
  ]

  const benefits = [
    {
      icon: Star,
      title: 'Premium Content',
      description: 'Access to exclusive algorithms and advanced visualizations not available in the free tier.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'All transactions are secured with industry-standard encryption and fraud protection.'
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Your premium features are activated immediately after payment confirmation.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Choose Your Plan
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Unlock the full potential of AlgoView with our premium plans. 
          Start learning algorithms at your own pace with unlimited access to all features.
        </motion.p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className={`relative bg-white rounded-xl shadow-md border ${
              plan.popular 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment Methods</h3>
        <div className="flex justify-center space-x-6">
          <CreditCard className="h-8 w-8 text-gray-400" />
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <p className="text-gray-500 mt-4">
          All payments are secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}

export default Payment