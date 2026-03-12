'use client'

import { useState, useEffect } from 'react'

const reviews = [
  {
    id: 1,
    name: 'Andi Pratama',
    role: 'Pelari Marathon',
    avatar: '/avatars/andi.jpg',
    rating: 5,
    comment: 'Platform yang sangat membantu! Dari registrasi sampai pembayaran semuanya mudah dan cepat. Sudah 5 event saya ikuti melalui Runminders.',
    event: 'Jakarta Marathon 2024'
  },
  {
    id: 2,
    name: 'Sarah Wijaya',
    role: 'Pelari Pemula',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    comment: 'Sebagai pemula, saya sangat terbantu dengan kategori level yang disediakan. Event untuk pemula benar-benar ramah dan menyenangkan!',
    event: 'Fun Run 5K Bandung'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Pelari Professional',
    avatar: '/avatars/budi.jpg',
    rating: 4,
    comment: 'Platform yang bagus untuk menemukan event-event besar. Fitur virtual race-nya sangat membantu saat saya tidak bisa hadir fisik.',
    event: 'Surabaya International Marathon'
  },
  {
    id: 4,
    name: 'Maya Sari',
    role: 'Pelari Trail',
    avatar: '/avatars/maya.jpg',
    rating: 5,
    comment: 'Komunitasnya sangat aktif dan supportive. Saya menemukan banyak teman lari dan event trail yang seru melalui Runminders.',
    event: 'Bali Trail Challenge'
  }
]

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Kata Mereka
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Dengarkan pengalaman langsung dari pelari yang telah mengikuti berbagai event di Runminders
          </p>
        </div>

        {/* Main Review Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-8 text-6xl text-primary opacity-10">
              "
            </div>
            
            {/* Review Content */}
            <div className="text-center relative z-10">
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < reviews[currentReview].rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 font-light italic">
                "{reviews[currentReview].comment}"
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {reviews[currentReview].name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-neutral-800">
                    {reviews[currentReview].name}
                  </div>
                  <div className="text-gray-600">{reviews[currentReview].role}</div>
                  <div className="text-sm text-primary font-medium">
                    {reviews[currentReview].event}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
              >
                ←
              </button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentReview
                        ? 'bg-primary'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
              >
                →
              </button>
            </div>
          </div>

          {/* Additional Mini Reviews */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  )
}