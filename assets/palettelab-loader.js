const isGitHubPages = window.location.hostname === 'belhotrome-glitch.github.io'
const app = document.createElement('script')
app.type = 'module'
app.src = isGitHubPages ? new URL('./palettelab.js', import.meta.url).href : '/src/main.jsx'
if (isGitHubPages) {
  const styles = document.createElement('link')
  styles.rel = 'stylesheet'
  styles.href = new URL('./palettelab.css', import.meta.url).href
  document.head.append(styles)
}
document.body.append(app)
