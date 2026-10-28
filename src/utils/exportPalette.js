import { rgbToHex, rgbString, colorName } from './colorUtils'

export const toText = (colors) =>
  colors.map((c, i) => `${i + 1}. ${rgbToHex(c.rgb)}  ${rgbString(c.rgb)}  ${colorName(c.rgb)}`).join('\n')
export const toJson = (colors, name = 'PaletteLab palette') =>
  JSON.stringify({ name, colors: colors.map((c) => ({ hex: rgbToHex(c.rgb), rgb: c.rgb, name: colorName(c.rgb), share: +(c.share ?? 0).toFixed(4) })) }, null, 2)
export const toCss = (colors) =>
  ':root {\n' + colors.map((c, i) => `  --color-${i + 1}: ${rgbToHex(c.rgb)};`).join('\n') + '\n}\n'

export function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try { // fallback for insecure contexts or denied permission
      const t = Object.assign(document.createElement('textarea'), { value: text })
      t.style.position = 'fixed'; t.style.opacity = '0'
      document.body.appendChild(t); t.select()
      const ok = document.execCommand('copy'); t.remove()
      return ok
    } catch { return false }
  }
}
