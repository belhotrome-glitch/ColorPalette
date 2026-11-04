import { useState } from 'react'
import { Palette, Moon, Sun, Menu, X } from 'lucide-react'

const links = [['Home', '/'], ['Extractor', '/extractor'], ['About', '/about']]
const linkHref = (path) => `${import.meta.env.BASE_URL}${path === '/' ? '' : path.slice(1)}`

export default function Header({ dark, currentPage, onToggleDark }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur dark:border-white/10 dark:bg-[#0F1017]/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href={linkHref('/')} className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Palette size={20} aria-hidden /></span>
          PaletteLab
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={linkHref(h)} aria-current={currentPage === h ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-sm font-semibold hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${currentPage === h ? 'text-brand' : 'muted'}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn-ghost !p-2.5" onClick={onToggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn-ghost !p-2.5 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line px-4 py-2 md:hidden dark:border-white/10">
          {links.map(([l, h]) => (
            <a key={h} href={linkHref(h)} aria-current={currentPage === h ? 'page' : undefined} onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-3 font-semibold hover:bg-mist dark:hover:bg-white/5 ${currentPage === h ? 'text-brand' : ''}`}>{l}</a>
          ))}
        </nav>
      )}
    </header>
  )
}
