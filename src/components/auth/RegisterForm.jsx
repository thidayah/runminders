'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Link from "next/link"
import { Icon } from "@iconify/react"
// import { useRouter } from "next/navigation"

export default function RegisterForm() {
  // const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    // Clear specific field error when user types
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap diperlukan'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email diperlukan'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password diperlukan'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password diperlukan'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'Anda harus menyetujui syarat dan ketentuan'
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
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirmPassword
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      // Set API response for display
      setApiResponse(result)

      if (result.success) {
        // Clear form on success
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        setAcceptTerms(false)

        // Optional: Redirect to verification page or show success modal
        console.log('Registration successful:', result.data)
        // You can add redirect here if needed
        // router.push('/login')
        // router.push('/verify-email?email=' + encodeURIComponent(formData.email))
      } else {
        // Handle specific field errors from API if any
        if (result.errors) {
          setErrors(result.errors)
        }
      }

    } catch (error) {
      console.error('Registration error:', error)
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
        <div className={`p-4 rounded-lg ${apiResponse.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
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
              <p className={`text-sm font-medium ${apiResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                {apiResponse.message}
              </p>
              {apiResponse.data?.email_sent === false && (
                <p className="mt-2 text-sm text-yellow-600 flex items-center">
                  <Icon icon="mdi:alert" className="w-4 h-4 mr-1" />
                  Silakan coba verifikasi email nanti atau hubungi admin.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          placeholder="Masukkan nama lengkap Anda"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
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
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          placeholder="email.anda@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          // placeholder="Minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol (@, $, !, %, *, ?, &)"
          placeholder="Minimal 8 karakter"
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
          className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          placeholder="Konfirmasi kata sandi"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => {
            setAcceptTerms(e.target.checked)
            if (errors.acceptTerms) {
              setErrors(prev => ({ ...prev, acceptTerms: '' }))
            }
          }}
          className={`w-4 h-4 ${errors.acceptTerms ? 'text-red-500 border-red-300' : 'text-primary border-gray-300'} rounded mt-1 focus:ring-primary`}
          required
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
          Saya menyetujui {' '}
          <button type="button" className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold">
            Syarat & Ketentuan
          </button>{' '}
          dan{' '}
          <button type="button" className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold">
            Kebijakan Privasi
          </button>{' '}
          Runminders
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-600">{errors.acceptTerms}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        // disabled={isLoading || !acceptTerms}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Membuat Akun...
          </>
        ) : (
          'Buat Sekarang'
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <Link
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