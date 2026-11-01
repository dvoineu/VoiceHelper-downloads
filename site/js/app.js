import { VoiceHelperScene3D } from './scene3d.js';
import { I18N } from './i18n.js';

/**
 * VoiceHelper — Interactive Application Controller
 * Connects the Three.js 3D Observatory, Live Caret Workbench, Web Audio FFT Spectrum,
 * Mac Hardware Model Recommender, Storage Inspector, and Bilingual SEO state.
 */

const MODEL_CATALOG = [
  {
    id: 'tiny',
    displayName: 'Tiny',
    sizeMB: 75,
    speed: 5,
    accuracy: 1,
    sha256: 'be07e048…6e1b21',
    summaryRu: 'Самая быстрая, для чёткой английской речи',
    summaryEn: 'Fastest, best for clear English',
  },
  {
    id: 'base',
    displayName: 'Base',
    sizeMB: 142,
    speed: 4,
    accuracy: 2,
    sha256: '60ed5bc3…ba2efe',
    summaryRu: 'Быстрая и лёгкая модель для английского',
    summaryEn: 'Fast and light for English',
  },
  {
    id: 'small',
    displayName: 'Small',
    sizeMB: 466,
    speed: 3,
    accuracy: 3,
    sha256: '1be3a9b2…ea987b',
    summaryRu: 'Баланс скорости и точности для русского и 14 языков',
    summaryEn: 'Balanced for Russian and multilingual speech',
  },
  {
    id: 'medium',
    displayName: 'Medium',
    sizeMB: 1500,
    speed: 2,
    accuracy: 4,
    sha256: '6c14d5ad…56208',
    summaryRu: 'Повышенная точность, требовательнее к ресурсам',
    summaryEn: 'Higher accuracy, slower on older Macs',
  },
  {
    id: 'large-v3-turbo',
    displayName: 'Large v3 Turbo',
    sizeMB: 1620,
    speed: 2,
    accuracy: 5,
    sha256: '1fc70f77…e2bc69',
    summaryRu: 'Максимальная точность для сложной и беглой речи (Metal)',
    summaryEn: 'Highest accuracy for complex speech (Metal GPU)',
  },
];

const WORKBENCH_TARGETS = {
  terminal: {
    title: 'Terminal.app — zsh (VoiceHelper)',
    axRole: 'AXTextArea · TerminalWindow',
    prefix: 'dvoineu@macbook VoiceHelper % ',
    phrases: {
      ru: [
        {
          label: 'Git-коммит и запуск тестов',
          spoken: 'git commit -m "feat: проверена вставка у курсора без потери фокуса" && swift test',
          words: 12,
        },
        {
          label: 'Проверка локальной модели Whisper (CLI)',
          spoken: 'build/VoiceHelper.app/Contents/MacOS/VoiceHelper --transcribe-test samples/jfk.wav local --model small',
          words: 8,
        },
        {
          label: 'Сборка нотаризованного релиза с командой «отправь»',
          spoken: 'python3 Scripts/release.py check\n# Голосовая команда: «отправь» → нажат Return ⏎',
          words: 11,
          autoSend: true,
        },
      ],
      en: [
        {
          label: 'Git commit and run test suite',
          spoken: 'git commit -m "feat: verify non-activating cursor insertion" && swift test',
          words: 11,
        },
        {
          label: 'Run local Whisper CLI transcription test',
          spoken: 'build/VoiceHelper.app/Contents/MacOS/VoiceHelper --transcribe-test samples/jfk.wav local --model small',
          words: 8,
        },
        {
          label: 'Preflight notarized release with "send it"',
          spoken: 'python3 Scripts/release.py check\n# Voice command: "send it" → pressed Return ⏎',
          words: 11,
          autoSend: true,
        },
      ],
    },
  },
  vscode: {
    title: 'VS Code / Qoder — AppState.swift',
    axRole: 'AXTextArea · AXManualAccessibility',
    prefix: '// Sources/VoiceHelper/AppState.swift\n',
    phrases: {
      ru: [
        {
          label: 'Документация функции с командой «новая строка»',
          spoken: '/// Проверяет целевое AX-поле перед вставкой текста.\n/// При смене фокуса сохраняет диктовку в History.',
          words: 14,
        },
        {
          label: 'Swift guard-проверка прав Accessibility',
          spoken: 'guard Permissions.isAccessibilityTrusted() else { return .copyManually(reason: .missingAccessibility) }',
          words: 9,
        },
        {
          label: 'Комментарий к Silero VAD 6.2.0',
          spoken: '// Тихая речь проверяется через Silero VAD 6.2.0 на CPU без сетевых запросов.',
          words: 13,
        },
      ],
      en: [
        {
          label: 'Doc comment with "new line" voice command',
          spoken: '/// Verifies target AX element before text injection.\n/// Preserves transcript in History if focus changes.',
          words: 15,
        },
        {
          label: 'Swift guard check for Accessibility trust',
          spoken: 'guard Permissions.isAccessibilityTrusted() else { return .copyManually(reason: .missingAccessibility) }',
          words: 9,
        },
        {
          label: 'Silero VAD 6.2.0 offline speech verification note',
          spoken: '// Quiet speech is verified on CPU via Silero VAD 6.2.0 with zero network calls.',
          words: 15,
        },
      ],
    },
  },
  telegram: {
    title: 'Telegram — Команда продукта',
    axRole: 'AXTextField · ChatInputBar',
    prefix: 'Сообщение → @team_chat:\n',
    phrases: {
      ru: [
        {
          label: 'Быстрый ответ в чат с «новый абзац» и «отправь»',
          spoken: 'Собрал новый билд для macOS на Metal.\n\nЛокальная модель Small распознаёт русскую речь за доли секунды и не трогает буфер обмена. [Отправлено ⏎]',
          words: 22,
          autoSend: true,
        },
        {
          label: 'Статус по нотаризации Apple DMG',
          spoken: 'Developer ID подпись и notarization прошли успешно. Контрольные суммы SHA-256 опубликованы вместе с архивами.',
          words: 12,
        },
        {
          label: 'Заметка во время звонка (тихий голос)',
          spoken: 'Даже когда говорю вполголоса на созвоне, Silero VAD не отбрасывает фразу.',
          words: 11,
        },
      ],
      en: [
        {
          label: 'Quick reply with "new paragraph" and "send it"',
          spoken: 'Built the new macOS release with Metal acceleration.\n\nLocal Small model transcribes in a split second and restores the clipboard. [Sent ⏎]',
          words: 22,
          autoSend: true,
        },
        {
          label: 'Apple notarization DMG status update',
          spoken: 'Developer ID signature and Apple notarization passed; SHA-256 checksums are published alongside the downloads.',
          words: 13,
        },
        {
          label: 'Quiet voice note during a late call',
          spoken: 'Even speaking quietly during a call, Silero VAD captures the full sentence.',
          words: 12,
        },
      ],
    },
  },
  safari: {
    title: 'Safari — GitHub Pull Request #99',
    axRole: 'AXTextArea · WebKitEditable',
    prefix: '## Summary of Changes\n',
    phrases: {
      ru: [
        {
          label: 'Описание PR с маркированным списком',
          spoken: '- Добавлена 3D-сцена Three.js с реакцией на голос и скролл\n- Настроена микроразметка Schema.org SoftwareApplication и FAQPage',
          words: 16,
        },
        {
          label: 'Результат проверки безопасности',
          spoken: 'В режиме Save dictations → Off аудио остаётся только в RAM и удаляется сразу после вставки.',
          words: 15,
        },
        {
          label: 'Инструкция для ревьюера',
          spoken: 'Нажмите Option+Space в любом текстовом поле или удерживайте клавишу для режима Push-to-talk.',
          words: 12,
        },
      ],
      en: [
        {
          label: 'PR summary with bullet points',
          spoken: '- Added audio-reactive Three.js 3D scene with scroll morphing\n- Configured Schema.org SoftwareApplication and FAQPage JSON-LD',
          words: 16,
        },
        {
          label: 'Privacy verification note',
          spoken: 'With Save dictations → Off, audio stays strictly in RAM and is cleared right after insertion.',
          words: 16,
        },
        {
          label: 'Reviewer walkthrough note',
          spoken: 'Press Option+Space in any text field, or hold the key for Push-to-talk dictation.',
          words: 13,
        },
      ],
    },
  },
};

const STORAGE_MODES = {
  off: {
    ru: 'Режим по умолчанию: Off — memory only.\n• Запись на диск: 0 байт (архивные файлы и ключ шифрования даже не открываются)\n• Оперативная память: буфер PCM до 19,2 МБ освобождается сразу после распознавания\n• История в памяти: последние 50 текстовых диктовок доступны для копирования до выхода из приложения',
    en: 'Default Mode: Off — memory only.\n• Disk writes: 0 bytes (archive files and encryption keys are never opened)\n• RAM lifecycle: up to 19.2 MB PCM buffer is freed immediately after recognition\n• In-memory History: last 50 text transcripts stay available to copy until you quit',
  },
  '24h': {
    ru: 'Режим: 24 часа (Аудио и текст на диске).\n• Путь: ~/Library/Application Support/VoiceHelper/Dictations/ (права 0700/0600, исключено из резервных копий)\n• Шифрование: AES-GCM, криптографический ключ хранится только в связке ключей macOS Keychain этого Mac\n• Восстановление: журнал подтверждается раз в секунду; после сбоя доступно действие Recognize Again…',
    en: 'Mode: 24 Hours (Audio & Text on disk).\n• Path: ~/Library/Application Support/VoiceHelper/Dictations/ (chmod 0700/0600, excluded from backups)\n• Encryption: AES-GCM with the key stored exclusively in this Mac’s Keychain\n• Crash recovery: journal flushes every ~1s; interrupted audio is recoverable via Recognize Again…',
  },
  '7d': {
    ru: 'Режим: 7 дней для текста и 24 часа для аудио.\n• Квоты: максимум 256 МиБ хранилища, до 64 МиБ аудио на диктовку и до 200 сессий\n• Автоочистка: сроки хранения проверяются при запуске, обращении к данным и каждую минуту работы\n• Безопасность: API-ключи и сырые ответы облачных серверов никогда не сохраняются в файлы сессии',
    en: 'Mode: 7 Days Text & 24 Hours Audio.\n• Quotas: capped at 256 MiB total storage, 64 MiB audio per dictation, and 200 sessions\n• Automatic expiry: retention deadlines are enforced on launch, data access, and every minute\n• Security: API keys and raw server responses are never written to session files',
  },
};

const FORMATION_NAMES = {
  ru: [
    'Формация 01: Резонанс звуковой волны',
    'Формация 02: Фиксация у текстовой каретки',
    'Формация 03: Нейрорешётка Apple Silicon Metal',
    'Формация 04: Криптоконтур памяти AES-GCM',
    'Формация 05: Планетарная сфера 14 языков',
  ],
  en: [
    'Formation 01: Acoustic Wave Resonance',
    'Formation 02: Text Caret & HUD Lock',
    'Formation 03: Apple Silicon Metal Lattice',
    'Formation 04: AES-GCM Cryptographic Vault',
    'Formation 05: 14-Language Planetary Globe',
  ],
};

class VoiceHelperApp {
  constructor() {
    this.lang = this.detectInitialLang();
    this.currentTarget = 'terminal';
    this.currentPhraseIndex = 0;
    this.isDictating = false;
    this.simulateFocusTamper = false;
    this.lastDictatedText = WORKBENCH_TARGETS.terminal.phrases[this.lang][0].spoken;
    this.storageMode = 'off';

    // Audio state
    this.audioCtx = null;
    this.micStream = null;
    this.analyser = null;
    this.isLiveMicActive = false;
    this.spectrumBands = new Float32Array(24).fill(0.08);
    this.simTimer = null;
    this.dictationTimer = null;

    this.init();
  }

  detectInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const qLang = params.get('lang');
    if (qLang === 'en' || qLang === 'ru') return qLang;
    try {
      const saved = localStorage.getItem('voicehelper-language');
      if (saved === 'en' || saved === 'ru') return saved;
    } catch (_) {
      // Language selection also works when browser storage is unavailable.
    }
    return 'en';
  }

  init() {
    this.buildMeterSegments();
    this.buildFloatingHudBars();

    const canvas = document.getElementById('vh-canvas-3d');
    this.scene3d = new VoiceHelperScene3D(canvas, {
      onKeycapClick: () => this.toggleDictation(false),
      onFormationChange: (idx) => this.syncFormationUI(idx),
    });

    this.bindNavigationAndLang();
    this.bindStageDock();
    this.bindWorkbench();
    this.bindEngines();
    this.bindModelRecommender();
    this.bindStorageInspector();
    this.bindGlobalShortcuts();
    this.bindScrollTracking();
    this.startAudioSimulationLoop();

    this.applyLanguage(this.lang);
    this.renderWorkbench();
    this.renderModelRecommender();
    this.renderStorageReadout();
  }

  buildMeterSegments() {
    const strip = document.getElementById('meter-24-strip');
    if (!strip) return;
    strip.innerHTML = '';
    this.meterSegs = [];
    for (let i = 0; i < 24; i++) {
      const seg = document.createElement('span');
      seg.className = 'meter-seg';
      if (i >= 16 && i < 21) seg.classList.add('is-warm');
      if (i >= 21) seg.classList.add('is-hot');
      strip.appendChild(seg);
      this.meterSegs.push(seg);
    }
  }

  buildFloatingHudBars() {
    const cluster = document.getElementById('floating-hud-wave');
    if (!cluster) return;
    cluster.innerHTML = '';
    this.hudBars = [];
    for (let i = 0; i < 9; i++) {
      const bar = document.createElement('span');
      bar.className = 'hud-wave-bar';
      bar.style.setProperty('--bar-h', `${8 + (i % 3) * 4}px`);
      cluster.appendChild(bar);
      this.hudBars.push(bar);
    }
  }

  bindNavigationAndLang() {
    document.querySelectorAll('[data-language]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        const language = link.dataset.language;
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
        this.applyLanguage(language);
      });
    });

    const micBtn = document.getElementById('live-mic-btn');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleLiveMicrophone());
    }

    const heroDictateBtn = document.getElementById('hero-dictate-btn');
    if (heroDictateBtn) {
      heroDictateBtn.addEventListener('click', () => {
        this.toggleDictation(false);
        const wb = document.getElementById('workbench');
        if (wb && !this.isDictating) {
          wb.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    const floatingActionBtn = document.getElementById('floating-hud-action');
    if (floatingActionBtn) {
      floatingActionBtn.addEventListener('click', () => this.toggleDictation(false));
    }
  }

  bindStageDock() {
    this.stagePills = Array.from(document.querySelectorAll('.stage-pill'));
    this.stagePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const idx = Number(pill.dataset.formation || 0);
        this.scene3d.setFormation(idx, true);
        this.syncFormationUI(idx);
      });
    });
  }

  syncFormationUI(idx) {
    if (this.stagePills) {
      this.stagePills.forEach((pill, i) => {
        pill.setAttribute('aria-pressed', String(i === idx));
      });
    }
    const labelEl = document.getElementById('obs-formation-label');
    if (labelEl) {
      const list = FORMATION_NAMES[this.lang] || FORMATION_NAMES.ru;
      labelEl.textContent = list[idx] || list[0];
    }
  }

  bindWorkbench() {
    const tabBtns = document.querySelectorAll('.target-tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.currentTarget = btn.dataset.target || 'terminal';
        this.currentPhraseIndex = 0;
        tabBtns.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
        this.renderWorkbench();
      });
    });

    const safetyToggle = document.getElementById('safety-focus-toggle');
    if (safetyToggle) {
      safetyToggle.addEventListener('change', () => {
        this.simulateFocusTamper = safetyToggle.checked;
        this.updateAxBadge();
      });
    }

    const triggerBtn = document.getElementById('wb-trigger-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.toggleDictation(false));
    }

    const sendShiftBtn = document.getElementById('wb-send-shift-btn');
    if (sendShiftBtn) {
      sendShiftBtn.addEventListener('click', () => {
        if (this.isDictating) {
          this.finishDictation(true);
        } else {
          this.startDictation(true);
        }
      });
    }

    const pasteLastBtn = document.getElementById('wb-paste-last-btn');
    if (pasteLastBtn) {
      pasteLastBtn.addEventListener('click', () => this.pasteLastDictation());
    }

    const copyManualBtn = document.getElementById('wb-copy-manual-btn');
    if (copyManualBtn) {
      copyManualBtn.addEventListener('click', () => {
        if (navigator.clipboard && this.lastDictatedText) {
          navigator.clipboard.writeText(this.lastDictatedText).catch(() => {});
        }
        copyManualBtn.textContent = this.lang === 'ru' ? 'Скопировано ✓' : 'Copied ✓';
        setTimeout(() => {
          copyManualBtn.textContent = I18N[this.lang].wbCopyManualBtn;
        }, 1600);
      });
    }
  }

  updateAxBadge() {
    const axBadge = document.getElementById('wb-ax-badge');
    if (!axBadge) return;
    const dict = I18N[this.lang];
    if (this.simulateFocusTamper) {
      axBadge.classList.add('is-tampered');
      axBadge.textContent = dict.wbAxTampered;
    } else {
      axBadge.classList.remove('is-tampered');
      axBadge.textContent = dict.wbAxVerified;
    }
  }

  renderWorkbench() {
    const targetData = WORKBENCH_TARGETS[this.currentTarget] || WORKBENCH_TARGETS.terminal;
    const phrases = targetData.phrases[this.lang] || targetData.phrases.ru;
    const selectedPhrase = phrases[this.currentPhraseIndex] || phrases[0];

    const winTitle = document.getElementById('wb-window-title');
    if (winTitle) winTitle.textContent = targetData.title;

    const axRole = document.getElementById('wb-ax-role');
    if (axRole) axRole.textContent = targetData.axRole;

    const prefixEl = document.getElementById('wb-prompt-prefix');
    if (prefixEl) prefixEl.textContent = targetData.prefix;

    const insertedEl = document.getElementById('wb-inserted-text');
    if (insertedEl && !this.isDictating) {
      insertedEl.textContent = selectedPhrase.spoken;
      this.lastDictatedText = selectedPhrase.spoken;
    }

    // Phrase selector buttons
    const listEl = document.getElementById('wb-phrase-list');
    if (listEl) {
      listEl.innerHTML = '';
      phrases.forEach((p, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'phrase-btn';
        btn.setAttribute('aria-pressed', String(idx === this.currentPhraseIndex));
        btn.textContent = `${idx + 1}. ${p.label}`;
        btn.addEventListener('click', () => {
          this.currentPhraseIndex = idx;
          this.renderWorkbench();
          this.startDictation(Boolean(p.autoSend));
        });
        listEl.appendChild(btn);
      });
    }

    this.updateAxBadge();
  }

  playAcousticChime(type = 'start') {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';

      if (type === 'start') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);
      } else if (type === 'stop') {
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.11);
      } else {
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.14);
      }

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (_) {
      // Ignore audio autoplay restriction if triggered without user gesture
    }
  }

  toggleDictation(sendOnStop = false) {
    if (this.isDictating) {
      this.finishDictation(sendOnStop);
    } else {
      this.startDictation(sendOnStop);
    }
  }

  startDictation(autoSend = false) {
    if (this.dictationTimer) clearInterval(this.dictationTimer);
    this.isDictating = true;
    this.scene3d.setRecordingState(true);
    this.playAcousticChime('start');

    const dict = I18N[this.lang];
    const targetData = WORKBENCH_TARGETS[this.currentTarget] || WORKBENCH_TARGETS.terminal;
    const phrases = targetData.phrases[this.lang] || targetData.phrases.ru;
    const phraseObj = phrases[this.currentPhraseIndex] || phrases[0];
    const fullText = phraseObj.spoken;

    const insertedEl = document.getElementById('wb-inserted-text');
    const inlineHud = document.getElementById('wb-inline-hud');
    const inlineStatus = document.getElementById('wb-inline-status');
    const triggerBtn = document.getElementById('wb-trigger-btn');
    const floatingCapsule = document.getElementById('floating-hud-capsule');
    const floatingTitle = document.getElementById('floating-hud-title');
    const ringFg = document.getElementById('pause-ring-fg');
    const copyBtn = document.getElementById('wb-copy-manual-btn');

    if (copyBtn) copyBtn.hidden = true;
    if (inlineHud) inlineHud.dataset.outcome = 'recording';
    if (inlineStatus) inlineStatus.textContent = dict.wbHudRecording;
    if (triggerBtn) triggerBtn.textContent = dict.wbTriggerBtnRec;
    if (floatingCapsule) floatingCapsule.dataset.state = 'recording';
    if (floatingTitle) floatingTitle.textContent = dict.wbHudRecording;
    if (ringFg) ringFg.style.setProperty('--ring-offset', '69.1');

    let charIdx = 0;
    const totalChars = fullText.length;

    this.dictationTimer = setInterval(() => {
      charIdx = Math.min(totalChars, charIdx + Math.max(2, Math.ceil(totalChars / 18)));
      if (insertedEl) {
        insertedEl.textContent = fullText.slice(0, charIdx);
      }
      const progress = charIdx / totalChars;
      if (ringFg) {
        const offset = (1 - progress) * 69.1;
        ringFg.style.setProperty('--ring-offset', offset.toFixed(1));
      }
      if (charIdx >= totalChars) {
        this.finishDictation(autoSend || Boolean(phraseObj.autoSend));
      }
    }, 85);
  }

  finishDictation(sendReturn = false) {
    if (this.dictationTimer) {
      clearInterval(this.dictationTimer);
      this.dictationTimer = null;
    }
    this.isDictating = false;
    this.scene3d.setRecordingState(false);

    const dict = I18N[this.lang];
    const targetData = WORKBENCH_TARGETS[this.currentTarget] || WORKBENCH_TARGETS.terminal;
    const phrases = targetData.phrases[this.lang] || targetData.phrases.ru;
    const phraseObj = phrases[this.currentPhraseIndex] || phrases[0];

    const insertedEl = document.getElementById('wb-inserted-text');
    const inlineHud = document.getElementById('wb-inline-hud');
    const inlineStatus = document.getElementById('wb-inline-status');
    const triggerBtn = document.getElementById('wb-trigger-btn');
    const floatingCapsule = document.getElementById('floating-hud-capsule');
    const floatingTitle = document.getElementById('floating-hud-title');
    const ringFg = document.getElementById('pause-ring-fg');
    const copyBtn = document.getElementById('wb-copy-manual-btn');

    this.lastDictatedText = phraseObj.spoken;
    if (ringFg) ringFg.style.setProperty('--ring-offset', '0');
    if (triggerBtn) triggerBtn.textContent = dict.wbTriggerBtnIdle;

    if (this.simulateFocusTamper) {
      this.playAcousticChime('warn');
      if (insertedEl) {
        insertedEl.textContent =
          this.lang === 'ru'
            ? '[Защита активна: целевое поле изменилось — автоматический ввод остановлен]'
            : '[Safety lock: target field changed — blind typing prevented]';
      }
      if (inlineHud) inlineHud.dataset.outcome = 'error';
      if (inlineStatus) inlineStatus.textContent = dict.wbHudBlocked;
      if (floatingCapsule) floatingCapsule.dataset.state = 'warning';
      if (floatingTitle) floatingTitle.textContent = dict.wbHudBlocked;
      if (copyBtn) copyBtn.hidden = false;
    } else {
      this.playAcousticChime('stop');
      if (insertedEl) insertedEl.textContent = phraseObj.spoken;
      if (inlineHud) inlineHud.dataset.outcome = 'inserted';
      const msg = sendReturn ? dict.wbHudInsertedSent : dict.wbHudInserted;
      if (inlineStatus) inlineStatus.textContent = `${msg} (${phraseObj.words} w)`;
      if (floatingCapsule) floatingCapsule.dataset.state = 'idle';
      if (floatingTitle) floatingTitle.textContent = msg;
      if (copyBtn) copyBtn.hidden = true;
    }
  }

  pasteLastDictation() {
    const insertedEl = document.getElementById('wb-inserted-text');
    const inlineStatus = document.getElementById('wb-inline-status');
    this.scene3d.triggerKeycapPulse();
    this.playAcousticChime('stop');
    if (insertedEl && this.lastDictatedText) {
      insertedEl.textContent = this.lastDictatedText;
    }
    if (inlineStatus) {
      inlineStatus.textContent =
        this.lang === 'ru'
          ? 'Вставлена последняя диктовка (⌥⇧V) · Буфер обмена сохранён'
          : 'Pasted Last Dictation (⌥⇧V) · Clipboard preserved';
    }
  }

  async toggleLiveMicrophone() {
    const micBtn = document.getElementById('live-mic-btn');
    const micStatus = document.getElementById('obs-mic-status');
    const dict = I18N[this.lang];

    if (this.isLiveMicActive) {
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }
      this.isLiveMicActive = false;
      if (micBtn) {
        micBtn.setAttribute('aria-pressed', 'false');
        micBtn.textContent = dict.headerMicOff;
      }
      if (micStatus) micStatus.textContent = dict.obsMicStatusIdle;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();

      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      this.micStream = stream;
      this.isLiveMicActive = true;
      this.scene3d.setRecordingState(true);

      if (micBtn) {
        micBtn.setAttribute('aria-pressed', 'true');
        micBtn.textContent = dict.headerMicOn;
      }
      if (micStatus) micStatus.textContent = dict.obsMicStatusLive;
    } catch (err) {
      console.warn('Microphone access declined or unavailable, keeping synth mode:', err);
      this.toggleDictation(false);
    }
  }

  startAudioSimulationLoop() {
    const fftData = new Uint8Array(32);

    const updateSpectrum = () => {
      let sum = 0;
      const t = performance.now() * 0.004;

      if (this.isLiveMicActive && this.analyser) {
        this.analyser.getByteFrequencyData(fftData);
        for (let i = 0; i < 24; i++) {
          const norm = (fftData[i] || 0) / 255;
          this.spectrumBands[i] = norm;
          sum += norm;
        }
      } else {
        for (let i = 0; i < 24; i++) {
          const wave =
            Math.sin(t * 1.7 + i * 0.45) * 0.5 +
            Math.cos(t * 2.9 - i * 0.3) * 0.5;
          const activeAmp = this.isDictating ? 0.68 : 0.22;
          const val = Math.max(0.04, Math.min(0.96, (wave * 0.5 + 0.5) * activeAmp));
          this.spectrumBands[i] = val;
          sum += val;
        }
      }

      const avgEnergy = sum / 24;
      this.scene3d.updateAudioSpectrum(this.spectrumBands, avgEnergy);

      // Update 24-segment meter UI
      const activeSegs = Math.round(avgEnergy * 28);
      if (this.meterSegs) {
        this.meterSegs.forEach((seg, idx) => {
          seg.classList.toggle('is-active', idx < activeSegs);
        });
      }

      // Update floating HUD capsule bars
      if (this.hudBars) {
        this.hudBars.forEach((bar, idx) => {
          const bVal = this.spectrumBands[idx * 2] || 0.1;
          const px = Math.round(5 + bVal * 22);
          bar.style.setProperty('--bar-h', `${px}px`);
        });
      }
    };

    updateSpectrum();
    this.simTimer = setInterval(updateSpectrum, 65);
  }

  bindEngines() {
    const cards = document.querySelectorAll('.engine-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => c.setAttribute('data-selected', String(c === card)));
        this.scene3d.setFormation(2, true);
        this.syncFormationUI(2);
      });
    });
  }

  bindModelRecommender() {
    const chipSel = document.getElementById('rec-chip-select');
    const ramSel = document.getElementById('rec-ram-select');
    const langSel = document.getElementById('rec-lang-select');

    [chipSel, ramSel, langSel].forEach((el) => {
      if (el) el.addEventListener('change', () => this.renderModelRecommender());
    });
  }

  computeModelRecommendation(chip, memoryGB, language) {
    // Exact logic from Sources/VoiceHelper/ModelRecommendation.swift
    const isAppleSilicon = chip !== 'intel';
    const english = language === 'en';
    const chipLabel =
      chip === 'm4'
        ? 'Apple M4 / Pro'
        : chip === 'm3'
        ? 'Apple M3'
        : chip === 'm2'
        ? 'Apple M2'
        : chip === 'm1'
        ? 'Apple M1'
        : 'Intel Core i7';

    if (!isAppleSilicon) {
      return {
        modelID: 'base',
        reason:
          this.lang === 'ru'
            ? `${chipLabel}, ${memoryGB} ГБ: лёгкая модель сохраняет быстрый отклик на CPU. На Mac с Intel облачные движки работают быстрее.`
            : `${chipLabel}, ${memoryGB} GB: light model keeps dictation quick. Cloud engines are faster on Intel Macs.`,
      };
    }

    if (memoryGB >= 16) {
      return {
        modelID: 'large-v3-turbo',
        reason:
          this.lang === 'ru'
            ? `${chipLabel}, ${memoryGB} ГБ: достаточно объединённой памяти для самой точной модели с ускорением Metal.`
            : `${chipLabel}, ${memoryGB} GB: enough power for the most accurate model on Metal.`,
      };
    }

    return {
      modelID: english ? 'base' : 'small',
      reason: english
        ? this.lang === 'ru'
          ? `${chipLabel}, ${memoryGB} ГБ: быстрая модель для английского языка, оставляющая память другим программам.`
          : `${chipLabel}, ${memoryGB} GB: fast model that leaves memory for other apps.`
        : this.lang === 'ru'
        ? `${chipLabel}, ${memoryGB} ГБ: оптимальная точность для выбранного языка без замедления вашего Mac.`
        : `${chipLabel}, ${memoryGB} GB: good accuracy for your language without slowing the Mac.`,
    };
  }

  renderModelRecommender() {
    const chip = document.getElementById('rec-chip-select')?.value || 'm3';
    const memoryGB = Number(document.getElementById('rec-ram-select')?.value || 16);
    const language = document.getElementById('rec-lang-select')?.value || 'ru';

    const rec = this.computeModelRecommendation(chip, memoryGB, language);
    const reasonEl = document.getElementById('rec-verdict-reason');
    const nameEl = document.getElementById('rec-verdict-model');

    const matchedModel = MODEL_CATALOG.find((m) => m.id === rec.modelID) || MODEL_CATALOG[2];
    if (nameEl) nameEl.textContent = `${matchedModel.displayName} (${matchedModel.sizeMB} MB)`;
    if (reasonEl) reasonEl.textContent = rec.reason;

    const grid = document.getElementById('model-catalog-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const dict = I18N[this.lang];
    MODEL_CATALOG.forEach((model) => {
      const isRec = model.id === rec.modelID;
      const card = document.createElement('article');
      card.className = `model-card${isRec ? ' is-recommended' : ''}`;

      const dots = (val) =>
        Array.from({ length: 5 }, (_, i) => `<span class="dot-pip${i < val ? ' on' : ''}"></span>`).join('');

      card.innerHTML = `
        ${isRec ? `<span class="rec-pill">${dict.modRecommendedBadge}</span>` : ''}
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:0.4rem;">
          <strong style="font-size:1.05rem;">${model.displayName}</strong>
          <span style="font-family:var(--vh-font-mono);font-size:0.78rem;color:var(--vh-cyan-bright);">${model.sizeMB} MB</span>
        </div>
        <p style="margin:0;font-size:0.82rem;color:var(--vh-text-secondary);">
          ${this.lang === 'ru' ? model.summaryRu : model.summaryEn}
        </p>
        <div style="margin-top:auto;padding-top:0.6rem;border-top:1px solid var(--vh-border);font-size:0.76rem;color:var(--vh-text-muted);display:flex;flex-direction:column;gap:0.35rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>${dict.modSpeedLabel}</span>
            <span class="dot-rating" aria-label="${model.speed}/5">${dots(model.speed)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>${dict.modAccuracyLabel}</span>
            <span class="dot-rating" aria-label="${model.accuracy}/5">${dots(model.accuracy)}</span>
          </div>
          <div style="font-family:var(--vh-font-mono);font-size:0.68rem;opacity:0.75;">SHA256: ${model.sha256}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  bindStorageInspector() {
    const tabs = document.querySelectorAll('.storage-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.storageMode = tab.dataset.storage || 'off';
        tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        this.renderStorageReadout();
        this.scene3d.setFormation(3, true);
        this.syncFormationUI(3);
      });
    });
  }

  renderStorageReadout() {
    const readout = document.getElementById('storage-readout');
    if (!readout) return;
    const modeObj = STORAGE_MODES[this.storageMode] || STORAGE_MODES.off;
    readout.textContent = modeObj[this.lang] || modeObj.ru;
    readout.style.whiteSpace = 'pre-line';
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Option+Space (Alt+Space) -> Toggle Dictation
      if (e.altKey && !e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        this.toggleDictation(false);
        return;
      }

      // Option+Shift+V (Alt+Shift+KeyV) -> Paste Last Dictation
      if (e.altKey && e.shiftKey && e.code === 'KeyV') {
        e.preventDefault();
        this.pasteLastDictation();
        return;
      }

      // Escape -> Cancel active dictation
      if (e.code === 'Escape' && this.isDictating) {
        e.preventDefault();
        this.finishDictation(false);
      }
    });
  }

  bindScrollTracking() {
    const supportsTimeline = CSS.supports('animation-timeline', 'scroll()');
    const progressEl = document.getElementById('scroll-progress');

    const onScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.max(0, Math.min(1, window.scrollY / scrollable));

      if (!supportsTimeline && progressEl) {
        progressEl.style.setProperty('--scroll-progress', ratio.toFixed(4));
      }
      this.scene3d.setScrollProgress(ratio);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  applyLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'ru';
    const dict = I18N[this.lang];
    try {
      localStorage.setItem('voicehelper-language', this.lang);
    } catch (_) {
      // Keep the current selection and shareable URL without persistent storage.
    }

    document.documentElement.lang = this.lang;
    document.title = dict.metaTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', dict.metaDescription);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.dataset.i18nAriaLabel;
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });
    document.querySelectorAll('[data-language]').forEach((link) => {
      if (link.dataset.language === this.lang) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
      const url = new URL(window.location.href);
      url.searchParams.set('lang', link.dataset.language);
      link.href = url.pathname + url.search + url.hash;
    });

    this.syncFormationUI(this.scene3d?.activeFormation || 0);
    this.renderWorkbench();
    this.renderModelRecommender();
    this.renderStorageReadout();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.voiceHelperSite = new VoiceHelperApp();
});
