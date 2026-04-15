/* ============================================================
   NISHANTH K — PORTFOLIO JAVASCRIPT
   Deep Purple Theme — Full Animation Suite
   ============================================================ */

'use strict';

// ============================================================
// 1. CUSTOM CURSOR — RING + DOT WITH LAG
// ============================================================
const cursorOuter = document.getElementById('cursor-outer');
const cursorDot   = document.getElementById('cursor-dot');
let mx = -100, my = -100;
let ox = -100, oy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animateOuter() {
  ox += (mx - ox) * 0.1;
  oy += (my - oy) * 0.1;
  cursorOuter.style.left = ox + 'px';
  cursorOuter.style.top  = oy + 'px';
  requestAnimationFrame(animateOuter);
})();

// Hover state
document.querySelectorAll('a, button, .project-card, .filter-btn, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Click ripple
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ============================================================
// 2A. SPACE CANVAS — deep void background (fixed, all sections)
//     Calm, minimal: gentle stars only — no competing elements
// ============================================================
const spaceCanvas = document.getElementById('space-canvas');
const sCtxS = spaceCanvas.getContext('2d');

function resizeSpaceCanvas() {
  spaceCanvas.width  = window.innerWidth;
  spaceCanvas.height = window.innerHeight;
}
resizeSpaceCanvas();
window.addEventListener('resize', resizeSpaceCanvas);

// ---- Stars — fewer, calmer, very subtle ----
const STAR_COUNT = 180;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x:     Math.random() * window.innerWidth,
  y:     Math.random() * window.innerHeight,
  r:     Math.random() * 0.9 + 0.15,
  phase: Math.random() * Math.PI * 2,
  speed: 0.002 + Math.random() * 0.004,   // slow twinkle
  base:  0.12 + Math.random() * 0.30,     // dim — very calm
}));

// Reposition stars after resize
window.addEventListener('resize', () => {
  stars.forEach(s => {
    s.x = Math.random() * window.innerWidth;
    s.y = Math.random() * window.innerHeight;
  });
});

// ---- Single very subtle nebula — just a deep purple vignette tint ----
const nebulae = [
  { cx: 0.68, cy: 0.18, r: 0.35, color: '90,40,180',   alpha: 0.022, phase: 0,   speed: 0.0003 },
  { cx: 0.18, cy: 0.72, r: 0.28, color: '110,50,200',  alpha: 0.016, phase: 2.5, speed: 0.0004 },
];

// ---- Occasional shooting stars (rare, graceful) ----
const shooters = [];
let nextShooter = Date.now() + 6000 + Math.random() * 8000; // less frequent

function spawnShooter() {
  const side  = Math.random() < 0.6 ? 'top' : 'right';
  const angle = (20 + Math.random() * 15) * (Math.PI / 180);
  shooters.push({
    x:     side === 'top' ? Math.random() * spaceCanvas.width : spaceCanvas.width + 10,
    y:     side === 'top' ? -10 : Math.random() * spaceCanvas.height * 0.4,
    vx:    side === 'top' ?  Math.cos(angle) * 10 :  -Math.cos(angle) * 10,
    vy:    side === 'top' ?  Math.sin(angle) * 10 :   Math.sin(angle) * 9,
    life:  1.0,
    decay: 0.014 + Math.random() * 0.012, // slower fade
    len:   40 + Math.random() * 45,
  });
}

let spaceT = 0;

