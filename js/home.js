/* Home page — engraving edition
   Intro (whole → peeling → spiral), hero swimmer, stacked plates,
   engraved fish-market crates with a wandering fly, journey, cast-a-line. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasG = !!window.gsap;
  if (hasG) gsap.registerPlugin(ScrollTrigger);
  const INK = window.SITE.INK;


  /* ==========================================================
     INTRO — one continuous movement:
     the whole fish peels head-to-tail into the spiral (the two
     peel stages overlap, so there's no pause), the ribbon slips
     off the hook, unravels and falls out of the bottom of the
     screen, and the hero sweeps up into place.
     ========================================================== */
  const intro = document.getElementById('intro');
  const sway = document.getElementById('introSway');
  const frA = intro.querySelector('.intro__frame--a');
  const frB = intro.querySelector('.intro__frame--b');
  const frC = intro.querySelector('.intro__frame--c');
  const cTop = intro.querySelector('.intro__frame--ctop');
  const cBody = intro.querySelector('.intro__frame--cbody');
  const seen = sessionStorage.getItem('dlsnl-intro') === '1' || /[?&]skip/.test(location.search) || location.hash.length > 1;
  let idle, done = false;

  // the hero sweeps up from below the fold
  function heroIn(fromIntro) {
    if (!hasG || reduce) return;
    const tl = gsap.timeline();
    if (fromIntro) {
      tl.from('.hero__inner', { y: '100vh', duration: 1.25, ease: 'expo.out' })
        .from('#heroFish', { y: '90vh', duration: 1.5, ease: 'expo.out' }, .08)
        .from('.hero__small', { y: '80vh', duration: 1.6, ease: 'expo.out', stagger: .08 }, .14)
        .from('.site-header', { y: -30, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .5)
        .from('.vertical-note, .hero__scroll, .hero__plate', { opacity: 0, duration: 1 }, .7);
    } else {
      tl.from('.hero__title .line > span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .08 })
        .from('.hero__eyebrow, .hero__lede, .hero__ctas', { y: 18, opacity: 0, duration: .8, ease: 'power3.out', stagger: .06 }, .3)
        .from('#heroFish', { x: '40vw', opacity: 0, duration: 1.8, ease: 'power3.out' }, 0)
        .from('.hero__small', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: .12 }, .4)
        .from('.site-header', { y: -24, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .5)
        .from('.vertical-note, .hero__scroll, .hero__plate', { opacity: 0, duration: 1 }, .8);
    }
  }
  function finish() {
    intro.remove();
    document.body.classList.remove('intro-open');
    sessionStorage.setItem('dlsnl-intro', '1');
    if (hasG) ScrollTrigger.refresh();
  }

  if (seen || !hasG) {
    intro.remove();
    heroIn(false);
  } else {
    document.body.classList.add('intro-open');
    gsap.set([frB, frC], { '--p': '-12%' });
    gsap.set([frA, frB], { '--h': '-32%' });
    if (!reduce) {
      gsap.set(sway, { rotation: -2 });
      idle = gsap.to(sway, { rotation: 2, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.from(sway, { y: '-100vh', duration: 1.8, ease: 'elastic.out(1, .6)' });
      gsap.from('.intro__plate, .intro__no, .intro__hint, .intro__corner, .intro__skip', { opacity: 0, y: 10, duration: 1, stagger: .08, delay: .9 });
    }
    intro.focus({ preventScroll: true });

    const unhook = (e) => {
      if (done) return;
      if (e && e.target && e.target.id === 'introSkip') return;
      done = true;
      if (reduce) { gsap.to(intro, { opacity: 0, duration: .4, onComplete: () => { finish(); heroIn(false); } }); return; }
      idle && idle.kill();
      const PEEL = 2.4; // seconds for each peel stage; the second starts halfway through the first
      gsap.timeline({ onComplete: () => { finish(); heroIn(true); } })
        .to('.intro__plate, .intro__no, .intro__hint, .intro__corner, .intro__skip', { opacity: 0, duration: .5 }, 0)
        // one slow, continuous twist on the line while it peels
        .to(sway, { rotation: 0, duration: .6, ease: 'sine.out' }, 0)
        .to(sway, { keyframes: [{ rotation: 3.5, duration: 1.4 }, { rotation: -3, duration: 1.6 }, { rotation: 1.5, duration: 1.2 }], ease: 'sine.inOut' }, .3)
        // stage 1 — whole → peeling (B reveals as A hides, same wipe line)
        .to(frB, { '--p': '118%', duration: PEEL, ease: 'sine.inOut' }, .2)
        .to(frA, { '--h': '118%', duration: PEEL, ease: 'sine.inOut' }, .2)
        // stage 2 — peeling → spiral, overlapping stage 1
        .to(frC, { '--p': '118%', duration: PEEL, ease: 'sine.inOut' }, .2 + PEEL * .5)
        .to(frB, { '--h': '118%', duration: PEEL, ease: 'sine.inOut' }, .2 + PEEL * .5)
        // the ribbon slips off the hook…
        .set([frA, frB, frC], { visibility: 'hidden' })
        .set([cTop, cBody], { visibility: 'visible' }, '<')
        .to(cBody, { y: 14, duration: .35, ease: 'power1.out' })
        // …unravels as it drops, and falls out of the screen
        .to(cBody, { scaleY: 1.5, scaleX: .78, rotation: 6, duration: 1.3, ease: 'power1.in' }, '>-0.05')
        .to(cBody, { y: '120vh', duration: 1.3, ease: 'power2.in' }, '<')
        .to(cBody, { opacity: 0, duration: .3 }, '-=.25')
        // the empty hook springs back and lifts away
        .to(sway, { rotation: -6, duration: .4, ease: 'power2.out' }, '-=1.2')
        .to(sway, { rotation: 0, y: '-60vh', duration: .9, ease: 'power3.in' }, '-=.7');
    };
    intro.addEventListener('click', unhook);
    intro.addEventListener('touchstart', unhook, { passive: true });
    intro.addEventListener('wheel', unhook, { passive: true });
    window.addEventListener('keydown', function k(e) { if (!document.body.contains(intro)) return window.removeEventListener('keydown', k); if (e.key !== 'Tab') unhook(e); });
    document.getElementById('introSkip').addEventListener('click', (e) => {
      e.stopPropagation(); done = true; idle && idle.kill();
      gsap.to(intro, { opacity: 0, duration: .5, onComplete: () => { finish(); heroIn(true); } });
    });
  }

  /* ---------- hero: the swimmer leaves as you scroll ---------- */
  if (hasG && !reduce) {
    gsap.to('#heroFish', { x: '-130vw', y: '-8vh', rotation: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: .7 } });
    gsap.to('.hero__small--a', { y: -160, x: 60, rotation: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__small--b', { y: -90, x: -120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner', { yPercent: -8, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: '45% top', end: 'bottom top', scrub: true } });
  }

  /* ---------- approach: horizontal stacked deck on desktop ---------- */
  const deck = document.getElementById('stack');
  if (hasG && !reduce && deck) {
    gsap.matchMedia().add('(min-width: 900px)', () => window.SITE.hstack(deck, [...deck.querySelectorAll('.stack__card')]));
  }

  /* ---------- swinging skill tags + counters ---------- */
  if (hasG && !reduce) {
    document.querySelectorAll('[data-swing]').forEach((row) => {
      const tags = row.querySelectorAll('.htag');
      gsap.from(tags, { rotate: () => gsap.utils.random(-24, 24), y: -16, opacity: 0, duration: 1.4, ease: 'elastic.out(1, .4)', stagger: .04, scrollTrigger: { trigger: row, start: 'top 85%' } });
      tags.forEach(t => t.addEventListener('mouseenter', () => gsap.fromTo(t, { rotate: 0 }, { keyframes: [{ rotate: 8, duration: .15 }, { rotate: -6, duration: .2 }, { rotate: 3, duration: .2 }, { rotate: 0, duration: .3 }], ease: 'sine.inOut' })));
    });
    document.querySelectorAll('[data-count]').forEach((el) => {
      const o = { n: 0 }, end = +el.dataset.count, suf = el.dataset.suffix || '';
      gsap.to(o, { n: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.n) + suf; }, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
  }

  /* ==========================================================
     FISH MARKET — engraved crates hold each project's cover
     ========================================================== */
  const P = window.PROJECTS || [];
  const fronts = ['crate-front', 'crate-front'];
  const crate = (p, i) => {
    const inner = p.cover
      ? `<div class="crate2__catch-in" style="background-image:url('${p.cover}')"></div>`
      : `<div class="crate2__catch-in is-text" style="background:${p.accent}"><span>${p.coverText || p.title}</span></div>`;
    return `<a class="crate2 rv" href="case.html?p=${p.slug}">
      <div class="crate2__vis">
        <div class="crate2__catch">${inner}</div>
        <div class="crate2__front">${INK(fronts[i % 2])}</div>
        <span class="crate2__stencil">${p.title}<small>${p.crateLabel}</small></span>
        <span class="crate2__tag"><b>Nº ${p.no}</b>${p.year}</span>
      </div>
      <div class="crate2__info"><h3>${p.title}${p.status ? ` <span class="crate__wip">${p.status}</span>` : ''}</h3><p>${p.kicker}</p></div>
    </a>`;
  };
  document.getElementById('cratesMajor').innerHTML = P.filter(p => p.tier === 'major').map(crate).join('');
  document.getElementById('cratesMinor').innerHTML = P.filter(p => p.tier === 'minor').map(crate).join('');
  if (hasG && !reduce) {
    gsap.utils.toArray('.crate2').forEach((c, i) => gsap.from(c.querySelector('.crate2__catch'), { yPercent: 80, duration: 1.3, ease: 'back.out(1.5)', delay: (i % 4) * .08, scrollTrigger: { trigger: c, start: 'top 88%' } }));
  }

  // a market fly that wanders, and darts away from the cursor
  const fly = document.getElementById('fly');
  const market = document.getElementById('work');
  if (fly && hasG && !reduce) {
    const W = () => market.clientWidth, H = () => market.clientHeight;
    let wander;
    const go = () => {
      const fx = gsap.getProperty(fly, 'x'), fy = gsap.getProperty(fly, 'y');
      const x = gsap.utils.random(40, W() - 80), y = gsap.utils.random(60, H() * .45);
      wander = gsap.to(fly, { x, y, rotation: Math.atan2(y - fy, x - fx) * 180 / Math.PI + 90, duration: gsap.utils.random(1.6, 3.2), ease: 'sine.inOut', onComplete: () => gsap.delayedCall(gsap.utils.random(.4, 1.6), go) });
    };
    gsap.set(fly, { x: W() * .7, y: 120 });
    ScrollTrigger.create({ trigger: market, start: 'top bottom', once: true, onEnter: go });
    market.addEventListener('mousemove', (e) => {
      const r = market.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const fx = gsap.getProperty(fly, 'x'), fy = gsap.getProperty(fly, 'y');
      if (Math.hypot(mx - fx, my - fy) < 120) {
        wander && wander.kill(); gsap.killTweensOf(go);
        const ang = Math.atan2(fy - my, fx - mx);
        const nx = gsap.utils.clamp(20, W() - 60, fx + Math.cos(ang) * 260), ny = gsap.utils.clamp(20, H() - 60, fy + Math.sin(ang) * 200);
        wander = gsap.to(fly, { x: nx, y: ny, rotation: ang * 180 / Math.PI + 90, duration: .45, ease: 'power3.out', onComplete: () => gsap.delayedCall(.8, go) });
      }
    });
  }

  /* ---------- logo loop (typeset wordmarks until logo files arrive) ---------- */
  const brands = [['GradRight', 'sans'], ['Capcons Analytics', 'mono'], ['Zen Barefoot', 'display'], ['yoho', 'sans'], ['little things by Shivani', 'serif'], ['Ralf Iwan Academy', 'serif'], ['Transformative Ventures', 'display'], ['Indian Army', 'mono']];
  const one = brands.map(([n, s]) => `<span class="logo-w logo-w--${s}">${window.FishArt.sparkle()}${n}</span>`).join('');
  document.getElementById('logos').innerHTML = one + one;

  /* ==========================================================
     CONTACT — drag the engraved hook; the line follows
     ========================================================== */
  const rig = document.getElementById('rig');
  const lure = document.getElementById('lure');
  const line = document.querySelector('#castLine path');
  const toast = document.getElementById('toast');
  const card = document.getElementById('castCard');
  let subject = 'A brand identity project';
  const pos = { x: 0, y: 0, vx: 0, vy: 0 };
  document.querySelectorAll('.bait button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.bait button').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    subject = b.dataset.subject;
    card.href = `mailto:${window.SITE.EMAIL}?subject=${encodeURIComponent(subject)}`;
    pos.vy -= 16; pos.vx += (Math.random() - .5) * 18;
  }));
  card.href = `mailto:${window.SITE.EMAIL}?subject=${encodeURIComponent(subject)}`;

  let rest = { x: 0, y: 0 }, anchor = { x: 0, y: 0 }, dragging = false, dragOff = { x: 0, y: 0 }, moved = 0, caught = false;
  function measure() {
    const Wd = rig.clientWidth, Hd = rig.clientHeight;
    anchor = { x: Wd * .55, y: -10 };
    rest = { x: Wd * .55 - lure.offsetWidth / 2, y: Hd * .28 };
    if (!pos.x && !pos.y) { pos.x = rest.x; pos.y = rest.y - 200; }
  }
  measure();
  window.addEventListener('resize', measure);
  function draw() {
    const hx = pos.x + lure.offsetWidth / 2, hy = pos.y + 4;
    const sag = Math.max(10, 80 - Math.abs(hy - anchor.y) * .12) + Math.abs(pos.vx) * .6;
    line.setAttribute('d', `M${anchor.x} ${anchor.y} Q${(anchor.x + hx) / 2 + pos.vx * 1.4} ${(anchor.y + hy) / 2 + sag} ${hx} ${hy}`);
    const tilt = Math.max(-25, Math.min(25, -pos.vx * .9 + (hx - anchor.x) * -.03));
    lure.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${tilt}deg)`;
  }
  function tick() {
    if (!dragging) {
      pos.vx = (pos.vx + (rest.x - pos.x) * .045) * .86;
      pos.vy = (pos.vy + (rest.y - pos.y) * .045 + .2) * .86;
      pos.x += pos.vx; pos.y += pos.vy;
    }
    draw();
    requestAnimationFrame(tick);
  }
  if (!reduce) requestAnimationFrame(tick); else { pos.x = rest.x; pos.y = rest.y; draw(); }
  const showToast = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('is-on'), 2600); };
  lure.addEventListener('pointerdown', (e) => {
    dragging = true; moved = 0; caught = false;
    const r = rig.getBoundingClientRect();
    dragOff = { x: e.clientX - r.left - pos.x, y: e.clientY - r.top - pos.y };
    lure.setPointerCapture(e.pointerId);
  });
  lure.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = rig.getBoundingClientRect();
    const nx = e.clientX - r.left - dragOff.x, ny = e.clientY - r.top - dragOff.y;
    pos.vx = nx - pos.x; pos.vy = ny - pos.y;
    moved += Math.abs(pos.vx) + Math.abs(pos.vy);
    pos.x = nx; pos.y = Math.min(ny, rig.clientHeight - 60);
    if (!caught && pos.y - rest.y > rig.clientHeight * .28) {
      caught = true;
      (navigator.clipboard ? navigator.clipboard.writeText(window.SITE.EMAIL) : Promise.reject())
        .then(() => showToast('Caught! Email copied — paste it anywhere.'))
        .catch(() => showToast(window.SITE.EMAIL));
    }
  });
  const release = () => { dragging = false; };
  lure.addEventListener('pointerup', release);
  lure.addEventListener('pointercancel', release);
  card.addEventListener('click', (e) => { if (moved > 8) e.preventDefault(); });

  const bub = document.querySelector('.cast__bubbles');
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('span'), s = 6 + Math.random() * 14;
    Object.assign(b.style, { left: Math.random() * 100 + '%', width: s + 'px', height: s + 'px', animationDelay: (-Math.random() * 9) + 's', animationDuration: (8 + Math.random() * 8) + 's' });
    bub.appendChild(b);
  }
})();
