'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from "@/components/layout/Layout"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const transactionStatus = searchParams.get('transaction_status')

  const handleRedirectNow = () => {
    router.push('/dashboard')
  }

  const getErrorMessage = (status) => {
    switch (status) {
      case 'deny':
        return 'Pembayaran ditolak oleh bank atau provider pembayaran.'
      case 'cancel':
        return 'Pembayaran dibatalkan oleh Anda atau sistem.'
      case 'expire':
        return 'Pembayaran telah kedaluwarsa.'
      default:
        return 'Pembayaran gagal diproses.'
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="max-w-xl w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:close-circle" className="w-16 h-16 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Pembayaran Gagal
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            {/* Terima kasih telah mendaftar. Konfirmasi telah dikirim ke email Anda. */}
            {getErrorMessage(transactionStatus)}
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Nomor Registrasi</p>
              <p className="font-mono font-bold text-gray-800 text-lg">{orderId}</p>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-left">Kemungkinan Penyebab</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Saldo kartu kredit atau e-wallet tidak mencukupi</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Transaksi melebihi limit yang ditetapkan oleh bank</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Masalah teknis pada sistem pembayaran</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Waktu transaksi telah habis (timeout)</span>
              </li>
            </ul>
          </div>

          {/* Quick Tips */}
          <div className=" bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Tips Solusi</p>
                <p className="text-sm text-blue-700">
                  • Gunakan metode pembayaran lain (transfer bank, dompet elektronik)
                </p>
                <p className="text-sm text-blue-700">
                  • Pastikan kartu Anda memiliki dana yang cukup
                </p>
                <p className="text-sm text-blue-700">
                  • Periksa apakah kartu Anda mendukung transaksi online
                </p>
                <p className="text-sm text-blue-700">
                  • Tunggu beberapa menit lalu coba lagi
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-2 justify-center">
              <Button
                onClick={handleRedirectNow}
                variant="primary"
                size="md"
              >
                <Icon icon="mdi:view-dashboard" className="mr-2" />
                Ke Dashboard
              </Button>

              <Link href="/contact" className="block">
                <Button variant="outline" size="md" >
                  <Icon icon="mdi:help-circle" className="mr-2" />
                  Hubungi Support
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}