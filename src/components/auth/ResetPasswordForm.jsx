'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Link from "next/link"
import { Icon } from '@iconify/react'

export default function ResetPasswordForm({ token }) {
  const router = useRouter()  
  // const searchParams = useSearchParams()
  // const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiResponse, setApiResponse] = useState(null)

  useEffect(() => {    
    if (!token) {
      router.push('/login')
    }
  }, [token])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors and responses
    setApiResponse(null)
    setErrors({})
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: formData.password,
          confirm_password: formData.confirmPassword
        })
      })

      const result = await response.json()
      
      // Set API response for display
      setApiResponse(result)
      
      if (result.success) {
        // Clear form on success
        setFormData({
          password: '',
          confirmPassword: ''
        })
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 10000)
      }
      
    } catch (error) {
      console.error('Reset password error:', error)
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
                <div className="mt-2">
                  <p className="text-sm text-green-700">
                    Anda akan dialihkan ke halaman login dalam 10 detik...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Kata Sandi Baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
          placeholder="Masukkan password baru"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Konfirmasi Kata Sandi
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
          placeholder="Masukkan ulang password baru"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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

      {/* Need Help Link */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600">
            Butuh bantuan?{' '}
            <Link
              href={'/contact'}
              className="text-primary hover:text-primary/80 hover:underline font-semibold cursor-pointer"
            >
              Hubungi Support
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}