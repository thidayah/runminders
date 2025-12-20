'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function EventRegistration({ event }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const handleRegister = () => {
    if (!selectedCategory) {
      alert('Pilih kategori lari terlebih dahulu!')
      return
    }
    // Navigate to registration page atau open modal
    console.log('Register:', { category: selectedCategory, quantity })
  }

  const isEarlyBird = new Date() < new Date(event.earlyBirdEnd)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">
      <div className="p-6">
        {/* Price */}
        {/* <div className="text-center mb-6">
          {isEarlyBird ? (
            <>
              <div className="text-3xl font-bold text-primary">
                Rp {event.earlyBirdPrice.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500 line-through">
                Rp {event.price.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-green-600 font-semibold mt-1">
                🎉 Early Bird hingga {event.earlyBirdEnd}
              </div>
            </>
          ) : (
            <div className="text-3xl font-bold text-primary">
              Rp {event.price.toLocaleString('id-ID')}
            </div>
          )}
        </div> */}

        {/* Participant Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Terdaftar</span>
            <span>{event.participants.registered} / {event.participants.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(event.participants.registered / event.participants.max) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-800">Pilih Kategori</h4>
          {event.categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedCategory?.id === category.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-800">{category.name}</div>
                  {/* <div className="text-sm text-gray-600">{category.description}</div> */}
                </div>
                <div className="text-lg font-bold text-primary">
                  Rp {category.price.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                {/* <span>{category.registered} terdaftar</span> */}
                <span>{category.slots - category.registered} slot tersisa</span>
              </div>
            </div>
          ))}
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
                Rp {(selectedCategory.price * quantity).toLocaleString('id-ID')}
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
        >
          {selectedCategory ? 'Daftar Sekarang' : 'Pilih Kategori'}
        </Button>
      </div>
    </div>
  )
}