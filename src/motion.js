// Motion system: scroll progress, reveal-on-scroll, Motion on/off toggle (persisted),
// and a dependency-free "swarm-lite" hero canvas. Honors prefers-reduced-motion.
export function initMotion(SITE) {
  const key = SITE.motionStorageKey || 'portfolio-motion';
  const btn = document.getElementById('motion-toggle');
  const reduceOS = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stored = null;
  try { stored = localStorage.getItem(key); } catch { /* private mode */ }
  let enabled = stored !== null ? stored === 'on' : !reduceOS;
  const apply = () => {
    document.body.classList.toggle('motion-off', !enabled);
    btn.setAttribute('aria-pressed', String(enabled));
    btn.textContent = enabled ? 'Motion: On' : 'Motion: Off';
    try { localStorage.setItem(key, enabled ? 'on' : 'off'); } catch { /* ignore */ }
    document.getElementById('swarm-canvas')?.toggleAttribute('hidden', !enabled);
  };
  btn.addEventListener('click', () => { enabled = !enabled; apply(); });
  apply();

  // Scroll progress
  const bar = document.getElementById('scroll-progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  }, { passive: true });

  // Reveal-on-scroll (re-observe dynamically added cards)
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  const observeAll = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  observeAll();
  new MutationObserver(observeAll).observe(document.getElementById('project-grid'), { childList: true });
  document.querySelectorAll('section .container').forEach(el => el.classList.add('reveal'));
  observeAll();

  mountSwarmLite();
}

// ~70-line flocking dots on a hero canvas. pointer-fine only, never blocks input.
function mountSwarmLite() {
  const hero = document.querySelector('.hero-visual');
  if (!hero || matchMedia('(pointer: coarse)').matches) return;
  const cv = document.createElement('canvas');
  cv.id = 'swarm-canvas';
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.5';
  hero.style.position = 'relative';
  hero.appendChild(cv);
  cv.toggleAttribute('hidden', document.body.classList.contains('motion-off')); // sync when booting with Motion off (E2E fix)
  const ctx = cv.getContext('2d');
  let W, H, pts = [];
  const size = () => {
    const r = hero.getBoundingClientRect();
    W = cv.width = r.width; H = cv.height = r.height;
    pts = Array.from({ length: Math.min(60, W / 12) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6,
    }));
  };
  size(); addEventListener('resize', size);
  let mx = -999, my = -999;
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { mx = my = -999; });
  (function tick() {
    if (!cv.isConnected) return;
    if (!document.body.classList.contains('motion-off')) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#e32b3c';
      for (const p of pts) {
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy) || 1;
        if (d < 140) { p.vx += dx / d * .03; p.vy += dy / d * .03; }
        p.vx *= .985; p.vy *= .985;
        // Ambient wander + minimum speed so particles never freeze when idle (E2E fix)
        p.ph = (p.ph ?? Math.random() * 6.283) + 0.02;
        p.vx += Math.sin(p.ph + p.y * 0.02) * 0.02;
        p.vy += Math.cos(p.ph + p.x * 0.02) * 0.02;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp < 0.2) { const a = Math.atan2(p.vy, p.vx) || p.ph; p.vx = Math.cos(a) * 0.2; p.vy = Math.sin(a) * 0.2; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.globalAlpha = .8;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
    }
    requestAnimationFrame(tick);
  })();
}
