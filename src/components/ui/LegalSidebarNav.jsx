'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function LegalSidebarNav({ sections }) {
  const [activeSection, setActiveSection] = useState('')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <h3 className="font-semibold text-gray-800 mb-4">Pada Halaman Ini</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id)
              const element = document.getElementById(section.id)
              if (element) {
                const headerHeight = 100
                const elementPosition = element.offsetTop - headerHeight
                window.scrollTo({ top: elementPosition, behavior: 'smooth' })
              }
            }}
            className={`flex items-center gap-3 w-full text-left py-3 rounded-lg cursor-pointer transition-colors ${
              activeSection === section.id
                ? 'bg-white text-primary font-bold'
                : 'text-gray-700 hover:text-primary hover:bg-white'
            }`}
          >
            <Icon
              icon={section.icon}
              width="18"
              height="18"
              className="flex-shrink-0 text-gray-500"
            />
            <span className="text-sm">{section.title}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
