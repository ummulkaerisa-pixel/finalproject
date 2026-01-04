// RSS Feed API service - Real NewsAPI implementation for fashion news
// Using NewsAPI with provided API key for daily updated fashion content

// NewsAPI configuration
const NEWS_API_KEY = '1b132003e30d45b0bfcac300ab11af9f'
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

// Fashion-focused domains and sources
const FASHION_DOMAINS = [
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
]

// Fashion keywords for filtering
const FASHION_KEYWORDS = [
  'fashion',
  'style',
  'designer',
  'runway',
  'fashion week',
  'luxury',
  'streetwear',
  'sustainable fashion',
  'fashion trends',
  'haute couture',
  'fashion industry',
  'fashion brand'
]

// Category mapping for articles
const categorizeArticle = (title, description, content) => {
  const text = `${title} ${description} ${content}`.toLowerCase()
  
  if (text.includes('fashion week') || text.includes('runway') || text.includes('show')) return 'Fashion Week'
  if (text.includes('luxury') || text.includes('designer') || text.includes('haute couture')) return 'Luxury'
  if (text.includes('streetwear') || text.includes('street style') || text.includes('urban')) return 'Streetwear'
  if (text.includes('sustainable') || text.includes('eco') || text.includes('ethical')) return 'Sustainability'
  if (text.includes('tech') || text.includes('ai') || text.includes('digital') || text.includes('virtual')) return 'Technology'
  if (text.includes('vintage') || text.includes('retro') || text.includes('classic')) return 'Vintage'
  if (text.includes('business') || text.includes('market') || text.includes('industry')) return 'Business'
  if (text.includes('korean') || text.includes('k-fashion') || text.includes('global')) return 'Global Fashion'
  
  return 'Style'
}

// Estimate read time based on content length
const estimateReadTime = (content) => {
  if (!content) return '3 min read'
  const wordsPerMinute = 200
  const wordCount = content.split(' ').length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Extract tags from content
const extractTags = (title, description) => {
  const commonFashionTerms = [
    'fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 
    'designer', 'runway', 'fashion week', 'vintage', 'minimalism', 
    'maximalism', 'tech', 'ai', 'digital', 'business', 'retail'
  ]
  
  const text = `${title} ${description}`.toLowerCase()
  const foundTags = commonFashionTerms.filter(term => text.includes(term))
  
  return foundTags.slice(0, 4)
}

// Clean and format content
const cleanContent = (text) => {
  if (!text) return ''
  return text.replace(/\[.*?\]/g, '').trim() // Remove [+chars] indicators
}

// Fetch fashion news from NewsAPI
const fetchFashionNews = async (query = 'fashion', pageSize = 20) => {
  try {
    console.log(`🔄 Fetching fashion news from NewsAPI...`)
    
    // Build query with fashion keywords
    const fashionQuery = `(${FASHION_KEYWORDS.join(' OR ')}) AND ${query}`
    
    const params = new URLSearchParams({
      q: fashionQuery,
      domains: FASHION_DOMAINS.join(','),
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString(),
      apiKey: NEWS_API_KEY
    })
    
    const response = await fetch(`${NEWS_API_BASE_URL}/everything?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`NewsAPI error: ${errorData.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message}`)
    }
    
    console.log(`✅ Successfully fetched ${data.articles?.length || 0} articles from NewsAPI`)
    
    // Process and filter articles
    const processedArticles = data.articles
      .filter(article => {
        // Filter out articles without essential data
        return article.title && 
               article.description && 
               article.publishedAt &&
               article.source?.name &&
               !article.title.includes('[Removed]')
      })
      .map((article, index) => {
        const category = categorizeArticle(article.title, article.description, article.content || '')
        const cleanDescription = cleanContent(article.description)
        const cleanContentText = cleanContent(article.content || article.description)
        
        return {
          id: Date.now() + index + Math.random() * 1000,
          title: article.title,
          description: cleanDescription.length > 200 ? 
            cleanDescription.substring(0, 200) + '...' : cleanDescription,
          content: cleanContentText,
          author: article.author || 'Fashion Editor',
          publishedDate: article.publishedAt,
          source: article.source.name,
          category,
          imageUrl: article.urlToImage || `https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&random=${index}`,
          readTime: estimateReadTime(cleanContentText),
          tags: extractTags(article.title, article.description),
          link: article.url
        }
      })
    
    console.log(`📰 Processed ${processedArticles.length} fashion articles`)
    return processedArticles
    
  } catch (error) {
    console.error('❌ Error fetching from NewsAPI:', error)
    throw error
  }
}

// Fetch top fashion headlines
const fetchFashionHeadlines = async (pageSize = 15) => {
  try {
    console.log(`🔄 Fetching fashion headlines from NewsAPI...`)
    
    const params = new URLSearchParams({
      q: 'fashion OR style OR designer',
      sources: 'vogue,elle,harpers-bazaar,glamour,marie-claire',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString(),
      apiKey: NEWS_API_KEY
    })
    
    const response = await fetch(`${NEWS_API_BASE_URL}/everything?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`NewsAPI error: ${errorData.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message}`)
    }
    
    console.log(`✅ Successfully fetched ${data.articles?.length || 0} headlines from NewsAPI`)
    
    // Process headlines
    const processedHeadlines = data.articles
      .filter(article => {
        return article.title && 
               article.description && 
               article.publishedAt &&
               !article.title.includes('[Removed]')
      })
      .map((article, index) => {
        const category = categorizeArticle(article.title, article.description, article.content || '')
        
        return {
          id: Date.now() + 1000 + index + Math.random() * 1000,
          title: article.title,
          description: cleanContent(article.description).substring(0, 200) + '...',
          content: cleanContent(article.content || article.description),
          author: article.author || 'Fashion Editor',
          publishedDate: article.publishedAt,
          source: article.source.name,
          category,
          imageUrl: article.urlToImage || `https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&random=${index}`,
          readTime: estimateReadTime(article.content || article.description),
          tags: extractTags(article.title, article.description),
          link: article.url
        }
      })
    
    return processedHeadlines
    
  } catch (error) {
    console.error('❌ Error fetching headlines from NewsAPI:', error)
    throw error
  }
}

