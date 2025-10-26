import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, FileText, Lightbulb, Users, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const DSAContribute = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock contribution stats
  const stats = {
    totalContributions: 127,
    acceptedSubmissions: 89,
    pendingReview: 12,
    communityImpact: 2450
  }

  // Mock recent contributions
  const recentContributions = [
    {
      id: 1,
      title: 'Dynamic Programming Optimization Techniques',
      type: 'Article',
      status: 'Published',
      date: '2023-06-15',
      likes: 42
    },
    {
      id: 2,
      title: 'Binary Search Tree Visualization',
      type: 'Visualization',
      status: 'Published',
      date: '2023-06-12',
      likes: 28
    },
    {
      id: 3,
      title: 'Graph Traversal Algorithms Explanation',
      type: 'Tutorial',
      status: 'Review',
      date: '2023-06-10',
      likes: 0
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contribute to the Community</h1>
                <p className="text-gray-600 mt-1">Share your knowledge and help others learn</p>
              </div>
              <Link
                to="/dsa/contribute/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                New Contribution
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Contributions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalContributions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Accepted</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.acceptedSubmissions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Impact</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.communityImpact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contributions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Contributions
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guidelines'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Guidelines
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Contribute?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Lightbulb className="text-blue-600" size={24} />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Share Knowledge</h3>
                      <p className="text-sm text-gray-600">
                        Help others learn by sharing your understanding of algorithms and data structures.
                      </p>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp className="text-green-600" size={24} />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Build Your Reputation</h3>
                      <p className="text-sm text-gray-600">
                        Gain recognition in the community and showcase your expertise to potential employers.
                      </p>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Users className="text-purple-600" size={24} />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Make an Impact</h3>
                      <p className="text-sm text-gray-600">
                        Contribute to a growing resource that helps thousands of learners worldwide.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contribution Types</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Algorithm Explanations</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Write detailed explanations of algorithms with examples and visualizations.
                      </p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        High Impact
                      </span>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Problem Solutions</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Share solutions to coding problems with step-by-step explanations.
                      </p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Medium Impact
                      </span>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Tutorials & Guides</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Create comprehensive tutorials on specific topics or techniques.
                      </p>
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        High Impact
                      </span>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Visualizations</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Create interactive visualizations to help others understand concepts.
                      </p>
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Very High Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'contributions' ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Recent Contributions</h2>
                <div className="space-y-3">
                  {recentContributions.map((contribution) => (
                    <div key={contribution.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{contribution.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {contribution.type}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                contribution.status === 'Published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {contribution.status}
                            </span>
                            <span className="text-xs text-gray-500">{contribution.date}</span>
                          </div>
                        </div>
                        {contribution.likes > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span>{contribution.likes}</span>
                            <span>likes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contribution Guidelines</h2>
                <div className="prose max-w-none">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Quality Standards</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                        <li>Ensure your content is original and not copied from other sources</li>
                        <li>Provide clear explanations with examples where appropriate</li>
                        <li>Use proper formatting and structure to enhance readability</li>
                        <li>Include visualizations or diagrams when they help explain concepts</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Content Guidelines</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                        <li>Focus on educational value rather than self-promotion</li>
                        <li>Avoid promotional language or links to commercial products</li>
                        <li>Respect intellectual property and cite sources when referencing external material</li>
                        <li>Maintain a respectful and inclusive tone in all contributions</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Review Process</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                        <li>All submissions are reviewed by our moderation team</li>
                        <li>You'll receive feedback within 3-5 business days</li>
                        <li>Accepted contributions will be published and shared with the community</li>
                        <li>Rejected submissions will include detailed feedback for improvement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DSAContribute