function drawSpace() {
  const W = spaceCanvas.width, H = spaceCanvas.height;
  sCtxS.clearRect(0, 0, W, H);

  // 1. Very dark, calm space gradient — slightly warmer center
  const grad = sCtxS.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
  grad.addColorStop(0,   'rgba(8, 4, 20, 1)');
  grad.addColorStop(0.6, 'rgba(5, 2, 14, 1)');
  grad.addColorStop(1,   'rgba(3, 1,  9, 1)');
  sCtxS.fillStyle = grad;
  sCtxS.fillRect(0, 0, W, H);

  // 2. Very subtle nebula — barely-there purple vignettes
  spaceT += 0.016;
  nebulae.forEach(n => {
    const pulse = Math.sin(spaceT * n.speed * 100 + n.phase) * 0.008;
    const r     = (n.r + pulse) * Math.max(W, H);
    const cx    = n.cx * W;
    const cy    = n.cy * H;
    const g     = sCtxS.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0,   `rgba(${n.color}, ${n.alpha})`);
    g.addColorStop(0.5, `rgba(${n.color}, ${n.alpha * 0.25})`);
    g.addColorStop(1,   `rgba(${n.color}, 0)`);
    sCtxS.fillStyle = g;
    sCtxS.fillRect(0, 0, W, H);
  });

  // 3. Stars — gentle, calm twinkle
  stars.forEach(s => {
    s.phase += s.speed;
    const alpha = s.base + Math.sin(s.phase) * (s.base * 0.5);
    sCtxS.beginPath();
    sCtxS.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    // Only very large stars get a faint glow (subtle)
    if (s.r > 0.82) {
      sCtxS.shadowBlur  = 3;
      sCtxS.shadowColor = `rgba(200, 185, 255, ${alpha * 0.4})`;
    }
    sCtxS.fillStyle = `rgba(215, 205, 255, ${alpha})`;
    sCtxS.fill();
    sCtxS.shadowBlur = 0;
  });

  // 4. Constant "Comet / Circuit Data Stream" background
  const now = Date.now();
  if (now > nextShooter) {
    spawnShooter();
    nextShooter = now + 600 + Math.random() * 1400; // Frequent data comets
  }

  for (let i = shooters.length - 1; i >= 0; i--) {
    const sh = shooters[i];
    sh.x    += sh.vx;
    sh.y    += sh.vy;
    sh.life -= sh.decay;
    if (sh.life <= 0) { shooters.splice(i, 1); continue; }

    const tailX = sh.x - sh.vx * (sh.len / Math.hypot(sh.vx, sh.vy));
    const tailY = sh.y - sh.vy * (sh.len / Math.hypot(sh.vx, sh.vy));
    const lg    = sCtxS.createLinearGradient(tailX, tailY, sh.x, sh.y);
    lg.addColorStop(0,   `rgba(255,255,255,0)`);
    lg.addColorStop(0.5, `rgba(168,85,247, ${sh.life * 0.4})`); // glowing purple tail
    lg.addColorStop(1,   `rgba(255,255,255, ${sh.life})`);       // bright white head
    
    sCtxS.beginPath();
    sCtxS.moveTo(tailX, tailY);
    sCtxS.lineTo(sh.x, sh.y);
    sCtxS.strokeStyle = lg;
    sCtxS.lineWidth   = sh.life * 2.5; // Thicker, more prominent comet trails
    sCtxS.shadowBlur  = 12;            // Strong background glow for comets
    sCtxS.shadowColor = '#a855f7';
    sCtxS.stroke();
    sCtxS.shadowBlur  = 0;
  }

  requestAnimationFrame(drawSpace);
}
drawSpace();

// ============================================================
// 2B. CIRCUIT BOARD CANVAS — DISABLED in hero for cleaner look
//     The hero background is now purely the calm space canvas.
// ============================================================
const canvas = document.getElementById('circuit-canvas');
// Hide the circuit canvas so it doesn't compete with the space background
if (canvas) canvas.style.display = 'none';

// ============================================================
// 3. OSCILLOSCOPE ANIMATION
// ============================================================
const oscWave    = document.getElementById('osc-wave');
const oscWave2   = document.getElementById('osc-wave2');
const freqDisplay = document.getElementById('freq-display');
let oscTime = 0;
const W = 480, H = 220, MID = H / 2;

function buildOscPath(time, amplitude, frequency, phase, type) {
  const pts = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const t = (i / steps) * frequency * Math.PI * 2 + phase + time;
    let y;
    if (type === 'square') {
      y = MID + (Math.sin(t) > 0 ? -1 : 1) * amplitude;
    } else {
      y = MID + Math.sin(t) * amplitude * (1 + 0.08 * Math.sin(t * 0.3));
    }
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

(function tickOsc() {
  oscTime += 0.04;
  const freq = 440 + Math.sin(oscTime * 0.1) * 120;
  if (oscWave)  oscWave.setAttribute('d',  buildOscPath(oscTime, 65, 5.5, 0, 'sine'));
  if (oscWave2) oscWave2.setAttribute('d', buildOscPath(oscTime, 35, 8, Math.PI * 0.6, 'square'));
  if (freqDisplay) freqDisplay.textContent = freq.toFixed(0);
  requestAnimationFrame(tickOsc);
})();

// ============================================================
// 4. NAVBAR — scroll glass + active sliding indicator
// ============================================================
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const navIndicator = document.getElementById('nav-indicator');
const sections = ['about','experience','projects','skills','contact'];

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  let current = '';
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
    if (a.dataset.section === current) {
      moveIndicator(a);
    }
  });
}

