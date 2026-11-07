/* ==========================================================
   Shared: header (logo + fish-line menu), mobile fish rack,
   footer, page transitions, reveals, lightbox.
   ========================================================== */
(function () {
  const F = window.FishArt;
  const EMAIL = 'delusionalsloth.art@gmail.com';
  const RESUME = 'assets/Arundhati-Mitra-Resume.pdf';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page || 'home';

  const NAV = [
    { label: 'Work', href: 'work.html', key: 'work' },
    { label: 'About', href: 'about.html', key: 'about' },
    { label: 'Approach', href: 'index.html#approach', key: 'approach' },
    { label: 'Journey', href: 'index.html#journey', key: 'journey' },
    { label: 'Contact', href: 'index.html#contact', key: 'contact' }
  ];
  const SOCIAL = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arundhati-mitra-07/' },
    { label: 'Behance', href: 'https://www.behance.net/arundhatimitra' },
    { label: 'Instagram — art', href: 'https://www.instagram.com/delusion_art_studio/' },
    { label: 'Instagram — studio', href: 'https://instagram.com/delusional_sloth' },
    { label: 'Email', href: 'mailto:' + EMAIL }
  ];
  const INK = (n, cream) => `<img class="ink${cream ? " ink--cream" : ""}" src="assets/ink/${n}.png" alt="" decoding="async">`;
  /* Horizontal stacked deck: the section pins, and each card slides in
     from the right to rest a little to the right of the one before,
     so the deck fans out sideways as you scroll. Desktop only. */
  function hstack(container, cards, opts = {}) {
    if (!window.gsap || !window.ScrollTrigger || cards.length < 2) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = cards.length, off = opts.offset || 34;
    gsap.set(cards, { x: (i) => (i === 0 ? 0 : window.innerWidth * 1.1), zIndex: (i) => i + 1, transformOrigin: 'left center' });
    const count = document.createElement('span');
    count.className = 'hstack__count';
    count.textContent = `1 of ${n}`;
    container.appendChild(count);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container, start: opts.start || 'center center', end: () => '+=' + (n - 1) * window.innerHeight * .65,
        pin: opts.pin || true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.round(self.progress * (n - 1)));
          count.textContent = `${i + 1} of ${n}`;
          opts.onIndex && opts.onIndex(i);
        }
      }
    });
    for (let i = 1; i < n; i++) {
      tl.to(cards[i], { x: i * off, ease: 'power2.out', duration: 1 }, i - 1)
        .to(cards.slice(0, i), { scale: (k) => 1 - (i - k) * .025, duration: 1, ease: 'none' }, i - 1);
    }
    return () => { count.remove(); };
  }

  window.SITE = { EMAIL, RESUME, NAV, SOCIAL, INK, hstack };
  document.documentElement.classList.add('js');

  /* ---------------- header ---------------- */
  const header = document.createElement('header');
  header.className = 'site-header';
  const strLens = [18, 30, 22, 34, 26];
  header.innerHTML = `
    <a class="brand-mark" href="index.html" aria-label="DLSNL Sloth — home">${F.logo({ color: '#4A150F', tagline: false })}</a>
    <nav class="fishline" aria-label="Main">
      <svg class="fishline__rope" viewBox="0 0 300 40" preserveAspectRatio="none"><path d="M4 10 Q150 34 296 10"/></svg>
      <span class="fishline__pin" style="left:0"></span><span class="fishline__pin" style="right:0"></span>
      <div class="fishline__items">
      ${NAV.map((n, i) => `<a class="fishline__item ${page === n.key ? 'is-active' : ''}" href="${n.href}" data-i="${i}">
          <span class="fishline__string" style="height:${strLens[i]}px"></span>${INK("hang-single-hook")}<span class="fishline__label">${n.label}</span></a>`).join('')}
      </div>
      <button class="fishline__toggle" aria-label="Open menu" aria-expanded="false"></button>
    </nav>`;
  document.body.prepend(header);

  const line = header.querySelector('.fishline');
  const items = [...line.querySelectorAll('.fishline__item')];
  // y on the quadratic rope for a given x (0..300)
  const ropeY = (x) => { const t = x / 300; return (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 34 + t * t * 10 - 6; };
  function layout(spread) {
    const W = line.clientWidth;
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    items.forEach((el, i) => {
      const x = mobile ? 22 + i * 26 : spread ? 18 + i * ((W - 50) / (items.length - 1)) : W - 150 + i * 22;
      el.style.left = (x - 15) + 'px';
      el.style.top = ropeY(x * 300 / W) + 'px';
      el.querySelector('.fishline__string').style.height = (spread ? strLens[i] + 6 : strLens[i] * .7) + 'px';
    });
  }
  const isMobile = () => window.matchMedia('(max-width: 820px)').matches;
  layout(false);
  window.addEventListener('resize', () => layout(false));
  if (!reduce) {
    line.addEventListener('mouseenter', () => { if (!isMobile()) layout(true); });
    line.addEventListener('mouseleave', () => layout(false));
    line.addEventListener('focusin', () => { if (!isMobile()) layout(true); });
    line.addEventListener('focusout', (e) => { if (!line.contains(e.relatedTarget)) layout(false); });
    items.forEach((el, i) => {
      el.addEventListener('mouseenter', () => window.gsap && gsap.fromTo(el, { rotate: 0 }, { rotate: i % 2 ? 12 : -12, duration: .25, yoyo: true, repeat: 3, ease: 'sine.inOut', onComplete: () => gsap.to(el, { rotate: 0, duration: .6, ease: 'elastic.out(1,.3)' }) }));
    });
    // idle sway so the line feels alive
    if (window.gsap) items.forEach((el, i) => gsap.to(el, { rotate: (i % 2 ? 4 : -4), duration: 1.6 + i * .25, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .2 }));
  } else { line.addEventListener('mouseenter', () => layout(true)); line.addEventListener('mouseleave', () => layout(false)); }

  /* ---------------- mobile rack ---------------- */
  const rack = document.createElement('div');
  rack.className = 'rack';
  rack.setAttribute('aria-hidden', 'true');
  const rackItems = [{ label: 'Home', href: 'index.html' }, ...NAV, { label: 'Résumé', href: RESUME }];
  rack.innerHTML = `
    <div class="rack__top"><span class="mono">Arundhati's Delusional Sloth Studio</span><button class="rack__close">Close</button></div>
    <div class="rack__line">${rackItems.map((n, i) => `<a class="rack__item" href="${n.href}" ${n.href.endsWith('.pdf') ? 'target="_blank" rel="noopener"' : ''}><span class="str" style="height:${30 + (i % 3) * 34}px"></span>${INK("hang-single-hook", true)}<b>${n.label}</b></a>`).join('')}</div>
    <div class="rack__foot">${SOCIAL.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join('')}</div>`;
  document.body.appendChild(rack);
  const toggle = line.querySelector('.fishline__toggle');
  const openRack = (open) => {
    rack.classList.toggle('is-open', open);
    rack.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && window.gsap && !reduce) gsap.fromTo(rack.querySelectorAll('.rack__item'), { y: -120, rotate: () => gsap.utils.random(-25, 25) }, { y: 0, rotate: 0, duration: 1.2, ease: 'elastic.out(1,.4)', stagger: .06, delay: .2 });
  };
  toggle.addEventListener('click', () => openRack(true));
  rack.querySelector('.rack__close').addEventListener('click', () => openRack(false));
  rack.querySelectorAll('a').forEach(a => a.addEventListener('click', () => openRack(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') openRack(false); });

  // hide header on scroll down, show on up
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-hidden', y > 300 && y > lastY + 4);
    if (y < lastY - 4 || y < 300) header.classList.remove('is-hidden');
    header.classList.toggle('is-scrolled', y > 60);
    document.body.classList.toggle('hdr-on', y > 60 && !header.classList.contains('is-hidden'));
    lastY = y;
  }, { passive: true });

  /* ---------------- footer ---------------- */
  const foot = document.getElementById('site-footer');
  if (foot) {
    foot.className = 'site-footer';
    foot.innerHTML = `
      <div class="footer__art">${INK("branch-three", true)}</div>
      <div class="footer__top wrap">
        <div class="footer__brand">
          <div class="footer__logo">${F.logo({ color: '#FFFBFC' })}</div>
          <p class="footer__tag">Delusional enough to dream it. Slow enough to get it right.</p>
        </div>
        <div class="footer__col"><h3>Wander</h3><ul>
          <li><a href="index.html">${INK("hang-single-hook", true)}Home</a></li>
          ${NAV.map(n => `<li><a href="${n.href}">${INK("hang-single-hook", true)}${n.label}</a></li>`).join('')}
          <li><a href="${RESUME}" target="_blank" rel="noopener">${INK("hang-single-hook", true)}Résumé (PDF)</a></li>
        </ul></div>
        <div class="footer__col"><h3>Say hello</h3><ul>
          ${SOCIAL.map(s => `<li><a href="${s.href}" ${s.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${INK("hang-single-hook", true)}${s.label}</a></li>`).join('')}
        </ul></div>
      </div>
      <p class="footer__big" aria-hidden="true">DLSNL SLOTH STUDIO</p>
      <div class="footer__bottom wrap">
        <span>© ${new Date().getFullYear()} Arundhati Mitra</span>
        <span>Brand · Campaigns · Launch systems</span>
        <a href="#top" class="link-u" data-top>Back to the surface ↑</a>
      </div>`;
    foot.querySelector('[data-top]').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------------- page transitions ---------------- */
  const pt = document.createElement('div');
  pt.className = 'pt';
  pt.innerHTML = `<div class="pt__panel pt__panel--2"></div><div class="pt__panel"></div><div class="pt__fish">${INK("fish-swim", true)}</div>`;
  document.body.appendChild(pt);
  const [p2, p1] = pt.querySelectorAll('.pt__panel');
  const ptFish = pt.querySelector('.pt__fish');
  const cameIn = sessionStorage.getItem('dlsnl-pt') === '1';
  sessionStorage.removeItem('dlsnl-pt');
  if (cameIn && window.gsap && !reduce) {
    gsap.set([p1, p2], { yPercent: 0 });
    gsap.set(ptFish, { opacity: 1, x: 0 });
    const tl = gsap.timeline({ delay: .1 });
    tl.to(ptFish, { x: '70vw', opacity: 0, duration: .7, ease: 'power2.in' })
      .to(p1, { yPercent: -100, duration: .8, ease: 'power4.inOut' }, '-=.35')
      .to(p2, { yPercent: -100, duration: .8, ease: 'power4.inOut' }, '-=.68')
      .set([p1, p2], { yPercent: 100 });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    const samePage = url.pathname === location.pathname || (url.pathname.endsWith('/') && location.pathname.endsWith('index.html'));
    if (samePage && url.hash) return; // in-page anchor
    if (samePage && !url.hash && url.search === location.search) return;
    if (!window.gsap || reduce) return;
    e.preventDefault();
    sessionStorage.setItem('dlsnl-pt', '1');
    gsap.timeline({ onComplete: () => { location.href = a.href; } })
      .fromTo(p2, { yPercent: 100 }, { yPercent: 0, duration: .55, ease: 'power4.inOut' })
      .fromTo(p1, { yPercent: 100 }, { yPercent: 0, duration: .55, ease: 'power4.inOut' }, '-=.42')
      .fromTo(ptFish, { x: '-70vw', opacity: 1 }, { x: 0, duration: .55, ease: 'power3.out' }, '-=.3');
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted && window.gsap) { gsap.set([p1, p2], { yPercent: 100 }); gsap.set(ptFish, { opacity: 0 }); } });

  /* ---------------- reveals ---------------- */
  window.addEventListener('load', () => {
    if (!window.gsap || !window.ScrollTrigger || reduce) { document.querySelectorAll('.rv').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch('.rv', { start: 'top 88%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08, overwrite: true }) });
  });

  /* ---------------- lightbox ---------------- */
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<img alt=""><button>Close</button>';
  document.body.appendChild(lb);
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-zoom]');
    if (g) { lb.querySelector('img').src = g.dataset.zoom; lb.querySelector('img').alt = g.dataset.alt || ''; lb.classList.add('is-on'); }
    else if (e.target.closest('.lb')) lb.classList.remove('is-on');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-on'); });
})();
