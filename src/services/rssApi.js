// RSS Feed API service - Optimized NewsAPI implementation for production
// Fast, reliable fashion news with no fallback data

// Environment variables
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 8000
const MAX_ARTICLES = parseInt(import.meta.env.VITE_MAX_ARTICLES) || 50

// Validate API key
if (!NEWS_API_KEY) {
  throw new Error('NewsAPI key is required. Please check your .env file.')
}

// Fashion-focused sources for better performance
const FASHION_SOURCES = [
  'vogue.com',
  'harpersbazaar.com', 
  'elle.com',
  'fashionista.com',
  'wwd.com',
  'refinery29.com',
  'whowhatwear.com',
  'glamour.com',
  'marieclaire.com',
  'instyle.com'
].join(',')

// Optimized fashion keywords
const FASHION_KEYWORDS = [
  'fashion',
  'style', 
  'designer',
  'runway',
  'luxury',
  'streetwear',
  'trends'
].join(' OR ')

// Fast HTTP client with timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond')
    }
    throw error
  }
}

// Category mapping for fast categorization
const getCategoryFromText = (text) => {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('fashion week') || lowerText.includes('runway')) return 'Fashion Week'
  if (lowerText.includes('luxury') || lowerText.includes('designer')) return 'Luxury'
  if (lowerText.includes('streetwear') || lowerText.includes('street style')) return 'Streetwear'
  if (lowerText.includes('sustainable') || lowerText.includes('eco')) return 'Sustainability'
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('digital')) return 'Technology'
  if (lowerText.includes('vintage') || lowerText.includes('retro')) return 'Vintage'
  if (lowerText.includes('business') || lowerText.includes('market')) return 'Business'
  if (lowerText.includes('global') || lowerText.includes('international')) return 'Global Fashion'
  
  return 'Style'
}

