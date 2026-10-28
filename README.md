# PaletteLab: Color Palette Extractor

Upload an image and extract its dominant colors. Runs entirely in the browser: no backend, API keys or uploads.

**Stack:** React, Vite, Tailwind CSS, lucide-react, Canvas API, Clipboard API.

## Run locally
Install [Node.js 20.19+ or 22.12+](https://nodejs.org/) first. From this folder, run:

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview
```

The app has separate Home (`/`), Extractor (`/extractor`), and About (`/about`) pages. In VS Code, use **Run and Debug → Run PaletteLab** to start the dev server and open the app in Chrome. The first run requires `npm install`.

## How extraction works
`src/utils/extractColors.js` downsizes the image (max 200px), skips transparent pixels, then adaptively splits color groups until it finds a useful palette (up to 24 colors). The palette size is chosen automatically for each image; near-identical colors are merged and results are sorted by pixel share. "New Palette" creates a randomized variation with the same number of colors.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. At vercel.com, choose **Add New → Project** and import the repo.
3. Vercel detects Vite. Build command `npm run build`, output directory `dist`. Select **Deploy**.

Or with the CLI: `npm i -g vercel && vercel`.
