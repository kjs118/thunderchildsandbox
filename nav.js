/* nav.js — injects nav, announcement bar, footer, and shared behaviors */

(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // ── Announcement bar ──────────────────────────────────────────────
  const banner = document.getElementById('announcement-bar');
  if (banner) {
    const dismissed = sessionStorage.getItem('tc-banner-dismissed');
    if (!dismissed) {
      banner.style.display = 'block';
      document.body.classList.add('has-banner');
      banner.querySelector('.dismiss').addEventListener('click', () => {
        banner.style.display = 'none';
        document.body.classList.remove('has-banner');
        sessionStorage.setItem('tc-banner-dismissed', '1');
      });
    }
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
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Active nav link ───────────────────────────────────────────────
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // ── Scroll reveal ─────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  }

  // ── Parallax on scroll ────────────────────────────────────────────
  const parallaxBgs = document.querySelectorAll('.parallax-bg[data-speed]');
  if (parallaxBgs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxBgs.forEach(bg => {
        const speed = parseFloat(bg.dataset.speed) || 0.3;
        bg.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }
})();
