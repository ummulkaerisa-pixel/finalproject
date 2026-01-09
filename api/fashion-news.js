// Vercel serverless function for fashion news API
// This bypasses CORS restrictions by making API calls server-side

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { query = 'fashion', page = 1, pageSize = 20 } = req.query
    
    // NewsAPI configuration - try both environment variable names
    const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY
    const NEWS_API_BASE_URL = 'https://newsapi.org/v2'
    
    console.log('🔧 Environment check:', {
      hasViteKey: !!process.env.VITE_NEWS_API_KEY,
      hasRegularKey: !!process.env.NEWS_API_KEY,
      keyLength: NEWS_API_KEY ? NEWS_API_KEY.length : 0
    })
    
    if (!NEWS_API_KEY) {
      console.log('⚠️ NewsAPI key not found in environment variables')
      return res.status(200).json({ 
        success: false,
        error: 'API key not configured',
        fallback: true,
        debug: {
          env: Object.keys(process.env).filter(key => key.includes('NEWS') || key.includes('API'))
        }
      })
    }

    // Fashion-related sources
    const FASHION_SOURCES = [
      'vogue.com', 'harpersbazaar.com', 'elle.com', 'wwd.com', 
      'fashionista.com', 'refinery29.com', 'whowhatwear.com'
    ]

    // Build NewsAPI URL
    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      page: page.toString(),
      pageSize: pageSize.toString(),
      domains: FASHION_SOURCES.join(',')
    })

    const url = `${NEWS_API_BASE_URL}/everything?${params}`
    
    console.log('🌐 Fetching from NewsAPI:', { query, page, pageSize })
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'TresNow/1.0'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('NewsAPI Error Response:', errorText)
      throw new Error(`NewsAPI HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('📊 NewsAPI Response:', {
      status: data.status,
      totalResults: data.totalResults,
      articlesCount: data.articles?.length || 0
    })

    if (data.status === 'ok' && data.articles && data.articles.length > 0) {
      console.log(`✅ NewsAPI: Fetched ${data.articles.length} real articles`)
      
      // Process and clean the articles
      const processedArticles = data.articles
        .filter(article => 
          article.title && 
          article.description && 
          !article.title.includes('[Removed]') &&
          !article.description.includes('[Removed]')
        )
        .map((article, index) => {
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
            imageUrl: article.urlToImage || null,
            readTime: getReadTime(article.content || cleanDescription),
            tags: getTags(cleanTitle, cleanDescription),
            link: article.url || '#'
          }
        })

      return res.status(200).json({
        success: true,
        articles: processedArticles,
        totalResults: data.totalResults,
        query,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        source: 'NewsAPI (Vercel Function)',
        debug: {
          originalCount: data.articles.length,
          processedCount: processedArticles.length
        }
      })
    } else {
      console.log('⚠️ NewsAPI returned no articles or error:', data)
      return res.status(200).json({
        success: false,
        error: 'No articles returned from NewsAPI',
        fallback: true,
        debug: {
          status: data.status,
          totalResults: data.totalResults,
          message: data.message
        }
      })
    }

  } catch (error) {
    console.error('❌ NewsAPI Error:', error.message)
    
    return res.status(200).json({
      success: false,
      error: error.message,
      fallback: true,
      message: 'NewsAPI unavailable, client should use fallback content'
    })
  }
}

// Helper functions
function getCategoryFromText(text) {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('fashion week') || lowerText.includes('runway')) return 'Fashion Week'
  if (lowerText.includes('luxury') || lowerText.includes('designer') || lowerText.includes('haute couture')) return 'Luxury'
  if (lowerText.includes('streetwear') || lowerText.includes('street style') || lowerText.includes('urban')) return 'Streetwear'
  if (lowerText.includes('sustainable') || lowerText.includes('eco') || lowerText.includes('green fashion')) return 'Sustainability'
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('digital') || lowerText.includes('virtual')) return 'Technology'
  if (lowerText.includes('vintage') || lowerText.includes('retro') || lowerText.includes('classic')) return 'Vintage'
  if (lowerText.includes('business') || lowerText.includes('market') || lowerText.includes('industry')) return 'Business'
  if (lowerText.includes('global') || lowerText.includes('international') || lowerText.includes('world')) return 'Global Fashion'
  
  return 'Style'
}

function getReadTime(content) {
  if (!content) return '3 min read'
  const words = content.split(' ').length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

function getTags(title, description) {
  const terms = [
    'fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 
    'designer', 'runway', 'vintage', 'tech', 'business', 'global',
    'haute couture', 'fashion week', 'eco-friendly', 'innovation'
  ]
  const text = `${title} ${description}`.toLowerCase()
  return terms.filter(term => text.includes(term)).slice(0, 4)
}