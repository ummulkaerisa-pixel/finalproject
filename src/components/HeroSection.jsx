import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-600/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20">
            ✨ AI-Powered Fashion Intelligence
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Decode Fashion
          <span className="block bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
            Trends with AI
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover emerging trends, analyze style patterns, and stay ahead of the fashion curve 
          with our advanced AI-powered trend analyzer.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/trends"
            className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Explore Trends</span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </Link>
          
          <Link
            to="/style-ai"
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
          >
            Try Très.AI
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">AI</div>
            <div className="text-gray-300 text-sm">Powered Analysis</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">Smart</div>
            <div className="text-gray-300 text-sm">Style Recognition</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">Real-time</div>
            <div className="text-gray-300 text-sm">Trend Updates</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection