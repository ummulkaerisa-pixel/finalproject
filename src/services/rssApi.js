// RSS Feed API service - Production-ready NewsAPI implementation
// Optimized for fast loading with real data only

// Environment variables with fallbacks for development
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '1b132003e30d45b0bfcac300ab11af9f'
const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000
const MAX_ARTICLES = parseInt(import.meta.env.VITE_MAX_ARTICLES) || 30

console.log('🔧 API Configuration:', {
  hasApiKey: !!NEWS_API_KEY,
  baseUrl: NEWS_API_BASE_URL,
  timeout: API_TIMEOUT,
  maxArticles: MAX_ARTICLES
})

// Fashion sources for better content
const FASHION_SOURCES = 'vogue.com,harpersbazaar.com,elle.com,fashionista.com,wwd.com,refinery29.com,whowhatwear.com,glamour.com,marieclaire.com,instyle.com'

// Fashion keywords for relevant content
const FASHION_KEYWORDS = 'fashion OR style OR designer OR runway OR luxury OR streetwear OR trends'

// HTTP client with timeout and error handling
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  
  try {
    console.log(`🌐 Fetching: ${url}`)
    
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
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log(`✅ API Response received:`, { status: data.status, totalResults: data.totalResults })
    return data
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Please check your internet connection')
    }
    
    console.error('❌ API Request failed:', error.message)
    throw error
  }
}

// Fast category detection
const getCategory = (text) => {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('fashion week') || lowerText.includes('runway')) return 'Fashion Week'
  if (lowerText.includes('luxury') || lowerText.includes('designer') || lowerText.includes('haute couture')) return 'Luxury'
  if (lowerText.includes('streetwear') || lowerText.includes('street style') || lowerText.includes('urban')) return 'Streetwear'
  if (lowerText.includes('sustainable') || lowerText.includes('eco') || lowerText.includes('ethical')) return 'Sustainability'
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('digital')) return 'Technology'
  if (lowerText.includes('vintage') || lowerText.includes('retro') || lowerText.includes('classic')) return 'Vintage'
  if (lowerText.includes('business') || lowerText.includes('market') || lowerText.includes('industry')) return 'Business'
  if (lowerText.includes('global') || lowerText.includes('international') || lowerText.includes('korean')) return 'Global Fashion'
  
  return 'Style'
}

// Calculate read time
const getReadTime = (content) => {
  if (!content) return '3 min read'
  const words = content.split(' ').length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

// Extract fashion tags
const getTags = (title, description) => {
  const terms = ['fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 'designer', 'runway', 'vintage', 'tech']
  const text = `${title} ${description}`.toLowerCase()
  return terms.filter(term => text.includes(term)).slice(0, 4)
}

// Clean text content
const cleanText = (text) => {
  if (!text) return ''
  return text.replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim()
}

// Process articles for consistent format
const processArticles = (articles) => {
  if (!Array.isArray(articles)) {
    console.warn('⚠️ Articles is not an array:', articles)
    return []
  }
  
  return articles
    .filter(article => {
      // Filter out invalid articles
      const isValid = article && 
                     article.title && 
                     article.description && 
                     article.publishedAt &&
                     article.source?.name &&
                     !article.title.includes('[Removed]') &&
                     !article.title.toLowerCase().includes('removed')
      
      if (!isValid) {
        console.log('🗑️ Filtered out invalid article:', article?.title || 'No title')
      }
      
      return isValid
    })
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
        category: getCategory(`${cleanTitle} ${cleanDescription}`),
        imageUrl: article.urlToImage || null,
        readTime: getReadTime(cleanContent),
        tags: getTags(cleanTitle, cleanDescription),
        link: article.url
      }
    })
}

// Main API service
export const rssApi = {
  // Get all fashion articles
  async getAllArticles() {
    try {
      console.log('🚀 Starting to fetch fashion articles...')
      
      if (!NEWS_API_KEY) {
        throw new Error('NewsAPI key is missing. Please check your environment variables.')
      }
      
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
        throw new Error(`NewsAPI Error: ${data.message || 'Unknown error'}`)
      }
      
      if (!data.articles || data.articles.length === 0) {
        throw new Error('No fashion articles found. The API returned empty results.')
      }
      
      console.log(`📰 Raw articles received: ${data.articles.length}`)
      
      const processedArticles = processArticles(data.articles)
      
      if (processedArticles.length === 0) {
        throw new Error('No valid articles after processing. All articles were filtered out.')
      }
      
      // Sort by publication date (newest first)
      const sortedArticles = processedArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      console.log(`✅ Successfully processed ${sortedArticles.length} fashion articles`)
      
      return {
        articles: sortedArticles,
        total: sortedArticles.length,
        lastUpdated: new Date().toISOString(),
        source: 'NewsAPI'
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error.message)
      
      // Re-throw the error so the UI can handle it properly
      throw new Error(`Failed to load fashion news: ${error.message}`)
    }
  },

  // Get articles by category
  async getArticlesByCategory(category) {
    try {
      console.log(`📂 Fetching articles for category: ${category}`)
      
      // Get all articles first, then filter
      const allArticlesResponse = await this.getAllArticles()
      
      const filteredArticles = allArticlesResponse.articles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
      
      console.log(`✅ Found ${filteredArticles.length} articles for category: ${category}`)
      
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

  // Get featured articles
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

  // Search articles
  async searchArticles(query) {
    try {
      console.log(`🔍 Searching for: "${query}"`)
      
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters long')
      }
      
      if (!NEWS_API_KEY) {
        throw new Error('NewsAPI key is missing. Please check your environment variables.')
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
        throw new Error(`NewsAPI Error: ${data.message || 'Unknown error'}`)
      }
      
      const processedArticles = processArticles(data.articles || [])
      
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

  // Get article by ID
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

  // Get articles by source
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