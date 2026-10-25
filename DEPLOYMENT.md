# Deployment and Blogger embedding

This is a static site. GitHub Pages can host its HTML, CSS, JavaScript, and SVG assets without a backend or build step. These instructions describe publishing steps only; nothing is published by this project update.

## Publish with GitHub Pages

1. Create a GitHub repository for the site. On GitHub Free, the repository must be public for Pages; remember the published website is publicly accessible even if an eligible plan lets you publish from a private repository.
2. Put `index.html`, `style.css`, `script.js`, and `favicon.svg` at the repository root. You can include `README.md` and this guide too.
3. Commit and push the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
6. Wait for the Pages workflow to finish. Open the site URL shown under Pages. A project repository normally uses `https://USERNAME.github.io/REPOSITORY/`; a user site repository named `USERNAME.github.io` uses `https://USERNAME.github.io/`.
7. Test the hosted URL over HTTPS: load the page, choose an image, compress, download an output, and download a ZIP. Also check browser DevTools for 404s on `style.css`, `script.js`, or `favicon.svg`.

GitHub Pages publishes static files from the configured branch/folder and may take several minutes after a push to update. See GitHub's current guides for [creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [choosing a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Embed in a Blogger page

Publish and test the GitHub Pages URL first. In Blogger, create or edit a Page, switch its editor to **HTML view**, and insert this markup where the tool should appear. Replace the example URL with your actual Pages URL:

```html
<div style="width:100%; min-height:950px;">
  <iframe
    src="https://USERNAME.github.io/REPOSITORY/"
    title="PixelPress image compressor"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
    style="display:block; width:100%; height:1100px; border:0; border-radius:12px;"
  ></iframe>
</div>
```

Iframe settings:

- `src`: use the exact HTTPS Pages URL, including the repository path and trailing slash for a project site.
- `title`: keep a descriptive title so assistive technology can identify the embedded tool.
- `width:100%`: lets the iframe fill the Blogger content column. Use a wide/full-width Blogger page layout if your theme has one.
- `height`: 1100px is a starting value. The hosted page is longer than the compressor panel, so the iframe scrolls internally. Increase the height to reduce nested scrolling, or link to the hosted page in a new tab for the full site experience.
- `sandbox`: scripts are needed for compression and editing; same-origin storage lets the embedded site's theme preference work; forms and downloads allow browser file selection and generated-file downloads. The hosted Pages site is a different origin from Blogger. Do not embed untrusted pages with these permissions.
- Keep the Blogger page on HTTPS. If Blogger removes the `sandbox` attribute when saving, check the saved HTML and test the embed carefully. Do not paste this iframe into the Blogger theme XML; add it in the Page editor's HTML view. Blogger documents editing blog HTML in its [design help](https://support.google.com/blogger/answer/176245).

## Hosting checks and known limitations

- The app has no backend, server-side compression, analytics, or third-party runtime dependencies. Its image processing and ZIP writer run locally.
- Static file paths in the app are relative to `index.html`, so they work from a GitHub Pages project subpath. Keep the filenames and letter case unchanged.
- GitHub Pages hosting does not add an API or image upload service. The app's current size and pixel limits remain in effect.
- A Blogger iframe cannot automatically grow to the full cross-origin document height. It therefore scrolls within the selected iframe height.
- Actual browser compatibility for image encoders, downloads, and Blogger's iframe sanitization must be tested at the hosted URL after you publish. This guide does not publish the site or claim that hosted/browser testing has happened.
