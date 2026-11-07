/* About: glitter over the hello, photos that drift with the pointer,
   and the personal art as a turning wall with a one-at-a-time view. */
(function () {
  const D = window.DLSNL || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const A = (p) => (D.asset ? D.asset(p) : p);
  const STAR = D.STAR || 'M50 0C53 35 65 47 100 50 65 53 53 65 50 100 47 65 35 53 0 50 35 47 47 35 50 0Z';
  if (D.tintLogo) D.tintLogo().then(() => window.ScrollTrigger && ScrollTrigger.refresh());
  const IRI = D.IRI ||['#CDB8FF', '#A9C8FF', '#9EE6DD', '#C9F0B8', '#F5E3A8', '#F7C6A8', '#F7B9C9'];

  /* ---------- the art: [file, title, series, w, h] ---------- */
  const COLOUR = [
    ['ig-01', 'Wave and smoke', 'Colour', 880, 1100], ['ig-06', 'The fox mask', 'Colour', 880, 1100], ['ig-05', 'Koi and ginkgo', 'Colour', 1100, 1100],
    ['ig-08', 'Noodle kraken', 'Colour', 880, 1100], ['ig-07', 'Bloom', 'Colour over photo', 880, 1100], ['ig-30', 'Punk', 'Colour', 825, 1100],
    ['ig-02', 'Ladakh I', 'Photography', 880, 1100], ['ig-03', 'Ladakh II', 'Photography', 880, 1100]
  ];
  const INK = [
    ['ig-11', 'Orbit', 'Ink a day', 1100, 1100], ['ig-09', 'Wrapped', 'Ink a day', 1100, 1100], ['ig-10', 'Oni', 'Ink a day', 1100, 1100],
    ['ig-12', 'Scorpion queen', 'Ink a day', 1100, 1100], ['ig-13', 'Spill', 'Ink a day', 1100, 1100], ['ig-14', 'Fangs', 'Ink a day', 1100, 1100],
    ['ig-15', 'Overgrown', 'Ink a day', 1100, 1100], ['ig-16', 'Water type', 'Ink a day', 1100, 1100], ['ig-17', 'Fairy light', 'Ink a day', 1049, 1100],
    ['ig-18', 'Good boy', 'Ink a day', 1100, 1100], ['ig-19', 'Three heads', 'Ink a day', 825, 1100], ['ig-20', 'Pinned', 'Ink a day', 943, 1100],
    ['ig-21', 'Spellbook', 'Ink a day', 942, 1100], ['ig-22', 'Reach', 'Ink a day', 942, 1100], ['ig-23', 'Miniature', 'Ink a day', 946, 1100],
    ['ig-24', 'Cactus', 'Ink a day', 1100, 1100], ['ig-25', 'Ogre', 'Ink a day', 1100, 1100], ['ig-26', 'Panic', 'Ink a day', 1100, 1100],
    ['ig-27', 'Stinky', 'Ink a day', 825, 1100], ['ig-28', 'Ram', 'Ink a day', 825, 1100], ['ig-29', 'The deal', 'Ink a day', 1100, 1100],
    ['ig-31', 'Seahorse', 'Ink a day', 1100, 1100], ['ig-32', 'Relic', 'Ink a day', 1100, 1100], ['ig-33', 'Smack', 'Ink a day', 1100, 1100]
  ];
  // a colour piece every few ink pieces, so the wall has a rhythm
  const ART = [];
  { const every = Math.ceil(INK.length / COLOUR.length); let c = 0; INK.forEach((p, i) => { if (i % every === 0 && COLOUR[c]) ART.push(COLOUR[c++]); ART.push(p); }); while (COLOUR[c]) ART.push(COLOUR[c++]); }
  // the personal projects from the old portfolio, shown flat in their own section
  const PP = [
    ['old-r0s22FrDQOdz11vpWcJahyahXE', 'A.S.L.-phabet', 'Deaf-awareness series', 1089, 1100], ['old-TMPBf1C9ZKNnuuSGNDUPb3XOg', 'Understand.', 'Deaf-awareness series', 997, 1100],
    ['old-hmWWBK2NMnGU237q6DUyNKfds', 'Language.', 'Deaf-awareness series', 997, 1100], ['old-Vo4WZPM80wWgdHrVyUlFIpQhvrc', 'Listening.', 'Deaf-awareness series', 997, 1100],
    ['old-czPtVno45WKfoU9DwLwS8xbwY4', 'Hands that speak', 'Deaf-awareness series', 546, 1100], ['old-QsysRbgXY7csitaP84nzIAwSTM', 'Three of a kind', 'Digital portraits', 1033, 1100],
    ['old-acvsQH0pAm4FyWqI7f8FbwDeOeQ', 'Pink noise', 'Digital portrait', 824, 1100], ['old-NyWZQvlOOaXPEwmm9IIFvCRyDTE', 'Hand-painted denim', 'Wearable', 824, 1100],
    ['old-pBSEBQctOnIFm0bOYLf8L4tItg', 'Deep dive', 'Digital illustration', 1100, 645]
  ];
  const src = (a) => A(`assets/art/${a[0]}.jpg`);
  const NN = (n) => String(n).padStart(2, '0');

  /* ---------- glitter over the hello ---------- */
  (function glitter() {
    const cv = $('#glitter'); if (!cv) return;
    const cx = cv.getContext('2d'), star = new Path2D(STAR), host = cv.parentElement;
    let W = 0, H = 0, dpr = 1, bits = [], px = .5, py = .5, on = true, raf = 0;
    const build = () => {
      const r = host.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
      const n = Math.round(W * H / 9000);
      bits = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() < .14 ? 6 + Math.random() * 9 : 1 + Math.random() * 2.2, ph: Math.random() * 6.28, sp: .6 + Math.random() * 1.6, d: .2 + Math.random(), c: IRI[(Math.random() * IRI.length) | 0], vy: -(.05 + Math.random() * .18) }));
    };
    const draw = (now) => {
      raf = on && !reduce ? requestAnimationFrame(draw) : 0;
      const t = now / 1000;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      for (const b of bits) {
        if (!reduce) { b.y += b.vy; if (b.y < -20) { b.y = H + 10; b.x = Math.random() * W; } }
        const tw = Math.max(0, Math.sin(t * b.sp + b.ph));
        const x = b.x + (px - .5) * 30 * b.d, y = b.y + (py - .5) * 20 * b.d;
        cx.globalAlpha = .15 + tw * .85;
        if (b.s > 4) {
          const s = b.s * (.6 + tw * .6);
          cx.save(); cx.translate(x, y); cx.rotate(t * .3 + b.ph); cx.scale(s / 100, s / 100); cx.translate(-50, -50);
          cx.fillStyle = b.c; cx.shadowColor = b.c; cx.shadowBlur = 30; cx.fill(star); cx.restore();
        } else { cx.fillStyle = tw > .7 ? '#FFFFFF' : b.c; cx.beginPath(); cx.arc(x, y, b.s * (.5 + tw * .5), 0, 6.283); cx.fill(); }
      }
    };
    build(); draw(performance.now());
    new ResizeObserver(build).observe(host);
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf && !reduce) raf = requestAnimationFrame(draw); }).observe(host);
    addEventListener('pointermove', (e) => { px = e.clientX / innerWidth; py = e.clientY / innerHeight; }, { passive: true });
  })();

  /* ---------- photos drift a little with the pointer ---------- */
  if (fine && !reduce) {
    const pics = $$('[data-float]');
    addEventListener('pointermove', (e) => {
      const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
      pics.forEach((p) => { const k = +p.dataset.float * 10; p.style.transform = `translate(${-dx * k}px, ${-dy * k}px) rotate(${dx * k * .15}deg)`; });
    }, { passive: true });
  }

  /* ---------- the sketchbook: rows of art drifting slowly, each one yours to move ---------- */
  // the Instagram pieces and the old portfolio projects, as one sketchbook
  const ALL = [];
  { const every = Math.ceil(ART.length / PP.length); let p = 0; ART.forEach((a, i) => { if (i % every === 2 && PP[p]) ALL.push(PP[p++]); ALL.push(a); }); while (PP[p]) ALL.push(PP[p++]); }
  const wall = $('#wall'), plane = $('#wallPlane');
  let nRows = 0;
  const card = (i, ghost) => { const a = ALL[i]; return `<button class="fr__p" data-i="${i}" style="--ar:${(a[3] / a[4]).toFixed(3)}"${ghost ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Open ${a[1]}"`}><img src="${src(a)}" alt="${ghost ? '' : `${a[1]}, ${a[2].toLowerCase()}`}" width="${a[3]}" height="${a[4]}" loading="lazy" decoding="async" draggable="false" /><span class="fr__cap">${a[1]}</span></button>`; };
  const buildWall = () => {
    const n = (wall.clientWidth || innerWidth) < 700 ? 2 : 3;
    if (n === nRows) return; nRows = n;
    // share the pieces out so every row runs about the same length
    const buckets = Array.from({ length: n }, () => ({ w: 0, items: [] }));
    ALL.forEach((a, i) => { const b = buckets.reduce((m, x) => (x.w < m.w ? x : m)); b.items.push(i); b.w += a[3] / a[4] + .08; });
    // each row holds its pieces twice, so the drift loops without a seam
    plane.innerHTML = buckets.map(() => '<div class="fr__row"><div class="fr__track"></div></div>').join('');
    rows = $$('.fr__track', plane).map((el, k) => {
      el.innerHTML = buckets[k].items.map((i) => card(i)).join('') + buckets[k].items.map((i) => card(i, true)).join('');
      return { el, row: el.parentElement, dir: k % 2 ? 1 : -1, speed: 14 + k * 3, x: 0, half: 0, start: k * .23, v: 0, hover: false };
    });
    rows.forEach((r) => {
      if (fine) { r.row.addEventListener('pointerenter', () => { r.hover = true; }); r.row.addEventListener('pointerleave', () => { r.hover = false; }); }
      // a sideways trackpad swipe moves the row it's over
      r.row.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; e.preventDefault(); r.x -= e.deltaX; wrap(r); paint(r); }, { passive: false });
    });
    measureRows();
  };

  // each row drifts slowly on its own; grab one (mouse, pen or finger) to move it, let go and it glides back into its drift
  let rows = [], drag = null, lastT = performance.now(), wallOn = false;
  const measureRows = () => rows.forEach((r) => { const h = r.el.scrollWidth / 2; if (h && !r.half) r.x = -h * r.start; r.half = h; });
  const wrap = (r) => { if (!r.half) return; while (r.x <= -r.half) r.x += r.half; while (r.x > 0) r.x -= r.half; };
  const paint = (r) => { r.el.style.transform = `translate3d(${r.x.toFixed(1)}px, 0, 0)`; };
  const wallTick = (now) => {
    requestAnimationFrame(wallTick);
    const dt = Math.min(64, now - lastT) / 1000; lastT = now;
    if (!wallOn) return;
    const paused = reduce || view.classList.contains('is-open');
    rows.forEach((r) => {
      if (drag && drag.r === r) return;
      const auto = paused ? 0 : r.hover ? .15 : 1;
      r.x += r.dir * r.speed * dt * auto + r.v;    // drift, plus any glide left from a drag
      r.v *= .93; if (Math.abs(r.v) < .05) r.v = 0;
      wrap(r); paint(r);
    });
  };
  buildWall();
  requestAnimationFrame(wallTick);
  new IntersectionObserver(([e]) => { wallOn = e.isIntersecting; }, { rootMargin: '200px 0px' }).observe(wall);
  new ResizeObserver(measureRows).observe(plane);
  addEventListener('resize', () => { clearTimeout(buildWall.t); buildWall.t = setTimeout(buildWall, 200); });

  plane.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    const rowEl = e.target.closest('.fr__row'); if (!rowEl) return;
    const r = rows.find((x) => x.row === rowEl);
    drag = { r, id: e.pointerId, sx: e.clientX, sy: e.clientY, last: e.clientX, t: performance.now(), v: 0, moved: 0, axis: null };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.last, now = performance.now();
    if (!drag.axis) {
      const tx = Math.abs(e.clientX - drag.sx), ty = Math.abs(e.clientY - drag.sy);
      if (Math.max(tx, ty) < 6) return;
      drag.axis = tx > ty ? 'x' : 'y';             // up and down stays the page's scroll
      if (drag.axis === 'y') { drag = null; return; }
      wall.classList.add('is-grabbing');
    }
    drag.v = dx / Math.max(1, now - drag.t) * 16; drag.last = e.clientX; drag.t = now; drag.moved += Math.abs(dx);
    drag.r.x += dx; wrap(drag.r); paint(drag.r);
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.axis === 'x') { drag.r.v = Math.max(-28, Math.min(28, drag.v)); wall._dragged = drag.moved > 6; }
    wall.classList.remove('is-grabbing'); drag = null;
  };
  addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);
  plane.addEventListener('click', (e) => {
    if (wall._dragged) { wall._dragged = false; e.preventDefault(); return; }   // letting go of a drag isn't a tap
    const b = e.target.closest('.fr__p'); if (b) open(+b.dataset.i, ALL);
  });
  // once the wall is near, load every piece so the drift never shows an empty frame
  new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; $$('img', plane).forEach((im) => { im.loading = 'eager'; }); o.disconnect(); }, { rootMargin: '600px 0px' }).observe(wall);

  /* ---------- one piece at a time ---------- */
  const view = $('#view'), vImg = $('#viewImg'), vTitle = $('#viewTitle'), vSeries = $('#viewSeries'), vN = $('#viewN');
  let cur = 0, lastFocus = null, list = ALL;
  const show = (i) => {
    const L = list.length; cur = (i % L + L) % L; const a = list[cur];
    vImg.src = src(a); vImg.alt = `${a[1]}, ${a[2].toLowerCase()}`; vImg.width = a[3]; vImg.height = a[4];
    vTitle.textContent = a[1]; vSeries.textContent = a[2]; vN.textContent = `${NN(cur + 1)} / ${L}`;
  };
  function open(i, which) {
    list = which || ALL;
    lastFocus = document.activeElement; show(i);
    view.hidden = false; requestAnimationFrame(() => view.classList.add('is-open'));
    D.lenis && D.lenis.stop(); document.documentElement.style.overflow = 'hidden';
    $('#viewBack').focus({ preventScroll: true });
  }
  function close() {
    view.classList.remove('is-open');
    D.lenis && D.lenis.start(); document.documentElement.style.overflow = '';
    setTimeout(() => { view.hidden = true; (lastFocus && lastFocus.focus) && lastFocus.focus({ preventScroll: true }); }, 380);
  }
  $('#viewBack').addEventListener('click', close);
  view.addEventListener('click', (e) => { if (e.target === view) close(); });
  $$('[data-v]', view).forEach((b) => b.addEventListener('click', () => show(cur + +b.dataset.v)));
  addEventListener('keydown', (e) => {
    if (view.hidden) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
  });
  // swipe between pieces on touch
  let tx = null;
  view.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  view.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* ---------- the years bar grows in; the video only plays while it's on screen ---------- */
  const bar = $('.tl');
  if (bar) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { bar.classList.add('is-in'); o.disconnect(); } }, { threshold: .4 }).observe(bar);
  const vid = $('#heroVid');
  if (vid) {
    if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
    else new IntersectionObserver(([e]) => { if (e.isIntersecting) vid.play().catch(() => {}); else vid.pause(); }).observe(vid);
  }

  /* ---------- gentle entrances ---------- */
  if (window.gsap && !reduce) {
    gsap.from('.ab-hero__copy > *', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .3 });
    gsap.from('.ab-pic', { y: 40, opacity: 0, scale: .92, duration: 1.4, ease: 'expo.out', stagger: .15, delay: .5 });
    if (window.ScrollTrigger) {
      $$('.gr__ch, .mk li').forEach((el, i) => gsap.from(el, { y: 22, opacity: 0, duration: .9, ease: 'expo.out', delay: (i % 6) * .05, scrollTrigger: { trigger: el, start: 'top 92%' } }));
    }
  }
})();
