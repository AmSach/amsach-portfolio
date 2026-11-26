const STORAGE_KEY = 'amsach_portfolio_theme';

let themes = [];
let currentThemeIndex = 0;

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-hover', theme.surfaceHover);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--border-strong', theme.borderStrong);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-soft', theme.accentSoft);
  root.style.setProperty('--keyword', theme.keyword);
  root.style.setProperty('--string', theme.string);
  root.style.setProperty('--number', theme.number);
  root.style.setProperty('--comment', theme.comment);

  const label = document.getElementById('theme-label');
  if (label) label.textContent = theme.id;
  localStorage.setItem(STORAGE_KEY, theme.id);
}

async function initThemes() {
  try {
    const res = await fetch('./themes.json');
    const data = await res.json();
    themes = data.themes || [];
    const saved = localStorage.getItem(STORAGE_KEY) || data.default || 'blackmoney';
    const idx = themes.findIndex((t) => t.id === saved);
    currentThemeIndex = idx >= 0 ? idx : 0;
    applyTheme(themes[currentThemeIndex]);
  } catch (err) {
    console.warn('Theme load fallback:', err);
  }
}

async function initCodeWall() {
  const wall = document.getElementById('code-wall');
  if (!wall) return;
  try {
    const res = await fetch('./wall.json');
    const data = await res.json();
    const snippets = data.snippets || [];
    const repeated = [...snippets, ...snippets, ...snippets];
    wall.innerHTML = repeated
      .map((snip, i) => {
        const linesHtml = snip.lines
          .map((line) => {
            const trimmed = line.trim();
            const cls =
              trimmed.startsWith('#') || trimmed.startsWith('//')
                ? 'wall-line is-comment'
                : trimmed.startsWith('def ') || trimmed.startsWith('inline ') || trimmed.startsWith('void ')
                ? 'wall-line is-kw'
                : 'wall-line';
            return `<div class="${cls}">${escapeHtml(line)}</div>`;
          })
          .join('');
        return `<div class="wall-block" style="animation-delay:${(i % 6) * 0.8}s"><div class="wall-file">${escapeHtml(snip.file)}</div>${linesHtml}</div>`;
      })
      .join('');
  } catch (err) {
    console.warn('Wall load skipped:', err);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function cycleTheme() {
  if (!themes.length) return;
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const next = themes[currentThemeIndex];
  applyTheme(next);
  setFeedback(`:theme ${next.id} (${next.description})`);
}

function setFeedback(msg) {
  const el = document.getElementById('cmd-feedback');
  if (el) el.textContent = msg;
}

function handleCommand(raw) {
  const cmd = raw.trim().replace(/^:/, '').toLowerCase();
  if (!cmd || cmd === 'open' || cmd === 'site' || cmd === 'portfolio') {
    window.location.href = './site/';
    return;
  }
  if (cmd === 'projects' || cmd === 'work' || cmd === 'experience' || cmd === 'links' || cmd === 'about') {
    window.location.href = `./site/#${cmd === 'work' ? 'experience' : cmd}`;
    return;
  }
  if (cmd === 'theme' || cmd === 't') {
    cycleTheme();
    return;
  }
  if (cmd.startsWith('theme ')) {
    const target = cmd.replace('theme ', '').trim();
    const idx = themes.findIndex((t) => t.id === target || t.name.toLowerCase() === target);
    if (idx >= 0) {
      currentThemeIndex = idx;
      applyTheme(themes[idx]);
      setFeedback(`colorscheme set to ${themes[idx].name}`);
    } else {
      setFeedback(`E185: Cannot find color scheme '${target}'. Available: ${themes.map((t) => t.id).join(', ')}`);
    }
    return;
  }
  if (cmd === 'help' || cmd === '?') {
    setFeedback('Commands: :open, :projects, :experience, :links, :theme <name> | Keys: Enter (open), : (cmd)');
    return;
  }
  setFeedback(`E492: Not an editor command: ${cmd} (try :open or :theme)`);
}

document.addEventListener('DOMContentLoaded', () => {
  initThemes();
  initCodeWall();

  const btn = document.getElementById('theme-cycle-btn');
  if (btn) btn.addEventListener('click', cycleTheme);

  const form = document.getElementById('cmd-form');
  const input = document.getElementById('cmd-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCommand(input.value);
      input.value = '';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (document.activeElement === input) {
      if (e.key === 'Escape') input.blur();
      return;
    }
    if (e.key === ':') {
      e.preventDefault();
      input?.focus();
    } else if (e.key === 'Enter') {
      window.location.href = './site/';
    }
  });
});
