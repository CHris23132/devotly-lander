import Footer from "@/components/lander/Footer.jsx"
import Goals from "@/components/lander/Goals.jsx"
import Hero from "@/components/lander/Hero.jsx"
import HowItWorks from "@/components/lander/HowItWorks.jsx"
import NativeApp from "@/components/lander/NativeApp.jsx"
import Nav from "@/components/lander/Nav.jsx"
import Onboarding from "@/components/lander/Onboarding.jsx"
import Pillars from "@/components/lander/Pillars.jsx"

export default function HomePage() {
  return (
    <div id="top" className="lander-page min-h-screen antialiased">
      <Nav />
      <main id="main">
        <Hero />
        <Pillars />
        <HowItWorks />
        <Goals />
        <Onboarding />
        <NativeApp />
      </main>
      <Footer />
    </div>
  )
}
