# Changelog

[English](#english) · [Русский](#русский)

## English

### Frazia 1.2 (12)

- Added four hardware-aware offline recognition modes matched to your Mac’s chip and memory: **Ultra-fast**, **Standard**, **High accuracy**, and **Maximum accuracy** (two-model cross-check, 16 GB+ RAM), with **Recommended for your Mac** guidance and quick switching in **Settings → Recognition** and the menu bar.
- Added native Apple Silicon **MLX** text cleanup (**Qwen 3.5** / **Gemma 4 Text**) and bundled **Gemma 4 Audio** (`llama.cpp`) cross-checking alongside **Whisper Large v3 Turbo**, with selectable **Fix errors and punctuation** or **Remove fillers and polish** styles (cleans hesitation sounds and spoken self-corrections).
- Added one-click sequential mode downloads showing exact remaining download size (`Download X.X GB`), estimated RAM, total disk footprint, and one-click **Remove Unused** storage cleanup that preserves your active mode.
- Added **Silero VAD** silence trimming and pause-aligned chunking (>25 s), **Custom words** with sentence-framed Whisper prompting, and automatic speech-engine eviction before cleanup on 8 GB Macs (~3 GB peak RAM). Requires **macOS 15 Sequoia or later** on Apple Silicon (`arm64`).

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.2-build.12).

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

### Frazia 1.1 (9)

- Replaced `AVAudioEngine` with a direct input-only CoreAudio `AUHAL` backend so recording with Bluetooth headsets (such as AirPods Pro) or separate microphones alongside virtual audio drivers (Teams, Zoom, Virtual Desktop) never creates Aggregate Devices, spikes `coreaudiod` CPU, or freezes the app.
- Moved microphone enumeration and capture startup off the main thread with bounded timeouts (`AudioHardwareDeadline`), keeping the menu bar icon, `⌥ Space`, `Esc` cancellation, and Quit responsive even if an audio driver stalls.

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.9).

### Frazia 1.1 (8)

- Accessibility permission stays saved across official updates; local development builds now use a separate `Frazia Dev` bundle identifier so they do not reset Accessibility for the installed app.
- Added **Reset & Request Again…** in setup and **Settings → General** to clear outdated macOS Accessibility entries in one click, plus a warning when running outside `/Applications`.
- Cloud API keys and encrypted dictation keys recover cleanly in Keychain without repeated system prompts if a code signature changes.
- Dictation overlay and fallback action buttons (Copy / Open Accessibility Settings) always stay inside `NSScreen.visibleFrame` near screen edges, across multi-monitor setups, and with longer localized labels.
- Added Homebrew tap installation and updates (`brew tap dvoineu/tap && brew install --cask frazia`).

[Download and full release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.8).

### Frazia 1.1 (6)

- Optional usage analytics (off until enabled in Settings; audio and dictated text are never included).

[Release notes](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.6).

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

### Frazia 1.2 (12)

- Добавлены четыре офлайн-режима распознавания, подбираемые под процессор и RAM вашего Mac: **Ультрабыстрый**, **Сбалансированный**, **Высокая точность** и **Максимальная точность** (сверка двумя моделями, от 16 ГБ RAM), с бейджем **«Рекомендуется для вашего Mac»** и переключением в **Настройках → Распознавание** и в меню-баре.
- Добавлена локальная правка текста на Apple Silicon через **MLX** (**Qwen 3.5** / **Gemma 4 Text**) и сверка со встроенным **Gemma 4 Audio** (`llama.cpp`) в паре с **Whisper Large v3 Turbo**; доступны стили **«Исправлять ошибки и пунктуацию»** и **«Убирать слова-паразиты и оговорки»**.
- Добавлена загрузка режима в один клик с точным объёмом докачки (`Скачать X,X ГБ`), оценкой RAM, размером на диске и очисткой лишних моделей кнопкой **«Удалить лишние»** без затрагивания активного режима.
- Добавлены обрезка тишины и нарезка длинных записей (>25 с) по паузам **Silero VAD**, **Словарь терминов** (`Custom words`) и автоматическая выгрузка речевой модели перед корректором на Mac с 8 ГБ RAM (пик ~3 ГБ). Требуется **macOS 15 Sequoia и новее** на Apple Silicon (`arm64`).

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.2-build.12).

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

### Frazia 1.1 (9)

- Заменён `AVAudioEngine` на прямой input-only захват CoreAudio `AUHAL`: запись с Bluetooth-наушников (например, AirPods Pro) и отдельных микрофонов при установленных виртуальных драйверах (Teams, Zoom, Virtual Desktop) больше не создаёт Aggregate Device, не раскручивает CPU `coreaudiod` и не блокирует приложение.
- Опрос микрофонов и старт записи вынесены с главного потока с жёсткими таймаутами (`AudioHardwareDeadline`): иконка в строке меню, `⌥ Пробел`, отмена по `Esc` и выход из приложения остаются мгновенными даже при зависшем аудиодрайвере.

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.9).

### Frazia 1.1 (8)

- Разрешение «Универсальный доступ» сохраняется при официальных обновлениях; локальные сборки разработки используют отдельный идентификатор `Frazia Dev` и не сбрасывают доступ установленного приложения.
- В мастере настройки и разделе **Настройки → Основное** добавлена кнопка **«Сбросить и запросить заново…»** для очистки устаревшей записи «Универсального доступа» в один клик, а также предупреждение при запуске вне папки «Программы».
- Облачные API-ключи и ключи шифрования истории корректно пересохраняются в Связке ключей без зависаний и повторных запросов при смене подписи.
- Окно диктовки и кнопки действий («Скопировать», «Открыть настройки Универсального доступа») гарантированно помещаются в видимую область экрана у краёв дисплея, на нескольких мониторах и с длинными русскими подписями.
- Добавлена установка и обновление через Homebrew (`brew tap dvoineu/tap && brew install --cask frazia`).

[Скачать и прочитать полное описание](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.8).

### Frazia 1.1 (6)

- Необязательная аналитика использования (выключена по умолчанию; аудио и текст диктовок никогда не передаются).

[Описание выпуска](https://github.com/dvoineu/VoiceHelper-downloads/releases/tag/v1.1-build.6).

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
