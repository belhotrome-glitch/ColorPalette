import { useRef, useState } from 'react'
import { UploadCloud, Replace, Trash2, Pipette, Loader2 } from 'lucide-react'

export default function ImageUploader({ image, onFile, onRemove, onExtract, loading, error }) {
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const pick = (files) => files && files[0] && onFile(files[0])

  return (
    <div className="card p-5 sm:p-7">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" aria-label="Choose image file"
        onChange={(e) => { pick(e.target.files); e.target.value = '' }} />
      {!image ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files) }}
          className={`grid place-items-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${over ? 'border-brand bg-brand/10' : 'border-gray-300 dark:border-white/20'}`}
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand"><UploadCloud size={32} aria-hidden /></span>
          <p className="mt-4 text-lg font-bold">Drag an image here</p>
          <p className="mt-1 text-sm muted">JPG, PNG or WEBP. It stays on your device and is never uploaded.</p>
          <button className="btn-primary mt-5" onClick={() => input.current.click()}>Choose Image</button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="grid place-items-center overflow-hidden rounded-2xl bg-mist p-2 dark:bg-black/30">
              <img src={image.url} alt={`Preview of ${image.name}`} className="max-h-[420px] w-auto max-w-full rounded-xl object-contain" />
            </div>
            <p className="mt-3 truncate text-sm font-semibold" title={image.name}>{image.name}</p>
            <p className="text-sm muted">{image.w} × {image.h} px</p>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-sm muted">Automatically finds the meaningful colors in your image (up to 24)—no fixed count.</p>
            <button className="btn-primary !py-3.5 text-base" onClick={onExtract} disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" size={18} aria-hidden /> Extracting…</> : <><Pipette size={18} aria-hidden /> Extract Palette</>}
            </button>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => input.current.click()}><Replace size={16} aria-hidden /> Replace Image</button>
              <button className="btn-ghost flex-1" onClick={onRemove}><Trash2 size={16} aria-hidden /> Remove Image</button>
            </div>
          </div>
        </div>
      )}
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
    </div>
  )
}
