import AboutHero from '@/components/about/AboutHero'
import ValuesSection from '@/components/about/ValuesSection'
import Layout from "@/components/layout/Layout"
// import TeamSection from '@/components/about/TeamSection'

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <AboutHero />
        <ValuesSection />
        {/* <TeamSection /> */}
      </div>
    </Layout>
  )
}