'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import SocialButton from '@/components/ui/SocialButton'
import Link from "next/link"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
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
      console.log('Register data:', formData)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="Masukkan nama lengkap Anda"
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="email.anda@example.com"
        />
      </div>

      {/* Phone Number */}
      {/* <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="0812-3456-7890"
        />
      </div> */}

      {/* Birth Date */}
      {/* <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
          Birth
        </label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div> */}

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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="Minimal 8 karakter"
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="Konfirmasi kata sandi"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
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
          RUNminders
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isLoading || !acceptTerms}
        // className="relative"
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