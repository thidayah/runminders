'use client'

import { useState } from 'react'

export default function EventReviews({ event }) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  // Sample reviews data
  const reviews = event.reviews || [
    {
      id: 1,
      user: "Andi Pratama",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Event yang sangat terorganisir! Dari registrasi sampai finish semuanya smooth. Medali dan goodie bagnya keren banget!",
      date: "2024-01-15",
      category: "Marathon (42K)",
      verified: true
    },
    {
      id: 2,
      user: "Sarah Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      rating: 4,
      comment: "Sebagai pemula, 10K run ini perfect! Support dari volunteer sangat membantu. Akan ikut lagi tahun depan!",
      date: "2024-01-10",
      category: "10K Run",
      verified: true
    },
    {
      id: 3,
      user: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Pengalaman pertama ikut marathon dan sangat memorable! Route yang challenging tapi pemandangan kota Jakarta worth it!",
      date: "2024-01-08",
      category: "Marathon (42K)",
      verified: false
    }
  ]

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }))

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // Handle review submission
    console.log({ rating, review })
    setShowReviewForm(false)
    setRating(0)
    setReview('')
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Testimoni Peserta</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
              <div className="text-yellow-400 text-lg">⭐</div>
            </div>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{reviews.length} ulasan</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          ✍️ Tulis Ulasan
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Distribusi Rating</h3>
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-8 text-sm text-gray-600">{star} ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-sm text-gray-600 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <img
                src={review.avatar}
                alt={review.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{review.user}</h4>
                  {review.verified && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      ✅ Terverifikasi
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-primary text-sm font-medium">{review.category}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                
                <div className="flex gap-2 mt-3">
                  <button className="text-gray-500 hover:text-gray-700 text-sm">👍 Helpful</button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">👎 Not Helpful</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tulis Ulasan</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ulasan
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Bagikan pengalaman Anda mengikuti event ini..."
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}