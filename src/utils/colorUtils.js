const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)))
export const rgbToHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('').toUpperCase()
export const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
export const rgbString = (rgb) => `rgb(${rgb.map(clamp).join(', ')})`

export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return [h, s * 100, l * 100]
}
export function hslToRgb([h, s, l]) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0) * 255, f(8) * 255, f(4) * 255].map(clamp)
}

const luminance = ([r, g, b]) => {
  const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
export const contrastRatio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
/** Dark or white text, whichever reads better on the given color. */
export const readableText = (rgb) => (contrastRatio(rgb, [255, 255, 255]) >= contrastRatio(rgb, [23, 25, 35]) ? '#FFFFFF' : '#171923')

const NAMES = {
  Black: '#000000', Charcoal: '#2B2D33', 'Dark Gray': '#555555', Gray: '#808080', Silver: '#BFBFBF', 'Light Gray': '#DDDDDD', White: '#FFFFFF',
  Red: '#E02424', Crimson: '#B91C3C', Maroon: '#7F1D1D', Orange: '#F97316', Amber: '#F59E0B', Gold: '#D4AF37', Yellow: '#FACC15', Cream: '#F8E7A5',
  Lime: '#84CC16', Green: '#22A745', 'Forest Green': '#166534', Olive: '#6B7A2A', Mint: '#8EE4B5', Teal: '#14B8A6', Cyan: '#22D3EE', 'Sky Blue': '#7DD3FC',
  Blue: '#2563EB', Navy: '#1E2A5E', Indigo: '#4338CA', Purple: '#7C3AED', Violet: '#6C5CE7', Lavender: '#C4B5FD', Magenta: '#D946EF', Pink: '#F472B6',
  'Hot Pink': '#EC4899', Rose: '#FDA4AF', Brown: '#7C4A2D', Tan: '#C8A27A', Beige: '#E7D8C0', Peach: '#FDBA8C', Coral: '#FF7F6B', Sand: '#D9C29A',
}
const NAME_LIST = Object.entries(NAMES).map(([n, h]) => [n, hexToRgb(h)])
export function colorName(rgb) {
  let best = 'Color', bd = Infinity
  for (const [n, c] of NAME_LIST) {
    const d = (c[0] - rgb[0]) ** 2 + (c[1] - rgb[1]) ** 2 + (c[2] - rgb[2]) ** 2
    if (d < bd) { bd = d; best = n }
  }
  return best
}

export const complementary = (rgb) => { const [h, s, l] = rgbToHsl(rgb); return [hslToRgb([h + 180, s, l])] }
export const analogous = (rgb) => { const [h, s, l] = rgbToHsl(rgb); return [hslToRgb([h - 30, s, l]), hslToRgb([h + 30, s, l])] }
