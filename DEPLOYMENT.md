# Static hosting notes

This project is a static QR Code Generator for GitHub Pages or another static host. It needs no backend, build step, API key, or runtime CDN connection.

## Keep the Pages setup

This update changes the site assets and user-facing content only; it does not add, remove, or modify GitHub Actions workflows, branch configuration, or repository settings. Keep the existing Pages source and branch configuration as it is.

At the published root, serve these files together with exact letter casing:

- `index.html`
- `style.css`
- `script.js`
- `favicon.svg`
- `qrcode-generator.min.js`
- `QR-LIBRARY-LICENSE.txt`

`script.js` loads the QR library using a relative path, so it works for a project site hosted below a repository path. Do not move the library into another directory unless you also update the relative script reference in `index.html`.

## Blogger embed (optional)

Once the Pages URL is already configured, add the following to a Blogger Page in HTML view. Replace the example URL with your actual HTTPS Pages URL:

```html
<div style="width:100%; min-height:900px;">
  <iframe
    src="https://USERNAME.github.io/REPOSITORY/"
    title="PixelPress QR Code Generator"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
    style="display:block; width:100%; height:1000px; border:0; border-radius:12px;"
  ></iframe>
</div>
```

Keep the iframe title, HTTPS URL, and download permission. Adjust height to your Blogger theme to reduce nested scrolling. Test that generated PNG downloads work from the embed because host policies can differ.

## Privacy and hosting behavior

All QR data generation and PNG rendering run in the browser using the local vendored library. The host serves the static page and library but receives no QR form values through application requests. The generated code is static and contains the entered value directly.
