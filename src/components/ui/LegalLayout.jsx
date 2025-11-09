'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import Layout from "@/components/layout/Layout"

export default function LegalLayout({ title, subtitle, children, lastUpdated, sections }) {
  const [activeSection, setActiveSection] = useState('')

  return (
    <Layout>
      {/* <div className="min-h-screen bg-gray-50"> */}
        {/* Header */}
        {/* <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Icon icon="mdi:arrow-left" width="20" height="20" />
              Kembali
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <button
              onClick={() => window.location.href = '/'}
              className="text-2xl font-bold text-primary hover:scale-105 transition-transform"
            >
              RUNminders
            </button>
          </div>
        </div>
      </div> */}

        <div className="container mx-auto px-4 py-8 mt-20">
          {/* <div className="max-w-6xl mx-auto"> */}
          <div className=" mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <h3 className="font-semibold text-gray-800 mb-4">Pada Halaman Ini</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id)
                          const element = document.getElementById(section.id)
                          if (element) {
                            const headerHeight = 100 // Height header + progress bar
                            const elementPosition = element.offsetTop - headerHeight

                            window.scrollTo({
                              top: elementPosition,
                              behavior: 'smooth'
                            })
                          }
                        }}
                        className={`flex items-center gap-3 w-full text-left py-3 rounded-lg cursor-pointer transition-colors ${activeSection === section.id
                          ? 'bg-white text-primary font-bold '
                          : 'text-gray-700 hover:text-primary hover:bg-white '
                          }`}
                      >
                        <Icon
                          icon={section.icon}
                          width="18"
                          height="18"
                          className="flex-shrink-0 text-gray-500"
                        />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Last Updated */}
                  {/* <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon="mdi:calendar" width="16" height="16" />
                      Terakhir diperbarui
                    </div>
                    <div className="font-medium text-gray-700">{lastUpdated}</div>
                  </div>
                </div> */}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  {/* Header */}
                  <div className="text-center mb-8 pb-8 border-b border-gray-200">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                      {title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      {subtitle}
                    </p>

                    {/* Quick Info */}
                    <div className="flex flex-wrap justify-center gap-6 mt-6">
                      {/* <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="mdi:clock-outline" width="16" height="16" />
                      Waktu baca: 10 menit
                    </div> */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Icon icon="mdi:file-document-outline" width="16" height="16" />
                        Dokumen legal
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Icon icon="mdi:shield-check-outline" width="16" height="16" />
                        Diperbarui secara berkala
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    {children}
                  </div>

                  {/* Acceptance Section */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:info-circle" width="24" height="24" className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Penerimaan Kebijakan
                        </h4>
                        <p className="text-gray-600">
                          Dengan menggunakan platform RUNminders, Anda menyetujui ketentuan yang tercantum
                          dalam dokumen ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </Layout>
  )
}