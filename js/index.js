/* =========================================================
   Home page
   liquid-star hero · brand loop · stacked project deck ·
   sticker face · pastel ribbon · transitions · contact
   ========================================================= */
(function () {
  const D = window.DLSNL;
  const { $, $$, reduce, hasG, STAR } = D;
  const P = window.PROJECTS || [];

  /* =========================================================
     HERO, the logo's sparkle as a liquid, iridescent star,
     drawn by the background shader. This block only tells the
     shader where the star is. As you scroll out of the hero the
     star warps: it swells, spins and dissolves into the film.
     ========================================================= */
  const hero = $('.hero'), anchor = $('#heroStar');
  const SS = D.star;
  const heroState = { bloom: 0, spin: 0 };
  let heroBox = { x: 0, y: 0, size: 0 }; // document coordinates
  function measureStar() {
    const r = anchor.getBoundingClientRect();
    heroBox = { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY, size: r.width };
  }
  function updateStar(now) {
    const h = hero.offsetHeight || innerHeight;
    const p = Math.max(0, Math.min(1, scrollY / (h * .9)));     // 0 at top, 1 when the hero has left
    const warp = p * p;
    SS.x = heroBox.x + (innerWidth / 2 - heroBox.x) * warp * .6;
    SS.y = heroBox.y - scrollY * (1 - warp * .7);
    SS.size = heroBox.size * heroState.bloom * (1 + warp * 2.6);
    SS.alpha = Math.min(1, heroState.bloom * 1.4) * (1 - Math.min(1, p * 1.15));
    SS.rot = (reduce ? 0 : now / 1000 * .05) + heroState.spin + warp * 1.6;
    if (reduce && SS.redraw) SS.redraw();
  }
  (function starLoop(now) { updateStar(now || 0); requestAnimationFrame(starLoop); })();
  addEventListener('resize', measureStar);
  measureStar();

  // the rest of the hero leans away as the star warps
  if (hasG && !reduce) {
    gsap.to('.hero__intro, .hero__index', { y: -80, opacity: 0, filter: 'blur(8px)', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true } });
    gsap.to('.hero__base', { y: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: '85% top', scrub: true } });
  }

  function heroIn() {
    measureStar();
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { buildRibbon(); ribbonIntro(); });
    if (!hasG || reduce) { heroState.bloom = 1; return; }
    // the star is born from a point: blooms, overshoots, settles
    gsap.fromTo(heroState, { bloom: 0, spin: -2.4 }, { bloom: 1, spin: 0, duration: 2.4, ease: 'expo.out' });
    gsap.timeline()
      .from('.hdr', { y: -30, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'transform,opacity' }, .3)
      .from('.who > *', { y: 14, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08 }, .5)
      .from('.hero__index li', { x: 20, opacity: 0, duration: .9, ease: 'power3.out', stagger: .06 }, .6)
      .add(() => D.scramble($('.hero__line'), { duration: 1.3 }), .7)
      .from('.hero__meta > *', { opacity: 0, y: 10, duration: .8, stagger: .1 }, 1.4);
  }

  /* ---------- hero credit ----------
     The name is set in Geist's variable weight: letters thicken
     and pick up a pastel tint as the cursor nears, like light
     passing over them. The role line decodes through what I do.
     The clock is New Delhi time. */
  const whoName = $('#whoName');
  const nameChars = (() => {
    const t = whoName.textContent; whoName.setAttribute('aria-label', t); whoName.textContent = '';
    return [...t].map((ch) => { const s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch === ' ' ? ' ' : ch; whoName.appendChild(s); return s; });
  })();
  const PAST = D.IRI.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const lerp3 = (a, b, k) => a.map((v, j) => Math.round(v + (b[j] - v) * k));
  const iriMix = (u) => { const n = PAST.length, f = ((u % 1) + 1) % 1 * n, i = Math.floor(f); return lerp3(PAST[i], PAST[(i + 1) % n], f - i); };
  const WHITE = [246, 243, 255];
  let nameMouse = { x: -9999, y: -9999 };
  addEventListener('pointermove', (e) => { nameMouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
  const nameT0 = performance.now();
  (function nameLoop(now) {
    const t = ((now || 0) - nameT0) / 1000;
    const reach = 190;
    nameChars.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.hypot(nameMouse.x - (r.left + r.width / 2), nameMouse.y - (r.top + r.height / 2));
      const k = reduce ? 0 : Math.max(0, 1 - d / reach), e = k * k * (3 - 2 * k);
      s._e = (s._e || 0) + (e - (s._e || 0)) * .14;
      const E = s._e;
      // bold at rest, heavier near the cursor
      const w = 600 + E * 100;
      s.style.fontWeight = Math.round(w);
      // a soft iridescent gradient drifts across the letters; near the cursor it brightens to full pastel
      const hue = iriMix(i / nameChars.length * .9 + t * .05);
      s.style.color = `rgb(${lerp3(WHITE, hue, .38 + E * .62).join(',')})`;
      s.style.textShadow = E > .02 ? `0 0 ${(E * 18).toFixed(1)}px rgba(${hue.join(',')},${(E * .55).toFixed(2)})` : 'none';
      // and the letters ripple like a wave passing through
      const wave = Math.sin(t * 7 - i * .6) * 4 * E;
      s.style.transform = `translateY(${(-E * 4 + wave).toFixed(2)}px) scale(${(1 + E * .08).toFixed(3)})`;
    });
    requestAnimationFrame(nameLoop);
  })();
  const ROLES = ['Senior brand designer', 'Creative strategist', 'Illustrator and painter', 'Builds AI workflows', 'Led a team of seven'];
  const whoRole = $('#whoRole');
  const roleBar = document.createElement('i'); roleBar.className = 'who__bar'; roleBar.setAttribute('aria-hidden', 'true'); whoRole.parentNode.appendChild(roleBar);
  const restartBar = () => { roleBar.classList.remove('is-run'); void roleBar.offsetWidth; roleBar.classList.add('is-run'); };
  restartBar();
  let roleI = 0;
  if (!reduce) setInterval(() => { if (document.hidden) return; roleI = (roleI + 1) % ROLES.length; D.swapText(whoRole, ROLES[roleI]); restartBar(); }, 3200);
  const whoTime = $('#whoTime');
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
  const tickWho = () => { whoTime.textContent = fmt.format(new Date()) + ' IST'; };
  tickWho(); setInterval(tickWho, 15000);

  /* =========================================================
     BRAND LOOP, monochrome. Drop SVG/PNG logos into
     assets/logos/<file> and they replace the typeset names.
     ========================================================= */
  const BRANDS = [
    ['GradRight', 'sans', 'gradright'],
    ['Capcons Analytics', 'wide', 'capcons'],
    ['Zen Barefoot', 'serif', 'zen-barefoot'],
    ['yoho', 'lower', 'yoho'],
    ['little things by Shivani', 'italic', 'little-things'],
    ['Ralf Iwan', 'serif', 'ralf-iwan'],
    ['Transformative Ventures', 'sans', 'transformative'],
    ['Indian Army', 'px', 'indian-army']
  ];
  const star = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${STAR}"/></svg>`;
  const brandHTML = BRANDS.map(([n, s, f]) => `<span class="bw bw--${s}" data-logo-file="${f}">${star}<span class="bw__name">${n}</span></span>`).join('');
  $('#brands').innerHTML = brandHTML + brandHTML.replace(/class="bw /g, 'aria-hidden="true" class="bw ');
  // When a real logo file is added to assets/logos/, list it here
  // (e.g. gradright: 'gradright.svg') and it replaces the typeset name.
  const LOGO_FILES = {};
  BRANDS.forEach(([n, , f]) => {
    if (!LOGO_FILES[f]) return;
    $$(`[data-logo-file="${f}"] .bw__name`).forEach((el) => (el.outerHTML = `<img src="assets/logos/${LOGO_FILES[f]}" alt="${n}" />`));
  });

  /* =========================================================
     WORK, an index of projects. Each row has a line icon drawn
     in the iridescent gradient, one headline fact and the year.
     Hovering a row floats a small preview beside the pointer.
     Tabs switch between big and small projects.
     ========================================================= */
  const ICONS = window.PROJECT_ICONS || {};
  const FACT = {
    'herbius': { client: 'Transformative Ventures', b: '225', t: 'ads in six months', cover: 'assets/herbius/cover.webp' },
    'nari-sashaktikaran': { client: 'Indian Army', sub: 'Biker rally logo', b: '1 mark', t: 'for an all-women rally' },
    'zen-barefoot': { client: 'Zen Barefoot', sub: 'Seen on Shark Tank India', b: '12K', t: 'Instagram followers', cover: 'assets/zen/shoe-1.jpg' },
    'gradright': { client: 'GradRight Inc.', sub: 'Digital marketing', b: '13+', t: 'lenders, plus university campaigns' },
    'sena-diwas-2027': { client: 'Indian Army', tag: 'Under wraps', b: 'Soon', t: 'unveiled after Army Day', cover: null, coverText: 'Under<br><em>wraps</em>' },
    'little-things-by-shivani': { client: 'Shivani Kohli', sub: 'Built from home', b: '18K+', t: 'on Instagram', cover: 'assets/little/logo-stacked.webp' },
    'trend-book': { client: 'NIFT, team of five', b: '3', t: 'futures, decoded', cover: 'assets/trend/page-01.jpg' }
  };
  const arrow = '<svg viewBox="0 0 16 16"><path d="M3 13 13 3M5 3h8v8"/></svg>';
  const indexEl = $('#index');
  const rowHTML = (p) => {
    const f = FACT[p.slug] || {};
    return `<li class="row" style="--c:${p.accent}"><a href="case.html?p=${p.slug}" data-slug="${p.slug}" data-cursor="Open case">
      <span class="row__icon" aria-hidden="true"><svg viewBox="0 0 48 48">${(ICONS[p.slug] || '').replace(/<(path|circle|ellipse)/g, '<$1 pathLength="1"')}</svg></span>
      <span class="row__main"><span class="row__title">${p.title}${f.tag ? `<span class="row__tag">${f.tag}</span>` : ''}</span><span class="row__line">${p.oneLiner}</span></span>
      <span class="row__client">${f.client || p.client}${f.sub ? `<small>${f.sub}</small>` : ''}</span>
      <span class="row__fact"><b>${f.b || ''}</b>${f.t || ''}</span>
      <span class="row__year">${p.year}</span>
      <span class="row__go" aria-hidden="true">${arrow}</span>
    </a></li>`;
  };
  let tier = 'major';
  function renderIndex(t, animate) {
    tier = t;
    const list = P.filter((p) => p.tier === t);
    const go = () => {
      indexEl.innerHTML = list.map(rowHTML).join('');
      if (hasG && !reduce && animate) {
        gsap.from($$('.row', indexEl), { y: 26, opacity: 0, filter: 'blur(6px)', duration: .8, ease: 'expo.out', stagger: .06 });
        $$('.row__title', indexEl).forEach((el, i) => D.scramble(el.firstChild && el.firstChild.nodeType === 3 ? wrapText(el) : el, { duration: .7, delay: i * .06 }));
      }
    };
    if (hasG && !reduce && animate && indexEl.children.length) {
      gsap.to($$('.row', indexEl), { y: -16, opacity: 0, filter: 'blur(6px)', duration: .35, ease: 'power2.in', stagger: .03, onComplete: go });
    } else go();
  }
  // decode only the title text, not the tag
  function wrapText(el) { const s = document.createElement('span'); s.textContent = el.firstChild.textContent; el.firstChild.replaceWith(s); return s; }
  renderIndex('major', false);

  // tabs with a sliding pill
  const tabs = $$('.tabs button'), pill = $('.tabs__pill');
  const movePill = () => { const on = tabs.find((b) => b.getAttribute('aria-selected') === 'true'); if (!on || !pill) return; pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; };
  tabs.forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.tier === tier) return;
    tabs.forEach((x) => x.setAttribute('aria-selected', x === b));
    indexEl.setAttribute('aria-labelledby', b.id);
    movePill(); renderIndex(b.dataset.tier, true);
    $('#peek').classList.remove('is-on');
    if (hasG) setTimeout(() => ScrollTrigger.refresh(), 900);
  }));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(movePill);
  addEventListener('resize', movePill);

  // floating preview
  const peek = $('#peek'), peekIn = $('#peekIn');
  const peekHTML = (p) => {
    const f = FACT[p.slug] || {};
    const cover = 'cover' in f ? f.cover : p.cover, text = 'coverText' in f ? f.coverText : p.coverText;
    return cover && p.coverLight ? `<img src="${D.asset(cover)}" alt="" style="background:#F6F1E4;object-fit:contain" />` : cover ? `<span class="fit-bg" style="background-image:url('${D.asset(cover)}')" aria-hidden="true"></span><img src="${D.asset(cover)}" alt="" />` : `<div class="peek__type" style="--c:${p.accent}"><span>${text || p.title}</span></div>`;
  };
  if (D.fine && !reduce) {
    let px = 0, py = 0, tx = 0, ty = 0, cur = null, raf = 0;
    const loop = () => {
      px += (tx - px) * .16; py += (ty - py) * .16;
      peek.style.transform = `translate(${px + 34}px, ${py - 230}px) rotate(${Math.max(-8, Math.min(8, (tx - px) * .05))}deg)`;
      raf = requestAnimationFrame(loop);
    };
    indexEl.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      const a = e.target.closest('a[data-slug]');
      if (a && a.dataset.slug !== cur) {
        cur = a.dataset.slug;
        const p = P.find((q) => q.slug === cur);
        peekIn.innerHTML = peekHTML(p);
        peek.classList.remove('is-on'); void peek.offsetWidth; peek.classList.add('is-on');
      }
      if (!raf) { px = tx; py = ty; loop(); }
    });
    indexEl.addEventListener('pointerleave', () => { peek.classList.remove('is-on'); cur = null; cancelAnimationFrame(raf); raf = 0; });
  }

  /* =========================================================
     STICKER FACE
     Five moods. Stickers stick to the two cheeks and the chin
     only. Each zone knows which way that part of the face is
     turned, so a sticker lies along it (rotated, and squashed
     where the cheek turns away). The sticker layer is masked by
     the skin, so anything past the edge of the face is cut off.
     A sticker remembers its spot inside its zone, so it follows
     the face to every angle; on angles where that side of the
     face is hidden, it hides too.
     Zones: [centre x, centre y, radius x, radius y, angle (rad)]
     in the 400 × 400 face images.
     ========================================================= */
  const CELL = 900;
  const POSES = [
    { label: 'Smile', z: { cheekL: [368, 660, 60, 30, 0], cheekR: [561, 662, 55, 30, 0], chin: [460, 712, 52, 18, 0] } },
    { label: 'Sleep mask', z: { cheekL: [368, 640, 50, 24, 0], cheekR: [548, 642, 46, 24, 0], chin: [455, 700, 45, 18, 0] } },
    { label: 'Side glance', z: { cheekL: [507, 592, 55, 28, -.25], cheekR: [674, 540, 22, 18, -.3], chin: [615, 632, 45, 18, -.2] } },
    { label: 'Wink', z: { cheekL: [408, 638, 58, 26, .05], cheekR: [586, 646, 34, 24, .1], chin: [495, 700, 42, 17, .05] } },
    { label: 'Grumpy', z: { cheekL: [369, 650, 58, 26, 0], cheekR: [560, 653, 50, 26, 0], chin: [457, 697, 45, 18, 0] } }
  ];
  const ZONE_NAMES = { cheekL: 'cheek', cheekR: 'cheek', chin: 'chin' };
  const NN = (i) => String(i + 1).padStart(2, '0');
  const FACE_SRC = (i) => D.asset(`assets/face/hd-${NN(i)}.png`);
  const MASK_SRC = (i) => D.asset(`assets/face/hdmask-${NN(i)}.png`);
  const STICKERS = [
    ['a-01', 'strawberry'], ['a-02', 'heart'], ['a-03', 'black cat'], ['a-04', '"babe" crown'], ['a-05', 'all-seeing eye'],
    ['a-06', 'gold sparkle'], ['a-07', 'red flower'], ['a-08', 'green sprig'], ['a-09', '"important" label'], ['a-10', 'purple arrow'],
    ['a-11', 'monstera leaf'], ['a-12', '"nice work!" badge'], ['a-13', 'cactus'], ['a-14', 'purple car'], ['a-15', 'blue sparkles'],
    ['a-16', 'round glasses'], ['b-01', 'paper fan'], ['b-02', 'yellow fox mask'], ['b-03', 'white cat mask'], ['b-04', 'daruma'],
    ['c-01', 'sushi roll'], ['c-02', 'tengu mask'], ['c-03', 'cherry blossom'], ['c-04', 'omamori charm'], ['c-05', 'lucky cat'], ['c-06', 'paper lantern']
  ];
  const SRC = (k) => D.asset(`assets/stickers/${k}.png`);
  const NAME = Object.fromEntries(STICKERS);
  const BASE = 6.5;        // sticker width, % of the board
  const MAX = 24;

  const canvas = $('#faceCanvas'), sheet = $('#sheet'), count = $('#faceCount');
  const posesEl = $('#facePoses'), layer = $('#faceStickers'), ui = $('#faceUi'), zonesEl = $('#faceZones');
  const hint = $('#faceHint'), anglesEl = $('#angles'), board = $('#faceBoard');

  posesEl.innerHTML = POSES.map((p, i) => `<img class="face__pose" src="${FACE_SRC(i)}" alt="Illustrated face, ${p.label.toLowerCase()}" draggable="false" ${i ? 'loading="lazy"' : ''} />`).join('');
  anglesEl.innerHTML = POSES.map((p, i) => `<button aria-pressed="false" data-i="${i}" title="${p.label}" aria-label="${p.label}"><img src="${FACE_SRC(i)}" alt="" loading="lazy" /></button>`).join('');
  sheet.innerHTML = STICKERS.map(([k, n]) => `<button class="stk" data-k="${k}" aria-label="Add the ${n} sticker" data-cursor="Drag me"><img src="${SRC(k)}" alt="" loading="lazy" draggable="false" /></button>`).join('');

  const KEY = 'dlsnl-face-v4';
  let state = { pose: 0, items: [] };
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && Array.isArray(s.items)) state = s; } catch (e) {}
  let selected = null;
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    const n = state.items.length; count.textContent = `${n} sticker${n === 1 ? '' : 's'}`;
  };
  const showHint = (msg) => { hint.textContent = msg; hint.classList.add('is-on'); clearTimeout(showHint.t); showHint.t = setTimeout(() => hint.classList.remove('is-on'), 2400); };

  // ---- geometry ----
  const Z = (zone, pose = state.pose) => POSES[pose].z[zone];
  const squash = (z) => Math.max(.55, Math.min(1, z[2] / 58));   // narrow zone = cheek turned away
  const toCell = (cx, cy) => { const r = canvas.getBoundingClientRect(); return { x: (cx - r.left) / r.width * CELL, y: (cy - r.top) / r.height * CELL, inside: cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom, r }; };
  function nearestZone(x, y, pose = state.pose) {
    let best = null;
    for (const [zone, z] of Object.entries(POSES[pose].z)) {
      const [cx, cy, rx, ry, a] = z, c = Math.cos(-a), s = Math.sin(-a);
      const dx = x - cx, dy = y - cy, lx = (dx * c - dy * s) / rx, ly = (dx * s + dy * c) / ry;
      const dn = Math.hypot(lx, ly);
      if (!best || dn < best.dn) best = { zone, dn, u: lx, v: ly };
    }
    if (!best || best.dn > 1.8) return null;
    if (best.dn > 1) { best.u /= best.dn; best.v /= best.dn; }
    return best;
  }
  function geom(it, pose = state.pose) {
    const z = Z(it.zone, pose); if (!z) return null;
    const [cx, cy, rx, ry, a] = z, c = Math.cos(a), s = Math.sin(a);
    const lx = it.u * rx, ly = it.v * ry;
    return { x: (cx + lx * c - ly * s) / CELL * 100, y: (cy + lx * s + ly * c) / CELL * 100, rot: a * 180 / Math.PI + it.r, sx: squash(z), w: BASE * it.s };
  }

  // ---- rendering ----
  const elOf = (it) => layer.querySelector(`.placed[data-id="${it.id}"]`);
  function paint(it, el = elOf(it)) {
    if (!el) return;
    const g = geom(it);
    el.classList.toggle('is-away', !g);
    if (!g) return;
    Object.assign(el.style, { left: g.x + '%', top: g.y + '%', width: g.w + '%', transform: `translate(-50%,-50%) rotate(${g.rot}deg) scaleX(${g.sx})` });
    if (selected === it) paintSel();
  }
  function placeEl(it, pop) {
    const el = document.createElement('div');
    el.className = 'placed'; el.dataset.id = it.id;
    el.innerHTML = `<img src="${SRC(it.k)}" alt="${NAME[it.k] || 'sticker'} on the ${ZONE_NAMES[it.zone]}" draggable="false" />`;
    layer.appendChild(el); paint(it, el);
    if (pop && !reduce) el.animate([{ scale: '2.2', opacity: 0 }, { scale: '.9', opacity: 1, offset: .7 }, { scale: '1' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
    return el;
  }
  function addSticker(k, hit) {
    if (state.items.length >= MAX) { showHint('That’s plenty. Peel one off to add another.'); return null; }
    const it = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), k, zone: hit.zone, u: +hit.u.toFixed(3), v: +hit.v.toFixed(3), r: Math.round(Math.random() * 30 - 15), s: 1 };
    state.items.push(it); placeEl(it, true); save(); select(it);
    return it;
  }
  function removeSticker(it) {
    state.items = state.items.filter((q) => q !== it); save();
    const el = elOf(it); if (selected === it) select(null);
    if (!el) return;
    if (reduce) return el.remove();
    el.animate([{ opacity: 1 }, { opacity: 0, translate: '0 -18px', rotate: '40deg' }], { duration: 320, easing: 'ease-in' }).onfinish = () => el.remove();
  }
  function randomHit() {
    const zs = Object.keys(POSES[state.pose].z), zone = zs[Math.floor(Math.random() * zs.length)];
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * .6;
    return { zone, u: Math.cos(a) * r, v: Math.sin(a) * r };
  }

  // ---- selection: a ring with a turn/size handle and a remove handle ----
  ui.innerHTML = `<div class="sel" id="sel" hidden>
      <button class="sel__h sel__h--t" id="selTurn" aria-label="Drag to turn and resize the sticker"><svg viewBox="0 0 12 12"><path d="M2 6a4 4 0 1 0 1.2-2.8M2 1.5v2.2h2.2"/></svg></button>
      <button class="sel__h sel__h--x" id="selDel" aria-label="Remove the sticker"><svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6"/></svg></button>
    </div>`;
  const sel = $('#sel'), selTurn = $('#selTurn'), selDel = $('#selDel');
  function paintSel() {
    const it = selected, g = it && geom(it);
    if (!g) { sel.hidden = true; return; }
    sel.hidden = false;
    const d = g.w * 1.55;
    Object.assign(sel.style, { left: `calc(${g.x}% - ${d / 2}%)`, top: `calc(${g.y}% - ${d / 2}%)`, width: d + '%', height: d + '%' });
    const a = (g.rot + 45) * Math.PI / 180, b = (g.rot - 45) * Math.PI / 180;
    Object.assign(selTurn.style, { left: (50 + Math.cos(a) * 50) + '%', top: (50 + Math.sin(a) * 50) + '%' });
    Object.assign(selDel.style, { left: (50 + Math.cos(b) * 50) + '%', top: (50 + Math.sin(b) * 50) + '%' });
  }
  function select(it) { selected = it; paintSel(); }
  selDel.addEventListener('click', (e) => { e.stopPropagation(); if (selected) removeSticker(selected); });
  selTurn.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation();
    const it = selected; if (!it) return;
    selTurn.setPointerCapture(e.pointerId);
    const g = geom(it), r = canvas.getBoundingClientRect();
    const cx = r.left + g.x / 100 * r.width, cy = r.top + g.y / 100 * r.height;
    const a0 = Math.atan2(e.clientY - cy, e.clientX - cx), d0 = Math.hypot(e.clientX - cx, e.clientY - cy), r0 = it.r, s0 = it.s;
    const move = (ev) => {
      const a = Math.atan2(ev.clientY - cy, ev.clientX - cx), d = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      it.r = Math.round(r0 + (a - a0) * 180 / Math.PI);
      it.s = +Math.max(.5, Math.min(2.6, s0 * d / (d0 || 1))).toFixed(2);
      paint(it);
    };
    const up = () => { selTurn.removeEventListener('pointermove', move); selTurn.removeEventListener('pointerup', up); save(); };
    selTurn.addEventListener('pointermove', move); selTurn.addEventListener('pointerup', up);
  });

  // ---- hit test (the sticker layer itself ignores the pointer) ----
  function hit(cx, cy) {
    const r = canvas.getBoundingClientRect();
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i], g = geom(it); if (!g) continue;
      const x = r.left + g.x / 100 * r.width, y = r.top + g.y / 100 * r.height, rad = g.w / 100 * r.width * .55;
      if (Math.hypot(cx - x, cy - y) < rad) return it;
    }
    return null;
  }

  // ---- drag on the board: move a sticker, or deselect ----
  const dragging = (on) => { board.classList.toggle('is-dragging', on); on ? (D.lenis && D.lenis.stop()) : (D.lenis && D.lenis.start()); if (!on) hotZone(null); };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sel__h')) return;
    const it = hit(e.clientX, e.clientY);
    if (!it) { select(null); return; }
    e.preventDefault(); select(it);
    canvas.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY; let moved = false;
    const el = elOf(it);
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
      if (!moved) { moved = true; dragging(true); el.style.transition = 'none'; }
      const c = toCell(ev.clientX, ev.clientY);
      const z = c.inside ? nearestZone(c.x, c.y) : null;
      hotZone(z && z.zone);
      Object.assign(el.style, { left: c.x / CELL * 100 + '%', top: c.y / CELL * 100 + '%' });
      sel.hidden = true;
    };
    const up = (ev) => {
      canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      el.style.transition = '';
      if (!moved) return;
      dragging(false);
      const c = toCell(ev.clientX, ev.clientY), z = c.inside ? nearestZone(c.x, c.y) : null;
      if (!z) { removeSticker(it); return; }      // dragged off the face: peeled
      Object.assign(it, { zone: z.zone, u: +z.u.toFixed(3), v: +z.v.toFixed(3) }); paint(it); save();
    };
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  });
  canvas.addEventListener('dblclick', (e) => { const it = hit(e.clientX, e.clientY); if (it) removeSticker(it); });
  // wheel over a sticker resizes it
  canvas.addEventListener('wheel', (e) => {
    const it = hit(e.clientX, e.clientY) || (selected && hit(e.clientX, e.clientY) === selected ? selected : null);
    if (!it) return;
    e.preventDefault(); e.stopPropagation();
    it.s = +Math.max(.5, Math.min(2.6, it.s * (1 - e.deltaY * .0015))).toFixed(2);
    select(it); paint(it); clearTimeout(save.t); save.t = setTimeout(save, 200);
  }, { passive: false });
  // keyboard: [ ] turn, - + size, Delete removes
  addEventListener('keydown', (e) => {
    if (!selected || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    const it = selected; let used = true;
    if (e.key === '[') it.r -= 8; else if (e.key === ']') it.r += 8;
    else if (e.key === '-' || e.key === '_') it.s = Math.max(.5, +(it.s - .1).toFixed(2));
    else if (e.key === '=' || e.key === '+') it.s = Math.min(2.6, +(it.s + .1).toFixed(2));
    else if (e.key === 'Delete' || e.key === 'Backspace') { removeSticker(it); }
    else if (e.key === 'Escape') select(null);
    else used = false;
    if (used) { e.preventDefault(); if (selected) paint(selected); save(); }
  });

  // ---- zones (shown while dragging) ----
  function layoutZones() {
    zonesEl.innerHTML = Object.entries(POSES[state.pose].z).map(([zone, [cx, cy, rx, ry, a]]) =>
      `<i class="zone" data-z="${zone}" style="left:${cx / CELL * 100}%;top:${cy / CELL * 100}%;width:${rx * 2 / CELL * 100}%;height:${ry * 2 / CELL * 100}%;--r:${a}rad"></i>`).join('');
  }
  function hotZone(z) { $$('.zone', zonesEl).forEach((el) => el.classList.toggle('is-hot', el.dataset.z === z)); }

  // ---- angles ----
  function setPose(i, instant) {
    state.pose = i; save();
    $$('.face__pose', posesEl).forEach((img, j) => {
      const on = j === i;
      if (hasG && !instant && !reduce) gsap.to(img, { opacity: on ? 1 : 0, duration: .4, ease: 'power2.out' });
      else img.style.opacity = on ? 1 : 0;
    });
    const m = `url(${MASK_SRC(i)})`;
    layer.style.webkitMaskImage = m; layer.style.maskImage = m;
    $$('button', anglesEl).forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    layoutZones();
    state.items.forEach((it) => paint(it));
    paintSel();
  }
  anglesEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setPose(+b.dataset.i); });

  // ---- drag a new sticker off the sheet ----
  sheet.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.stk'); if (!b || e.button > 0) return;
    const k = b.dataset.k, sx = e.clientX, sy = e.clientY;
    let ghost = null, started = false;
    const move = (ev) => {
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
        started = true; dragging(true);
        ghost = document.createElement('div'); ghost.className = 'ghost'; ghost.innerHTML = `<img src="${SRC(k)}" alt="" />`;
        document.body.appendChild(ghost);
      }
      if (!started) return;
      ev.preventDefault();
      ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
      const c = toCell(ev.clientX, ev.clientY), z = c.inside ? nearestZone(c.x, c.y) : null;
      hotZone(z && z.zone);
      // the ghost shrinks to its true size over the face
      const s = c.inside ? (BASE / 100 * c.r.width) / 54 : 1;
      ghost.style.transform = `scale(${s}) rotate(${(ev.clientX - sx) * .04}deg)`;
    };
    const up = (ev) => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (!started) { addSticker(k, randomHit()); return; }
      dragging(false);
      const c = toCell(ev.clientX, ev.clientY), z = c.inside ? nearestZone(c.x, c.y) : null;
      if (z && addSticker(k, z)) { ghost.remove(); return; }
      if (c.inside) showHint('Stickers only stick to the cheeks and chin.');
      const r = b.getBoundingClientRect();
      if (hasG && !reduce) gsap.to(ghost, { left: r.left + r.width / 2, top: r.top + r.height / 2, opacity: 0, duration: .4, ease: 'power3.in', onComplete: () => ghost.remove() });
      else ghost.remove();
    };
    addEventListener('pointermove', move, { passive: false }); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
  sheet.addEventListener('keydown', (e) => {
    const b = e.target.closest('.stk'); if (!b || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault(); addSticker(b.dataset.k, randomHit());
  });

  // ---- boot ----
  if (/[?&]zones/.test(location.search)) board.classList.add('show-zones');
  state.items = state.items.filter((it) => NAME[it.k] && ['cheekL', 'cheekR', 'chin'].includes(it.zone));
  setPose(Math.min(POSES.length - 1, state.pose || 0), true);
  state.items.forEach((it) => placeEl(it, false));
  save();
  $('#faceReset').addEventListener('click', () => { [...state.items].forEach(removeSticker); select(null); });

  /* ---------- download: the face with its stickers, signed ---------- */
  const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  async function exportCard(word) {
    // A die-cut sticker: the decorated face, the studio logo (or the visitor's
    // word) underneath, one thick white border around both, a soft shadow,
    // on a transparent background.
    const W = 1250, H = 1250;
    const art = document.createElement('canvas'); art.width = W; art.height = H;
    const x = art.getContext('2d');
    const F = 900, fx = (W - F) / 2, fy = 30;
    const face = await loadImg(FACE_SRC(state.pose)), mask = await loadImg(MASK_SRC(state.pose));
    x.drawImage(face, fx, fy, F, F);
    // stickers on their own layer, cut by the skin
    const sl = document.createElement('canvas'); sl.width = F; sl.height = F; const sx = sl.getContext('2d');
    for (const it of state.items) {
      const g = geom(it); if (!g) continue;
      const im = await loadImg(SRC(it.k));
      const box = g.w / 100 * F, k = Math.min(box / im.width, box / im.height), w = im.width * k, h = im.height * k;
      sx.save(); sx.translate(g.x / 100 * F, g.y / 100 * F); sx.rotate(g.rot * Math.PI / 180); sx.scale(g.sx, 1);
      sx.shadowColor = 'rgba(0,0,0,.35)'; sx.shadowBlur = 3; sx.shadowOffsetY = 2;
      sx.drawImage(im, -w / 2, -h / 2, w, h); sx.restore();
    }
    sx.globalCompositeOperation = 'destination-in'; sx.drawImage(mask, 0, 0, F, F);
    x.drawImage(sl, fx, fy);
    // the signature, tucked under the chin
    const sigTop = fy + F * .84;
    if (word) {
      await document.fonts.load('150px Shrikhand');
      let size = 190; x.font = `${size}px Shrikhand`;
      while (x.measureText(word).width > W * .78 && size > 60) { size -= 6; x.font = `${size}px Shrikhand`; }
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = '#4A14B8'; x.fillText(word, W / 2, sigTop + size * .62);
    } else {
      const vio = await D.logoURL('violet');
      if (vio) {
        const lv = await loadImg(vio);
        const h = 420, w = lv.width * h / lv.height;
        x.drawImage(lv, W / 2 - w / 2, sigTop - 10, w, h);
      }
    }
    // the studio tag, fixed at the top right, like a label on the sticker's edge
    await document.fonts.load('60px Shrikhand');
    x.save(); x.translate(fx + F * .775, fy + F * .2); x.rotate(48 * Math.PI / 180);
    x.font = '40px Shrikhand';
    const tag = 'Dlsnl Sloth', tw = x.measureText(tag).width, ph = 66, pw = tw + 98;
    x.beginPath(); x.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
    x.fillStyle = '#FFF4EA'; x.fill();
    x.lineWidth = 2; x.strokeStyle = 'rgba(74, 20, 184, .18)'; x.stroke();
    x.fillStyle = '#4A14B8'; x.textAlign = 'left'; x.textBaseline = 'middle';
    x.fillText(tag, -pw / 2 + 66, 4);
    x.save(); x.translate(-pw / 2 + 24, -13); x.scale(.26, .26); x.fill(new Path2D(D.STAR)); x.restore();
    x.restore();
    // the white die-cut border: the artwork's silhouette, grown outward
    const sil = document.createElement('canvas'); sil.width = W; sil.height = H; const sc = sil.getContext('2d');
    sc.drawImage(art, 0, 0); sc.globalCompositeOperation = 'source-in'; sc.fillStyle = '#fff'; sc.fillRect(0, 0, W, H);
    const border = document.createElement('canvas'); border.width = W; border.height = H; const bc = border.getContext('2d');
    for (const r of [10, 20, 28]) for (let a = 0; a < Math.PI * 2; a += Math.PI / 20) bc.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r);
    // final: soft shadow, white border, artwork
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const out = cv.getContext('2d');
    out.save(); out.shadowColor = 'rgba(20, 10, 40, .22)'; out.shadowBlur = 26; out.shadowOffsetY = 10; out.drawImage(border, 0, 0); out.restore();
    out.drawImage(border, 0, 0);
    out.drawImage(art, 0, 0);
    return cv;
  }
  function swirl(W, H) {
    // marbled bands that pour out from behind the sticker, in the studio's purples, pinks and oranges
    const w = W / 4 | 0, h = H / 4 | 0, small = document.createElement('canvas'); small.width = w; small.height = h;
    const sc = small.getContext('2d'), id = sc.createImageData(w, h), d = id.data;
    const PAL = ['#3A0E5E', '#6B1F93', '#B4318F', '#EE6DAE', '#F47B22', '#F9C99A', '#C08BE6', '#5B1A86'].map((c) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16)));
    const r1 = Math.random() * 6.28, r2 = Math.random() * 6.28, r3 = Math.random() * 6.28, rays = 7 + (Math.random() * 4 | 0);
    const ss = (e0, e1, t) => { t = Math.max(0, Math.min(1, (t - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    for (let y = 0; y < h; y++) for (let x0 = 0; x0 < w; x0++) {
      const nx = (x0 - w / 2) / w, ny = (y - h * .46) / w, r = Math.hypot(nx, ny), a = Math.atan2(ny, nx);
      let v = a / (Math.PI * 2) * rays + Math.sin(r * 6 - a * 3 + r1) * .55 * Math.min(1, r * 3)
        + Math.sin(nx * 3.2 + Math.sin(ny * 2.8 + r2) * 1.6) * .3
        + Math.sin(ny * 3.6 + Math.cos(nx * 2.6 + r3) * 1.5) * .26 + r * 1.1;
      v -= Math.floor(v);
      const k = v * PAL.length, i = k | 0, t = ss(.32, .68, k - i), A = PAL[i], B = PAL[(i + 1) % PAL.length], o = (y * w + x0) * 4;
      d[o] = A[0] + (B[0] - A[0]) * t; d[o + 1] = A[1] + (B[1] - A[1]) * t; d[o + 2] = A[2] + (B[2] - A[2]) * t; d[o + 3] = 255;
    }
    sc.putImageData(id, 0, 0);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    c.imageSmoothingQuality = 'high'; c.drawImage(small, 0, 0, W, H);
    // painted grain
    const g = c.getImageData(0, 0, W, H), gd = g.data;
    for (let i = 0; i < gd.length; i += 4) { const n = (Math.random() - .5) * 22; gd[i] += n; gd[i + 1] += n; gd[i + 2] += n; }
    c.putImageData(g, 0, 0);
    // a soft dark edge, so the sticker reads first
    const vg = c.createRadialGradient(W / 2, H * .46, W * .3, W / 2, H * .5, H * .75);
    vg.addColorStop(0, 'rgba(30, 6, 50, 0)'); vg.addColorStop(1, 'rgba(30, 6, 50, .45)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    // four-point stars, kept out of the sticker's way
    const star = new Path2D(D.STAR);
    for (let n = 0, tries = 0; n < 16 && tries < 400; tries++) {
      const sx = Math.random() * W, sy = Math.random() * H, sz = 18 + Math.random() * (n < 5 ? 70 : 34);
      if (Math.abs(sx - W / 2) < W * .46 && Math.abs(sy - H * .46) < W * .5) continue;
      c.save(); c.translate(sx, sy); c.scale(sz / 100, sz / 100); c.translate(-50, -50);
      c.globalAlpha = .75 + Math.random() * .25; c.fillStyle = Math.random() < .8 ? '#FAD7A6' : '#FFB36B';
      c.shadowColor = 'rgba(255, 220, 170, .6)'; c.shadowBlur = 30; c.fill(star); c.restore(); n++;
    }
    return cv;
  }
  async function exportWallpaper(word) {
    const W = 1080, H = 1920, cv = swirl(W, H), c = cv.getContext('2d');
    const stk = await exportCard(word), S = W * .98;
    c.save(); c.shadowColor = 'rgba(20, 0, 40, .45)'; c.shadowBlur = 50; c.shadowOffsetY = 18;
    c.drawImage(stk, (W - S) / 2, H * .46 - S / 2, S, S); c.restore();
    return cv;
  }
  window.DLSNL.exportCard = exportCard; // handy for testing the download
  window.DLSNL.exportWallpaper = exportWallpaper;
  const keep = $('#keep'), keepWord = $('#keepWord'), keepHint = $('#keepHint');
  keepWord.addEventListener('input', () => { keepWord.value = keepWord.value.replace(/[^A-Za-z]/g, '').slice(0, 10); });
  keep.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = keepWord.value.trim();
    const btn = keep.querySelector('button'); btn.disabled = true; btn.textContent = 'Making…';
    try {
      const cv = await exportWallpaper(word);
      const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `dlsnl-wallpaper-${(word || 'sloth').toLowerCase()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      keepHint.textContent = 'Saved. Show me on Instagram @delusion_art_studio.';
      const r = btn.getBoundingClientRect(); D.sparks(r.left + r.width / 2, r.top + r.height / 2, 14, 80);
    } catch (err) {
      keepHint.textContent = 'That didn’t work. Try again, or try a shorter word.';
    }
    btn.disabled = false; btn.textContent = 'Download';
  });

  /* =========================================================
     CONTACT, hold to manifest
     ========================================================= */
  let subject = 'A brand identity';
  $$('#chips button').forEach((b) => b.addEventListener('click', () => {
    $$('#chips button').forEach((x) => x.setAttribute('aria-checked', 'false'));
    b.setAttribute('aria-checked', 'true'); subject = b.dataset.subject;
    $('#manifestEmail').href = `mailto:${D.EMAIL}?subject=${encodeURIComponent(subject)}`;
  }));
  $('#manifestEmail').href = `mailto:${D.EMAIL}?subject=${encodeURIComponent(subject)}`;

  const mBtn = $('#manifestBtn'), fill = $('#manifestFill'), mLabel = $('#manifestLabel');
  const mStar = $('.manifest__star', mBtn);
  let holdTw = null, manifested = false;
  function burst() {
    const r = mBtn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      s.style.background = D.IRI[i % D.IRI.length];
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 220;
      if (hasG) gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, rotate: Math.random() * 360, scale: .4 + Math.random() * 1.4, opacity: 0, duration: 1 + Math.random() * .6, ease: 'expo.out', onComplete: () => s.remove() });
      else setTimeout(() => s.remove(), 50);
    }
  }
  function complete() {
    manifested = true; burst(); mBtn.classList.add('is-done');
    mLabel.textContent = 'Manifested';
    const res = $('#manifestResult'); res.hidden = false;
    $('.manifest__hint').hidden = true;
    if (hasG && !reduce) gsap.from(res, { y: 30, opacity: 0, duration: .8, ease: 'expo.out' });
    const cta = $('#manifestEmail'); if (hasG && !reduce) gsap.from(cta, { scale: .8, duration: 1, ease: 'elastic.out(1, .5)' });
  }
  // while held: the glow heats up, the orbits race, and sparks stream into the star
  let inflow = null;
  const heat = { v: 0 };
  const setHeat = () => mBtn.style.setProperty('--heat', heat.v.toFixed(3));
  function streamIn() {
    const r = mBtn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      const a = Math.random() * Math.PI * 2, d = 160 + Math.random() * 140, size = 5 + Math.random() * 8;
      Object.assign(s.style, { left: cx + Math.cos(a) * d + 'px', top: cy + Math.sin(a) * d + 'px', width: size + 'px', height: size + 'px', background: D.IRI[(Math.random() * D.IRI.length) | 0] });
      document.body.appendChild(s);
      gsap.to(s, { left: cx, top: cy, rotate: 180, scale: .2, opacity: .2, duration: .55 + Math.random() * .3, ease: 'power2.in', onComplete: () => s.remove() });
    }
  }
  function startHold() {
    if (manifested) return;
    mLabel.textContent = 'Manifesting…';
    if (!hasG || reduce) return complete();
    holdTw && holdTw.kill();
    mBtn.classList.add('is-holding');
    clearInterval(inflow); inflow = setInterval(streamIn, 70);
    holdTw = gsap.timeline({ onComplete: () => { clearInterval(inflow); mBtn.classList.remove('is-holding'); gsap.to(heat, { v: 0, duration: 1.2, onUpdate: setHeat }); complete(); } })
      .to(fill, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.in' }, 0)
      .to(heat, { v: 1, duration: 1.6, ease: 'power1.in', onUpdate: setHeat }, 0)
      .to(mStar, { rotate: 360, scale: 1.3, duration: 1.6, ease: 'power2.in' }, 0)
      .to(mBtn, { x: () => gsap.utils.random(-2, 2), duration: .05, repeat: 19, yoyo: true, ease: 'none' }, .6);
  }
  function stopHold() {
    if (manifested || !holdTw) return;
    holdTw.kill(); holdTw = null; mLabel.textContent = 'Hold to manifest';
    clearInterval(inflow); mBtn.classList.remove('is-holding');
    gsap.to(heat, { v: 0, duration: .5, onUpdate: setHeat });
    gsap.to(fill, { strokeDashoffset: 591, duration: .5, ease: 'power2.out' });
    gsap.to(mStar, { rotate: 0, scale: 1, duration: .6, ease: 'back.out(2)' });
    gsap.to(mBtn, { x: 0, duration: .2 });
  }
  mBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); startHold(); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => mBtn.addEventListener(ev, stopHold));
  mBtn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); } });
  mBtn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stopHold(); });
  mBtn.addEventListener('contextmenu', (e) => e.preventDefault());

  /* =========================================================
     RIBBON, one thin pastel strand, pulled out of the hero star. (Was: a tilted orbit
     around the hero star (dim on the far side, bright on the
     near side, so it reads as a ring), then leaves the orbit and
     flows down the side gutters, crossing the page only in the
     gaps between sections. It draws itself as you scroll; a
     small sparkle rides the tip. Two fixed canvases, redrawn
     for the viewport only.
     ========================================================= */
  const rbBack = $('#ribbonBack'), rbFront = $('#ribbonFront');
  const bctx = rbBack.getContext('2d'), fctx = rbFront.getContext('2d');
  let RB = null, rbIntro = 0, rbDpr = 1, rbPhase = 0, rbComet = 0, rbFlow = 1, rbT = 0, rbVel = 0;
  if (D.lenis) D.lenis.on('scroll', ({ velocity }) => { rbVel = velocity; });

  const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const PAL = D.IRI.map(hexRgb);
  function iriAt(u) {
    const n = PAL.length, f = ((u % 1) + 1) % 1 * n, i = Math.floor(f), t = f - i;
    const a = PAL[i], b = PAL[(i + 1) % n];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t].map(Math.round);
  }
  function sizeRibbon() {
    rbDpr = Math.min(2, devicePixelRatio || 1);
    [rbBack, rbFront].forEach((c) => { c.width = innerWidth * rbDpr; c.height = innerHeight * rbDpr; });
  }

  function buildRibbon() {
    const w = document.documentElement.clientWidth;
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    D.lenis && D.lenis.resize();
    measureStar();

    // The strand starts inside the star and is pulled out of it: a tapered,
    // liquid thread that leaves the star, then runs down the page gutters.
    const cx = heroBox.x, cy = heroBox.y, S = heroBox.size;
    const m = w < 700 ? 8 : Math.min(30, w * .018), L = m, R = w - m;
    const sec = parseFloat(getComputedStyle($('.work')).paddingTop) || 160;
    const span = Math.max(sec, w * .42);
    const way = [
      [cx + S * .05, cy + S * .04],
      [R, top($('.hero__base')) + 40],
      [R, top($('.brands')) - 4],
      [L, top($('.work')) + span * .7],
      [L, top($('.work__foot')) + 40],
      [R, top($('.face')) + span * .8],
      [L, top($('.me')) - 40],
      [R, top($('.me')) + span * .8],
      [R, top($('.me__block')) + 60],
      [L, top($('.contact')) + 20],
      [w * .5, top($('.contact')) + sec - 40]
    ];
    for (let i = 2; i < way.length; i++) way[i][1] = Math.max(way[i][1], way[i - 1][1] + 80);
    let d = `M${way[0][0]} ${way[0][1]}`;
    for (let i = 1; i < way.length; i++) {
      const [ax, ay] = way[i - 1], [bx, by] = way[i], dy = (by - ay) * .5;
      // the first curve leaves the star sideways, like a thread being drawn out
      const c1 = i === 1 ? [ax + (bx - ax) * .55, ay + S * .08] : [ax, ay + dy];
      const c2 = i === 1 ? [bx, ay + (by - ay) * .35] : [bx, by - dy];
      d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${bx} ${by}`;
    }
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tmp.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
    const tp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tp.setAttribute('d', d); tmp.appendChild(tp); document.body.appendChild(tmp);
    const len = tp.getTotalLength();
    const pts = [];
    for (let l = 0; l <= len; l += 4) { const p = tp.getPointAtLength(l); pts.push([p.x, p.y]); }
    tmp.remove();

    const n = pts.length;
    const o = { n, x: new Float32Array(n), y: new Float32Array(n), s: new Float32Array(n), col: new Array(n) };
    let s = 0, pullCount = n - 1;
    for (let i = 0; i < n; i++) {
      if (i) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      o.x[i] = pts[i][0]; o.y[i] = pts[i][1]; o.s[i] = s;
      o.col[i] = iriAt(s / 1800 + .1);
      if (pullCount === n - 1 && pts[i][1] >= way[1][1] - 1 && pts[i][0] >= way[1][0] - 2) pullCount = i;
    }
    o.total = s; o.pullCount = pullCount; o.pullLen = o.s[pullCount]; o.starR = S * .5;
    RB = o; drawRibbon();
  }

  function lengthAtScroll() {
    if (!RB) return 0;
    const target = scrollY + innerHeight * .62;
    let lo = RB.pullCount, hi = RB.n - 1;
    if (RB.y[lo] >= target) return 0;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (RB.y[mid] < target) lo = mid; else hi = mid; }
    return RB.s[lo];
  }

  function drawTip(ctx, x, y, r, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.shadowColor = 'rgba(207,195,255,.9)'; ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * .12, -r * .12, r, 0); ctx.quadraticCurveTo(r * .12, r * .12, 0, r);
    ctx.quadraticCurveTo(-r * .12, r * .12, -r, 0); ctx.quadraticCurveTo(-r * .12, -r * .12, 0, -r); ctx.closePath();
    ctx.fillStyle = '#F4F1FF'; ctx.fill(); ctx.restore();
  }

  // the gutter run drifts very gently, and leans a little with scroll speed
  function wx(i) {
    if (i < RB.pullCount) return RB.x[i];
    const ramp = Math.min(1, (i - RB.pullCount) / 60), y = RB.y[i];
    const amp = innerWidth < 700 ? 2 : 5;
    const wave = Math.sin(y * .0022 + rbT * .3) * amp;
    const bend = Math.max(-10, Math.min(10, rbVel * .6)) * Math.sin(Math.max(0, Math.min(1, (y - scrollY) / innerHeight)) * Math.PI);
    return RB.x[i] + (wave + bend) * ramp;
  }
  function drawRibbon() {
    if (!RB) return;
    // nothing until the first scroll; then the thread is pulled out of the star
    // over the first half-screen of scrolling, and follows the scroll after that
    const pulled = Math.min(1, scrollY / (innerHeight * .45));
    const show = reduce ? RB.total : Math.min(RB.total, Math.max(pulled * RB.pullLen, pulled >= 1 ? lengthAtScroll() : 0));
    if (show <= 0) { bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.clearRect(0, 0, rbBack.width, rbBack.height); fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, rbFront.width, rbFront.height); return; }
    const top = scrollY, bot = scrollY + innerHeight;
    const heroFade = Math.max(0, 1 - scrollY / ((hero.offsetHeight || innerHeight) * .7));
    fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, rbFront.width, rbFront.height);
    const c = bctx;
    c.setTransform(rbDpr, 0, 0, rbDpr, 0, -scrollY * rbDpr); c.clearRect(0, top, innerWidth, innerHeight); c.lineCap = 'round'; c.lineJoin = 'round';
    let tip = -1;
    for (const pass of [0, 1]) {
      for (let i = 0; i < RB.n - 1; i++) {
        if (RB.s[i] > show) break;
        if (pass) tip = i;
        const ya = RB.y[i], yb = RB.y[i + 1];
        if ((ya < top - 40 && yb < top - 40) || (ya > bot + 40 && yb > bot + 40)) continue;
        let a = .7, width = 1;
        if (i < RB.pullCount) {
          // the pulled thread: it emerges from inside the star, swells at the neck
          // where it leaves the surface, then thins out
          const t = RB.s[i] / RB.pullLen;
          const dCentre = Math.hypot(RB.x[i] - RB.x[0], ya - RB.y[0]) / RB.starR;
          const emerge = Math.max(0, Math.min(1, (dCentre - .15) / .45));
          const neck = Math.exp(-Math.pow((dCentre - .95) / .22, 2));
          width = 1 + (1 - t) * 1.6 + neck * 2.2;
          a = (.25 + .6 * emerge) * (.35 + .65 * heroFade);
          if (i > RB.pullCount - 30) a = Math.max(a, .7 * (i - (RB.pullCount - 30)) / 30);
        }
        const [r, g, b] = RB.col[i];
        c.strokeStyle = `rgba(${r},${g},${b},${pass ? a : a * .08})`;
        c.lineWidth = pass ? width : width + 4;
        c.beginPath(); c.moveTo(wx(i), ya); c.lineTo(wx(i + 1), yb); c.stroke();
      }
    }
    if (tip > 2 && tip < RB.n - 2) {
      const y = RB.y[tip];
      if (y > top - 40 && y < bot + 40) {
        const x = wx(tip), [r, g, b] = RB.col[tip];
        const breathe = .5 + .5 * Math.sin(rbT * 2.6);
        const glow = c.createRadialGradient(x, y, 0, x, y, 18 + breathe * 6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${.45 + breathe * .2})`); glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        c.fillStyle = glow; c.beginPath(); c.arc(x, y, 24 + breathe * 6, 0, Math.PI * 2); c.fill();
        drawTip(c, x, y, 5 + breathe * 1.5, rbT * .4);
      }
    }
  }

  let rbLast = performance.now();
  (function flow(now) {
    const dt = Math.min(64, now - rbLast); rbLast = now;
    if (!reduce) rbT += dt / 1000;
    rbVel *= .96;
    if (RB && !reduce && !document.hidden) drawRibbon();
    requestAnimationFrame(flow);
  })(rbLast);

  function ribbonIntro() {
    if (!RB) return;
    if (reduce || !hasG) { rbIntro = RB.pullLen; drawRibbon(); return; }
    const o = { v: 0 };
    // drawn out of the star slowly at first, then released
    void o; // the strand now waits for the first scroll
  }

  let rbRaf = 0;
  addEventListener('scroll', () => { if (!rbRaf) rbRaf = requestAnimationFrame(() => { rbRaf = 0; drawRibbon(); }); }, { passive: true });
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { sizeRibbon(); buildRibbon(); }, 200); });
  if (hasG) ScrollTrigger.addEventListener('refresh', () => buildRibbon());
  addEventListener('load', () => { buildRibbon(); hasG && ScrollTrigger.refresh(); });
  sizeRibbon();

  /* =========================================================
     TRANSITIONS
     ========================================================= */
  if (hasG && !reduce) {
    // headings decode as they arrive
    $$('.work .h2, .face .h2, .me__quote, .contact__title').forEach((el) => {
      el.dataset.final = el.textContent;
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => D.scramble(el, { duration: 1.1 }) });
    });
    // images open from a slit as they enter
    // index rows rise in one by one
    gsap.from('#index .row', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '#index', start: 'top 80%' } });
    // cards and tiles lean with scroll speed, then settle
    const lean = gsap.utils.toArray('.row__main, .row__icon');
    const setters = lean.map((el) => gsap.quickTo(el, 'skewY', { duration: .6, ease: 'power3.out' }));
    // the brand loop runs faster (and backwards) with the scroll
    const track = $('#brands');
    let bx = 0, bdir = 1, bboost = 0;
    gsap.ticker.add(() => {
      const half = track.scrollWidth / 2 || 1;
      bx -= (.45 + bboost) * bdir; bboost *= .92;
      if (bx <= -half) bx += half; if (bx > 0) bx -= half;
      track.style.transform = `translate3d(${bx}px,0,0)`;
    });
    if (D.lenis) D.lenis.on('scroll', ({ velocity }) => {
      const v = Math.max(-4, Math.min(4, velocity * .12));
      setters.forEach((s) => s(v));
      bboost = Math.min(14, Math.abs(velocity) * .6); bdir = velocity < 0 ? -1 : 1;
    });
    // the traits and timeline rise in sequence
    gsap.from('.traits li', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '.traits', start: 'top 80%' } });
    gsap.from('.path li', { opacity: 0, filter: 'blur(8px)', clearProps: 'filter', duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.path', start: 'top 85%' } });
  }

  /* ---------- the logo mark in "why" breathes as it comes into view ---------- */
  if (hasG && !reduce) {
    gsap.from('.me__mark', { rotate: -10, scale: .8, ease: 'none', scrollTrigger: { trigger: '.me', start: 'top bottom', end: 'top 30%', scrub: true } });
    gsap.from('.contact__title', { yPercent: 30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
  }

  /* ---------- boot ---------- */
  D.tintLogo().then(() => hasG && ScrollTrigger.refresh());
  D.runLoader().then(heroIn);
})();
