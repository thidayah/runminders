'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

export default function EventSort({ onSortChange, currentSort, currentSortOrder }) {
  const [sortConfig, setSortConfig] = useState({
    sort_by: currentSort || 'event_date',
    sort_order: currentSortOrder || 'asc'
  })

  // Update local state when parent sort changes
  useEffect(() => {
    setSortConfig({
      sort_by: currentSort || 'event_date',
      sort_order: currentSortOrder || 'asc'
    })
  }, [currentSort, currentSortOrder])

  const sortOptions = [
    { value: 'event_date', label: 'Terbaru', order: 'asc' },
    { value: 'event_date', label: 'Terlama', order: 'desc' },
    { value: 'base_price', label: 'Harga Terendah', order: 'asc' },
    { value: 'base_price', label: 'Harga Tertinggi', order: 'desc' },
    { value: 'current_participants', label: 'Peserta Terbanyak', order: 'desc' },
    // { value: 'views', label: 'Populer', order: 'desc' },
    { value: 'title', label: 'Nama A-Z', order: 'asc' },
    { value: 'title', label: 'Nama Z-A', order: 'desc' }
  ]

  const handleSortChange = (value) => {
    // Parse value from select (format: "sort_by-order")
    const [sort_by, sort_order] = value.split('-')
    setSortConfig({ sort_by, sort_order })    
    onSortChange({ sort_by, sort_order })
  }

  // Format current value for select
  const currentValue = `${sortConfig.sort_by}-${sortConfig.sort_order}`
  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent bg-white cursor-pointer"
      >
        {sortOptions.map((option, index) => (
          <option 
            key={`${option.value}-${option.order}-${index}`} 
            value={`${option.value}-${option.order}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      <Icon 
        icon="mdi:sort" 
        width="20" 
        height="20" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      
      <Icon 
        icon="mdi:chevron-down" 
        width="20" 
        height="20" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )
}