function moveIndicator(el) {
  if (!navIndicator || !el) return;
  const parentRect = el.closest('ul').getBoundingClientRect();
  const elRect     = el.getBoundingClientRect();
  navIndicator.style.left  = (elRect.left - parentRect.left) + 'px';
  navIndicator.style.width = elRect.width + 'px';
}

// Neon hover flicker on nav links
navLinks.forEach(a => {
  a.addEventListener('mouseenter', () => {
    a.style.textShadow = `0 0 12px var(--glow), 0 0 24px var(--glow)`;
    setTimeout(() => { a.style.textShadow = ''; }, 200);
  });
});

// ============================================================
// 5. HAMBURGER MENU
// ============================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// 6. HERO — FULL TYPING ANIMATION SEQUENCE
//    Everything feels like it's being typed live in a terminal:
//    boot lines → name typed char-by-char → tagline typed out
//    → CTAs and location fade in
// ============================================================

// Hide solder canvas — no longer used
const solderCvHide = document.getElementById('solder-canvas');
if (solderCvHide) solderCvHide.style.display = 'none';

/**
 * Type text into an element char by char.
 * @param {Element} el  - target element
 * @param {string}  text
 * @param {number}  msPerChar  - delay between chars (ms)
 * @param {boolean} showCursor - append blinking cursor span while typing
 * @param {string}  cursorClass - CSS class for the cursor span
 */
function typeText(el, text, msPerChar, showCursor = false, cursorClass = 'boot-cursor') {
  return new Promise(resolve => {
    el.textContent = '';
    // Live cursor span
    let cursorSpan = null;
    if (showCursor) {
      cursorSpan = document.createElement('span');
      cursorSpan.className = cursorClass;
      el.appendChild(cursorSpan);
    }
    let i = 0;
    function step() {
      if (i < text.length) {
        // Insert char before cursor (or just append)
        if (cursorSpan) {
          el.insertBefore(document.createTextNode(text[i++]), cursorSpan);
        } else {
          el.textContent += text[i++];
        }
        setTimeout(step, msPerChar);
      } else {
        resolve();
      }
    }
    step();
  });
}

/**
 * Type the name into #hero-name with a BIG block cursor and a purple glow reveal.
 */
async function typeHeroName(name) {
  const nameEl = document.getElementById('hero-name');
  if (!nameEl) return;

  nameEl.textContent = '';
  nameEl.style.opacity = '1'; // visible from the start — typing reveals it

  // Append a cursor that lives inside the big name
  const nameCursor = document.createElement('span');
  nameCursor.id        = 'hero-name-cursor';
  nameCursor.className = 'hero-name-cursor';
  nameEl.appendChild(nameCursor);

  // Type each character with a slight random variance (human feel)
  for (const ch of name) {
    nameEl.insertBefore(document.createTextNode(ch), nameCursor);
    const delay = ch === ' ' ? 120 : 55 + Math.random() * 60; // space = slightly longer pause
    await new Promise(r => setTimeout(r, delay));
  }

  // Hold cursor for a beat then make it stay (becomes permanent blinking cursor)
  await new Promise(r => setTimeout(r, 350));

  // ── VGA Glitch: signal corruption flicker ──
  // Brief RGB channel split + horizontal drift, like a bad HDMI signal.
  // Screams "electronics engineer" without being gimmicky.
  nameEl.classList.add('hero-name--glitch');
  await new Promise(r => setTimeout(r, 620));
  nameEl.classList.remove('hero-name--glitch');

  // Remove name cursor after glitch (nameCursor already declared above)
  nameCursor.remove();
}

const NAME = 'NISHANTH K';

async function runHeroBoot() {
  const bootInit = document.getElementById('boot-init');
  if (!bootInit) return;

  // Quick screen flicker on load
  document.body.style.opacity = '0.25';
  await new Promise(r => setTimeout(r, 60));
  document.body.style.opacity = '0.7';
  await new Promise(r => setTimeout(r, 40));
  document.body.style.opacity = '1';

  const bootLoc    = document.getElementById('boot-loc');
  const bootStatus = document.getElementById('boot-status');

  // ── Line 1: INITIALIZING SYSTEMS... (already in HTML, just show it) ──
  bootInit.classList.add('show');
  await new Promise(r => setTimeout(r, 160));

  // ── Line 2: type LOCATION ──
  bootLoc.classList.add('show');
  await typeText(bootLoc, '> LOCATION: BENGALURU, INDIA', 18);
  await new Promise(r => setTimeout(r, 80));

  // ── Line 3: type STATUS ──
  bootStatus.classList.add('show');
  await typeText(bootStatus, '> STATUS: EMBEDDED SYSTEMS & ROBOTICS ENGINEER', 14);

  // Blinking cursor stays briefly then disappears
  const bootCursor = document.createElement('span');
  bootCursor.className = 'boot-cursor';
  bootStatus.appendChild(bootCursor);
  await new Promise(r => setTimeout(r, 800));
  bootCursor.remove();

  // ── TYPE THE NAME (big, hero-sized) ──
  await typeHeroName(NAME);

  // ── TYPE THE TAGLINE (italic quote line) ──
  const taglineEl = document.getElementById('hero-tagline');
  if (taglineEl) {
    // Make it visible first (opacity will be at 0), then type into it
    taglineEl.classList.add('visible');
    taglineEl.textContent = '';
    const taglineText = '"I build the hardware. I write the firmware. I ship the robot."';
    // Small cursor while typing tagline
    const taglineCursor = document.createElement('span');
    taglineCursor.className = 'boot-cursor boot-cursor--inline';
    taglineEl.appendChild(taglineCursor);
    for (const ch of taglineText) {
      taglineEl.insertBefore(document.createTextNode(ch), taglineCursor);
      await new Promise(r => setTimeout(r, 14 + Math.random() * 16));
    }
    await new Promise(r => setTimeout(r, 600));
    // Remove the inline cursor — tagline is done
    taglineCursor.remove();
  }

  // ── Reveal CTAs and location ──
  await new Promise(r => setTimeout(r, 100));
  document.getElementById('hero-ctas').classList.add('visible');
  await new Promise(r => setTimeout(r, 120));
  document.getElementById('hero-location').classList.add('visible');
  document.getElementById('hero-visual').classList.add('visible');
}

// Start hero boot after brief paint
setTimeout(runHeroBoot, 80);

// ============================================================
// 8. SECTION LABELS — TYPE-OUT ON SCROLL
// ============================================================
const sectionLabelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const text = el.dataset.typeLabel || '';
      let i = 0;
      el.textContent = '';
      function typeLabel() {
        if (i < text.length) {
          el.textContent = text.slice(0, ++i);
          setTimeout(typeLabel, 30);
        }
      }
      typeLabel();
      sectionLabelObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-label[data-type-label]').forEach(el => {
  sectionLabelObserver.observe(el);
});

// ============================================================
// 9. SECTION TITLES — SLIDE UP ON SCROLL
// ============================================================
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      titleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

// ============================================================
// 10. SCROLL REVEAL (general)
// ============================================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// 11. TIMELINE — DRAW-IN + NODE POP
// ============================================================
const timeline      = document.getElementById('timeline');
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      timeline.classList.add('drawn');
      timelineItems.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 220 + 300);
      });
      timelineObserver.disconnect();
    }
  });
}, { threshold: 0.1 });
if (timeline) timelineObserver.observe(timeline);

// ============================================================
// 12. PROJECT CARDS — 3D TILT + LIGHT TRACE + DROP-IN
// ============================================================
const projectCards = document.querySelectorAll('.project-card');
const filterBtns   = document.querySelectorAll('.filter-btn');
const isMobile     = () => window.innerWidth < 900;

// Drop-in scroll reveal + Magazine Layout initializer
function applyGridClasses() {
  const visibleCards = Array.from(document.querySelectorAll('.project-card:not(.hidden)'));
  visibleCards.forEach((card, index) => {
    card.classList.remove('card-full', 'card-half', 'card-2-3', 'card-1-3');
    const pos = index % 5;
    if (pos === 0) card.classList.add('card-full');
    else if (pos === 1 || pos === 2) card.classList.add('card-half');
    else if (pos === 3) card.classList.add('card-2-3');
    else if (pos === 4) card.classList.add('card-1-3');
  });
}

// ---- Automated Thumbnail Initializer ----
function initializeThumbnails() {
  document.querySelectorAll('.project-card').forEach(card => {
    const mediaRaw = card.dataset.media || '[]';
    let media = [];
    try { media = JSON.parse(mediaRaw); } catch(e) {}
    
    if (media.length === 0) return;

    const thumbContainer = card.querySelector('.project-thumb');
    const imgEl = card.querySelector('.project-img');
    const src = media[0];
    const isVideo = card.dataset.mediaType === 'video';

    if (isVideo && src) {
      if (src.includes('streamable.com')) {
        // Streamable live thumbnail
        const vid = src.split('com/')[1].split('?')[0];
        const iframe = document.createElement('iframe');
        iframe.src = `https://streamable.com/e/${vid}?autoplay=1&muted=1&loop=1&controls=0`;
        iframe.className = 'project-img video-thumb iframe-thumb';
        iframe.style.pointerEvents = 'none';
        iframe.frameBorder = '0';
        if (imgEl) imgEl.replaceWith(iframe);
      } else if (src.toLowerCase().endsWith('.mp4')) {
        // Local live video thumbnail
        const video = document.createElement('video');
        video.src = src;
        video.className = 'project-img video-thumb';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.objectFit = 'cover';
        if (imgEl) imgEl.replaceWith(video);
      } else if (imgEl) {
        // Fallback to static if it's an image even in a video project
        imgEl.src = src;
      }
    } else if (imgEl) {
      // Standard static photo thumbnail
      imgEl.src = src;
    }
  });
}