// Fallback articles in case API fails
const FALLBACK_ARTICLES = [
  {
    id: 1,
    title: 'Spring 2025 Fashion Week: The Trends That Will Define Next Year',
    description: 'From sustainable luxury to bold streetwear, discover the key trends emerging from the latest fashion week shows across Paris, Milan, and New York.',
    content: 'Fashion Week Spring 2025 has concluded with remarkable shows that set the tone for next year\'s trends. Sustainability took center stage with brands like Stella McCartney and Gabriela Hearst showcasing innovative eco-friendly materials.',
    author: 'Fashion Editor',
    publishedDate: new Date().toISOString(),
    source: 'Fashion News',
    category: 'Fashion Week',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    readTime: '5 min read',
    tags: ['fashion week', 'trends', 'sustainability', 'luxury'],
    link: '#'
  }
]

export const rssApi = {
  // Get all fashion news articles from NewsAPI
  async getAllArticles() {
    try {
      console.log('🚀 Fetching all fashion articles from NewsAPI...')
      
      // Fetch both general fashion news and headlines
      const [fashionNews, headlines] = await Promise.allSettled([
        fetchFashionNews('fashion trends', 15),
        fetchFashionHeadlines(10)
      ])
      
      let allArticles = []
      
      // Add successful results
      if (fashionNews.status === 'fulfilled') {
        allArticles.push(...fashionNews.value)
      }
      
      if (headlines.status === 'fulfilled') {
        allArticles.push(...headlines.value)
      }
      
      // Remove duplicates based on title
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title.toLowerCase() === article.title.toLowerCase())
      )
      
      // Sort by publication date (newest first)
      const sortedArticles = uniqueArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      if (sortedArticles.length === 0) {
        console.log('⚠️ No articles fetched, using fallback')
        return {
          articles: FALLBACK_ARTICLES,
          total: FALLBACK_ARTICLES.length,
          lastUpdated: new Date().toISOString(),
          source: 'Fallback Data'
        }
      }
      
      console.log(`🎉 Successfully fetched ${sortedArticles.length} unique fashion articles`)
      
      return {
        articles: sortedArticles,
        total: sortedArticles.length,
        lastUpdated: new Date().toISOString(),
        source: 'NewsAPI'
      }
    } catch (error) {
      console.error('❌ Error in getAllArticles:', error)
      
      // Return fallback data
      return {
        articles: FALLBACK_ARTICLES,
        total: FALLBACK_ARTICLES.length,
        lastUpdated: new Date().toISOString(),
        source: 'Fallback Data'
      }
    }
  },

  // Get articles by category
  async getArticlesByCategory(category) {
    try {
      console.log(`📂 Fetching articles for category: ${category}`)
      
      const allArticlesResponse = await this.getAllArticles()
      const filteredArticles = allArticlesResponse.articles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
      
      return {
        articles: filteredArticles,
        total: filteredArticles.length,
        category,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error in getArticlesByCategory:', error)
      return {
        articles: [],
        total: 0,
        category,
        lastUpdated: new Date().toISOString()
      }
    }
  },

  // Get featured articles (most recent)
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
      console.error('❌ Error in getFeaturedArticles:', error)
      return {
        articles: FALLBACK_ARTICLES.slice(0, limit),
        total: Math.min(limit, FALLBACK_ARTICLES.length),
        lastUpdated: new Date().toISOString()
      }
    }
  },

  // Enhanced search with NewsAPI
  async searchArticles(query) {
    try {
      console.log(`🔍 Searching fashion articles for: "${query}"`)
      
      // Search NewsAPI directly for the query
      const searchResults = await fetchFashionNews(query, 15)
      
      if (searchResults.length === 0) {
        // Fallback to existing articles if no results
        const allArticlesResponse = await this.getAllArticles()
        const existingResults = allArticlesResponse.articles.filter(article =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        
        return {
          articles: existingResults,
          total: existingResults.length,
          query,
          lastUpdated: new Date().toISOString(),
          source: 'Existing Articles'
        }
      }
      
      console.log(`🎯 Found ${searchResults.length} articles for search: "${query}"`)
      
      return {
        articles: searchResults,
        total: searchResults.length,
        query,
        lastUpdated: new Date().toISOString(),
        source: 'NewsAPI Search'
      }
    } catch (error) {
      console.error('❌ Error in searchArticles:', error)
      return {
        articles: [],
        total: 0,
        query,
        lastUpdated: new Date().toISOString(),
        source: 'Error'
      }
    }
  },

  // Get article by ID
  async getArticleById(id) {
    try {
      const allArticlesResponse = await this.getAllArticles()
      const article = allArticlesResponse.articles.find(article => article.id === parseInt(id))
      
      if (!article) {
        throw new Error(`Article with ID ${id} not found`)
      }
      
      return article
    } catch (error) {
      console.error('❌ Error in getArticleById:', error)
      throw new Error(`Failed to fetch article with ID: ${id}`)
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
      console.error('❌ Error in getArticlesBySource:', error)
      return {
        articles: [],
        total: 0,
        source,
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

export default rssApi