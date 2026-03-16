document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // ABRIR / FECHAR MENU
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // CLICAR NO LINK FECHA O MENU E NAVEGA
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');

      // Fecha o menu
      navMenu.classList.remove('active');

      // Scroll suave
      if (target.startsWith('#')) {
        e.preventDefault();
        document.querySelector(target)?.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Aplicar animação aos cards
  document.querySelectorAll('.servico-card, .diferencial-card, .galeria-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // CONTADOR ANIMADO
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Animar números quando a seção hero fica visível
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.textContent);
            if (!isNaN(target)) {
              animateCounter(stat, target);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }

  // FECHAR MENU AO CLICAR FORA
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
      navMenu.classList.remove('active');
    }
  });

  // SMOOTH SCROLL PARA LINKS COM HASH
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // LAZY LOADING DE IMAGENS
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ADICIONAR CLASSE ACTIVE AO HEADER QUANDO SCROLL
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    } else {
      header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
  });

});