applyGridClasses();
initializeThumbnails();

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger cards based on order
      const cards = [...document.querySelectorAll('.project-card:not(.hidden)')];
      const idx   = cards.indexOf(entry.target);
      const delay = (idx % 3) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

projectCards.forEach(card => cardObserver.observe(card));

// 3D tilt + light trace
projectCards.forEach(card => {
  const lightEl = card.querySelector('.project-light');

  card.addEventListener('mousemove', e => {
    if (isMobile()) return;
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
    const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
    const rotX   = -dy * 12;  // tilt up/down
    const rotY   =  dx * 12;  // tilt left/right

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    card.style.boxShadow = `${-dx*12}px ${-dy*12}px 30px rgba(124,58,237,0.2), 0 20px 60px rgba(0,0,0,0.5)`;

    // Light trace
    if (lightEl) {
      const lx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const ly = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      lightEl.style.setProperty('--x', lx + '%');
      lightEl.style.setProperty('--y', ly + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.boxShadow  = '';
    card.style.transition = 'transform 0.4s ease-out, box-shadow 0.4s ease-out, border-color 0.3s ease, opacity 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s ease, box-shadow 0.15s ease';
  });
});

// Filter logic
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.cat === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), (i % 3) * 80);
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });
    applyGridClasses(); // Reapply magazine layout logic after filter
  });
});

// ============================================================
// 13. PROJECT MODAL — Media-aware (video / photo carousel)
// ============================================================
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose    = document.getElementById('modal-close');
const modalTitle    = document.getElementById('modal-title');
const modalDesc     = document.getElementById('modal-desc');
const modalTags     = document.getElementById('modal-tags');
const modalCat      = document.getElementById('modal-category');
const modalMedia    = document.getElementById('modal-media');
const modalLinks    = document.getElementById('modal-links');
const modalLiveLink = document.getElementById('modal-live-link');
const catClassMap   = { hardware: '', software: 'software', ai: 'ai' };

// ── Carousel state ──
let _carouselTimer   = null;
let _carouselIndex   = 0;
let _carouselItems   = [];
let _carouselPaused  = false;
let _touchStartX     = 0;

function clearCarouselTimer() {
  if (_carouselTimer) { clearInterval(_carouselTimer); _carouselTimer = null; }
}

function goToSlide(idx) {
  const slides = modalMedia.querySelectorAll('.mc-slide');
  const dots   = modalMedia.querySelectorAll('.mc-dot');
  if (!slides.length) return;
  _carouselIndex = (idx + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('active', i === _carouselIndex));
  dots.forEach((d, i)   => d.classList.toggle('active', i === _carouselIndex));
}

function buildCarousel(items, name) {
  clearCarouselTimer();
  _carouselIndex  = 0;
  _carouselPaused = false;
  _carouselItems  = items;

  if (!items || items.length === 0) {
    modalMedia.innerHTML = `
      <div class="mc-placeholder">
        <span>📷</span>
        <p>Photos coming soon</p>
      </div>`;
    return;
  }

  const slidesHTML = items.map((src, i) => `
    <div class="mc-slide${i === 0 ? ' active' : ''}">
      <img src="${src}" alt="${name} — photo ${i + 1}" loading="lazy" />
    </div>`).join('');

  const dotsHTML = items.map((_, i) => `
    <button class="mc-dot${i === 0 ? ' active' : ''}" aria-label="slide ${i + 1}"></button>`).join('');

  modalMedia.innerHTML = `
    <div class="mc-track">${slidesHTML}</div>
    <button class="mc-arrow mc-prev" aria-label="Previous">‹</button>
    <button class="mc-arrow mc-next" aria-label="Next">›</button>
    <div class="mc-dots">${dotsHTML}</div>`;

  // Arrow clicks
  modalMedia.querySelector('.mc-prev').addEventListener('click', () => {
    _carouselPaused = true;
    clearCarouselTimer();
    goToSlide(_carouselIndex - 1);
  });
  modalMedia.querySelector('.mc-next').addEventListener('click', () => {
    _carouselPaused = true;
    clearCarouselTimer();
    goToSlide(_carouselIndex + 1);
  });

  // Dot clicks
  modalMedia.querySelectorAll('.mc-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      _carouselPaused = true;
      clearCarouselTimer();
      goToSlide(i);
    });
  });

  // Touch swipe
  const track = modalMedia.querySelector('.mc-track');
  track.addEventListener('touchstart', e => { _touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _touchStartX;
    if (Math.abs(dx) > 40) {
      _carouselPaused = true;
      clearCarouselTimer();
      goToSlide(_carouselIndex + (dx < 0 ? 1 : -1));
    }
  });

  // Auto-advance every 3s (if not paused)
  if (items.length > 1) {
    _carouselTimer = setInterval(() => {
      if (!_carouselPaused) goToSlide(_carouselIndex + 1);
    }, 3000);
  }
}

function buildVideoPlayer(src, name, rotate = null) {
  clearCarouselTimer();
  if (!src) {
    modalMedia.innerHTML = `
      <div class="mc-placeholder">
        <span>🎬</span>
        <p>Video coming soon</p>
      </div>`;
    return;
  }

  // Handle YouTube/Vimeo/Streamable
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo   = src.includes('vimeo.com');
  const isStream  = src.includes('streamable.com');

  if (isYoutube || isVimeo || isStream) {
    let embedUrl = '';
    if (isYoutube) {
      let vid = '';
      if (src.includes('v=')) {
        vid = src.split('v=')[1].split('&')[0];
      } else {
        vid = src.split('be/')[1].split('?')[0];
      }
      embedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=1`;
    } else if (isVimeo) {
      const vid = src.split('com/')[1].split('?')[0];
      embedUrl = `https://player.vimeo.com/video/${vid}?autoplay=1&muted=1&loop=1`;
    } else if (isStream) {
      const vid = src.split('com/')[1].split('?')[0];
      embedUrl = `https://streamable.com/e/${vid}?autoplay=1&muted=1&loop=1`;
    }

    modalMedia.innerHTML = `
      <div class="mv-wrap">
        <iframe src="${embedUrl}" 
                class="mv-video" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowfullscreen></iframe>
      </div>`;
    return;
  }

  modalMedia.innerHTML = `
    <div class="mv-wrap">
      <video class="mv-video" id="modal-video" src="${src}"
             autoplay muted loop playsinline
             aria-label="${name} demo video"></video>
      <button class="mv-unmute" id="mv-unmute" aria-label="Unmute">🔇</button>
    </div>`;

  const video   = modalMedia.querySelector('#modal-video');
  const unmute  = modalMedia.querySelector('#mv-unmute');

  unmute.addEventListener('click', () => {
    video.muted = !video.muted;
    unmute.textContent = video.muted ? '🔇' : '🔊';
  });
}

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.name;
    modalCat.textContent   = card.dataset.cat.toUpperCase();
    modalCat.className     = 'project-category ' + (catClassMap[card.dataset.cat] || '');

    // ── Live link ──
    if (card.dataset.url && modalLinks) {
      modalLiveLink.href = card.dataset.url;
      modalLinks.style.display = 'block';
    } else if (modalLinks) {
      modalLinks.style.display = 'none';
      modalLiveLink.href = '#';
    }

    // ── Media area ──
    const mediaType  = card.dataset.mediaType || 'photos';
    let   mediaItems = [];
    try { mediaItems = JSON.parse(card.dataset.media || '[]'); } catch(e) {}

    if (mediaType === 'video') {
      buildVideoPlayer(mediaItems[0] || null, card.dataset.name, card.dataset.rotate);
    } else {
      buildCarousel(mediaItems, card.dataset.name);
    }

    // ── Structured description renderer ──
    const raw = (card.dataset.desc || '').trim();
    modalDesc.innerHTML = '';

    if (raw.startsWith('HOOK:')) {
      const sections = raw.split(/\n\n+/);
      const hookText = sections[0].replace(/^HOOK:\s*/i, '').trim();

      const hookEl = document.createElement('div');
      hookEl.className = 'modal-hook';
      hookEl.textContent = hookText;
      modalDesc.appendChild(hookEl);

      const parasEl = document.createElement('div');
      parasEl.className = 'modal-paragraphs';

      let challengeText = null;

      for (let i = 1; i < sections.length; i++) {
        const block = sections[i].trim();
        if (block.toUpperCase().startsWith('KEY CHALLENGE:')) {
          challengeText = block.replace(/^KEY CHALLENGE:\s*/i, '').trim();
        } else {
          const p = document.createElement('p');
          p.textContent = block;
          parasEl.appendChild(p);
        }
      }

      if (parasEl.children.length) modalDesc.appendChild(parasEl);

      if (challengeText) {
        const challengeEl = document.createElement('div');
        challengeEl.className = 'modal-challenge';
        const label = document.createElement('div');
        label.className = 'modal-challenge-label';
        label.textContent = '// Key Challenge';
        const cp = document.createElement('p');
        cp.textContent = challengeText;
        challengeEl.appendChild(label);
        challengeEl.appendChild(cp);
        modalDesc.appendChild(challengeEl);
      }
    } else {
      const blocks = raw.split(/\n\n+/).filter(Boolean);
      if (blocks.length <= 1) {
        modalDesc.textContent = raw;
      } else {
        const parasEl = document.createElement('div');
        parasEl.className = 'modal-paragraphs';
        blocks.forEach(block => {
          const p = document.createElement('p');
          p.textContent = block.trim();
          parasEl.appendChild(p);
        });
        modalDesc.appendChild(parasEl);
      }
    }

    // ── Tags ──
    modalTags.innerHTML = '';
    card.dataset.tech.split(',').forEach(t => {
      const span = document.createElement('span');
      span.className   = 'project-tag';
      span.textContent = t.trim();
      modalTags.appendChild(span);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  clearCarouselTimer();
  // Pause any video
  const v = document.getElementById('modal-video');
  if (v) v.pause();
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ============================================================
// 14. SKILLS — MAGNETIC SNAP + PUSH EFFECT
// ============================================================
const skillGroups = document.querySelectorAll('.skill-group');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        // Force scattered start state immediately
        const rx = (Math.random() - 0.5) * 50;
        const ry = (Math.random() - 0.5) * 30;
        tag.style.transition = 'none';
        tag.style.transform  = `translate(${rx}px,${ry}px) scale(0.75)`;
        tag.style.opacity    = '0';

        // After next paint, animate to snapped position
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const delay = i * 30;
            tag.style.transition = `transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.45s ease ${delay}ms, border-color 0.3s ease, color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease`;
            tag.style.transform  = '';
            tag.style.opacity    = '1';
          });
        });
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

skillGroups.forEach(g => skillObserver.observe(g));

// Magnetic repulsion
document.querySelectorAll('.skill-tags').forEach(container => {
  container.addEventListener('mousemove', e => {
    const tags = container.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
      const rect = tag.getBoundingClientRect();
      const tagCx = rect.left + rect.width  / 2;
      const tagCy = rect.top  + rect.height / 2;
      const dx    = e.clientX - tagCx;
      const dy    = e.clientY - tagCy;
      const dist  = Math.hypot(dx, dy);
      if (dist < 60 && dist > 0) {
        const force = (60 - dist) / 60 * 3;
        const pushX = -(dx / dist) * force;
        const pushY = -(dy / dist) * force;
        if (!tag.matches(':hover')) {
          tag.style.transform = `translate(${pushX}px,${pushY}px) scale(1)`;
        }
      } else if (!tag.matches(':hover')) {
        tag.style.transform = '';
      }
    });
  });
  container.addEventListener('mouseleave', () => {
    container.querySelectorAll('.skill-tag').forEach(tag => {
      if (!tag.matches(':hover')) tag.style.transform = '';
    });
  });
});

// ============================================================
// 15. CONTACT SECTION — TERMINAL TYPING ON SCROLL
// ============================================================
const contactTerminal = document.getElementById('contact-terminal');
if (contactTerminal) {
  const contactRows = contactTerminal.querySelectorAll('.contact-row');

  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        contactRows.forEach((row, i) => {
          row.style.opacity   = '0';
          row.style.transform = 'translateX(-10px)';
          setTimeout(() => {
            row.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            row.style.opacity    = '1';
            row.style.transform  = 'translateX(0)';
          }, i * 180 + 200);
        });
        contactObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  contactObserver.observe(contactTerminal);
}

// ============================================================
// 16. NAVBAR — smooth scroll anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// 17. PARALLAX HERO CIRCUIT
// ============================================================
window.addEventListener('scroll', () => {
  canvas.style.transform = `translateY(${window.scrollY * 0.15}px)`;
}, { passive: true });

