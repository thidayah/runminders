'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      alert('Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
      <p className="text-gray-600 mb-6">
        Isi form berikut dan tim kami akan segera merespons
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="email@contoh.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subjek
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none"
          >
            <option value="">Pilih subjek</option>
            <option value="general">Pertanyaan Umum</option>
            <option value="technical">Bantuan Teknis</option>
            <option value="partnership">Kemitraan</option>
            <option value="event">Pertanyaan Event</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Pesan
          </label>
          <textarea
            id="message"
            name="message"
            rows="6"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            placeholder="Tulis pesan Anda di sini..."
          ></textarea>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          fullWidth={true}
          // className="w-full"
        >
          {isSubmitting ? (
            <>
              <Icon icon="mdi:loading" width="20" height="20" className="animate-spin mr-2" />
              Mengirim...
            </>
          ) : (
            'Kirim Pesan'
          )}
        </Button>
      </form>
    </div>
  )
}