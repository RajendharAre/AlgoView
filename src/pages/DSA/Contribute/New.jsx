import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, FileText, Link, Tag } from 'lucide-react'

const DSAContributeNew = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('algorithm')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [difficulty, setDifficulty] = useState('easy')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle submission logic here
    console.log({ title, category, content, tags, difficulty })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Submit New Content</h1>
            <p className="text-gray-600 mt-1">Share your knowledge with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="algorithm">Algorithm Explanation</option>
                  <option value="problem">Problem Solution</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="article">Article</option>
                  <option value="visualization">Visualization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tags separated by commas (e.g., sorting, graph, dynamic-programming)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your content here. You can use Markdown for formatting..."
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Submit Content
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload size={16} />
                Upload Files
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default DSAContributeNew