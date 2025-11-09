'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

const categories = [
  { id: 'all', name: 'Semua', count: 128 },
  { id: 'offline', name: 'Offline', count: 89 },
  { id: 'virtual', name: 'Virtual', count: 39 },
  { id: '5k', name: '5K', count: 45 },
  { id: '10k', name: '10K', count: 52 },
  { id: 'half-marathon', name: 'Half Marathon', count: 18 },
  { id: 'marathon', name: 'Marathon', count: 13 }
]

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Kategori Race
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan event lari sesuai dengan preferensi dan level kemampuanmu
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2 ${
                activeCategory === category.id
                  ? 'bg-primary border-primary text-white shadow-lg transform scale-105'
                  : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center gap-2">
                {category.name}
                <span className={`text-sm px-2 py-1 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Level Badges */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-800 mb-6">
            Pilih Berdasarkan Level
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { level: 'Pemula', color: 'bg-green-100 text-green-800 border-green-200' },
              { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { level: 'Expert', color: 'bg-red-100 text-red-800 border-red-200' }
            ].map((item) => (
              <span
                key={item.level}
                className={`px-6 py-3 rounded-full border-2 font-medium cursor-pointer hover:shadow-md transition-all ${item.color}`}
              >
                {item.level}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}