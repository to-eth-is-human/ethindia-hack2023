export const metadata = {
  title: 'Home - Simple',
  description: 'Page description',
}

import Hero from '@/components/hero'
import Features from '@/components/usersTable'
// import FeaturesBlocks from '@/components/features-blocks'
// import Testimonials from '@/components/testimonials'
// import Newsletter from '@/components/newsletter'

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      <Features />
      {/* <FeaturesBlocks />
      <Testimonials />
      <Newsletter /> */}
    </>
  )
}
