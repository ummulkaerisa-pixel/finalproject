import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import shopstyleApi from '../services/shopstyleApi'

function TrendAnalyzer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const categories = ['all', 'luxury', 'streetwear', 'casual', 'seasonal']

  // Update URL when filter changes
  const handleFilterChange = (category) => {
    setActiveFilter(category)
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  // Fetch products when filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let result
        if (activeFilter === 'all') {
          result = await shopstyleApi.getTrendingProducts(24)
        } else {
          result = await shopstyleApi.getProductsByCategory(activeFilter)
        }
        setProducts(result.products)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeFilter])

  // Update filter when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all'
    setActiveFilter(categoryFromUrl)
  }, [searchParams])

  const getCategoryColor = (category) => {
    const colors = {
      'Dresses': 'from-rose-400 to-pink-500',
      'Sweaters': 'from-amber-400 to-orange-500',
      'Bags': 'from-purple-400 to-indigo-500',
      'Blazers': 'from-gray-400 to-gray-600',
      'Accessories': 'from-emerald-400 to-teal-500',
      'Shoes': 'from-blue-400 to-cyan-500',
      'Hoodies': 'from-purple-400 to-indigo-500',
      'Pants': 'from-slate-400 to-slate-600',
      'T-Shirts': 'from-emerald-400 to-teal-500',
      'Hats': 'from-amber-400 to-orange-500',
      'Jackets': 'from-gray-400 to-gray-600',
      'Jeans': 'from-blue-400 to-blue-600',
      'Shirts': 'from-cyan-400 to-blue-500',
      'Cardigans': 'from-rose-400 to-pink-500'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Dresses': '👗',
      'Sweaters': '🧥',
      'Bags': '👜',
      'Blazers': '🧥',
      'Accessories': '💍',
      'Shoes': '👠',
      'Hoodies': '👕',
      'Pants': '👖',
      'T-Shirts': '👕',
      'Hats': '🎩',
      'Jackets': '🧥',
      'Jeans': '👖',
      'Shirts': '👔',
      'Cardigans': '🧥'
    }
    return icons[category] || '👕'
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fashion <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Trends</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover curated fashion items from top brands
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 bg-white rounded-full p-2 shadow-lg flex-wrap justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-rose-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Loading fashion items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                {/* Product Image */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${getCategoryColor(product.category)} h-72 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-5xl mb-3">{getCategoryIcon(product.category)}</div>
                    <p className="text-white/90 font-medium text-sm px-4">{product.category}</p>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-gray-900">${product.price}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="text-xs text-rose-600 font-semibold mb-1 uppercase tracking-wide">{product.brand}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendAnalyzer