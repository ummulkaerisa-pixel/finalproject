// RSS Feed API service - Enhanced with pagination and image support
// Generates 200+ realistic fashion articles with proper images

// Environment variables with fallbacks
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '1b132003e30d45b0bfcac300ab11af9f'
const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000
const TOTAL_ARTICLES = 200 // Generate 200 articles
const ARTICLES_PER_PAGE = 20 // Pagination size

console.log('🔧 API Configuration:', {
  hasApiKey: !!NEWS_API_KEY,
  baseUrl: NEWS_API_BASE_URL,
  timeout: API_TIMEOUT,
  totalArticles: TOTAL_ARTICLES,
  articlesPerPage: ARTICLES_PER_PAGE
})

// Fashion image categories for realistic images
const getImageForCategory = (category, index) => {
  const imageCategories = {
    'Fashion Week': [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop'
    ],
    'Luxury': [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop'
    ],
    'Streetwear': [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop'
    ],
    'Sustainability': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop'
    ],
    'Technology': [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop'
    ],
    'Vintage': [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop'
    ],
    'Business': [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop'
    ],
    'Global Fashion': [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop'
    ],
    'Style': [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop'
    ]
  }
  
  const categoryImages = imageCategories[category] || imageCategories['Style']
  return categoryImages[index % categoryImages.length]
}

// Expanded fashion news templates for 200+ articles
const generateFashionNews = () => {
  const sources = ['Vogue', 'Harper\'s Bazaar', 'Elle', 'Fashionista', 'WWD', 'Refinery29', 'Who What Wear', 'Glamour', 'Marie Claire', 'InStyle', 'Allure', 'Cosmopolitan', 'Teen Vogue', 'Nylon', 'Paper Magazine']
  const authors = ['Sarah Johnson', 'Emma Chen', 'Maria Rodriguez', 'Alex Thompson', 'Jessica Park', 'Rachel Green', 'Sophie Williams', 'Maya Patel', 'Lisa Anderson', 'Kate Miller', 'Olivia Brown', 'Zoe Davis', 'Ava Wilson', 'Mia Taylor', 'Isabella Garcia']
  
  const fashionNewsTemplates = [
    // Fashion Week Articles
    { title: 'Spring 2026 Fashion Week: Sustainable Luxury Takes Center Stage', description: 'From Paris to Milan, designers are embracing eco-friendly materials and ethical production methods, setting new standards for luxury fashion.', category: 'Fashion Week', tags: ['fashion week', 'sustainability', 'luxury', 'eco-friendly'] },
    { title: 'Milan Fashion Week Highlights: Bold Colors and Innovative Silhouettes', description: 'Italian designers showcase vibrant palettes and architectural shapes that define the upcoming season.', category: 'Fashion Week', tags: ['milan', 'fashion week', 'colors', 'silhouettes'] },
    { title: 'Paris Fashion Week: The Return of Haute Couture Glamour', description: 'French fashion houses present breathtaking couture collections that celebrate craftsmanship and artistry.', category: 'Fashion Week', tags: ['paris', 'haute couture', 'glamour', 'craftsmanship'] },
    { title: 'New York Fashion Week: Emerging Designers Steal the Spotlight', description: 'Young talents present fresh perspectives on American fashion with innovative designs and sustainable practices.', category: 'Fashion Week', tags: ['new york', 'emerging designers', 'innovation', 'american fashion'] },
    { title: 'London Fashion Week: British Creativity Meets Global Influence', description: 'UK designers blend traditional British tailoring with contemporary global trends.', category: 'Fashion Week', tags: ['london', 'british fashion', 'tailoring', 'global trends'] },
    
    // Technology Articles
    { title: 'The Rise of Digital Fashion: NFTs and Virtual Wardrobes', description: 'As the metaverse expands, digital fashion is becoming a billion-dollar industry with virtual clothing and NFT collections.', category: 'Technology', tags: ['digital fashion', 'nft', 'technology', 'virtual'] },
    { title: 'AI-Powered Personal Styling: The Future of Fashion Retail', description: 'Artificial intelligence is revolutionizing how we shop for clothes with personalized recommendations and virtual try-ons.', category: 'Technology', tags: ['ai', 'personal styling', 'retail', 'virtual try-on'] },
    { title: '3D Fashion Design: How Technology is Changing Creation', description: 'Designers are using 3D modeling and virtual prototyping to create more sustainable and innovative fashion.', category: 'Technology', tags: ['3d design', 'virtual prototyping', 'innovation', 'sustainable'] },
    { title: 'Smart Fabrics: The Integration of Technology and Textiles', description: 'Wearable technology meets fashion as smart fabrics offer new possibilities for interactive clothing.', category: 'Technology', tags: ['smart fabrics', 'wearable tech', 'interactive', 'textiles'] },
    { title: 'Blockchain in Fashion: Transparency and Authenticity', description: 'Fashion brands are using blockchain technology to ensure authenticity and supply chain transparency.', category: 'Technology', tags: ['blockchain', 'transparency', 'authenticity', 'supply chain'] },
    
    // Streetwear Articles
    { title: 'Streetwear Meets High Fashion: The Collaboration Revolution', description: 'Luxury brands continue to partner with streetwear labels, creating limited-edition collections that sell out in minutes.', category: 'Streetwear', tags: ['streetwear', 'collaboration', 'luxury', 'limited edition'] },
    { title: 'The Evolution of Sneaker Culture in High Fashion', description: 'From basketball courts to luxury runways, sneakers have become the ultimate fashion statement.', category: 'Streetwear', tags: ['sneakers', 'culture', 'luxury', 'basketball'] },
    { title: 'Urban Fashion Trends: What\'s Next for Street Style', description: 'Exploring the latest trends emerging from city streets and how they influence mainstream fashion.', category: 'Streetwear', tags: ['urban fashion', 'street style', 'trends', 'city culture'] },
    { title: 'Hip-Hop\'s Influence on Contemporary Fashion', description: 'How hip-hop culture continues to shape fashion trends and luxury brand collaborations.', category: 'Streetwear', tags: ['hip-hop', 'culture', 'influence', 'luxury brands'] },
    { title: 'The Rise of Streetwear Brands in Luxury Markets', description: 'Independent streetwear labels are gaining recognition and competing with established luxury houses.', category: 'Streetwear', tags: ['streetwear brands', 'luxury market', 'independent', 'competition'] },
    
    // Sustainability Articles
    { title: 'Vintage Fashion Boom: Why Pre-Loved is the New Luxury', description: 'The vintage fashion market is experiencing unprecedented growth as consumers seek unique, sustainable style options.', category: 'Sustainability', tags: ['vintage', 'sustainable', 'luxury', 'pre-loved'] },
    { title: 'Circular Fashion: Brands Leading the Sustainability Revolution', description: 'Fashion companies are adopting circular economy principles to reduce waste and environmental impact.', category: 'Sustainability', tags: ['circular fashion', 'sustainability', 'environment', 'waste reduction'] },
    { title: 'Eco-Friendly Materials: The Future of Fashion Production', description: 'Innovative sustainable materials are replacing traditional fabrics in the quest for environmental responsibility.', category: 'Sustainability', tags: ['eco-friendly', 'materials', 'innovation', 'environment'] },
    { title: 'Fashion Rental Services: Changing How We Consume Style', description: 'Clothing rental platforms are offering sustainable alternatives to fast fashion consumption.', category: 'Sustainability', tags: ['fashion rental', 'sustainable', 'consumption', 'alternative'] },
    { title: 'Zero Waste Fashion: Designers Pioneering Sustainable Practices', description: 'Fashion designers are creating collections with zero waste principles, revolutionizing production methods.', category: 'Sustainability', tags: ['zero waste', 'sustainable practices', 'production', 'innovation'] }
  ]
  
  // Generate 200 articles by repeating and varying templates
  const allArticles = []
  
  for (let i = 0; i < TOTAL_ARTICLES; i++) {
    const template = fashionNewsTemplates[i % fashionNewsTemplates.length]
    const variation = Math.floor(i / fashionNewsTemplates.length) + 1
    
    const publishedDate = new Date()
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 30)) // Random date within last month
    
    const article = {
      id: `fashion-${Date.now()}-${i}`,
      title: variation > 1 ? `${template.title} - Part ${variation}` : template.title,
      description: template.description,
      content: `${template.description} This comprehensive analysis explores the latest developments in ${template.category.toLowerCase()}, examining industry trends, consumer behavior, and future implications. Fashion experts and industry insiders provide insights into how these changes are reshaping the global fashion landscape. The article delves deep into the cultural, economic, and social factors driving these transformations, offering readers a complete understanding of the current fashion ecosystem.`,
      author: authors[Math.floor(Math.random() * authors.length)],
      publishedDate: publishedDate.toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      category: template.category,
      imageUrl: getImageForCategory(template.category, i),
      readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
      tags: template.tags,
      link: '#'
    }
    
    allArticles.push(article)
  }
  
  return allArticles
}

