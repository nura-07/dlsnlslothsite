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
  const star = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${D.SPARK || STAR}"/></svg>`;
  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg>';
  const back = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>';
  const arrowR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  const emblem = (s) => `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[s] || ''}</svg>`;
  const clean = (t) => String(t).replace(/\s*·\s*/g, ', ');           // "A · B" reads "A, B"
  const stepName = (t) => String(t).replace(/^\d+\s*·\s*/, '');        // "01 · Research" → "Research"
  const hasBlank = (t) => /__/.test(t);
  const todo = (items) => showTodo && items && items.length ? `<aside class="cs-todo"><b>To add</b><ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul></aside>` : '';
  const covers = { herbius: 'assets/herbius/cover.webp', 'zen-barefoot': 'assets/zen/shoe-1.jpg' };

  /* ---------- opening ---------- */
  const coverSrc = covers[p.slug] || p.cover;
  const meta = Object.entries(p.meta || {});
  const stats = (p.impact && p.impact.stats) || [];
  const hero = `
    <header class="cs-hero">
      <a class="cs-back" href="work.html">${back}<span>All work</span></a>
      <div class="cs-hero__grid">
        <div class="cs-hero__text">
          <p class="cs-eyebrow"><span>${String(p.client).split(/,|\(/)[0].trim()}</span><span>${p.year}</span>${p.status ? `<span class="cs-eyebrow__status">${p.status}</span>` : ''}</p>
          <h1 class="cs-title">${p.title}</h1>
          <p class="cs-line">${p.oneLiner}</p>
          <p class="cs-summary">${p.summary}</p>
          <p class="cs-cats">${String(p.kicker).split('·').map((x) => `<span>${x.trim()}</span>`).join('')}</p>
        </div>
        <figure class="cs-cover${p.bookCover ? ' cs-cover--book' : ''}${p.coverLight ? ' cs-cover--light' : ''}">${p.bookCover ? bookCover(p) : coverSrc ? `<span class="fit-bg" style="background-image:url('${D.asset(coverSrc)}')" aria-hidden="true"></span><img src="${D.asset(coverSrc)}" alt="${p.title}, campaign visual" />` : `<div class="cs-cover__type">${p.coverText || p.title}</div>`}</figure>
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
function logoWall(s) {
  return `<div class="unis"><ul class="unis__wall">${s.logos.map(([k, name]) => `<li class="unis__t unis__t--${k}"><img src="${D.asset(`assets/gradright/uni-${k}.png`)}" alt="${name}" loading="lazy" /></li>`).join('')}</ul>${s.logosNote ? `<p class="unis__note">${s.logosNote}</p>` : ''}</div>`;
}
function gallery(s) {
  const media = s.media || [], cap = s.captions || [], fit = s.contain || [];
  if (!media.length) return '';
  const fig = (i) => `<img src="${D.asset(media[i])}" alt="${cap[i] || p.title}" ${fit.includes(i) ? 'class="is-contain"' : ''} />`;
  return `<div class="cs-gallery cs-gallery--${Math.min(media.length, 5)}${s.tall ? " cs-gallery--tall" : ""}">
    <figure class="cs-gal__main">${fig(0)}<figcaption>${cap[0] || ''}</figcaption></figure>
    ${media.length > 1 ? `<div class="cs-gal__thumbs">${media.map((m, i) => `<button class="cs-gal__t${i === 0 ? ' is-on' : ''}${fit.includes(i) ? ' is-light' : ''}" data-i="${i}" aria-label="Show: ${cap[i] || 'image ' + (i + 1)}" aria-pressed="${i === 0}"><img src="${D.asset(m)}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}
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

// a sealed project: a lock, a countdown to the unveiling, nothing of the work itself
function locked(s) {
  return `<div class="cs-lock" data-unlock="${s.unlock}">
    <div class="cs-lock__seal" aria-hidden="true"><svg viewBox="0 0 64 64"><rect x="14" y="28" width="36" height="26" rx="6"/><path d="M22 28v-7a10 10 0 0 1 20 0v7"/><circle cx="32" cy="40" r="3"/><path d="M32 43v4"/></svg></div>
    <p class="cs-lock__k">Unlocks after the parade</p>
    <ol class="cs-lock__count" aria-label="Time until the unveiling">
      <li><b data-u="d">--</b><span>days</span></li><li><b data-u="h">--</b><span>hours</span></li><li><b data-u="m">--</b><span>minutes</span></li><li><b data-u="s">--</b><span>seconds</span></li>
    </ol>
    <a class="btn-iri" href="mailto:${D.EMAIL}?subject=${encodeURIComponent('Tell me when Sena Diwas 2027 is unveiled')}"><span>Tell me when it's out</span><i aria-hidden="true">${star}</i></a>
  </div>`;
}

// a story section: the words carry it, with one warm link out
function storyLink(s) {
  return s.link ? `<a class="btn-iri cs-story__link" href="${s.link[0]}" target="_blank" rel="noopener"><span>${s.link[1]}</span><i aria-hidden="true">${star}</i></a>` : '';
}

// a closed hardcover, in 3D
function bookCover(q) {
  if (q.bookImg) return `<div class="bk bk--img" aria-label="${q.title}, the book"><div class="bk__front"><img src="${D.asset(q.bookImg)}" alt="${q.title} cover" /></div><div class="bk__pages"></div><div class="bk__spine"></div></div>`;
  return `<div class="bk" aria-label="${q.title}, the book"><div class="bk__front"><span class="bk__k">A research document</span><b>${q.title}</b><span class="bk__s">Three futures, decoded</span><span class="bk__foot">Escapient · Culture Core · Metro-ceptive</span></div><div class="bk__pages"></div><div class="bk__spine"></div></div>`;
}
// flip book: each leaf has a front (right page) and a back (left page once turned)
const ART = {
  1: '<svg viewBox="0 0 200 200"><circle cx="100" cy="110" r="62" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="100" cy="110" r="40" fill="none" stroke="currentColor" stroke-width="1"/><path d="M20 150c40-30 120-30 160 0" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="138" cy="62" r="10" fill="currentColor"/></svg>',
  2: '<svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M40 160V60l60-30 60 30v100z"/><path d="M70 160V80h60v80"/><path d="M40 60h120M100 30v130"/></g><circle cx="100" cy="110" r="8" fill="currentColor"/></svg>',
  3: '<svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M30 170V90h30v80M70 170V50h28v120M108 170V70h26v100M144 170V110h26v60"/><path d="M20 170h160"/></g><path d="M30 40c30 10 60-10 90 0s50 10 60 0" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
};
function pageHTML(pg, q) {
  switch (pg.kind) {
    case 'cover': return `<div class="fp fp--cover"><span class="bk__k">A research document</span><b>${q.title}</b><span class="bk__s">Three futures, decoded</span><span class="bk__foot">Escapient · Culture Core · Metro-ceptive</span></div>`;
    case 'backcover': return `<div class="fp fp--cover fp--back"><span class="bk__k">${q.title}</span><span class="bk__s">Research and design by Spandita Jakhar, Neelam, Apurva and Arundhati Mitra</span><span class="bk__foot">${q.year}</span></div>`;
    case 'contents': return `<div class="fp"><span class="fp__k">Contents</span><ol class="fp__toc"><li><i>01</i>Setting the backdrop</li><li><i>02</i>First story: Escapient</li><li><i>03</i>Second story: Culture Core</li><li><i>04</i>Third story: Metro-ceptive</li><li><i>05</i>Annexure</li></ol></div>`;
    case 'chapter': return `<div class="fp"><span class="fp__n">${pg.n}</span><h4 class="fp__t">${pg.t}</h4><p class="fp__p">${pg.p}</p></div>`;
    case 'list': return `<div class="fp"><span class="fp__k">${pg.t}</span><ul class="fp__list">${pg.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
    case 'story': return `<div class="fp fp--story"><span class="fp__k">${pg.k}</span><div class="fp__art">${ART[pg.art] || ''}</div><h4 class="fp__t fp__t--big">${pg.t}</h4><span class="fp__n">${pg.n}</span></div>`;
    case 'carries': return `<div class="fp"><span class="fp__k">Inside ${pg.t}</span><ul class="fp__list"><li>Palettes</li><li>Textures</li><li>Imagery</li><li>Scenario possibilities</li></ul></div>`;
    case 'endpaper': return '<div class="fp fp--end"></div>';
    default: return pg.img ? `<img src="${D.asset(pg.img)}" alt="" loading="lazy" decoding="async" />` : '';
  }
}
// the three trends, each with a way back into the book
function trendCards(s) {
  return `<div class="tr">${s.trends.map((t, i) => `
    <article class="tr__c">
      <button class="tr__img" data-zoom="${D.asset(t.img)}" data-cap="${t.name}: ${t.line}" aria-label="Enlarge the ${t.name} page"><img src="${D.asset(t.img)}" alt="${t.name} opening page" loading="lazy" /></button>
      <div class="tr__body">
        <span class="tr__n">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="tr__name">${t.name}</h3>
        <p class="tr__line">${t.line}</p>
        <ol class="tr__micro">${t.micro.map((m) => `<li>${m}</li>`).join('')}</ol>
        <dl class="tr__dl"><div><dt>Drivers</dt><dd>${t.drivers}</dd></div><div><dt>${t.seenLabel || 'Seen in'}</dt><dd>${t.seen}</dd></div></dl>
        <button class="tr__go" data-fbto="${t.to}">Read it in the book <i aria-hidden="true">${star}</i></button>
      </div>
    </article>`).join('')}</div>`;
}
// the people who made it
function team(s) {
  const ini = (n) => n.split(' ').map((w) => w[0]).join('');
  return `<ul class="tm">${s.people.map(([name, img, link, via, me]) => `
    <li class="tm__p${me ? ' is-me' : ''}"><a href="${link}" target="_blank" rel="noopener">
      <span class="tm__ph">${img ? `<img src="${D.asset(img)}" alt="${name}" loading="lazy" />` : `<i>${ini(name)}</i>`}</span>
      <b>${name}${me ? ' <em>(me)</em>' : ''}</b><span class="tm__via">${via} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
    </a></li>`).join('')}</ul>`;
}
function flipbook(s) {
  const L = s.leaves || [];
  return `<div class="fb" tabindex="0" aria-label="Trend book. Use the arrow keys to turn the pages.">
    <div class="fb__book is-closed" data-n="${L.length}">${L.map((lf, i) => `<div class="fb__leaf" style="--i:${i};--n:${L.length}"><div class="fb__side fb__side--front">${pageHTML(lf.front, p)}</div><div class="fb__side fb__side--back">${pageHTML(lf.back, p)}</div></div>`).join('')}</div>
    <div class="fb__ui"><button class="fb__btn" data-fb="-1" aria-label="Previous page">${back}</button><span class="fb__pos" aria-live="polite">Cover</span><button class="fb__btn" data-fb="1" aria-label="Next page">${arrowR}</button><button class="fb__btn fb__zoom" data-zoom="" data-cap="" aria-label="Read this page up close"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg></button></div>
    ${s.chapters ? `<div class="fb__chap" role="group" aria-label="Jump to a chapter">${s.chapters.map(([t, n]) => `<button data-fbto="${n}">${t}</button>`).join('')}</div>` : ''}
  </div>`;
}

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
      case 'gallery': extra = (s.logos ? logoWall(s) : '') + gallery(s); break;
      case 'videos': extra = videos(s); break;
      case 'rally': extra = rally(s); break;
      case 'process': extra = processWall(s); break;
      case 'locked': extra = locked(s); break;
      case 'story': extra = storyLink(s); break;
      case 'flipbook': extra = flipbook(s); break;
      case 'trends': extra = trendCards(s); break;
      case 'team': extra = team(s); break;
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
        ${p.ai.steps ? `<ol class="pipe" style="--n:${p.ai.steps.length}">${p.ai.steps.map(([t, d], i) => `<li style="--i:${i}"><span class="pipe__node">${String(i + 1).padStart(2, '0')}</span><b>${stepName(t)}</b><p>${clean(d)}</p></li>`).join('')}</ol>` : ''}
        ${p.ai.tools ? `<p class="cs-ai__tools"><span>Tools</span>${p.ai.tools.map((t) => `<b>${t}</b>`).join('')}</p>` : ''}
        ${p.ai.human ? `<p class="cs-ai__human">${star}<span>${p.ai.human}</span></p>` : ''}
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

// flip book: turn leaves; the book slides so a closed cover sits centred
$$('.fb').forEach((fb) => {
  const book = $('.fb__book', fb), leaves = $$('.fb__leaf', fb), pos = $('.fb__pos', fb), n = leaves.length;
  let cur = 0;
  const label = () => (cur === 0 ? 'Cover' : cur === n ? 'Back cover' : `Spread ${cur} of ${n - 1}`);
  const render = () => {
    leaves.forEach((lf, i) => { lf.classList.toggle('is-turned', i < cur); lf.style.zIndex = i < cur ? i + 1 : n - i + n; });
    book.classList.toggle('is-closed', cur === 0); book.classList.toggle('is-end', cur === n);
    pos.textContent = label();
    const zi = Math.min(cur, n - 1), zimg = cur === n ? $('.fb__side--back img', leaves[n - 1]) : $('.fb__side--front img', leaves[zi]);
    const zb = $('.fb__zoom', fb); if (zb) { zb.dataset.zoom = zimg ? zimg.src : ''; zb.disabled = !zimg; }
    $$('[data-fbto]', fb).forEach((b) => b.classList.toggle('is-on', +b.dataset.fbto === cur));
    $('[data-fb="-1"]', fb).disabled = cur === 0; $('[data-fb="1"]', fb).disabled = cur === n;
  };
  const go = (dir) => { const nx = Math.max(0, Math.min(n, cur + dir)); if (nx !== cur) { cur = nx; render(); } };
  $$('.fb__btn', fb).forEach((b) => b.addEventListener('click', () => go(+b.dataset.fb)));
  leaves.forEach((lf, i) => {
    $('.fb__side--front', lf).addEventListener('click', () => { if (i === cur) go(1); });
    $('.fb__side--back', lf).addEventListener('click', () => { if (i === cur - 1) go(-1); });
  });
  fb._goto = (k) => { cur = Math.max(0, Math.min(n, k)); render(); };
  $$('[data-fbto]', fb).forEach((b) => b.addEventListener('click', () => fb._goto(+b.dataset.fbto)));
  fb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  render();
});

// a trend card opens the book at its chapter
$$('.tr__go').forEach((b) => b.addEventListener('click', () => { const fb = $('.fb'); if (!fb) return; D.scrollTo ? D.scrollTo(fb.closest('.cs-sec')) : fb.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => fb._goto(+b.dataset.fbto), 700); }));

// countdown on a sealed project
$$('.cs-lock').forEach((box) => {
  const t = new Date(box.dataset.unlock).getTime(), u = (k) => $(`[data-u="${k}"]`, box);
  const tick = () => {
    let s = Math.max(0, Math.floor((t - Date.now()) / 1000));
    if (!s) { $('.cs-lock__k', box).textContent = 'Unveiled. The story is on its way.'; }
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    u('d').textContent = d; u('h').textContent = String(h).padStart(2, '0'); u('m').textContent = String(m).padStart(2, '0'); u('s').textContent = String(s).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
});

  // the chart grows in when it arrives
  const ch = $('.cs-chart');
  if (ch) new IntersectionObserver((ents, o) => ents.forEach((e) => { if (e.isIntersecting) { ch.classList.add('is-in'); o.disconnect(); } }), { threshold: .35 }).observe(ch);

  // motion
  if (hasG && !reduce) {
    gsap.from('.cs-back, .cs-eyebrow', { y: 16, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08, delay: .1 });
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
