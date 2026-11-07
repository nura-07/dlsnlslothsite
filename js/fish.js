/* ==========================================================
   FishArt — hand-built line-art fish, hook, sparkle and sloth
   marks, generated as SVG strings so any page can reuse them.
   Original drawing (engraving style): body outline, dorsal
   hatching, scale crescents, ray-lined fins.
   ========================================================== */
(function () {
  let uid = 0;
  const BODY = 'M28 110 C60 52 170 30 300 44 C390 54 452 84 492 108 C452 132 390 160 300 172 C170 188 60 170 28 110 Z';

  function rays(from, tips) {
    return tips.map(([x, y], i) => `M${from[i][0]} ${from[i][1]} L${x} ${y}`).join(' ');
  }

  function parts() {
    // Dorsal fin: rays from the back to a scalloped edge
    const dBase = [], dTip = [];
    for (let i = 0; i <= 10; i++) {
      const x0 = 156 + i * 17, y0 = 49 - i * 0.4;
      dBase.push([x0, y0]);
      dTip.push([x0 + 16, 18 + Math.abs(i - 3.5) * 3.4]);
    }
    const dorsal = `M150 52 ${dTip.map(p => `L${p[0]} ${p[1]}`).join(' ')} L336 47`;

    // Forked tail
    const tBase = [], tTip = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = (1 - t) * (1 - t) * 592 + 2 * (1 - t) * t * 566 + t * t * 592;
      const y = (1 - t) * (1 - t) * 26 + 2 * (1 - t) * t * 108 + t * t * 190;
      tTip.push([x, y]);
      tBase.push([490 + Math.abs(t - .5) * 8, 104 + (t - .5) * 10]);
    }
    const tail = 'M486 108 C512 90 548 58 592 26 Q566 108 592 190 C548 158 512 126 486 108 Z';

    // Pectoral + anal fins
    const pect = 'M138 128 C170 132 198 152 208 180 C184 170 158 154 138 128 Z';
    const pectR = rays([[146, 132], [154, 136], [162, 140], [170, 144]], [[192, 168], [198, 172], [203, 176], [207, 179]]);
    const anal = 'M296 172 C316 198 352 208 382 164';
    const analR = rays([[306, 172], [322, 170], [338, 168], [354, 167], [368, 165]], [[316, 194], [332, 200], [346, 202], [360, 196], [372, 182]]);
    return { dorsal, dorsalR: rays(dBase, dTip), tail, tailR: rays(tBase, tTip), pect, pectR, anal, analR };
  }

  /**
   * fish({stroke, weight, vertical, detail, className})
   * vertical: head at top (for hanging on a hook)
   */
  function fish(o = {}) {
    const id = 'fa' + (++uid);
    const s = o.stroke || 'currentColor';
    const w = o.weight || 1.6;
    const p = parts();
    let hatch = '', scales = '';
    if (o.detail !== false) {
      for (let x = -40; x < 520; x += 6.5) hatch += `M${x} 28 L${x + 44} 102 `;
      for (let r = 0; r < 9; r++) {
        const y = 64 + r * 12.5, off = r % 2 ? 8 : 0;
        for (let x = 168 + off; x < 456; x += 16) scales += `M${x} ${y - 6} q7 6 0 12 `;
      }
    }
    const art = `
      <g fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">
        <g class="fish-tail"><path d="${p.tail}"/><path d="${p.tailR}" stroke-width="${w * .45}"/></g>
        <g class="fish-fin"><path d="${p.dorsal}"/><path d="${p.dorsalR}" stroke-width="${w * .45}"/></g>
        <path d="${p.anal}"/><path d="${p.analR}" stroke-width="${w * .45}"/>
        <path d="${BODY}" fill="${o.fill || 'none'}"/>
        <g clip-path="url(#${id})">
          <path d="${hatch}" stroke-width="${w * .38}" opacity=".75"/>
          <path d="${scales}" stroke-width="${w * .42}" opacity=".85"/>
          <path d="M140 104 C250 94 370 98 480 108" stroke-width="${w * .5}" stroke-dasharray="2 5"/>
          <path d="M60 150 C120 170 220 176 300 170" stroke-width="${w * .35}" opacity=".6"/>
        </g>
        <path d="M118 60 C142 86 146 132 120 162"/>
        <path d="M130 70 C146 92 148 128 132 152" stroke-width="${w * .5}"/>
        <path d="M28 110 L56 112 M30 113 C44 122 62 124 78 118" stroke-width="${w * .8}"/>
        <g class="fish-fin"><path d="${p.pect}"/><path d="${p.pectR}" stroke-width="${w * .45}"/></g>
        <circle cx="72" cy="94" r="12"/>
        <circle cx="72" cy="94" r="6" fill="${s}"/>
        <circle cx="69.5" cy="91.5" r="1.8" fill="var(--paper, #FFFBFC)" stroke="none"/>
      </g>`;
    const defs = `<defs><clipPath id="${id}"><path d="${BODY}"/></clipPath></defs>`;
    const cls = `class="fish-art ${o.className || ''}"`;
    if (o.vertical) {
      return `<svg ${cls} viewBox="0 0 220 600" aria-hidden="true">${defs}<g transform="translate(220 0) rotate(90)">${art}</g></svg>`;
    }
    return `<svg ${cls} viewBox="0 0 600 220" aria-hidden="true">${defs}${art}</svg>`;
  }

  /** Tiny simplified fish for menus & markers */
  function mini(o = {}) {
    const s = o.stroke || 'currentColor', f = o.fill || 'none';
    return `<svg class="fish-mini ${o.className || ''}" viewBox="0 0 60 120" aria-hidden="true">
      <g fill="${f}" stroke="${s}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M30 6 C44 22 48 50 44 78 C42 88 36 94 30 96 C24 94 18 88 16 78 C12 50 16 22 30 6 Z"/>
        <path d="M30 96 L18 116 Q30 108 42 116 Z"/>
        <path d="M16 52 L6 64 L16 62 M44 52 L54 64 L44 62" fill="none"/>
        <path d="M22 34 Q30 40 38 34" fill="none"/>
      </g>
      <circle cx="25" cy="22" r="2.6" fill="${s}"/>
    </svg>`;
  }

  /** Brass ring + rope + hook (vertical) */
  function hook(o = {}) {
    const s = o.stroke || 'currentColor';
    const len = o.length || 220;
    return `<svg class="hook-art" viewBox="0 0 80 ${len + 70}" aria-hidden="true">
      <g fill="none" stroke="${s}" stroke-linecap="round">
        <circle cx="40" cy="22" r="16" stroke-width="5"/>
        <circle cx="40" cy="22" r="4" fill="${s}"/>
        <path d="M40 38 L40 ${len}" stroke-width="1.6" stroke-dasharray="1 0"/>
        <path d="M37 40 C35 ${len * .4} 43 ${len * .6} 39 ${len}" stroke-width=".8" opacity=".6"/>
        <path d="M40 ${len} L40 ${len + 30} C40 ${len + 52} 64 ${len + 52} 62 ${len + 30} L56 ${len + 36}" stroke-width="3"/>
      </g>
    </svg>`;
  }

  function sparkle(o = {}) {
    return `<svg class="sparkle ${o.className || ''}" viewBox="0 0 100 100" aria-hidden="true"><path fill="${o.fill || 'currentColor'}" d="M50 0 C53 37 63 47 100 50 C63 53 53 63 50 100 C47 63 37 53 0 50 C37 47 47 37 50 0Z"/></svg>`;
  }

  /** The DLSNL Sloth logo, recoloured from the supplied artwork.
      The SVG filter turns the purple ink into alpha and paints it any colour. */
  function logo(o = {}) {
    const c = o.color || '#4A150F';
    const hex = c.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
    const id = 'lg' + (++uid);
    const src = o.src || (window.SITE_ROOT || '') + 'assets/brand/dlsnl-logo.jpg';
    const vb = o.tagline === false ? '285 230 745 600' : '285 230 745 715';
    return `<svg class="dlsnl-logo ${o.className || ''}" viewBox="${vb}" role="img" aria-label="DLSNL Sloth Creative Studio">
      <filter id="${id}" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  -0.7 -1.0 -0.2 0 1.55"/>
      </filter>
      <image href="${src}" width="1250" height="1250" filter="url(#${id})"/>
    </svg>`;
  }

  window.FishArt = { fish, mini, hook, sparkle, logo };
})();