// Global articles cache
let articlesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get cached articles or generate new ones
const getArticles = () => {
  const now = Date.now()
  
  if (!articlesCache || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
    console.log('🔄 Generating fresh fashion articles...')
    articlesCache = generateFashionNews()
    cacheTimestamp = now
  }
  
  return articlesCache
}

// Pagination helper
const paginateArticles = (articles, page = 1, limit = ARTICLES_PER_PAGE) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedArticles = articles.slice(startIndex, endIndex)
  
  return {
    articles: paginatedArticles,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(articles.length / limit),
      totalArticles: articles.length,
      articlesPerPage: limit,
      hasNextPage: endIndex < articles.length,
      hasPrevPage: page > 1
    }
  }
}

// Try NewsAPI first, fallback to generated content
const tryNewsAPI = async (url) => {
  try {
    console.log('🌐 Attempting NewsAPI request...')
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'ok' && data.articles && data.articles.length > 0) {
      console.log('✅ NewsAPI request successful')
      return data.articles
    } else {
      throw new Error('No articles returned')
    }
    
  } catch (error) {
    console.log('⚠️ NewsAPI unavailable (CORS/Network):', error.message)
    console.log('📰 Using generated fashion news content')
    return null
  }
}

// Process articles (works for both real and generated data)
const processArticles = (articles) => {
  if (!Array.isArray(articles)) {
    return []
  }
  
  return articles
    .filter(article => article && article.title && article.description)
    .map((article, index) => {
      // If it's already processed (generated content), return as-is
      if (article.id && article.id.startsWith('fashion-')) {
        return article
      }
      
      // Process NewsAPI articles
      const cleanTitle = article.title.replace(/\[.*?\]/g, '').trim()
      const cleanDescription = article.description.replace(/\[.*?\]/g, '').trim()
      
      return {
        id: `newsapi-${Date.now()}-${index}`,
        title: cleanTitle,
        description: cleanDescription.length > 200 ? cleanDescription.substring(0, 200) + '...' : cleanDescription,
        content: article.content || cleanDescription,
        author: article.author || 'Fashion Editor',
        publishedDate: article.publishedAt,
        source: article.source?.name || 'Fashion News',
        category: getCategoryFromText(`${cleanTitle} ${cleanDescription}`),
        imageUrl: article.urlToImage || getImageForCategory('Style', index),
        readTime: getReadTime(article.content || cleanDescription),
        tags: getTags(cleanTitle, cleanDescription),
        link: article.url || '#'
      }
    })
}

// Category detection
const getCategoryFromText = (text) => {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('fashion week') || lowerText.includes('runway')) return 'Fashion Week'
  if (lowerText.includes('luxury') || lowerText.includes('designer')) return 'Luxury'
  if (lowerText.includes('streetwear') || lowerText.includes('street style')) return 'Streetwear'
  if (lowerText.includes('sustainable') || lowerText.includes('eco')) return 'Sustainability'
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('digital')) return 'Technology'
  if (lowerText.includes('vintage') || lowerText.includes('retro')) return 'Vintage'
  if (lowerText.includes('business') || lowerText.includes('market')) return 'Business'
  if (lowerText.includes('global') || lowerText.includes('korean')) return 'Global Fashion'
  
  return 'Style'
}

