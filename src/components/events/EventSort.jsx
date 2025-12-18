'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function EventSort({ onSortChange, events }) {
  const [sortBy, setSortBy] = useState('newest')

  const sortOptions = [
    { value: 'newest', label: 'Terbaru', icon: 'mdi:sort-calendar-descending' },
    { value: 'oldest', label: 'Terlama', icon: 'mdi:sort-calendar-ascending' },
    { value: 'price-low', label: 'Harga Terendah', icon: 'mdi:sort-numeric-ascending' },
    { value: 'price-high', label: 'Harga Tertinggi', icon: 'mdi:sort-numeric-descending' },
    { value: 'popular', label: 'Populer', icon: 'mdi:trending-up' },
    { value: 'participants', label: 'Peserta Terbanyak', icon: 'mdi:account-group' }
  ]

  const handleSortChange = (value) => {
    setSortBy(value)
    
    let sortedEvents = [...events]
    
    switch (value) {
      case 'newest':
        sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'oldest':
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'price-low':
        sortedEvents.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sortedEvents.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        sortedEvents.sort((a, b) => parseInt(b.participants) - parseInt(a.participants))
        break
      case 'participants':
        sortedEvents.sort((a, b) => {
          const aParticipants = parseInt(a.participants.replace('k', '000'))
          const bParticipants = parseInt(b.participants.replace('k', '000'))
          return bParticipants - aParticipants
        })
        break
      default:
        break
    }
    
    onSortChange(sortedEvents)
  }

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
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