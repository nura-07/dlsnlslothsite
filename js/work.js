/* =========================================================
   All work, every project as a card, built from data/projects.js.
   Big projects take half the row, small ones a third.
   Filter: all / big / small.
   ========================================================= */
(function () {
  const D = window.DLSNL;
  const { $, $$, reduce, hasG } = D;
  const P = window.PROJECTS || [];
  const ICONS = window.PROJECT_ICONS || {};
  const grid = $('#grid');

  // local covers where we have them; a type cover where we don't
  const COVER = {
    herbius: 'assets/herbius/cover.webp',
    'zen-barefoot': 'assets/zen/shoe-1.jpg',
    'sena-diwas-2027': null,
    'little-things-by-shivani': 'assets/little/logo-stacked.webp',
    'trend-book': null
  };
  const TYPE = { 'trend-book': 'Three<br><em>futures</em>' };
  // one headline number per project (same as the home index)
  const FACT = {
    herbius: ['225', 'ads in six months'],
    'nari-sashaktikaran': ['1 mark', 'for an all-women rally'],
    'zen-barefoot': ['12K', 'Instagram followers'],
    gradright: ['13+', 'lenders, plus university campaigns'],
    'sena-diwas-2027': ['Soon', 'unveiled after Army Day'],
    'little-things-by-shivani': ['18K+', 'on Instagram'],
    'trend-book': ['3', 'futures, decoded']
  };
  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg>';
  const short = (t) => String(t || '').split(/,|\(/)[0].trim();

  const card = (p) => {
    const cover = p.slug in COVER ? COVER[p.slug] : p.cover;
    const f = FACT[p.slug];
    const role = p.meta && p.meta.Role;
    const kick = String(p.kicker || '').split('·').map((s) => s.trim()).filter(Boolean);
    return `<li class="wc wc--${p.tier}" data-tier="${p.tier}" style="--c:${p.accent}">
      <a href="case.html?p=${p.slug}" data-cursor="Open case">
        <div class="wc__cover${p.coverLight ? ' wc__cover--light' : ''}">${cover
          ? `<span class="fit-bg" style="background-image:url('${D.asset(cover)}')" aria-hidden="true"></span><img src="${D.asset(cover)}" alt="" loading="lazy" />`
          : p.bookCover ? `<div class="wc__type wc__type--book"><div class="bk"><div class="bk__front"><span class="bk__k">A research document</span><b>${p.title}</b><span class="bk__s">Three futures, decoded</span></div><div class="bk__pages"></div><div class="bk__spine"></div></div></div>` : `<div class="wc__type"><span>${TYPE[p.slug] || p.coverText || p.title}</span></div>`}
          <span class="wc__no">${p.no}</span>
          ${p.status ? `<span class="wc__status">${p.status}</span>` : ''}
        </div>
        <div class="wc__body">
          <div class="wc__top">
            <span class="wc__icon" aria-hidden="true"><svg viewBox="0 0 48 48">${(ICONS[p.slug] || '').replace(/<(path|circle|ellipse)/g, '<$1 pathLength="1"')}</svg></span>
            <span class="wc__who">${short(p.client)}<small>${p.year}</small></span>
            <span class="wc__go" aria-hidden="true">${arrow}</span>
          </div>
          <h2 class="wc__title">${p.title}</h2>
          <p class="wc__line">${p.oneLiner}</p>
          <p class="wc__sum">${p.summary || ''}</p>
          <dl class="wc__facts">
            ${f ? `<div class="wc__fact"><dt>${f[1]}</dt><dd>${f[0]}</dd></div>` : ''}
            ${role ? `<div><dt>Role</dt><dd>${short(role)}</dd></div>` : ''}
          </dl>
          <ul class="wc__tags">${kick.map((t) => `<li>${t}</li>`).join('')}</ul>
        </div>
      </a>
    </li>`;
  };
  grid.innerHTML = P.map(card).join('');

  // counts on the filter
  const n = { all: P.length, major: P.filter((p) => p.tier === 'major').length, minor: P.filter((p) => p.tier === 'minor').length };
  const tabs = $$('.wk-filter button'), pill = $('.wk-filter__pill');
  tabs.forEach((b) => { b.querySelector('small').textContent = n[b.dataset.f]; });
  const movePill = () => { const on = tabs.find((b) => b.getAttribute('aria-selected') === 'true'); if (!on) return; pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(movePill);
  addEventListener('resize', movePill);

  let cur = 'all';
  const apply = (f) => $$('.wc', grid).forEach((el) => { el.hidden = !(f === 'all' || el.dataset.tier === f); });
  tabs.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.f; if (f === cur) return; cur = f;
    tabs.forEach((x) => x.setAttribute('aria-selected', x === b)); movePill();
    const all = $$('.wc', grid);
    if (hasG && !reduce) {
      gsap.to(all.filter((el) => !el.hidden), { y: -14, opacity: 0, filter: 'blur(6px)', duration: .3, ease: 'power2.in', stagger: .02, onComplete: () => {
        apply(f);
        gsap.fromTo(all.filter((el) => !el.hidden), { y: 24, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .8, ease: 'expo.out', stagger: .05, clearProps: 'filter' });
        ScrollTrigger.refresh(); D.lenis && D.lenis.resize();
        if (grid.getBoundingClientRect().top < 0) (D.lenis ? D.lenis.scrollTo(grid, { offset: -120, duration: 1 }) : scrollTo({ top: grid.getBoundingClientRect().top + scrollY - 120, behavior: "smooth" }));
      } });
    } else apply(f);
  }));
  // ?f=minor opens on a filter
  const qf = new URLSearchParams(location.search).get('f');
  if (qf && n[qf] && qf !== 'all') { const b = tabs.find((x) => x.dataset.f === qf); cur = qf; tabs.forEach((x) => x.setAttribute('aria-selected', x === b)); apply(qf); }

  // the cover tilts a little toward the pointer
  if (D.fine && !reduce) {
    $$('.wc a', grid).forEach((a) => {
      const c = a.querySelector('.wc__cover');
      a.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width).toFixed(3));
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height).toFixed(3));
      });
    });
  }

  D.tintLogo().then(() => hasG && ScrollTrigger.refresh());

  if (hasG && !reduce) {
    gsap.from('.wk-back, .wk-hero__side', { y: 16, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08, delay: .1 });
    D.scramble($('.wk-title'), { duration: 1 });
    $$('.wc', grid).forEach((el, i) => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', delay: i < 4 ? .25 + i * .07 : 0, scrollTrigger: { trigger: el, start: 'top 92%' } }));
  }
  if (D.lenis) setTimeout(() => D.lenis.resize(), 600);
  addEventListener('load', () => hasG && ScrollTrigger.refresh());
})();
