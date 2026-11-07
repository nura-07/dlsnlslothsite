/* About page: collage parallax, framed flipbook, DLSNL Sloth logo animation */
(function () {
  const F = window.FishArt;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasG = !!window.gsap;
  if (hasG) gsap.registerPlugin(ScrollTrigger);
  const FR = (id) => `https://framerusercontent.com/images/${id}?scale-down-to=1024`;

  /* ---------- collage ---------- */
  const collage = document.getElementById('collage');
  if (hasG && !reduce) {
    gsap.from(collage.children, { y: 80, rotate: () => gsap.utils.random(-20, 20), opacity: 0, duration: 1.4, ease: 'elastic.out(1, .6)', stagger: .1, delay: .3 });
    const movers = [...collage.querySelectorAll('[data-depth]')].map(el => ({ el, d: +el.dataset.depth, x: gsap.quickTo(el, 'x', { duration: .8, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: .8, ease: 'power3' }) }));
    document.querySelector('.ab-hero').addEventListener('mousemove', (e) => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      movers.forEach(m => { m.x(nx * m.d * 26); m.y(ny * m.d * 20); });
    });
    gsap.to(".c2-fly", { keyframes: [{ xPercent: 30, yPercent: -20, rotation: 14, duration: .7 }, { xPercent: -10, yPercent: 15, rotation: -10, duration: .9 }, { xPercent: 0, yPercent: 0, rotation: 0, duration: .8 }], repeat: -1, ease: "sine.inOut" });
    gsap.to(".c2-hook", { rotation: 4, transformOrigin: "50% 0%", duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }

  /* ==========================================================
     FLIPBOOK — leaves rotate around the spine; drag or click
     ========================================================== */
  const faces = [
    { cover: true },
    { note: true },
    { img: FR('r0s22FrDQOdz11vpWcJahyahXE.jpg'), cap: 'A.S.L.-phabet — Deaf-awareness series' },
    { img: FR('TMPBf1C9ZKNnuuSGNDUPb3XOg.jpg'), cap: 'Understand.' },
    { img: FR('hmWWBK2NMnGU237q6DUyNKfds.jpg'), cap: 'Language.' },
    { img: FR('Vo4WZPM80wWgdHrVyUlFIpQhvrc.jpg'), cap: 'Listening.' },
    { img: FR('czPtVno45WKfoU9DwLwS8xbwY4.png'), cap: 'Character studies' },
    { img: FR('QsysRbgXY7csitaP84nzIAwSTM.jpg'), cap: 'Digital portrait' },
    { img: FR('acvsQH0pAm4FyWqI7f8FbwDeOeQ.jpg'), cap: 'Hand-painted denim' },
    { img: FR('pBSEBQctOnIFm0bOYLf8L4tItg.png'), cap: 'Surreal study' },
    { img: FR('NyWZQvlOOaXPEwmm9IIFvCRyDTE.png'), cap: 'Surreal study II' },
    { end: true }
  ];
  const book = document.getElementById('book');
  const label = document.getElementById('bookPage');
  let leaves = [], cur = 0, busy = false, single = false;

  const tilt = () => (Math.random() * 5 - 2.5).toFixed(1) + 'deg';
  function faceHTML(f, n) {
    if (f.cover) return `<div class="leaf__face leaf__face--front pg-cover"><span class="mono" style="opacity:.7">The Delusion Art Studio</span><p class="display" style="margin:14px 0">Sketch<br>book<br><em>Vol. I</em></p><img class="ink ink--cream" src="assets/ink/fish-swim.png" alt="" style="width:62%;margin-top:6px"></div>`;
    const side = n % 2 ? 'back' : 'front';
    let inner = '';
    if (f.note) inner = `<div class="pg-art" style="align-content:center;text-align:center"><p class="serif" style="font-style:italic;font-size:clamp(18px,2.2vw,28px);line-height:1.3;margin:0">"Personal work keeps the client work honest."</p><p class="mono" style="margin-top:16px;opacity:.7">— A.M.</p></div><span class="pg-stamp" style="right:10%;top:10%;transform:rotate(8deg)">${F.sparkle()}</span>`;
    else if (f.end) inner = `<div class="pg-art" style="align-content:center;text-align:center"><p class="display" style="font-size:clamp(26px,3.4vw,44px)">More in the<br><em>studio</em></p><a class="btn" style="margin-top:18px" href="https://www.instagram.com/delusion_art_studio/" target="_blank" rel="noopener">@delusion_art_studio</a></div>`;
    else inner = `<div class="pg-art"><img src="${f.img}" alt="${f.cap}" style="--r:${tilt()}" draggable="false" loading="lazy"><span class="tapebit" style="transform:translateX(-50%) rotate(${tilt()})"></span>${["lemon-slice", "fly-top", "", "fruitfly-side", "", "lemon-wedges"][n % 6] ? `<img class="ink pg-sticker" src="assets/ink/${["lemon-slice", "fly-top", "", "fruitfly-side", "", "lemon-wedges"][n % 6]}.png" alt="">` : ""}</div><p class="pg-cap">${f.cap}</p>`;
    return `<div class="leaf__face leaf__face--${side}">${inner}<span class="pg-no">${String(n + 1).padStart(2, '0')}</span></div>`;
  }
  function build() {
    single = matchMedia('(max-width: 700px)').matches;
    book.querySelectorAll('.leaf').forEach(l => l.remove());
    leaves = [];
    const per = single ? 1 : 2;
    const count = Math.ceil(faces.length / per);
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      const a = faces[i * per], b = single ? null : faces[i * per + 1];
      leaf.innerHTML = faceHTML(a, single ? 0 : i * 2).replace('leaf__face--back', 'leaf__face--front') +
        (b ? faceHTML(b, i * 2 + 1) : '<div class="leaf__face leaf__face--back"></div>') + '<span class="leaf__shade"></span>';
      if (single) leaf.querySelector('.pg-no') && (leaf.querySelector('.pg-no').textContent = String(i + 1).padStart(2, '0'));
      leaf.style.zIndex = count - i;
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    if (hasG) gsap.set(leaves, { transformPerspective: 2400 });
    cur = 0; update();
  }
  function update() {
    const total = leaves.length;
    if (cur === 0) label.textContent = 'Cover';
    else if (single) label.textContent = `${cur + 1} / ${total}`;
    else label.textContent = cur >= total ? 'The end' : `Pages ${cur * 2}–${cur * 2 + 1}`;
  }
  function flip(dir, fromAngle) {
    if (busy) return;
    const total = leaves.length;
    if (dir > 0 && cur >= total) return;
    if (dir < 0 && cur <= 0) return;
    const i = dir > 0 ? cur : cur - 1;
    const leaf = leaves[i], shade = leaf.querySelector('.leaf__shade');
    busy = true;
    leaf.style.zIndex = 200;
    const to = dir > 0 ? -180 : 0;
    leaf.style.visibility = "visible";
    const done = () => { leaf.style.zIndex = dir > 0 ? i + 1 : total - i; if (single && dir > 0) leaf.style.visibility = "hidden"; cur += dir; busy = false; update(); };
    if (!hasG || reduce) { leaf.style.transform = `rotateY(${to}deg)`; done(); return; }
    const tl = gsap.timeline({ onComplete: done });
    tl.to(leaf, { rotateY: to, duration: fromAngle !== undefined ? .6 : 1.15, ease: 'power2.inOut', transformPerspective: 2400 })
      .to(leaf, { keyframes: [{ skewY: dir > 0 ? -3 : 3, duration: .4 }, { skewY: 0, duration: .5 }], ease: 'sine.inOut' }, 0)
      .to(shade, { keyframes: [{ opacity: .55, duration: .5 }, { opacity: 0, duration: .5 }] }, 0);
  }
  build();
  let lastSingle = single;
  window.addEventListener('resize', () => { const s = matchMedia('(max-width: 700px)').matches; if (s !== lastSingle) { lastSingle = s; build(); } });
  document.getElementById('bookNext').addEventListener('click', () => flip(1));
  document.getElementById('bookPrev').addEventListener('click', () => flip(-1));
  document.addEventListener('keydown', (e) => {
    const r = book.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') flip(1); if (e.key === 'ArrowLeft') flip(-1);
  });

  // drag a page like paper
  let drag = null;
  book.addEventListener('pointerdown', (e) => {
    if (busy || e.target.closest('a')) return;
    const r = book.getBoundingClientRect();
    const right = single ? true : e.clientX > r.left + r.width / 2;
    const dir = single ? (e.clientX > r.left + r.width * .4 ? 1 : -1) : (right ? 1 : -1);
    if ((dir > 0 && cur >= leaves.length) || (dir < 0 && cur <= 0)) return;
    const i = dir > 0 ? cur : cur - 1;
    leaves[i].style.visibility = "visible";
    drag = { x0: e.clientX, dir, leaf: leaves[i], w: single ? r.width : r.width / 2, angle: dir > 0 ? 0 : -180 };
    drag.leaf.style.zIndex = 200;
    book.setPointerCapture(e.pointerId);
  });
  book.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const base = drag.dir > 0 ? 0 : -180;
    drag.angle = Math.max(-180, Math.min(0, base + dx / drag.w * 180));
    const bend = Math.sin(-drag.angle / 180 * Math.PI) * 4;
    drag.leaf.style.transform = `perspective(2400px) rotateY(${drag.angle}deg) skewY(${drag.dir > 0 ? -bend : bend}deg)`;
    drag.leaf.querySelector('.leaf__shade').style.opacity = Math.sin(-drag.angle / 180 * Math.PI) * .5;
  });
  const endDrag = () => {
    if (!drag) return;
    const d = drag; drag = null;
    const moved = d.dir > 0 ? d.angle < -1 : d.angle > -179;
    const commit = d.dir > 0 ? d.angle < -60 : d.angle > -120;
    if (!moved) { d.leaf.style.zIndex = d.dir > 0 ? leaves.length - cur : cur; flip(d.dir); return; } // a tap flips
    if (hasG) gsap.set(d.leaf, { rotateY: d.angle, skewY: 0, transformPerspective: 2400 });
    if (commit) flip(d.dir, d.angle);
    else {
      const i = leaves.indexOf(d.leaf);
      hasG && gsap.to(d.leaf, { rotateY: d.dir > 0 ? 0 : -180, duration: .5, ease: 'power2.out', onComplete: () => { d.leaf.style.zIndex = d.dir > 0 ? leaves.length - i : i + 1; } });
      d.leaf.querySelector('.leaf__shade').style.opacity = 0;
    }
  };
  book.addEventListener('pointerup', endDrag);
  book.addEventListener('pointercancel', endDrag);

  /* ==========================================================
     DLSNL SLOTH — the logo hangs from a branch, sways slowly,
     yawns now and then, and its stars twinkle.
     ========================================================== */
  document.getElementById('slothLogo').innerHTML = F.logo({ color: '#4A150F' });
  document.getElementById('spark1').innerHTML = F.sparkle({ fill: '#F51D26' });
  document.getElementById('spark2').innerHTML = F.sparkle({ fill: '#A2772E' });
  const hang = document.getElementById('slothHang');
  if (hasG && !reduce) {
    gsap.set(hang, { transformOrigin: '50% -10%' });
    gsap.from(hang, { y: -140, opacity: 0, duration: 2.6, ease: 'elastic.out(1, .4)', scrollTrigger: { trigger: '#sloth', start: 'top 70%' } });
    gsap.fromTo(hang, { rotation: -2.5 }, { rotation: 2.5, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: 3 })
      .to('#slothLogo', { scaleY: 1.05, scaleX: .98, transformOrigin: '50% 0%', duration: 1.4, ease: 'sine.inOut' })
      .to('#slothLogo', { scaleY: 1, scaleX: 1, duration: 1.8, ease: 'sine.inOut' });
    gsap.to('#spark1', { scale: .55, rotate: 45, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#spark2', { scale: 1.4, rotate: -45, opacity: .5, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .6 });
    const stage = document.getElementById('slothStage');
    stage.addEventListener('mouseenter', () => gsap.fromTo('#slothLogo', { rotation: 0 }, { keyframes: [{ rotation: 6, duration: .25 }, { rotation: -5, duration: .35 }, { rotation: 3, duration: .6 }, { rotation: 0, duration: 1.6 }], ease: 'sine.inOut', transformOrigin: '50% 0%' }));
  }
})();
