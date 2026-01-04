function About() {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'AI Research Lead',
      bio: 'PhD in Machine Learning, specializing in computer vision and fashion analytics.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Fashion Director',
      bio: '15+ years in luxury fashion, former stylist for major fashion houses.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Data Scientist',
      bio: 'Expert in trend forecasting and consumer behavior analysis.'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Très.Now</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing fashion intelligence through AI, helping brands and individuals 
            understand, predict, and capitalize on emerging trends.
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative mb-20 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-pink-800 to-rose-900 h-96">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="text-white p-12 max-w-2xl">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-4xl font-bold mb-4">Fashion Meets Intelligence</h2>
              <p className="text-xl text-gray-200">
                Combining decades of fashion expertise with cutting-edge AI to decode 
                the future of style.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To democratize fashion intelligence by making trend analysis and style insights 
              accessible to everyone, from individual fashion enthusiasts to global brands.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world where fashion decisions are informed by data, creativity is enhanced by AI, 
              and everyone can express their unique style with confidence.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 mb-20 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-300">
              Our technology stack combines multiple AI models for comprehensive fashion analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Computer Vision</h3>
              <p className="text-gray-300">Advanced image recognition for style categorization and trend detection</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
              <p className="text-gray-300">Machine learning models that forecast upcoming fashion trends</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Natural Language Processing</h3>
              <p className="text-gray-300">Sentiment analysis and trend extraction from fashion content</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Fashion experts and AI researchers working together to shape the future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-8 text-center group hover:shadow-2xl transition-all duration-300">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                  👤
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-rose-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">What makes our fashion intelligence platform unique</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">AI</div>
              <div className="text-gray-600">Style Analysis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">Smart</div>
              <div className="text-gray-600">Trend Detection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">Real-time</div>
              <div className="text-gray-600">Fashion Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">Modern</div>
              <div className="text-gray-600">User Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About