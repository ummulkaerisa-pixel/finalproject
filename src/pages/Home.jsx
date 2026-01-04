import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import { shopstyleApi } from '../services/shopstyleApi'

function Home() {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'all', label: 'All Trends', icon: '✨' },
    { id: 'luxury', label: 'Luxury', icon: '💎' },
    { id: 'streetwear', label: 'Streetwear', icon: '🔥' },
    { id: 'casual', label: 'Casual', icon: '👕' },
    { id: 'seasonal', label: 'Seasonal', icon: '🌸' }
  ]

  useEffect(() => {
    fetchTrendingProducts()
  }, [selectedCategory])

  const fetchTrendingProducts = async () => {
    setLoading(true)
    try {
      let result
      if (selectedCategory === 'all') {
        result = await shopstyleApi.getTrendingProducts(8)
      } else {
        result = await shopstyleApi.getProductsByCategory(selectedCategory)
      }
      setTrendingProducts(result.products.slice(0, 8))
    } catch (error) {
      console.error('Error fetching trending products:', error)
      setTrendingProducts([])
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Products Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Fashion</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the latest fashion trends curated from top brands and designers
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="aspect-w-3 aspect-h-4 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop&random=${product.id}`
                      }}
                    />
                    {product.salePrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">${product.salePrice}</span>
                            <span className="text-sm text-gray-500 line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        )}
                      </div>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {trendingProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Fashion with <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Très.Now</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your ultimate destination for fashion news and AI-powered style analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Très.Magazine Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Très.Magazine</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Stay updated with the latest fashion news from top publications like Vogue, Elle, and Harper's Bazaar. Get daily updates on trends, designers, and industry insights.
                </p>
                <Link
                  to="/collections"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Read Magazine
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Très.AI Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Très.AI</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Upload your outfit photos and get AI-powered style analysis. Discover your fashion category, get confidence scores, and receive personalized style insights.
                </p>
                <Link
                  to="/style-ai"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Try AI Analysis
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Fashion Intelligence at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Très.Now combines the latest fashion journalism with cutting-edge AI technology to give you a complete fashion experience. Whether you're looking for industry news or personal style insights, we've got you covered.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Get the latest fashion news as it happens from top publications worldwide.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Advanced computer vision technology analyzes your style with precision and accuracy.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Experience</h3>
              <p className="text-gray-600">Tailored content and insights that match your unique fashion interests and style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore Fashion?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your fashion journey with Très.Now today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collections"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Magazine
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
            <Link
              to="/style-ai"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Try Style AI
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home