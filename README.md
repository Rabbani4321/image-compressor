# PixelPress — Image Compressor

Dependency-free HTML, CSS, and vanilla JavaScript image compression. Images are decoded, transformed, and encoded locally in your browser.

## Run locally

Open this project in VS Code and open `index.html` in a current browser, or use VS Code Live Server. No install or build step is required. Add up to 30 JPG, JPEG, PNG, or WebP images (up to 40 MB each), choose settings, and compress. Download results individually or use **Download all as ZIP**.

## Editing and output

- Optional width/height bounds are in pixels (maximum 12,000 per edge and 80 megapixels). With aspect ratio enabled, supplied bounds fit the image ratio; one dimension is resolved separately for each source image.
- Crop area uses left/top/width/height percentages of the source. Bounds must remain within the original frame. The crop appears in the source preview and is applied during compression. Reset crop restores the whole image; Reset all edits also clears resize and rotation/flip state.
- Rotation is in 90 degree steps; horizontal and vertical flips are available.
- Target size is best effort. The app tries lower quality, then smaller dimensions. It says **Target met** only when the actual encoded Blob size is at or below the requested bytes. Exact sizes cannot be guaranteed.
- WebP/JPEG can be lossy and change visual details. WebP supports alpha, although lossy encoding may change fine details and transparent edges. JPEG has no alpha and composites transparent pixels over white. PNG is lossless, preserves alpha, ignores quality, and can be larger.
- ZIP is generated locally in store mode using the ZIP file format directly; no third-party library or network import is needed. It contains successfully encoded outputs only, uses safe unique archive names, and is capped at 128 MB total to limit memory use.

## Privacy and limits

No image bytes are uploaded. Per-image inputs above 40 MB and processing outputs above 80 megapixels are rejected. Browser/device canvas or memory limits can be lower. Object URLs are released when items are removed, cleared, or when the page is left.

## Manual testing checklist

- [ ] Check local CSS, JavaScript, and SVG favicon references; navigation, FAQs, and theme switching.
- [ ] Add several input formats via picker and drag/drop; remove items and clear all.
- [ ] Adjust quality and output format and read format guidance.
- [ ] Try width only, height only, bounded resize with aspect ratio, and dimension limits.
- [ ] Change crop percentages; confirm source preview; compress and verify output; reset crop and reset all edits.
- [ ] Rotate and flip; confirm output preview and downloaded image orientation.
- [ ] Request KB and MB targets. Confirm only actual outputs within the byte target say **Target met**, and test an unattainably small target.
- [ ] Compress multiple images; compare dimensions, sizes, savings/larger state, and output format.
- [ ] Download individual files and ZIP; verify ZIP opens, includes only successful images, and duplicate source names remain unique.
- [ ] Try unsupported, empty, corrupt, over-40-MB, and over-80-megapixel files.
- [ ] Test keyboard use, mobile/tablet layouts, and clear/reset behavior.
