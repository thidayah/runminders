import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import Layout from "@/components/layout/Layout"

export default function ContactPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
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
                  Hubungi Kami
                </h1>
                <p className="text-xl text-gray-400 mx-auto">
                  Kami siap membantu menjawab pertanyaan dan mendengarkan masukan Anda
                </p>
              </div>              
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}