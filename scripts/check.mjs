// Static quality gate for the portfolio. Run: npm run check
import { readFileSync, existsSync } from 'node:fs';

const fail = [];
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fail.push(msg); };
const html = readFileSync('index.html', 'utf8');
const css = existsSync('style.css') ? readFileSync('style.css', 'utf8') : '';
const appjs = existsSync('app.js') ? readFileSync('app.js', 'utf8') : '';
const all = html + css + appjs;

// 1. No foreign-owner leakage (case-insensitive)
for (const banned of ['touquir', 'cenova', 'wiplo', 'shayaan', 'tauquirshayaan', 'xyz@gmail.com', 'touquir91@gmail.com', '72095 20014']) {
  ok(!all.toLowerCase().includes(banned), `no leakage of "${banned}"`);
}
// 2. No invented Indian phone (allow only if explicitly configured — matcher flags +91 numbers)
ok(!/\+\d[\d\s]{9,}/.test(html), 'no hardcoded phone number in index.html');
// 3. Motion toggle exists
ok(html.includes('id="motion-toggle"'), 'Motion toggle button exists');
// 4. All in-page anchors resolve
const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]));
const anchors = [...html.matchAll(/ href="#([^"]*)"/g)].map(m => m[1]).filter(Boolean);
ok(anchors.every(a => ids.has(a)), `all #anchors resolve (${anchors.join(', ') || 'none'})`);
// 5. All <img> have alt
const imgs = [...html.matchAll(/<img[^>]*>/g)];
ok(imgs.every(t => /alt="[^"]+"/.test(t[0])), `all ${imgs.length} <img> have alt`);
// 6. External links use rel=noopener
const ext = [...html.matchAll(/<a[^>]*href="https?:\/\/[^"]*"[^>]*>/g)];
ok(ext.every(t => t[0].includes('rel="noopener')), `all ${ext.length} external links have rel="noopener"`);
ok(ext.every(t => t[0].includes('target="_blank"')), 'all external links open in new tab');
// 7. Single H1
ok((html.match(/<h1[\s>]/g) || []).length === 1, 'exactly one <h1>');
// 8. Design tokens present
for (const tok of ['--bg:', '--text:', '--accent:', '--muted:', '--font-display', '--font-body']) {
  ok(css.includes(tok), `token ${tok} defined in style.css`);
}
// 9. Config module exists and owns identity (no hardcoded owner name in app.js UI strings)
ok(existsSync('src/config/site.js'), 'src/config/site.js exists');
ok(!/Shridhar Sabat/.test(appjs), 'app.js has no hardcoded owner name (must come from config)');

console.log(fail.length ? `\n${fail.length} CHECK(S) FAILED` : '\nALL CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
