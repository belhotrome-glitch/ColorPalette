import assert from 'node:assert/strict'
import test from 'node:test'
import { paletteFromPixels } from './extractColors.js'

test('preserves exact RGB values and pixel shares for palettes with at most 24 colors', () => {
  const pixels = [
    [12, 34, 56], [12, 34, 56], [12, 34, 56],
    [210, 120, 45], [210, 120, 45],
    [1, 2, 3],
  ]

  assert.deepEqual(paletteFromPixels(pixels), [
    { rgb: [12, 34, 56], share: 0.5 },
    { rgb: [210, 120, 45], share: 1 / 3 },
    { rgb: [1, 2, 3], share: 1 / 6 },
  ])
})

test('uses colors present in the image when reducing a larger palette', () => {
  const pixels = Array.from({ length: 64 }, (_, i) => [i * 4, i * 2, 255 - i])
  const sourceColors = new Set(pixels.map((rgb) => rgb.join(',')))
  const palette = paletteFromPixels(pixels)

  assert.ok(palette.length <= 24)
  assert.ok(palette.every(({ rgb }) => sourceColors.has(rgb.join(','))))
  assert.ok(Math.abs(palette.reduce((sum, color) => sum + color.share, 0) - 1) < 1e-12)
})

test('rejects an empty pixel set', () => {
  assert.throws(() => paletteFromPixels([]), /No visible pixels/)
})
