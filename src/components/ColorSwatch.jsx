import { Copy } from 'lucide-react'
import { rgbToHex, rgbString, colorName, readableText } from '../utils/colorUtils'

export default function ColorSwatch({ color, onCopy, big, generated }) {
  const hex = rgbToHex(color.rgb)
  return (
    <div className={`card overflow-hidden ${generated ? '!border-dashed' : ''}`}>
      <button
        onClick={() => onCopy(hex)}
        aria-label={`Copy ${hex}`}
        className={`group flex w-full items-end justify-between p-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand ${big ? 'h-44' : 'h-28'}`}
        style={{ background: hex, color: readableText(color.rgb) }}
      >
        <span className="text-xs font-bold opacity-90">{color.share != null ? `${Math.round(color.share * 100)}%` : ''}</span>
        <Copy size={16} className="opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
      </button>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="font-bold">{hex}</p>
          <p className="truncate text-xs muted">{rgbString(color.rgb)}</p>
          <p className="truncate text-xs muted">{colorName(color.rgb)}</p>
        </div>
        <button className="btn-ghost !p-2" onClick={() => onCopy(hex)} aria-label={`Copy ${hex} to clipboard`}><Copy size={16} /></button>
      </div>
    </div>
  )
}
