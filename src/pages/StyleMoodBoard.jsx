import { useState, useRef, useEffect } from 'react'

// Predefined style elements for mood boards
const styleElements = {
  colors: [
    { name: 'Rose Gold', hex: '#E8B4B8', gradient: 'from-rose-300 to-pink-400' },
    { name: 'Sage Green', hex: '#9CAF88', gradient: 'from-green-300 to-emerald-400' },
    { name: 'Lavender', hex: '#B19CD9', gradient: 'from-purple-300 to-violet-400' },
    { name: 'Cream', hex: '#F5F5DC', gradient: 'from-yellow-100 to-amber-200' },
    { name: 'Dusty Blue', hex: '#6B8CAE', gradient: 'from-blue-300 to-indigo-400' },
    { name: 'Terracotta', hex: '#E07A5F', gradient: 'from-orange-300 to-red-400' },
    { name: 'Charcoal', hex: '#36454F', gradient: 'from-gray-600 to-gray-800' },
    { name: 'Blush', hex: '#FFC0CB', gradient: 'from-pink-200 to-rose-300' }
  ],
  textures: [
    { name: 'Silk', pattern: 'Smooth & Lustrous', emoji: '✨' },
    { name: 'Velvet', pattern: 'Rich & Plush', emoji: '🌙' },
    { name: 'Linen', pattern: 'Natural & Breathable', emoji: '🌾' },
    { name: 'Leather', pattern: 'Structured & Bold', emoji: '🖤' },
    { name: 'Cashmere', pattern: 'Soft & Luxurious', emoji: '☁️' },
    { name: 'Denim', pattern: 'Casual & Durable', emoji: '💙' },
    { name: 'Lace', pattern: 'Delicate & Feminine', emoji: '🌸' },
    { name: 'Tweed', pattern: 'Classic & Textured', emoji: '🍂' }
  ],
  moods: [
    { name: 'Minimalist', description: 'Clean lines, neutral tones', icon: '⚪' },
    { name: 'Bohemian', description: 'Free-spirited, eclectic mix', icon: '🌻' },
    { name: 'Romantic', description: 'Soft, feminine, dreamy', icon: '💕' },
    { name: 'Edgy', description: 'Bold, unconventional, striking', icon: '⚡' },
    { name: 'Classic', description: 'Timeless, elegant, refined', icon: '👑' },
    { name: 'Streetwear', description: 'Urban, casual, trendy', icon: '🏙️' },
    { name: 'Vintage', description: 'Retro, nostalgic, unique', icon: '📻' },
    { name: 'Glamorous', description: 'Luxurious, dramatic, bold', icon: '✨' }
  ]
}

