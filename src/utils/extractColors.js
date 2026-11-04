// Reads image pixels in the browser and returns exact colors when possible, otherwise
// representative image colors sorted by how many sampled pixels each color represents.
const MAX_SIDE = 200
const MAX_COLORS = 24
const MIN_SPLIT_SHARE = 0.005
const MIN_SPLIT_SPREAD = 8

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => (img.naturalWidth ? resolve(img) : reject(new Error('Image has no size.')))
    img.onerror = () => reject(new Error('This image could not be read. Try a different file.'))
    img.src = url
  })
}

export function readPixels(img) {
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  const px = []
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue // skip transparent pixels
    px.push([data[i], data[i + 1], data[i + 2]])
  }
  if (!px.length) throw new Error('This image is fully transparent, so there are no colors to extract.')
  return px
}

const avg = (box) => {
  const s = [0, 0, 0]
  for (const p of box) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2] }
  return s.map((v) => Math.round(v / box.length))
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
function range(box) {
  const min = [255, 255, 255], max = [0, 0, 0]
  for (const p of box) for (let c = 0; c < 3; c++) { if (p[c] < min[c]) min[c] = p[c]; if (p[c] > max[c]) max[c] = p[c] }
  const spans = max.map((m, i) => m - min[i])
  const spread = Math.max(...spans)
  return { spread, channel: spans.indexOf(spread) }
}

function medianCut(pixels) {
  const list = [pixels]
  const minBoxSize = Math.ceil(pixels.length * MIN_SPLIT_SHARE)
  while (list.length < MAX_COLORS) {
    let idx = -1, bestScore = 0
    list.forEach((box, i) => {
      if (box.length < minBoxSize) return
      const { spread } = range(box)
      const score = box.length * spread
      if (spread > MIN_SPLIT_SPREAD && score > bestScore) { bestScore = score; idx = i }
    })
    if (idx < 0) break
    const box = list[idx]
    const { channel } = range(box)
    box.sort((a, b) => a[channel] - b[channel])
    const mid = box.length >> 1
    list.splice(idx, 1, box.slice(0, mid), box.slice(mid))
  }
  return list.filter((b) => b.length).map((box) => {
    const center = avg(box)
    let representative = box[0], bestDistance = dist(box[0], center)
    for (let i = 1; i < box.length; i++) {
      const pixel = box[i]
      const distance = dist(pixel, center)
      if (distance < bestDistance) { representative = pixel; bestDistance = distance }
    }
    return { rgb: representative, count: box.length }
  })
}

function kmeans(pixels, k) {
  let centers = [pixels[Math.floor(Math.random() * pixels.length)]]
  while (centers.length < k) { // k-means++ seeding: reruns differ but stay sensible
    const d = pixels.map((p) => Math.min(...centers.map((c) => dist(p, c) ** 2)))
    let r = Math.random() * d.reduce((a, b) => a + b, 0), i = 0
    while (i < d.length - 1 && (r -= d[i]) > 0) i++
    centers.push(pixels[i])
  }
  let groups = []
  for (let it = 0; it < 10; it++) {
    groups = centers.map(() => [])
    for (const p of pixels) {
      let bi = 0, bd = Infinity
      centers.forEach((c, i) => { const d = dist(p, c); if (d < bd) { bd = d; bi = i } })
      groups[bi].push(p)
    }
    centers = groups.map((g, i) => (g.length ? avg(g) : centers[i]))
  }
  return groups.map((g, i) => ({ rgb: centers[i], count: g.length })).filter((c) => c.count)
}

function exactPalette(pixels) {
  const counts = new Map()
  for (const [r, g, b] of pixels) {
    const key = (r << 16) | (g << 8) | b
    counts.set(key, (counts.get(key) || 0) + 1)
    if (counts.size > MAX_COLORS) return null
  }
  return [...counts].map(([key, count]) => ({
    rgb: [(key >> 16) & 255, (key >> 8) & 255, key & 255],
    count,
  })).sort((a, b) => b.count - a.count)
}

export function paletteFromPixels(pixels, variant = 0, targetCount) {
  if (!pixels.length) throw new Error('No visible pixels to extract colors from.')
  const exact = variant === 0 ? exactPalette(pixels) : null
  const palette = variant === 0
    ? exact || medianCut(pixels).sort((a, b) => b.count - a.count)
    : kmeans(pixels, Math.min(targetCount || MAX_COLORS, pixels.length)).sort((a, b) => b.count - a.count)
  return palette.map((color) => ({ rgb: color.rgb, share: color.count / pixels.length }))
}

/** Finds a variable-size palette; a target count is only used for randomized variations. */
export async function extractColors(url, variant = 0, targetCount) {
  const img = await loadImage(url)
  await new Promise((r) => setTimeout(r, 30)) // let the loading state paint
  let pixels = readPixels(img)
  if (pixels.length > 30000) { const step = Math.ceil(pixels.length / 30000); pixels = pixels.filter((_, i) => i % step === 0) }
  return paletteFromPixels(pixels, variant, targetCount)
}
