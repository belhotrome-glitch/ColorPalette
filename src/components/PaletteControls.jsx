import { Copy, FileText, Braces, Code2, RefreshCw } from 'lucide-react'

export default function PaletteControls({ onCopyAll, onTxt, onJson, onCss, onRegenerate, loading }) {
  const items = [
    [Copy, 'Copy All', onCopyAll, 'btn-ghost'], [FileText, 'TXT', onTxt, 'btn-ghost'], [Braces, 'JSON', onJson, 'btn-ghost'],
    [Code2, 'CSS', onCss, 'btn-ghost'], [RefreshCw, 'New Palette', onRegenerate, 'btn-ghost'],
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([Icon, label, fn, cls]) => (
        <button key={label} className={cls} onClick={fn} disabled={loading && label === 'New Palette'}>
          <Icon size={16} aria-hidden className={loading && label === 'New Palette' ? 'animate-spin' : ''} /> {label}
        </button>
      ))}
    </div>
  )
}
