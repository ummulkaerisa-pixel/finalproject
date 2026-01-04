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
import Footer from './components/Footer'

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
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App