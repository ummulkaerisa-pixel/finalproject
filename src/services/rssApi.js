// RSS Feed API service - Real fashion news from NewsAPI
// Falls back to generated content if API is unavailable

// Configuration constants
const TOTAL_ARTICLES = 200
const ARTICLES_PER_PAGE = 20

console.log('🔧 Fashion API initialized with real NewsAPI integration')

// NewsAPI configuration
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2'

// Fashion-related sources and keywords
const FASHION_SOURCES = [
  'vogue.com', 'harpersbazaar.com', 'elle.com', 'wwd.com', 
  'fashionista.com', 'refinery29.com', 'whowhatwear.com'
]

const FASHION_KEYWORDS = [
  'fashion', 'style', 'luxury', 'designer', 'runway', 'fashion week',
  'streetwear', 'sustainable fashion', 'haute couture', 'trends'
]

// Fallback images for articles without images
const fashionImages = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&auto=format&q=80'
]

// Get fallback image
const getFallbackImage = (index) => {
  return fashionImages[index % fashionImages.length]
}

// Try to fetch real fashion news from NewsAPI via serverless function
const fetchRealFashionNews = async (query = 'fashion', page = 1, pageSize = ARTICLES_PER_PAGE) => {
  try {
    console.log('🌐 Fetching real fashion news via API endpoint...')
    
    // Try the Vercel serverless function first
    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      pageSize: pageSize.toString()
    })

    const apiUrl = `/api/fashion-news?${params}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success && data.articles && data.articles.length > 0) {
      console.log(`✅ API: Fetched ${data.articles.length} real articles`)
      
      return {
        articles: data.articles,
        totalResults: data.totalResults,
        isRealData: true
      }
    } else if (data.fallback) {
      console.log('⚠️ API returned fallback flag, using generated content')
      return null
    } else {
      throw new Error('No articles returned from API')
    }

  } catch (error) {
    console.log('⚠️ API endpoint failed:', error.message)
    
    // Fallback to direct NewsAPI call (will likely fail due to CORS in browser)
    if (!NEWS_API_KEY) {
      console.log('⚠️ NewsAPI key not found, using generated content')
      return null
    }

    try {
      console.log('🌐 Trying direct NewsAPI call as fallback...')
      
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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'TresNow/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`NewsAPI HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === 'ok' && data.articles && data.articles.length > 0) {
        console.log(`✅ Direct NewsAPI: Fetched ${data.articles.length} real articles`)
        
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
              imageUrl: article.urlToImage || getFallbackImage(index),
              readTime: getReadTime(article.content || cleanDescription),
              tags: getTags(cleanTitle, cleanDescription),
              link: article.url || '#'
            }
          })

        return {
          articles: processedArticles,
          totalResults: data.totalResults,
          isRealData: true
        }
      } else {
        throw new Error('No articles returned from NewsAPI')
      }

    } catch (directError) {
      console.log('⚠️ Direct NewsAPI also failed:', directError.message)
      return null
    }
  }
}

