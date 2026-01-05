import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Mock search data
  const searchData = {
    outfits: [
      {
        id: 1,
        title: 'Luxury Evening Gown',
        category: 'Luxury',
        type: 'outfit',
        description: 'Elegant silk evening dress with intricate beadwork',
        price: 1200,
        brand: 'Elite Couture',
        keywords: ['luxury', 'evening', 'formal', 'silk', 'elegant']
      },
      {
        id: 2,
        title: 'Luxury Cashmere Coat',
        category: 'Luxury',
        type: 'outfit',
        description: 'Premium cashmere overcoat with tailored fit',
        price: 890,
        brand: 'Luxury Essentials',
        keywords: ['luxury', 'cashmere', 'coat', 'winter', 'premium']
      },
      {
        id: 3,
        title: 'Designer Handbag Collection',
        category: 'Luxury',
        type: 'outfit',
        description: 'Handcrafted leather bags from renowned designers',
        price: 650,
        brand: 'Artisan Luxury',
        keywords: ['luxury', 'handbag', 'leather', 'designer', 'accessories']
      },
      {
        id: 4,
        title: 'Street Style Hoodie',
        category: 'Streetwear',
        type: 'outfit',
        description: 'Oversized hoodie with bold graphic prints',
        price: 89,
        brand: 'Urban Culture',
        keywords: ['streetwear', 'hoodie', 'casual', 'urban', 'graphic']
      },
      {
        id: 5,
        title: 'Minimalist White Shirt',
        category: 'Minimalist',
        type: 'outfit',
        description: 'Clean-cut white shirt with perfect tailoring',
        price: 120,
        brand: 'Simple Elegance',
        keywords: ['minimalist', 'white', 'shirt', 'clean', 'simple']
      },
      {
        id: 6,
        title: 'Casual Weekend Look',
        category: 'Casual',
        type: 'outfit',
        description: 'Comfortable jeans and t-shirt combination',
        price: 75,
        brand: 'Everyday Style',
        keywords: ['casual', 'weekend', 'jeans', 'comfortable', 'relaxed']
      }
    ],
    trends: [
      {
        id: 7,
        title: 'Sustainable Luxury Materials',
        category: 'Luxury',
        type: 'trend',
        description: 'Eco-friendly materials in high-end fashion',
        confidence: 94,
        growth: '+15%',
        keywords: ['luxury', 'sustainable', 'eco-friendly', 'materials', 'premium']
      },
      {
        id: 8,
        title: 'Oversized Blazer Revival',
        category: 'Streetwear',
        type: 'trend',
        description: 'Bold structured blazers in street fashion',
        confidence: 89,
        growth: '+22%',
        keywords: ['streetwear', 'blazer', 'oversized', 'structured', 'urban']
      }
    ]
  }

  useEffect(() => {
    const performSearch = () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      const allItems = [...searchData.outfits, ...searchData.trends]
      const searchResults = allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      )

      setResults(searchResults)
    }

    if (query.trim()) {
      // Use a timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setLoading(true)
        setTimeout(() => {
          performSearch()
          setLoading(false)
        }, 800)
      }, 0)
      
      return () => clearTimeout(timeoutId)
    } else {
      // Use timeout for consistency
      const timeoutId = setTimeout(() => {
        setResults([])
        setLoading(false)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [query, searchData.outfits, searchData.trends])

  const getCategoryColor = (category) => {
    const colors = {
      'Luxury': 'from-amber-400 to-orange-500',
      'Streetwear': 'from-purple-400 to-indigo-500',
      'Minimalist': 'from-gray-400 to-gray-600',
      'Casual': 'from-emerald-400 to-teal-500'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Luxury': '💎',
      'Streetwear': '🏙️',
      'Minimalist': '⚪',
      'Casual': '👕'
    }
    return icons[category] || '👗'
  }

  const filteredResults = filter === 'all' 
    ? results 
    : results.filter(item => item.type === filter)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Results for "{query}"
          </h1>
          <p className="text-xl text-gray-600">
            {loading ? 'Searching...' : `Found ${filteredResults.length} results`}
          </p>
        </div>

        {/* Filter Tabs */}
        {results.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-white rounded-full p-2 shadow-lg">
              {[
                { key: 'all', label: 'All Results', count: results.length },
                { key: 'outfit', label: 'Outfits', count: results.filter(r => r.type === 'outfit').length },
                { key: 'trend', label: 'Trends', count: results.filter(r => r.type === 'trend').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-rose-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Searching for "{query}"...</p>
          </div>
        )}

        {/* No Query */}
        {!loading && !query.trim() && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h3>
            <p className="text-gray-600 mb-8">Enter a search term to find outfits, trends, and style inspiration</p>
          </div>
        )}

        {/* No Results */}
        {!loading && query.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
            <p className="text-gray-600 mb-8">Try searching for different terms like "luxury", "streetwear", or "casual"</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['luxury outfits', 'streetwear', 'minimalist', 'casual wear', 'sustainable fashion'].map(suggestion => (
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
        {!loading && filteredResults.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map(item => (
              <div key={item.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Item Image/Icon */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${getCategoryColor(item.category)} h-64 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">{getCategoryIcon(item.category)}</div>
                    <p className="text-white font-medium">{item.title}</p>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">{item.category}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className={`text-xs font-bold ${
                      item.type === 'outfit' ? 'text-blue-700' : 'text-purple-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>

                  {item.type === 'outfit' ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{item.brand}</div>
                        <div className="text-2xl font-bold text-gray-900">${item.price}</div>
                      </div>
                      <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{item.confidence}%</div>
                          <div className="text-xs text-gray-500">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{item.growth}</div>
                          <div className="text-xs text-gray-500">Growth</div>
                        </div>
                      </div>
                      <Link
                        to={`/trends/${item.category.toLowerCase()}`}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Explore
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                'luxury outfits', 'streetwear fashion', 'minimalist style', 'casual wear',
                'sustainable fashion', 'evening dresses', 'designer bags', 'winter coats',
                'summer trends', 'vintage style', 'athleisure', 'formal wear'
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