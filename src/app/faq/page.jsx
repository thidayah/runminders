import FaqSection from '@/components/faq/FaqSection'
import Layout from "@/components/layout/Layout"

export default function FAQPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
          {/* Background Gradient */}
          <div className="h-96 bg-cover bg-center" >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 mt-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
                  Pertanyaan Umum
                </h1>
                <p className="text-xl text-gray-400 mx-auto">
                  Temukan jawaban untuk pertanyaan yang sering diajukan tentang RUNminders
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Hero Section */}
        {/* <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum
            </h1>
            <p className="text-xl text-gray-600">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang RUNminders
            </p>
          </div>
        </div>
      </section> */}

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <FaqSection />
          </div>
        </div>
      </div>
    </Layout>
  )
}