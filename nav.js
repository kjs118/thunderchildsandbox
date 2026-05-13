/* nav.js — shared behaviors: nav, announcement bar, footer, scroll effects */

(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // ── Inject announcement bar from shows data ───────────────────────
  function initBanner() {
    const bar = document.getElementById('announcement-bar');
    if (!bar) return;

    // Populate from SHOWS_DATA if available
    const shows = window.SHOWS_DATA;
    if (shows && shows.length > 0) {
      const next = shows[0];
      const textEl = bar.querySelector('.banner-text');
      if (textEl) {
        textEl.innerHTML = `🎸 Next show: <strong>${next.day} ${next.monthYear} @ ${next.venue}, ${next.location}</strong> &nbsp;·&nbsp; <a href="shows.html">See all shows →</a>`;
      }
    }

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

// ── Improved Parallax ─────────────────────────────────────────────
  const parallaxSections = document.querySelectorAll('.parallax-section');
  
  if (parallaxSections.length) {
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      
      parallaxSections.forEach(section => {
        const bg = section.querySelector('.parallax-bg');
        if (!bg) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // Check if the section is in the viewport
        if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
          // Calculate how far through the viewport the section is (0 to 1)
          const scrollFraction = (sectionTop + sectionHeight) / (windowHeight + sectionHeight);
          
          // Adjust the multiplier (0.15) to control speed/intensity
          const movement = (scrollFraction - 0.5) * 150; 
          
          bg.style.transform = `translate3d(0, ${movement}px, 0)`;
        }
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
