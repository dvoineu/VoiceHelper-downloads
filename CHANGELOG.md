# Changelog

[English](#english) · [Русский](#русский)

## English

### Frazia 1.1 (11)

- Added built-in verified updates powered by Sparkle 2: use **Check for Updates…** in the menu bar icon or configure **Settings → General → Updates** (`Stable` or `Beta` channels, optional automatic daily checks with anonymous profile sharing disabled).
- Every update archive is signed with Ed25519 and re-validated against the running Apple Developer ID Designated Requirement (`teamIdentifier` + `dev.voicehelper.VoiceHelper`) before swapping `Frazia.app` in place, keeping Accessibility permission, settings, Keychain keys, and Whisper models intact.
- Gentle menu bar indicator avoids stealing focus during background update checks, and app relaunch is deferred until active dictation finishes.
- Builds `1.1 (10)` and earlier do not include built-in updates; update once via DMG, ZIP, or `brew upgrade --cask frazia`.

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.11).

### Frazia 1.1 (10)

- Usage analytics now runs automatically in the production app without a consent prompt, including after an upgrade with a previously saved refusal. Audio and dictation text are not included.
- Existing installation identities are preserved across updates, so restarting or upgrading does not repeat the first-observed event.

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.10).

### Frazia 1.1 (5)

VoiceHelper is now Frazia. Quit VoiceHelper and remove the old app from Applications before installing Frazia. Your settings, saved dictations, models and API keys use their existing locations.

### 1.1 (4) — 2026-11-01

- New setup window guides you through microphone access, Accessibility, recognition and a trial dictation.
- Close setup and resume at the same step, or skip it and return from the menu or General settings.
- Check your shortcut and confirm a phrase was inserted in the trial field before finishing setup. The trial does not send Return.
- See model sizes and available disk space before downloading. Try dictation while the selected model downloads; recognition waits until it is ready.
- API key checks follow the current key and server, so an outdated result cannot confirm a changed key.
- Existing settings, API keys, downloaded models and storage preferences are preserved. Users who have not completed or skipped setup will see it after updating.

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.4).

### 1.1 (3)

First public Developer ID signed and Apple notarized DMG/ZIP for Apple Silicon, with English and Russian interface languages.

[Previous release](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.3).

## Русский

### Frazia 1.1 (11)

- Добавлено встроенное проверяемое обновление через Sparkle 2: выберите **«Проверить обновления…»** в меню строки статуса или настройте **Настройки → Основное → Обновления** (каналы `Стабильный` / `Бета`, ежедневная автопроверка без отправки профиля системы).
- Каждый пакет обновления подписан Ed25519 и дополнительно проверяется по Apple Developer ID Designated Requirement (`teamIdentifier` + `dev.voicehelper.VoiceHelper`) перед заменой `Frazia.app` на месте — «Универсальный доступ», настройки, ключи в Связке ключей и модели Whisper сохраняются.
- Фоновая проверка мягко отмечает наличие обновления в строке меню без перехвата фокуса, а перезапуск откладывается до завершения активной диктовки.
- Сборки `1.1 (10)` и старше не имеют встроенного обновления: обновитесь один раз через DMG, ZIP или `brew upgrade --cask frazia`.

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.11).

### Frazia 1.1 (10)

- Аналитика использования теперь включена автоматически в production-приложении без запроса согласия, в том числе после обновления с ранее сохранённым отказом. Аудио и текст диктовок не передаются.
- При обновлении сохраняется идентификатор установки: перезапуск и обновление не создают повторного события первого наблюдаемого запуска.

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.10).

### Frazia 1.1 (5)

VoiceHelper теперь называется Frazia. Перед установкой завершите VoiceHelper и уберите старое приложение из «Программ». Frazia использует прежние настройки, историю диктовок, модели и API-ключи.

### 1.1 (4) — 2026-11-01

- Новый мастер проводит через доступ к микрофону, универсальный доступ, выбор распознавания и пробную диктовку.
- Закройте мастер и продолжите с того же шага или пропустите настройку и вернитесь из меню либо основного раздела настроек.
- Проверьте сочетание клавиш и вставку фразы в пробное поле перед завершением настройки. После пробы клавиша Return не нажимается.
- До загрузки видны размер модели и свободное место на диске. Пробу можно начать во время загрузки выбранной модели; распознавание дождётся её окончания.
- Проверка API-ключа учитывает текущий ключ и сервер: устаревший ответ не подтверждает изменённый ключ.
- Настройки, API-ключи, скачанные модели и режим хранения сохраняются. После обновления мастер появится у тех, кто ещё не завершил и не пропустил настройку.

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.4).

### 1.1 (3)

Первый публичный выпуск DMG/ZIP для Apple Silicon с подписью Developer ID, нотарификацией Apple, русским и английским интерфейсом.

[Предыдущий выпуск](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.3).
