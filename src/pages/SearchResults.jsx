import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { rssApi } from '../services/rssApi'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Searching for:', query)
        const response = await rssApi.searchArticles(query, currentPage)
        
        console.log('✅ Search results:', response.articles.length, 'articles found')
        setResults(response.articles)
        setPagination(response.pagination)
        
      } catch (err) {
        console.error('❌ Search error:', err)
        setError('Failed to search articles. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, currentPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Fashion Week': 'from-purple-400 to-indigo-500',
      'Luxury': 'from-amber-400 to-orange-500',
      'Streetwear': 'from-blue-400 to-indigo-500',
      'Sustainability': 'from-emerald-400 to-teal-500',
      'Technology': 'from-cyan-400 to-blue-500',
      'Style': 'from-rose-400 to-pink-500',
      'Global Fashion': 'from-violet-400 to-purple-500',
      'Business': 'from-gray-400 to-gray-600',
      'Vintage': 'from-yellow-400 to-amber-500'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Fashion Week': '🏃‍♀️',
      'Luxury': '💎',
      'Streetwear': '🏙️',
      'Sustainability': '🌱',
      'Technology': '🤖',
      'Style': '✨',
      'Global Fashion': '🌍',
      'Business': '💼',
      'Vintage': '📻'
    }
    return icons[category] || '👗'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Results for "{query}"
          </h1>
          <p className="text-xl text-gray-600">
            {loading ? 'Searching...' : error ? 'Search failed' : `Found ${results.length} results`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-rose-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Searching for "{query}"...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Query */}
        {!loading && !query.trim() && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h3>
            <p className="text-gray-600 mb-8">Enter a search term to find fashion articles and trends</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
            <p className="text-gray-600 mb-8">Try searching for different terms like "luxury", "streetwear", or "sustainable fashion"</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['luxury fashion', 'streetwear', 'sustainable fashion', 'fashion week', 'technology'].map(suggestion => (
                <Link
                  key={suggestion}
                  to={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-colors"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && results.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map(article => (
                <div key={article.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Article Image */}
                  <div className="h-48 overflow-hidden relative">
                    {article.imageUrl && !article.imageUrl.startsWith('linear-gradient') ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div 
                        className={`w-full h-full flex items-center justify-center text-white bg-gradient-to-br ${getCategoryColor(article.category)}`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{getCategoryIcon(article.category)}</div>
                          <div className="text-sm font-semibold">{article.category}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>By {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(article.publishedDate)}
                      </span>
                      <span className="text-xs text-gray-500">{article.source}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pagination.hasPrevPage
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-rose-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pagination.hasNextPage
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Popular Searches */}
        {!loading && (
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Popular Searches</h3>
              <p className="text-xl text-gray-600">Discover what others are looking for</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                'luxury fashion', 'streetwear', 'sustainable fashion', 'fashion week',
                'technology fashion', 'vintage style', 'global fashion', 'business fashion',
                'designer brands', 'fashion trends', 'style guide', 'fashion news'
              ].map(term => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-sm hover:shadow-md"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults