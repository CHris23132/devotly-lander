import FAQ from "./components/FAQ.jsx"
import Features from "./components/Features.jsx"
import FinalCta from "./components/FinalCta.jsx"
import Footer from "./components/Footer.jsx"
import Hero from "./components/Hero.jsx"
import HowItWorks from "./components/HowItWorks.jsx"
import Nav from "./components/Nav.jsx"
import Pricing from "./components/Pricing.jsx"
import YourApp from "./components/YourApp.jsx"

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-midnight text-white antialiased">
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Features />
        <YourApp />
        <Pricing />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
