/* =====================================================
   destinations.js
   1) UNIS      : universities for each country
   2) UPHOTOS   : popup background photo for each country
   3) Popup     : select universities -> counselling form -> thank you
   4) Slider    : scroll driven destinations
   ===================================================== */

/* ---------- 1) Universities (key = country name exactly as in the slider) ---------- */
window.UNIS = {
  'Malta': [
    { name:'Ascencia-Malta paris college', city:'Floriana' },
    { name:'International Institute by Malta', city:'Paola' },
    { name:'Malita International College', city:'Birkirkara' },
    { name:'Global College Malta', city:'Ricasoli, SmartCity Malta' },
    { name:'Cross College Malta', city:'Qormi' },
    { name:'Uniplural Academy', city:'Birkirkara' },
    { name:'Ascencia Malta', city:'Floriana' },
    { name: 'GBS Malta', city: "St. Julian's" }

  ],
  'Germany': [
    { name:'Berlin School of Business and Innovation', city:'Berlin' },
    { name:'University of Europe for Applied Sciences', city:'Berlin' },
    { name:'New European College', city:'Munich' },
    { name:'GISMA University of Applied Sciences', city:'Berlin, Potsdam' },
    { name:'IU International University of Applied Sciences', city:'Berlin' }
  ],
  'Lithuania': [
    { name:'ISM University of Management and Economics', city:'Vilnius' }
  ],
  'USA': [
    { name: 'Avila University', city: 'Kansas City' },
    { name: 'Webster University', city: 'Webster Groves' }
  ],
  'Canada': [
    { name:'University Canada West', city:'Vancouver' }
  ],
  'Spain': [
    { name: 'Ascencia Spain', city: 'Barcelona' },
  ],
  'Netherland': [
    { name: 'IU International University of Applied Sciences', city: 'Erfurt' },
  ],
   'Ireland': [
    { name: 'IBAT College Dublin', city: 'Dublin' },
  ],
  'France': [
    { name:'Collège de Paris', city:'Paris' }
  ],
  'Switzerland': [
    { name:'Geneva School of Diplomacy', city:'Geneva' }
  ],
   'Malaysia': [
    { name:'Yes International Collage', city:'Kuala Lumpur' }
  ],
  'Poland': [
    { name:'Vistula University', city:'Warsaw' }
  ]
};

/* ---------- 2) Popup background photos ---------- */
window.UPHOTOS = {
  'Malta': 'destinations/malta.jpg',
  'UK': 'destinations/uk.jpg',
  'Canada': 'destinations/canada.jpg',
  'Australia': 'destinations/australia.jpg',
  'Germany': 'destinations/germany.jpg',
  'Malaysia': 'destinations/malaysia.jpg',
  'USA': 'destinations/usa.jpg',     
  'New Zealand': 'destinations/NewZealand.jpg',
  'Singapore': 'destinations/Singapore.jpg',
  'France': 'destinations/France.jpg',
  'Uzbekistan': 'destinations/Uzbekistan.jpg',
  'Slovakia': 'destinations/Slovakia.jpg',
  'Armenia': 'destinations/Armenia.jpg',
  'Poland': 'destinations/Poland.jpg',
  'Czech Republic': 'destinations/CzechRepublic.jpg',
  'Ireland': 'destinations/Ireland.jpg',
  'Sweden': 'destinations/Sweden.jpg',
  'Netherlands': 'destinations/Netherlands.jpg',
  'Austria': 'destinations/Austria.jpg',
  'Denmark': 'destinations/Denmark.jpg',
  'Finland': 'destinations/Finland.jpg',
  'Italy': 'destinations/Italy.jpg',
  'Norway': 'destinations/Norway.jpg',
  'Georgia': 'destinations/Georgia.jpg',
  'Hungary': 'destinations/Hungary.jpg',
  'Spain': 'destinations/Spain.jpg',
  'Lithuania': 'destinations/Lithuania.jpg',
  'Cyprus': 'destinations/Cyprus.jpg',
  'UAE': 'destinations/UAE.jpg',
  'Mauritius': 'destinations/Mauritius.jpg',
  'Latvia': 'destinations/Latvia.jpg',
  'Kyrgyzstan': 'destinations/Kyrgyzstan.jpg',
  'Switzerland': 'destinations/Switzerland.jpg',
  'South Korea': 'destinations/SouthKorea.jpg',
  'Russia': 'destinations/Russia.jpg',
  'Moldova': 'destinations/australia.jpg',
  'Albania': 'destinations/australia.jpg'
};

