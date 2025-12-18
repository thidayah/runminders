'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function EventFilters({ options, onFilterChange, events }) {
  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    difficulties: [],
    priceRange: options.priceRange,
    dateRange: '',
    search: ''
  })

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters }
    
    if (Array.isArray(newFilters[filterType])) {
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value)
      } else {
        newFilters[filterType] = [...newFilters[filterType], value]
      }
    } else {
      newFilters[filterType] = value
    }
    
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (filterSettings) => {
    let filtered = events

    // Category filter
    if (filterSettings.categories.length > 0) {
      filtered = filtered.filter(event => 
        event.categories.some(cat => filterSettings.categories.includes(cat))
      )
    }

    // Location filter
    if (filterSettings.locations.length > 0) {
      filtered = filtered.filter(event =>
        filterSettings.locations.some(location => event.location.includes(location))
      )
    }

    // Difficulty filter
    if (filterSettings.difficulties.length > 0) {
      filtered = filtered.filter(event =>
        filterSettings.difficulties.includes(event.difficulty)
      )
    }

    // Price filter
    filtered = filtered.filter(event =>
      event.price >= filterSettings.priceRange.min &&
      event.price <= filterSettings.priceRange.max
    )

    onFilterChange(filtered)
  }

  const clearFilters = () => {
    const resetFilters = {
      categories: [],
      locations: [],
      difficulties: [],
      priceRange: options.priceRange,
      dateRange: '',
      search: ''
    }
    setFilters(resetFilters)
    onFilterChange(events)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
        <button
          onClick={clearFilters}
          className="text-primary hover:text-primary/90 hover:underline text-sm font-medium cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cari Event
        </label>
        <div className="relative">
          <Icon 
            icon="mdi:magnify" 
            width="20" 
            height="20" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari event..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Kategori</h4>
        <div className="space-y-2">
          {options.categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleFilterChange('categories', category)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Lokasi</h4>
        <div className="space-y-2">
          {options.locations.map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.locations.includes(location)}
                onChange={() => handleFilterChange('locations', location)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Tingkat Kesulitan</h4>
        <div className="space-y-2">
          {options.difficulties.map((difficulty) => (
            <label key={difficulty} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.difficulties.includes(difficulty)}
                onChange={() => handleFilterChange('difficulties', difficulty)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{difficulty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">
          Rentang Harga: Rp {filters.priceRange.min.toLocaleString('id-ID')} - Rp {filters.priceRange.max.toLocaleString('id-ID')}
        </h4>
        <input
          type="range"
          min="0"
          max="500000"
          step="50000"
          value={filters.priceRange.max}
          onChange={(e) => handleFilterChange('priceRange', {
            ...filters.priceRange,
            max: parseInt(e.target.value)
          })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Rp 0</span>
          <span>Rp 500.000</span>
        </div>
      </div>

      {/* Date Range */}
      {/* <div>
        <h4 className="font-medium text-gray-800 mb-3">Tanggal</h4>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Semua Tanggal</option>
          <option value="upcoming">Mendatang</option>
          <option value="thisMonth">Bulan Ini</option>
          <option value="nextMonth">Bulan Depan</option>
          <option value="thisYear">Tahun Ini</option>
        </select>
      </div> */}
    </div>
  )
}