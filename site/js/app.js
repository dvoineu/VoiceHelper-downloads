import { I18N, SUPPORTED_LANGUAGES } from './i18n.js';

const STORAGE_KEY = 'voicehelper-language';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Language ---------- */

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: the ?lang link still works */
  }
}

function detectInitialLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED_LANGUAGES.includes(fromUrl)) return fromUrl;
  const saved = readStoredLanguage();
  if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  return 'en';
}

let currentLanguage = 'en';

function applyLanguage(lang) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
  const dict = I18N[currentLanguage];

  document.documentElement.lang = currentLanguage;
  document.title = dict.metaTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict.metaDescription);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value === undefined) return;
    el.textContent = value;
    el.hidden = value === '';
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = dict[el.dataset.i18nHtml];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const value = dict[el.dataset.i18nAriaLabel];
    if (value) el.setAttribute('aria-label', value);
  });

  document.querySelectorAll('[data-language]').forEach((link) => {
    if (link.dataset.language === currentLanguage) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });

  demo.restart();
}

function setupLanguageSwitch() {
  document.querySelectorAll('[data-language]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const lang = link.dataset.language;
      storeLanguage(lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
      applyLanguage(lang);
    });
  });
}

/* ---------- Hero demo: listening → recognizing → inserted ---------- */

const demo = (() => {
  const textEl = document.getElementById('demo-text');
  const hud = document.getElementById('demo-hud');
  const statusEl = document.getElementById('demo-status');
  const timerEl = document.getElementById('demo-timer');
  let timers = [];

  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  };

  function setState(state) {
    const dict = I18N[currentLanguage];
    hud.dataset.state = state;
    document.dispatchEvent(new CustomEvent('vh-demo', { detail: state }));
    statusEl.textContent = {
      listening: dict.demoListening,
      recognizing: dict.demoRecognizing,
      inserted: dict.demoInserted,
    }[state];
  }

  function showFinal() {
    textEl.textContent = I18N[currentLanguage].demoPhrase;
    timerEl.textContent = '0:04';
    setState('inserted');
  }

  function cycle() {
    textEl.textContent = '';
    setState('listening');
    for (let s = 0; s <= 4; s += 1) later(() => { timerEl.textContent = `0:0${s}`; }, s * 800);
    later(() => setState('recognizing'), 3400);
    later(() => {
      const phrase = I18N[currentLanguage].demoPhrase;
      textEl.textContent = phrase;
      setState('inserted');
    }, 4300);
    later(cycle, 9000);
  }

  return {
    restart() {
      if (!textEl || !hud) return;
      clear();
      if (reducedMotion.matches || document.hidden) showFinal();
      else cycle();
    },
    stop: clear,
  };
})();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) demo.stop();
  else demo.restart();
});

/* ---------- Video chapters ---------- */

function setupChapters() {
  const video = document.getElementById('guide-video');
  if (!video) return;
  const buttons = [...document.querySelectorAll('[data-seek]')];
  const starts = buttons.map((b) => Number(b.dataset.seek));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const seek = () => {
        video.currentTime = Number(button.dataset.seek);
        video.play().catch(() => {});
      };
      if (video.readyState >= 1) seek();
      else {
        video.preload = 'metadata';
        video.addEventListener('loadedmetadata', seek, { once: true });
        video.load();
      }
    });
  });

  video.addEventListener('timeupdate', () => {
    let active = 0;
    starts.forEach((start, i) => { if (video.currentTime >= start) active = i; });
    buttons.forEach((b, i) => {
      if (i === active) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  });
}

/* ---------- Active section in the header ---------- */

function setupActiveNav() {
  const links = [...document.querySelectorAll('.primary-nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || sections.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => observer.observe(s));
}

/* ---------- Hero 3D scene (loaded after the page, skipped without WebGL) ---------- */

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function loadHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  const anchor = document.getElementById('stage-anchor');
  if (!canvas || !anchor || !supportsWebGL()) return;
  import('./scene3d.js')
    .then(({ HeroScene }) => {
      new HeroScene({ canvas, host: canvas.parentElement, anchor });
      canvas.classList.add('is-ready');
    })
    .catch(() => { /* the page works without the 3D scene */ });
}

const whenIdle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 200));
if (document.readyState === 'complete') whenIdle(loadHeroScene);
else window.addEventListener('load', () => whenIdle(loadHeroScene), { once: true });

setupLanguageSwitch();
setupChapters();
setupActiveNav();
applyLanguage(detectInitialLanguage());
