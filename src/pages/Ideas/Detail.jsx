import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getIdea, getCommentsListener, likeIdea, addComment, checkUserLike } from '../../services/ideasService';
import { Lightbulb, Heart, MessageCircle, Share2, User, Clock, ArrowLeft, Github, FileText, BookOpen, Link as LinkIcon } from 'lucide-react';

const IdeaDetail = () => {
  const { ideaId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [error, setError] = useState('');

  // Fetch idea details
  useEffect(() => {
    const fetchIdea = async () => {
      const ideaData = await getIdea(ideaId);
      if (ideaData) {
        setIdea(ideaData);
        setLoading(false);
        
        // Check if current user liked this idea
        if (user) {
          const hasLiked = await checkUserLike(ideaId, user.uid);
          setUserLiked(hasLiked);
        }
      } else {
        setError('Idea not found');
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, user]);

  // Set up real-time listener for comments
  useEffect(() => {
    if (!ideaId) return;

    let unsubscribe;
    setLoadingComments(true);
    
    unsubscribe = getCommentsListener(
      ideaId,
      (fetchedComments) => {
        setComments(fetchedComments);
        setLoadingComments(false);
      },
      (error) => {
        console.error('Error fetching comments:', error);
        setLoadingComments(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [ideaId]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like ideas');
      return;
    }

    try {
      const result = await likeIdea(ideaId, user.uid);
      
      if (result.success) {
        setUserLiked(result.liked);
      } else {
        console.error('Failed to like idea:', result.error);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      const result = await addComment(ideaId, user.uid, user.displayName || user.email.split('@')[0], newComment.trim());
      
      if (result.success) {
        setNewComment('');
      } else {
        alert(result.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error in handleAddComment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Idea Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/ideas" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Idea Not Found</h2>
          <Link 
            to="/ideas" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ideas')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Ideas
          </button>
        </div>

        {/* Idea detail card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center mr-4">
              <User className="h-4 w-4 mr-1" />
              <span>{idea.authorName || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {idea.createdAt?.toDate ? 
                  idea.createdAt.toDate().toLocaleDateString() : 
                  new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">{idea.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {(idea.tags || []).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* References section */}
          {idea.references && idea.references.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-blue-600" />
                References
              </h3>
              <div className="space-y-2">
                {idea.references.map((reference, index) => {
                  // Determine the icon based on reference type
                  let IconComponent;
                  let iconColor = "text-gray-600";
                  
                  switch(reference.type) {
                    case 'github':
                      IconComponent = Github;
                      iconColor = "text-gray-800";
                      break;
                    case 'article':
                      IconComponent = FileText;
                      iconColor = "text-blue-600";
                      break;
                    case 'research-paper':
                      IconComponent = BookOpen;
                      iconColor = "text-purple-600";
                      break;
                    default:
                      IconComponent = LinkIcon;
                      iconColor = "text-gray-600";
                  }
                  
                  return (
                    <div key={index} className="flex items-center p-2 bg-white rounded border hover:shadow-sm transition-shadow">
                      <span className={`${iconColor} mr-2`}>
                        <IconComponent className="h-4 w-4" />
                      </span>
                      <a 
                        href={reference.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate flex-1"
                        title={reference.url}
                      >
                        {reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}: {reference.url}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 ${userLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`h-5 w-5 ${userLiked ? 'fill-current' : ''}`} />
                <span>{idea.likeCount || 0} likes</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length} comments</span>
              </div>
            </div>
            
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <Share2 className="h-5 w-5 mr-1" />
              Share
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>
          
          {user && (
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Add a comment
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts..."
                />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </form>
          )}
          
          {!user && (
            <div className="mb-6 text-center py-4">
              <p className="text-gray-600 mb-2">Log in to add a comment</p>
              <Link 
                to="/login" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Log In
              </Link>
            </div>
          )}

          {loadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span className="font-medium mr-2">{comment.authorName || 'Anonymous'}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {comment.createdAt?.toDate ? 
                          comment.createdAt.toDate().toLocaleString() : 
                          new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;