import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Tag, Calendar, Clock } from 'lucide-react';
import { getPublishedBlogsListener, searchBlogs } from '../../services/blogsService';
import { trackEvent } from '../../lib/analytics';
import usePageMeta from '../../hooks/usePageMeta';
import Loader from '../../components/Common/Loader';

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allBlogs, setAllBlogs] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set page metadata for SEO
  usePageMeta({
    title: 'AlgoView Blog - Learn Algorithms & Web Development',
    description: 'Read in-depth tutorials on DSA algorithms, web development, and programming. Interactive guides with real-world examples.',
    keywords: 'blog, algorithms, DSA tutorial, web development, programming tips, coding guide',
    ogImage: '/og-blog.png'
  });

  useEffect(() => {
    // Set up real-time listener for published blogs
    const unsubscribe = getPublishedBlogsListener(
      (blogs) => {
        console.log('✅ Blogs loaded:', blogs.length, 'blogs');
        setAllBlogs(blogs);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('❌ Error fetching blogs:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Track blog page visit
    trackEvent('blog_page_viewed', {
      category: selectedCategory,
      tag: selectedTag,
      view: 'list'
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters(allBlogs, selectedCategory, selectedTag, searchQuery);
  }, [selectedCategory, selectedTag, searchQuery, allBlogs]);

  const applyFilters = async (blogs, category, tag, query) => {
    let filtered = blogs;

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(blog => blog.category === category);
    }

    // Apply tag filter
    if (tag) {
      filtered = filtered.filter(blog => blog.tags && blog.tags.includes(tag));
    }

    // Apply search
    if (query) {
      const searchResults = await searchBlogs(query);
      // Also apply category and tag filters to search results
      filtered = searchResults.filter(blog => {
        const matchesCategory = category === 'All' || blog.category === category;
        const matchesTag = !tag || (blog.tags && blog.tags.includes(tag));
        return matchesCategory && matchesTag;
      });
    }

    // Apply sorting
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt));
    }

    setDisplayedBlogs(filtered);
  };

  const categories = ['All', 'DSA', 'Web Development'];
  const allTags = [...new Set(allBlogs.flatMap(blog => blog.tags || []))].sort();

  const handleBlogClick = (slug) => {
    trackEvent('blog_post_clicked', {
      slug: slug,
      title: displayedBlogs.find(b => b.slug === slug)?.title
    });
    navigate(`/blog/${slug}`);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    trackEvent('blog_tag_filtered', { tag });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Blogs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Check your browser console for more details.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">AlgoView Blog</h1>
          </div>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl">
            Master algorithms, data structures, and web development through interactive tutorials and in-depth guides.
          </p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute right-4 top-3 text-blue-200 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Category Filter */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedTag(null);
                        trackEvent('blog_category_selected', { category: cat });
                      }}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Filter */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Option */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    trackEvent('blog_sort_changed', { sortBy: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {displayedBlogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedBlogs.map(blog => (
                  <div
                    key={blog.id}
                    onClick={() => handleBlogClick(blog.slug)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden hover:border-l-4 hover:border-blue-600"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                            {blog.category}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {blog.readTime}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags && blog.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">{blog.authorEmail}</span>
                          <span>•</span>
                          <span>{blog.views || 0} views</span>
                        </div>
                        <span className="text-blue-600 font-semibold hover:text-blue-700">Read More →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination info */}
            {displayedBlogs.length > 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p>Showing {displayedBlogs.length} of {allBlogs.length} posts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 mt-16 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to Share Your Knowledge?</h2>
          <p className="text-gray-600 mb-6">
            Premium members can write blog posts to share insights with the community. Posts go live after admin verification.
          </p>
          <button
            onClick={() => {
              trackEvent('blog_write_button_clicked', {});
              navigate('/blog/write');
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Write a Blog Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
