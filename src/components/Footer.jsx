import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full"></div>
              <span className="text-2xl font-bold">Très.Now</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Modern fashion platform combining style analysis with trend discovery 
              to help you explore and define your unique aesthetic.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <div className="space-y-3">
              <Link to="/trends" className="block text-gray-400 hover:text-white transition-colors">Trend Analyzer</Link>
              <Link to="/style-ai" className="block text-gray-400 hover:text-white transition-colors">Très.AI</Link>
              <Link to="/collections" className="block text-gray-400 hover:text-white transition-colors">Très.Magazine</Link>
              <Link to="/inspo" className="block text-gray-400 hover:text-white transition-colors">Inspo</Link>
              <Link to="/favourites" className="block text-gray-400 hover:text-white transition-colors">Favourites</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Très.Now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer