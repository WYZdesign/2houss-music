import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ============================================================
   DATA — real releases
   ============================================================ */
const RELEASES = [
  { title: 'Move My Body', year: '1987', label: 'Trax Records', tag: 'The debut on Trax' },
  { title: "I'm Over You / Feel the Rhythm", year: '', label: 'Neco Records', tag: '' },
  { title: 'The Blue Print Mix', year: '', label: 'Olio Entertainment', tag: '' },
  { title: 'Baby Wants To Move You', year: "'90s", label: 'Gherkin Records · w/ Brett Wilcott', tag: 'One of the best hip-house records of the \u201990s' },
  { title: 'Fuzion (feat. J Lofton)', year: '2016', label: '2HoussMusic', tag: '' },
  { title: 'This Is Disco (feat. J Lofton)', year: '2018', label: '2HoussMusic', tag: '' },
  { title: 'M.A.D Acid (feat. J Lofton)', year: '', label: '2HoussMusic', tag: '' },
  { title: 'Pretty (feat. KaeSwiss) · J Lofton Remix', year: '', label: '2HoussMusic', tag: '' },
  { title: 'House Of Joy EP', year: '', label: '2HoussMusic', tag: '' },
  { title: 'Come On Baby', year: '', label: '2HoussMusic', tag: 'Chicago House Music' },
  { title: 'Dirty Bumm EP', year: '', label: '2HoussMusic', tag: '' },
  { title: 'Music Pleasure (feat. J Lofton)', year: '', label: '2HoussMusic', tag: '' },
];

/* ============================================================
   DISCGRAPHY BUILD
   ============================================================ */
const discog = document.getElementById('discog');
RELEASES.forEach((r, i) => {
  const card = document.createElement('article');
  card.className = 'discog-card';
  card.setAttribute('data-label', r.tag ? 'CLASSIC' : 'PLAY');
  card.innerHTML = `
    <div class="discog-card__cover cover--${i % 12}">
      <div class="disc__glow"></div>
      ${r.tag ? `<span class="discog-card__year">★ ${r.tag}</span>` : ''}
      <h3 class="discog-card__title">${r.title}</h3>
      <span class="discog-card__label">${r.year ? r.year + ' · ' : ''}${r.label}</span>
    </div>
    <div class="discog-card__shine"></div>
  `;
  discog.appendChild(card);
});

/* ============================================================
   SPLIT TEXT
   ============================================================ */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  [...text].forEach((ch) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    frag.appendChild(s);
  });
  el.appendChild(frag);
}
document.querySelectorAll('.hero__line .txt-mask__inner').forEach(splitChars);

/* ============================================================
   PRELOADER
   ============================================================ */
function runPreloader(done) {
  const count = document.getElementById('preloadCount');
  const bar = document.getElementById('preloadBar');
  const obj = { n: 0 };
  gsap.to(obj, {
    n: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(obj.n);
      count.textContent = v;
      bar.style.width = v + '%';
    },
    onComplete() {
      gsap.timeline()
        .to('.preloader__mark', { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
        .to('.preloader__count, .preloader__bar', { autoAlpha: 0, duration: 0.3 }, '-=0.3')
        .to('#preloader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
        .set('#preloader', { display: 'none' })
        .add(done);
    },
  });
}

/* ============================================================
   SMOOTH SCROLL (Lenis)
   ============================================================ */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   ANCHOR SCROLL
   ============================================================ */
function closeMenu() {
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  if (menu.classList.contains('is-open')) {
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    gsap.to('.menu__bg', { scaleY: 0, duration: 0.6, ease: 'power4.inOut' });
    gsap.to('.menu__item', { opacity: 0, y: 30, duration: 0.3, stagger: 0.03 });
    gsap.to('.menu__foot', { opacity: 0, duration: 0.3 });
  }
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMenu();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/* ============================================================
   MENU OVERLAY
   ============================================================ */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  if (open) {
    gsap.to('.menu__bg', { scaleY: 1, duration: 0.6, ease: 'power4.inOut' });
    gsap.to('.menu__item', { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.2, ease: 'power4.out' });
    gsap.to('.menu__foot', { opacity: 1, duration: 0.5, delay: 0.5 });
  } else {
    gsap.to('.menu__bg', { scaleY: 0, duration: 0.6, ease: 'power4.inOut' });
    gsap.to('.menu__item', { opacity: 0, y: 30, duration: 0.3, stagger: 0.03 });
    gsap.to('.menu__foot', { opacity: 0, duration: 0.3 });
  }
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
if (finePointer) {
  const dot = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');
  const label = document.querySelector('.cursor__label');
  const cursorEl = document.getElementById('cursor');
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'power2.out' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    gsap.set(ring, { x: rx, y: ry });
    gsap.set(label, { x: mx, y: my });
  });

  const hoverables = 'a, button, .discog-card, .music__platform, .social, .video-card, .nav__burger';
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest(hoverables);
    if (!t) return;
    cursorEl.classList.add('is-hover');
    const labelled = t.closest('[data-label]');
    if (labelled) {
      cursorEl.classList.add('is-label');
      label.textContent = labelled.getAttribute('data-label');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest(hoverables);
    if (!t) return;
    cursorEl.classList.remove('is-hover', 'is-label');
  });

  /* spotlight follows cursor */
  const spot = document.createElement('div');
  spot.className = 'spotlight';
  document.body.appendChild(spot);
  window.addEventListener('mousemove', (e) => {
    spot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

/* ============================================================
   PARTICLES
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const count = window.innerWidth < 768 ? 46 : 96;
  const mouse = { x: -9999, y: -9999 };
  const COLORS = [
    'rgba(207,234,255,',
    'rgba(236,216,168,',
    'rgba(63,214,192,',
    'rgba(138,123,246,',
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function make() {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.4,
        c: Math.floor(Math.random() * COLORS.length),
        twSpeed: Math.random() * 1.6 + 0.4,
        twPhase: Math.random() * Math.PI * 2,
        glint: Math.random() < 0.14,
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const t = performance.now() / 1000;
    const link = 120;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      const dxm = p.x - mouse.x, dym = p.y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 140) { p.x += (dxm / dm) * 0.9; p.y += (dym / dm) * 0.9; }
      if (p.x < -20) p.x = window.innerWidth + 20; else if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20; else if (p.y > window.innerHeight + 20) p.y = -20;

      const tw = 0.5 + 0.5 * Math.sin(t * p.twSpeed + p.twPhase);
      const a = 0.22 + 0.5 * tw;

      if (p.glint) {
        const s = p.r * (3 + 2.4 * tw);
        ctx.strokeStyle = COLORS[p.c] + (a * 0.9) + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y);
        ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.5 * tw) + ')';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.c] + a + ')';
        ctx.fill();
      }

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(215,218,224,' + ((1 - d / link) * 0.05) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(step);
  }

  let raf;
  resize();
  make();
  window.addEventListener('resize', () => { resize(); make(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(step);
  });
  step();
}

/* ============================================================
   DISCO BALL
   ============================================================ */
function initDiscoBall() {
  const canvas = document.getElementById('disco');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const LAT = 9, LON = 18;
  let rot = 0;
  let raf = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvas.parentElement ? canvas.parentElement.clientWidth : 190;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const s = canvas.clientWidth || canvas.width;
    if (!s) return;
    const cx = s / 2, cy = s / 2, R = s / 2 - 3;
    ctx.clearRect(0, 0, s, s);

    ctx.strokeStyle = 'rgba(215,218,224,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, 5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, 6, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(215,218,224,0.5)'; ctx.fill();

    const lx = 0.42, ly = -0.6, lz = 0.68;
    for (let i = 1; i < LAT; i++) {
      const theta = (i / LAT) * Math.PI;
      for (let j = 0; j < LON; j++) {
        const phi = (j / LON) * Math.PI * 2 + rot;
        const nx = Math.sin(theta) * Math.cos(phi);
        const ny = Math.cos(theta);
        const nz = Math.sin(theta) * Math.sin(phi);
        if (nz <= 0) continue;
        const b = Math.max(0, nx * lx + ny * ly + nz * lz);
        const x = cx + nx * R;
        const y = cy - ny * R;
        const t = (R * 2) / LAT;
        const sz = t * (0.72 + 0.28 * Math.sin(theta));
        let col;
        if (b > 0.86) col = 'rgba(255,252,242,0.95)';
        else if (b > 0.6) col = 'rgba(236,216,168,' + (0.25 + b * 0.45).toFixed(2) + ')';
        else if (b > 0.3) col = 'rgba(150,180,215,' + (0.10 + b * 0.35).toFixed(2) + ')';
        else col = 'rgba(90,100,120,' + (0.05 + b * 0.25).toFixed(2) + ')';
        ctx.fillStyle = col;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    }

    const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(214,179,115,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    const flash = Math.sin(rot * 3.1);
    if (flash > 0.965) {
      const gx = cx - R * 0.4, gy = cy - R * 0.5;
      const gl = 8 + (flash - 0.965) * 260;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx - gl, gy); ctx.lineTo(gx + gl, gy);
      ctx.moveTo(gx, gy - gl); ctx.lineTo(gx, gy + gl);
      ctx.stroke();
    }
  }

  function frame() {
    rot += 0.007;
    draw();
    if (!reduced) raf = requestAnimationFrame(frame);
  }

  resize();
  if (reduced) { rot = 0.8; frame(); }
  else { raf = requestAnimationFrame(frame); }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf && !reduced) raf = requestAnimationFrame(frame);
  });
}

/* ============================================================
   INTRO TIMELINE
   ============================================================ */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.05 });
  tl.set('.nav', { yPercent: -120 })
    .fromTo('.nav', { yPercent: -120 }, { yPercent: 0, duration: 0.8 }, 0.2)
    .fromTo('.hero__eyebrow .txt-mask__inner', { yPercent: 120 }, { yPercent: 0, duration: 0.8 }, 0.35)
    .fromTo('.hero__line .txt-mask__inner', { yPercent: 120 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.45)
    .fromTo('.hero__line .char', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.014 }, 0.5)
    .fromTo('.hero__sub .txt-mask__inner', { yPercent: 120 }, { yPercent: 0, duration: 0.9 }, 0.85)
    .fromTo('.hero__actions .txt-mask__inner', { yPercent: 120 }, { yPercent: 0, duration: 0.9 }, 0.95)
    .fromTo('.hero__vinyl', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0.5)
    .fromTo('.hero__disco', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0.6)
    .fromTo('.hero__eq span', { scaleY: 0 }, { scaleY: 1, duration: 0.5, stagger: 0.05 }, 1.0)
    .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.2);
}

/* ============================================================
   REVEALS ON SCROLL
   ============================================================ */
function initReveals() {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 44,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
  gsap.utils.toArray('.discog-card').forEach((el, i) => {
    gsap.from(el, {
      y: 60,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
  gsap.from('.footer__wordmark', {
    yPercent: 60, autoAlpha: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true },
  });
}

/* ============================================================
   COUNTERS
   ============================================================ */
function initCounters() {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate() { el.textContent = prefix + Math.round(obj.v) + suffix; },
    });
  });
}

/* ============================================================
   MAGNETIC
   ============================================================ */
function initMagnetic() {
  if (!finePointer) return;
  gsap.utils.toArray('.magnetic').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    });
  });
}

/* ============================================================
   CARD TILT
   ============================================================ */
function initTilt() {
  if (!finePointer) return;
  gsap.utils.toArray('.discog-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 12, rotateX: -py * 12, duration: 0.5, ease: 'power2.out' });
      gsap.to(card.querySelector('.discog-card__cover'), { scale: 1.06, duration: 0.5 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      gsap.to(card.querySelector('.discog-card__cover'), { scale: 1, duration: 0.5 });
    });
  });
}

/* ============================================================
   PARALLAX & AMBIENT
   ============================================================ */
function initParallax() {
  gsap.to('.bg__blob--1', { yPercent: 20, xPercent: 10, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true } });
  gsap.to('.bg__blob--2', { yPercent: -25, xPercent: -8, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true } });
  gsap.to('.bg__blob--3', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true } });
  gsap.to('.hero__vinyl', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
function initProgress() {
  gsap.to('#progressBar', {
    scaleX: 1,
    ease: 'none',
    transformOrigin: 'left center',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  if (!reduced) {
    initParticles();
    initDiscoBall();
    initParallax();
    runPreloader(() => { intro(); initReveals(); initCounters(); initMagnetic(); initTilt(); initProgress(); ScrollTrigger.refresh(); });
  } else {
    gsap.set('#preloader', { display: 'none' });
    gsap.set(['.reveal', '.discog-card', '.footer__wordmark'], { autoAlpha: 1 });
    initCounters();
    initDiscoBall();
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* safety net — never leave the visitor stuck behind the preloader */
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if (p && getComputedStyle(p).display !== 'none') {
      gsap.set('#preloader', { display: 'none' });
      gsap.set(['.hero__line .txt-mask__inner', '.hero__eyebrow .txt-mask__inner', '.hero__sub .txt-mask__inner', '.hero__actions .txt-mask__inner', '.nav'], { clearProps: 'all' });
      gsap.set(['.hero__vinyl', '.hero__disco', '.hero__eq span', '.hero__scroll'], { clearProps: 'all' });
    }
  }, 6000);
}
boot();
