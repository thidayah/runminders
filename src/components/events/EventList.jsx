'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import EventFilters from './EventFilters'
import EventSort from './EventSort'
import EventGrid from './EventGrid'
import Button from '@/components/ui/Button'

export default function EventList({
  events,
  loading,
  loadingMore,
  error,
  pagination,
  onLoadMore,
  filters,
  onFilterChange
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const filterOptions = {
    categories: ['Marathon', 'Fun Run', 'Trail', 'Charity', 'Virtual'],
    locations: ['Jakarta', 'Bandung', 'Online'],
    priceRange: { min: 0, max: 1000000 }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <EventFilters
            options={filterOptions}
            onFilterChange={onFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Results Count */}
              <div className="text-gray-600">
                Menampilkan <span className="font-semibold text-primary">{events.length}</span> dari{' '}
                <span className="font-semibold">{pagination.totalItems}</span> event
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
                <EventSort 
                  onSortChange={onFilterChange}
                  currentSort={filters.sort_by}
                  currentSortOrder={filters.sort_order}
                />

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
            events={events}
            loading={loading}
            viewMode={viewMode}
          />

          {/* Load More Button */}
          {pagination.hasNextPage && events.length > 0 && (
            <div className="text-center mt-12 mb-8">
              <Button
                onClick={onLoadMore}
                loading={loadingMore}
                variant="outline"
                className="min-w-[200px]"
              >
                {loadingMore ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin mr-2" />
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </Button>
              <p className="text-gray-500 text-sm mt-2">
                Menampilkan {events.length} dari {pagination.totalItems} event
              </p>
            </div>
          )}
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
                onFilterChange={onFilterChange}
                currentFilters={filters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}