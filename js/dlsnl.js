/* =========================================================
   DLSNL Sloth Studio, shared site behaviour
   logo tint · loader · smooth scroll · header · menu · sound
   · liquid star · cursor · page curtain · clock · toast · decode text
   ========================================================= */
(function () {
  const EMAIL = 'delusionalsloth.art@gmail.com';
  const SOCIAL = [
    ['Instagram, art', 'https://www.instagram.com/delusion_art_studio/'],
    ['LinkedIn', 'https://www.linkedin.com/in/arundhati-mitra-07/'],
    ['Behance', 'https://www.behance.net/arundhatimitra']
  ];
  const STAR = 'M50 0C53 35 65 47 100 50 65 53 53 65 50 100 47 65 35 53 0 50 35 47 47 35 50 0Z';
  // eight-point sparkle for buttons and small accents; STAR stays for big stars and the skies
  const SPARK = 'M50 0L52.6 43.7L71.9 28.1L56.3 47.4L100 50L56.3 52.6L71.9 71.9L52.6 56.3L50 100L47.4 56.3L28.1 71.9L43.7 52.6L0 50L43.7 47.4L28.1 28.1L47.4 43.7Z';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasG = !!window.gsap;
  if (hasG) gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- logo: the JPG is violet-on-white, so we key out the white
     and re-colour it on a canvas. Any colour, transparent background. ---------- */
  // asset(): in the single-file build every image is embedded in window.__ASSETS;
  // on the normal site it just returns the path.
  const asset = (p) => (window.__ASSETS && window.__ASSETS[p]) || p;
  const LOGO_SRC = 'assets/brand/dlsnl-logo.jpg';
  const TINTS = { violet: [74, 20, 184], lilac: [207, 195, 255], paper: [236, 234, 243], ink: [27, 14, 58], white: [255, 255, 255] };
  let logoMake = null, logoDone; const logoReady = new Promise((r) => (logoDone = r));
  const logoURL = (name) => logoReady.then(() => (logoMake ? logoMake(name) : null));
  function tintLogo() {
    const imgs = $$('img[data-logo]');
    return new Promise((res) => {
      const src = new Image();
      src.onload = () => {
        const W = src.naturalWidth, H = src.naturalHeight;
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d'); x.drawImage(src, 0, 0);
        const d = x.getImageData(0, 0, W, H).data;
        // alpha from darkness; find the content box
        const a = new Uint8ClampedArray(W * H);
        let x0 = W, y0 = H, x1 = 0, y1 = 0;
        for (let i = 0, p = 0; i < d.length; i += 4, p++) {
          const lum = (d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114);
          const al = Math.max(0, Math.min(255, (235 - lum) * 1.45));
          a[p] = al;
          if (al > 30) { const px = p % W, py = (p / W) | 0; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
        }
        const pad = 6; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
        const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
        const cache = {};
        const make = (name) => {
          if (cache[name]) return cache[name];
          const [r, g, b] = TINTS[name] || TINTS.violet;
          const o = document.createElement('canvas'); o.width = cw; o.height = ch;
          const ox = o.getContext('2d'); const id = ox.createImageData(cw, ch);
          for (let yy = 0; yy < ch; yy++) for (let xx = 0; xx < cw; xx++) {
            const q = (yy * cw + xx) * 4, al = a[(yy + y0) * W + xx + x0];
            id.data[q] = r; id.data[q + 1] = g; id.data[q + 2] = b; id.data[q + 3] = al;
          }
          ox.putImageData(id, 0, 0);
          return (cache[name] = o.toDataURL('image/png'));
        };
        logoMake = make; logoDone();
        imgs.forEach((im) => { im.src = make(im.dataset.logo); im.width = cw; im.height = ch; });
        res();
      };
      src.onerror = () => { logoDone(); res(); };
      src.src = asset(LOGO_SRC);
    });
  }

  /* ---------- socials ---------- */
  $$('[data-social]').forEach((ul) => {
    ul.innerHTML = SOCIAL.map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${l}</a></li>`).join('');
  });

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  function toast(msg, ms = 2800) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  }

  /* ---------- fluid reveal: words rise out of a soft blur, one after another.
     (Kept under the old name `scramble` so every caller still works.) ---------- */
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function scramble(el, { duration = 1.1, delay = 0 } = {}) {
    if (!el) return Promise.resolve();
    const final = el.dataset.final || el.textContent;
    el.dataset.final = final;
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', final);
    if (reduce) { el.textContent = final; return Promise.resolve(); }
    const words = final.split(/\s+/).filter(Boolean);
    el.innerHTML = words.map((w) => `<span class="rw" aria-hidden="true">${esc(w)}</span>`).join(' ');
    const spans = [...el.querySelectorAll('.rw')];
    const step = Math.min(90, (duration * 1000 * .55) / Math.max(1, spans.length));
    const anims = spans.map((s, i) => s.animate([
      { opacity: 0, transform: 'translateY(.5em) scale(.98)', filter: 'blur(12px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0)' }
    ], { duration: 900, delay: delay * 1000 + i * step, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'both' }));
    return Promise.all(anims.map((x) => x.finished)).then(() => { el.textContent = final; }).catch(() => {});
  }
  // swap one line of text for another: the old words drift up and blur away, the new ones rise in
  function swapText(el, next) {
    if (reduce) { el.textContent = next; el.dataset.final = next; return; }
    const out = el.animate([{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(10px)', transform: 'translateY(-.45em)' }], { duration: 380, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
    out.onfinish = () => { out.cancel(); el.dataset.final = next; el.textContent = next; scramble(el, { duration: .7 }); };
  }
  
/* ---------- loader (once per visit): the two-star sparkle draws itself in
   iridescent light, fills, a few words keep time with a hairline bar, then
   the page opens through a star-shaped window ---------- */
const loader = $('#loader');
const seen = (() => { try { return sessionStorage.getItem('dlsnl-seen') === '1'; } catch (e) { return false; } })();
function runLoader() {
  return new Promise((done) => {
    if (!loader || seen || reduce || !hasG || location.hash) { document.documentElement.classList.add('no-loader'); loader && loader.remove(); return done(false); }
    document.body.classList.add('is-loading');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const word = $('#loaderWord'), num = $('#loaderNum'), bar = $('#loaderBar');
    const WORDS = [[0, 'Dreaming it up'], [.34, 'Drawing it out'], [.68, 'Polishing'], [.98, 'Here it is']];
    let wi = 0; const o = { p: 0 };
    scramble(word, { duration: .9, delay: .2 });
    gsap.timeline({ onComplete: () => { try { sessionStorage.setItem('dlsnl-seen', '1'); } catch (e) {} } })
      .fromTo('.lm', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: .25 }, .1)
      .to('.lm', { fillOpacity: 1, duration: .8, ease: 'power1.out', stagger: .15 }, 1.1)
      .fromTo('.lm--small', { rotate: -90, scale: .4, transformOrigin: '50% 50%' }, { rotate: 0, scale: 1, duration: 1.2, ease: 'back.out(2)' }, .5)
      .from('.loader__corner', { opacity: 0, y: 8, duration: .8, stagger: .1 }, .3)
      .to(o, { p: 1, duration: 2.3, ease: 'power2.inOut', onUpdate: () => {
        num.textContent = Math.round(o.p * 100); bar.style.transform = `scaleX(${o.p})`;
        if (wi < WORDS.length - 1 && o.p >= WORDS[wi + 1][0]) { wi++; swapText(word, WORDS[wi][1]); }
      } }, .2)
      .to('.loader__mark', { scale: 1.08, duration: .35, ease: 'power2.out' })
      .to('.loader__word, .loader__corner, .loader__bar', { opacity: 0, y: -6, duration: .4, ease: 'power2.in' }, '<')
      .set(loader, { '--hole': '0px' })
      .add(() => loader.classList.add('is-out'))
      .to('.loader__mark', { scale: 3.2, opacity: 0, duration: .9, ease: 'expo.in' })
      .to(loader, { '--hole': '320vmax', duration: 1.1, ease: 'expo.in' }, '<.1')
      .call(() => done(true), null, '-=.45')
      .add(() => { loader.remove(); document.body.classList.remove('is-loading'); });
  });
}

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .1, wheelMultiplier: 1 });
    if (hasG) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const r = (t) => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: 'smooth' }) : $(target)?.scrollIntoView({ behavior: 'smooth' }));
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault(); closeMenu(); scrollTo(id === '#top' ? 0 : id);
  });

  /* ---------- header hides on scroll down ---------- */
  const hdr = $('#hdr'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (hdr && !document.body.classList.contains('menu-open')) { hdr.classList.toggle('is-hidden', y > 300 && y > lastY); hdr.classList.toggle('is-solid', y > 40); }
    lastY = y;
  }, { passive: true });

/* ---------- menu ----------
   Two veils sweep across (a pastel iridescent one, then a dark one),
   and the menu is waiting underneath when they lift. Only transforms
   and opacity move, so nothing flickers. */
const burger = $('#burger'), menu = $('#menu');
let veils = null, menuTl = null;
if (menu) {
  veils = document.createElement('div');
  veils.className = 'veils'; veils.setAttribute('aria-hidden', 'true');
  veils.innerHTML = '<i class="veil veil--iri"></i><i class="veil veil--dark"></i>';
  document.body.appendChild(veils);
}
function openMenu() {
  burger.setAttribute('aria-expanded', 'true'); burger.querySelector('.burger__label').textContent = 'Close';
  document.body.classList.add('menu-open'); lenis && lenis.stop();
  menuTl && menuTl.kill();
  if (!hasG || reduce) { menu.hidden = false; menu.classList.add('is-open'); return; }
  const v = $$('.veil', veils), items = $$('.menu__links li, .menu__card', menu);
  menuTl = gsap.timeline()
    .set(v, { transformOrigin: '50% 0%', scaleY: 0 })
    .to(v, { scaleY: 1, duration: .6, ease: 'expo.inOut', stagger: .13 })
    .add(() => { menu.hidden = false; menu.classList.add('is-open'); })
    .set(v, { transformOrigin: '50% 100%' })
    .fromTo(items, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .06 })
    .to(v.slice().reverse(), { scaleY: 0, duration: .6, ease: 'expo.inOut', stagger: .06 }, '<-.05');
}
function closeMenu() {
  if (!menu || !menu.classList.contains('is-open')) return;
  burger.setAttribute('aria-expanded', 'false'); burger.querySelector('.burger__label').textContent = 'Menu';
  document.body.classList.remove('menu-open'); lenis && lenis.start();
  menuTl && menuTl.kill();
  const finish = () => { menu.classList.remove('is-open'); menu.hidden = true; };
  if (!hasG || reduce) return finish();
  const v = $$('.veil', veils);
  menuTl = gsap.timeline()
    .to($$('.menu__links li, .menu__card', menu), { y: -24, opacity: 0, duration: .3, ease: 'power2.in', stagger: .03 })
    .set(v, { transformOrigin: '50% 100%' }, 0)
    .to(v, { scaleY: 1, duration: .5, ease: 'expo.inOut', stagger: .07 }, .1)
    .add(finish)
    .set(v, { transformOrigin: '50% 0%' })
    .to(v.slice().reverse(), { scaleY: 0, duration: .55, ease: 'expo.inOut', stagger: .06 });
}
  burger && burger.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- sound ----------
   The site's track lives at assets/audio/track.mp3. The sound
   button fades it in and out; the place in the song is kept
   between pages. */
const music = $('#music'), sound = $('#sound');
if (music && sound) {
  music.volume = 0;
  const label = $('.sound__label', sound);
  // a music note when it's off (with a soft strike), dancing bars when it plays
  if (!$('.sound__note', sound)) sound.insertAdjacentHTML('afterbegin', '<svg class="sound__note" viewBox="0 0 24 24" aria-hidden="true"><path class="sound__notehead" d="M9 18.5a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0Zm11-2.2a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0Z"/><path class="sound__stem" d="M9 18.5V6.2l11-2.4v12.5M9 9.6l11-2.4"/><path class="sound__strike" d="M3.5 3.5l17 17"/></svg>');
  const set = (on) => { sound.setAttribute('aria-pressed', on); sound.classList.add('was-set'); label.textContent = on ? 'Music on' : 'Play music'; sound.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music'); };
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const fadeTo = (v, done) => (hasG ? gsap.to(music, { volume: v, duration: v ? 1.5 : .6, onComplete: done }) : ((music.volume = v), done && done()));
  const play = () => {
    const t = +read('dlsnl-sound-t') || 0;
    if (t && !music.currentTime) { try { music.currentTime = t; } catch (e) {} }
    return music.play().then(() => { set(true); fadeTo(.5); store('dlsnl-sound', '1'); });
  };
  sound.addEventListener('click', () => {
    sound.classList.add('is-tried');
    if (music.paused) play().catch(() => toast('The music could not start. Try again.'));
    else { set(false); fadeTo(0, () => music.pause()); store('dlsnl-sound', '0'); }
  });
  const keep = () => { if (!music.paused) store('dlsnl-sound-t', music.currentTime); };
  addEventListener('pagehide', keep);
  setInterval(keep, 3000);
  // it was playing on the last page: carry on (browsers may need a click first)
  if (read('dlsnl-sound') === '1') {
    music.preload = 'auto';
    play().catch(() => {
      const once = () => { play().catch(() => {}); removeEventListener('pointerdown', once); };
      addEventListener('pointerdown', once, { once: true });
    });
  }
}

  /* ---------- iridescent palette (pastel), shared by ribbon, sparks, trail ---------- */
  const IRI = ['#CDB8FF', '#A9C8FF', '#9EE6DD', '#C9F0B8', '#F5E3A8', '#F7C6A8', '#F7B9C9'];
  // one shared SVG gradient, usable as fill="url(#iri)" anywhere on the page
  if (!document.getElementById('iri')) {
    const defs = document.createElement('div');
    defs.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="iri" x1="0" y1="0" x2="1" y2="1">${IRI.map((c, i) => `<stop offset="${i / (IRI.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs></svg>`;
    document.body.prepend(defs.firstChild);
  }

  /* ---------- the star the hero asks the background to draw.
     Pages set DLSNL.star = { x, y, size, alpha, rot } in CSS px. ---------- */
  const starState = { x: 0, y: 0, size: 0, alpha: 0, rot: 0 };

  /* ---------- background: oil film on near-black.
     WebGL, half resolution. The film swirls around the pointer;
     the hero's liquid star and its contour ripples are drawn here
     too, so they share the same light. ---------- */
  (function liquid() {
    const cv = document.createElement('canvas');
    cv.className = 'liquid'; cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv);
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) { cv.remove(); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;
      uniform vec2 uRes; uniform vec2 uMouse; uniform float uTime; uniform float uScroll; uniform float uStr;
      uniform vec4 uStar; uniform float uRot; uniform float uVel;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= .5; } return v; }
      vec3 film(float t){ vec3 c = .5 + .5 * cos(6.2831 * (t + vec3(0., .33, .67))); return mix(c, vec3(1.), .28); }
      float starF(vec2 q){ q = abs(q); return sqrt(q.x) + sqrt(q.y); } // 1.0 on the edge of a four-point star
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes.y;
        vec2 m = uMouse / uRes.y;
        float t = uTime * .035;
        vec2 p = uv * 1.5 + vec2(0., uScroll * .00022);
        vec2 d = uv - m; float fall = exp(-dot(d, d) * 9.);
        p += fall * 1.1 * vec2(-d.y, d.x);
        vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
        vec2 r = vec2(fbm(p + 3. * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 3. * q + vec2(8.3, 2.8)));
        float th = fbm(p + 2.6 * r);
        float mask = smoothstep(.5, .82, fbm(p * .65 + r * .9 - t * .6));
        vec3 base = vec3(.027, .024, .043);
        vec3 col = base + film(th * 2.4 + fall * .3) * uStr * (.12 + .88 * mask + .9 * fall);
        // cursor light: a soft glow wherever the pointer is
        col += vec3(.55, .5, .9) * fall * .05;

        // ---- the liquid stars: the main sparkle, its companion (as in the logo)
        //      and five small satellites drifting in slow orbits. Each one's
        //      surface bulges and swirls away from the cursor, more when the
        //      cursor moves fast. ----
        if (uStar.w > .001) {
          float c = cos(uRot), s = sin(uRot);
          mat2 R = mat2(c, -s, s, c);
          vec2 sp = R * ((gl_FragCoord.xy - uStar.xy) / uStar.z);
          vec2 ms = R * ((uMouse - uStar.xy) / uStar.z);          // cursor, in star space
          float agit = .08 + uVel * .35;                           // how liquid it feels right now
          for (int i = 0; i < 7; i++) {
            float fi = float(i);
            // spaced around the main star like a constellation: top-left, left, bottom-left,
            // bottom, right, with the logo's companion at top-right
            vec3 st = i == 0 ? vec3(0., 0., 1.) : i == 1 ? vec3(.92, .86, .34) : i == 2 ? vec3(-1.15, 1.3, .12)
                    : i == 3 ? vec3(-1.85, .05, .16) : i == 4 ? vec3(-1.05, -1.35, .1) : i == 5 ? vec3(.55, -1.6, .13) : vec3(1.75, -.55, .09);
            // satellites drift around the centre and bob
            if (i > 1) st.xy += vec2(cos(t * 4. + fi * 1.7), sin(t * 5. + fi * 2.3)) * .045;   // a gentle bob, no drifting into each other
            vec2 lp = (sp - st.xy) / st.z;
            vec2 lm = (ms - st.xy) / st.z;
            vec2 dm = lp - lm; float nm = exp(-dot(dm, dm) * .9 * st.z);
            // liquid surface: noise wobble + a bulge/swirl around the cursor
            vec2 wob = vec2(fbm(lp * 2.2 + t * 3. + fi), fbm(lp * 2.2 - t * 3. + 4. + fi)) - .5;
            vec2 sw = lp + wob * (agit + nm * .35) + normalize(dm + 1e-4) * nm * .22 + vec2(-dm.y, dm.x) * nm * .25;
            float f = starF(sw);
            float inside = 1. - smoothstep(.95, 1.02, f);
            float thick = f * 1.3 + fbm(sw * 3. + t * 2. + fi) * .9 + nm * .6 + fi * .17;
            vec3 sc = film(thick + t * 2.);
            float depth = pow(clamp(1. - f, 0., 1.), .6);
            vec3 starCol = sc * (.16 + .5 * depth) + vec3(1.) * pow(clamp(1. - f * 1.25, 0., 1.), 3.) * (.35 + nm * .3);
            float rim = exp(-abs(f - 1.) * (i == 0 ? 30. : 18.)) * (i == 0 ? .35 : .5);
            col = mix(col, starCol, inside * .92 * uStar.w);
            col += sc * rim * uStar.w;
            if (i == 0) {
              // contour echoes rippling outward from the main star
              float rip = 0.;
              for (int k = 0; k < 4; k++) {
                float kk = 1.06 + fract(t * 3.2 + float(k) * .25) * .9;
                rip += exp(-abs(f - kk) * 160.) * pow(1. - (kk - 1.06) / .9, 2.) * .16;
              }
              col += film(f * .7 + t * 2.) * rip * uStar.w;
            }
          }
        }
        // grain, so the dark never bands
        col += (hash(gl_FragCoord.xy + uTime) - .5) * .012;
        gl_FragColor = vec4(col, 1.);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(pr, n);
    const uRes = U('uRes'), uMouse = U('uMouse'), uTime = U('uTime'), uScroll = U('uScroll'), uStr = U('uStr'), uStar = U('uStar'), uRot = U('uRot'), uVel = U('uVel');
    let vel = 0, lastM = null;
    const SCALE = Math.min(1, .6 * Math.min(2, devicePixelRatio || 1));
    let W = 0, H = 0;
    const size = () => { W = Math.ceil(innerWidth * SCALE); H = Math.ceil(innerHeight * SCALE); cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); };
    size(); addEventListener('resize', size);
    const m = { x: innerWidth * .6, y: innerHeight * .4 }, mt = { ...m };
    addEventListener('pointermove', (e) => { mt.x = e.clientX; mt.y = e.clientY; }, { passive: true });
    const strength = .11; // 0 = flat black; raise for a stronger sheen
    const t0 = performance.now();
    const frame = (now) => {
      const px = m.x, py = m.y;
      m.x += (mt.x - m.x) * .07; m.y += (mt.y - m.y) * .07;
      vel += (Math.min(1, Math.hypot(m.x - px, m.y - py) / 40) - vel) * .08;
      gl.uniform1f(uVel, vel);
      gl.uniform2f(uRes, W, H);
      gl.uniform2f(uMouse, m.x * SCALE, (innerHeight - m.y) * SCALE);
      gl.uniform1f(uTime, reduce ? 14 : (now - t0) / 1000);
      gl.uniform1f(uScroll, scrollY);
      gl.uniform1f(uStr, strength);
      const st = starState;
      gl.uniform4f(uStar, st.x * SCALE, (innerHeight - st.y) * SCALE, Math.max(1, st.size * SCALE / 2), st.alpha);
      gl.uniform1f(uRot, st.rot);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (reduce) { const once = () => frame(performance.now()); once(); addEventListener('resize', once); addEventListener('scroll', once, { passive: true }); starState.redraw = once; return; }
    const loop = (now) => { if (!document.hidden) frame(now); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  })();

  /* ---------- cursor: the logo's four-point sparkle, lit from within.
     A soft halo lights the film underneath; a faint pastel trail
     follows fast moves; clicks throw sparks. ---------- */
  const cur = $('#cursor');
  function sparks(x, y, n = 10, spread = 64) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      const size = 5 + Math.random() * 10, c = IRI[(Math.random() * IRI.length) | 0];
      Object.assign(s.style, { left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: c, filter: `drop-shadow(0 0 4px ${c})` });
      document.body.appendChild(s);
      const a = (i / n) * Math.PI * 2 + Math.random() * .5, d = spread * (.5 + Math.random() * .8);
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.2) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1) rotate(${Math.random() * 180}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.3}px), calc(-50% + ${Math.sin(a) * d * 1.3 + 14}px)) scale(.1) rotate(220deg)`, opacity: 0 }
      ], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => s.remove();
    }
  }
  if (cur && fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    cur.innerHTML = `<span class="cursor__halo"></span><span class="cursor__star"><svg viewBox="0 0 100 100"><path d="${SPARK}"/></svg></span><span class="cursor__label"></span>`;
    const lab = $('.cursor__label', cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, lx = x, ly = y, lastTrail = 0, ci = 0;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      const t = e.target;
      const el = t.closest && t.closest('[data-cursor], a, button, .stk, .placed');
      const label = el && el.dataset ? el.dataset.cursor : '';
      cur.classList.toggle('has-label', !!label);
      cur.classList.toggle('is-link', !!el && !label);
      if (label) lab.textContent = label;
      // pastel trail, only when moving quickly
      const now = performance.now(), sp = Math.hypot(x - lx, y - ly);
      if (sp > 14 && now - lastTrail > 16) {
        lastTrail = now;
        const d = document.createElement('i'); d.className = 'trail';
        const c = IRI[ci++ % IRI.length];
        Object.assign(d.style, { left: x + 'px', top: y + 'px', background: c, boxShadow: `0 0 8px ${c}` });
        document.body.appendChild(d);
        d.animate([{ opacity: .9, transform: 'translate(-50%,-50%) scale(1)' }, { opacity: 0, transform: 'translate(-50%,-50%) scale(.2)' }], { duration: 600, easing: 'ease-out' }).onfinish = () => d.remove();
      }
      lx = x; ly = y;
    }, { passive: true });
    addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; cur.classList.add('is-down'); sparks(e.clientX, e.clientY); });
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    const loop = () => { cx += (x - cx) * .3; cy += (y - cy) * .3; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerleave', () => (cur.style.opacity = 0));
    document.addEventListener('pointerenter', () => (cur.style.opacity = 1));

    // magnetic controls: buttons lean toward the pointer
    const MAG = '.chips button, .btn-up, .angles button, .hero__scroll, .manifest__btn';
    document.addEventListener('pointermove', (e) => {
      $$(MAG).forEach((b) => {
        const r = b.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
        const dx = e.clientX - mx, dy = e.clientY - my, dist = Math.hypot(dx, dy), reach = Math.max(r.width, r.height) * .9 + 30;
        const k = dist < reach ? (1 - dist / reach) * .35 : 0;
        b.style.translate = k ? `${dx * k}px ${dy * k}px` : '';
      });
    }, { passive: true });
    $$('.chips button, .btn-up, .angles button, .hero__scroll').forEach((b) => (b.style.transition = (getComputedStyle(b).transition || '') + ', translate .35s cubic-bezier(.2,.7,.1,1)'));
  } else if (cur) {
    addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sparks(e.clientX, e.clientY, 6, 40); }, { passive: true });
  }

  /* ---------- page curtain between pages ---------- */
  const curtain = $('#curtain');
  if (curtain && hasG && !reduce) {
    let arriving = false;
    try { arriving = sessionStorage.getItem('dlsnl-curtain') === '1'; sessionStorage.removeItem('dlsnl-curtain'); } catch (e) {}
    if (arriving) {
      gsap.set(curtain, { yPercent: 0 });
      gsap.to(curtain, { yPercent: -100, duration: .9, ease: 'expo.inOut', delay: .1, onComplete: () => gsap.set(curtain, { yPercent: 100 }) });
    }
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || /^https?:/.test(href) || /\.pdf$/i.test(href)) return;
      e.preventDefault();
      try { sessionStorage.setItem('dlsnl-curtain', '1'); } catch (err) {}
      gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'expo.inOut', onComplete: () => (location.href = href) });
      gsap.fromTo($('svg', curtain), { rotate: 0, scale: .4 }, { rotate: 180, scale: 1, duration: .8, ease: 'expo.out', delay: .2 });
    });
    addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(curtain, { yPercent: 100 }); });
  }

  /* ---------- clock (New Delhi) ---------- */
  const clock = $('#clock');
  if (clock) {
    const f = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    const tick = () => { const t = f.format(new Date()) + ' IST'; clock.textContent = t; $$('[data-ist]').forEach((el) => (el.textContent = t)); };
    tick(); setInterval(tick, 20000);
  }

  /* ---------- iridescent logos: the white logo becomes a mask over a moving gradient ---------- */
  logoURL('white').then((url) => {
    if (!url) return;
    const im = new Image();
    im.onload = () => $$('[data-iri-logo]').forEach((el) => {
      el.style.setProperty('--logo', `url(${url})`);
      el.style.setProperty('--ar', (im.width / im.height).toFixed(4));
    });
    im.src = url;
  });

  /* ---------- footer: a sky of tiny four-point stars that wake up around the pointer,
     the same turn-and-grow sparkle the work rows use on hover ---------- */
  (function footerSky() {
    const ftr = $('.ftr'); if (!ftr) return;
    // the closing line: each word lifts and turns iridescent as you pass it
    const say = $('.ftr__say', ftr);
    if (say && !say.dataset.split) {
      say.dataset.split = '1';
      say.innerHTML = say.innerHTML.split(/(<br\s*\/?>)/).map((part) => /^<br/.test(part) ? part : part.split(/(\s+)/).map((w) => (/^\s*$/.test(w) ? w : `<span class="ftr__w">${w}</span>`)).join('')).join('');
      if (fine) $$('.ftr__w', say).forEach((w) => w.addEventListener('mouseenter', () => { const r = w.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top + r.height * .3, 4, 34); }));
    }
    // footer links get the row sparkle
    $$('.ftr ul a').forEach((a) => { if (!a.querySelector('.ftr__spk')) a.insertAdjacentHTML('afterbegin', `<svg class="ftr__spk" viewBox="0 0 100 100" aria-hidden="true"><path d="${SPARK}"/></svg>`); });

    // a tiny evil eye signs off the page; it glances toward the pointer
    const base = $('.ftr__base', ftr);
    if (base && !$('.nazar', base)) {
      base.insertAdjacentHTML('beforeend', '<span class="nazar" role="img" aria-label="A tiny evil eye, for luck"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#1B3FA6"/><circle cx="20" cy="20" r="13.5" fill="#F5F7FF"/><g class="nazar__iris"><circle cx="20" cy="20" r="9" fill="#5FB7F0"/><circle cx="20" cy="20" r="4.6" fill="#0B0A12"/><circle cx="18.2" cy="18.2" r="1.3" fill="#fff"/></g></svg></span>');
      const eye = $('.nazar', base), iris = $('.nazar__iris', base);
      if (fine && !reduce) addEventListener('pointermove', (e) => {
        const r = eye.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(3.2, d / 40);
        iris.style.transform = `translate(${dx / d * k}px, ${dy / d * k}px)`;
      }, { passive: true });
    }
    const cv = document.createElement('canvas'); cv.className = 'ftr__sky'; cv.setAttribute('aria-hidden', 'true');
    ftr.prepend(cv);
    const cx = cv.getContext('2d');
    const star = new Path2D(STAR);
    let W = 0, H = 0, dpr = 1, stars = [], px = -999, py = -999, on = false, raf = 0, t0 = performance.now();
    const build = () => {
      const r = ftr.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
      const gap = W < 700 ? 38 : 48; stars = [];
      for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) {
        stars.push({ x: x + (Math.random() - .5) * gap * .8, y: y + (Math.random() - .5) * gap * .8, s: 3.5 + Math.random() * 4, k: 0, rot: Math.random() * 6.28, ph: Math.random() * 6.28, c: IRI[(Math.random() * IRI.length) | 0] });
      }
    };
    const draw = (now) => {
      raf = on ? requestAnimationFrame(draw) : 0;
      const t = (now - t0) / 1000;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      for (const p of stars) {
        const d = Math.hypot(p.x - px, p.y - py), want = d < 200 ? Math.pow(1 - d / 200, 1.4) : 0;
        p.k += (want - p.k) * .12;
        const tw = .5 + .5 * Math.sin(t * 1.3 + p.ph);                 // a slow twinkle on its own
        const size = p.s * (1 + p.k * 4.5) * (.75 + tw * .4);
        const a = .18 + tw * .3 + p.k * .9;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + p.k * 1.6 + t * .08);
        cx.scale(size / 100, size / 100); cx.translate(-50, -50);
        cx.globalAlpha = Math.min(1, a); cx.fillStyle = p.k > .05 ? p.c : '#ECEAF3';
        if (p.k > .3) { cx.shadowColor = p.c; cx.shadowBlur = 40; }
        cx.fill(star); cx.restore();
      }
    };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(draw); };
    build();
    if (reduce) { on = true; draw(performance.now()); on = false; }
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) start(); }).observe(ftr);
    new ResizeObserver(() => { build(); if (!on) draw(performance.now()); }).observe(ftr);
    const move = (e) => { const r = ftr.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    ftr.addEventListener('pointermove', move, { passive: true });
    ftr.addEventListener('pointerdown', move, { passive: true });
    ftr.addEventListener('pointerleave', () => { px = py = -999; });
  })();

  /* ---------- swipe hints: anything that scrolls sideways says so, quietly.
     Rails get a thin progress line with "Swipe" under them; short rows
     (tabs, chips, the sticker sheet) get a soft fade on the edge with more ---------- */
  (function swipeHints() {
    const SKIP = '.brands, .brands *, .menu, .menu *, .loader, .loader *, .fb, .fb *';
    const ARROW = '<svg viewBox="0 0 24 12"><path d="M1 6h20M16 1l5 5-5 5"/></svg>';
    const hinted = new Map();
    const update = (el) => {
      const h = hinted.get(el); if (!h) return;
      if (!h.bar && el.getBoundingClientRect().height > 100) addBar(el, h);
      const max = el.scrollWidth - el.clientWidth, x = el.scrollLeft, over = max > 8;
      el.classList.toggle('swipe-l', over && x > 6);
      el.classList.toggle('swipe-r', over && x < max - 6);
      if (h.bar) {
        h.bar.hidden = !over;
        const vis = el.clientWidth / el.scrollWidth;
        h.thumb.style.width = (vis * 100).toFixed(1) + '%';
        h.thumb.style.transform = `translateX(${(max > 0 ? x / max : 0) * (1 / vis - 1) * 100}%)`;
        h.bar.classList.toggle('is-end', x >= max - 6);
      }
    };
    const addBar = (el, h) => {
      el.classList.add('swipe-x--rail');
      el.insertAdjacentHTML('afterend', `<div class="swipe" aria-hidden="true"><span class="swipe__track"><i></i></span><span class="swipe__label">Swipe</span>${ARROW}</div>`);
      h.bar = el.nextElementSibling; h.thumb = h.bar.querySelector('i');
    };
    const attach = (el) => {
      if (hinted.has(el)) return update(el);
      const h = {};
      el.classList.add('swipe-x');
      hinted.set(el, h);
      if (window.ResizeObserver) new ResizeObserver(() => update(el)).observe(el);
      el.addEventListener('scroll', () => { update(el); if (h.bar && el.scrollLeft > 20) h.bar.classList.add('is-used'); }, { passive: true });
      update(el);
    };
    const scan = () => {
      $$('main *, .cs-jump *').forEach((el) => {
        if (hinted.has(el)) return update(el);
        if (el.closest(SKIP)) return;
        const ox = getComputedStyle(el).overflowX;
        if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 8 && el.clientHeight > 20) attach(el);
      });
    };
    let t; const later = () => { clearTimeout(t); t = setTimeout(scan, 250); };
    addEventListener('load', () => { scan(); setTimeout(scan, 1500); setTimeout(scan, 4000); });
    addEventListener('resize', later);
    setTimeout(scan, 600);
  })();

  window.DLSNL = { asset, EMAIL, STAR, SPARK, IRI, sparks, star: starState, logoURL, reduce, fine, hasG, lenis, toast, scramble, swapText, runLoader, tintLogo, scrollTo, $, $$ };
})();
