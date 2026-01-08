'use client'

import { Icon } from "@iconify/react"
import { useState } from 'react'

export default function EventGallery({ event }) {
  const [selectedImage, setSelectedImage] = useState(null)

  // Sample gallery data - bisa dari event.gallery
  const galleryImages = event.gallery || [
    "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  ]

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Galeri Event</h2>
        <div className="text-gray-600">
          {galleryImages.length} foto
        </div>
      </div>

      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 text-white text-lg">
                <Icon icon="mdi:zoom-in-cursor" width="20" height="20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Image View */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={() => {
                  const currentIndex = galleryImages.indexOf(selectedImage)
                  const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
                  setSelectedImage(galleryImages[prevIndex])
                }}
                className="ml-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                ←
              </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={() => {
                  const currentIndex = galleryImages.indexOf(selectedImage)
                  const nextIndex = (currentIndex + 1) % galleryImages.length
                  setSelectedImage(galleryImages[nextIndex])
                }}
                className="mr-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                →
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {galleryImages.indexOf(selectedImage) + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}