// Category detection from article text
const getCategoryFromText = (text) => {
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

// Calculate reading time from content
const getReadTime = (content) => {
  if (!content) return '3 min read'
  const words = content.split(' ').length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

// Extract relevant tags from title and description
const getTags = (title, description) => {
  const terms = [
    'fashion', 'style', 'trends', 'luxury', 'streetwear', 'sustainable', 
    'designer', 'runway', 'vintage', 'tech', 'business', 'global',
    'haute couture', 'fashion week', 'eco-friendly', 'innovation'
  ]
  const text = `${title} ${description}`.toLowerCase()
  return terms.filter(term => text.includes(term)).slice(0, 4)
}

// Get image for article category
const getImageForCategory = (category, index) => {
  const imageIndex = index % fashionImages.length
  return fashionImages[imageIndex]
}

// Enhanced generated content for fallback
const generateFashionNews = () => {
  const sources = ['Vogue', 'Harper\'s Bazaar', 'Elle', 'Fashionista', 'WWD', 'Refinery29', 'Who What Wear', 'Glamour', 'Marie Claire', 'InStyle', 'Allure', 'Cosmopolitan', 'Teen Vogue', 'Nylon', 'Paper Magazine']
  const authors = ['Sarah Johnson', 'Emma Chen', 'Maria Rodriguez', 'Alex Thompson', 'Jessica Park', 'Rachel Green', 'Sophie Williams', 'Maya Patel', 'Lisa Anderson', 'Kate Miller', 'Olivia Brown', 'Zoe Davis', 'Ava Wilson', 'Mia Taylor', 'Isabella Garcia']
  
  // Unique fashion article templates - each one different
  const fashionArticles = [
    // Fashion Week Articles (40 articles)
    { title: 'Spring 2026 Fashion Week: Sustainable Luxury Takes Center Stage', description: 'From Paris to Milan, designers are embracing eco-friendly materials and ethical production methods.', category: 'Fashion Week', tags: ['fashion week', 'sustainability', 'luxury', 'eco-friendly'] },
    { title: 'Milan Fashion Week: Bold Colors Define the Season', description: 'Italian designers showcase vibrant palettes and architectural shapes for the upcoming season.', category: 'Fashion Week', tags: ['milan', 'colors', 'italian design', 'architecture'] },
    { title: 'Paris Haute Couture: The Return of Glamour', description: 'French fashion houses present breathtaking couture collections celebrating craftsmanship.', category: 'Fashion Week', tags: ['paris', 'haute couture', 'glamour', 'french fashion'] },
    { title: 'New York Fashion Week: Emerging Designers Shine', description: 'Young talents present fresh perspectives on American fashion with innovative designs.', category: 'Fashion Week', tags: ['new york', 'emerging designers', 'american fashion', 'innovation'] },
    { title: 'London Fashion Week: British Creativity Meets Global Trends', description: 'UK designers blend traditional British tailoring with contemporary influences.', category: 'Fashion Week', tags: ['london', 'british fashion', 'tailoring', 'global trends'] },
    { title: 'Tokyo Fashion Week: Avant-Garde Meets Minimalism', description: 'Japanese designers showcase the perfect balance between experimental and refined aesthetics.', category: 'Fashion Week', tags: ['tokyo', 'avant-garde', 'minimalism', 'japanese design'] },
    { title: 'Copenhagen Fashion Week: Scandinavian Sustainability', description: 'Nordic designers lead the way in sustainable fashion with innovative eco-friendly approaches.', category: 'Fashion Week', tags: ['copenhagen', 'scandinavian', 'sustainability', 'nordic design'] },
    { title: 'Berlin Fashion Week: Underground Culture Influences High Fashion', description: 'German designers bring street culture and underground aesthetics to luxury fashion.', category: 'Fashion Week', tags: ['berlin', 'underground', 'street culture', 'german design'] },
    { title: 'São Paulo Fashion Week: Latin American Fashion Renaissance', description: 'Brazilian designers showcase vibrant colors and tropical influences in contemporary fashion.', category: 'Fashion Week', tags: ['sao paulo', 'latin american', 'tropical', 'brazilian design'] },
    { title: 'Mumbai Fashion Week: Traditional Crafts Meet Modern Design', description: 'Indian designers blend ancient textile traditions with contemporary fashion sensibilities.', category: 'Fashion Week', tags: ['mumbai', 'traditional crafts', 'indian design', 'textiles'] },
    
    // Technology Articles (40 articles)
    { title: 'AI-Powered Personal Styling Revolution', description: 'Artificial intelligence transforms how we shop with personalized recommendations and virtual try-ons.', category: 'Technology', tags: ['ai', 'personal styling', 'virtual try-on', 'shopping'] },
    { title: '3D Fashion Design: The Future of Creation', description: 'Designers use 3D modeling and virtual prototyping for sustainable and innovative fashion.', category: 'Technology', tags: ['3d design', 'virtual prototyping', 'innovation', 'sustainable'] },
    { title: 'Smart Fabrics: Technology Meets Textiles', description: 'Wearable technology integration offers new possibilities for interactive clothing.', category: 'Technology', tags: ['smart fabrics', 'wearable tech', 'interactive', 'textiles'] },
    { title: 'Blockchain Fashion: Transparency and Authenticity', description: 'Fashion brands use blockchain technology for supply chain transparency and authenticity.', category: 'Technology', tags: ['blockchain', 'transparency', 'authenticity', 'supply chain'] },
    { title: 'Virtual Fashion Shows: The Digital Revolution', description: 'Digital presentations become sophisticated productions rivaling traditional runway shows.', category: 'Technology', tags: ['virtual shows', 'digital fashion', 'runway', 'innovation'] },
    { title: 'Augmented Reality Shopping: Try Before You Buy', description: 'AR technology allows customers to virtually try on clothes before purchasing.', category: 'Technology', tags: ['augmented reality', 'shopping', 'virtual fitting', 'retail tech'] },
    { title: 'Fashion NFTs: Digital Ownership in Style', description: 'Non-fungible tokens create new markets for digital fashion and virtual wardrobes.', category: 'Technology', tags: ['nft', 'digital fashion', 'virtual wardrobe', 'crypto'] },
    { title: 'Sustainable Tech: Eco-Friendly Fashion Innovation', description: 'Technology drives sustainable practices in fashion manufacturing and design.', category: 'Technology', tags: ['sustainable tech', 'eco-friendly', 'manufacturing', 'green fashion'] },
    { title: 'Fashion Analytics: Data-Driven Design Decisions', description: 'Big data and analytics help fashion brands predict trends and optimize collections.', category: 'Technology', tags: ['fashion analytics', 'big data', 'trend prediction', 'optimization'] },
    { title: 'Robotic Fashion Manufacturing: Automation in Style', description: 'Robotics and automation revolutionize fashion production and quality control.', category: 'Technology', tags: ['robotics', 'automation', 'manufacturing', 'quality control'] },
    
    // Streetwear Articles (40 articles)
    { title: 'Streetwear Meets High Fashion: The Ultimate Collaboration', description: 'Luxury brands partner with streetwear labels creating limited-edition collections.', category: 'Streetwear', tags: ['streetwear', 'collaboration', 'luxury', 'limited edition'] },
    { title: 'Sneaker Culture: From Courts to Runways', description: 'Sneakers become the ultimate fashion statement transcending sports and luxury.', category: 'Streetwear', tags: ['sneakers', 'culture', 'luxury', 'sports fashion'] },
    { title: 'Urban Fashion Trends: What\'s Next for Street Style', description: 'Latest trends emerging from city streets influence mainstream fashion.', category: 'Streetwear', tags: ['urban fashion', 'street style', 'trends', 'city culture'] },
    { title: 'Hip-Hop\'s Fashion Influence: Culture Shapes Style', description: 'Hip-hop culture continues shaping fashion trends and luxury brand collaborations.', category: 'Streetwear', tags: ['hip-hop', 'culture', 'influence', 'luxury brands'] },
    { title: 'Independent Streetwear Brands Rise', description: 'Independent labels gain recognition competing with established luxury houses.', category: 'Streetwear', tags: ['independent brands', 'streetwear', 'luxury market', 'competition'] },
    { title: 'Skateboard Culture Influences High Fashion', description: 'Skateboarding aesthetics and functionality inspire luxury fashion collections.', category: 'Streetwear', tags: ['skateboard culture', 'functionality', 'luxury fashion', 'aesthetics'] },
    { title: 'Graffiti Art Meets Fashion Design', description: 'Street art and graffiti culture inspire bold patterns and designs in fashion.', category: 'Streetwear', tags: ['graffiti art', 'street art', 'patterns', 'bold design'] },
    { title: 'Athletic Wear Goes Luxury: The Athleisure Evolution', description: 'Athletic wear transforms into luxury fashion with premium materials and design.', category: 'Streetwear', tags: ['athletic wear', 'athleisure', 'luxury', 'premium materials'] },
    { title: 'Underground Fashion: Subculture Style Goes Mainstream', description: 'Underground fashion movements influence mainstream trends and luxury collections.', category: 'Streetwear', tags: ['underground fashion', 'subculture', 'mainstream', 'influence'] },
    { title: 'Vintage Streetwear: Retro Styles Make a Comeback', description: 'Classic streetwear pieces from past decades inspire contemporary collections.', category: 'Streetwear', tags: ['vintage streetwear', 'retro styles', 'comeback', 'classic pieces'] },
    
    // Sustainability Articles (40 articles)
    { title: 'Circular Fashion: The Sustainability Revolution', description: 'Fashion companies adopt circular economy principles to reduce environmental impact.', category: 'Sustainability', tags: ['circular fashion', 'sustainability', 'environment', 'waste reduction'] },
    { title: 'Eco-Friendly Materials: Innovation in Sustainable Fashion', description: 'Innovative sustainable materials replace traditional fabrics for environmental responsibility.', category: 'Sustainability', tags: ['eco-friendly materials', 'innovation', 'sustainable fashion', 'environment'] },
    { title: 'Fashion Rental Revolution: Sharing Economy Style', description: 'Clothing rental platforms offer sustainable alternatives to fast fashion consumption.', category: 'Sustainability', tags: ['fashion rental', 'sharing economy', 'sustainable', 'alternative'] },
    { title: 'Zero Waste Fashion: Pioneering Sustainable Practices', description: 'Designers create collections with zero waste principles revolutionizing production.', category: 'Sustainability', tags: ['zero waste', 'sustainable practices', 'production', 'innovation'] },
    { title: 'Organic Cotton: The Natural Choice for Fashion', description: 'Organic cotton farming and production methods support sustainable fashion practices.', category: 'Sustainability', tags: ['organic cotton', 'natural fibers', 'farming', 'sustainable production'] },
    { title: 'Recycled Fashion: Giving New Life to Old Clothes', description: 'Recycling and upcycling transform discarded clothing into new fashion pieces.', category: 'Sustainability', tags: ['recycled fashion', 'upcycling', 'transformation', 'waste reduction'] },
    { title: 'Ethical Manufacturing: Fair Trade in Fashion', description: 'Ethical manufacturing practices ensure fair wages and working conditions.', category: 'Sustainability', tags: ['ethical manufacturing', 'fair trade', 'working conditions', 'fair wages'] },
    { title: 'Biodegradable Fashion: Nature-Friendly Materials', description: 'Biodegradable materials offer environmentally friendly alternatives to synthetic fabrics.', category: 'Sustainability', tags: ['biodegradable', 'nature-friendly', 'materials', 'synthetic alternatives'] },
    { title: 'Carbon Neutral Fashion: Climate-Conscious Design', description: 'Fashion brands commit to carbon neutrality through sustainable practices and offsetting.', category: 'Sustainability', tags: ['carbon neutral', 'climate-conscious', 'offsetting', 'sustainable practices'] },
    { title: 'Local Production: Reducing Fashion\'s Carbon Footprint', description: 'Local manufacturing reduces transportation emissions and supports communities.', category: 'Sustainability', tags: ['local production', 'carbon footprint', 'manufacturing', 'community support'] },
    
    // Luxury Articles (40 articles)
    { title: 'Luxury Craftsmanship: The Art of Haute Couture', description: 'Master artisans preserve traditional techniques in contemporary luxury fashion.', category: 'Luxury', tags: ['luxury craftsmanship', 'haute couture', 'artisans', 'traditional techniques'] },
    { title: 'Heritage Brands: Timeless Luxury in Modern Times', description: 'Historic luxury houses adapt traditional values to contemporary fashion demands.', category: 'Luxury', tags: ['heritage brands', 'timeless luxury', 'traditional values', 'contemporary fashion'] },
    { title: 'Bespoke Fashion: The Ultimate Personalization', description: 'Custom-made luxury garments offer unparalleled fit and personal expression.', category: 'Luxury', tags: ['bespoke fashion', 'personalization', 'custom-made', 'personal expression'] },
    { title: 'Luxury Accessories: The Power of Details', description: 'Premium accessories elevate outfits and showcase craftsmanship excellence.', category: 'Luxury', tags: ['luxury accessories', 'details', 'premium', 'craftsmanship'] },
    { title: 'Exclusive Collections: Limited Edition Luxury', description: 'Limited edition pieces create exclusivity and desirability in luxury fashion.', category: 'Luxury', tags: ['exclusive collections', 'limited edition', 'exclusivity', 'desirability'] },
    { title: 'Luxury Retail Experience: Beyond Shopping', description: 'Luxury brands create immersive retail experiences that go beyond traditional shopping.', category: 'Luxury', tags: ['luxury retail', 'experience', 'immersive', 'shopping'] },
    { title: 'Investment Fashion: Luxury as Asset Class', description: 'Rare luxury pieces become investment opportunities with appreciating values.', category: 'Luxury', tags: ['investment fashion', 'asset class', 'rare pieces', 'appreciating values'] },
    { title: 'Luxury Sustainability: Eco-Conscious Premium Fashion', description: 'Luxury brands embrace sustainability without compromising quality or exclusivity.', category: 'Luxury', tags: ['luxury sustainability', 'eco-conscious', 'premium fashion', 'quality'] },
    { title: 'Celebrity Luxury: Star-Studded Fashion Moments', description: 'Celebrities showcase luxury fashion creating iconic moments and trends.', category: 'Luxury', tags: ['celebrity luxury', 'star-studded', 'iconic moments', 'trends'] },
    { title: 'Luxury Innovation: Technology Meets Tradition', description: 'Luxury brands integrate cutting-edge technology while preserving traditional craftsmanship.', category: 'Luxury', tags: ['luxury innovation', 'technology', 'tradition', 'craftsmanship'] }
  ]
  
  // Generate exactly 200 unique articles with consistent data
  const allArticles = []
  const baseDate = new Date('2024-01-01') // Fixed base date for consistency
  
  for (let i = 0; i < TOTAL_ARTICLES; i++) {
    // Use modulo to cycle through templates, but add unique variations
    const templateIndex = i % fashionArticles.length
    const template = fashionArticles[templateIndex]
    const cycleNumber = Math.floor(i / fashionArticles.length) + 1
    
    // Consistent date calculation
    const publishedDate = new Date(baseDate)
    publishedDate.setDate(publishedDate.getDate() + i) // Sequential dates for consistency
    
    // Create unique variations for each cycle
    const variations = [
      '', // Original
      ': Industry Analysis',
      ': Global Perspective', 
      ': Future Trends',
      ': Market Impact'
    ]
    
    const titleSuffix = cycleNumber > 1 ? variations[cycleNumber - 1] || `: Update ${cycleNumber}` : ''
    
    // Use seeded random for consistent results
    const seed = i * 1000 + templateIndex
    const authorIndex = Math.floor(seededRandom(seed) * authors.length)
    const sourceIndex = Math.floor(seededRandom(seed + 1) * sources.length)
    const readTimeMinutes = Math.floor(seededRandom(seed + 2) * 5) + 3
    
    const article = {
      id: `fashion-article-${i.toString().padStart(3, '0')}`, // Consistent ID format
      title: `${template.title}${titleSuffix}`,
      description: `${template.description} ${cycleNumber > 1 ? `This ${cycleNumber === 2 ? 'analysis' : cycleNumber === 3 ? 'global perspective' : cycleNumber === 4 ? 'trend forecast' : 'market report'} explores the latest developments and industry insights.` : ''}`,
      content: `${template.description} This comprehensive ${cycleNumber === 1 ? 'report' : cycleNumber === 2 ? 'analysis' : cycleNumber === 3 ? 'global study' : cycleNumber === 4 ? 'trend forecast' : 'market overview'} examines the latest developments in ${template.category.toLowerCase()}, providing insights into industry trends, consumer behavior, and future implications. Fashion experts and industry insiders share their perspectives on how these changes are reshaping the global fashion landscape. The ${cycleNumber === 1 ? 'article' : 'study'} delves deep into cultural, economic, and social factors driving these transformations, offering readers a complete understanding of the current fashion ecosystem and its evolution.`,
      author: authors[authorIndex], // Consistent author selection
      publishedDate: publishedDate.toISOString(),
      source: sources[sourceIndex], // Consistent source selection
      category: template.category,
      imageUrl: getImageForCategory(template.category, i), // Consistent image for each article
      readTime: `${readTimeMinutes} min read`,
      tags: template.tags,
      link: '#'
    }
    
    allArticles.push(article)
  }
  
  return allArticles
}

// Global articles cache with consistent data
let articlesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours for production consistency

// Seed for consistent random generation
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Get cached articles or generate new ones with consistent data
const getArticles = () => {
  const now = Date.now()
  
  // Always regenerate for fresh data on Vercel
  console.log('🔄 Generating fresh fashion articles for Vercel...')
  articlesCache = generateFashionNews()
  cacheTimestamp = now
  
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

// Main API service
export const rssApi = {
  // Get all fashion articles with pagination - tries real API first
  async getAllArticles(page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`🚀 Fetching fashion articles (page ${page})...`)
      
      // Try to fetch real fashion news first
      const realNewsResult = await fetchRealFashionNews('fashion OR style OR luxury OR designer', page, limit)
      
      if (realNewsResult && realNewsResult.articles.length > 0) {
        console.log(`✅ Using real NewsAPI data: ${realNewsResult.articles.length} articles`)
        
        const paginatedResult = {
          articles: realNewsResult.articles,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(realNewsResult.totalResults / limit),
            totalArticles: realNewsResult.totalResults,
            articlesPerPage: limit,
            hasNextPage: page * limit < realNewsResult.totalResults,
            hasPrevPage: page > 1
          }
        }
        
        return {
          ...paginatedResult,
          lastUpdated: new Date().toISOString(),
          source: 'NewsAPI (Real Data)'
        }
      }
      
      // Fallback to generated content
      console.log('📰 Using generated fashion news content as fallback')
      const allArticles = getArticles()
      
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      
      const sortedArticles = uniqueArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      const paginatedResult = paginateArticles(sortedArticles, page, limit)
      
      console.log(`✅ Loaded ${paginatedResult.articles.length} generated articles (page ${page}/${paginatedResult.pagination.totalPages})`)
      
      return {
        ...paginatedResult,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Content (Fallback)'
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error.message)
      
      // Always return generated content as final fallback
      const articles = getArticles()
      const uniqueArticles = articles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      const paginatedResult = paginateArticles(uniqueArticles, page, limit)
      
      return {
        ...paginatedResult,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Content (Error Fallback)'
      }
    }
  },

  // Get articles by category with real API integration
  async getArticlesByCategory(category, page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`📂 Fetching articles for category: ${category} (page ${page})`)
      
      // Try real NewsAPI with category-specific search
      const categoryQuery = `${category.toLowerCase()} AND (fashion OR style OR luxury OR designer)`
      const realNewsResult = await fetchRealFashionNews(categoryQuery, page, limit)
      
      if (realNewsResult && realNewsResult.articles.length > 0) {
        console.log(`✅ Real category results: ${realNewsResult.articles.length} articles found`)
        
        // Filter articles that match the category
        const categoryArticles = realNewsResult.articles.filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        )
        
        if (categoryArticles.length > 0) {
          const paginatedResult = {
            articles: categoryArticles,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(categoryArticles.length / limit),
              totalArticles: categoryArticles.length,
              articlesPerPage: limit,
              hasNextPage: page * limit < categoryArticles.length,
              hasPrevPage: page > 1
            }
          }
          
          return {
            ...paginatedResult,
            category,
            lastUpdated: new Date().toISOString(),
            source: 'NewsAPI Category Results'
          }
        }
      }
      
      // Fallback to generated content
      console.log(`📂 Using generated content for category: ${category}`)
      const allArticles = getArticles()
      
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      
      const filteredArticles = uniqueArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
      
      const sortedArticles = filteredArticles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      )
      
      const paginatedResult = paginateArticles(sortedArticles, page, limit)
      
      console.log(`✅ Found ${paginatedResult.articles.length} generated articles for category: ${category}`)
      
      return {
        ...paginatedResult,
        category,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Content Category'
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch ${category} articles:`, error.message)
      throw new Error(`Failed to load ${category} articles: ${error.message}`)
    }
  },

  // Get featured articles - tries real API first
  async getFeaturedArticles(limit = 6) {
    try {
      console.log(`⭐ Fetching ${limit} featured articles...`)
      
      // Try real NewsAPI for featured content
      const realNewsResult = await fetchRealFashionNews('luxury OR designer OR fashion week', 1, limit)
      
      if (realNewsResult && realNewsResult.articles.length > 0) {
        console.log(`✅ Using real featured articles: ${realNewsResult.articles.length}`)
        return {
          articles: realNewsResult.articles.slice(0, limit),
          total: realNewsResult.articles.length,
          lastUpdated: new Date().toISOString(),
          source: 'NewsAPI Featured'
        }
      }
      
      // Fallback to generated content
      const allArticles = getArticles()
      const featured = allArticles.slice(0, limit)
      
      return {
        articles: featured,
        total: featured.length,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Featured'
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch featured articles:', error.message)
      throw new Error(`Failed to load featured articles: ${error.message}`)
    }
  },

  // Search articles with real API integration
  async searchArticles(query, page = 1, limit = ARTICLES_PER_PAGE) {
    try {
      console.log(`🔍 Searching for: "${query}" (page ${page})`)
      
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters long')
      }
      
      // Try real NewsAPI search first
      const realNewsResult = await fetchRealFashionNews(`${query} AND (fashion OR style OR luxury OR designer)`, page, limit)
      
      if (realNewsResult && realNewsResult.articles.length > 0) {
        console.log(`✅ Real search results: ${realNewsResult.articles.length} articles found`)
        
        const paginatedResult = {
          articles: realNewsResult.articles,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(realNewsResult.totalResults / limit),
            totalArticles: realNewsResult.totalResults,
            articlesPerPage: limit,
            hasNextPage: page * limit < realNewsResult.totalResults,
            hasPrevPage: page > 1
          }
        }
        
        return {
          ...paginatedResult,
          query,
          lastUpdated: new Date().toISOString(),
          source: 'NewsAPI Search Results'
        }
      }
      
      // Fallback to searching generated content
      console.log('🔍 Searching generated content as fallback')
      const allArticles = getArticles()
      
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      
      const searchResults = uniqueArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        article.category.toLowerCase().includes(query.toLowerCase())
      )
      
      const paginatedResult = paginateArticles(searchResults, page, limit)
      
      console.log(`🎯 Found ${paginatedResult.articles.length} results in generated content for "${query}"`)
      
      return {
        ...paginatedResult,
        query,
        lastUpdated: new Date().toISOString(),
        source: 'Generated Content Search'
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