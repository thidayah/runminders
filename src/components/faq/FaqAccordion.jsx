import { Icon } from '@iconify/react'

export default function FaqAccordion({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <Icon 
          icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
          width="24" 
          height="24" 
          className="text-gray-500 flex-shrink-0"
        />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}