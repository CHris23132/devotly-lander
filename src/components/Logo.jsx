import logo from "../assets/exec-e9607160-e842-40ed-9e49-1afe962b39a0.png"

export default function Logo({ className = "" }) {
  return (
    <a href="#top" className={`inline-flex items-center ${className}`} aria-label="Devotly, home">
      <img src={logo} alt="Devotly" className="h-8 w-auto mix-blend-screen sm:h-9" />
    </a>
  )
}
