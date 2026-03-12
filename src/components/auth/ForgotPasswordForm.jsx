'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Link from "next/link"
import { Icon } from '@iconify/react'

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
    
    // Clear API response when user modifies form
    if (apiResponse) {
      setApiResponse(null)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email diperlukan'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors and responses
    setApiResponse(null)
    setErrors({})
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase()
        })
      })

      const result = await response.json()
      
      // Set API response for display
      setApiResponse(result)
      
      if (result.success) {
        // Clear form on success
        setFormData({
          email: '',
        })
        
        // Optional: Redirect after successful submission
        // setTimeout(() => {
        //   router.push('/login')
        // }, 3000)
      }
      
    } catch (error) {
      console.error('Forgot password error:', error)
      setApiResponse({
        success: false,
        message: 'Terjadi kesalahan jaringan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Response Notification */}
      {apiResponse && (
        <div className={`p-4 rounded-lg ${
          apiResponse.success 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {apiResponse.success ? (
                <Icon 
                  icon="mdi:check-circle" 
                  className="w-5 h-5 text-green-400"
                />
              ) : (
                <Icon 
                  icon="mdi:close-circle" 
                  className="w-5 h-5 text-red-400"
                />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                apiResponse.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {apiResponse.message}
              </p>
              {apiResponse.success && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-green-600 space-y-1">
                    <div className="flex items-center">
                      <span>Cek folder spam jika tidak menemukan email</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          className={`w-full px-4 py-3 border ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
          placeholder="email.anda@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icon 
              icon="svg-spinners:180-ring-with-bg" 
              className="w-5 h-5 mr-2"
            />
            Memproses...
          </>
        ) : (
          'Kirim'
        )}
      </Button>

      {/* Additional Links */}
      <div className="space-y-4">
        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Ingat password Anda?{' '}
            <Link
              href={'/login'}
              className="text-primary hover:text-primary/80 hover:underline font-semibold cursor-pointer"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}