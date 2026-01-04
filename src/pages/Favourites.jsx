import { useState, useEffect } from 'react'

// Favourites management
const getFavourites = () => {
  const saved = localStorage.getItem('tres-favourites')
  return saved ? JSON.parse(saved) : []
}

const saveFavourites = (favourites) => {
  localStorage.setItem('tres-favourites', JSON.stringify(favourites))
}

const removeFavourite = (articleId) => {
  const favourites = getFavourites()
  const updated = favourites.filter(fav => fav.id !== articleId)
  saveFavourites(updated)
  return updated
}

function Favourites() {
  const [favouriteArticles, setFavouriteArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load favourites from localStorage
    const favourites = getFavourites()
    setFavouriteArticles(favourites)
    setLoading(false)
  }, [])

  const handleRemoveFavourite = (articleId) => {
    const updated = removeFavourite(articleId)
    setFavouriteArticles(updated)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            My <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Favourites</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your saved fashion articles and stories
          </p>
        </div>

        {/* Favourites Count */}
        {favouriteArticles.length > 0 && (
          <div className="text-center mb-8">
            <span className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
              {favouriteArticles.length} {favouriteArticles.length === 1 ? 'Article' : 'Articles'} Saved
            </span>
          </div>
        )}

        {/* Favourites Grid */}
        {favouriteArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favouriteArticles.map(article => (
              <article key={article.id} className="group">
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

                    {/* Remove Favourite Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleRemoveFavourite(article.id)}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                        title="Remove from favourites"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                      
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors"
                      >
                        Read Article
                      </a>
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
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-6">💖</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No favourites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start exploring fashion articles and click the heart icon to save your favourites here.
            </p>
            <a
              href="/collections"
              className="inline-flex items-center bg-rose-500 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              Explore Articles
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}

        {/* Back to Magazine */}
        {favouriteArticles.length > 0 && (
          <div className="text-center mt-16">
            <a
              href="/collections"
              className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Très.Magazine
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourites