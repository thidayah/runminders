import { useState } from 'react'
import { Icon } from '@iconify/react'

import EventHeader from './EventHeader'
import EventInfo from './EventInfo'
import EventRegistration from './EventRegistration'
// import EventGallery from './EventGallery'
import EventMap from './EventMap'
// import EventReviews from './EventReviews'
// import RelatedEvents from './RelatedEvents'

export default function EventDetail({ event }) {
  const [activeTab, setActiveTab] = useState('info') 

  const tabs = [
    {
      id: 'info',
      name: 'Informasi',
      icon: <Icon icon="mdi:information-outline" width="20" height="20" />
    },
    {
      id: 'location',
      name: 'Lokasi',
      icon: <Icon icon="mdi:map-marker-outline" width="20" height="20" />
    },
    // {
    //   id: 'gallery',
    //   name: 'Galeri',
    //   icon: <Icon icon="mdi:image-multiple" width="20" height="20" />
    // },
    // {
    //   id: 'reviews',
    //   name: 'Testimoni',
    //   icon: <Icon icon="mdi:star-outline" width="20" height="20" />
    // }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Header */}
      <EventHeader event={event} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                      }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'info' && <EventInfo event={event} />}
              {activeTab === 'location' && <EventMap event={event} />}
              {/* {activeTab === 'gallery' && <EventGallery event={event} />}
              {activeTab === 'reviews' && <EventReviews event={event} />} */}
            </div>
          </div>

          {/* Sidebar - Registration */}
          <div className="lg:col-span-1">
            <EventRegistration event={event} />
          </div>
        </div>

        {/* Related Events */}
        {/* <RelatedEvents currentEventId={event.id} /> */}
      </div>
    </div>
  )
}