/* ---------- 3) University popup: select -> counselling form -> thank you ---------- */
(function () {
  const $ = id => document.getElementById(id);
  const ov = $('upOv'), pn = $('upPanel'), list = $('upList'), form = $('upForm');
  if (!pn || !form) return;

  let country = '', unis = [], sel = new Set(), opener = null;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function renderList() {
    list.innerHTML = unis.length
      ? unis.map((u, i) => `
        <button type="button" class="up-uni ${sel.has(i) ? 'on' : ''}" data-i="${i}" style="--k:${i}" aria-pressed="${sel.has(i)}">
          <span class="up-tick">✓</span>
          <span>
            <h4>${esc(u.name)}</h4>
            <span class="up-city">${esc(u.city || '')}</span>
            ${(u.courses || []).map(c => `<span class="up-chip">${esc(c)}</span>`).join('')}
          </span>
        </button>`).join('')
      : '<p class="up-empty">Our team will guide you personally for this country. Tap the button below to talk to us.</p>';

    const c = sel.size;
    $('upGo').textContent = c ? `Get free counselling (${c})` : 'Get free counselling';
    $('upHint').textContent = !unis.length ? '' : c ? `${c} selected` : 'Select the universities you like, or continue without choosing';
  }

  function setStep(s) {
    ['upV1', 'upV2', 'upV3'].forEach((id, i) => {
      $(id).className = 'up-view' + (i + 1 === s ? '' : i + 1 < s ? ' left' : ' right');
    });
    $('upBack').style.display = s === 2 ? 'block' : 'none';
    $('upTitle').textContent = s === 1 ? country : s === 2 ? 'Free counselling' : 'Enquiry sent';
    $('upSub').textContent = s === 1
      ? (unis.length ? unis.length + (unis.length === 1 ? ' university' : ' universities') : 'Details coming soon')
      : s === 2 ? 'Tell us how to reach you' : '';

    if (s === 2) {
      $('upSel').innerHTML = sel.size
        ? [...sel].map(i => `<span class="up-chip">${esc(unis[i].name)}</span>`).join('')
        : '<span class="up-chip">No preference, guide me</span>';
      $('upCountry').textContent = 'Country: ' + country;
      if (matchMedia('(hover:hover)').matches)                        // do not pop the keyboard on phones
        setTimeout(() => form.querySelector('input[name="name"]').focus({ preventScroll: true }), 450);
    }
  }

  /* photo = optional image path sent by the slider */
  window.openUniPanel = function (name, photo) {
    country = name;
    unis = (window.UNIS || {})[name] || [];
    sel.clear();
    opener = document.activeElement;

    const img = photo || (window.UPHOTOS || {})[name] || '';
    pn.style.setProperty('--up-photo', img ? `url("${img}")` : 'none');
    ov.style.setProperty('--up-photo', img ? `url("${img}")` : 'none');

    form.reset();
    const btn = $('upSend'); btn.disabled = false; btn.textContent = 'Send enquiry →';
    $('upStatus').textContent = ''; $('upStatus').className = 'up-status';

    renderList(); setStep(1); list.scrollTop = 0;
    ov.classList.add('open'); pn.classList.add('open');
    pn.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
    $('upClose').focus({ preventScroll: true });
  };

  function close() {
    if (!pn.classList.contains('open')) return;
    if (document.activeElement) document.activeElement.blur();
    ov.classList.remove('open'); pn.classList.remove('open');
    pn.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    if (opener) opener.focus({ preventScroll: true });
  }

  list.addEventListener('click', e => {
    const b = e.target.closest('.up-uni');
    if (!b) return;
    const i = +b.dataset.i;
    sel.has(i) ? sel.delete(i) : sel.add(i);
    renderList();
  });

  $('upGo').addEventListener('click', () => setStep(2));
  $('upBack').addEventListener('click', () => setStep(1));
  $('upClose').addEventListener('click', close);
  $('upFin').addEventListener('click', close);
  ov.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.website.value) return;                                   // spam trap

    const url = window.LEAD_URL || ($('contactForm') || {}).action;    // same Google Apps Script URL
    const btn = $('upSend'), st = $('upStatus');
    st.textContent = ''; st.className = 'up-status';
    if (!url) { st.textContent = 'Form is not connected. Please call or WhatsApp us.'; st.classList.add('err'); return; }

    btn.disabled = true; btn.textContent = 'Sending…';

    const data = new URLSearchParams(new FormData(form));
    data.delete('website');
    data.set('country', country);
    data.set('universities', [...sel].map(i => unis[i].name).join(', '));
    data.set('source', 'University popup');

    try {
      await fetch(url, { method: 'POST', body: data, mode: 'no-cors' });
      setStep(3);
    } catch (err) {
      st.textContent = 'Something went wrong. Please call or WhatsApp us.';
      st.classList.add('err');
      btn.disabled = false; btn.textContent = 'Send enquiry →';
    }
  });
})();

