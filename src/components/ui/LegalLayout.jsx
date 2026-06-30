import { Icon } from '@iconify/react'
import Layout from "@/components/layout/Layout"
import LegalSidebarNav from './LegalSidebarNav'

export default function LegalLayout({ title, subtitle, children, sections }) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <LegalSidebarNav sections={sections} />
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

                  <div className="flex flex-wrap justify-center gap-6 mt-6">
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
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:info-circle" width="24" height="24" className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Penerimaan Kebijakan
                      </h4>
                      <p className="text-gray-600">
                        Dengan menggunakan platform Runminders, Anda menyetujui ketentuan yang tercantum
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
    </Layout>
  )
}
