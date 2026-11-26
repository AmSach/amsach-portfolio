const STORAGE_KEY = 'amsach_portfolio_theme';

const CODE_PREVIEWS = {
  maple: {
    file: 'maple/prune_experts.py',
    code: `# MAPLE: Manifold-Activated Pruning of Latent Experts
# Gemma 4 26B: 9.92 GB -> 4.75 GB (1.48 BPW) | 45.4 tok/s on 6GB GPU

import torch
from maple.manifold import compute_activation_salience, pack_sub2bpw_gguf

def prune_moe_experts(model, calibration_stream, target_bpw=1.48):
    salience = compute_activation_salience(model, calibration_stream)
    threshold = torch.quantile(salience, 1.0 - (target_bpw / 4.0))
    active_mask = salience >= threshold
    return pack_sub2bpw_gguf(model, active_mask, verify_perplexity=True)`
  },
  voxelnav: {
    file: 'voxelnav/src/semantic_grid.cpp',
    code: `// VoxelNav: Real-time ROS2 Semantic Voxel Mapping (<100ms on Jetson Nano)

#include "voxelnav/semantic_grid.hpp"

void SemanticGrid::integrate_scan(const PointCloud& cloud, const Pose3d& T_wc) {
  for (const auto& pt : cloud.points) {
    const VoxelKey key = quantize(T_wc * pt.xyz, resolution_m_);
    auto& cell = voxels_[key];
    cell.update_bayesian(pt.semantic_id, pt.confidence);
  }
}`
  },
  dml: {
    file: 'decision-analytics-engine/dml_elasticity.py',
    code: `# Double/Debiased ML for Causal Price Elasticity + Level-k / QRE Pricing
# Benchmarked on 50,000+ transactions

from sklearn.model_selection import KFold
from lightgbm import LGBMRegressor

def estimate_causal_elasticity(log_q, log_p, controls):
    theta_hat = dml_crossfit(
        Y=log_q, D=log_p, X=controls,
        cv=KFold(n_splits=5, shuffle=True, random_state=42),
        model_y=LGBMRegressor(), model_d=LGBMRegressor()
    )
    return solve_level_k_qre(theta_hat, lambda_rationality=2.4)`
  }
};

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

  const lbl = document.getElementById('theme-label');
  if (lbl) lbl.textContent = theme.id;
  localStorage.setItem(STORAGE_KEY, theme.id);
}

function cycleTheme() {
  if (!themes.length) return;
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const next = themes[currentThemeIndex];
  applyTheme(next);
  setStatus(`colorscheme ${next.id}`);
}

function setStatus(msg) {
  const el = document.getElementById('stl-msg');
  if (el) el.textContent = msg;
}

function renderProjectCard(p) {
  const starsText = p.stars > 0 ? `★ ${p.stars}` : 'active';
  const metricsHtml = p.metrics ? `<div class="project-metrics">${p.metrics}</div>` : '';
  const stackHtml = (p.stack || []).map((s) => `<span class="mono-pill">${s}</span>`).join('');
  return `
    <article class="project-card">
      <div>
        <div class="project-top">
          <a class="project-name" href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}</a>
          <span class="project-stars">${starsText}</span>
        </div>
        <p class="project-desc">${p.tagline}</p>
      </div>
      ${metricsHtml}
      <div class="stack-row">${stackHtml}</div>
    </article>
  `;
}

async function initData() {
  const [themesRes, cfgRes, snapRes] = await Promise.all([
    fetch('../themes.json'),
    fetch('../portfolio.config.json'),
    fetch('../github-snapshot.json')
  ]);

  const themesData = await themesRes.json();
  themes = themesData.themes || [];
  const saved = localStorage.getItem(STORAGE_KEY) || themesData.default || 'blackmoney';
  const idx = themes.findIndex((t) => t.id === saved);
  currentThemeIndex = idx >= 0 ? idx : 0;
  applyTheme(themes[currentThemeIndex]);

  const cfg = await cfgRes.json();
  const snap = await snapRes.json();

  // Bio
  const bioEl = document.getElementById('bio-container');
  if (bioEl) {
    bioEl.innerHTML = [...(cfg.about?.bio || []), ...(cfg.about?.extra || [])]
      .map((p) => `<p>${p}</p>`)
      .join('');
  }

  // Languages
  const langEl = document.getElementById('lang-bars');
  if (langEl) {
    langEl.innerHTML = (snap.languages || [])
      .map(
        (l) => `
      <div class="lang-row">
        <div class="lang-top"><span>${l.name}</span><span>${l.pct}%</span></div>
        <div class="lang-track"><div class="lang-fill" style="width:${l.pct}%;background:${l.color}"></div></div>
      </div>`
      )
      .join('');
  }

  // Projects
  const featured = (cfg.projects || []).filter((p) => !p.more);
  const more = (cfg.projects || []).filter((p) => p.more);
  const projGrid = document.getElementById('projects-grid');
  const moreGrid = document.getElementById('more-projects-grid');
  if (projGrid) projGrid.innerHTML = featured.map(renderProjectCard).join('');
  if (moreGrid) moreGrid.innerHTML = more.map(renderProjectCard).join('');

  // Work
  const workEl = document.getElementById('work-list');
  if (workEl) {
    workEl.innerHTML = (cfg.work || [])
      .map(
        (w) => `
      <article class="work-card">
        <div class="work-top">
          <div>
            <div class="work-role">${w.role}</div>
            <div class="work-org">${w.org}</div>
          </div>
          <div class="work-period">${w.period}</div>
        </div>
        <ul class="work-bullets">
          ${(w.highlights || []).map((h) => `<li>${h}</li>`).join('')}
        </ul>
      </article>`
      )
      .join('');
  }

  // Competitions
  const compEl = document.getElementById('comp-grid');
  if (compEl) {
    compEl.innerHTML = (cfg.competitions || [])
      .map(
        (c) => `
      <article class="comp-card">
        <div class="comp-top">
          <span class="comp-event">${c.event}</span>
          <span class="comp-res">${c.result} (${c.year})</span>
        </div>
        <div class="comp-focus">${c.focus}</div>
      </article>`
      )
      .join('');
  }

  // Education
  const eduEl = document.getElementById('edu-grid');
  if (eduEl) {
    eduEl.innerHTML = (cfg.education || [])
      .map(
        (e) => `
      <article class="edu-card">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-inst">${e.institution} (${e.period})</div>
      </article>`
      )
      .join('');
  }

  // Links
  const codeLinks = (cfg.links || []).filter((l) => ['GitHub', 'HuggingFace', 'Scholar', 'Kaggle', 'Zenodo'].includes(l.label));
  const socialLinks = (cfg.links || []).filter((l) => !['GitHub', 'HuggingFace', 'Scholar', 'Kaggle', 'Zenodo'].includes(l.label));
  const linksCodeEl = document.getElementById('links-code');
  const linksSocEl = document.getElementById('links-social');
  if (linksCodeEl) {
    linksCodeEl.innerHTML = codeLinks
      .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}: ${l.value}</a></li>`)
      .join('');
  }
  if (linksSocEl) {
    linksSocEl.innerHTML = socialLinks
      .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}: ${l.value}</a></li>`)
      .join('');
  }
}

function setPreviewTab(key) {
  const item = CODE_PREVIEWS[key];
  if (!item) return;
  const fileEl = document.getElementById('preview-filename');
  const bodyEl = document.getElementById('preview-code-body');
  if (fileEl) fileEl.textContent = item.file;
  if (bodyEl) bodyEl.textContent = item.code;
  document.querySelectorAll('.preview-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === key);
  });
}

function handleCommand(raw) {
  const cmd = raw.trim().replace(/^:/, '').toLowerCase();
  if (!cmd) return;
  if (cmd === 'home' || cmd === 'q') {
    window.location.href = '../';
    return;
  }
  if (['about', 'projects', 'experience', 'competitions', 'links'].includes(cmd)) {
    document.getElementById(cmd)?.scrollIntoView({ behavior: 'smooth' });
    setStatus(`jumped to #${cmd}`);
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
      setStatus(`colorscheme ${themes[idx].id}`);
    } else {
      setStatus(`unknown theme '${target}'`);
    }
    return;
  }
  setStatus(`E492: Not an editor command: ${cmd}`);
}

document.addEventListener('DOMContentLoaded', () => {
  initData();
  setPreviewTab('maple');

  document.getElementById('theme-cycle-btn')?.addEventListener('click', cycleTheme);
  document.querySelectorAll('.preview-tab').forEach((btn) => {
    btn.addEventListener('click', () => setPreviewTab(btn.dataset.tab));
  });

  const moreBtn = document.getElementById('toggle-more-btn');
  const moreGrid = document.getElementById('more-projects-grid');
  moreBtn?.addEventListener('click', () => {
    const isHidden = moreGrid?.classList.toggle('hidden');
    moreBtn.querySelector('span').textContent = isHidden
      ? 'ls more/ (6 additional engines)'
      : 'hide more/';
  });

  const form = document.getElementById('nvim-cmd-form');
  const input = document.getElementById('nvim-cmd-input');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCommand(input.value);
    input.value = '';
    input.blur();
  });

  document.addEventListener('keydown', (e) => {
    if (document.activeElement === input) {
      if (e.key === 'Escape') input.blur();
      return;
    }
    if (e.key === ':') {
      e.preventDefault();
      input?.focus();
    } else if (e.key === 't') {
      cycleTheme();
    } else if (e.key === 'j') {
      window.scrollBy({ top: 180, behavior: 'smooth' });
    } else if (e.key === 'k') {
      window.scrollBy({ top: -180, behavior: 'smooth' });
    }
  });
});
