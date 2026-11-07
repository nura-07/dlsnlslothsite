/* ==========================================================
   PROJECT CONTENT, every case study is rendered from here.
   Fill the `todo` notes (they show as dashed "TO ADD" boxes on
   the page) and they disappear once you replace them.
   Images marked FR are hosted on the old Framer site, swap for
   local files in /assets when you have the originals.
   ========================================================== */
(function () {
  const FR = (id, s = 2048) => `https://framerusercontent.com/images/${id}?scale-down-to=${s}`;

  const projects = [
    /* ------------------------------------------------ HERBIUS */
    {
      slug: 'herbius', tier: 'major', no: '01', ready: true,
      title: 'Herbius', client: 'Transformative Ventures (TAE)', year: '2026',
      kicker: 'Go-to-market launch · Performance creative · AI workflow', builder: 'herbius',
      oneLiner: 'Shilajit was sold to men. We sold it to women.',
      summary: 'Led the launch of a Shilajit supplement for women over 40 across the US and Europe: positioning, packaging, 225 market-adapted ads, landing pages, ebooks and email, shipped by a five-person team through Claude skills.',
      accent: '#E3442E', crateLabel: 'HERBIUS / EU+US', coverArt: 'crates-stack',
      cover: null, coverText: 'Shilajit,<br><em>for her.</em>',
      tags: ['Go-to-market', 'Performance creative', 'Landing pages', 'AI workflow'],
      meta: { Role: 'Project lead, Sr. Design & Marketing Specialist', Team: '5 people: 3 designers, 2 copywriters', Timeline: 'May to Oct 2026, ongoing', Markets: 'US, UK, Italy, Netherlands, plus France and Hong Kong', Brand: 'The Ayurveda Experience (Transformative Ventures)', Products: 'Ashwa Resin and Herbius Shilajit' },
      sections: [
        { id: 'product', nav: 'Product', label: 'The product', title: 'A new product line for a skincare brand.',
          body: `<p>The Ayurveda Experience has sold Ayurvedic skincare for over 12 years, mostly to women over 50. Supplements were still new ground. An earlier range had closed when its cohort revenue fell short.</p><p>Herbius is the second attempt, and so far it has worked. <strong>Ashwa Resin</strong> blends purified Himalayan Shilajit with KSM-66 ashwagandha, honey and real vanilla, so it tastes good enough to take every day. <strong>Herbius Shilajit</strong> is the pure resin.</p>` },
        { id: 'gap', nav: 'The gap', label: 'The gap', title: 'Every Shilajit on the shelf was talking to the same man.', type: 'quote',
          body: `<p>Shilajit is sold for muscle, testosterone and stamina: black jars, gold labels. Its traditional benefits aren't gendered, and the brand's customers are women over 40 who already trust it with their skin. Nobody was speaking to them. That was the brief.</p>` },
        { id: 'packaging', nav: 'Packaging', label: 'Packaging', title: 'A jar that doesn\'t look like the shelf.', type: 'shelf',
          body: `<p>The category is black and gold. We went warm instead: a sunlit orange carton for Ashwa Resin, cream and mountain brown for the pure Shilajit, so a woman scrolling past would never read it as a gym product.</p><p>The cartons were a team effort: I co-designed them with the team and followed both from dieline to press check.</p>`,
          todo: ['Carton photos: dieline, press check and finished boxes (3 images)', 'Shelf comparison image with competitor marks blurred', 'Optional: one line on your part of the packaging (e.g. "I set the colour story; X built the dielines")'] },
        { id: 'angles', nav: 'Angles', label: 'Angles', title: 'Same jar, five angles. Libido won.', type: 'chart-herbius',
          body: `<p>We wrote to one woman at a time: on her third coffee by 11am, awake at 2am, with creaky knees, or no longer wanting sex. Each angle got its own ads in Italian, Dutch and English. Libido pulled hardest, so from July most of the effort went there.</p>`,
          note: 'Counted from the public Meta Ad Library: 225 Herbius creatives, May to 13 October 2026, each sorted by headline.',
          todo: ['What the libido angle did against the others: ROAS, CPA or conversion rate by angle'] },
        { id: 'page', nav: 'The page', label: 'The page', title: 'From embarrassed to checkout.', type: 'beats',
          body: `<p>I designed the libido page long on purpose. Each section answers the next thing she is thinking, in the order she would think it, then coded it once and adapted it for every market.</p>`,
          beats: [
            ['Permission', 'Answer the shame first', '"You don\'t have to feel embarrassed about wanting a fulfilling sex life." The headline removes the reason to leave before naming the problem.'],
            ['Not alone', 'A number makes it normal', '84% of women want an active sex life later in life. She is part of a majority, not an exception.'],
            ['Not her fault', 'It\'s hormones, not her', 'Physical, neurological and emotional changes in plain words. The blame moves from her to biology.'],
            ['Her words', 'She recognises herself', 'Real comments, names blurred: "like someone flicked a switch." She sees herself before anything is sold.'],
            ['Dead ends', 'Every fix she has tried', 'Creams, pills and HRT each get a fair hearing and a catch, then the missing piece.'],
            ['Reframe', 'Shilajit isn\'t just for men', 'A myth-and-truth card takes the category\'s biggest objection head on.'],
            ['Proof', 'Trust before price', 'Third-party testing, a certificate in every pack, the KSM-66 study and a comparison table.'],
            ['Offer', 'Easy to say yes to', 'Three bundles anchored on the 90-day supply, a free ebook, a 30-day guarantee, then FAQs.']
          ],
          todo: ['Full-length screenshot of the US libido page (for the scroll-through)'] },
        { id: 'markets', nav: 'Markets', label: 'Every market', title: 'One page, four markets. None of it word-for-word.', type: 'markets',
          body: `<p>Every ad and page existed in each market's language: adapted, not translated. The UK page says "Intimate Life" where the US says "Sex Life", because the same line lands differently.</p>`,
          table: [['United States', 'Sex Life'], ['United Kingdom', 'Intimate Life'], ['Italy', 'Vita Intima Appagante'], ['Netherlands', 'Intiem Leven']],
          stats: [['5–6h → <1h', 'to adapt one landing page'], ['3–4h saved', 'on every 15–20 ads adapted'], ['107 · 92 · 26', 'Dutch, Italian and English creatives live']] },
        { id: 'shipped', nav: 'Also shipped', label: 'Also shipped', title: 'Everything else a launch needs.', type: 'chips',
          body: `<p>Beyond the pages and ads, I owned the post-purchase story: an ebook for every angle, so the promise in the ad carried on after checkout, and the email flows that followed her home. The rest of the launch was shipped alongside the team.</p>`,
          chips: [['Mine · Ebooks', 'A free ebook per angle (The Spark Ritual, Bone-Deep Fatigue Breakthrough, the 90-Day Protocol), adapted for Italy and the Netherlands.'], ['Mine · Email', 'Klaviyo flows per market: written, coded in HTML and uploaded end to end.'], ['Mine · Pages & ads', 'Every landing page and ad set above, in EN, IT and NL.'], ['Team · Pricing', 'Three bundles, anchored on the 90-day supply at 15% off.'], ['Team · Marketplaces', 'Amazon & TikTok Shop listings.'], ['Team · Creators', 'Influencer footage edited into ads; subscribe & save for repeat orders.']] }
      ],
      ai: {
        title: 'Five people, 225 ads. So I built a system.',
        body: 'A five-person team can\'t hand-make every ad and page in three languages. I built the Claude skills the team ran on every day, one for each station, and moved our pages off page builders onto coded HTML, which loads faster and adapts to a new market in under an hour. The AI did the volume; every hook, layout and final call stayed human.',
        steps: [['01 · Research', 'Meta Ad Library, Amazon reviews and Motion creative data consolidated by a Claude skill into one brief. The team wrote hooks and angles from it.'], ['02 · Ads', 'Angle-led variations (energy, menopause, joints, men, libido) produced in batches and reviewed by hand.'], ['03 · Pages', 'Figma frame → coded HTML page. No page builder.'], ['04 · Adaptation', 'EN → IT · NL with market-specific copy, not literal translation. 5–6 hours per page became under one.'], ['05 · Launch', 'US · UK · IT · NL · FR · HK, plus Klaviyo flows.']]
      },
      impact: { stats: [['225', 'creatives in market, May–Oct 2026'], ['4 → 61', 'libido creatives per month as it scaled'], ['<1h', 'to adapt a page to a new market, down from 5–6h'], ['6', 'markets launched']],
        relative: [['+__%', 'libido angle vs. the average of other angles (ROAS or conversion)'], ['−__%', 'cost per acquisition on libido vs. other angles'], ['__%', 'subscription or repeat-order rate']],
        todo: ['Fill the three relative results (% only, no absolute revenue needed). Replace each __ in data/projects.js and delete this note.'] }
    },

    /* ------------------------------------------------ NARI SASHAKTIKARAN */
    {
      slug: 'nari-sashaktikaran', tier: 'major', no: '02',
      title: 'Nari Sashaktikaran', client: 'Indian Army', year: '2023',
      kicker: 'Logo · Campaign identity · Print & digital',
      oneLiner: 'A badge for women riding into history.',
      summary: 'Branding, logo and creative direction for the Indian Army women\'s motorcycle rally, worn, printed and flown along every route.',
      accent: '#655633', crateLabel: 'INDIAN ARMY / RALLY',
      cover: FR('6fIt03XdADYf4CXdfMSVK2qIoE.png', 1024),
      tags: ['Logo design', 'Campaign identity', 'Creative direction'],
      meta: { Role: 'Brand designer & creative direction', Client: 'Indian Army', Rally: 'July 2023, about 1,000 km to Dras', Scope: 'Logo, rally identity, posters, route collateral', Partners: 'TVS · SBI · udChalo · Prahri', Output: 'Logo system, campaign posters, event branding' },
      sections: [
        { id: 'rally', nav: 'The rally', label: 'The rally', title: '25 women, 1,000 km, one ride to Kargil.', type: 'rally',
          body: `<p>In July 2023 an all-women team from the Army, Air Force and Navy rode from the plains to the Kargil War Memorial to mark Kargil Vijay Diwas. The mark had to work as a patch, a banner, a poster lock-up and a social avatar, and carry the weight of the Army without feeling like a seal.</p>`,
          facts: [
            ['Route', '~1,000 km', 'Haryana, Punjab, Jammu & Kashmir and Ladakh, ending at the Kargil War Memorial in Dras on 25 July 2023.'],
            ['Riders', '25 women', 'Officers and soldiers of the Indian Army, Air Force and Navy, Veer Naris and armed forces spouses.'],
            ['Partner', 'TVS Ronin', 'Ridden on TVS Ronin motorcycles, in collaboration with TVS Motor Company.'],
            ['Purpose', '1999', 'Honouring the bravehearts of the Kargil War, and showing the strength of women in the armed forces.']
          ],
          video: { id: 'oo8UgSxbcjc', caption: 'The rally on the road' } },
        { id: 'sketches', nav: 'Sketches', label: 'Sketches', title: 'Three routes, drawn by hand.', type: 'gallery',
          body: `<p>The mark started on paper. Three routes: a circular emblem, a dynamic rider against the mountains, and a shield badge. The brief that came out of them: a woman rider as the hero, a tricolour swoosh, wings for strength and freedom, and Nari Shakti with Kargil Vijay Diwas 2023 on the ribbon.</p>`,
          media: ['assets/nari/sketch-1.webp', 'assets/nari/sketch-2.webp'],
          captions: ['The chosen route: circular emblem, annotated', 'Three routes: emblem, dynamic rider, shield badge'] },
        { id: 'mark', nav: 'The mark', label: 'The mark', title: 'Wings, wheels and a rider who is unmistakably her.', type: 'gallery',
          body: `<p>Route one from the sketches became the final mark. A woman rider leads at the centre, with the tricolour streaming behind her and wings for strength and freedom. Nari Shakti sits on the ribbon, with an arched name above and Kargil Vijay Diwas 2023 below. It reads at patch size and still holds up across a stage backdrop, and it anchors the rally poster with the Army and TVS.</p>`,
          media: ['assets/nari/logo.jpg', 'assets/nari/sketch-1.webp', 'assets/nari/poster.jpg', FR('6fIt03XdADYf4CXdfMSVK2qIoE.png'), FR('oo5elFAQVfHYQ16DlRhY9FT1d0A.png')],
          captions: ['The final mark', 'The sketch it came from', 'Rally poster, with the Indian Army and TVS', '"Every woman, a leader": key visual', '"Women of Steel. We can, we will, we shall."'],
          contain: [0, 1, 2] },
        { id: 'routes', nav: 'On the road', label: 'On the road', title: 'From India Gate to Ladakh, the badge went everywhere they did.', type: 'gallery',
          media: [FR('Ys0OeapIWj3CnbIoWFNa8aVgsE.jpg'), FR('nVwOxJV6gwws3aXuUL0YVmx8Y.jpg'), FR('pYNe4wACyrjsi8ej6TtOHLhTGKU.jpg'), FR('UEoEmow0SFJ3jJQy7AimWpaDU.jpg'), FR('t1aDhm0XaW3jG4TJCm7eu5xpYc.jpg')],
          captions: ['Riders in formation', 'Flag-off at India Gate', 'Ladakh leg', 'Felicitation ceremony', 'Unit send-off'] }
      ],
      impact: { stats: [['~1,000', 'km from Haryana to Dras'], ['25', 'women riders across three services'], ['1', 'mark across every route and partner'], ['4', 'partner brands locked up']], todo: ['Reach numbers: press coverage, posts, or audience at events'] }
    },

    /* ------------------------------------------------ ZEN BAREFOOT */
    {
      slug: 'zen-barefoot', tier: 'major', no: '03',
      title: 'Zen Barefoot', client: 'Zen Barefoot', year: '2024',
      kicker: 'Brand identity · Packaging · As seen on Shark Tank India',
      oneLiner: 'Barefoot shoes, made to feel like a walk outside.',
      summary: 'A full identity for India\'s barefoot-shoe brand: logo, colour, type, merch and packaging, later seen on Shark Tank India.',
      accent: '#5a7a3a', crateLabel: 'ZEN BAREFOOT / D2C',
      cover: FR('LyqedAxO0iYOikpYE6FYk0cr0SY.jpg', 1024),
      tags: ['Brand identity', 'Packaging', 'Merchandise', 'Guidelines'],
      meta: { Role: 'Brand designer, research to execution', Timeline: '2024', Scope: 'Research, logo, colour, type, patterns, packaging, merch, footwear details', Reach: '12K Instagram followers', Output: '25-page brand guideline' },
      sections: [
        { id: 'brief', nav: 'Brief', label: 'The brief', title: 'A category most Indians had never heard of.',
          body: `<p>Barefoot shoes are thin, flexible and foot-shaped, built so you walk the way you would without them. In India they were niche, imported and explained in technical terms. Zen Barefoot needed a brand that made the idea feel natural, calm and a little bit adventurous.</p>` },
        { id: 'process', nav: 'Process', label: 'Process', title: 'How the mark was found.', type: 'process',
          body: `<p>Wordmarks first, then two symbol routes: balance stones inside an ensō circle, and pebbles set in a Japanese stamp. The pebbles won, went through rounds of variations, and then walked onto the sole and the socks.</p>`,
          steps: [
            ['assets/zen/process-1.jpg', 'Wordmark explorations'],
            ['assets/zen/process-2.jpg', 'Two symbol routes'],
            ['assets/zen/process-3.jpg', 'One idea, three variations'],
            ['assets/zen/process-4.jpg', 'More variations'],
            ['assets/zen/process-5.jpg', 'Refining the pebbles'],
            ['assets/zen/process-6.jpg', 'Sole pattern drawing'],
            ['assets/zen/process-7.jpg', 'First sole sample'],
            ['assets/zen/process-8.jpg', 'Socks, design 1'],
            ['assets/zen/process-9.jpg', 'Socks, design 2']
          ] },
        { id: 'mark', nav: 'The mark', label: 'The mark', title: 'Pebbles that become a footprint.', type: 'gallery',
          body: `<p>The symbol stacks rounded pebbles into the shape of a footprint: grounded, tactile, and simple enough to deboss into a sole. It sits beside a wide, open wordmark built on a strict construction grid with clear-space rules.</p>`,
          media: [FR('LyqedAxO0iYOikpYE6FYk0cr0SY.jpg'), FR('2vEuD6DJJCopOvd24Y1iKFEzMs.jpg'), FR('19hh1n5dZVKE9w7UB1L9RLgenk.jpg'), FR('5wuTFgfEZAKHC8r3HpzbSomA.jpg')],
          captions: ['Logo lock-up', 'Construction of the mark', 'Horizontal construction', 'Clear space'] },
        { id: 'system', nav: 'Colour & type', label: 'Colour & type', title: 'Forest floor greens, one warm tangerine.', type: 'gallery',
          body: `<p>Deep forest and sage carry the calm; tangerine is the spark for calls to action. Supporting tones (clay, lilac and stone) give packaging and social room to vary without breaking the system.</p>`,
          media: [FR('XFeybNknRDV6GrBy4ae7qtZCo.jpg'), FR('GUWcQh8uMPJlsAitjKydZZZpF0.jpg'), FR('00GMbUodVPOKSFgdk6FUjmyb7Xk.jpg'), FR('8RN7szE960TQoYYxXWLYyrCvU.jpg')],
          captions: ['Primary colours', 'Secondary colours', 'Typography', 'Colour logos'] },
        { id: 'applications', nav: 'In the world', label: 'In the world', title: 'From the sole to the shoebox.', type: 'gallery', tall: true,
          body: `<p>The sole carries the whole brand: the pebble mark in the heel, a contour pattern through the arch and waves under the toes. Around it, the system runs through signage, stationery, print and social.</p>`,
          media: ['assets/zen/shoe-1.jpg', 'assets/zen/shoe-3.jpg', 'assets/zen/shoe-2.jpg', 'assets/zen/shoe-4.jpg', FR('uIcfeaYlpLN079G1r8xGbb4aw.jpg'), FR('ibLl6VMlCUFmZBor7ZiQYk3bw.jpg'), FR('bVSdP79Y5gwjwBQQEhiyUplHKSg.jpg'), FR('FjGHQ6ULPgQ9cvdbU4nIiil2FuM.jpg'), FR('JqPykvBllVFolOIExvGbZzow8.jpg'), FR('1HZNdPlwMPBeJHODm8HclE1xU.jpg')],
          captions: ['The sole: pebble mark, contours and waves', 'On the foot', 'Upper and sole together', 'Two colourways', 'Signage', 'Stationery', 'Print', 'Patterns & illustration', 'Pattern in use', 'Web & social'] },
        { id: 'sharktank', nav: 'Shark Tank', label: 'As seen on TV', title: 'The identity, on Shark Tank India.', type: 'screens',
          body: `<p>When Zen Barefoot pitched on Shark Tank India, the identity went on air: the set backdrop, the screen, the shoeboxes on every shark's table and the founders' tees.</p>`,
          media: ['assets/zen/st-3.webp', 'assets/zen/st-2.webp', 'assets/zen/st-4.webp', 'assets/zen/st-1.webp'],
          captions: ['The pitch: the full set, branded end to end', 'Backdrop, screen and the boxes', 'The founders, in branded tees', 'A Zen Barefoot box at the sharks\' table'] },
        { id: 'delivered', nav: 'Delivered', label: 'Delivered', title: 'Everything the brand runs on.', type: 'checklist',
          body: `<p>Research to execution, all handed over.</p>`,
          groups: [
            ['Identity', ['Brand identity deck', 'Full logo suite, in every format', 'Font pairings', 'Colour palette', 'Illustrations and patterns']],
            ['Product', ['Sole pattern', 'Shoebox packaging', 'Socks, two designs']],
            ['Documents and print', ['Brand guidelines document', 'Brand theme book', 'Mobility guide', 'Visiting cards', 'Thank-you cards', 'Brand files: AI, EPS, PNG, JPEG and PDF']]
          ] }
      ],
      impact: { stats: [['12K', 'Instagram followers'], ['S5', 'Shark Tank India appearance'], ['25', 'page brand guideline']] }
    },

    /* ------------------------------------------------ GRADRIGHT */
    {
      slug: 'gradright', tier: 'major', no: '04',
      title: 'GradRight', client: 'GradRight Inc.', year: '2022–24',
      kicker: 'Digital marketing design · University and lender campaigns · Ed-tech',
      oneLiner: 'Making a master\'s abroad feel within reach.',
      summary: 'Senior designer with a major role in the digital marketing creatives for an ed-tech platform that helps Indian students choose a university abroad and fund it: campaigns for partner universities and 13+ education lenders, shaped by research into what converted on Meta and Google.',
      accent: '#2f3e8f', crateLabel: 'GRADRIGHT / ED-TECH',
      cover: FR('SEGxXpZ2Q5mnmdvl7Z6nFfjV0.png', 1024),
      tags: ['Digital marketing', 'University campaigns', 'Lender campaigns', 'Motion'],
      meta: { Role: 'Sr. Visual Designer', Timeline: 'Jun 2022 to Feb 2024', Scope: 'Social and display ads, motion, university and lender campaigns, ad research for Meta and Google', Universities: 'University of Miami, Illinois Tech, Simon Fraser University, NJIT, CUNY and more', Lenders: '13+ education lenders' },
      sections: [
        { id: 'brief', nav: 'Brief', label: 'The brief', title: 'Big decisions, sold one scroll at a time.', type: 'rally',
          body: `<p>GradRight helps Indian students find the right university (SelectRight) and the right education loan (FundRight). As a senior designer I had a major role in its digital marketing creatives, most of them made for two kinds of partners: the universities recruiting students and the lenders funding them. Alongside the design, I researched what was converting on Meta and Google, and fed it into the next round. Every ad had to make a huge, expensive decision feel exciting and possible.</p>`,
          facts: [
            ['Universities', '5+ campaigns', 'University of Miami, Illinois Tech, Simon Fraser University, NJIT and CUNY, each with its own idea.'],
            ['Lenders', '13+', 'Education lenders, each with its own set of loan ads for students and parents.'],
            ['Formats', 'Multi-format', 'Static and carousel ads, motion ads, webinar promos and app creatives.'],
            ['Research', 'Meta + Google', 'User and ad research into which hooks, formats and visuals converted best.']
          ] },
        { id: 'universities', nav: 'Universities', label: 'Universities', title: 'One headline, one image, one reason to tap.', type: 'gallery',
          body: `<p>Each university got its own idea, written around the student's ambition rather than the prospectus: Miami's beaches, Illinois Tech's barcode invention, SFU's "Be heard, not herd". Program hooks did the same for MBA, Big 4 and tech careers.</p>`,
          media: [FR('XNf7m1xUyQoG9FRZ3Bts0gLAhPs.png'), FR('KwN2AT6q3am8lYQx3j2ffGBg6M.png'), FR('kMGpxkCRhKSX5Q0XAzPjyyZ834.png'), FR('pi6oO8xIQU5TZzL2bmnEFVtd5E.png'), FR('Zgaxz96z0COLl5nXSjNpaS3WdX4.png'), FR('SEGxXpZ2Q5mnmdvl7Z6nFfjV0.png'), FR('Ln1PcMfHxtZcHVRNfgxshEukI.png'), FR('uIhDWYfjMVlPzP6IYKBC22WJ7M.png'), FR('hRNCR2dfy5BltNRTFXkNpV4rV2A.png')],
          captions: ['University of Miami', 'Simon Fraser University', 'Illinois Tech', 'NJIT', 'CUNY webinar', '"What makes Elon\'s rockets fly?"', 'Fortune 500 MBA', 'Big 4 accounting', 'SelectRight app'] },
        { id: 'lenders', nav: 'Lenders', label: 'Lenders', title: '13+ lenders, one loan story each.', type: 'videos',
          body: `<p>FundRight compares education loans, so every lending partner needed creative of its own: what makes that lender's loan the right one, said simply enough for a student and convincing enough for the parent co-signing it. One system kept 13+ lenders consistent with the GradRight brand while letting each one stand apart.</p>`,
          videos: ['https://framerusercontent.com/assets/IDJ5Rd0oTADT0pSOwaW6mWIj8UQ.mp4', 'https://framerusercontent.com/assets/bVtVrzYguypr6qknS1MHCNKI.mp4', 'https://framerusercontent.com/assets/VhI6TPSKIStVJjdQXsYvgk6twR4.mp4'] }
      ],
      ai: { title: 'A first step into AI.', body: 'An introductory layer, used with care: ChatGPT for prompt-led thinking and Adobe Firefly where it gave the strongest creative result.', steps: [['ChatGPT', 'Prompting for hooks, headline variations and creative briefs.'], ['Firefly', 'Generating and extending imagery where stock photography fell short, then finished by hand.']] },
      impact: { stats: [['13+', 'lenders with their own campaigns'], ['5+', 'university partner campaigns'], ['65%', 'conversion lift on the pages behind the ads']] }
    },

    /* ------------------------------------------------ SENA DIWAS (mini) */
    {
      slug: 'sena-diwas-2027', tier: 'minor', no: '05',
      title: 'Sena Diwas 2027', client: 'Indian Army', year: '2027', status: 'Work in progress',
      kicker: 'Event logo · Indian Army · Bhopal',
      oneLiner: 'An Army Day emblem, built one layer at a time.',
      summary: 'The emblem for Army Day 2027 in Bhopal: tanks, rotors and soldiers under the tricolour, with Raja Bhoj on the Upper Lake at its heart.',
      accent: '#3f4a1e', crateLabel: 'SENA DIWAS / 2027',
      cover: 'assets/sena/sena-logo.jpg',
      tags: ['Event logo', 'Illustration', 'Print-ready'],
      meta: { Role: 'Logo designer', Status: 'Work in progress', Client: 'Indian Army', Output: 'Logo: high-res, print-ready PDF, layered PSD (26 layers)' },
      sections: [
        { id: 'brief', nav: 'Brief', label: 'The brief', title: 'One badge for the whole Army, and for Bhopal.',
          body: `<p>Sena Diwas (Army Day) celebrates the Indian Army every January. For 2027 the emblem had to honour every arm of the force and still belong to its host city.</p>`,
          todo: ['Who commissioned it and where it will be used (parade, merch, social)'] },
        { id: 'build', nav: 'The build', label: 'The build', title: 'Twenty-six layers, assembled like a parade.', type: 'sena-build',
          body: `<p>The national emblem and crossed swords crown the shield. Tricolour drapes frame a sky of rotor and drone; armour and artillery hold the flanks; three soldiers stand at the centre. Below the Devanagari title, Raja Bhoj stands over Bhopal's Upper Lake, the city's own landmark, inside the Army's badge.</p>` },
        { id: 'deliver', nav: 'Delivery', label: 'Delivery', title: 'Built to be printed big.',
          body: `<p>Delivered as a 8192px master, a print-ready PDF and a fully layered PSD so every element can be animated, embroidered or reused on its own.</p>`,
          todo: ['Final approved version + any applications (banners, merch) once released'] }
      ],
      ai: { title: 'Generated, then made accountable.', body: 'Illustrated elements were generated with AI, then rebuilt, corrected and composited by hand in Photoshop: equipment accuracy and insignia can\'t be left to a model.', steps: [['Generate', 'Element studies for vehicles, soldiers and drapes.'], ['Correct', 'Insignia, proportions and Devanagari type fixed by hand.'], ['Layer', 'Delivered as a 26-layer PSD.']], todo: ['Confirm the AI tools used (Midjourney / Firefly / Higgsfield?)'] },
      impact: { stats: [['26', 'layers in the master file'], ['8192px', 'master artwork']] }
    },

    /* ------------------------------------------------ LITTLE THINGS BY SHIVANI (mini) */
    {
      slug: 'little-things-by-shivani', tier: 'minor', no: '06',
      title: 'Little Things by Shivani', client: 'Shivani Kohli, resin artist', year: '2025',
      kicker: 'Logo & branding refresh · Instagram brand',
      oneLiner: 'A keepsake brand that finally looks like its keepsakes.',
      summary: 'A logo and branding refresh for a resin-art and floral-preservation studio with 18K followers on Instagram.',
      accent: '#c9727f', crateLabel: 'LITTLE THINGS / RESIN',
      cover: null, coverText: 'little<br><em>things</em>',
      tags: ['Logo refresh', 'Social branding'],
      meta: { Role: 'Brand designer', Client: 'Shivani Kohli', Timeline: 'Nov 2025', Reach: '18K Instagram followers', Output: 'Logo refresh, brand assets' },
      sections: [
        { id: 'brief', nav: 'Brief', label: 'The brief', title: 'Preserved flowers, preserved memories.',
          body: `<p>Shivani turns wedding bouquets and small mementos into resin keepsakes. Her audience had grown to 18K on Instagram; the brand needed to grow up with it: softer, more giftable, and easy to recognise in a feed.</p>`,
          todo: ['Before/after logo', 'What was delivered (logo, colours, highlight covers, packaging stickers?)', 'Client quote: "Thank you so much for your services Arundhati 💖" can be used with permission'] }
      ],
      ai: { title: 'Small brand, smart tools.', body: 'AI mockups let the client see the new mark on real products before committing.', steps: [['Mockup', 'Logo previewed on resin pieces and packaging.']], todo: ['Confirm AI use or rename to "Process"'] },
      impact: { stats: [['18K', 'Instagram followers']], todo: ['Any change after the refresh (engagement, orders)'] }
    },

    /* ------------------------------------------------ TREND BOOK (mini) */
    {
      slug: 'trend-book', tier: 'minor', no: '07',
      title: 'Trend Book', client: 'Research project (with Spandita Jakhar)', year: '2021',
      kicker: 'Trend forecasting · Cultural research · Editorial',
      oneLiner: 'Three futures, decoded before they arrived.',
      summary: 'A forecasting study distilled into three macro-trends (Escapient, Culture Core and Metro-ceptive) with palettes, textures and scenarios.',
      accent: '#A2772E', crateLabel: 'TREND BOOK / RESEARCH',
      cover: 'https://framerusercontent.com/images/C5m58pQ6FKpLfvtPl7OFnKzQDI.png?scale-down-to=1024',
      tags: ['Trend forecasting', 'Research', 'Editorial design'],
      meta: { Role: 'Trend researcher & visual designer', Timeline: '6–8 weeks', Scope: 'Cultural research, semiotics, visual strategy, editorial', Team: 'With Spandita Jakhar', Output: 'Trend book' },
      sections: [
        { id: 'brief', nav: 'Brief', label: 'The study', title: 'Not what\'s changing. Why.',
          body: `<p>Broad cultural scanning became a full forecasting study: semiotic research, mood exploration and visual mapping of consumer mindsets, material innovation and digital behaviour, distilled into three stories.</p>`,
          todo: ['Your specific part in the study vs. Spandita\'s', 'Year and institute (NIFT?)'] },
        { id: 'stories', nav: 'Three stories', label: 'Three stories', title: 'Escapient. Culture Core. Metro-ceptive.', type: 'gallery',
          media: ['https://framerusercontent.com/images/C5m58pQ6FKpLfvtPl7OFnKzQDI.png?scale-down-to=1024', 'https://framerusercontent.com/images/netfBd2W5NVq6gBHYnEtlGZNyJs.png?scale-down-to=1024', 'https://framerusercontent.com/images/OWB6lkC1qmEUmXpYDxQfm6d8.png?scale-down-to=1024'],
          captions: ['Escapient', 'Culture Core', 'Metro-ceptive'],
          todo: ['Replace with your own exports of the book spreads'] }
      ],
      ai: { title: 'Forecasting, then and now.', body: 'This study was built by hand. Today I would run the signal-scanning stage through AI research tools and keep the synthesis human.', steps: [['Then', 'Manual scanning, semiotic mapping, mood boards.'], ['Now', 'AI-assisted scanning; human synthesis and visual storytelling.']] },
      impact: { stats: [['3', 'macro-trends'], ['6–8', 'weeks of research']] }
    }
  ];

  window.PROJECTS = projects;
})();
