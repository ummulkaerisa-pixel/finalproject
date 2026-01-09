import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Collections from './pages/Collections'
import StyleAI from './pages/StyleAI'
import FashionCalendar from './pages/FashionCalendar'
import StyleMoodBoard from './pages/StyleMoodBoard'
import About from './pages/About'
import Favourites from './pages/Favourites'
import SearchResults from './pages/SearchResults'
import TrendDetail from './pages/TrendDetail'
import Inspo from './pages/Inspo'
import TrendAnalyzer from './pages/TrendAnalyzer'
import Footer from './components/Footer'

// 404 Not Found Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
          Go Home
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/style-ai" element={<StyleAI />} />
          <Route path="/fashion-calendar" element={<FashionCalendar />} />
          <Route path="/style-mood-board" element={<StyleMoodBoard />} />
          <Route path="/about" element={<About />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/trends/:category" element={<TrendDetail />} />
          <Route path="/inspo" element={<Inspo />} />
          <Route path="/trend-analyzer" element={<TrendAnalyzer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App