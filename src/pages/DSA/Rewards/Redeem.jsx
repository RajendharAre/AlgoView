import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Star, ShoppingCart, CreditCard } from 'lucide-react'

const DSARewardsRedeem = () => {
  const [selectedItem, setSelectedItem] = useState(null)

  // Mock rewards data
  const rewards = [
    {
      id: 1,
      name: 'AlgoView T-Shirt',
      points: 500,
      image: null,
      description: 'Premium cotton t-shirt with algorithm visualization design',
      category: 'Merchandise'
    },
    {
      id: 2,
      name: 'DSA Course Access',
      points: 1200,
      image: null,
      description: '3-month access to premium DSA course content',
      category: 'Courses'
    },
    {
      id: 3,
      name: 'Sticker Pack',
      points: 150,
      image: null,
      description: 'Set of 10 algorithm-themed stickers',
      category: 'Merchandise'
    },
    {
      id: 4,
      name: 'Expert Mentor Session',
      points: 2000,
      image: null,
      description: '60-minute 1:1 session with DSA expert',
      category: 'Services'
    },
    {
      id: 5,
      name: 'Premium Notebook',
      points: 300,
      image: null,
      description: 'Leather-bound notebook for coding notes',
      category: 'Merchandise'
    },
    {
      id: 6,
      name: 'Certificate of Achievement',
      points: 100,
      image: null,
      description: 'Official certificate for completing DSA challenges',
      category: 'Certificates'
    }
  ]

  // Mock user points
  const userPoints = 1150

  const handleRedeem = (item) => {
    if (userPoints >= item.points) {
      setSelectedItem(item)
    }
  }

  const confirmRedemption = () => {
    // Handle redemption logic
    console.log('Redeeming:', selectedItem)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Redeem Rewards</h1>
                <p className="text-gray-600 mt-1">Exchange your points for exciting rewards</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Star className="text-yellow-500" size={20} />
                <span className="font-bold text-gray-900">{userPoints}</span>
                <span className="text-gray-600">points</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {reward.image ? (
                      <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gift className="text-gray-400" size={48} />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {reward.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={16} />
                        <span className="font-bold text-gray-900">{reward.points}</span>
                      </div>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={userPoints < reward.points}
                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                          userPoints >= reward.points
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={14} />
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Redemption Confirmation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Redemption</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to redeem <span className="font-medium">{selectedItem.name}</span> for{' '}
                <span className="font-bold text-gray-900">{selectedItem.points}</span> points?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedemption}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard size={16} />
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DSARewardsRedeem