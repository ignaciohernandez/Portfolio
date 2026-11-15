console.log('Portfolio script loaded');

function init() {
  // Typing effect
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'Desarrollador Frontend',
      'Analista de Operaciones TI',
      'Estudiante de Tecnicatura en Software',
      'Entusiasta Cloud & DevOps'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }

    type();
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeToggle, savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(themeToggle, next);
      console.log('Theme changed to', next);
    });
  }

  function updateThemeIcon(btn, theme) {
    if (theme === 'dark') {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
  }

  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // Metrics counter animation
  const metricNumbers = document.querySelectorAll('.metric-number');
  if (metricNumbers.length) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 30);
          metricsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    metricNumbers.forEach(el => metricsObserver.observe(el));
  }

  // Project filters with event delegation
  const projectFilters = document.querySelector('.project-filters');
  const projectCards = document.querySelectorAll('.project-card');
  if (projectFilters) {
    projectFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      projectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      console.log('Filter changed to', filter);
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const lastname = document.getElementById('lastname').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();

      if (!name || !lastname || !email || !phone) {
        formStatus.textContent = 'Por favor completá todos los campos obligatorios.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = '¡Mensaje enviado! Te responderé pronto.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.section, .project-card, .edu-card, .skill-category, .timeline-item, .metric-card');
  reveals.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
    }
    if (window.caches) {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}