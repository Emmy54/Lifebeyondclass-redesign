Lifebeyondclass homepage — portable static copy

Keep index.html, styles.css, tokens.css, base.css, and script.js together in this folder. The CSS design tokens and shared base styles are separate files imported by styles.css; if either is missing, the layout can lose its styling.

For the most reliable local preview, extract the folder and serve this folder as the web root:

  python3 -m http.server 8000

Then open http://localhost:8000 in your browser.

The page uses relative references for styles.css and script.js, so they continue to load from this folder. The hero photo still points to a Manus-managed asset, and the brand fonts/logo load from their external URLs; those are separate from the local CSS bundle.
