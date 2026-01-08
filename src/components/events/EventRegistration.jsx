'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { formatCurrency } from "@/lib/formatters-utils"
import { useRouter } from 'next/navigation'

export default function EventRegistration({ event }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const router = useRouter()

  const handleRegister = () => {
    if (!selectedCategory) {
      alert('Pilih kategori lari terlebih dahulu!')
      return
    }
    // Redirect ke halaman registrasi dengan query parameter
    router.push(`/events/${event.slug}/register?category=${selectedCategory.id}`)
  }

  // Cek apakah ada early bird
  const hasEarlyBird = event?.has_early_bird &&
    event.early_bird_end_date &&
    new Date(event.early_bird_end_date) > new Date()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">
      <div className="p-6">
        {/* Participant Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Terdaftar</span>
            <span>{event.current_participants} / {event.max_participants}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(event.current_participants / event.max_participants) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-800">Pilih Kategori</h4>
          {event.categories.map((category) => {
            const isEarlyBird = hasEarlyBird && category.early_bird_price
            const displayPrice = isEarlyBird ? category.early_bird_price : category.price

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedCategory?.id === category.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-800">{category.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(displayPrice)}
                    </div>
                    {/* {isEarlyBird && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatCurrency(category.price)}
                      </div>
                    )} */}
                  </div>
                </div>
                {isEarlyBird && (
                  <div className="flex justify-between text-gray-500 items-center mt-2">
                    <span className="px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      Early Bird
                    </span>
                    <span className="line-through text-xs">{formatCurrency(category.price)}</span>
                  </div>
                )}
                {/* <div className="flex justify-between text-xs text-gray-500">
                  <span>{category.current_slots} terdaftar</span>
                  <span>{category.max_slots - category.current_slots} slot tersisa</span>
                </div> */}
              </div>
            )
          })}
        </div>

        {/* Quantity */}
        {/* <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-3">Jumlah Tiket</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div> */}

        {/* Total Price */}
        {selectedCategory && (
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span className="text-xl text-primary">
                {formatCurrency(
                  (hasEarlyBird && selectedCategory.early_bird_price)
                    ? selectedCategory.early_bird_price
                    : selectedCategory.price
                )}
              </span>
            </div>
          </div>
        )}

        {/* Register Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleRegister}
          disabled={!selectedCategory}
          className={`${!selectedCategory ? 'opacity-70 disabled:cursor-not-allowed disabled:scale-100' : ''}`}
        >
          {selectedCategory ? 'Daftar Sekarang' : 'Pilih Kategori'}
        </Button>
      </div>
    </div>
  )
}