// Helper functions
const getReadTime = (content) => {
  if (!content) return '3 min read'
  const words = content.split(' ').length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

const getTags = (title, description) => {
  const terms = ['fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 'designer', 'runway', 'vintage', 'tech']
  const text = `${title} ${description}`.toLowerCase()
  return terms.filter(term => text.includes(term)).slice(0, 4)
}

// Main API service
export const rssApi = {
  // Get all fashion articles with pagination
  async getAllArticles(page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`🚀 Fetching fashion articles (page ${page})...`)
      
      // Try NewsAPI first (will fail due to CORS in browser)
      const params = new URLSearchParams({
        q: 'fashion OR style OR designer',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '20',
        apiKey: NEWS_API_KEY
      })
      
      const newsApiUrl = `${NEWS_API_BASE_URL}/everything?${params}`
      const newsApiArticles = await tryNewsAPI(newsApiUrl)
      
      let allArticles
      if (newsApiArticles) {
        // Use real NewsAPI data if available
        allArticles = processArticles(newsApiArticles)
      } else {
        // Use generated fashion news content
        allArticles = getArticles()
      }
      
      // Sort by publication date (newest first)
      const sortedArticles = allArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      // Apply pagination
      const paginatedResult = paginateArticles(sortedArticles, page, limit)
      
      console.log(`✅ Loaded ${paginatedResult.articles.length} articles (page ${page}/${paginatedResult.pagination.totalPages})`)
      
      return {
        ...paginatedResult,
        lastUpdated: new Date().toISOString(),
        source: newsApiArticles ? 'NewsAPI' : 'Generated Content'
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error.message)
      
      // Always return generated content as fallback
      const articles = getArticles()
      const paginatedResult = paginateArticles(articles, page, limit)
      
      return {
        ...paginatedResult,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Content (Fallback)'
      }
    }
  },

  // Get articles by category with pagination
  async getArticlesByCategory(category, page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`📂 Fetching articles for category: ${category} (page ${page})`)
      
      const allArticles = getArticles()
      
      const filteredArticles = allArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
      
      // Sort by publication date
      const sortedArticles = filteredArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      // Apply pagination
      const paginatedResult = paginateArticles(sortedArticles, page, limit)
      
      console.log(`✅ Found ${paginatedResult.articles.length} articles for category: ${category} (page ${page}/${paginatedResult.pagination.totalPages})`)
      
      return {
        ...paginatedResult,
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
      
      const allArticles = getArticles()
      const featured = allArticles.slice(0, limit)
      
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

  // Search articles with pagination
  async searchArticles(query, page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`🔍 Searching for: "${query}" (page ${page})`)
      
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters long')
      }
      
      const allArticles = getArticles()
      
      const searchResults = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        article.category.toLowerCase().includes(query.toLowerCase())
      )
      
      // Apply pagination
      const paginatedResult = paginateArticles(searchResults, page, limit)
      
      console.log(`🎯 Found ${paginatedResult.articles.length} results for "${query}" (page ${page}/${paginatedResult.pagination.totalPages})`)
      
      return {
        ...paginatedResult,
        query,
        lastUpdated: new Date().toISOString(),
        source: 'Search Results'
      }
      
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error.message)
      throw new Error(`Search failed: ${error.message}`)
    }
  },

  // Get article by ID
  async getArticleById(id) {
    try {
      const allArticles = getArticles()
      const article = allArticles.find(article => article.id === id)
      
      if (!article) {
        throw new Error(`Article with ID ${id} not found`)
      }
      
      return article
      
    } catch (error) {
      console.error(`❌ Failed to fetch article ${id}:`, error.message)
      throw new Error(`Failed to fetch article: ${error.message}`)
    }
  },

  // Get articles by source with pagination
  async getArticlesBySource(source, page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      const allArticles = getArticles()
      const sourceArticles = allArticles.filter(article => 
        article.source.toLowerCase().includes(source.toLowerCase())
      )
      
      // Apply pagination
      const paginatedResult = paginateArticles(sourceArticles, page, limit)
      
      return {
        ...paginatedResult,
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