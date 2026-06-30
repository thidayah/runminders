'use client'

import { useState } from 'react'
import FaqAccordion from './FaqAccordion'
import { faqCategories, faqData } from '@/data/faq'

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (category, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeCategory === category.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-8">
        <div className="space-y-4">
          {faqData[activeCategory]?.map((faq, index) => (
            <FaqAccordion
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems[`${activeCategory}-${index}`]}
              onToggle={() => toggleItem(activeCategory, index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Masih ada pertanyaan?
          </h3>
          <p className="text-gray-600 mb-4">
            Tim support kami siap membantu menjawab pertanyaan Anda
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  )
}