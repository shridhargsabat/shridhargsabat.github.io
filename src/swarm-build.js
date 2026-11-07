// On-page Swarm Rebuild spectacle, driven by the header Build button (#build-toggle).
// The engine (public/vendor/swarm.js) is lazy-loaded on first click and toggled via
// window.__swarmRebuild.toggle() after that. The Build experience is an explicit user
// gesture, so it runs full-motion + sound even when ambient Motion is off or the OS
// prefers reduced motion. Sound default stays ON (engine default); the HUD Sound
// control (and the M key) mute/unmute.
//
// Conflict notes (verified against the vendored engine source):
// - The engine renders into a <swarm-rebuild> host with an OPEN SHADOW root, so page
//   CSS (incl. the global [hidden] guard and .reveal transforms) cannot leak into it.
// - <dialog> renders in the top layer ABOVE the fixed overlay, so an open project
//   dialog is closed before starting (only real conflict; handled below).
// - Escape: the engine stops propagation in capture phase to exit itself first, so the
//   nav-menu Escape handler simply doesn't fire while the swarm runs. No change needed.
// - Scroll progress listener is passive and just tracks the engine's scan scrolls.
// - The desktop-designed HUD overflows ~390px widths, so a narrow-screen style patch
//   is appended into the shadow root on every start (additive CSS only, desktop HUD
//   untouched).
const SWARM_SRC = './vendor/swarm.js';

// Additive narrow-screen HUD patch (shadow root preserves viewport media queries).
const NARROW_HUD_CSS = `@media (max-width:560px){
.hud{gap:6px;padding:6px;font-size:11px;max-width:calc(100vw - 16px);overflow-x:auto}
.hud .dots,.hud .bar{display:none}
.hud button{padding:6px 8px;font-size:11px}
.hud .txt{gap:5px}
}`;

let swarmLoading = false;

export function initSwarmBuild() {
  const btn = document.getElementById('build-toggle');
  if (!btn) return;
  const label = btn.querySelector('.build-label');

  const patchNarrowHud = () => {
    const root = document.querySelector('swarm-rebuild')?.shadowRoot;
    if (!root || root.querySelector('style[data-narrow-hud]')) return;
    const st = document.createElement('style');
    st.setAttribute('data-narrow-hud', '');
    st.textContent = NARROW_HUD_CSS;
    root.appendChild(st);
  };

  // Sync button state with the overlay (covers HUD ✕ / Esc / Go-live exits too).
  const sync = () => {
    const running = !!document.querySelector('swarm-rebuild');
    btn.setAttribute('aria-pressed', String(running));
    if (label) label.textContent = running ? 'Exit' : 'Build';
    if (running) patchNarrowHud();
  };
  new MutationObserver(sync).observe(document.documentElement, { childList: true });

  btn.addEventListener('click', () => {
    const dlg = document.getElementById('project-dialog');
    if (dlg && dlg.open) dlg.close(); // top-layer dialog would float above the overlay
    if (window.__swarmRebuild) { window.__swarmRebuild.toggle(); return; }
    if (swarmLoading) return; // first load still in flight — ignore extra clicks
    swarmLoading = true;
    const s = document.createElement('script');
    s.src = SWARM_SRC;
    s.onload = () => { swarmLoading = false; sync(); }; // engine auto-starts on load
    s.onerror = () => { swarmLoading = false; };
    document.head.appendChild(s);
  });
  sync();
}
