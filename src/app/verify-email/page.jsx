'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Layout from "@/components/layout/Layout"
import { Icon } from '@iconify/react'

export default function VerifyEmailPage({ searchParams }) {
  const router = useRouter()
  const { token } = use(searchParams)

  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error', 'expired'
  const [message, setMessage] = useState('')
  const [userData, setUserData] = useState(null)  

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Token verifikasi tidak ditemukan')
        return
      }

      try {
        const response = await fetch(`/api/auth/email-verify?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const result = await response.json()

        if (result.success) {
          setStatus('success')
          setMessage(result.message)
        } else {
          setStatus('error')
          setMessage(result.message || 'Verifikasi email gagal')

          // Check if token is expired
          if (result.message?.includes('kedaluwarsa') || result.message?.includes('expired')) {
            setStatus('expired')
          }
        }
        setUserData(result.data || null)
      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.')
      }
    }

    verifyEmail()
  }, [token])

  const handleResendVerification = async () => {
    if (!userData?.email) {
      setStatus('error')
      setMessage('Email tidak ditemukan')
      return
    }

    setStatus('loading')
    setMessage('Mengirim ulang email verifikasi...')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email })
      })

      const result = await response.json()

      if (result.success) {
        // Reset resend status after 5 seconds
        setTimeout(() => {
          setStatus('success')
          setMessage(result.message || 'Email verifikasi telah dikirim ulang!')
        }, 5000);
      } else {
        setStatus('error')
        setMessage(result.message || 'Gagal mengirim ulang verifikasi')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setStatus('error')
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const handleRedirectToLogin = () => {
    router.push('/login')
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-12 pt-28 px-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verifikasi Email
            </h1>
            {/* <p className="text-gray-600">
              Proses verifikasi email Anda              
            </p> */}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            {/* Status Icon */}
            <div className="text-center mb-6">
              {status === 'loading' && (
                <div className="inline-flex items-center justify-center w-20 h-20">
                  <Icon
                    icon="svg-spinners:180-ring-with-bg"
                    className="w-16 h-16 text-primary"
                  />
                </div>
              )}

              {status === 'success' && (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Icon
                    icon="mdi:check-circle"
                    className="w-10 h-10 text-green-600"
                  />
                </div>
              )}

              {(status === 'error' || status === 'expired') && (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                  <Icon
                    icon="mdi:close-circle"
                    className="w-10 h-10 text-red-600"
                  />
                </div>
              )}
            </div>

            {/* Status Message */}
            <div className="text-center mb-6">
              <h2 className={`text-xl font-semibold mb-2 ${status === 'success' ? 'text-green-700' :
                status === 'error' ? 'text-red-700' :
                  status === 'expired' ? 'text-yellow-700' :
                    'text-gray-700'
                }`}>
                {status === 'loading' && 'Sedang Memproses...'}
                {status === 'success' && 'Berhasil!'}
                {status === 'error' && 'Gagal'}
                {status === 'expired' && 'Token Kedaluwarsa'}
              </h2>

              <p className="text-gray-600">
                {message}
              </p>

              {/* {userData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                    <Icon icon="mdi:email" className="w-4 h-4" />
                    <span className="font-medium">Email:</span>
                    <span>{userData.email}</span>
                  </div>
                  {userData.full_name && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-700 mt-2">
                      <Icon icon="mdi:account" className="w-4 h-4" />
                      <span className="font-medium">Nama:</span>
                      <span>{userData.full_name}</span>
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {status === 'success' && (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleRedirectToLogin}
                  >
                    <Icon icon="mdi:login" className="w-5 h-5 mr-2" />
                    Masuk ke Akun
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/"
                      className="text-primary hover:text-primary/80 hover:underline font-medium text-sm inline-flex items-center"
                    >
                      <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-1" />
                      Kembali ke Beranda
                    </Link>
                  </div>
                </>
              )}

              {status === 'expired' && (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleResendVerification}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Icon
                          icon="svg-spinners:180-ring-with-bg"
                          className="w-5 h-5 mr-2"
                        />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:email-send" className="w-5 h-5 mr-2" />
                        Kirim Ulang Verifikasi Email
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={handleRedirectToLogin}
                  >
                    <Icon icon="mdi:login" className="w-5 h-5 mr-2" />
                    Ke Halaman Login
                  </Button>
                </>
              )}

              {status === 'error' && !token && (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => router.push('/register')}
                  >
                    <Icon icon="mdi:account-plus" className="w-5 h-5 mr-2" />
                    Daftar Akun Baru
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={handleRedirectToLogin}
                  >
                    <Icon icon="mdi:login" className="w-5 h-5 mr-2" />
                    Ke Halaman Login
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center flex items-center justify-center">
                <Icon icon="mdi:help-circle" className="w-4 h-4 mr-1" />
                Butuh bantuan?{' '}
                <Link
                  href="/contact"
                  className="text-primary hover:text-primary/80 hover:underline font-medium ml-1"
                >
                  Hubungi Tim Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}