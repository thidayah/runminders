'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import SocialButton from '@/components/ui/SocialButton'
import Link from "next/link"

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Forgot password data:', formData)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="email.anda@example.com"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isLoading}
        // className="relative"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Memproses...
          </>
        ) : (
          'Kirim'
        )}
      </Button>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <Link
            type="button"
            href={'/login'}
            className="text-primary hover:text-primary/80 hover:underline font-semibold cursor-pointer"
          >
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}