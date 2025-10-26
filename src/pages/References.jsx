import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, FileText, Link as LinkIcon, Download, Bookmark } from 'lucide-react'

const References = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'data-structures', name: 'Data Structures' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'system-design', name: 'System Design' },
    { id: 'interviews', name: 'Interview Prep' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Introduction to Algorithms (CLRS)',
      description: 'Comprehensive textbook covering fundamental algorithms and data structures.',
      category: 'algorithms',
      type: 'Book',
      author: 'Cormen, Leiserson, Rivest, Stein',
      year: '2022',
      link: '#'
    },
    {
      id: 2,
      title: 'Algorithm Design Manual',
      description: 'Practical guide to algorithm design and analysis with real-world examples.',
      category: 'algorithms',
      type: 'Book',
      author: 'Steven Skiena',
      year: '2020',
      link: '#'
    },
    {
      id: 3,
      title: 'Data Structures and Algorithms in JavaScript',
      description: 'Comprehensive guide to implementing data structures and algorithms using JavaScript.',
      category: 'data-structures',
      type: 'Online Course',
      author: 'Educative',
      year: '2023',
      link: '#'
    },
    {
      id: 4,
      title: 'Big O Cheat Sheet',
      description: 'Quick reference for time and space complexity of common algorithms.',
      category: 'algorithms',
      type: 'Cheat Sheet',
      author: 'Bigocheatsheet.com',
      year: '2023',
      link: '#'
    },
    {
      id: 5,
      title: 'System Design Primer',
      description: 'Learn how to design large-scale systems for technical interviews.',
      category: 'system-design',
      type: 'GitHub Repo',
      author: ' Donne Martin',
      year: '2023',
      link: '#'
    },
    {
      id: 6,
      title: 'Cracking the Coding Interview',
      description: '189 programming interview questions with solutions and strategies.',
      category: 'interviews',
      type: 'Book',
      author: 'Gayle Laakmann McDowell',
      year: '2020',
      link: '#'
    },
    {
      id: 7,
      title: 'Discrete Mathematics',
      description: 'Essential mathematical concepts for computer science and algorithms.',
      category: 'mathematics',
      type: 'Course',
      author: 'MIT OpenCourseWare',
      year: '2023',
      link: '#'
    },
    {
      id: 8,
      title: 'Design Patterns',
      description: 'Classic software design patterns with examples and use cases.',
      category: 'system-design',
      type: 'Book',
      author: 'Gang of Four',
      year: '2020',
      link: '#'
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Reference Library
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Comprehensive collection of books, courses, and resources to support your learning 
          journey in algorithms, data structures, and computer science.
        </motion.p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {resource.type}
                </div>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Bookmark size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  by {resource.author}
                </div>
                <div className="text-sm text-gray-500">
                  {resource.year}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {categories.find(cat => cat.id === resource.category)?.name}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <LinkIcon size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default References