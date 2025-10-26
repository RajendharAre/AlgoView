import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, User, Calendar, Tag } from 'lucide-react'

const IdeaDetail = () => {
  const { ideaId } = useParams()

  // Mock idea data
  const idea = {
    id: ideaId,
    title: 'Algorithm Visualization Platform',
    description: 'A comprehensive web platform to visualize complex algorithms step-by-step with interactive controls, making it easier for students and developers to understand how algorithms work.',
    author: {
      name: 'Alex Johnson',
      avatar: null,
      joinDate: 'January 2023'
    },
    category: 'Web Development',
    likes: 24,
    comments: 8,
    tags: ['react', 'd3.js', 'algorithms', 'education', 'visualization'],
    createdAt: '2023-06-15',
    content: `
      <h2>Concept Overview</h2>
      <p>This platform aims to make complex algorithms accessible and understandable through interactive visualizations. Users can step through algorithms at their own pace, modify input data, and see how the algorithm responds in real-time.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Interactive step-by-step visualization of algorithms</li>
        <li>Customizable input data for testing different scenarios</li>
        <li>Detailed explanations for each step of the algorithm</li>
        <li>Performance metrics and complexity analysis</li>
        <li>Save and share visualizations with others</li>
        <li>Mobile-responsive design for learning on any device</li>
      </ul>
      
      <h2>Technical Implementation</h2>
      <p>The platform will be built using React for the frontend with D3.js for visualizations. Firebase will handle user authentication and data storage. The algorithm implementations will be written in JavaScript with detailed commenting to explain each step.</p>
      
      <h2>Target Audience</h2>
      <p>This platform is designed for:</p>
      <ul>
        <li>Computer science students learning algorithms</li>
        <li>Developers preparing for technical interviews</li>
        <li>Educators teaching data structures and algorithms</li>
        <li>Anyone interested in understanding how algorithms work</li>
      </ul>
    `
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Ideas
        </button>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {idea.category}
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                <Heart size={20} className="mr-1" />
                <span>{idea.likes}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                <MessageCircle size={20} className="mr-1" />
                <span>{idea.comments}</span>
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                <Share2 size={20} />
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{idea.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {idea.author.avatar ? (
                  <img className="h-10 w-10 rounded-full" src={idea.author.avatar} alt={idea.author.name} />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{idea.author.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span>Joined {idea.author.joinDate}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Published on {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">{idea.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {idea.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                <Tag size={14} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: idea.content }}
          />
        </div>
      </motion.div>
      
      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Discussion ({idea.comments})</h2>
        
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Sarah Williams</h4>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-gray-700">This is a fantastic idea! I've been looking for something like this for my algorithms class. Would love to see graph algorithms included as well.</p>
              </div>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Michael Chen</h4>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-gray-700">Great concept! Have you considered using WebGL for more complex visualizations? It could handle 3D graph algorithms beautifully.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add a comment</h3>
          <textarea
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Share your thoughts..."
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
              Post Comment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default IdeaDetail