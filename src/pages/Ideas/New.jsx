import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { submitIdea } from '../../services/ideasService';
import { Lightbulb, X } from 'lucide-react';

const NewIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    references: [] // Initialize with an empty array for references
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to submit an idea.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const validateUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }

    // Validate references URLs
    const invalidUrls = formData.references.filter(ref => !validateUrl(ref.url));
    if (invalidUrls.length > 0) {
      setError('Please enter valid URLs for all references');
      setLoading(false);
      return;
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const ideaData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags,
      references: formData.references
    };

    const result = await submitIdea(ideaData, user.uid, user.displayName || user.email.split('@')[0]);
    
    if (result.success) {
      navigate('/ideas');
    } else {
      setError(result.error || 'Failed to submit idea');
    }

    setLoading(false);
  };

  const addTag = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag) && tag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...currentTags, tag.trim()].join(', ')
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      tags: updatedTags.join(', ')
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
              Submit New Idea
            </h1>
            <button
              onClick={() => navigate('/ideas')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a catchy title for your idea"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your idea in detail..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="Enter tags separated by commas (e.g., DSA, Education, Visualization)"
              />
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {trimmedTag}
                      <button
                        type="button"
                        onClick={() => removeTag(trimmedTag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* References section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <p className="text-xs text-gray-500 mb-3">Add external links related to your idea (GitHub, articles, research papers, etc.)</p>
              
              <div className="space-y-3">
                {formData.references.map((reference, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <select
                      value={reference.type}
                      onChange={(e) => {
                        const updatedReferences = [...formData.references];
                        updatedReferences[index] = { ...updatedReferences[index], type: e.target.value };
                        setFormData(prev => ({ ...prev, references: updatedReferences }));
                      }}
                      className="w-32"
                    >
                      <option value="github">GitHub</option>
                      <option value="article">Article</option>
                      <option value="research-paper">Research Paper</option>
                      <option value="other">Other</option>
                    </select>
                    
                    <input
                      type="url"
                      value={reference.url}
                      onChange={(e) => {
                        const updatedReferences = [...formData.references];
                        updatedReferences[index] = { ...updatedReferences[index], url: e.target.value };
                        setFormData(prev => ({ ...prev, references: updatedReferences }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                    
                    <button
                      type="button"
                      onClick={() => {
                        const updatedReferences = formData.references.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, references: updatedReferences }));
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {formData.references.length < 10 && (
                <button
                  type="button"
                  onClick={() => {
                    if (formData.references.length < 10) {
                      setFormData(prev => ({
                        ...prev,
                        references: [...prev.references, { type: 'github', url: '' }]
                      }));
                    }
                  }}
                  className="mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  + Add Reference
                </button>
              )}
              
              {formData.references.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">{formData.references.length}/10 references added</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Idea'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/ideas')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewIdea;