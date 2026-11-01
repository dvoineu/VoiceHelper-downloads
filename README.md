# VoiceHelper for macOS

[Website](https://dvoineu.github.io/VoiceHelper-downloads/) · [Downloads and release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases)

Free local voice dictation at the text cursor. Local recognition works offline
once a model has been downloaded. Optional cloud providers use your own API key
and may charge separately.

## Download and install

VoiceHelper 1.1 (build 3) requires **macOS 13+ and Apple Silicon (M1 or later)**.
The application is Developer ID signed and Apple notarized. This release does
not include an Intel build or an automatic updater.

- [Download DMG](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.3/VoiceHelper-1.1-3-arm64.dmg)
- [Download ZIP](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.3/VoiceHelper-1.1-3-arm64.zip)
- [Installation instructions / Инструкция установки](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.3/INSTALL.txt)
- [SHA-256 checksums](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.3/SHA256SUMS)

Open the DMG (or extract the ZIP), drag VoiceHelper.app into Applications, and
launch it. Allow Microphone and Accessibility, download a local recognition
model in Settings, focus a text field and press Option-Space to dictate.

Скачайте DMG или ZIP, перенесите VoiceHelper.app в «Программы» и запустите.
Разрешите микрофон и «Универсальный доступ», скачайте модель в настройках.
Установите курсор в текстовое поле и нажмите Option-Пробел для диктовки.

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

When releasing another version, upload verified versioned assets and checksums
first, then update the website's download links, visible version and metadata,
these README links, and the release constants in Tests/site_test.py together.
Do not overwrite a published installer with different bytes under the same URL.

Three.js r170 is included under the MIT license: see [the license notice](site/vendor/LICENSE.txt).
