import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, ThumbsUp, Share2, Bookmark, MoreHorizontal, User } from 'lucide-react'

const DSADiscussionDetail = () => {
  const { discussionId } = useParams()
  const [reply, setReply] = useState('')

  // Mock discussion data
  const discussion = {
    id: discussionId || '1',
    title: discussionId ? `Discussion: ${discussionId}` : 'Understanding Dynamic Programming',
    author: 'Alex Johnson',
    authorAvatar: null,
    createdAt: '2023-06-15T10:30:00Z',
    content: 'I\'ve been struggling with dynamic programming concepts, especially with identifying overlapping subproblems. Could someone explain a systematic approach to recognize when a problem can be solved using DP?',
    tags: ['dynamic-programming', 'algorithms', 'beginner'],
    likes: 24,
    replies: 8
  }

  // Mock replies data
  const replies = [
    {
      id: '1',
      author: 'Sarah Chen',
      authorAvatar: null,
      content: 'Great question! The key insight is to look for problems that ask for an optimal result (maximum, minimum, number of ways, etc.) and can be broken down into similar subproblems.',
      createdAt: '2023-06-15T11:15:00Z',
      likes: 12
    },
    {
      id: '2',
      author: 'Mike Rodriguez',
      authorAvatar: null,
      content: 'I recommend starting with classic DP problems like Fibonacci, Coin Change, and Knapsack. Once you understand the pattern, it becomes easier to identify.',
      createdAt: '2023-06-15T12:30:00Z',
      likes: 8
    }
  ]

  const handleReply = (e) => {
    e.preventDefault()
    // Handle reply submission
    console.log('Reply submitted:', reply)
    setReply('')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Discussion Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{discussion.title}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    {discussion.authorAvatar ? (
                      <img src={discussion.authorAvatar} alt={discussion.author} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{discussion.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    {discussion.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Discussion Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{discussion.content}</p>
            </div>

            {/* Discussion Actions */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <ThumbsUp size={16} />
                <span>{discussion.likes}</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                <Bookmark size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Replies */}
          <div className="border-t border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {discussion.replies} Replies
              </h2>
            </div>

            {replies.map((reply) => (
              <div key={reply.id} className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  {reply.authorAvatar ? (
                    <img src={reply.authorAvatar} alt={reply.author} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={18} className="text-green-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{reply.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{reply.content}</p>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                        <ThumbsUp size={14} />
                        <span>{reply.likes}</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Reply Form */}
            <div className="p-6">
              <form onSubmit={handleReply}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write a reply..."
                      required
                    />
                    <div className="flex items-center justify-end gap-3 mt-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MessageCircle size={16} />
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DSADiscussionDetail