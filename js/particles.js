/* ==========================================================================
   CURSOR CUSTOMIZADO
   ========================================================================== */

(function () {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function loop() {
    dotX += (mx - dotX) * 0.35;
    dotY += (my - dotY) * 0.35;
    ringX += (mx - ringX) * 0.16;
    ringY += (my - ringY) * 0.16;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(loop);
  }
  loop();

  const interactiveSelector = 'a, button, [data-magnetic], .service-row, .totem-feature, .sim-option, .sim-check-row, .project-tile, .hotspot';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('is-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-active');
    }
  });

  /* efeito magnético em elementos [data-magnetic] */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();
