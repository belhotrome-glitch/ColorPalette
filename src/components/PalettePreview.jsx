import { rgbToHex, contrastRatio } from '../utils/colorUtils'

export default function PalettePreview({ colors }) {
  if (!colors.length) return null
  const bg = colors[0].rgb
  const others = colors.slice(1)
  // headline: the palette color with the best contrast on the background (falls back to black/white)
  const pool = [...others.map((c) => c.rgb), [255, 255, 255], [23, 25, 35]]
  const head = pool.reduce((a, b) => (contrastRatio(a, bg) >= contrastRatio(b, bg) ? a : b))
  const acc = (i) => rgbToHex((others[i % Math.max(others.length, 1)] || colors[0]).rgb)
  return (
    <section aria-labelledby="prev-h" className="mt-12">
      <h2 id="prev-h" className="mb-4 text-2xl font-extrabold">Preview Your Palette in a Design</h2>
      <div className="card p-4 sm:p-6">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl shadow-lg sm:aspect-[16/10] sm:max-w-none" style={{ background: rgbToHex(bg) }} role="img" aria-label="Sample poster using the extracted palette">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: acc(0) }} />
          <div className="absolute bottom-0 right-1/4 h-24 w-24 rotate-12" style={{ background: acc(1) }} />
          <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full" style={{ background: acc(2) }} />
          <div className="absolute bottom-6 right-6 h-3 w-24 rounded-full" style={{ background: acc(3) }} />
          <div className="relative flex h-full flex-col justify-center p-8 sm:p-12" style={{ color: rgbToHex(head) }}>
            <p className="text-sm font-bold opacity-80">Open Studio · Autumn Showcase</p>
            <p className="mt-2 max-w-xs text-4xl font-extrabold leading-none sm:text-6xl">Color that comes from your image.</p>
            <span className="mt-6 inline-block w-fit rounded-full px-5 py-2 text-sm font-bold" style={{ background: rgbToHex(head), color: rgbToHex(bg) }}>Join us</span>
          </div>
        </div>
      </div>
    </section>
  )
}
