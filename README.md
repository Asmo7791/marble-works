# Marble Works

Sort glowing marbles into the capsule of their colour. A puzzle game for ages 5 to 11.

**Play:** https://asmo7791.github.io/marble-works/

## Install it as an app

- **iPhone / iPad (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap the menu, then **Install app** (or **Add to Home screen**).
- **Windows / Mac / Chromebook (Chrome or Edge):** open the link and click the install icon in the address bar.

Once installed it runs full screen and works offline. Progress is saved on the device.

## Desktop downloads

Windows, Mac and Linux builds are on the [Releases](../../releases) page.
They are not code-signed, so the first launch shows a warning:

- **Windows:** click **More info**, then **Run anyway**.
- **Mac:** right-click the app, choose **Open**, then **Open** again.

## How it's put together

| Path | What it is |
| --- | --- |
| `index.html` | The whole game (one file, no build step) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Makes it installable and playable offline |
| `fonts/` | Bundled fonts so nothing loads from the internet |
| `desktop/` | Electron wrapper for the desktop apps |
| `.github/workflows/pages.yml` | Publishes the game to GitHub Pages on every push to `main` |
| `.github/workflows/desktop.yml` | Builds the desktop apps when a tag like `v1.0.0` is pushed |

### Making changes

1. Edit `index.html` and open it in a browser to test.
2. Bump `VERSION` in `sw.js` so installed copies update.
3. Push to `main`; the site updates in a minute or two.
4. For new desktop builds, bump `version` in `desktop/package.json` and push a tag: `git tag v1.0.1 && git push --tags`.

To run the desktop app locally: `cd desktop && npm install && npm start`.
