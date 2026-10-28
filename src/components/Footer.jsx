export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line py-8 text-center text-sm dark:border-white/10">
      <p className="font-bold">PaletteLab</p>
      <p className="muted">Extract color palettes from images, right in your browser.</p>
      <p className="mt-2 muted">© {new Date().getFullYear()} PaletteLab. All rights reserved.</p>
    </footer>
  )
}