/* ---------- 4) Destination slider (scroll driven) ---------- */
(function () {
  const DATA = [
    { name:'Explore Destinations', region:'Explore the World. Build Your Future.', hero:true, img:'destinations/explore.jpg',
      cta:'Scroll to explore ↓',
      desc:'Discover international education opportunities with AllPoints. We help students explore study destinations, suitable courses, and educational pathways that align with their academic goals and career ambitions.' },
    { name:'Malta', region:'Southern Europe (Mediterranean)', img:'destinations/malta.jpg',
      desc:'Malta is a beautiful Mediterranean island known for its quality education, English-speaking environment, rich history, and vibrant lifestyle. It offers international students excellent learning opportunities, cultural experiences, and access to Europe.' },
    { name:'Malaysia', region:'Southeast Asia', img:'destinations/malaysia.jpg',
      desc:'Malaysia offers affordable education, internationally recognised universities, diverse courses, and a multicultural student lifestyle with excellent career opportunities.' },
    { name:'Canada', region:'North America', img:'destinations/canada.jpg',
      desc:'Canada offers quality education, globally recognised degrees, and excellent career opportunities. Study in Canada and build a brighter future!' },
    { name:'USA', region:'North America.', img:'destinations/usa.jpg',
      desc:'The United States offers world-class universities, diverse study programmes, excellent research opportunities, and a vibrant multicultural student experience.' },
    { name:'Germany', region:'Europe', img:'destinations/germany.jpg',
      desc:'Germany offers high-quality education, globally recognised degrees, and excellent career opportunities. Study in Germany and explore your future in one of Europe’s leading destinations!' },
    { name:'All destinations', label:'View all countries', img:'destinations/earth2.jpg', all:true }
  ];
  const ALL = 'mt:Malta,us:USA,gb:UK,ca:Canada,au:Australia,de:Germany,sk:Slovakia,am:Armenia,pl:Poland,cz:Czech Republic,uz:Uzbekistan,fr:France,it:Italy,es:Spain,ie:Ireland,at:Austria,dk:Denmark,fi:Finland,nz:New Zealand,nl:Netherlands,se:Sweden,ch:Switzerland,ae:UAE,sg:Singapore,no:Norway,hu:Hungary,lt:Lithuania,my:Malaysia,kr:South Korea,ge:Georgia,ru:Russia,cy:Cyprus,mu:Mauritius,lv:Latvia,kg:Kyrgyzstan,al:Albania,md:Moldova'
    .split(',').map(s => s.split(':'));

  const stage = document.querySelector('.dsl'), pin = stage && stage.parentElement;
  if (!stage || !pin) return;
  const $ = id => document.getElementById(id);
  const bg=$('dslBg'), content=$('dslContent'), region=$('dslRegion'), title=$('dslTitle'), desc=$('dslDesc'),
        btn=$('dslBtn'), cards=$('dslCards'), bar=$('dslBar'), count=$('dslCount'),
        prevBtn=$('dslPrev'), nextBtn=$('dslNext'), allView=$('dslAll'), allGrid=$('dslAllGrid'), allQ=$('dslAllQ');
  const n = DATA.length, MAXV = 4;
  let cur = 0, moving = false;
  let directTarget = null; 
  pin.style.setProperty('--n', n);

  const still = i => DATA[i].poster || DATA[i].img || '';
  const thumb = i => DATA[i].thumb || still(i);
  DATA.forEach((d, i) => { if (still(i)) new Image().src = still(i); });
  const pad = v => String(v).padStart(2, '0');

  function fillMedia(el, i) {
    const d = DATA[i];
    el.innerHTML = '';
    el.style.backgroundImage = still(i) ? `url("${still(i)}")` : 'none';
    if (d.video) {
      const v = document.createElement('video');
      v.src = d.video; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto';
      if (d.poster) v.poster = d.poster;
      el.appendChild(v);
      v.play().catch(() => {});
    }
  }

  /* slide "All destinations": grid + search */
  if (allGrid && allQ) {
    allGrid.innerHTML = ALL.map(([c, name], k) =>
      `<button type="button" class="ac" style="--k:${k}" data-n="${name}"><img src="https://flagcdn.com/w40/${c}.png" alt="" onerror="this.remove()">${name}</button>`).join('');
    allQ.addEventListener('input', () => {
      const t = allQ.value.trim().toLowerCase();
      allGrid.querySelectorAll('.ac').forEach(b => { b.hidden = !b.dataset.n.toLowerCase().includes(t); });
    });
    allGrid.addEventListener('click', e => {
      const b = e.target.closest('.ac');
      if (b && window.openUniPanel) openUniPanel(b.dataset.n);
    });
  }

  const total = () => pin.offsetHeight - innerHeight;
  const progress = () => Math.max(0, Math.min(1, -pin.getBoundingClientRect().top / total()));
  const indexFor = p => Math.min(n - 1, Math.floor(p * n));
  const scrollToSlide = i => {
  directTarget = i;
  scrollTo({ top: pin.getBoundingClientRect().top + scrollY + (total() / n) * i + 4, behavior: 'instant' });
};

  function setContent() {
    const d = DATA[cur], hero = !!d.hero;
    stage.classList.toggle('is-all', !!d.all);
    content.classList.toggle('is-hero', hero);
    if (!d.all) {
      region.textContent = d.region || '';
      region.style.display = d.region ? '' : 'none';
      title.innerHTML = d.name.split(' ').map(w => `<span class="ln"><i>${w}</i></span>`).join('');
      desc.textContent = d.desc || '';
      btn.textContent = hero ? (d.cta || 'Scroll to explore ↓') : 'Explore ' + d.name + ' →';
      count.textContent = hero ? '' : `${pad(cur)} / ${pad(n - 2)}`;
    } else {
      count.textContent = 'All';
    }
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === n - 1;
    content.classList.remove('go'); void content.offsetWidth; content.classList.add('go');
    if (allView) { allView.classList.remove('go'); void allView.offsetWidth; if (d.all) allView.classList.add('go'); }
  }

  function renderCards(animate) {
    cards.innerHTML = '';
    for (let k = 1; k <= MAXV; k++) {
      const i = cur + k;
      if (i >= n) break;                                    // upcoming slides only, in DATA order
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dsl-card' + (animate && k === MAXV ? ' enter' : '') + (thumb(i) ? '' : ' plain');
      b.dataset.i = i;
      if (thumb(i)) b.style.backgroundImage = `url("${thumb(i)}")`;
      b.setAttribute('aria-label', 'Show ' + DATA[i].name);
      b.innerHTML = `<span>${DATA[i].label || DATA[i].name}</span>`;
      cards.appendChild(b);
    }
  }

function go(t, dir) {
  if (moving || t === cur) return;
  moving = true;
  const s = stage.getBoundingClientRect();
  const ov = document.createElement('div');
  ov.className = 'dsl-grow';
  fillMedia(ov, t);

  const th = dir > 0 ? cards.querySelector(`[data-i="${t}"]`) : null;
  if (th) {                                    // forward: the card grows to full screen
    const r = th.getBoundingClientRect();
    ov.style.clipPath = `inset(${r.top - s.top}px ${s.right - r.right}px ${s.bottom - r.bottom}px ${r.left - s.left}px round 18px)`;
    th.style.visibility = 'hidden';
  } else {                                     // backward: soft cross-fade instead of the wipe
    ov.style.opacity = '0';
    ov.style.transition = 'opacity .7s ease';
  }

  bg.after(ov);
  content.classList.add('out');
  if (allView) allView.classList.add('out');
  void ov.offsetWidth;
  if (th) ov.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
  else ov.style.opacity = '1';

  let done = false;
  const finish = () => {
    if (done) return; done = true;
    bg.innerHTML = '';
    while (ov.firstChild) bg.appendChild(ov.firstChild);
    bg.style.backgroundImage = ov.style.backgroundImage;
    const v = bg.querySelector('video'); if (v) v.play().catch(() => {});
    ov.remove();
    cur = t;
    setContent(); renderCards(true);
    content.classList.remove('out');
    if (allView) allView.classList.remove('out');
    moving = false;
    sync();                                    // keeps stepping if the user scrolled further
  };
  ov.addEventListener('transitionend', e => {
    if (e.propertyName === 'clip-path' || e.propertyName === 'opacity') finish();
  });
  setTimeout(finish, 900);
}

 function sync() {
    const p = progress();
    bar.style.transform = `scaleX(${p})`;
    const want = indexFor(p);
    if (directTarget !== null && want !== directTarget) directTarget = null;

    const r = stage.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < innerHeight;
    if (!onScreen && !moving && want !== cur) { snap(want); return; }     // slider off screen: change silently

    if (!moving && want !== cur) {
      const t = directTarget !== null ? want : cur + Math.sign(want - cur);
      go(t, want > cur ? 1 : -1);
    }
    if (want === cur) directTarget = null;
  }

  btn.addEventListener('click', e => {
    const d = DATA[cur];
    e.preventDefault();
    if (d.hero) scrollToSlide(1);
    else if (window.openUniPanel) openUniPanel(d.name, d.img);
  });
  nextBtn.addEventListener('click', () => scrollToSlide(Math.min(n - 1, cur + 1)));
  prevBtn.addEventListener('click', () => scrollToSlide(Math.max(0, cur - 1)));
  cards.addEventListener('click', e => { const b = e.target.closest('.dsl-card'); if (b) scrollToSlide(+b.dataset.i); });

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; sync(); });
  }, { passive: true });
  addEventListener('resize', sync);

  function snap(t) {                                   // change slide with no animation
  cur = t; directTarget = null;
  fillMedia(bg, t); setContent(); renderCards(false);
}

document.querySelectorAll('a[href="#destinations"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const r = stage.getBoundingClientRect();
  const visible = r.bottom > 0 && r.top < innerHeight;
  scrollTo({ top: pin.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  if (visible) directTarget = 0; else snap(0);       // not on screen: show the hero at once
}));

  cur = indexFor(progress());
  fillMedia(bg, cur);
  setContent(); renderCards(false); sync();
})();
