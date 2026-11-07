/* Case study renderer — reads ?p=<slug> and builds the page from data/projects.js */
(function () {
  const F = window.FishArt;
  const P = window.PROJECTS || [];
  const slug = new URLSearchParams(location.search).get('p') || P[0].slug;
  const idx = Math.max(0, P.findIndex(p => p.slug === slug));
  const p = P[idx];
  const root = document.getElementById('case');
  document.title = `${p.title} — Case study · Arundhati Mitra`;
  document.querySelector('meta[name=description]').setAttribute('content', p.summary);
  document.documentElement.style.setProperty('--accent', p.accent);
  // Finished case studies hide their TO ADD notes; add ?todo=1 to the URL to see them again.
  if (p.ready && !/[?&]todo=1/.test(location.search)) document.body.classList.add('hide-todo');

  const todo = (items) => items && items.length ? `<div class="todo"><b>TO ADD</b><ul>${items.map(t => `<li>${t}</li>`).join('')}</ul></div>` : '';
  const ORN = ["hook-plain", "lemon-slice", "crate-persp", "lemon-peel", "fly-top", "lemon-wedges", "lemon-half", "fruitfly-top", "crate-lid"];
  const ink = (n, cls = "") => `<img class="ink ${cls}" src="assets/ink/${n}.png" alt="" loading="lazy" decoding="async">`;
  const sideLabel = (s, n) => `<div class="cs__side"><span class="label">${String(n).padStart(2, "0")} — ${s.label}${ink(ORN[(n - 1) % ORN.length], "cs__orn")}</span></div>`;

  /* ---------- section renderers ---------- */
  function gallery(s) {
    const many = s.media.length > 4;
    return `<div class="gallery ${many ? 'gallery--many' : ''}">${s.media.map((m, i) => `
      <figure class="rv"><div class="gallery__img" data-zoom="${m}" data-alt="${(s.captions || [])[i] || p.title}"><img src="${m}" alt="${(s.captions || [])[i] || p.title}" loading="lazy"></div>
      ${s.captions && s.captions[i] ? `<figcaption>${s.captions[i]}</figcaption>` : ''}</figure>`).join('')}</div>`;
  }
  function chartHerbius() {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct*'];
    const lib = [4, 7, 35, 43, 61, 12], oth = [9, 5, 3, 30, 15, 1];
    const W = 720, H = 300, padL = 34, padB = 28, padT = 26, max = 80;
    const bw = 58, gap = (W - padL - bw * months.length) / months.length;
    const y = v => H - padB - (v / max) * (H - padB - padT);
    const C_LIB = '#E3442E', C_OTH = '#655633';
    let grid = '', bars = '', axis = '';
    [0, 20, 40, 60, 80].forEach(v => { grid += `<line x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/>`; axis += `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; });
    months.forEach((m, i) => {
      const x = padL + gap / 2 + i * (bw + gap);
      const yl = y(lib[i]), yo = y(lib[i] + oth[i]);
      const hl = (H - padB) - yl, ho = yl - yo - 2;
      bars += `<g class="bar" data-i="${i}">
        <path d="M${x} ${H - padB} V${yl} H${x + bw} V${H - padB} Z" fill="${C_LIB}"/>
        ${ho > 0 ? `<path d="M${x} ${yl - 2} V${yo + 4} Q${x} ${yo} ${x + 4} ${yo} H${x + bw - 4} Q${x + bw} ${yo} ${x + bw} ${yo + 4} V${yl - 2} Z" fill="${C_OTH}"/>` : ''}
        <text class="val" x="${x + bw / 2}" y="${yo - 8}" text-anchor="middle">${lib[i]} / ${lib[i] + oth[i]}</text>
        <rect class="hit" x="${x - gap / 2}" y="${padT}" width="${bw + gap}" height="${H - padT - padB}"/>
      </g>`;
      axis += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${m}</text>`;
    });
    return `<figure class="chart rv" id="hchart" style="margin-left:0;margin-right:0">
      <div class="chart__legend"><span><i style="background:${C_LIB}"></i>Libido creatives</span><span><i style="background:${C_OTH}"></i>Every other angle</span><button type="button" data-table>Show table</button></div>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Herbius creatives by first-run month: libido versus every other angle, May to October 2026. Libido grows from 4 of 13 to 61 of 76.">
        <g class="grid">${grid}</g><g class="axis">${axis}</g>${bars}
      </svg>
      <div class="chart__tip" role="status"></div>
      <div class="chart__table"><table><thead><tr><th>Month</th><th>Libido</th><th>Other angles</th></tr></thead><tbody>${months.map((m, i) => `<tr><td>${m}</td><td>${lib[i]}</td><td>${oth[i]}</td></tr>`).join('')}</tbody></table></div>
      <figcaption class="note">* October counted to the 13th.</figcaption>
    </figure>`;
  }
  function senaBuild() {
    let imgs = '';
    for (let i = 1; i <= 26; i++) imgs += `<canvas data-src="assets/sena/el-${i}.png" style="z-index:${i}"></canvas>`;
    return `<div class="sena rv" id="sena" aria-label="The Sena Diwas 2027 emblem assembling layer by layer">${imgs}
      <span class="sena__counter" id="senaCount">Layer 00 / 26</span>
      <button class="btn btn--ghost sena__replay" id="senaReplay" style="padding:8px 14px;font-size:13px">Replay build</button></div>`;
  }
  function sharkTank(s) {
    return `<div class="tv">${s.frames.map(([t, sec, cap]) => {
      const file = `assets/zen/st-${t.replace(':', '').padStart(4, '0')}.jpg`;
      return `<a href="https://www.youtube.com/watch?v=${s.video}&t=${sec}s" target="_blank" rel="noopener" style="background-image:url('${file}')" data-frame="${file}">
        <i>Frame at ${t}<br>${cap || ''}</i><span>▶ ${t}</span></a>`;
    }).join('')}</div>
    <p class="note">Tap a frame to watch that moment on YouTube.</p>`;
  }
  function shelf() {
    // Illustrated colour story: the category's black-and-gold row vs. the two warm cartons.
    const jar = (cls, name) => `<div class="jar ${cls}" ${name ? `data-name="${name}"` : ''}><span class="jar__lid"></span><span class="jar__body"><i></i></span></div>`;
    const row = [jar('is-cat'), jar('is-cat'), jar('is-warm is-ashwa', 'Ashwa Resin'), jar('is-cat'), jar('is-warm is-pure', 'Herbius Shilajit'), jar('is-cat'), jar('is-cat')].join('');
    return `<figure class="shelf rv" style="margin-left:0;margin-right:0">
      <div class="shelf__row">${row}</div><div class="shelf__plank"></div>
      <div class="shelf__key">
        <div><span class="mono">The category</span><p><i style="background:#141210"></i><i style="background:#2b2724"></i><i style="background:#C9A54C"></i> Black, charcoal, gold — "for men"</p></div>
        <div><span class="mono">Herbius</span><p><i style="background:#EF8A2B"></i><i style="background:#F3E6CF"></i><i style="background:#6B4A32"></i> Sunlit orange, cream, mountain brown — "for her"</p></div>
      </div>
      <figcaption class="note">Colour story, illustrated. Hover the shelf to find the two that don't belong.</figcaption>
    </figure>`;
  }
  function beatsBlock(s) {
    const h = [16, 10, 12, 14, 12, 10, 16, 14];
    return `<div class="beats-wrap">
      <div class="phone rv" aria-hidden="true"><div class="phone__screen">${s.beats.map((b, i) => `<div class="phone__blk" data-b="${i}" style="flex-grow:${h[i]}"><span>0${i + 1}</span><b>${b[0]}</b></div>`).join('')}</div></div>
      <div class="beats">${s.beats.map((b, i) => `<div class="beat rv" data-b="${i}"><span class="mono">${b[0]}</span><h4>${b[1]}</h4><p>${b[2]}</p></div>`).join('')}</div>
    </div>`;
  }
  function section(s, n) {
    let inner = `<h2 class="h-sec rv">${s.title}</h2>`;
    if (s.body) inner += `<div class="body rv">${s.body}</div>`;
    switch (s.type) {
      case 'gallery': inner += gallery(s); break;
      case 'chart-herbius': inner += chartHerbius(); if (s.note) inner += `<p class="note">${s.note}</p>`; break;
      case 'beats': inner += beatsBlock(s); break;
      case 'shelf': inner += shelf(); break;
      case 'markets': inner += `<div class="mkt"><table class="rv"><thead><tr><th>Country</th><th>The same idea, said locally</th></tr></thead><tbody>${s.table.map(r => `<tr><td>${r[0]}</td><td>"${r[1]}"</td></tr>`).join('')}</tbody></table>
        <div class="statgrid">${s.stats.map(st => `<div class="rv"><b>${st[0]}</b><span>${st[1]}</span></div>`).join('')}</div></div>`; break;
      case 'chips': inner += `<div class="chips">${s.chips.map(c => `<div class="rv"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>`; break;
      case 'videos': inner += `<div class="videos">${s.videos.map(v => `<video class="rv" src="${v}" muted loop playsinline preload="metadata" controls></video>`).join('')}</div>`; break;
      case 'sena-build': inner += senaBuild(); break;
      case 'sharktank': inner += sharkTank(s); break;
    }
    if (s.steps) inner += `<div class="steps">${s.steps.map((t, i) => `<div class="rv"><span><b>0${i + 1}</b>${t}</span></div>`).join('')}</div>`;
    inner += todo(s.todo);
    return `<section class="cs wrap ${s.type === 'quote' ? 'cs--quote' : ''}" id="${s.id}">${sideLabel(s, n)}<div class="cs__main">${inner}</div></section>`;
  }

  /* ---------- page ---------- */
  const prev = P[(idx - 1 + P.length) % P.length], next = P[(idx + 1) % P.length];
  const navItems = [...p.sections.map(s => [s.id, s.nav]), ['ai', 'AI layer'], ['impact', 'Impact']];
  root.innerHTML = `
    <header class="case-hero wrap">
      <div>
        <p class="label rv">${p.tier === 'major' ? 'Big catch' : 'Small fry'} · Nº ${p.no} · ${p.kicker}</p>
        <h1 class="display rv" style="margin-top:18px">${p.title}${p.status ? `<span class="status-pill">${p.status}</span>` : ''}</h1>
        <p class="oneliner rv">${p.oneLiner}</p>
      </div>
      <div>
        <p class="lede rv">${p.summary}</p>
      </div>
    </header>
    ${p.cover
      ? `<div class="case-cover rv" style="--accent:${p.accent}"><img src="${p.cover}" alt="${p.title} — key visual"></div>`
      : `<div class="case-cover is-plate rv"><div class="cover-plate__text"><p class="h1">${p.coverText}</p><p>Plate Nº ${p.no} · ${p.client}</p></div><div class="cover-plate__art">${ink(p.coverArt || "hang-three-rope")}</div></div>`}
    <dl class="meta wrap">${Object.entries(p.meta).map(([k, v]) => `<div class="rv"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>

    <nav class="jump" aria-label="Jump to section"><div class="jump__in wrap">
      <span class="jump__title">${p.title}</span>
      ${navItems.map(([id, label]) => `<a href="#${id}" class="${id === 'ai' ? 'is-ai' : ''}">${id === 'ai' ? '✦ ' : ''}${label}</a>`).join('')}
    </div><span class="jump__progress"></span></nav>

    ${p.sections.map((s, i) => section(s, i + 1)).join('')}

    <section class="wrap" id="ai-wrap"><div class="ai" id="ai">
      <div class="ai__orb">${ink("skeleton", "ink--cream")}</div>
      <span class="label">✦ The AI layer</span>
      <h2>${p.ai.title}</h2>
      <p>${p.ai.body}</p>
      <div class="ai__flow">${p.ai.steps.map(s => `<div class="ai__step"><b>${s[0]}</b><p>${s[1]}</p></div>`).join('')}</div>
      ${todo(p.ai.todo)}
    </div></section>

    <section class="cs wrap" id="impact">${sideLabel({ label: 'Impact' }, p.sections.length + 1)}
      <div class="cs__main"><h2 class="h-sec rv">What it <em>moved</em>.</h2>
        <div class="impact">${p.impact.stats.map(s => `<div class="rv"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
        ${p.impact.relative ? `<p class="mono rv" style="margin:34px 0 0;color:var(--olive)">Performance by angle</p>
        <div class="impact impact--rel">${p.impact.relative.map(s => `<div class="rv ${s[0].includes('__') ? 'is-pending' : ''}"><b>${s[0].includes('__') ? s[0].replace('__', '··') : s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>` : ''}
        ${todo(p.impact.todo)}
      </div>
    </section>

    <nav class="next" aria-label="More projects">
      <a href="case.html?p=${prev.slug}"><small class="mono">← Previous catch</small><b>${prev.title}</b></a>
      <a href="case.html?p=${next.slug}"><small class="mono">Next catch →</small><b>${next.title}</b></a>
    </nav>`;

  /* ---------- behaviours ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // jump bar: active link + progress
  const links = [...document.querySelectorAll('.jump a')];
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  const prog = document.querySelector('.jump__progress');
  function onScroll() {
    const y = window.scrollY + 160;
    let on = 0;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top + window.scrollY <= y) on = i; });
    links.forEach((a, i) => a.classList.toggle('is-on', i === on && window.scrollY > targets[0].offsetTop - 300));
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (window.scrollY / h * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  links.forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.getElementById(a.getAttribute('href').slice(1));
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: reduce ? 'auto' : 'smooth' });
    a.scrollIntoView({ inline: 'center', block: 'nearest' });
  }));

  // page-structure phone: highlight the beat being read or hovered
  const blks = [...document.querySelectorAll('.phone__blk')];
  if (blks.length) {
    const setOn = (i) => { blks.forEach((b, k) => b.classList.toggle('is-on', k === i)); document.querySelectorAll('.beat').forEach((b, k) => b.classList.toggle('is-on', k === i)); };
    document.querySelectorAll('.beat').forEach((b) => b.addEventListener('mouseenter', () => setOn(+b.dataset.b)));
    blks.forEach((b) => b.addEventListener('mouseenter', () => setOn(+b.dataset.b)));
    const bio = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) setOn(+e.target.dataset.b); }), { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('.beat').forEach(b => bio.observe(b));
    setOn(0);
    // desktop: the beats become a horizontal stacked deck that pins beside the phone
    window.addEventListener('load', () => {
      const wrap = document.querySelector('.beats-wrap');
      if (!wrap || !window.gsap || !window.SITE || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.matchMedia().add('(min-width: 1001px)', () => {
        wrap.classList.add('is-deck');
        bio.disconnect();
        const beats = [...wrap.querySelectorAll('.beat')];
        [...beats, wrap.querySelector('.phone')].forEach(el => { el.classList.remove('rv'); gsap.set(el, { opacity: 1, y: 0 }); });
        const undo = window.SITE.hstack(wrap, beats, { offset: 26, onIndex: setOn });
        ScrollTrigger.refresh();
        return () => { undo && undo(); wrap.classList.remove('is-deck'); beats.forEach(b => bio.observe(b)); };
      });
    });
  }

  // chart hover + table toggle
  const chart = document.getElementById('hchart');
  if (chart) {
    const tip = chart.querySelector('.chart__tip');
    const months = ['May', 'June', 'July', 'August', 'September', 'October (to the 13th)'];
    const lib = [4, 7, 35, 43, 61, 12], oth = [9, 5, 3, 30, 15, 1];
    chart.querySelectorAll('.bar').forEach(g => {
      g.addEventListener('mousemove', (e) => {
        const i = +g.dataset.i, r = chart.getBoundingClientRect();
        tip.innerHTML = `<b>${months[i]}</b><br>Libido ${lib[i]} · Other ${oth[i]} · Total ${lib[i] + oth[i]}`;
        tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 200) + 'px'; tip.style.top = (e.clientY - r.top - 50) + 'px'; tip.style.opacity = 1;
        chart.querySelectorAll('.bar').forEach(o => o.style.opacity = o === g ? 1 : .45);
      });
      g.addEventListener('mouseleave', () => { tip.style.opacity = 0; chart.querySelectorAll('.bar').forEach(o => o.style.opacity = 1); });
    });
    const tb = chart.querySelector('[data-table]');
    tb.addEventListener('click', () => { chart.classList.toggle('show-table'); tb.textContent = chart.classList.contains('show-table') ? 'Hide table' : 'Show table'; });
    if (window.gsap && !reduce) window.addEventListener('load', () => {
      gsap.from(chart.querySelectorAll('.bar path'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1, ease: 'power3.out', stagger: .06, scrollTrigger: { trigger: chart, start: 'top 75%' } });
    });
  }

  // Sena: assemble the emblem layer by layer
  const sena = document.getElementById('sena');
  if (sena) {
    const layers = [...sena.querySelectorAll('canvas')];
    const count = document.getElementById('senaCount');
    let tl, ready = null;
    // The exported layers have opaque white backgrounds. Flood-fill white from the
    // edges to transparent so the layers stack (interior whites, like the
    // Devanagari text, are kept because they aren't connected to the edge).
    const clean = (cv) => new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        const w = cv.width = 800, h = cv.height = Math.round(800 * im.height / im.width);
        const x = cv.getContext('2d', { willReadFrequently: true });
        x.drawImage(im, 0, 0, w, h);
        const data = x.getImageData(0, 0, w, h), d = data.data;
        const seen = new Uint8Array(w * h), q = new Int32Array(w * h);
        let head = 0, tail = 0;
        const white = (p) => d[p * 4] > 236 && d[p * 4 + 1] > 236 && d[p * 4 + 2] > 236;
        const push = (p) => { if (!seen[p] && white(p)) { seen[p] = 1; q[tail++] = p; } };
        for (let i = 0; i < w; i++) { push(i); push((h - 1) * w + i); }
        for (let j = 0; j < h; j++) { push(j * w); push(j * w + w - 1); }
        while (head < tail) {
          const p = q[head++], px = p % w;
          d[p * 4 + 3] = 0;
          if (px > 0) push(p - 1); if (px < w - 1) push(p + 1);
          if (p >= w) push(p - w); if (p < w * (h - 1)) push(p + w);
        }
        x.putImageData(data, 0, 0);
        res();
      };
      im.src = cv.dataset.src;
    });
    const prepare = () => ready || (ready = layers.reduce((pr, cv) => pr.then(() => clean(cv)), Promise.resolve()));
    const build = () => {
      if (!window.gsap || reduce) return;
      tl && tl.kill();
      tl = gsap.timeline();
      layers.forEach((l, i) => tl.fromTo(l, { opacity: 0, y: i % 2 ? -40 : 40, scale: 1.06 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.7)', onStart: () => { count.textContent = `Layer ${String(i + 1).padStart(2, '0')} / 26`; } }, i * .14));
    };
    window.addEventListener('load', () => {
      if (!window.gsap || reduce) { prepare(); count.textContent = 'Layer 26 / 26'; return; }
      gsap.set(layers, { opacity: 0 });
      ScrollTrigger.create({ trigger: sena, start: 'top bottom', once: true, onEnter: prepare });
      ScrollTrigger.create({ trigger: sena, start: 'top 70%', once: true, onEnter: () => prepare().then(build) });
    });
    document.getElementById('senaReplay').addEventListener('click', () => prepare().then(build));
  }

  // Shark Tank frames: hide the placeholder once a real screenshot exists
  document.querySelectorAll('[data-frame]').forEach(a => {
    const im = new Image();
    im.onload = () => { a.querySelector('i').style.display = 'none'; };
    im.src = a.dataset.frame;
  });

  // play videos only while visible
  const vio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold: .4 });
  document.querySelectorAll('.videos video').forEach(v => vio.observe(v));

  // parallax cover
  window.addEventListener('load', () => {
    if (!window.gsap || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const img = document.querySelector('.case-cover img');
    if (img) gsap.fromTo(img, { scale: 1.15, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.case-cover', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.ai__step', { x: 40, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.ai', start: 'top 70%' } });
  });
})();
