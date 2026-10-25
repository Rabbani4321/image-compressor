# PixelPress — Image Compressor

Static, browser-only JPG/JPEG, PNG, and WebP batch compressor and image editor.

## Run locally

Open index.html in a current browser, or use VS Code Live Server. No install or build step is required. Add up to 30 images (40 MB each), choose output format and quality, optionally resize/crop/rotate/flip or set a target size, then compress. Compare the untouched source with the final output. Download files individually or as a ZIP.

## Quality and formats

- Lossy compression is always a trade-off: higher quality usually keeps more visual detail and produces a larger file. The slider uses 0.10–1.00 values; the default is 0.95. Presets are Maximum Quality (0.98), Balanced (0.90), and Smaller File (0.75).
- JPEG output is lossy and has no transparency; transparent areas are composited over white. WebP supports transparency, but lossy WebP can change details and transparent edges. For PNG sources, the app explicitly warns if a lossy output format is selected.
- PNG output is lossless, preserves transparency, and ignores quality. It can produce a larger file.
- The browser's actual encoder MIME type must exactly match the selected output format. Unsupported encoding requests fail visibly rather than silently downloading a different format.
- Ordinary compression encodes one candidate at the original dimensions. Each target-size candidate is drawn from the original decoded image, never from a prior compressed candidate. Dimensions are reduced only for an explicit resize or target-size request.
- Comparison keeps the original preview unchanged. Preview images use their natural size up to the preview bounds; small images are not enlarged.

## Target size and ZIP

Target size is best effort. The app tries lower quality and then smaller dimensions, only in target-size mode. It marks a target met only if the final encoded bytes fit. ZIP creation is local, includes successful outputs only, uses unique names, and is capped at 128 MB.

## Privacy and resource handling

Image data is processed locally in the browser and is not uploaded. Source/result object URLs are released when entries are removed, the queue is cleared, or the page is left.

## Manual test checklist

- [ ] Verify the default slider reads 95% (0.95); presets select 0.98, 0.90, and 0.75; manual slider changes remain visible.
- [ ] With WebP/JPEG selected, compare output from source at several qualities; PNG output should remain lossless and transparent.
- [ ] Add a PNG then choose lossy WebP/JPEG and confirm the warning; unsupported browser encoders should show an error.
- [ ] Confirm ordinary compression preserves dimensions and uses the original source; test target-size mode and confirm only a real byte-size match is called met.
- [ ] Check original/output dimensions, sizes, savings or percentage larger, and compare previews at desktop/mobile sizes; verify small originals are not enlarged.
- [ ] Recheck batch add/remove/retry, crop/reset, resize/aspect ratio, rotate, flips, individual downloads, ZIP integrity and unique names.
- [ ] Try corrupt, unsupported, oversized, and over-80-megapixel files.
- [ ] Use `node --check script.js` after script changes.


## Enhance Photo

The separate **Enhance Photo** panel applies browser-side brightness, contrast, saturation, and a restrained unsharp-mask sharpness adjustment. It previews each adjustment from the selected original image and renders the download at the original pixel dimensions; it does not replace or modify the source file or the compressor's output. The two previews use the same fitted display bounds and retain the source aspect ratio.

These appearance adjustments can make a photo look brighter, punchier, or crisper, but they cannot recover details that were absent or lost in the source. Sharpening can also make noise and halos more visible. There is no noise-reduction filter or AI model connected. No image is sent to an external service. For future AI integration, a model/API would need an explicit, separate consent step and clear disclosure before any image leaves the browser.

Enhanced downloads use the currently selected output format and quality setting. PNG export preserves transparency; JPEG flattens transparent areas to white and is lossy; WebP supports alpha but may be lossy. Format support depends on the browser and unsupported output formats produce an error. Enhancement previews are scaled for speed; the downloaded image is processed full size, subject to the existing 80-megapixel safety limit and device memory. Full-resolution sharpening is limited to 12 megapixels because it requires extra memory.

## Manual enhancement checks

- Add a photo, open **Enhance Photo**, and move each of the four controls; confirm both previews have the same framing and only the enhanced preview changes.
- Use **Reset enhancements** and verify values return to their defaults and the enhanced preview matches the source.
- Download an enhanced image and check it opens, has the source pixel dimensions, and uses the selected format.
- Try a transparent PNG with PNG output and verify alpha is retained; select JPEG and verify transparent regions become white.
- Compare the source and downloaded file to verify the original queue image and compression result remain unchanged.
- Remove the selected image or use Reset; confirm the selector and previews clear without console errors.
- Test with a corrupt image and a large image; confirm a readable error appears and processing remains usable.
- Test the controls with keyboard navigation and at a narrow mobile viewport.

No live browser session was run as part of this update. Run this checklist in the target browsers before release.


## Auto Fix Photo Position

The **Auto Fix Photo Position** panel provides a local, reversible manual straighten control. A standard browser image decoder handles orientation metadata embedded in a photo, but browsers do not provide a reliable built-in detector for arbitrary scene tilt. This feature therefore does not guess or silently rotate photos: choose an angle using the slider, review the original and full-frame rotated preview, then accept or undo it. The corrected download is rendered once from the original at a bounding size large enough to retain the complete rotated image; it does not crop corners or change the queued source or compression result.

This is a geometric rotation aid, not automatic face detection, pose correction, or AI. Reliable automatic detection would require a tested local computer-vision model or a separately consented external service. No image is uploaded by this feature. As with any re-encoding, lossy JPEG/WebP output can affect image quality; PNG output preserves transparency.

### Manual position-correction checks

- Choose a photo and adjust the angle; verify the preview updates locally and shows the entire rotated frame.
- Accept a non-zero angle and verify the corrected download uses the chosen format and contains uncropped corners.
- Undo the correction; verify the angle returns to zero and no corrected download is available.
- Confirm the original preview, compression output, and other queued images remain unchanged.
- Try a transparent PNG with PNG output and JPEG output; check transparency behavior and read any export errors.
- Select another queued image, remove the selected image, and clear the queue; verify previews and controls stay synchronized and temporary URLs are cleaned up.
- Test on mobile and desktop using keyboard controls. No automatic tilt, face, or pose detection should be claimed.
