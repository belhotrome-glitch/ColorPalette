import { useState, useEffect } from 'react'
import ColorSwatch from './ColorSwatch'
import { complementary, analogous, rgbToHex } from '../utils/colorUtils'

export default function ColorHarmony({ colors, onCopy }) {
  const [sel, setSel] = useState(0)
  useEffect(() => { if (sel >= colors.length) setSel(0) }, [colors, sel])
  if (!colors.length) return null
  const base = colors[Math.min(sel, colors.length - 1)]
  const groups = [['Complementary', complementary(base.rgb)], ['Analogous', analogous(base.rgb)]]
  return (
    <section aria-labelledby="harm-h" className="mt-12">
      <h2 id="harm-h" className="text-2xl font-extrabold">Color harmony</h2>
      <p className="mb-4 text-sm muted">Pick an extracted color. Suggestions below are generated from it and are not in your image (dashed borders).</p>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Choose base color">
        {colors.map((c, i) => (
          <button key={i} onClick={() => setSel(i)} aria-label={`Use ${rgbToHex(c.rgb)} as base`} aria-pressed={sel === i}
            className={`h-10 w-10 rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${sel === i ? 'border-brand ring-2 ring-brand ring-offset-2' : 'border-white shadow dark:border-white/20'}`}
            style={{ background: rgbToHex(c.rgb) }} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map(([label, list]) => (
          <div key={label}>
            <h3 className="mb-2 font-bold">{label} <span className="text-xs font-semibold text-brand">Generated</span></h3>
            <div className="grid grid-cols-2 gap-3">
              {list.map((rgb, i) => <ColorSwatch key={i} color={{ rgb }} onCopy={onCopy} generated />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
