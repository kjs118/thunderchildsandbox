/* nav.js — shared behaviors: nav, announcement bar, footer, scroll effects */

(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // ── Inject announcement bar from shows data ───────────────────────
  function initBanner() {
    const bar = document.getElementById('announcement-bar');
    if (!bar) return;

    const shows = window.SHOWS_DATA;
    let html = '🎸 Loading next show…';
    if (shows && shows.length > 0) {
      const next = shows[0];
      html = `Next show: <strong>${next.day} ${next.monthYear} @ ${next.venue}, ${next.location}</strong>`;
    }

    // Wrap in banner-inner for ticker animation on mobile
    bar.innerHTML = `<div class="banner-inner">${html}</div><button class="dismiss" aria-label="Close">✕</button>`;

    bar.style.display = 'block';
    document.body.classList.add('has-banner');

    bar.querySelector('.dismiss').addEventListener('click', () => {
      bar.style.display = 'none';
      document.body.classList.remove('has-banner');
    });
  }

  // ── Nav scroll state ──────────────────────────────────────────────
  const nav = document.querySelector('.site-nav');
  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile menu toggle ────────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav link ───────────────────────────────────────────────
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // ── Scroll reveal ─────────────────────────────────────────────────
  document.body.classList.add('js-ready');
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  // ── Parallax on scroll ────────────────────────────────────────────
  const parallaxBgs = document.querySelectorAll('.parallax-bg[data-speed]');
  if (parallaxBgs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxBgs.forEach(bg => {
        const rect = bg.parentElement.getBoundingClientRect();
        const speed = parseFloat(bg.dataset.speed) || 0.3;
        bg.style.transform = `translateY(${(y - bg.parentElement.offsetTop + window.innerHeight/2) * speed * 0.4}px)`;
      });
    }, { passive: true });
  }

  // Run banner after SHOWS_DATA is available
  if (window.SHOWS_DATA) {
    initBanner();
  } else {
    window.addEventListener('load', initBanner);
  }
})();
