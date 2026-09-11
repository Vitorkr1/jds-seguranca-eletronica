document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ======================================================
     PRELOADER
     ====================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderLogo = document.getElementById('preloaderLogo');
  const preloaderRing = document.querySelector('.preloader-ring');
  const preloaderBar = document.querySelector('.preloader-bar');

  function runPreloaderAnimation() {
    if (hasGsap) {
      const tl = gsap.timeline();
      tl.to(preloaderLogo, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' })
        .to(preloaderRing, { opacity: 1, duration: 0.4 }, '-=0.5')
        .to(preloaderBar, { opacity: 1, duration: 0.4 }, '-=0.3')
        .to({}, { duration: 0.7 })
        .to(preloader, {
          opacity: 0, duration: 0.55, ease: 'power2.inOut',
          onComplete: () => { preloader.classList.add('done'); preloader.style.display = 'none'; startPageEntrance(); }
        });
    } else {
      preloaderLogo.style.opacity = 1;
      preloaderLogo.style.transform = 'scale(1)';
      preloaderRing.style.opacity = 1;
      preloaderBar.style.opacity = 1;
      setTimeout(() => {
        preloader.style.transition = 'opacity .5s ease';
        preloader.style.opacity = 0;
        setTimeout(() => { preloader.classList.add('done'); preloader.style.display = 'none'; startPageEntrance(); }, 500);
      }, 900);
    }
  }

  if (prefersReducedMotion) {
    preloader.style.display = 'none';
    startPageEntrance();
  } else {
    runPreloaderAnimation();
    // rede de segurança: nunca deixar o preloader travado na tela
    setTimeout(() => {
      if (!preloader.classList.contains('done')) {
        preloader.classList.add('done');
        preloader.style.display = 'none';
        startPageEntrance();
      }
    }, 3500);
  }

  /* ======================================================
     ENTRADA DA PÁGINA (título do hero em linhas)
     ====================================================== */
  function startPageEntrance() {
    if (hasGsap) {
      gsap.set('.hero-title .line span', { yPercent: 110 });
      gsap.to('.hero-title .line span', {
        yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1
      });
      gsap.from('.hero-hud-row, .hero-sub, .hero-actions', {
        opacity: 0, y: 16, duration: 0.7, stagger: 0.1, delay: 0.35, ease: 'power2.out'
      });
    }
  }

  /* ======================================================
     NAVBAR — scroll state + menu mobile
     ====================================================== */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollUI() {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 40);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
  }
  updateScrollUI();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateScrollUI(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  function openMobileMenu() {
    mobileMenu.classList.add('is-active');
    mobileMenuBackdrop.classList.add('is-active');
    navBurger.classList.add('is-active');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-active');
    mobileMenuBackdrop.classList.remove('is-active');
    navBurger.classList.remove('is-active');
    document.documentElement.style.overflow = '';
  }

  navBurger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-active');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-active')) closeMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#') && document.querySelector(href)) {
        e.preventDefault();
        closeMobileMenu();
        setTimeout(() => {
          document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 450);
      } else {
        closeMobileMenu();
      }
    });
  });

  /* scroll suave para links internos fora do menu mobile */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.closest('#mobileMenu')) return;
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ======================================================
     REVEAL AO ROLAR (GSAP ScrollTrigger com fallback manual)
     ====================================================== */
  const revealEls = Array.from(document.querySelectorAll('.reveal-el'));

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    revealEls.forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  } else {
    // fallback robusto: checagem manual de posição + rede de segurança por tempo
    let pending = revealEls.slice();
    function checkReveal() {
      if (!pending.length) return;
      const line = window.innerHeight * 0.94;
      pending = pending.filter(el => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add('is-visible');
          return false;
        }
        return true;
      });
    }
    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal);
    setTimeout(() => { pending.forEach(el => el.classList.add('is-visible')); pending = []; }, 4000);
  }

  /* ======================================================
     CONTADORES CONCEITUAIS (24/7, 360°, 100%)
     ====================================================== */
  document.querySelectorAll('[data-count-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count-target'), 10);
    const suffix = el.getAttribute('data-count-suffix') || '';
    const unitEl = el.querySelector('.unit');

    function animateCount() {
      const duration = 1400;
      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);
        el.childNodes[0].nodeValue = current;
        if (progress < 1) requestAnimationFrame(step);
        else el.childNodes[0].nodeValue = target;
      }
      requestAnimationFrame(step);
    }

    if (prefersReducedMotion) {
      el.childNodes[0].nodeValue = target;
      return;
    }

    if (hasGsap && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: animateCount });
    } else {
      let done = false;
      function check() {
        if (done) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          done = true;
          animateCount();
        }
      }
      check();
      window.addEventListener('scroll', check, { passive: true });
      setTimeout(() => { if (!done) { done = true; animateCount(); } }, 4000);
    }
  });

  /* ======================================================
     SERVIÇOS — lista interativa (accordion)
     ====================================================== */
  document.querySelectorAll('[data-service]').forEach(row => {
    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');
      document.querySelectorAll('[data-service].is-open').forEach(other => {
        if (other !== row) other.classList.remove('is-open');
      });
      row.classList.toggle('is-open', !isOpen);
    });
  });

  /* ======================================================
     TOTEM — hotspots interativos
     ====================================================== */
  const hotspots = document.querySelectorAll('[data-totem]');
  const totemFeatures = document.querySelectorAll('[data-totem-feature]');

  function activateTotem(id) {
    totemFeatures.forEach(f => f.classList.toggle('is-active', f.getAttribute('data-totem-feature') === id));
  }

  hotspots.forEach(h => {
    h.addEventListener('mouseenter', () => activateTotem(h.getAttribute('data-totem')));
    h.addEventListener('click', () => activateTotem(h.getAttribute('data-totem')));
  });

  totemFeatures.forEach(f => {
    f.addEventListener('mouseenter', () => activateTotem(f.getAttribute('data-totem-feature')));
  });

  /* ======================================================
     SIMULADOR INTERATIVO
     ====================================================== */
  const WHATSAPP_NUMBER = '5581993862672';
  const simSteps = document.querySelectorAll('.sim-step');
  const simPips = document.querySelectorAll('.step-pip');
  const simBack = document.getElementById('simBack');
  const simNext = document.getElementById('simNext');
  const envOptions = document.querySelectorAll('#simEnvOptions .sim-option');
  const svcOptions = document.querySelectorAll('#simServiceOptions .sim-check-row');
  const summaryChips = document.getElementById('simSummaryChips');
  const simWhatsappBtn = document.getElementById('simWhatsappBtn');

  let simState = { env: null, services: new Set(), step: 1 };

  function goToStep(n) {
    simState.step = n;
    simSteps.forEach(s => s.classList.toggle('is-active', parseInt(s.getAttribute('data-step'), 10) === n));
    simPips.forEach(p => p.classList.toggle('is-filled', parseInt(p.getAttribute('data-pip'), 10) <= n));
    simBack.classList.toggle('is-visible', n > 1);
    simNext.classList.toggle('is-visible', n === 2);
    if (n === 3) renderSimSummary();
  }

  envOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      envOptions.forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      simState.env = opt.getAttribute('data-env');
      setTimeout(() => goToStep(2), 280);
    });
  });

  svcOptions.forEach(row => {
    row.addEventListener('click', () => {
      const svc = row.getAttribute('data-svc');
      const isSel = row.classList.toggle('is-selected');
      if (isSel) simState.services.add(svc);
      else simState.services.delete(svc);
    });
  });

  simBack.addEventListener('click', () => {
    if (simState.step > 1) goToStep(simState.step - 1);
  });

  simNext.addEventListener('click', () => goToStep(3));

  function renderSimSummary() {
    summaryChips.innerHTML = '';
    if (simState.env) {
      const chip = document.createElement('span');
      chip.textContent = simState.env;
      summaryChips.appendChild(chip);
    }
    simState.services.forEach(svc => {
      const chip = document.createElement('span');
      chip.textContent = svc;
      summaryChips.appendChild(chip);
    });

    const servicesText = simState.services.size ? Array.from(simState.services).join(', ') : 'a definir';
    const envText = simState.env || 'meu espaço';
    const message = `Olá, JDS! Fiz uma simulação no site: ambiente "${envText}", interesse em ${servicesText}. Gostaria de falar com um especialista.`;
    simWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  /* ======================================================
     RIPPLE NOS BOTÕES
     ====================================================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

});