// ============================================================
// 17.5 BEYOND THE LAB — VOLTHUB CAROUSEL
// ============================================================
function initBeyondCarousel() {
  const wrapper = document.getElementById('volthub-carousel');
  if (!wrapper) return;
  const slides = wrapper.querySelectorAll('.mc-slide');
  const dots   = wrapper.querySelectorAll('.mc-dot');
  let currentIndex = 0;
  let timer = null;
  let paused = false;

  function go(idx) {
    if (!slides.length) return;
    currentIndex = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
    dots.forEach((d, i)   => d.classList.toggle('active', i === currentIndex));
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    if (!paused && slides.length > 1) {
      timer = setInterval(() => { go(currentIndex + 1); }, 3000);
    }
  }

  wrapper.querySelector('.mc-prev')?.addEventListener('click', () => {
    paused = true; go(currentIndex - 1); resetTimer();
  });
  wrapper.querySelector('.mc-next')?.addEventListener('click', () => {
    paused = true; go(currentIndex + 1); resetTimer();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      paused = true; go(i); resetTimer();
    });
  });

  resetTimer();
}
document.addEventListener('DOMContentLoaded', initBeyondCarousel);

// ============================================================
// 18. LIVE CLOCK IN STATUS BAR
// ============================================================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const timeEl = document.querySelector('.status-bar-right span:nth-child(2)');
  if (timeEl) timeEl.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// 19. PAGE LOAD — reveal in-viewport elements only
//     Boot sequence is already fired by setTimeout on line 445
// ============================================================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';

  // Reveal elements already in viewport
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) el.classList.add('visible');
  });
  document.querySelectorAll('.section-title').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) el.classList.add('visible');
  });
});

// ============================================================
// 20. HERO NAME GLITCH ON HOVER (after solder done)
// ============================================================
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0%   { text-shadow: 2px 0 #7c3aed, -2px 0 #06d6a0; }
    25%  { text-shadow: -2px 0 #a855f7, 2px 0 #06d6a0; transform: skewX(-2deg); }
    50%  { text-shadow: 2px 0 #06d6a0, -2px 0 #7c3aed; transform: skewX(2deg); }
    75%  { text-shadow: -1px 0 #a855f7; transform: skewX(0); }
    100% { text-shadow: none; }
  }
`;
document.head.appendChild(glitchStyle);

const finalHeroName = document.getElementById('hero-name');
if (finalHeroName) {
  finalHeroName.addEventListener('mouseenter', function() {
    this.style.animation = 'glitch 0.3s steps(2) forwards';
    setTimeout(() => { this.style.animation = ''; }, 360);
  });
}

console.log('%c NISHANTH K — EMBEDDED SYSTEMS & ROBOTICS ',
  'background:#7c3aed;color:#e2d9f3;font-family:monospace;font-size:14px;font-weight:bold;padding:6px 12px;border-radius:4px;');
console.log('%c github.com/thisisnish88-code ',
  'color:#a855f7;font-family:monospace;font-size:11px;');

// ============================================================
// 21. FORCE RESUME DOWNLOAD — bypass browser PDF viewer
//     Chrome/Edge open PDFs inline even with [download] attr.
//     This fetch-blob approach forces Save As dialog every time.
// ============================================================
document.querySelectorAll('a[download]').forEach(link => {
  link.addEventListener('click', async e => {
    e.preventDefault();
    const url      = link.href;
    const filename = link.getAttribute('download') || 'resume.pdf';
    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href     = blobUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      // Fallback: open in new tab if fetch fails
      console.warn('Force download failed, opening in tab:', err);
      window.open(url, '_blank');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.pcb-node');
    const traces = document.querySelectorAll('.pcb-trace');
    const pcbBoard = document.querySelector('.pcb-board');

    if (nodes.length > 0 && pcbBoard) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const id = node.dataset.id;
                pcbBoard.classList.add('hovering');
                node.classList.add('active');
                
                // Find all connected traces and highlight them + their connected nodes
                traces.forEach(trace => {
                    const conn = (trace.dataset.nodes || '').split(' ');
                    if(conn.includes(id)) {
                        trace.classList.add('active');
                        conn.forEach(nId => {
                            const n = document.querySelector(`.pcb-node[data-id="${nId}"]`);
                            if(n) n.classList.add('active');
                        });
                    }
                });
            });
            node.addEventListener('mouseleave', () => {
                pcbBoard.classList.remove('hovering');
                nodes.forEach(n => n.classList.remove('active'));
                traces.forEach(t => t.classList.remove('active'));
            });
        });
    }
});