function StyleMoodBoard() {
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedTextures, setSelectedTextures] = useState([])
  const [selectedMoods, setSelectedMoods] = useState([])
  const [boardTitle, setBoardTitle] = useState('My Style Vision')
  const [notes, setNotes] = useState('')
  const [savedBoards, setSavedBoards] = useState([])
  const canvasRef = useRef(null)

  // Load saved boards from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('tres-mood-boards')
    if (saved) {
      setSavedBoards(JSON.parse(saved))
    }
  }, [])

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    if (selectedArray.find(selected => selected.name === item.name)) {
      setSelectedArray(selectedArray.filter(selected => selected.name !== item.name))
    } else {
      setSelectedArray([...selectedArray, item])
    }
  }

  const saveMoodBoard = () => {
    const newBoard = {
      id: Date.now(),
      title: boardTitle,
      colors: selectedColors,
      textures: selectedTextures,
      moods: selectedMoods,
      notes: notes,
      createdAt: new Date().toISOString()
    }
    
    const updated = [...savedBoards, newBoard]
    setSavedBoards(updated)
    localStorage.setItem('tres-mood-boards', JSON.stringify(updated))
    
    // Reset form
    setBoardTitle('My Style Vision')
    setSelectedColors([])
    setSelectedTextures([])
    setSelectedMoods([])
    setNotes('')
    
    // Show success message
    alert('Mood board saved successfully!')
  }

  const deleteMoodBoard = (boardId) => {
    const updated = savedBoards.filter(board => board.id !== boardId)
    setSavedBoards(updated)
    localStorage.setItem('tres-mood-boards', JSON.stringify(updated))
  }

  const loadMoodBoard = (board) => {
    setBoardTitle(board.title)
    setSelectedColors(board.colors)
    setSelectedTextures(board.textures)
    setSelectedMoods(board.moods)
    setNotes(board.notes)
    
    // Scroll to top to see the loaded board
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearBoard = () => {
    setSelectedColors([])
    setSelectedTextures([])
    setSelectedMoods([])
    setNotes('')
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Style <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Mood Board</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create visual inspiration boards to define your personal style and fashion vision
          </p>
        </div>
        {/* Mood Board Creator */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Selection Tools */}
          <div className="space-y-8">
            {/* Board Title */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-lg font-semibold text-gray-900 mb-3">Board Title</label>
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter your mood board title..."
              />
            </div>

            {/* Color Palette */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
              <div className="grid grid-cols-4 gap-3">
                {styleElements.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                    className={`relative aspect-square rounded-lg bg-gradient-to-br ${color.gradient} transition-all duration-300 ${
                      selectedColors.find(c => c.name === color.name) 
                        ? 'ring-4 ring-rose-500 scale-105' 
                        : 'hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    {selectedColors.find(c => c.name === color.name) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedColors.map(color => (
                  <span key={color.name} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {color.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Textures */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Textures & Materials</h3>
              <div className="grid grid-cols-2 gap-3">
                {styleElements.textures.map(texture => (
                  <button
                    key={texture.name}
                    onClick={() => toggleSelection(texture, selectedTextures, setSelectedTextures)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedTextures.find(t => t.name === texture.name)
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{texture.emoji}</span>
                      <span className="font-medium text-gray-900">{texture.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{texture.pattern}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Moods */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Moods</h3>
              <div className="grid grid-cols-2 gap-3">
                {styleElements.moods.map(mood => (
                  <button
                    key={mood.name}
                    onClick={() => toggleSelection(mood, selectedMoods, setSelectedMoods)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedMoods.find(m => m.name === mood.name)
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{mood.icon}</span>
                      <span className="font-medium text-gray-900">{mood.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{mood.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <label className="block text-lg font-semibold text-gray-900 mb-3">Style Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder="Add your style inspiration notes, outfit ideas, or fashion goals..."
              />
            </div>
          </div>
          {/* Right Side - Mood Board Preview */}
          <div className="space-y-6">
            {/* Preview Board */}
            <div className="bg-white rounded-2xl p-8 shadow-lg min-h-[600px]">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{boardTitle}</h2>
                <p className="text-gray-600">Your Style Vision Board</p>
              </div>

              {/* Color Swatches */}
              {selectedColors.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedColors.map(color => (
                      <div key={color.name} className="text-center">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color.gradient} shadow-lg`}></div>
                        <p className="text-xs text-gray-600 mt-2">{color.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textures */}
              {selectedTextures.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Textures</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedTextures.map(texture => (
                      <div key={texture.name} className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-2xl block mb-1">{texture.emoji}</span>
                        <p className="text-sm font-medium text-gray-900">{texture.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moods */}
              {selectedMoods.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Style Moods</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedMoods.map(mood => (
                      <div key={mood.name} className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 text-center border border-rose-200">
                        <span className="text-2xl block mb-1">{mood.icon}</span>
                        <p className="text-sm font-medium text-gray-900">{mood.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {notes && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Style Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{notes}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {selectedColors.length === 0 && selectedTextures.length === 0 && selectedMoods.length === 0 && !notes && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Creating</h3>
                  <p className="text-gray-500">Select colors, textures, and moods to build your style vision</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={saveMoodBoard}
                disabled={selectedColors.length === 0 && selectedTextures.length === 0 && selectedMoods.length === 0}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Mood Board
              </button>
              <button
                onClick={clearBoard}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Saved Mood Boards Section */}
        {savedBoards.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Saved <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Mood Boards</span>
              </h2>
              <p className="text-xl text-gray-600">
                Your collection of style inspiration boards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedBoards.map(board => (
                <div key={board.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Board Preview */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{board.title}</h3>
                      <button
                        onClick={() => deleteMoodBoard(board.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete mood board"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Colors Preview */}
                    {board.colors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Colors</p>
                        <div className="flex flex-wrap gap-2">
                          {board.colors.slice(0, 6).map(color => (
                            <div
                              key={color.name}
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${color.gradient} shadow-sm`}
                              title={color.name}
                            ></div>
                          ))}
                          {board.colors.length > 6 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                              +{board.colors.length - 6}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Textures Preview */}
                    {board.textures.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Textures</p>
                        <div className="flex flex-wrap gap-1">
                          {board.textures.slice(0, 4).map(texture => (
                            <span key={texture.name} className="text-lg" title={texture.name}>
                              {texture.emoji}
                            </span>
                          ))}
                          {board.textures.length > 4 && (
                            <span className="text-xs text-gray-600 ml-1">
                              +{board.textures.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Moods Preview */}
                    {board.moods.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Moods</p>
                        <div className="flex flex-wrap gap-1">
                          {board.moods.slice(0, 3).map(mood => (
                            <span
                              key={mood.name}
                              className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {mood.icon} {mood.name}
                            </span>
                          ))}
                          {board.moods.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              +{board.moods.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Preview */}
                    {board.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{board.notes}</p>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="text-xs text-gray-400 mb-4">
                      Created {new Date(board.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => loadMoodBoard(board)}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Load Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Tips */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Style Mood Board Tips</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-3">Color Harmony</h3>
                <p className="text-gray-300">Choose 3-5 colors that complement each other and reflect your personal style aesthetic.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-3">Texture Balance</h3>
                <p className="text-gray-300">Mix different textures to create visual interest and depth in your outfits.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-xl font-semibold mb-3">Mood Consistency</h3>
                <p className="text-gray-300">Select moods that align with your lifestyle and the image you want to project.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleMoodBoard