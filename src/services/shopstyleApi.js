// ShopStyle API service - Mock implementation for fashion products
// This provides product data for trend analysis and shopping features

// Mock product data for different categories
const generateProducts = (category, count = 20) => {
  const products = []
  const baseImages = [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=600&fit=crop&auto=format&q=80'
  ]

  const brands = ['Zara', 'H&M', 'Gucci', 'Prada', 'Nike', 'Adidas', 'Uniqlo', 'COS', 'Arket', 'Mango']
  const productTypes = {
    luxury: ['Designer Dress', 'Luxury Handbag', 'Premium Coat', 'Designer Shoes', 'Silk Blouse'],
    streetwear: ['Hoodie', 'Sneakers', 'Joggers', 'Graphic Tee', 'Baseball Cap'],
    sustainability: ['Organic Cotton Tee', 'Recycled Jacket', 'Eco Dress', 'Sustainable Jeans', 'Hemp Bag'],
    technology: ['Smart Watch', 'Fitness Tracker', 'Tech Jacket', 'LED Sneakers', 'Smart Ring'],
    'fashion-week': ['Runway Dress', 'Statement Coat', 'Designer Bag', 'Fashion Boots', 'Avant-garde Top']
  }

  const categoryProducts = productTypes[category] || productTypes.luxury

  for (let i = 0; i < count; i++) {
    const productType = categoryProducts[i % categoryProducts.length]
    const brand = brands[i % brands.length]
    const price = Math.floor(Math.random() * 500) + 50
    const imageIndex = i % baseImages.length

    products.push({
      id: `product-${category}-${i}`,
      name: `${brand} ${productType}`,
      brand: brand,
      price: price,
      currency: 'USD',
      image: baseImages[imageIndex],
      category: category,
      description: `Premium ${productType.toLowerCase()} from ${brand}. Perfect for modern fashion enthusiasts.`,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      reviews: Math.floor(Math.random() * 1000) + 10,
      inStock: Math.random() > 0.1, // 90% in stock
      url: '#'
    })
  }

  return products
}

const shopstyleApi = {
  // Get products by category
  async getProductsByCategory(category, limit = 20) {
    try {
      console.log(`🛍️ Fetching products for category: ${category}`)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const products = generateProducts(category, limit)
      
      return {
        products,
        total: products.length,
        category,
        lastUpdated: new Date().toISOString()
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch products for ${category}:`, error.message)
      throw new Error(`Failed to load products: ${error.message}`)
    }
  },

  // Search products
  async searchProducts(query, limit = 20) {
    try {
      console.log(`🔍 Searching products for: "${query}"`)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate products based on search query
      const category = query.toLowerCase().includes('luxury') ? 'luxury' : 
                     query.toLowerCase().includes('street') ? 'streetwear' :
                     query.toLowerCase().includes('eco') ? 'sustainability' : 'luxury'
      
      const products = generateProducts(category, limit)
      
      return {
        products,
        total: products.length,
        query,
        lastUpdated: new Date().toISOString()
      }
      
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error.message)
      throw new Error(`Search failed: ${error.message}`)
    }
  },

  // Get trending products
  async getTrendingProducts(limit = 12) {
    try {
      console.log(`📈 Fetching trending products`)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const products = generateProducts('luxury', limit)
      
      return {
        products,
        total: products.length,
        lastUpdated: new Date().toISOString()
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch trending products:`, error.message)
      throw new Error(`Failed to load trending products: ${error.message}`)
    }
  }
}

export default shopstyleApi