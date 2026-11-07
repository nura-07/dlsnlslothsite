/* =========================================================
   Case study page (dark edition)
   Reads ?p=<slug>, builds the page from data/projects.js.
   Opening · jump bar · numbered story sections · the AI
   system · impact · next project.
   Herbius is the first case built for this layout; the other
   projects render with the same pieces as they are filled in.
   ========================================================= */
(function () {
  const D = window.DLSNL;
  const { $, $$, reduce, hasG } = D;
  const P = window.PROJECTS || [];
  const ICONS = window.PROJECT_ICONS || {};
  const slug = new URLSearchParams(location.search).get('p') || 'herbius';
  const idx = Math.max(0, P.findIndex((q) => q.slug === slug));
  const p = P[idx];
  const root = $('#main');
  const showTodo = !p.ready || /[?&]todo=1/.test(location.search);

  document.title = `${p.title}, a case study by Arundhati Mitra`;
  const md = document.querySelector('meta[name=description]'); if (md) md.setAttribute('content', p.summary);
  document.documentElement.style.setProperty('--c', p.accent);

  const STAR = D.STAR;
  const star = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${STAR}"/></svg>`;
  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg>';
  const back = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>';
  const emblem = (s) => `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[s] || ''}</svg>`;
  const clean = (t) => String(t).replace(/\s*·\s*/g, ', ');           // "A · B" reads "A, B"
  const stepName = (t) => String(t).replace(/^\d+\s*·\s*/, '');        // "01 · Research" → "Research"
  const hasBlank = (t) => /__/.test(t);
  const todo = (items) => showTodo && items && items.length ? `<aside class="cs-todo"><b>To add</b><ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul></aside>` : '';
  const covers = { herbius: 'assets/herbius/cover.webp', 'zen-barefoot': 'assets/zen/zen-cover.jpg' };

  /* ---------- opening ---------- */
  const coverSrc = covers[p.slug] || p.cover;
  const meta = Object.entries(p.meta || {});
  const stats = (p.impact && p.impact.stats) || [];
  const hero = `
    <header class="cs-hero">
      <a class="cs-back" href="work.html">${back}<span>All work</span></a>
      <div class="cs-hero__grid">
        <div class="cs-hero__text">
          <div class="cs-hero__top">
            <span class="cs-emblem">${emblem(p.slug)}</span>
            <p class="cs-kicker">${clean(p.kicker)}${p.status ? ` <span class="cs-status">${p.status}</span>` : ''}</p>
          </div>
          <h1 class="cs-title">${p.title}</h1>
          <p class="cs-line">${p.oneLiner}</p>
          <p class="cs-summary">${p.summary}</p>
        </div>
        <figure class="cs-cover">${coverSrc ? `<span class="fit-bg" style="background-image:url('${D.asset(coverSrc)}')" aria-hidden="true"></span><img src="${D.asset(coverSrc)}" alt="${p.title}, campaign visual" />` : `<div class="cs-cover__type">${p.coverText || p.title}</div>`}</figure>
      </div>
      ${meta.length ? `<dl class="cs-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${clean(v)}</dd></div>`).join('')}</dl>` : ''}
      ${stats.length ? `<ul class="cs-stats">${stats.map(([b, t]) => `<li><b>${b}</b><span>${t}</span></li>`).join('')}</ul>` : ''}
    </header>`;

  /* ---------- section pieces ---------- */
  function shelf() {
    // the category: black jars, gold labels. Herbius: warm, and impossible to miss.
    const them = ['MAX', 'ALPHA', 'PURE+', 'STRONG'];
    const jar = (cls, label, sub) => `<div class="jar ${cls}"><i class="jar__lid"></i><div class="jar__body"><span class="jar__label">${label}<small>${sub}</small></span></div></div>`;
    return `<figure class="shelf">
      <div class="shelf__row">
        ${jar('jar--them', them[0], 'shilajit')}${jar('jar--them', them[1], 'shilajit')}
        ${jar('jar--herb jar--orange', 'Ashwa Resin', 'Herbius')}
        ${jar('jar--them', them[2], 'shilajit')}
        ${jar('jar--herb jar--cream', 'Shilajit', 'Herbius')}
        ${jar('jar--them', them[3], 'shilajit')}
      </div>
      <div class="shelf__plank"></div>
      <figcaption><span><i class="sw sw--them"></i>The category: black jars, gold labels, made for men</span><span><i class="sw sw--herb"></i>Herbius: sunlit orange and soft cream</span></figcaption>
    </figure>`;
  }
  function chart() {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct*'];
    const lib = [4, 7, 35, 43, 61, 12], oth = [9, 5, 3, 30, 15, 1];
    const W = 720, H = 300, padL = 34, padB = 30, padT = 30, max = 80;
    const bw = 54, gap = (W - padL - bw * months.length) / months.length;
    const y = (v) => H - padB - (v / max) * (H - padB - padT);
    let grid = '', bars = '', axis = '';
    [0, 20, 40, 60, 80].forEach((v) => { grid += `<line x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/>`; axis += `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; });
    months.forEach((m, i) => {
      const x = padL + gap / 2 + i * (bw + gap), yl = y(lib[i]), yo = y(lib[i] + oth[i]);
      bars += `<g class="bar" style="--d:${i * .08}s">
        <rect class="bar__lib" x="${x}" y="${yl}" width="${bw}" height="${H - padB - yl}" rx="6"/>
        ${oth[i] ? `<rect class="bar__oth" x="${x}" y="${yo}" width="${bw}" height="${Math.max(0, yl - yo - 3)}" rx="6"/>` : ''}
        <text class="bar__val" x="${x + bw / 2}" y="${yo - 10}" text-anchor="middle">${lib[i]} of ${lib[i] + oth[i]}</text>
      </g>`;
      axis += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${m}</text>`;
    });
    return `<figure class="cs-chart">
      <div class="cs-chart__legend"><span><i class="lg lg--lib"></i>Libido creatives</span><span><i class="lg lg--oth"></i>Every other angle</span></div>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Herbius creatives by month, May to October 2026. Libido grew from 4 of 13 in May to 61 of 76 in September.">
        <defs><linearGradient id="libGrad" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E3442E"/><stop offset="1" stop-color="#F7B9C9"/></linearGradient></defs>
        <g class="grid">${grid}</g><g class="axis">${axis}</g>${bars}
      </svg>
      <figcaption>* October counted to the 13th.</figcaption>
    </figure>`;
  }
  function beats(s) {
    const h = [3, 2, 2, 3, 3, 2, 3, 3];
    return `<div class="beats">
      <div class="beats__phone" aria-hidden="true"><div class="beats__screen">${s.beats.map((b, i) => `<div class="beats__blk" data-b="${i}" style="flex-grow:${h[i] || 2}"><b>${b[0]}</b></div>`).join('')}</div></div>
      <ol class="beats__list">${s.beats.map((b, i) => `<li class="beat" data-b="${i}"><span class="beat__tag">${b[0]}</span><h4>${b[1]}</h4><p>${b[2]}</p></li>`).join('')}</ol>
    </div>`;
  }
  function markets(s) {
    return `<div class="mkts">${s.table.map(([c, phrase]) => `<div class="mkt"><span>${c}</span><b>“${phrase}”</b></div>`).join('')}</div>
      ${s.stats ? `<ul class="cs-stats cs-stats--sm">${s.stats.map(([b, t]) => `<li><b>${clean(b)}</b><span>${t}</span></li>`).join('')}</ul>` : ''}`;
  }
  function chips(s) {
    const mine = s.chips.filter((c) => /^Mine/.test(c[0])), team = s.chips.filter((c) => !/^Mine/.test(c[0]));
    const card = ([t, d]) => `<li><b>${t.replace(/^(Mine|Team)\s*·\s*/, '')}</b><p>${d}</p></li>`;
    return `<div class="owned">
      <div><h4 class="owned__h">What I owned</h4><ul class="owned__list owned__list--mine">${mine.map(card).join('')}</ul></div>
      <div><h4 class="owned__h">With the team</h4><ul class="owned__list">${team.map(card).join('')}</ul></div>
    </div>`;
  }
function gallery(s) {
  const media = s.media || [], cap = s.captions || [], fit = s.contain || [];
  if (!media.length) return '';
  const fig = (i) => `<img src="${D.asset(media[i])}" alt="${cap[i] || p.title}" ${fit.includes(i) ? 'class="is-contain"' : ''} />`;
  return `<div class="cs-gallery cs-gallery--${Math.min(media.length, 5)}${s.tall ? " cs-gallery--tall" : ""}">
    <figure class="cs-gal__main">${fig(0)}<figcaption>${cap[0] || ''}</figcaption></figure>
    ${media.length > 1 ? `<div class="cs-gal__thumbs">${media.map((m, i) => `<button class="cs-gal__t${i === 0 ? ' is-on' : ''}" data-i="${i}" aria-label="Show: ${cap[i] || 'image ' + (i + 1)}" aria-pressed="${i === 0}"><img src="${D.asset(m)}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}
  </div>`;
}
// a tile swaps into the large frame
document.addEventListener('click', (e) => {
  const t = e.target.closest('.cs-gal__t'); if (!t) return;
  const g = t.closest('.cs-gallery'), sec = (p.sections || []).find((x) => x.id === g.closest('.cs-sec').id);
  if (!sec) return;
  const i = +t.dataset.i, main = g.querySelector('.cs-gal__main'), img = main.querySelector('img');
  g.querySelectorAll('.cs-gal__t').forEach((x) => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-pressed', x === t); });
  const swap = () => {
    img.src = D.asset(sec.media[i]); img.alt = (sec.captions || [])[i] || p.title;
    img.classList.toggle('is-contain', (sec.contain || []).includes(i));
    main.querySelector('figcaption').textContent = (sec.captions || [])[i] || '';
  };
  if (hasG && !reduce) gsap.to(img, { opacity: 0, scale: .98, duration: .2, onComplete: () => { swap(); gsap.to(img, { opacity: 1, scale: 1, duration: .5, ease: 'expo.out' }); } });
  else swap();
});

  function videos(s) {
    return `<div class="cs-vids">${s.videos.map((v) => `<figure><video src="${v}" muted loop playsinline preload="metadata" controls></video></figure>`).join('')}</div>`;
  }

// facts as four cards, then the film (YouTube loads only when played)
function rally(s) {
  const facts = `<dl class="cs-facts">${(s.facts || []).map(([k, big, t]) => `<div><dt>${k}</dt><dd><b>${big}</b><span>${t}</span></dd></div>`).join('')}</dl>`;
  const v = s.video;
  const film = v ? `<figure class="cs-yt"><button class="cs-yt__btn" data-yt="${v.id}" aria-label="Play video: ${v.caption}">
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" />
      <span class="cs-yt__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
    </button><figcaption>${v.caption}<a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Watch on YouTube</a></figcaption></figure>` : '';
  return facts + film;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.cs-yt__btn'); if (!b) return;
  b.outerHTML = `<div class="cs-yt__frame"><iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
});

// process: every piece the same small size, in order, so it reads as a journey
function processWall(s) {
  return `<ol class="cs-proc">${(s.steps || []).map(([src, t], i) => `<li><button class="cs-proc__b" data-zoom="${D.asset(src)}" data-cap="${t}" aria-label="Enlarge: ${t}"><img src="${D.asset(src)}" alt="${t}" loading="lazy" /></button><span><i>${String(i + 1).padStart(2, '0')}</i>${t}</span></li>`).join('')}</ol>`;
}
// screenshots shown whole, at their own shape
function screens(s) {
  return `<div class="cs-screens">${(s.media || []).map((m, i) => `<figure><button data-zoom="${D.asset(m)}" data-cap="${(s.captions || [])[i] || ''}" aria-label="Enlarge: ${(s.captions || [])[i] || 'screenshot'}"><img src="${D.asset(m)}" alt="${(s.captions || [])[i] || ''}" loading="lazy" /></button><figcaption>${(s.captions || [])[i] || ''}</figcaption></figure>`).join('')}</div>`;
}
// deliverables as ticked groups
const tick = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5"/></svg>';
function checklist(s) {
  return `<div class="cs-check">${(s.groups || []).map(([h, items]) => `<div><h4>${h}<small>${items.length}</small></h4><ul>${items.map((t) => `<li>${tick}<span>${t}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
}
// a simple viewer for anything marked data-zoom
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-zoom]'); if (!b) return;
  const box = document.createElement('div');
  box.className = 'cs-lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', b.dataset.cap || 'Image');
  box.innerHTML = `<figure><img src="${b.dataset.zoom}" alt="${b.dataset.cap || ''}" /><figcaption>${b.dataset.cap || ''}</figcaption></figure><button class="cs-lb__x" aria-label="Close">×</button>`;
  document.body.appendChild(box); D.lenis && D.lenis.stop();
  requestAnimationFrame(() => box.classList.add('is-on'));
  const close = () => { box.classList.remove('is-on'); D.lenis && D.lenis.start(); setTimeout(() => box.remove(), 400); removeEventListener('keydown', esc); b.focus(); };
  const esc = (k) => { if (k.key === 'Escape') close(); };
  box.addEventListener('click', (k) => { if (k.target === box || k.target.closest('.cs-lb__x')) close(); });
  addEventListener('keydown', esc);
  box.querySelector('.cs-lb__x').focus();
});

  const builder = p.builder && window.CASE_BUILDERS && window.CASE_BUILDERS[p.builder];
  const customSections = builder ? builder.sections.map((s, i) => `
    <section class="cs-sec ${s.quote ? 'cs-sec--quote' : ''} ${s.ai ? 'cs-sec--ai' : ''}" id="${s.id}" data-nav="${s.nav}">
      <div class="cs-sec__label"><span class="cs-sec__n">${String(i + 1).padStart(2, '0')}</span><span>${s.label}</span></div>
      <div class="cs-sec__body"><h2 class="cs-h">${s.title}</h2>${s.html}</div>
    </section>`).join('') : '';

  const sections = builder ? customSections : (p.sections || []).map((s, i) => {
    let extra = '';
    switch (s.type) {
      case 'shelf': extra = shelf(); break;
      case 'chart-herbius': extra = chart() + (s.note ? `<p class="cs-note">${s.note}</p>` : ''); break;
      case 'beats': extra = beats(s); break;
      case 'markets': extra = markets(s); break;
      case 'chips': extra = chips(s); break;
      case 'gallery': extra = gallery(s); break;
      case 'videos': extra = videos(s); break;
      case 'rally': extra = rally(s); break;
      case 'process': extra = processWall(s); break;
      case 'screens': extra = screens(s); break;
      case 'checklist': extra = checklist(s); break;
    }
    return `<section class="cs-sec ${s.type === 'quote' ? 'cs-sec--quote' : ''} ${s.type === 'beats' ? 'cs-sec--wide' : ''}" id="${s.id}" data-nav="${s.nav}">
      <div class="cs-sec__label"><span class="cs-sec__n">${String(i + 1).padStart(2, '0')}</span><span>${s.label}</span></div>
      <div class="cs-sec__body">
        <h2 class="cs-h">${s.title}</h2>
        <div class="cs-text">${s.body || ''}</div>
        ${extra}
        ${todo(s.todo)}
      </div>
    </section>`;
  }).join('');

  /* ---------- the AI system ---------- */
  const ai = p.ai && !builder ? `
    <section class="cs-ai" id="ai-system" data-nav="AI system">
      <div class="cs-ai__in">
        <p class="cs-ai__tag">${star}<span>How AI fits in</span></p>
        <h2 class="cs-h">${p.ai.title}</h2>
        <p class="cs-ai__body">${p.ai.body}</p>
        ${p.ai.steps ? `<ol class="pipe">${p.ai.steps.map(([t, d], i) => `<li style="--i:${i}"><span class="pipe__node">${String(i + 1).padStart(2, '0')}</span><b>${stepName(t)}</b><p>${clean(d)}</p></li>`).join('')}</ol>` : ''}
        ${todo(p.ai.todo)}
      </div>
    </section>` : '';

  /* ---------- impact ---------- */
  // Impact gets its own section only when it adds something the opening
  // doesn't already show: the relative results, once they're filled in.
  const rel = ((p.impact && p.impact.relative) || []).filter(([b]) => showTodo || !hasBlank(b));
  const hasImpact = !builder && !!(p.impact && rel.length);
  const impact = hasImpact ? `
    <section class="cs-sec cs-impact" id="impact" data-nav="Impact">
      <div class="cs-sec__label"><span class="cs-sec__n">${star}</span><span>Impact</span></div>
      <div class="cs-sec__body">
        <h2 class="cs-h">What it added up to.</h2>
        <ul class="cs-stats cs-stats--big">${rel.map(([b, t]) => `<li class="${hasBlank(b) ? 'is-blank' : ''}"><b>${b}</b><span>${t}</span></li>`).join('')}</ul>
        ${todo(p.impact.todo)}
      </div>
    </section>` : '';

  /* ---------- next project ---------- */
  const next = P[(idx + 1) % P.length];
  const nextBlock = `
    <div class="cs-end" role="separator" aria-label="End of ${p.title}">
      <i class="cs-end__line"></i><span class="cs-end__star">${star}</span><i class="cs-end__line"></i>
      <p class="cs-end__t">End of ${p.title}</p>
      <a class="cs-end__up" href="#top">Back to the top</a>
    </div>
    <section class="cs-next">
      <p class="cs-next__k">Up next</p>
      <a class="cs-next__card" href="case.html?p=${next.slug}" style="--c:${next.accent}" data-cursor="Open case">
        <span class="cs-emblem cs-emblem--lg">${emblem(next.slug)}</span>
        <span class="cs-next__text"><b>${next.title}</b><span>${next.oneLiner}</span></span>
        <i class="cs-next__go">${arrow}</i>
      </a>
      <a class="btn-iri" href="work.html"><span>All projects</span><i aria-hidden="true">${star}</i></a>
    </section>`;

  /* ---------- jump bar ---------- */
  const navItems = builder ? builder.sections.map((s) => [s.id, s.nav]) : [...(p.sections || []).map((s) => [s.id, s.nav]), ...(p.ai ? [['ai-system', 'AI system']] : []), ...(hasImpact ? [['impact', 'Impact']] : [])];
  const jump = `
    <nav class="cs-jump" aria-label="Jump to a section">
      <div class="cs-jump__in">
        <span class="cs-jump__title">${p.title}</span>
        <ul>${navItems.map(([id, label]) => `<li><a href="#${id}" data-id="${id}">${label}</a></li>`).join('')}</ul>
      </div>
      <i class="cs-jump__bar"><i id="csProgress"></i></i>
    </nav>`;

  root.innerHTML = hero + jump + `<div class="cs-story">${sections}${ai}${impact}</div>` + nextBlock;

  /* =========================================================
     Behaviour
     ========================================================= */
  D.tintLogo();
// the title shrinks until its longest word fits the column (so it never runs into the cover)
const fitTitle = () => {
  const t = $('.cs-title'); if (!t) return;
  t.style.fontSize = '';
  const words = (t.dataset.final || p.title).split(/\s+/);
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
  t.style.position = 'relative'; t.appendChild(probe);
  let size = parseFloat(getComputedStyle(t).fontSize);
  const max = t.clientWidth;
  const widest = () => Math.max(...words.map((w) => { probe.textContent = w; return probe.getBoundingClientRect().width; }));
  while (size > 32 && widest() > max) { size -= 2; t.style.fontSize = size + 'px'; }
  probe.remove();
};
(document.fonts ? document.fonts.ready : Promise.resolve()).then(fitTitle);
addEventListener('resize', fitTitle);
  if (builder && builder.init) builder.init(D);

  // jump bar: highlight the section in view; the active pill scrolls into view on small screens
  const links = $$('.cs-jump a');
  const setActive = (id) => links.forEach((a) => {
    const on = a.dataset.id === id; a.classList.toggle('is-on', on);
    if (on) { const ul = a.closest('ul'); const r = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2; ul.scrollTo({ left: r, behavior: reduce ? 'auto' : 'smooth' }); }
  });
  const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
  navItems.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
  const bar = $('#csProgress'), story = $('.cs-story');
  const progress = () => {
    const r = story.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (innerHeight * .5 - r.top) / r.height));
    bar.style.transform = `scaleX(${t})`;
    $('.cs-jump').classList.toggle('is-stuck', $('.cs-jump').getBoundingClientRect().top <= 72);
  };
  addEventListener('scroll', progress, { passive: true }); progress();

  // the landing-page beats light up their block on the phone
  const blks = $$('.beats__blk'), bts = $$('.beat');
  if (bts.length) {
    const bio = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = e.target.dataset.b;
      bts.forEach((b) => b.classList.toggle('is-on', b.dataset.b === i));
      blks.forEach((b) => b.classList.toggle('is-on', b.dataset.b === i));
    }), { rootMargin: '-45% 0px -45% 0px' });
    bts.forEach((b) => bio.observe(b));
  }

  // the chart grows in when it arrives
  const ch = $('.cs-chart');
  if (ch) new IntersectionObserver((ents, o) => ents.forEach((e) => { if (e.isIntersecting) { ch.classList.add('is-in'); o.disconnect(); } }), { threshold: .35 }).observe(ch);

  // motion
  if (hasG && !reduce) {
    gsap.from('.cs-back, .cs-hero__top', { y: 16, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08, delay: .1 });
    D.scramble($('.cs-title'), { duration: 1 });
    gsap.from('.cs-line, .cs-summary', { y: 20, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: .1, delay: .35, clearProps: 'filter' });
    gsap.fromTo('.cs-cover', { clipPath: 'inset(40% 20% 40% 20% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'expo.inOut', delay: .2 });
    gsap.from('.cs-meta > div, .cs-hero > .cs-stats li', { y: 18, opacity: 0, duration: .9, ease: 'expo.out', stagger: .05, delay: .6 });
    $$('.cs-h').forEach((el) => { el.dataset.final = el.textContent; ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => D.scramble(el, { duration: 1 }) }); });
    $$('.cs-text, .shelf, .mkts, .owned, .pipe li, .cs-impact .cs-stats li, .cs-gallery').forEach((el) => {
      gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.from('.pipe', { '--draw': 0, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.pipe', start: 'top 80%' } });
  }
  if (D.lenis) setTimeout(() => D.lenis.resize(), 600);
  addEventListener('load', () => hasG && ScrollTrigger.refresh());
})();
