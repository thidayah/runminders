import AboutHero from '@/components/about/AboutHero'
import TeamSection from '@/components/about/TeamSection'
import ValuesSection from '@/components/about/ValuesSection'
import Layout from "@/components/layout/Layout"

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <AboutHero />
        <ValuesSection />
        <TeamSection />
      </div>
    </Layout>
  )
}