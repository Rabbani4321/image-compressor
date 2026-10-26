# Existing GitHub Pages site

This repository contains two independent static tools. Keep the existing repository and its GitHub Pages publishing source unchanged. The original deployment guide targeted the `main` branch and repository root; no build step or backend is needed.

## Published paths

- Image Compressor: `/image-compressor/` (repository root)
- QR Code Generator: `/image-compressor/qr-code-generator/`

The compressor's `index.html`, `style.css`, `script.js`, and `favicon.svg` remain at the root. The QR tool has its own `index.html`, `style.css`, `script.js`, `favicon.svg`, `qrcode-generator.min.js`, and license in `qr-code-generator/`. The QR page uses relative asset references, so it resolves correctly at the nested Pages path. Keep each tool's assets in its own directory.

## Local checks

Open the repository root `index.html` or serve the repository root with VS Code Live Server. The QR tool is at `/qr-code-generator/` relative to that root. Test the root compressor and nested QR page separately, including generated downloads, before relying on the hosted copy.

No deployment settings were changed by this layout update. Existing Pages settings are controlled in repository settings; preserve the current branch/folder source. Do not add new tools' assets to the root if they can be kept in their own folder.
