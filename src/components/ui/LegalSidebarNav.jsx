'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function LegalSidebarNav({ sections }) {
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 100
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({ top: elementPosition, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Mobile: collapsible Daftar Isi — hidden on lg+ */}
      <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="flex items-center justify-between w-full px-5 py-4 text-left cursor-pointer"
        >
          <span className="flex items-center gap-2 font-semibold text-gray-800">
            <Icon icon="mdi:table-of-contents" width="18" height="18" className="text-primary" />
            Daftar Isi
          </span>
          <Icon
            icon="mdi:chevron-down"
            width="20"
            height="20"
            className={`text-gray-400 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {mobileOpen && (
          <nav className="border-t border-gray-100 px-3 pb-3 pt-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  scrollTo(section.id)
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSection === section.id
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon icon={section.icon} width="16" height="16" className="shrink-0 text-gray-400" />
                <span className="text-sm">{section.title}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar — hidden below lg */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
        <h3 className="font-semibold text-gray-800 mb-4">Pada Halaman Ini</h3>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
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
                className="shrink-0 text-gray-500"
              />
              <span className="text-sm">{section.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