// Fast read time calculation
const getReadTime = (content) => {
  if (!content) return '3 min read'
  const words = content.split(' ').length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

// Extract relevant tags quickly
const extractTags = (title, description) => {
  const fashionTerms = ['fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 'designer', 'runway', 'vintage', 'tech']
  const text = `${title} ${description}`.toLowerCase()
  return fashionTerms.filter(term => text.includes(term)).slice(0, 4)
}

// Clean content for better performance
const cleanText = (text) => {
  if (!text) return ''
  return text.replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim()
}

// Process articles efficiently
const processArticles = (articles) => {
  return articles
    .filter(article => 
      article.title && 
      article.description && 
      article.publishedAt &&
      article.source?.name &&
      !article.title.includes('[Removed]') &&
      !article.title.toLowerCase().includes('removed')
    )
    .map((article, index) => {
      const cleanTitle = cleanText(article.title)
      const cleanDescription = cleanText(article.description)
      const cleanContent = cleanText(article.content || article.description)
      
      return {
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        title: cleanTitle,
        description: cleanDescription.length > 200 ? cleanDescription.substring(0, 200) + '...' : cleanDescription,
        content: cleanContent,
        author: article.author || 'Fashion Editor',
        publishedDate: article.publishedAt,
        source: article.source.name,
        category: getCategoryFromText(`${cleanTitle} ${cleanDescription}`),
        imageUrl: article.urlToImage || null,
        readTime: getReadTime(cleanContent),
        tags: extractTags(cleanTitle, cleanDescription),
        link: article.url
      }
    })
}

// Main API functions
export const rssApi = {
  // Get all fashion articles - optimized for speed
  async getAllArticles() {
    try {
      console.log('🚀 Fetching fashion articles from NewsAPI...')
      
      const params = new URLSearchParams({
        q: FASHION_KEYWORDS,
        domains: FASHION_SOURCES,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: MAX_ARTICLES.toString(),
        apiKey: NEWS_API_KEY
      })
      
      const url = `${NEWS_API_BASE_URL}/everything?${params}`
      const data = await fetchWithTimeout(url)
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${data.message}`)
      }
      
      if (!data.articles || data.articles.length === 0) {
        throw new Error('No articles found')
      }
      
      const processedArticles = processArticles(data.articles)
      
      // Sort by publication date (newest first)
      const sortedArticles = processedArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      console.log(`✅ Successfully loaded ${sortedArticles.length} fashion articles`)
      
      return {
        articles: sortedArticles,
        total: sortedArticles.length,
        lastUpdated: new Date().toISOString(),
        source: 'NewsAPI'
      }
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error.message)
      throw new Error(`Failed to load fashion news: ${error.message}`)
    }
  },

  // Get articles by category - fast filtering
  async getArticlesByCategory(category) {
    try {
      console.log(`📂 Fetching ${category} articles...`)
      
      // Use category-specific search terms for better results
      const categoryKeywords = {
        'Fashion Week': 'fashion week runway show',
        'Luxury': 'luxury designer haute couture',
        'Streetwear': 'streetwear urban fashion',
        'Sustainability': 'sustainable fashion eco ethical',
        'Technology': 'fashion tech AI digital',
        'Style': 'style outfit fashion',
        'Global Fashion': 'international fashion global',
        'Business': 'fashion business industry market',
        'Vintage': 'vintage retro fashion'
      }
      
      const searchTerm = categoryKeywords[category] || FASHION_KEYWORDS
      
      const params = new URLSearchParams({
        q: searchTerm,
        domains: FASHION_SOURCES,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '30',
        apiKey: NEWS_API_KEY
      })
      
      const url = `${NEWS_API_BASE_URL}/everything?${params}`
      const data = await fetchWithTimeout(url)
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${data.message}`)
      }
      
      const processedArticles = processArticles(data.articles)
      
      // Filter by category and sort
      const filteredArticles = processedArticles
        .filter(article => article.category === category)
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
      
      console.log(`✅ Found ${filteredArticles.length} ${category} articles`)
      
      return {
        articles: filteredArticles,
        total: filteredArticles.length,
        category,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${category} articles:`, error.message)
      throw new Error(`Failed to load ${category} articles: ${error.message}`)
    }
  },

  // Get featured articles - top recent articles
  async getFeaturedArticles(limit = 6) {
    try {
      console.log(`⭐ Fetching ${limit} featured articles...`)
      
      const allArticlesResponse = await this.getAllArticles()
      const featured = allArticlesResponse.articles.slice(0, limit)
      
      return {
        articles: featured,
        total: featured.length,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Failed to fetch featured articles:', error.message)
      throw new Error(`Failed to load featured articles: ${error.message}`)
    }
  },

  // Search articles - optimized search
  async searchArticles(query) {
    try {
      console.log(`🔍 Searching for: "${query}"`)
      
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters')
      }
      
      const searchQuery = `${query} AND (${FASHION_KEYWORDS})`
      
      const params = new URLSearchParams({
        q: searchQuery,
        domains: FASHION_SOURCES,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: '25',
        apiKey: NEWS_API_KEY
      })
      
      const url = `${NEWS_API_BASE_URL}/everything?${params}`
      const data = await fetchWithTimeout(url)
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${data.message}`)
      }
      
      const processedArticles = processArticles(data.articles)
      
      console.log(`🎯 Found ${processedArticles.length} results for "${query}"`)
      
      return {
        articles: processedArticles,
        total: processedArticles.length,
        query,
        lastUpdated: new Date().toISOString(),
        source: 'NewsAPI Search'
      }
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error.message)
      throw new Error(`Search failed: ${error.message}`)
    }
  },

  // Get article by ID - fast lookup
  async getArticleById(id) {
    try {
      const allArticlesResponse = await this.getAllArticles()
      const article = allArticlesResponse.articles.find(article => article.id === id)
      
      if (!article) {
        throw new Error(`Article with ID ${id} not found`)
      }
      
      return article
    } catch (error) {
      console.error(`❌ Failed to fetch article ${id}:`, error.message)
      throw new Error(`Failed to fetch article: ${error.message}`)
    }
  },

  // Get articles by source - source filtering
  async getArticlesBySource(source) {
    try {
      const allArticlesResponse = await this.getAllArticles()
      const sourceArticles = allArticlesResponse.articles.filter(article => 
        article.source.toLowerCase().includes(source.toLowerCase())
      )
      
      return {
        articles: sourceArticles,
        total: sourceArticles.length,
        source,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error(`❌ Failed to fetch articles from ${source}:`, error.message)
      throw new Error(`Failed to fetch articles from ${source}: ${error.message}`)
    }
  }
}

export default rssApi