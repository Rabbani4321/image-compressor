# PixelPress QR

A responsive, static QR Code Generator for website URLs, plain text, WhatsApp chats, Wi-Fi networks, email drafts, and phone numbers. QR codes are created in the browser. Form values—including Wi-Fi passwords—are not sent to a server or stored by the tool.

## Run locally

1. Keep these files together in the same project folder: `index.html`, `style.css`, `script.js`, `favicon.svg`, `qrcode-generator.min.js`, and `QR-LIBRARY-LICENSE.txt`.
2. Open `index.html` in a current browser, or open the folder in VS Code and use the Live Server extension.
3. Select a QR type, enter its details, choose the PNG pixel size, and select **Generate QR code**.
4. Scan the preview with a phone camera if available, then select **Download PNG**.

No build step, backend, API key, account, or runtime CDN connection is required. The QR encoder is bundled locally so Pages can serve it from a project subpath and the page also works offline after its files are available.

## QR formats and validation

- **Website:** only `http://` and `https://` URLs are accepted.
- **Plain text:** accepts a non-empty message. QR capacity is limited; exceptionally long content shows an error instead of producing a code.
- **WhatsApp:** enter a phone number with country code. The QR contains a `wa.me` link, with an optional URL-encoded message.
- **Wi-Fi:** creates the standard `WIFI:` payload with SSID, security mode, optional password, and hidden-network flag. WPA password length is validated; WEP is included for legacy compatibility. A Wi-Fi QR contains its password and should be shared carefully.
- **Email:** validates an email address and encodes an optional subject/body into a `mailto:` link.
- **Phone:** validates and encodes a number as a `tel:` link.
- The output size control changes the PNG dimensions (256–1024 px). The code uses QR error-correction level M and keeps the required quiet-zone border. Generated codes are static and do not provide redirects, analytics, or scan tracking.
- Clear removes the generated preview and entered form values. Editing data after generation invalidates the old preview so it cannot be mistaken for a current code.

## Privacy

The bundled QR library builds the matrix in JavaScript on the current device. The canvas preview and PNG download are produced locally. This page does not upload values, call a QR API, use analytics, or write entered details to local storage. The optional theme preference is the only value stored locally.

Avoid sharing a Wi-Fi QR publicly unless you intend its connection details to be available to people who can scan or photograph it.

## Library

The project vendors `qrcode-generator` version 2.0.4 by Kazuhiko Arase, an MIT-licensed JavaScript QR encoder. See `QR-LIBRARY-LICENSE.txt`. The vendored browser build is `qrcode-generator.min.js`; the application code uses its QR matrix API and draws a PNG canvas locally.

## Manual test checklist

- [ ] Generate a website code with an HTTPS URL; reject blank input, malformed URLs, and non-HTTP protocols.
- [ ] Generate a plain-text code, including punctuation and non-ASCII characters; reject blank text and verify very long content gets a useful capacity error.
- [ ] Generate a WhatsApp code with a country code and optional message; reject malformed/too-short numbers.
- [ ] Generate secured and open Wi-Fi codes; test a hidden network, escaped SSID/password characters, missing names, and invalid WPA password lengths.
- [ ] Generate an email code with and without optional subject/body; reject invalid email addresses.
- [ ] Generate phone codes with country code and punctuation; reject malformed numbers.
- [ ] Change PNG size after generation and verify the preview dimensions update. Download PNG and confirm it opens and is the selected pixel size.
- [ ] Edit a value after generating; verify the old code is cleared. Use **Clear**; verify inputs, errors, and preview reset.
- [ ] Toggle light/dark themes and use keyboard-only navigation through every field and action.
- [ ] At narrow mobile width and tablet/desktop widths, verify the form and preview stack cleanly without horizontal scrolling.
- [ ] Disconnect from the network after opening the page and confirm generation still works with the local library.

Run the JavaScript syntax check with `node --check script.js`. A live browser session is needed to confirm visual/mobile behavior on your target browsers.


## Automated local verification performed

A temporary headless Chrome run verified successful generation and expected payloads for Website, Plain text, WhatsApp, secured Wi-Fi, open Wi-Fi, Email, and Phone. It rejected invalid URLs, blank text, malformed numbers, invalid WPA passwords, invalid email addresses, and over-capacity text. It also checked a 512 × 512 PNG download signature/dimensions, Clear behavior, and responsive layout without horizontal overflow at 390 px mobile and 768 px tablet widths. The temporary harness and browser download were removed after the run.