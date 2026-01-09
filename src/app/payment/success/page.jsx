'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from "@/components/layout/Layout"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(30)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  // Auto redirect setelah 30 detik
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/dashboard')
      return
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  const handleRedirectNow = () => {
    router.push('/dashboard')
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="max-w-xl w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:check-circle" className="w-16 h-16 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Pembayaran Berhasil!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Terima kasih telah mendaftar. Konfirmasi telah dikirim ke email Anda.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Nomor Registrasi</p>
              <p className="font-mono font-bold text-gray-800 text-lg">{orderId}</p>
            </div>
          )}

          {/* Countdown */}
          {/* <div className="mb-8">
            <p className="text-sm text-gray-500">
              Halaman akan dialihkan otomatis...
            </p>
          </div> */}

          {/* Buttons */}
          <div className="flex space-x-2 justify-center">
            <Button
              onClick={handleRedirectNow}
              variant="primary"
              size="md"              
            >
              <Icon icon="mdi:view-dashboard" className="mr-2" />
              Ke Dashboard ({countdown}s)
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" size="md" >
                <Icon icon="mdi:home" className="mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Tips</p>
                <p className="text-sm text-blue-700">
                  Periksa folder spam/promosi jika tidak menerima email konfirmasi.
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Butuh bantuan?{' '}
              <Link
                href="/contact"
                className="text-primary hover:underline"
              >
                Hubungi Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}