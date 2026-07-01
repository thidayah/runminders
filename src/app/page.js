import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import EventsSection from '@/components/home/EventsSection'
// import CategoryFilter from '@/components/home/CategoryFilter'
// import PartnersSection from '@/components/home/PartnersSection'
import ReviewsSection from '@/components/home/ReviewsSection'

// import MaintenanceSection from "@/components/home/MaintenanceSection";

export default function Home() {
  return (
    <Layout>
      <HeroSection waUrl={process.env.NEXT_PUBLIC_APP_WHATSAPP} />
      <AboutSection />
      <EventsSection />
      {/* <CategoryFilter /> */}
      {/* <PartnersSection /> */}
      <ReviewsSection />
    </Layout>

    // <MaintenanceSection />
  )
}