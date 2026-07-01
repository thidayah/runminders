'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [currentReview, setCurrentReview] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews?limit=10')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data.items.length > 0) {
          setReviews(result.data.items)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) return
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const nextReview = () => setCurrentReview(prev => (prev + 1) % reviews.length)
  const prevReview = () => setCurrentReview(prev => (prev - 1 + reviews.length) % reviews.length)

  if (loading) return null
  if (reviews.length === 0) return null

  const review = reviews[currentReview]

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-8 text-6xl text-primary opacity-10">"</div>

            <div className="text-center relative z-10">
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 font-light italic">
                "{review.comment}"
              </blockquote>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-neutral-800">{review.name}</div>
                  {review.role && <div className="text-xs text-gray-600">{review.role}</div>}
                  {review.event_name && (
                    <div className="text-sm text-primary font-medium">{review.event_name}</div>
                  )}
                </div>
              </div>
            </div>

            {reviews.length > 1 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={prevReview}
                  className="p-3 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentReview ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextReview}
                  className="p-3 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
