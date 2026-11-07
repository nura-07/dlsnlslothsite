/* =========================================================
   Herbius, the custom sections for this case study.
   case2.js builds the opening, jump bar and next project;
   this file supplies the story in between and wires up its
   interactions. Copy is kept short, in the voice of the CV.
   ========================================================= */
(function () {
  const A = (p) => (window.DLSNL ? window.DLSNL.asset(p) : p);
  const img = (n) => A(`assets/herbius/${n}.webp`);
  const STAR = 'M50 0C53 35 65 47 100 50 65 53 53 65 50 100 47 65 35 53 0 50 35 47 47 35 50 0Z';
  const star = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${STAR}"/></svg>`;
  const plus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>';
  const LANG = { en: 'English', it: 'Italian', nl: 'Dutch' };

  /* ---------- 1 · the whole launch at a glance ---------- */
  const SCOPE = [
    ['Positioning', 'Shilajit, rewritten for women over 40.', 'me', 'gap'],
    ['Packaging', 'Two cartons, dieline to press.', 'co', 'packaging'],
    ['225 ads', 'Five angles, three languages.', 'me', 'angles'],
    ['Landing pages', 'Figma to coded HTML, for every market.', 'me', 'page'],
    ['Market adaptation', 'US, UK, Italy, Netherlands. Rewritten, not translated.', 'me', 'markets'],
    ['AI workflow', 'A Claude skill for every station.', 'me', 'system'],
    ['Ebooks', 'One per angle, in English, Italian and Dutch.', 'me', 'ebooks'],
    ['Email', 'Klaviyo flows per market, written and coded.', 'me', ''],
    ['Bundles', 'Three offers, anchored on the 90-day supply.', 'team', ''],
    ['Marketplaces', 'Amazon and TikTok Shop listings.', 'team', ''],
    ['Creators', 'Influencer footage cut into ads, plus subscribe and save.', 'team', '']
  ];
  const OWN = { me: 'Led by me', co: 'Co-designed', team: 'With the team' };
  const overview = `
    <p class="hb-lead">A new supplement for women over 40, from the brief to the post-purchase email, in six markets. Pick a piece to jump to it.</p>
    <ul class="scope">${SCOPE.map(([t, d, o, link]) => `
      <li class="scope__item scope__item--${o}">
        ${link ? `<a href="#${link}" data-cursor="Jump there">` : '<div>'}
          <span class="scope__own">${OWN[o]}</span>
          <b>${t}</b><span class="scope__d">${d}</span>
          ${link ? `<i class="scope__go" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 13 13 3M5 3h8v8"/></svg></i>` : ''}
        ${link ? '</a>' : '</div>'}
      </li>`).join('')}
    </ul>`;

  /* ---------- 2 · the gap: the shelf ---------- */
  function shelf() {
    return `<figure class="shelf shelf--photo">
      <div class="shelf__shot"><img src="${img('shelf')}" alt="Herbius Shilajit and Ashwa Resin in cream and orange, between competitors' black jars with gold labels" loading="lazy" /><i class="shelf__spot" aria-hidden="true"></i></div>
      <figcaption><span><i class="sw sw--them"></i>The category: black jars, gold labels, made for men</span><span><i class="sw sw--herb"></i>Herbius: sunlit orange and soft cream</span></figcaption>
    </figure>`;
  }

  /* ---------- 3 · packaging: dieline → press → cartons ---------- */
  const packaging = `
    <ol class="press">
      <li class="press__step"><figure><img src="${img('dieline-signed')}" alt="Herbius Shilajit dieline, signed off" loading="lazy" /></figure><span class="press__n">01</span><b>Dieline signed off</b><span>Herbius Shilajit, approved for print.</span></li>
      <li class="press__step press__step--reel"><figure><img src="${img('press-proof')}" alt="Ashwa Resin carton proof on the press table" loading="lazy" />
        <div class="reel">${[1, 2, 3].map((i) => `<video src="${A(`assets/herbius/press-${i}.mp4`)}" muted loop playsinline preload="none" aria-label="Cartons being printed and cut"></video>`).join('')}</div></figure>
        <span class="press__n">02</span><b>On press</b><span>Colour checked at the printer. Hover to watch the run.</span></li>
      <li class="press__step"><figure><img src="${img('cartons')}" alt="Finished Ashwa Resin and Herbius Shilajit cartons" loading="lazy" /></figure><span class="press__n">03</span><b>Finished cartons</b><span>Orange for Ashwa Resin, cream and mountain brown for Shilajit.</span></li>
    </ol>
    <div class="packs"><img src="${img('prod-pack-ashwa')}" alt="Ashwa Resin carton and jar" loading="lazy" /><img src="${img('prod-pack-shilajit')}" alt="Herbius Shilajit carton and jar" loading="lazy" /></div>`;

  /* ---------- 4 · five angles: filterable wall of real ads ---------- */
  const CATS = [
    ['all', 'All angles', 'Every ad was written to one woman at a time, in her words.'],
    ['libido', 'Libido', 'The angle nobody else would say out loud. It became 162 of the 225 ads.'],
    ['energy', 'Energy', 'For her third coffee by 11am, and the 3pm slump.'],
    ['meno', 'Menopause', 'Heat, restless nights, running on empty.'],
    ['joints', 'Joints', 'Creaky knees and stiff mornings at 50.'],
    ['men', 'Men', 'The same jar, for him, to widen the base.'],
    ['review', 'Reviews', 'Customers in their own words, as quotes and short videos.']
  ];
// one tile per visual; each lists every language it ran in
const ADS = [
  ['libido-en-1', 'libido', 'EN IT NL'], ['energy-en-1', 'energy', 'EN IT'], ['meno-en-1', 'meno', 'EN IT'], ['men-it-1', 'men', 'IT'],
  ['review-en-1', 'review', 'EN IT NL'], ['libido-en-2', 'libido', 'EN IT'], ['energy-it-2', 'energy', 'IT NL'], ['joints-en-1', 'joints', 'EN IT'],
  ['libido-nl-2', 'libido', 'NL'], ['meno-nl-1', 'meno', 'NL'], ['men-en-1', 'men', 'EN'], ['energy-en-2', 'energy', 'EN'],
  ['meno-it-2', 'meno', 'IT'], ['review-nl-2', 'review', 'NL'], ['men-it-2', 'men', 'IT'], ['review-en-2', 'review', 'EN']
];
const arrowL = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>';
const arrowR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>';
const angles = `
  <div class="hbang">
    <ul class="adstat" aria-label="The ads at a glance">
      <li class="adstat__big"><b>225</b><span>ads in market, May to Oct 2026</span></li>
      <li class="adstat__big"><b>162</b><span>on the libido angle</span></li>
      <li class="adstat__lang"><i>NL</i><b>107</b><span>Dutch</span></li>
      <li class="adstat__lang"><i>IT</i><b>92</b><span>Italian</span></li>
      <li class="adstat__lang"><i>EN</i><b>26</b><span>English</span></li>
    </ul>
    <div class="hbang__bar" role="tablist" aria-label="Ad angle">${CATS.map(([k, label], i) => `<button role="tab" aria-selected="${i === 0}" data-cat="${k}">${label}</button>`).join('')}</div>
    <p class="hbang__note" aria-live="polite">${CATS[0][2]}</p>
    <div class="strip">
      <button class="strip__nav strip__nav--l" aria-label="Previous ads">${arrowL}</button>
      <div class="strip__track" tabindex="0" aria-label="Ads for the chosen angle. Scroll sideways for more.">${ADS.map(([n, cat, langs]) => `<figure class="ad" data-cat="${cat}"><img src="${img('ad-' + n)}" alt="${cat} ad, ran in ${langs.split(' ').map((l) => LANG[l.toLowerCase()]).join(', ')}" /><span class="ad__lang">${langs.split(' ').map((l) => `<i>${l}</i>`).join('')}</span></figure>`).join('')}</div>
      <button class="strip__nav strip__nav--r" aria-label="More ads">${arrowR}</button>
    </div>
    <div class="hbang__foot">
      <div class="mini-chart" aria-label="Libido share of new creatives each month: May 4 of 13, June 7 of 12, July 35 of 38, August 43 of 73, September 61 of 76, October 12 of 13">
        ${[[4, 13, 'May'], [7, 12, 'Jun'], [35, 38, 'Jul'], [43, 73, 'Aug'], [61, 76, 'Sep'], [12, 13, 'Oct']].map(([l, t, m]) => `<div class="mc"><i style="--t:${t / 76};--l:${l / t}"><b></b></i><span>${m}</span></div>`).join('')}
      </div>
      <p><b>Libido took over.</b> From 4 of 13 new ads in May to 61 of 76 in September, as it pulled hardest in every market.<span class="hbang__src">Counted from the public Meta Ad Library, May to 13 October 2026. One tile per visual; most ran in more than one language.</span></p>
    </div>
  </div>`;

  /* ---------- 5 · the page: a browser frame with step tabs ---------- */
  const BEATS = [
    ['Permission', 'Answer the shame first', '"You don\'t have to feel embarrassed about wanting a fulfilling sex life."', 0, 0],
    ['Not alone', 'A number makes it normal', '84% of women want an active sex life later in life.', 0, .55],
    ['Not her fault', "It's hormones, not her", 'Physical, neurological and emotional shifts, in plain words.', 1, 0],
    ['Her words', 'She recognises herself', 'Real comments: "like someone flicked a switch."', 2, .05],
    ['Dead ends', 'Every fix she has tried', 'Creams, pills and HRT, each with a fair hearing and a catch.', 3, .3],
    ['Reframe', "Shilajit isn't just for men", 'A myth-and-truth card takes the biggest objection head on.', 5, .1],
    ['Proof', 'Trust before price', 'Tested three times, a certificate in every pack, and a comparison table.', 8, 0],
    ['Offer', 'Easy to say yes to', 'Three bundles on the 90-day supply, a free ebook and a 30-day guarantee.', 10, 0]
  ];
  const page = `
    <div class="lp">
      <ol class="lp__tabs lp__tabs--l">${BEATS.slice(0, 4).map((b, i) => `<li><button data-b="${i}" aria-pressed="${i === 0}"><span>${String(i + 1).padStart(2, '0')}</span>${b[0]}</button></li>`).join('')}</ol>
      <div class="lp__frame">
        <div class="lp__chrome" aria-hidden="true"><i></i><i></i><i></i><span>theayurvedaexperience.com/pages/ashwaresin_herbius_lp2</span></div>
        <div class="lp__scrollcue" aria-hidden="true"><i class="lp__mouse"><b></b></i><span>Scroll inside the page</span></div>
        <div class="lp__view" data-lenis-prevent tabindex="0" aria-label="The US libido landing page. Scroll inside, or use the step buttons.">
          ${Array.from({ length: 13 }, (_, k) => `<img src="${img('lp-' + String(k + 1).padStart(2, '0'))}" alt="" loading="lazy" />`).join('')}
        </div>
        <div class="lp__note" aria-live="polite"><b>${BEATS[0][1]}</b><span>${BEATS[0][2]}</span></div>
      </div>
      <ol class="lp__tabs lp__tabs--r" start="5">${BEATS.slice(4).map((b, i) => `<li><button data-b="${i + 4}" aria-pressed="false"><span>${String(i + 5).padStart(2, '0')}</span>${b[0]}</button></li>`).join('')}</ol>
    </div>`;

  /* ---------- 6 · four markets: globe + flipping card ---------- */
  const MARKETS = [
    ['us', 'United States', 40.7, -74, 'Sex Life', 'prod-hero-en', 'English'],
    ['uk', 'United Kingdom', 51.5, -0.1, 'Intimate Life', 'prod-hero-en', 'English'],
    ['it', 'Italy', 41.9, 12.5, 'Vita Intima Appagante', 'prod-hero-it', 'Italian'],
    ['nl', 'Netherlands', 52.4, 4.9, 'Intiem Leven', 'prod-hero-nl', 'Dutch']
  ];
  const markets = `
    <div class="geo">
      <div class="geo__globe"><svg viewBox="-110 -110 220 220" aria-hidden="true"><defs><radialGradient id="globeFill" cx="35%" cy="30%"><stop offset="0" stop-color="#1d1830"/><stop offset="1" stop-color="#0a0910"/></radialGradient></defs><clipPath id="globeClip"><circle r="100"/></clipPath><circle r="100" class="geo__sphere"/><g clip-path="url(#globeClip)"><g class="geo__grid"></g><g class="geo__land"></g><g class="geo__pins"></g></g><circle r="100" class="geo__rim"/></svg>
        <span class="geo__label" aria-live="polite"></span></div>
      <div class="geo__side">
        <div class="geo__list" role="tablist" aria-label="Market">${MARKETS.map((m, i) => `<button role="tab" aria-selected="${i === 0}" data-m="${i}"><span class="geo__code">${m[0].toUpperCase()}</span><span class="geo__name">${m[1]}</span><span class="geo__phrase">“${m[4]}”</span></button>`).join('')}</div>
        <div class="flip"><div class="flip__in">
          <figure class="flip__face flip__face--a"><img src="${img(MARKETS[0][5])}" alt="Herbius product ad in English" /><figcaption></figcaption></figure>
          <figure class="flip__face flip__face--b"><img src="${img(MARKETS[0][5])}" alt="" /><figcaption></figcaption></figure>
        </div></div>
      </div>
    </div>
    <ul class="geo__stats"><li><b>107, 92, 26</b><span>Dutch, Italian and English creatives live</span></li><li><b>5–6h → under 1h</b><span>to adapt one landing page to a new market</span></li><li><b>3–4h saved</b><span>on every batch of 15–20 adapted ads</span></li></ul>`;

  /* ---------- 7 · the system: clickable stations ---------- */
  const STEPS = [
    ['Research', 'Meta Ad Library, Amazon reviews and Motion creative data, condensed by a Claude skill into one brief the team wrote hooks from.', ['Claude skill', 'Meta Ad Library', 'Motion', 'Atria']],
    ['Ads', 'Angle-led variations for energy, menopause, joints, men and libido, made in batches and reviewed by hand before anything went live.', ['Higgsfield', 'Photoshop', 'Claude skill']],
    ['Pages', 'A Figma frame becomes a coded HTML page, with no page builder. Faster to load, and quick to adapt for a new market.', ['Figma', 'Claude Code', 'Shopify']],
    ['Adaptation', 'English into Italian and Dutch, rewritten for each market rather than translated. A page went from 5–6 hours to under one.', ['Claude skill', 'Native review']],
    ['Launch', 'Live in the US, UK, Italy, the Netherlands, France and Hong Kong, with Klaviyo flows following each order home.', ['Klaviyo', 'Shopify', 'Meta Ads']]
  ];
  const system = `
    <p class="hb-lead">A five-person team can't hand-make every ad and page in three languages. So I built the Claude skills the team ran every day, one per station. The AI did the volume; every hook, layout and final call stayed human.</p>
    <p class="sys__hint">${star}<span>Tap a station to open it</span></p>
    <ol class="sys">${STEPS.map(([t, d, tools], i) => `
      <li class="sys__st" style="--i:${i}">
        <button class="sys__btn" aria-expanded="${i === 0}" aria-controls="sys-${i}" data-cursor="Open"><span class="sys__n">${String(i + 1).padStart(2, '0')}</span><b>${t}</b><i class="sys__plus">${plus}</i></button>
        <div class="sys__panel" id="sys-${i}" role="region"><div><p>${d}</p><ul class="sys__tools">${tools.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>
      </li>`).join('')}
    </ol>`;

  /* ---------- 8 · ebooks: one card each, language switch ---------- */
  const BOOKS = [
    ['spark', 'The Spark Ritual', 'Libido', { en: 'The Spark Ritual', it: 'Il Rituale della Scintilla', nl: 'Het Spark Ritual' }],
    ['fatigue', 'Bone-Deep Fatigue Breakthrough Guide', 'Menopause energy', { en: 'Bone-Deep Fatigue Breakthrough Guide', it: "La Guida al Ritrovamento dell'Energia", nl: 'De Gids voor Doorbraak bij Diepe Vermoeidheid' }],
    ['men', 'The 90-Day Protocol', 'Men', { en: 'Ashwa Resin Guide: 90-Day Transformation Protocol' }]
  ];
  const ebooks = `
    <div class="books">${BOOKS.map(([k, title, angle, langs]) => `
      <article class="book" data-book="${k}">
        <div class="book__stage">
          <img class="book__spread book__spread--1" src="${img(`ebook-${k}-spread-1`)}" alt="" loading="lazy" />
          <img class="book__spread book__spread--2" src="${img(`ebook-${k}-spread-2`)}" alt="" loading="lazy" />
          <div class="book__cover"><img src="${img(`ebook-${k}-en`)}" alt="${title} cover, English" loading="lazy" /></div>
        </div>
        <span class="book__angle">${angle}</span>
        <h4 class="book__title">${langs.en}</h4>
        <div class="book__langs" role="group" aria-label="Language">${Object.keys(langs).map((l, i) => `<button aria-pressed="${i === 0}" data-l="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      </article>`).join('')}
    </div>
    <p class="hb-small">The promise in the ad carries on after checkout: every order gets the ebook for its angle, adapted for Italy and the Netherlands.</p>`;

  /* ---------- the sections, in order ---------- */
  const sections = [
    { id: 'overview', nav: 'Overview', label: 'The launch', title: 'One launch, end to end.', html: overview },
    { id: 'gap', nav: 'The gap', label: 'The gap', title: 'Every Shilajit on the shelf was talking to the same man.', quote: true,
      html: `<p class="hb-lead">Black jars, gold labels, muscle and stamina. Shilajit's benefits aren't gendered, and the brand's customers were women over 40 who already trusted it with their skin. Nobody was talking to them.</p>${shelf()}` },
    { id: 'packaging', nav: 'Packaging', label: 'Packaging', title: "A jar that doesn't look like the shelf.",
      html: `<p class="hb-lead">Warm instead of black and gold, so she'd never read it as a gym product. Co-designed with the team and followed from dieline to press check.</p>${packaging}` },
    { id: 'angles', nav: 'Angles', label: 'Angles', title: 'Same jar, five angles.', html: `<p class="hb-lead">One product, five reasons to buy it, each with its own ads in English, Italian and Dutch. Pick an angle.</p>${angles}` },
    { id: 'page', nav: 'The page', label: 'The page', title: 'From embarrassed to checkout.',
      html: `<p class="hb-lead">A long page on purpose: each section answers the next thing she's thinking. Scroll inside the frame to read it, or pick a step to jump there.</p>${page}` },
    { id: 'markets', nav: 'Markets', label: 'Every market', title: 'One page, four markets. None of it word for word.',
      html: `<p class="hb-lead">Adapted, not translated. The UK says "Intimate Life" where the US says "Sex Life". Pick a market.</p>${markets}` },
    { id: 'system', nav: 'AI system', label: 'How AI fits in', title: 'Five people, 225 ads. So I built a system.', html: system, ai: true },
    { id: 'ebooks', nav: 'Ebooks', label: 'Ebooks', title: 'An ebook for every angle.', html: ebooks }
  ];

  /* =========================================================
     Interactions
     ========================================================= */
  function init(D) {
    const { $, $$, reduce, hasG } = D;

// angles: filter the strip, arrows page through it
const tabs = $$('.hbang__bar button'), track = $('.strip__track'), note = $('.hbang__note');
const navL = $('.strip__nav--l'), navR = $('.strip__nav--r');
const updNav = () => { navL.disabled = track.scrollLeft < 8; navR.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 8; };
track.addEventListener('scroll', updNav, { passive: true });
navL.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' }));
navR.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' }));
tabs.forEach((b) => b.addEventListener('click', () => {
  tabs.forEach((x) => x.setAttribute('aria-selected', x === b));
  const k = b.dataset.cat;
  note.textContent = CATS.find((c) => c[0] === k)[2];
  const ads = $$('.ad', track), show = (el) => k === 'all' || el.dataset.cat === k;
  const apply = () => { ads.forEach((el) => el.classList.toggle('is-off', !show(el))); track.scrollLeft = 0; updNav(); };
  if (hasG && !reduce) {
    gsap.to(ads, { opacity: 0, y: 10, duration: .2, onComplete: () => { apply(); gsap.fromTo(ads.filter(show), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55, ease: 'expo.out', stagger: .04 }); } });
  } else apply();
}));
$$('img', track).forEach((im) => im.addEventListener('load', updNav));
updNav();

    // packaging: the press reel plays on hover (and when in view on touch screens)
    const reelStep = $('.press__step--reel'), vids = $$('.reel video');
    if (reelStep) {
      let vi = 0;
      const playNext = () => { vids.forEach((v, j) => { v.classList.toggle('is-on', j === vi); if (j === vi) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }); };
      vids.forEach((v) => v.addEventListener('ended', () => { vi = (vi + 1) % vids.length; playNext(); }));
      vids.forEach((v) => (v.loop = false));
      const on = () => { reelStep.classList.add('is-playing'); playNext(); };
      const off = () => { reelStep.classList.remove('is-playing'); vids.forEach((v) => v.pause()); };
      reelStep.addEventListener('pointerenter', on); reelStep.addEventListener('pointerleave', off);
      if (!D.fine) new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), { threshold: .6 }).observe(reelStep);
    }

    // the page: step buttons glide the page inside the frame
    const view = $('.lp__view'), lpNote = $('.lp__note'), lpBtns = $$('.lp__tabs button');
    const go = (i) => {
      const b = BEATS[i], imgs = $$('img', view);
      const target = imgs[b[3]];
      if (!target) return;
      const y = target.offsetTop + target.offsetHeight * b[4] - 10;
      view.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      lpBtns.forEach((x) => x.setAttribute('aria-pressed', +x.dataset.b === i));
      lpNote.innerHTML = `<b>${b[1]}</b><span>${b[2]}</span>`;
      if (hasG && !reduce) gsap.fromTo(lpNote, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'expo.out' });
    };
    lpBtns.forEach((b) => b.addEventListener('click', () => go(+b.dataset.b)));
    // scrolling inside the frame keeps the step buttons in sync
    let syncT;
    view.addEventListener('scroll', () => {
      $('.lp').classList.add('is-scrolled');
      clearTimeout(syncT);
      syncT = setTimeout(() => {
        const imgs = $$('img', view), y = view.scrollTop + 20;
        let best = 0;
        BEATS.forEach((b, i) => { const t = imgs[b[3]]; if (t && t.offsetTop + t.offsetHeight * b[4] - 10 <= y) best = i; });
        lpBtns.forEach((x) => x.setAttribute('aria-pressed', +x.dataset.b === best));
        lpNote.innerHTML = `<b>${BEATS[best][1]}</b><span>${BEATS[best][2]}</span>`;
      }, 120);
    }, { passive: true });

    // markets: an orthographic globe that turns to the chosen market
    const grid = $('.geo__grid'), pins = $('.geo__pins'), glabel = $('.geo__label'), landEl = $('.geo__land');
    // world map: country outlines from the Natural Earth 110m atlas (loaded once)
    const ISO = { us: '840', uk: '826', it: '380', nl: '528' };
    let LAND = null;
    const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    (window.topojson ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js'))
      .then(() => fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then((r) => r.json()))
      .then((world) => {
        LAND = topojson.feature(world, world.objects.countries).features.map((f) => ({
          id: String(f.id),
          rings: f.geometry ? (f.geometry.type === 'Polygon' ? f.geometry.coordinates : f.geometry.coordinates.flat()) : []
        }));
        drawGlobe();
      }).catch(() => {});
    const rot = { lon: MARKETS[0][3], lat: MARKETS[0][2], s: 1.4 };
    const zoomFor = (m) => (m[0] === 'us' ? 1.5 : 3.1);   // Europe's cities sit close together, so zoom in further
    // where each label sits relative to its pin, so neighbours never collide
    const LBL = { us: [-9, -5, 'end'], uk: [-8, -8, 'end'], nl: [8, -8, 'start'], it: [8, 11, 'start'], FR: [-8, 11, 'end'], HK: [8, -6, 'start'] };
    const rad = Math.PI / 180;
    const proj = (lat, lon) => {
      const l = (lon - rot.lon) * rad, p = lat * rad, p0 = rot.lat * rad;
      const x = Math.cos(p) * Math.sin(l);
      const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
      const vis = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      return [x * 100 * rot.s, -y * 100 * rot.s, vis];
    };
    const EXTRA = [['FR', 48.9, 2.35], ['HK', 22.3, 114.2]];
    let cur = 0;
    function drawGlobe() {
      let g = '';
      for (let lat = -80; lat <= 80; lat += 10) { let d = '', pen = false; for (let lon = -180; lon <= 180; lon += 6) { const [x, y, v] = proj(lat, lon); if (v > 0) { d += `${pen ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; pen = true; } else pen = false; } g += `<path d="${d}"/>`; }
      for (let lon = -180; lon < 180; lon += 10) { let d = '', pen = false; for (let lat = -90; lat <= 90; lat += 6) { const [x, y, v] = proj(lat, lon); if (v > 0) { d += `${pen ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; pen = true; } else pen = false; } g += `<path d="${d}"/>`; }
      grid.innerHTML = g;
      if (LAND) {
        const onId = ISO[MARKETS[cur][0]], marketIds = Object.values(ISO);
        let base = '', mk = '', hot = '';
        LAND.forEach((c) => {
          const isHot = c.id === onId, isMk = marketIds.includes(c.id);
          c.rings.forEach((ring) => {
            let d = '', pen = false, allVis = true;
            for (const [lon, lat] of ring) { const [x, y, v] = proj(lat, lon); if (v > 0) { d += `${pen ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; pen = true; } else { pen = false; allVis = false; } }
            if (!d) return;
            if (allVis) d += 'Z';
            const seg = `<path d="${d}"${allVis ? '' : ' class="open"'}/>`;
            if (isHot) hot += seg; else if (isMk) mk += seg; else base += seg;
          });
        });
        landEl.innerHTML = `<g class="land">${base}</g><g class="land land--mk">${mk}</g><g class="land land--hot">${hot}</g>`;
      }
      let p = '';
      MARKETS.forEach((m, i) => { const [x, y, v] = proj(m[2], m[3]); const [lx, ly, an] = LBL[m[0]]; if (v > 0) p += `<g class="pin ${i === cur ? 'is-on' : ''}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${i === cur ? 8 : 4.5}" class="pin__halo"/><circle r="2.4" class="pin__dot"/><text x="${lx}" y="${ly}" text-anchor="${an}">${m[0].toUpperCase()}</text></g>`; });
      EXTRA.forEach(([c, la, lo]) => { const [x, y, v] = proj(la, lo); const [lx, ly, an] = LBL[c]; if (v > 0) p += `<g class="pin pin--faint" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="2"/><text x="${lx}" y="${ly}" text-anchor="${an}">${c}</text></g>`; });
      pins.innerHTML = p;
    }
    drawGlobe();
    const flipIn = $('.flip__in'); let face = 0;
    const mBtns = $$('.geo__list button');
    const setMarket = (i, instant) => {
      cur = i; const m = MARKETS[i];
      mBtns.forEach((b) => b.setAttribute('aria-selected', +b.dataset.m === i));
      glabel.textContent = `${m[1]}, in ${m[6]}`;
      const target = { lon: m[3], lat: m[2], s: zoomFor(m) };
      if (hasG && !reduce && !instant) gsap.to(rot, { ...target, duration: 1.4, ease: 'expo.inOut', onUpdate: drawGlobe });
      else { Object.assign(rot, target); drawGlobe(); }
      // flip the card to the other face, loaded with this market
      const next = $(face ? '.flip__face--a' : '.flip__face--b');
      $('img', next).src = img(m[5]); $('img', next).alt = `Herbius product ad in ${m[6]}`;
      $('figcaption', next).innerHTML = `<span>${m[1]}</span><b>“${m[4]}”</b>`;
      if (!instant) { face = 1 - face; flipIn.classList.toggle('is-flipped', !!face); }
      else $('figcaption', $('.flip__face--a')).innerHTML = `<span>${m[1]}</span><b>“${m[4]}”</b>`;
    };
    setMarket(0, true);
    let auto = setInterval(() => setMarket((cur + 1) % MARKETS.length), 4200);
    const stopAuto = () => { clearInterval(auto); auto = null; };
    mBtns.forEach((b) => b.addEventListener('click', () => { stopAuto(); setMarket(+b.dataset.m); }));
    // only auto-turn while the section is on screen
    new IntersectionObserver(([e]) => { if (!e.isIntersecting) { clearInterval(auto); } else if (auto) { clearInterval(auto); auto = setInterval(() => setMarket((cur + 1) % MARKETS.length), 4200); } }).observe($('.geo'));

    // system: stations open and close; a soft pulse travels across them until one is clicked
    const sBtns = $$('.sys__btn');
    const openSt = (b) => {
      const wasOpen = b.getAttribute('aria-expanded') === 'true';
      sBtns.forEach((x) => x.setAttribute('aria-expanded', 'false'));
      if (!wasOpen) b.setAttribute('aria-expanded', 'true');
    };
    sBtns.forEach((b) => b.addEventListener('click', () => { $('.sys').classList.add('is-touched'); openSt(b); }));
    let pulse = 0;
    const tick = setInterval(() => { if ($('.sys').classList.contains('is-touched')) return clearInterval(tick); sBtns.forEach((b, i) => b.classList.toggle('is-hint', i === pulse)); pulse = (pulse + 1) % sBtns.length; }, 1100);

    // ebooks: switch language, the cover flips
    $$('.book').forEach((card) => {
      const k = card.dataset.book, langs = BOOKS.find((b) => b[0] === k)[3];
      const cover = $('.book__cover', card), title = $('.book__title', card);
      $$('.book__langs button', card).forEach((btn) => btn.addEventListener('click', () => {
        const l = btn.dataset.l;
        $$('.book__langs button', card).forEach((x) => x.setAttribute('aria-pressed', x === btn));
        const swap = () => { $('img', cover).src = img(`ebook-${k}-${l}`); $('img', cover).alt = `${langs.en} cover, ${LANG[l]}`; title.textContent = langs[l]; };
        if (hasG && !reduce) gsap.timeline().to(cover, { rotateY: 90, duration: .25, ease: 'power2.in', onComplete: swap }).to(cover, { rotateY: 0, duration: .45, ease: 'back.out(1.6)' });
        else swap();
      }));
    });

    // gentle entrances
    if (hasG && !reduce) {
      $$('.scope__item').forEach((el, i) => gsap.from(el, { y: 24, opacity: 0, duration: .8, ease: 'expo.out', delay: (i % 4) * .05, scrollTrigger: { trigger: el, start: 'top 92%' } }));
    }
  }

  window.CASE_BUILDERS = window.CASE_BUILDERS || {};
  window.CASE_BUILDERS.herbius = { sections, init };
})();
