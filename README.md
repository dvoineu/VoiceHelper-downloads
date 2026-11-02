# Frazia for macOS

[Website](https://dvoineu.github.io/VoiceHelper-downloads/) · [Downloads and release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases)

Free local voice dictation at the text cursor. Local recognition works offline
once a model has been downloaded. Optional cloud providers use your own API key
and may charge separately.

## Languages

The website opens in English on your first visit. Use **English / Русский** in
the header to change language. Your choice is remembered when local browser
storage is available; an explicit language link always takes priority.

[English website](https://dvoineu.github.io/VoiceHelper-downloads/?lang=en) ·
[Сайт на русском](https://dvoineu.github.io/VoiceHelper-downloads/?lang=ru)

[Changelog](CHANGELOG.md) · [What’s new on the website](https://dvoineu.github.io/VoiceHelper-downloads/#whats-new)

Release notes include full English and Russian sections. Their reviewed source
is kept in [docs/releases/](docs/releases/). The same app installer includes
both interface languages.

## Download and install

When upgrading from VoiceHelper, quit it and move VoiceHelper.app out of Applications before installing Frazia. Keep your Library folders for saved dictations and models.

При переходе с VoiceHelper завершите его и уберите VoiceHelper.app из «Программ». Оставьте папки в Библиотеке на месте.

Frazia 1.1 (build 5) requires **macOS 13+ and Apple Silicon (M1 or later)**.
The application is Developer ID signed and Apple notarized. This release does
not include an Intel build or an automatic updater.

- [Download DMG](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.5/Frazia-1.1-5-arm64.dmg)
- [Download ZIP](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.5/Frazia-1.1-5-arm64.zip)
- [Installation instructions / Инструкция установки](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.5/INSTALL.txt)
- [SHA-256 checksums](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.5/SHA256SUMS)

Open the DMG (or extract the ZIP), drag Frazia.app into Applications, and
launch it. Follow setup for Microphone and Accessibility, choose recognition,
and try a phrase in its test field. Setup can be resumed or reopened from the menu.
Existing settings, API keys and downloaded models are preserved.

Скачайте DMG или ZIP, перенесите Frazia.app в «Программы» и запустите.
Пройдите мастер доступа к микрофону, универсального доступа и распознавания,
затем продиктуйте пробную фразу. Мастер можно продолжить или открыть из меню;
настройки, API-ключи и скачанные модели сохраняются.

To verify downloaded files, put them beside SHA256SUMS and run:

```sh
shasum -a 256 -c SHA256SUMS
```

See the release notes for verification results and installation test limitations.
Report download or installation problems in this repository's Issues.

## Website maintenance

This repository contains the bilingual static website and distribution materials;
application source code is maintained separately. The automatically generated
GitHub “Source code” archives contain website files, not the installed app.

Preview locally with `python3 -m http.server --directory site 8080`.
Run `python3 Tests/site_test.py` before opening a pull request. Changes go through
an Issue branch and PR targeting main. Merge requires the owner's authorization.
Actions checks each PR and publishes only `site/` after a merge to main. Manual
publishing also runs checks and is allowed only on main. Application installers
are attached to Releases and are never stored in the Git history or Pages artifact.

The website's download buttons follow the latest published release on their own:
on load the page asks the GitHub API for `releases/latest` and points the DMG, ZIP,
INSTALL.txt and SHA256SUMS links at its assets, and shows its version. The release tag must match `v<version>-build.<build>` and contain
both `Frazia-<version>-<build>-arm64` installers (DMG and ZIP), `INSTALL.txt`
and `SHA256SUMS`. Without JavaScript, or if the API is unreachable,
the links written in `index.html` are used.

When releasing another version, upload verified versioned assets and checksums
first and publish the release: the buttons switch to it. Then, in one PR, update the
fallback download links, visible version and metadata, the “What’s new” section,
these README links, and the release constants in Tests/site_test.py together.
Do not overwrite a published installer with different bytes under the same URL.

The setup video (`site/media/`) comes in two versions with subtitles built into the picture:
`frazia-guide-en.mp4` for the English page and `frazia-guide-ru-dav-v4.mp4` (Russian narration by DAV) for the Russian one.
The page switches the video, poster and chapter times with the language (`VIDEOS` in `site/js/app.js`).
The website has no trackers. The 3D scene on the first screen uses Three.js r170,
included locally under the MIT license: see [the license notice](site/vendor/LICENSE.txt).
It loads after the page and is skipped without WebGL.
