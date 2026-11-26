"use client"
function hash(index) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

function shaftStyle(count = 52) {
  const images = []
  const sizes = []
  const positions = []

  for (let index = 0; index < count; index += 1) {
    const spread = hash(index)
    const tone = hash(index + 19)
    const fade = hash(index + 41)
    const atEdge = index === 0 || index === count - 1
    const x = atEdge ? (index === 0 ? 0 : 100) : (index / (count - 1)) * 100 + (spread - 0.5) * 1.2
    const width = 4 + tone * 56
    const alpha = 0.18 + spread * 0.5
    const fadeAt = 58 + fade * 32

    images.push(
      `linear-gradient(to top, rgb(255 255 255 / ${alpha.toFixed(3)}) 0%, rgb(255 255 255 / ${(alpha * 0.42).toFixed(3)}) 30%, transparent ${fadeAt.toFixed(0)}%)`,
    )
    sizes.push(`${width.toFixed(1)}px 100%`)
    positions.push(`${Math.min(100, Math.max(0, x)).toFixed(2)}% 100%`)
  }

  return {
    backgroundImage: images.join(", "),
    backgroundSize: sizes.join(", "),
    backgroundPosition: positions.join(", "),
    backgroundRepeat: "no-repeat",
  }
}

const SHAFTS = shaftStyle()

export default function Beams({ quiet = false }) {
  return (
    <div className={`hero-bg ${quiet ? "quiet" : ""}`} aria-hidden="true">
      <div className="shafts" style={SHAFTS} />
      <div className="bottom-glow" />
      <div className="pinstripes" />
      <div className="lime-wash" />
    </div>
  )
}
