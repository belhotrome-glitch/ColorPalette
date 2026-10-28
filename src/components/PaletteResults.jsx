import { Pipette } from 'lucide-react'
import ColorSwatch from './ColorSwatch'
import PaletteControls from './PaletteControls'

export default function PaletteResults({ colors, onCopy, ...actions }) {
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {colors.map((c, i) => (
            <div key={i} className={i === 0 ? 'col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-1' : ''}>
              <ColorSwatch color={c} onCopy={onCopy} big={i === 0} />
              {i === 0 && <p className="mt-2 text-center text-xs font-semibold text-brand">Most dominant</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
