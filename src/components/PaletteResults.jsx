import { useState } from 'react'
import { Pipette } from 'lucide-react'
import ColorSwatch from './ColorSwatch'
import PaletteControls from './PaletteControls'
import { rgbString, rgbToHex } from '../utils/colorUtils'

export default function PaletteResults({ colors, onCopy, ...actions }) {
  const [query, setQuery] = useState('')
  const filteredColors = colors
    .map((color, index) => ({ color, index }))
    .filter(({ color }) => {
      const searchText = `${rgbToHex(color.rgb)} ${rgbString(color.rgb)}`.toLowerCase()
      return searchText.includes(query.trim().toLowerCase())
    })

  return (
    <section aria-labelledby="results-h" className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="results-h" className="text-2xl font-extrabold">Extracted palette</h2>
        {colors.length > 0 && <p className="text-sm muted">{colors.length} meaningful colors found</p>}
        {colors.length > 0 && <PaletteControls {...actions} />}
      </div>
      {colors.length === 0 ? (
        <div className="card grid place-items-center px-6 py-12 text-center">
          <Pipette className="text-brand" size={30} aria-hidden />
          <p className="mt-3 font-bold">No palette yet</p>
          <p className="text-sm muted">Choose an image, then select Extract Palette.</p>
        </div>
      ) : (
        <>
          <label className="mb-4 block">
            <span className="sr-only">Search colors by HEX or RGB</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search colors by HEX or RGB"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-white/20 dark:bg-black/20 dark:text-white"
            />
          </label>
          {filteredColors.length === 0 ? (
            <div className="card px-6 py-10 text-center">
              <p className="font-bold">No matching colors</p>
              <p className="mt-1 text-sm muted">Try a HEX code or RGB value.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {filteredColors.map(({ color, index }) => (
                <div key={index} className={index === 0 ? 'col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-1' : ''}>
                  <ColorSwatch color={color} onCopy={onCopy} big={index === 0} />
                  {index === 0 && <p className="mt-2 text-center text-xs font-semibold text-brand">Most dominant</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
