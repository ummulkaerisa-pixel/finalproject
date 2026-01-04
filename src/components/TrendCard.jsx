import { Link } from 'react-router-dom'

function TrendCard({ trend }) {
  const getCategoryColor = (category) => {
    const colors = {
      'Luxury': 'from-amber-400 to-orange-500',
      'Streetwear': 'from-purple-400 to-indigo-500',
      'Casual': 'from-emerald-400 to-teal-500',
      'Seasonal': 'from-rose-400 to-pink-500'
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Luxury': '💎',
      'Streetwear': '🏙️',
      'Casual': '👕',
      'Seasonal': '🌸'
    }
    return icons[category] || '👗'
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">{getCategoryIcon(trend.category)}</div>
            <p className="text-gray-700 font-semibold">{trend.title}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${getCategoryColor(trend.category)} text-white text-xs font-semibold rounded-full`}>
          {trend.category}
        </div>

        {/* Confidence Score */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-bold text-gray-900">{trend.confidence}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
          {trend.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {trend.description}
        </p>
        
        {/* Trend Strength Indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Trend Strength</span>
            <span className="text-sm text-gray-500">{trend.confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(trend.category)}`}
              style={{ width: `${trend.confidence}%` }}
            ></div>
          </div>
        </div>

        <Link
          to={`/trends/${trend.category.toLowerCase()}`}
          className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700 transition-colors"
        >
          Explore Trend
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default TrendCard