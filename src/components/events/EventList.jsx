'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import EventFilters from './EventFilters'
import EventSort from './EventSort'
import EventGrid from './EventGrid'

export default function EventList({ events, loading }) {    
  const [filteredEvents, setFilteredEvents] = useState([])  
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  useEffect(() => {
    setFilteredEvents(events)
  }, [events])

  const filterOptions = {
    categories: ['Marathon', 'Trail', 'Virtual', 'Charity', 'Fun Run'],
    locations: ['Jakarta', 'Surabaya', 'Bali', 'Bandung', 'Yogyakarta', 'Online'],
    difficulties: ['Beginner', 'Intermediate', 'Expert'],
    priceRange: { min: 0, max: 500000 }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{events.length}+</div>
          <div className="text-gray-600">Event Aktif</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">25+</div>
          <div className="text-gray-600">Kota</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">10K+</div>
          <div className="text-gray-600">Peserta</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50+</div>
          <div className="text-gray-600">Penyelenggara</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <EventFilters 
            options={filterOptions}
            onFilterChange={setFilteredEvents}
            events={events}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Results Count */}
              <div className="text-gray-600">
                Menampilkan <span className="font-semibold text-primary">{filteredEvents.length}</span> dari{' '}
                <span className="font-semibold">{events.length}</span> event
              </div>

              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon icon="mdi:view-grid" width="20" height="20" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon icon="mdi:view-list" width="20" height="20" />
                  </button>
                </div>

                {/* Sort */}
                <EventSort onSortChange={setFilteredEvents} events={filteredEvents} />

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon icon="mdi:filter" width="20" height="20" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid/List */}
          <EventGrid 
            events={filteredEvents} 
            loading={loading}
            viewMode={viewMode}
          />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Filter Event</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Icon icon="mdi:close" width="24" height="24" />
                </button>
              </div>
              <EventFilters 
                options={filterOptions}
                onFilterChange={setFilteredEvents}
                events={events}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}