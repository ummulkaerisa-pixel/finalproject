import { useState, useEffect, useCallback } from 'react'
import { rssApi } from '../services/rssApi'

// Favourites management
const getFavourites = () => {
  const saved = localStorage.getItem('tres-favourites')
  return saved ? JSON.parse(saved) : []
}

const saveFavourites = (favourites) => {
  localStorage.setItem('tres-favourites', JSON.stringify(favourites))
}

const toggleFavourite = (article) => {
  const favourites = getFavourites()
  const isAlreadyFavourite = favourites.some(fav => fav.id === article.id)
  
  if (isAlreadyFavourite) {
    const updated = favourites.filter(fav => fav.id !== article.id)
    saveFavourites(updated)
    return false
  } else {
    const updated = [...favourites, article]
    saveFavourites(updated)
    return true
  }
}

const isFavourite = (articleId) => {
  const favourites = getFavourites()
  return favourites.some(fav => fav.id === articleId)
}

// Article Modal Component
const ArticleModal = ({ article, isOpen, onClose, onToggleFavourite }) => {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (article && isOpen) {
      // Use a timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setIsFav(isFavourite(article.id))
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [article, isOpen])

  if (!isOpen || !article) return null

  const handleToggleFavourite = () => {
    const newFavStatus = toggleFavourite(article)
    setIsFav(newFavStatus)
    if (onToggleFavourite) onToggleFavourite()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">{article.source}</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Favourite Button */}
            <button
              onClick={handleToggleFavourite}
              className={`p-2 rounded-full transition-all duration-300 ${
                isFav 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={isFav ? 'Remove from favourites' : 'Add to favourites'}
            >
              <svg className="w-6 h-6" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Article Image */}
          {article.imageUrl && !article.imageUrl.startsWith('linear-gradient') && (
            <div className="w-full h-64 overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {/* Article Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-700">By {article.author}</span>
                <span className="text-gray-500">•</span>
                <span className="text-lg text-gray-500">{article.readTime}</span>
              </div>
              <span className="text-base text-gray-500">
                {new Date(article.publishedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Article Content */}
            <div className="prose prose-xl max-w-none">
              <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
                {article.description}
              </p>
              
              <div className="text-lg text-gray-800 leading-relaxed space-y-6">
                {article.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 text-lg leading-8">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-gray-200">
              {article.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-base">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Read Original Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-rose-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-600 transition-colors"
              >
                Read Original Article
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Collections() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = ['All', 'Fashion Week', 'Luxury', 'Streetwear', 'Sustainability', 'Technology', 'Style', 'Global Fashion', 'Business', 'Vintage']

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (selectedCategory === 'All') {
        response = await rssApi.getAllArticles()
      } else {
        response = await rssApi.getArticlesByCategory(selectedCategory)
      }
      
      setArticles(response.articles)
    } catch (err) {
      setError('Failed to load articles. Please try again.')
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (!searchQuery) {
      fetchArticles()
    }
  }, [fetchArticles, searchQuery])

  const handleFavouriteUpdate = () => {
    // Trigger re-render for favourite updates
  }

  const toggleArticleFavourite = (article, event) => {
    event.stopPropagation() // Prevent opening modal when clicking heart
    toggleFavourite(article)
    // Force re-render by updating a dummy state or use a callback
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setError(null)
      
      const response = await rssApi.searchArticles(searchQuery)
      setArticles(response.articles)
      setSelectedCategory('All') // Reset category when searching
    } catch (err) {
      setError('Failed to search articles. Please try again.')
      console.error('Error searching articles:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    fetchArticles()
  }

  const openArticleModal = (article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const closeArticleModal = () => {
    setSelectedArticle(null)
    setIsModalOpen(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Très<span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">.Magazine</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Latest fashion news, trends, and insights from leading publications worldwide
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fashion news, trends, designers..."
                className="w-full px-6 py-4 pr-32 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Category Filter */}
          {!searchQuery && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-gray-600">
                {loading || isSearching ? 'Searching...' : `Found ${articles.length} results for "${searchQuery}"`}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {(loading || isSearching) && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={searchQuery ? () => handleSearch({ preventDefault: () => {} }) : fetchArticles}
              className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && !isSearching && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <article key={article.id} className="group cursor-pointer">
                {/* Article Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
                        className="w-full h-full flex items-center justify-center text-white"
                        style={{ background: article.imageUrl || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      >
                        <div className="text-center">
                          <div className="text-sm font-semibold mb-1">{article.source}</div>
                          <div className="text-xs opacity-90">{article.category}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>

                    {/* Favourite Heart Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => toggleArticleFavourite(article, e)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                          isFavourite(article.id)
                            ? 'text-red-500 bg-white/90 hover:bg-white' 
                            : 'text-white hover:text-red-500 bg-black/20 hover:bg-white/90'
                        }`}
                        title={isFavourite(article.id) ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <svg className="w-5 h-5" fill={isFavourite(article.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>By {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(article.publishedDate)}
                      </span>
                      
                      <button 
                        onClick={() => openArticleModal(article)}
                        className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors"
                      >
                        Read Article
                      </button>
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
              </article>
            ))}
          </div>
        )}

        {/* No Articles Found */}
        {!loading && !error && !isSearching && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No articles found for "${searchQuery}"` : `No articles found for "${selectedCategory}"`}
            </p>
            <button 
              onClick={searchQuery ? clearSearch : () => setSelectedCategory('All')}
              className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
            >
              {searchQuery ? 'Clear Search' : 'View All Articles'}
            </button>
          </div>
        )}
      </div>

      {/* Article Modal */}
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={closeArticleModal}
        onToggleFavourite={handleFavouriteUpdate}
      />
    </div>
  )
}

export default Collections