// ============================================
// BERBER TASLAK — JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- Hamburger menu ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    });
  });

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Lightbox ----
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');

  document.querySelectorAll('.gallery-item[data-src], .full-gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      if (lightboxImg && src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- Appointment form ----
  const appointmentForm = document.querySelector('#appointment-form');
  appointmentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.querySelector('.form-success');
    if (success) {
      success.style.display = 'block';
      appointmentForm.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Fade-in on scroll ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });

  // ============================================
  // TAAL WISSELEN — NL / EN
  // ============================================

  const LANG_KEY = 'barber_lang';

  function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.nl) {
        // Save original NL text on first switch
        el.dataset.nl = el.textContent.trim();
      }
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.nl;
    });

    // Update lang button active states (all .lang-btn on page)
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  // Bind lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Init with saved preference
  const savedLang = localStorage.getItem(LANG_KEY) || 'nl';
  if (savedLang === 'en') setLanguage('en');
  else {
    // Just mark NL button active
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === 'nl');
    });
  }

});
