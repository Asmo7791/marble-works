# Contributing

Thanks for helping with Marble Works! Ideas, bug reports and pull requests are all welcome.

## Reporting bugs and ideas

Use the [issue templates](https://github.com/Asmo7791/marble-works/issues/new/choose). For bugs, say which device and browser you used and what level you were on.

## Making a change

1. Fork the repo and create a branch.
2. `npm install` then `npx playwright install chromium` (first time only).
3. Edit the game in `web/index.html`. Run `npm start` and play at http://localhost:8080.
4. Run `npm test` before opening a pull request.
5. Add a line to the **Unreleased** part of [CHANGELOG.md](CHANGELOG.md).

Guidelines:

- Keep the game a single, dependency-free HTML file that works offline.
- Keep it suitable for ages 5 to 11: clear, calm, no ads, no data collection.
- Every colour needs a matching shape so the game stays colour-blind friendly.
- If you add a file the game loads, also list it in `FILES` in `web/sw.js` (the tests check this).

## Releasing (maintainer)

1. Bump `VERSION` in `web/sw.js` so installed copies pick up the update.
2. Bump `version` in `package.json` and `desktop/package.json`, and move changelog entries under the new version.
3. Push to `main`. The web version updates automatically.
4. Run **Build desktop apps** from the Actions tab (or push a tag such as `v1.1.0`). It attaches the Windows, Mac and Linux builds to a GitHub release for that version.
