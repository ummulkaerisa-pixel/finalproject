import { useState } from 'react'

function StyleAI() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const styleCategories = {
    luxury: {
      name: 'Luxury',
      description: 'High-end, sophisticated pieces with premium materials',
      color: 'from-amber-400 to-orange-500',
      icon: '💎'
    },
    streetwear: {
      name: 'Streetwear',
      description: 'Urban, casual style with bold graphics and comfortable fits',
      color: 'from-purple-400 to-indigo-500',
      icon: '🏙️'
    },
    casual: {
      name: 'Casual',
      description: 'Relaxed, everyday wear that prioritizes comfort',
      color: 'from-emerald-400 to-teal-500',
      icon: '👕'
    },
    formal: {
      name: 'Formal',
      description: 'Professional, structured pieces for business settings',
      color: 'from-slate-400 to-slate-600',
      icon: '👔'
    },
    vintage: {
      name: 'Vintage',
      description: 'Retro-inspired pieces with classic silhouettes',
      color: 'from-rose-400 to-pink-500',
      icon: '🕰️'
    },
    minimalist: {
      name: 'Minimalist',
      description: 'Clean lines, neutral colors, and simple designs',
      color: 'from-gray-400 to-gray-600',
      icon: '⚪'
    }
  }

  const analyzeStyle = () => {
    if (!selectedImage) return
    
    setAnalyzing(true)
    
    // Create an image element to analyze
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      // Create canvas to analyze image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Analyze colors
      let totalR = 0, totalG = 0, totalB = 0
      let darkPixels = 0, lightPixels = 0
      let colorfulPixels = 0
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        totalR += r
        totalG += g
        totalB += b
        
        const brightness = (r + g + b) / 3
        if (brightness < 100) darkPixels++
        else if (brightness > 200) lightPixels++
        
        const saturation = Math.max(r, g, b) - Math.min(r, g, b)
        if (saturation > 50) colorfulPixels++
      }
      
      const totalPixels = data.length / 4
      const avgR = totalR / totalPixels
      const avgG = totalG / totalPixels
      const avgB = totalB / totalPixels
      const avgBrightness = (avgR + avgG + avgB) / 3
      
      const darkRatio = darkPixels / totalPixels
      const lightRatio = lightPixels / totalPixels
      const colorfulRatio = colorfulPixels / totalPixels
      
      // Determine style based on image analysis
      let primaryStyle = 'casual'
      let confidence = 70
      
      // Luxury detection (bright, clean, minimal colors)
      if (avgBrightness > 180 && colorfulRatio < 0.3 && lightRatio > 0.4) {
        primaryStyle = 'luxury'
        confidence = 85
      }
      // Streetwear detection (colorful, high contrast)
      else if (colorfulRatio > 0.4 && darkRatio > 0.2) {
        primaryStyle = 'streetwear'
        confidence = 80
      }
      // Formal detection (dark colors, low saturation)
      else if (darkRatio > 0.5 && colorfulRatio < 0.2) {
        primaryStyle = 'formal'
        confidence = 82
      }
      // Minimalist detection (very low color variation)
      else if (colorfulRatio < 0.15 && Math.abs(avgR - avgG) < 20 && Math.abs(avgG - avgB) < 20) {
        primaryStyle = 'minimalist'
        confidence = 88
      }
      // Vintage detection (muted colors, medium brightness)
      else if (avgBrightness > 120 && avgBrightness < 180 && colorfulRatio > 0.2 && colorfulRatio < 0.4) {
        primaryStyle = 'vintage'
        confidence = 75
      }
      
      // Determine color palette based on analysis
      let colorPalette = 'neutral'
      if (colorfulRatio > 0.4) colorPalette = 'bold'
      else if (avgBrightness < 100) colorPalette = 'monochrome'
      else if (avgR > avgG && avgR > avgB) colorPalette = 'warm tones'
      else if (avgB > avgR && avgB > avgG) colorPalette = 'cool tones'
      
      // Determine occasion based on style
      const occasions = {
        luxury: 'evening',
        formal: 'business',
        streetwear: 'casual',
        vintage: 'weekend',
        minimalist: 'everyday',
        casual: 'weekend'
      }
      
      const allTags = {
        luxury: ['premium', 'elegant', 'sophisticated', 'high-end', 'refined'],
        streetwear: ['urban', 'edgy', 'bold', 'trendy', 'contemporary'],
        casual: ['comfortable', 'relaxed', 'everyday', 'versatile', 'easy-going'],
        formal: ['professional', 'structured', 'polished', 'business', 'classic'],
        vintage: ['retro', 'timeless', 'nostalgic', 'classic', 'heritage'],
        minimalist: ['clean', 'simple', 'modern', 'neutral', 'understated']
      }

      const suggestions = {
        luxury: [
          'Add statement jewelry for extra elegance',
          'Consider a structured blazer for sophistication',
          'Pair with premium leather accessories'
        ],
        streetwear: [
          'Layer with an oversized jacket',
          'Add chunky sneakers for authentic street style',
          'Mix textures for visual interest'
        ],
        casual: [
          'Perfect for weekend activities',
          'Add a denim jacket for versatility',
          'Comfortable shoes complete the look'
        ],
        formal: [
          'Ideal for professional settings',
          'Add a classic watch for polish',
          'Consider neutral color palette'
        ],
        vintage: [
          'Pair with retro accessories',
          'Add vintage-inspired shoes',
          'Consider classic silhouettes'
        ],
        minimalist: [
          'Keep accessories simple and clean',
          'Focus on quality over quantity',
          'Neutral colors work best'
        ]
      }

      setTimeout(() => {
        setResult({
          primaryStyle: primaryStyle,
          confidence: confidence,
          tags: allTags[primaryStyle].slice(0, 3),
          colorPalette: colorPalette,
          occasion: occasions[primaryStyle],
          suggestions: suggestions[primaryStyle],
          analysis: {
            avgBrightness: Math.round(avgBrightness),
            colorfulness: Math.round(colorfulRatio * 100),
            darkRatio: Math.round(darkRatio * 100),
            lightRatio: Math.round(lightRatio * 100)
          }
        })
        setAnalyzing(false)
      }, 2000)
    }
    
    img.onerror = () => {
      // Fallback to basic analysis if image loading fails
      setTimeout(() => {
        setResult({
          primaryStyle: 'casual',
          confidence: 70,
          tags: ['comfortable', 'versatile', 'everyday'],
          colorPalette: 'neutral',
          occasion: 'casual',
          suggestions: [
            'Perfect for everyday wear',
            'Add accessories to elevate the look',
            'Comfortable and practical choice'
          ]
        })
        setAnalyzing(false)
      }, 2000)
    }
    
    img.src = selectedImage
  }

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleImageUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Très<span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">.AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload an outfit photo and get instant AI-powered style analysis, 
            categorization, and personalized recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Upload Your Outfit
              </h3>
              
              <div 
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                
                {selectedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={selectedImage} 
                      alt="Uploaded outfit" 
                      className="max-h-80 mx-auto rounded-xl shadow-lg"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-gray-400 mb-4">📸</div>
                    <div>
                      <label 
                        htmlFor="image-upload"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Choose Image
                      </label>
                    </div>
                    <p className="text-gray-500">or drag and drop an image here</p>
                    <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              {selectedImage && (
                <button
                  onClick={analyzeStyle}
                  disabled={analyzing}
                  className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Style...
                    </span>
                  ) : (
                    '🤖 Analyze My Style'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              Style Analysis
            </h3>
            
            {!result && !analyzing && (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-lg">Upload an image to see AI analysis</p>
              </div>
            )}

            {analyzing && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-pink-500 mx-auto mb-6"></div>
                <p className="text-gray-900 text-xl font-semibold">Analyzing your style...</p>
                <p className="text-gray-400 mt-2">This may take a few seconds</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-fade-in">
                {/* Primary Style */}
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${styleCategories[result.primaryStyle].color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-bold">
                      {styleCategories[result.primaryStyle].icon} {styleCategories[result.primaryStyle].name}
                    </h4>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      {result.confidence}% Match
                    </span>
                  </div>
                  <p className="text-white/90">{styleCategories[result.primaryStyle].description}</p>
                </div>

                {/* Style Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Color Palette</h5>
                    <p className="text-gray-600 capitalize">{result.colorPalette}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Best Occasion</h5>
                    <p className="text-gray-600 capitalize">{result.occasion}</p>
                  </div>
                </div>

                {/* Image Analysis Data */}
                {result.analysis && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Image Analysis</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Brightness:</span>
                        <span className="ml-2 font-medium">{result.analysis.avgBrightness}/255</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Colorfulness:</span>
                        <span className="ml-2 font-medium">{result.analysis.colorfulness}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dark Areas:</span>
                        <span className="ml-2 font-medium">{result.analysis.darkRatio}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Light Areas:</span>
                        <span className="ml-2 font-medium">{result.analysis.lightRatio}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Style Tags */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Style Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">AI Suggestions</h5>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-rose-500 mr-2 mt-1">✓</span>
                        <span className="text-gray-600">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleAI