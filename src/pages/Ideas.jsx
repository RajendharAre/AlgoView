import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';
import { useAuth } from '../hooks/useAuth';
import { getIdeasListener, likeIdea, checkUserLike, getUserLikesListener } from '../services/ideasService';
import { Lightbulb, Plus, MessageCircle, Heart, Share2, Filter, Search, User, Clock, X } from 'lucide-react';

const Ideas = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set()); // Track which ideas user has liked
  const [shareIdea, setShareIdea] = useState(null); // Track which idea is being shared

  // Get all unique tags from ideas
  const allTags = [...new Set(ideas.flatMap(idea => idea.tags || []))];

  // Set up real-time listener for ideas and user likes
  useEffect(() => {
    let ideasUnsubscribe;
    let refreshUserLikes;
    
    const fetchIdeas = async () => {
      setLoading(true);
      ideasUnsubscribe = getIdeasListener(
        (fetchedIdeas) => {
          setIdeas(fetchedIdeas);
          
          // Update user likes for all fetched ideas
          if (user) {
            refreshUserLikes = getUserLikesListener(user.uid, fetchedIdeas, (likedIdeaIds) => {
              setUserLikes(new Set(likedIdeaIds));
            });
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching ideas:', error);
          setLoading(false);
        }
      );
    };

    fetchIdeas();

    // Clean up listeners on unmount
    return () => {
      if (ideasUnsubscribe) {
        ideasUnsubscribe();
      }
    };
  }, [user]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Handle like/unlike
  const handleLike = async (ideaId) => {
    if (!user) {
      dispatch(addNotification({
        title: 'Authentication Required',
        message: 'Please log in to like ideas',
        type: 'warning'
      }));
      return;
    }

    try {
      const result = await likeIdea(ideaId, user.uid);
      
      if (result.success) {
        // Optimistically update the UI
        setUserLikes(prev => {
          const newSet = new Set(prev);
          if (result.liked) {
            newSet.add(ideaId);
          } else {
            newSet.delete(ideaId);
          }
          return newSet;
        });
        
        // The real-time listener will automatically update the like count from Firestore
        // No need to manually update the ideas array since the listener handles it
      } else {
        console.error('Failed to like idea:', result.error);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
    }
  };

  // Share helper functions
  const getShareUrl = (idea) =>
    `${window.location.origin}/ideas/${idea.id}`;

  const nativeShare = async (idea) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: idea.description,
          url: getShareUrl(idea)
        });
        return true;
      } catch (error) {
        // User cancelled sharing or other error occurred
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  };

  const openShare = (platform, idea) => {
    const url = encodeURIComponent(getShareUrl(idea));
    const text = encodeURIComponent(idea.title);

    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${text}&body=${url}`
    };

    window.open(links[platform], "_blank");
  };

  const copyLink = async (idea) => {
    await navigator.clipboard.writeText(getShareUrl(idea));
    dispatch(addNotification({
      title: 'Link Copied',
      message: 'The link has been copied to your clipboard',
      type: 'success'
    }));
  };

  const handleShare = async (idea) => {
    const usedNative = await nativeShare(idea);

    if (!usedNative) {
      setShareIdea(idea);  // open your share modal
    }
  };

  // Filter ideas based on search and tags
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
                       (idea.tags && selectedTags.some(tag => idea.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
                  Ideas & Suggestions
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Share your ideas and explore innovative concepts for our platform
                </p>
              </div>
              <Link
                to="/ideas/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Idea
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ideas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center min-w-0 flex-1">
                <div className="flex items-center flex-shrink-0 mr-2">
                  <Filter className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2 min-w-0">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading ideas...</p>
            </div>
          )}

          {/* Ideas Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {idea.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {idea.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(idea.tags || []).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{idea.authorName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {idea.createdAt?.toDate ? 
                            idea.createdAt.toDate().toLocaleDateString() : 
                            new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => handleLike(idea.id)}
                        className={`flex items-center space-x-1 ${userLikes.has(idea.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Heart className={`h-4 w-4 ${userLikes.has(idea.id) ? 'fill-current' : ''}`} />
                        <span>{idea.likeCount || 0}</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/ideas/${idea.id}`}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{idea.commentCount || 0}</span>
                        </Link>
                        

                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(idea);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </button>
                      <Link 
                        to={`/ideas/${idea.id}`}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Share Modal */}
      {shareIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Idea</h3>
              <button 
                onClick={() => setShareIdea(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-700 mb-4 truncate">{shareIdea.title}</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  openShare('whatsapp', shareIdea);
                  setShareIdea(null);
                }}
                className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </button>
              
              <button 
                onClick={() => {
                  openShare('twitter', shareIdea);
                  setShareIdea(null);
                }}
                className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>
              
              <button 
                onClick={() => {
                  openShare('facebook', shareIdea);
                  setShareIdea(null);
                }}
                className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                Facebook
              </button>
              
              <button 
                onClick={() => {
                  openShare('email', shareIdea);
                  setShareIdea(null);
                }}
                className="flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => {
                  copyLink(shareIdea);
                  setShareIdea(null);
                }}
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ideas;