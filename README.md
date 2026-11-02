# VoiceHelper for macOS

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

VoiceHelper 1.1 (build 4) requires **macOS 13+ and Apple Silicon (M1 or later)**.
The application is Developer ID signed and Apple notarized. This release does
not include an Intel build or an automatic updater.

- [Download DMG](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.4/VoiceHelper-1.1-4-arm64.dmg)
- [Download ZIP](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.4/VoiceHelper-1.1-4-arm64.zip)
- [Installation instructions / Инструкция установки](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.4/INSTALL.txt)
- [SHA-256 checksums](https://github.com/dvoineu/VoiceHelper-downloads/releases/download/v1.1-build.4/SHA256SUMS)

Open the DMG (or extract the ZIP), drag VoiceHelper.app into Applications, and
launch it. Follow setup for Microphone and Accessibility, choose recognition,
and try a phrase in its test field. Setup can be resumed or reopened from the menu.
Existing settings, API keys and downloaded models are preserved.

Скачайте DMG или ZIP, перенесите VoiceHelper.app в «Программы» и запустите.
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

When releasing another version, upload verified versioned assets and checksums
first, then update the website's download links, visible version and metadata,
these README links, and the release constants in Tests/site_test.py together.
Do not overwrite a published installer with different bytes under the same URL.

The setup video (`site/media/`) is the Russian guide with subtitles built into the picture.
The website has no third-party scripts or trackers.
