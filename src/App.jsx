import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import ImageUploader from './components/ImageUploader'
import PaletteResults from './components/PaletteResults'
import PalettePreview from './components/PalettePreview'
import ColorHarmony from './components/ColorHarmony'
import Footer from './components/Footer'
import { extractColors, loadImage } from './utils/extractColors'
import { toText, toJson, toCss, download, copyText } from './utils/exportPalette'
import { rgbToHex } from './utils/colorUtils'

const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const page = `/${window.location.pathname.slice(import.meta.env.BASE_URL.length)}`.replace(/\/+$/, '') || '/'
const pageTitles = {
  '/': 'Home',
  '/extractor': 'Color Palette Extractor',
  '/about': 'About PaletteLab',
}

export default function App() {
  const [dark, setDark] = useState(() => load('palettelab:dark', window.matchMedia?.('(prefers-color-scheme: dark)').matches))
  const [image, setImage] = useState(null)
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const variant = useRef(0)
  const timer = useRef()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('palettelab:dark', JSON.stringify(dark)) } catch {}
  }, [dark])
  useEffect(() => {
    document.title = `${pageTitles[page] || 'Page Not Found'} | PaletteLab`
  }, [])
  const notify = useCallback((msg, kind = 'ok') => {
    setToast({ msg, kind }); clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2400)
  }, [])
  const copy = async (text, msg) => {
    (await copyText(text)) ? notify(msg || `Copied ${text}`) : notify('Copy failed. Your browser blocked clipboard access.', 'err')
  }

  const onFile = async (file) => {
    setError('')
    if (!OK_TYPES.includes(file.type)) { setError(`"${file.name}" is not supported. Choose a JPG, PNG or WEBP image.`); return }
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      if (image) URL.revokeObjectURL(image.url)
      setImage({ url, name: file.name, w: img.naturalWidth, h: img.naturalHeight })
      setColors([]); variant.current = 0
    } catch (e) { URL.revokeObjectURL(url); setError(e.message) }
  }
  const onRemove = () => { if (image) URL.revokeObjectURL(image.url); setImage(null); setColors([]); setError('') }

  const run = async (v) => {
    if (!image) { setError('Choose an image before extracting colors.'); return }
    setLoading(true); setError('')
    try { setColors(await extractColors(image.url, v, v > 0 ? colors.length : undefined)) }
    catch (e) { setError(e.message || 'Something went wrong while reading the image.') }
    finally { setLoading(false) }
  }
  const extract = () => { variant.current = 0; run(0) }
  const regenerate = () => { variant.current += 1; run(variant.current) }

  const hexes = colors.map((c) => rgbToHex(c.rgb))

  return (
    <>
      <Header dark={dark} currentPage={page} onToggleDark={() => setDark(!dark)} />
      <main>
        {page === '/' && <Hero />}
        {page === '/extractor' && (
          <section className="mx-auto max-w-6xl px-4 pt-10">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold">Color Palette Extractor</h1>
              <p className="mt-2 muted">Upload an image to automatically discover its meaningful colors.</p>
            </div>
            <ImageUploader image={image} onFile={onFile} onRemove={onRemove} onExtract={extract} loading={loading} error={error} />
            <PaletteResults
              colors={colors} onCopy={(h) => copy(h)} loading={loading}
              onCopyAll={() => copy(hexes.join(', '), 'All HEX codes copied')}
              onTxt={() => download('palette.txt', toText(colors), 'text/plain')}
              onJson={() => download('palette.json', toJson(colors), 'application/json')}
              onCss={() => download('palette.css', toCss(colors), 'text/css')}
              onRegenerate={regenerate}
            />
            <PalettePreview colors={colors} />
            <ColorHarmony colors={colors} onCopy={(h) => copy(h)} />
          </section>
        )}
        {page === '/about' && (
          <section className="mx-auto max-w-3xl px-4 pt-16">
            <h1 className="text-3xl font-extrabold">About PaletteLab</h1>
            <div className="mt-6 space-y-4 muted">
              <p>PaletteLab reads the pixels of your image and groups them into the colors that represent it best. Use the results to build brand palettes, pick poster colors, match slides to a photo, or keep digital artwork consistent.</p>
              <p>Your images are processed in your browser and never leave your device.</p>
              <p>Once a palette is extracted, copy individual colors, export the full palette as TXT, JSON, or CSS, or generate a new variation.</p>
            </div>
          </section>
        )}
        {!pageTitles[page] && (
          <section className="mx-auto max-w-3xl px-4 pt-16 text-center">
            <h1 className="text-3xl font-extrabold">Page not found</h1>
            <p className="mt-3 muted">The page you’re looking for doesn’t exist.</p>
            <a className="btn-primary mt-6" href={import.meta.env.BASE_URL}>Go to Home</a>
          </section>
        )}
      </main>
      <Footer />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.kind === 'err' ? 'bg-red-600' : 'bg-ink dark:bg-brand'}`}>
            {toast.kind === 'err' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}{toast.msg}
          </div>
        )}
      </div>
    </>
  )
}
