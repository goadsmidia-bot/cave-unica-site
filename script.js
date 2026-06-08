/* ══════════════════════════════════════════════
   CAVE ÚNICA — script.js
   Vanilla JS — sem dependências externas
══════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── ANO NO FOOTER ─────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── NAV: SCROLL SOLIDIFY ──────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── NAV: ACTIVE LINK ──────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && navLinks.length) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${target.id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(s => secObs.observe(s));
  }

  /* ── MENU MOBILE ────────────────────────── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    mobileMenu.hidden = false;
    requestAnimationFrame(() => {
      mobileMenu.removeAttribute('hidden');
    });
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileMenu.focus();
  };

  const closeMenu = () => {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { mobileMenu.hidden = true; }, 350);
  };

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    document.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') closeMenu();
    });
  }

  /* ── WHATSAPP FLUTUANTE ─────────────────── */
  const waFloat = document.getElementById('waFloat');
  if (waFloat) {
    window.addEventListener('scroll', () => {
      waFloat.classList.toggle('show', window.scrollY > 350);
    }, { passive: true });
  }

  /* ── REVEAL ON SCROLL (Intersection Observer) ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('in-view');

        /* Aciona animação da linha dourada */
        const rule = target.querySelector('.gold-rule') || (target.classList.contains('gold-rule') ? target : null);
        if (rule) rule.classList.add('animate');

        revealObs.unobserve(target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* Gold rules individuais */
  document.querySelectorAll('.gold-rule').forEach(el => revealObs.observe(el));

  /* ── STAGGER GRIDS ──────────────────────── */
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('in-view');
        staggerObs.unobserve(target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stagger-grid').forEach(el => staggerObs.observe(el));

  /* ── SMOOTH SCROLL (ancora interna) ────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── HERO VIDEO ─────────────────────────── */
  const heroVideo = document.querySelector('.hero-video');
  const heroBg    = document.querySelector('.hero-bg');
  const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVideo) {
    if (reduced) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    } else {
      /* Se o vídeo carregar com sucesso, esconde o fallback de imagem */
      heroVideo.addEventListener('playing', () => {
        if (heroBg) heroBg.style.opacity = '0';
      }, { once: true });

      /* Se TODOS os sources falharem, exibe o fallback com Ken Burns */
      heroVideo.addEventListener('error', () => {
        if (heroBg) {
          heroBg.style.opacity = '1';
          heroBg.style.transition = 'opacity 0.6s ease';
        }
      });
    }
  }

  /* ── PARALLAX HERO (só com imagem, sem vídeo) ── */
  if (heroBg && !heroVideo && !reduced) {
    const onParallax = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.04) translateY(${scrollY * 0.18}px)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

})();
