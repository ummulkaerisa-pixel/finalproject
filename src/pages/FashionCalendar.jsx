import { useState, useEffect } from 'react'

// Fashion events data for 2026
const fashionEvents = {
  '2026-01': [
    { date: 15, title: 'Paris Haute Couture Week', type: 'runway', location: 'Paris', description: 'Spring/Summer 2026 Haute Couture collections' },
    { date: 22, title: 'Milan Men\'s Fashion Week', type: 'runway', location: 'Milan', description: 'Fall/Winter 2026 menswear collections' },
    { date: 28, title: 'Pitti Uomo', type: 'trade', location: 'Florence', description: 'International menswear trade show' }
  ],
  '2026-02': [
    { date: 5, title: 'New York Fashion Week', type: 'runway', location: 'New York', description: 'Fall/Winter 2026 ready-to-wear collections' },
    { date: 12, title: 'London Fashion Week', type: 'runway', location: 'London', description: 'Fall/Winter 2026 collections' },
    { date: 19, title: 'Milan Fashion Week', type: 'runway', location: 'Milan', description: 'Fall/Winter 2026 women\'s collections' },
    { date: 26, title: 'Paris Fashion Week', type: 'runway', location: 'Paris', description: 'Fall/Winter 2026 ready-to-wear' }
  ],
  '2026-03': [
    { date: 8, title: 'International Women\'s Day Fashion Summit', type: 'conference', location: 'Global', description: 'Celebrating women in fashion' },
    { date: 15, title: 'Sustainable Fashion Week', type: 'conference', location: 'Copenhagen', description: 'Focus on eco-friendly fashion' },
    { date: 22, title: 'Fashion Revolution Week', type: 'activism', location: 'Global', description: 'Who made my clothes campaign' }
  ],
  '2026-04': [
    { date: 3, title: 'Tokyo Fashion Week', type: 'runway', location: 'Tokyo', description: 'Spring/Summer 2027 collections' },
    { date: 10, title: 'Australian Fashion Week', type: 'runway', location: 'Sydney', description: 'Resort 2027 collections' },
    { date: 18, title: 'Fashion Tech Conference', type: 'conference', location: 'San Francisco', description: 'Innovation in fashion technology' }
  ],
  '2026-05': [
    { date: 1, title: 'Met Gala', type: 'gala', location: 'New York', description: 'Fashion\'s biggest night - theme TBA' },
    { date: 15, title: 'Cannes Film Festival Fashion', type: 'red-carpet', location: 'Cannes', description: 'Red carpet fashion moments' },
    { date: 25, title: 'CFDA Fashion Awards', type: 'awards', location: 'New York', description: 'Celebrating American fashion' }
  ],
  '2026-06': [
    { date: 8, title: 'London Men\'s Fashion Week', type: 'runway', location: 'London', description: 'Spring/Summer 2027 menswear' },
    { date: 15, title: 'Milan Men\'s Fashion Week', type: 'runway', location: 'Milan', description: 'Spring/Summer 2027 menswear' },
    { date: 22, title: 'Paris Men\'s Fashion Week', type: 'runway', location: 'Paris', description: 'Spring/Summer 2027 menswear' }
  ]
}

const eventTypeColors = {
  runway: 'from-rose-400 to-pink-600',
  trade: 'from-blue-400 to-indigo-600',
  conference: 'from-emerald-400 to-teal-600',
  activism: 'from-purple-400 to-violet-600',
  gala: 'from-amber-400 to-orange-600',
  'red-carpet': 'from-red-400 to-rose-600',
  awards: 'from-yellow-400 to-amber-600'
}

const eventTypeIcons = {
  runway: '👗',
  trade: '🏢',
  conference: '🎤',
  activism: '✊',
  gala: '✨',
  'red-carpet': '🎬',
  awards: '🏆'
}

function FashionCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getCurrentMonthKey = () => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`
  }

  const getCurrentMonthEvents = () => {
    return fashionEvents[getCurrentMonthKey()] || []
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const events = getCurrentMonthEvents()
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(event => event.date === day)
      const isToday = day === currentDate.getDate() && 
                     selectedMonth === currentDate.getMonth() && 
                     selectedYear === currentDate.getFullYear()
      
      days.push(
        <div key={day} className={`h-24 border border-gray-200 p-2 ${isToday ? 'bg-rose-50 border-rose-300' : 'hover:bg-gray-50'}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-rose-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <button
                key={index}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left text-xs p-1 rounded bg-gradient-to-r ${eventTypeColors[event.type]} text-white truncate hover:shadow-md transition-all`}
                title={event.title}
              >
                <span className="mr-1">{eventTypeIcons[event.type]}</span>
                {event.title}
              </button>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  const renderEventsList = () => {
    const events = getCurrentMonthEvents()
    
    return (
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{eventTypeIcons[event.type]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{event.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${eventTypeColors[event.type]} text-white`}>
                    {event.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {months[selectedMonth]} {event.date}, {selectedYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events this month</h3>
            <p className="text-gray-500">Check other months for upcoming fashion events</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fashion <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Calendar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay updated with fashion weeks, industry events, and important dates in the fashion world
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'calendar' 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📅 Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 List View
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-rose-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {months[selectedMonth]} {selectedYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-rose-600 transition-colors"
          >
            Next
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Content */}
        {viewMode === 'calendar' ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {renderCalendarGrid()}
            </div>
          </div>
        ) : (
          renderEventsList()
        )}

        {/* Event Types Legend */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(eventTypeColors).map(([type, gradient]) => (
              <div key={type} className="text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-xl">{eventTypeIcons[type]}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Highlights */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Never Miss a Fashion Moment</h2>
            <p className="text-xl text-gray-300 mb-8">
              From Paris Fashion Week to the Met Gala, stay connected to the fashion world's most important events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Add to Calendar
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                Download Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${eventTypeColors[selectedEvent.type]} text-white`}>
                {selectedEvent.type.replace('-', ' ').toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">{eventTypeIcons[selectedEvent.type]}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
              <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>📍 {selectedEvent.location}</span>
                <span>📅 {months[selectedMonth]} {selectedEvent.date}, {selectedYear}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FashionCalendar