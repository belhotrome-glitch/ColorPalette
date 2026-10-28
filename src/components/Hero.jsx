import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:pt-24">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Find the Colors Behind Every Image.</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg muted">
        Upload any photo, poster, or artwork and instantly discover its dominant colors. Create beautiful palettes for your next design.
      </p>
      <a href="/extractor" className="btn-primary mt-8 !px-6 !py-3.5 text-base">Start Extracting <ArrowRight size={18} aria-hidden /></a>
    </section>
  )
}
