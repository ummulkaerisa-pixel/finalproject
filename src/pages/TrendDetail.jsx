import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import shopstyleApi from '../services/shopstyleApi'

function TrendDetail() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const trendData = {
      luxury: {
        id: 1,
        title: 'Sustainable Luxury Materials',
        description: 'High-end brands embrace eco-friendly materials without compromising elegance. This trend focuses on premium sustainable fabrics, ethical production, and timeless designs that last.',
        image: '',
        confidence: 94,
        growth: '+15%',
        keywords: ['sustainable', 'luxury', 'eco-friendly', 'premium'],
        products: [
          {
            id: 1,
            name: 'Organic Silk Blouse',
            price: 289,
            image: '',
            brand: 'Sustainable Luxe',
            description: 'Ethically sourced silk with modern tailoring'
          },
          {
            id: 2,
            name: 'Recycled Cashmere Sweater',
            price: 345,
            image: '',
            brand: 'Eco Elegance',
            description: 'Luxuriously soft recycled cashmere'
          },
          {
            id: 3,
            name: 'Sustainable Wool Coat',
            price: 567,
            image: '',
            brand: 'Green Luxury',
            description: 'Responsibly sourced wool with timeless design'
          },
          {
            id: 4,
            name: 'Eco-Leather Handbag',
            price: 234,
            image: '',
            brand: 'Vegan Luxe',
            description: 'Plant-based leather alternative'
          },
          {
            id: 5,
            name: 'Organic Cotton Dress',
            price: 198,
            image: '',
            brand: 'Pure Fashion',
            description: 'GOTS certified organic cotton'
          },
          {
            id: 6,
            name: 'Bamboo Fiber Scarf',
            price: 89,
            image: '',
            brand: 'Eco Accessories',
            description: 'Silky smooth bamboo fiber blend'
          }
        ]
      },
      streetwear: {
        id: 2,
        title: 'Oversized Blazer Revival',
        description: 'Bold, structured blazers dominate street style across major fashion capitals. This trend combines comfort with sharp tailoring for an effortlessly cool look.',
        image: '',
        confidence: 89,
        growth: '+22%',
        keywords: ['blazer', 'oversized', 'street style', 'structured'],
        products: [
          {
            id: 7,
            name: 'Oversized Plaid Blazer',
            price: 156,
            image: '',
            brand: 'Street Elite',
            description: 'Bold plaid pattern with relaxed fit'
          },
          {
            id: 8,
            name: 'Cropped Denim Jacket',
            price: 89,
            image: '',
            brand: 'Urban Edge',
            description: 'Distressed denim with modern cut'
          },
          {
            id: 9,
            name: 'Graphic Hoodie',
            price: 67,
            image: '',
            brand: 'Street Art Co',
            description: 'Bold graphics meet comfort'
          },
          {
            id: 10,
            name: 'Wide-Leg Cargo Pants',
            price: 123,
            image: '',
            brand: 'Urban Utility',
            description: 'Functional pockets with street style'
          },
          {
            id: 11,
            name: 'Chunky Platform Sneakers',
            price: 178,
            image: '',
            brand: 'Street Kicks',
            description: 'Bold silhouette with comfort tech'
          },
          {
            id: 12,
            name: 'Bucket Hat',
            price: 34,
            image: '',
            brand: 'Street Accessories',
            description: 'Classic bucket hat with modern twist'
          }
        ]
      },
      casual: {
        id: 3,
        title: 'Minimalist Athleisure',
        description: 'Clean lines and neutral tones define the new wave of athletic wear. Comfort meets style in this effortless trend.',
        image: '',
        confidence: 91,
        growth: '+18%',
        keywords: ['athleisure', 'minimalist', 'neutral', 'comfort'],
        products: [
          {
            id: 13,
            name: 'Seamless Sports Bra',
            price: 45,
            image: '',
            brand: 'Active Minimal',
            description: 'Ultra-soft seamless construction'
          },
          {
            id: 14,
            name: 'High-Waisted Leggings',
            price: 67,
            image: '',
            brand: 'Flex Wear',
            description: 'Buttery soft with compression support'
          },
          {
            id: 15,
            name: 'Oversized Sweatshirt',
            price: 89,
            image: '',
            brand: 'Cozy Casual',
            description: 'Relaxed fit in organic cotton'
          },
          {
            id: 16,
            name: 'Minimalist Sneakers',
            price: 134,
            image: '',
            brand: 'Clean Kicks',
            description: 'All-white design with premium materials'
          }
        ]
      }
    }

  const trend = trendData[category] || trendData.luxury

  // Fetch products from ShopStyle API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await shopstyleApi.getProductsByCategory(category || 'luxury')
        setProducts(result.products)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  const getCategoryColor = (category) => {
    const colors = {
      'luxury': 'from-amber-400 to-orange-500',
      'streetwear': 'from-purple-400 to-indigo-500',
      'casual': 'from-emerald-400 to-teal-500',
      'seasonal': 'from-rose-400 to-pink-500'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'luxury': '💎',
      'streetwear': '🏙️',
      'casual': '👕',
      'seasonal': '🌸'
    }
    return icons[category] || '👗'
  }

  if (!trend) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trend Not Found</h2>
          <Link to="/trends" className="text-rose-600 hover:text-rose-700">
            ← Back to Trends
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/trends"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Trends
        </Link>

        {/* Trend Header */}
        <div className={`relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-r ${getCategoryColor(category)} h-96`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">{getCategoryIcon(category)}</div>
              <div className={`inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-4 uppercase tracking-wide`}>
                {category}
              </div>
              <h1 className="text-5xl font-bold mb-4">{trend.title}</h1>
              <p className="text-xl text-gray-200 mb-6 leading-relaxed max-w-3xl">{trend.description}</p>
              
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{trend.confidence}%</div>
                  <div className="text-sm text-gray-300">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{trend.growth}</div>
                  <div className="text-sm text-gray-300">Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Trend Keywords</h3>
          <div className="flex flex-wrap gap-3">
            {trend.keywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Shop This Trend</h2>
            <span className="text-gray-600">{products.length} items</span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to load products</h3>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`relative overflow-hidden bg-gradient-to-br ${getCategoryColor(category)} h-80 flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-6xl mb-2">{getCategoryIcon(product.category || category)}</div>
                      <p className="text-white font-medium">{product.name}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-900">${product.price}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-rose-600 font-semibold mb-2">{product.brand}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Products */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">Check back later for new items</p>
            </div>
          )}
        </div>

        {/* Related Trends */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Related Trends</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {['luxury', 'streetwear', 'casual'].filter(cat => cat !== category).map(relatedCategory => (
              <Link 
                key={relatedCategory}
                to={`/trends/${relatedCategory}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(relatedCategory)} rounded-xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center text-2xl`}>
                  {getCategoryIcon(relatedCategory)}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 capitalize">{relatedCategory}</h4>
                <p className="text-gray-600">Discover {relatedCategory} trends</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendDetail