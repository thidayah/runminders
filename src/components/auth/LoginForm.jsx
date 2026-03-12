'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import SocialButton from '@/components/ui/SocialButton'
import Link from "next/link"
import { Icon } from '@iconify/react'
import { saveAuthData } from "@/lib/auth-storage"
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter()
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
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

    if (!formData.password) {
      newErrors.password = 'Password diperlukan'
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      })

      const result = await response.json()

      // Set API response for display
      setApiResponse(result)

      if (result.success) {
        // Save encrypted auth data
        const saveResult = saveAuthData(
          result.data.token,
          result.data.user,
          rememberMe
        )

        if (!saveResult) {
          console.error('Failed to save authentication data')
        }

        // Save token and user data
        // if (result.data.token) {
        //   if (rememberMe) {
        //     // Store in localStorage for persistent login
        //     localStorage.setItem('auth_token', result.data.token)
        //     localStorage.setItem('user', JSON.stringify(result.data.user))
        //   } else {
        //     // Store in sessionStorage for session-only login
        //     sessionStorage.setItem('auth_token', result.data.token)
        //     sessionStorage.setItem('user', JSON.stringify(result.data.user))
        //   }
        // }

        // Clear form on success
        setFormData({
          email: '',
          password: ''
        })

        // Redirect based on user role or default to dashboard
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)

      }
    } catch (error) {
      console.error('Login error:', error)
      setApiResponse({
        success: false,
        message: 'Terjadi kesalahan jaringan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Tambahkan state untuk Google loading
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  
  useEffect(() => {
    if (session) {
      handleGoogleLogin()
    }
  }, [session])  

  // Fungsi untuk handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsLoadingGoogle(true)

      const googleData = {
        accessToken: session.user.accessToken, // Perlu pass dari client side
        googleId: session.user.googleId,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
        // Tambahkan field lain yang diperlukan
      }

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleData)
      })

      const apiResult = await response.json()
      
      setApiResponse(apiResult)

      if (apiResult.success) {
        const saveResult = saveAuthData(
          apiResult.data.token,
          apiResult.data.user,
          rememberMe
        )

        if (!saveResult) {
          console.error('Failed to save authentication data')
        }

        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }

    } catch (error) {
      console.error('Google login error:', error)
      setApiResponse({
        success: false,
        message: 'Terjadi kesalahan saat login dengan Google'
      })
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Response Notification */}
      {apiResponse && (
        <div className={`p-4 rounded-lg ${apiResponse.success
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
              <p className={`text-sm font-medium ${apiResponse.success ? 'text-green-800' : 'text-red-800'
                }`}>
                {apiResponse.message}
              </p>

              {apiResponse.success && (
                <div className="mt-2">
                  <p className="text-sm text-green-700">
                    Mengalihkan ke dashboard...
                  </p>
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
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          placeholder="email.anda@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Kata Sandi
          </label>
          <Link
            href={'/forgot-password'}
            className="text-sm text-primary hover:text-primary/80 hover:underline font-medium cursor-pointer flex items-center"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent transition-all duration-200`}
          placeholder="Masukkan kata sandi"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Ingat saya
          </label>
        </div>
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
          <>
            <Icon icon="mdi:login" className="w-5 h-5 mr-2" />
            Masuk
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 gap-3">
        <SocialButton provider="google" isLoading={isLoadingGoogle} onClick={() => signIn("google")} />
        {/* <SocialButton provider="facebook" /> */}
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link
            type="button"
            href={'/register'}
            className="text-primary hover:text-primary/80 hover:underline font-semibold cursor-pointer inline-flex items-center"
          >
            Registrasi
          </Link>
        </p>
      </div>
    </form>
  )
}