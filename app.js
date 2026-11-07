// Portfolio runtime — vanilla ES module. All owner content comes from src/config + src/data.
import { SITE } from './src/config/site.js';
import { PROJECTS } from './src/data/projects.js';
import { EXPERIENCE, SKILLS, TOOLS } from './src/data/experience.js';
import { initMotion } from './src/motion.js';
import { initSwarmBuild } from './src/swarm-build.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PAGE_SIZE = 6;
let visibleCount = PAGE_SIZE, activeCat = 'All', query = '';

document.addEventListener('DOMContentLoaded', () => {
  hydrateConfig();
  renderChips();
  renderFilters();
  renderGrid();
  renderSkills();
  renderTimeline();
  renderContactLinks();
  initNav();
  initDialog();
  initForm();
  initMotion(SITE); // Task 11 — scroll progress, reveals, Motion toggle
  initSwarmBuild(); // Swarm Rebuild spectacle behind the header Build button
  $('#year').textContent = new Date().getFullYear();
});

function hydrateConfig() {
  const avail = SITE.identity.availability;
  if (!avail || avail === 'HIDE') {
    $$('.kicker-avail').forEach(el => el.remove());
  }
  $$('[data-config]').forEach(el => {
    const v = SITE.identity[el.dataset.config];
    if (v && v !== 'HIDE') el.textContent = v;
    else if (el.dataset.config !== 'availability') el.closest('p,li,div')?.setAttribute('hidden', '');
  });
}
function renderChips() {
  $('#hero-chips').innerHTML = SKILLS.slice(0, 5).map(s => `<li>${escapeHtml(s)}</li>`).join('');
}
function categories() {
  return ['All', ...new Set(PROJECTS.map(p => p.category).filter(Boolean))];
}
function renderFilters() {
  const bar = $('#filter-bar');
  bar.innerHTML = '';
  categories().forEach(c => {
    const b = document.createElement('button');
    b.textContent = c; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(c === activeCat));
    b.addEventListener('click', () => { activeCat = c; visibleCount = PAGE_SIZE; renderFilters(); renderGrid(); });
    bar.appendChild(b);
  });
  $('#project-search').addEventListener('input', e => { query = e.target.value.toLowerCase(); visibleCount = PAGE_SIZE; renderGrid(); });
}
function filtered() {
  return PROJECTS.filter(p =>
    (activeCat === 'All' || p.category === activeCat) &&
    (!query || `${p.title} ${p.summary} ${p.category}`.toLowerCase().includes(query)));
}
function renderGrid() {
  const list = filtered();
  const grid = $('#project-grid');
  grid.innerHTML = list.slice(0, visibleCount).map(cardHtml).join('');
  $('#projects-empty').hidden = list.length > 0;
  const more = $('#load-more');
  more.hidden = visibleCount >= list.length;
  more.onclick = () => { visibleCount += PAGE_SIZE; renderGrid(); };
  $$('.project-card', grid).forEach(card => {
    card.addEventListener('click', () => openDialog(card.dataset.id));
    card.addEventListener('keydown', e => { // role=button needs manual keys (E2E fix)
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDialog(card.dataset.id); }
    });
  });
}
function cardHtml(p) {
  const img = p.coverImage ? `<img src="${p.coverImage}" alt="${escapeHtml(p.title)} cover" loading="lazy">` : '';
  return `<article class="project-card reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(p.title)}">${img}<div class="pc-body"><h3>${escapeHtml(p.title)}</h3><p class="pc-meta">${escapeHtml(p.category || '')}${p.year ? ' · ' + escapeHtml(p.year) : ''}</p><p>${escapeHtml(p.summary || '')}</p></div></article>`;
}
function renderSkills() {
  $('#skills-list').innerHTML = SKILLS.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  $('#tools-list').innerHTML = TOOLS.map(s => `<li>${escapeHtml(s)}</li>`).join('');
}
function renderTimeline() {
  $('#timeline').innerHTML = EXPERIENCE.map((e, i) =>
    `<details${i === 0 ? ' open' : ''}><summary>${escapeHtml(e.title)} — ${escapeHtml(e.organization)}</summary><p class="t-meta">${escapeHtml(e.period)}</p><p>${escapeHtml(e.description)}</p></details>`).join('')
    || '<p class="empty-state">Experience details coming soon.</p>';
}
function renderContactLinks() {
  const c = SITE.contact, links = [];
  if (c.email) links.push(`<a class="btn btn-secondary" href="mailto:${c.email}">Email</a>`);
  if (c.linkedin) links.push(`<a class="btn btn-secondary" href="${c.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (c.github) links.push(`<a class="btn btn-secondary" href="${c.github}" target="_blank" rel="noopener">GitHub</a>`);
  if (c.whatsapp) links.push(`<a class="btn btn-secondary" href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hi ' + SITE.identity.fullName + ', I saw your portfolio and would like to talk.')}" target="_blank" rel="noopener">WhatsApp</a>`);
  $('#contact-links').innerHTML = links.join(' ');
}
function initNav() {
  const burger = $('.hamburger'), menu = $('#nav-menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('active');
    burger.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { menu.classList.remove('active'); burger.setAttribute('aria-expanded', 'false'); }
  });
  // Active-section highlight
  const links = $$('.nav-link');
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.dataset.nav === e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  ['hero', 'work', 'about', 'experience', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) obs.observe(s); });
}
function initDialog() {
  const dlg = $('#project-dialog');
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}
function openDialog(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  const dlg = $('#project-dialog');
  $('#project-dialog-title').textContent = p.title;
  $('#project-dialog-body').innerHTML =
    `<p class="pc-meta">${escapeHtml(p.category || '')}${p.year ? ' · ' + escapeHtml(p.year) : ''}${p.role ? ' · ' + escapeHtml(p.role) : ''}</p>
     <p>${escapeHtml(p.description || p.summary || '')}</p>
     ${p.tools?.length ? `<p><strong>Stack:</strong> ${p.tools.map(escapeHtml).join(', ')}</p>` : ''}
     ${p.liveUrl ? `<p><a href="${p.liveUrl}" target="_blank" rel="noopener">Live demo ↗</a></p>` : ''}
     ${p.sourceUrl ? `<p><a href="${p.sourceUrl}" target="_blank" rel="noopener">Source ↗</a></p>` : ''}`;
  dlg.showModal();
}
function initForm() {
  if (!SITE.preferences.showContactForm) { $('#contact-form').setAttribute('hidden', ''); return; }
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (!SITE.contact.email) { alert('Email contact is not published yet — please use LinkedIn or GitHub.'); return; }
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.get('name')}`);
    const body = encodeURIComponent(`${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`);
    window.location.href = `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`;
  });
}
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
