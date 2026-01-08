import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, Users, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';

const IdeaDetail = () => {
  const { ideaId } = useParams();
  
  // Mock data for the idea
  const idea = {
    id: ideaId || 1,
    title: "Advanced Algorithm Visualization Platform",
    description: "An interactive platform for visualizing complex algorithms with step-by-step breakdowns. Users can see how algorithms work in real-time with animated diagrams and explanations.",
    author: "John Doe",
    authorAvatar: "https://via.placeholder.com/40x40/3b82f6/ffffff?text=JD",
    date: "2024-01-15",
    likes: 24,
    comments: 8,
    tags: ["DSA", "Education", "Visualization", "Interactive"],
    featured: true,
    content: `
      ## Detailed Description
      
      This platform aims to revolutionize how students and professionals learn and understand algorithms. The core features include:
      
      - **Interactive Visualizations**: See algorithms in action with step-by-step visual breakdowns
      - **Multiple Algorithm Types**: Covering sorting, searching, graph algorithms, and more
      - **Custom Input Support**: Users can input their own data to see how algorithms work with different inputs
      - **Performance Analysis**: Real-time complexity analysis and comparison between different approaches
      - **Educational Resources**: Comprehensive guides and explanations for each algorithm
      
      ## Implementation Approach
      
      The platform will be built using modern web technologies:
      
      1. **Frontend**: React.js with D3.js for visualizations
      2. **State Management**: Redux Toolkit for predictable state updates
      3. **Styling**: Tailwind CSS for responsive design
      4. **Animations**: Framer Motion for smooth transitions
      5. **Charts**: Recharts for performance metrics visualization
      
      ## Benefits
      
      - Improved understanding of complex algorithms
      - Better retention through visual learning
      - Hands-on experience without setting up environments
      - Accessible to anyone with a web browser
      - Supports multiple learning styles
    `,
    relatedIdeas: [
      {
        id: 2,
        title: "Code Interview Simulator",
        description: "Realistic coding interview environment with timer and video recording",
        author: "Jane Smith",
        likes: 18,
        comments: 5
      },
      {
        id: 3,
        title: "Collaborative Learning Platform",
        description: "Real-time collaborative coding environment for peer learning",
        author: "Mike Johnson",
        likes: 32,
        comments: 12
      }
    ]
  };

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alice Wilson",
      avatar: "https://via.placeholder.com/32x32/ef4444/ffffff?text=AW",
      content: "This sounds amazing! Would love to contribute to this project.",
      date: "2024-01-16",
      likes: 3
    },
    {
      id: 2,
      author: "Bob Thompson",
      avatar: "https://via.placeholder.com/32x32/10b981/ffffff?text=BT",
      content: "I've been looking for something like this. Count me in!",
      date: "2024-01-15",
      likes: 7
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Current User",
        avatar: "https://via.placeholder.com/32x32/8b5cf6/ffffff?text=CU",
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Ideas
          </button>
        </div>

        {/* Main Idea Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {idea.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3">
              <span className="text-white text-sm font-medium">Featured Idea</span>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full ${
                  bookmarked 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <img 
                src={idea.authorAvatar} 
                alt={idea.author}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>by {idea.author}</span>
              <Calendar className="h-4 w-4 ml-4 mr-1" />
              <span>{new Date(idea.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {idea.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="prose max-w-none mb-8">
              {idea.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc list-inside mb-3">
                      {paragraph.split('\n').filter(item => item.trim()).map((item, i) => (
                        <li key={i} className="text-gray-700 mb-1">
                          {item.replace('- ', '').trim()}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.match(/^\d\. /)) {
                  return (
                    <ol key={index} className="list-decimal list-inside mb-3">
                      {paragraph.split('\n').filter(item => item.trim()).map((item, i) => (
                        <li key={i} className="text-gray-700 mb-1">
                          {item.replace(/^\d\. /, '').trim()}
                        </li>
                      ))}
                    </ol>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-gray-700 mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{idea.likes + (liked ? 1 : 0)}</span>
                </button>
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span>{comments.length}</span>
                </div>
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>Share</span>
                </button>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Discussion
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h3>
          
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this idea..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
          
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.author}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <button className="hover:text-red-600 flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </button>
                    <button className="hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Ideas */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Ideas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {idea.relatedIdeas.map(related => (
              <div key={related.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">{related.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{related.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>by {related.author}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{related.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>{related.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;