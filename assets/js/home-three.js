(function () {
  'use strict';

  function initScrambleText() {
    const el = document.getElementById('roleScramble');
    if (!el) return;

    const roles   = ['IT Student', 'Developer', 'Designer', 'Creator'];
    const chars   = '@#$%&*<>[]{}|/\\~^';
    let current   = 0;

    function scrambleTo(target) {
      return new Promise(resolve => {
        const len   = target.length;
        const steps = 18;
        let frame   = 0;

        function tick() {
          frame++;
          const resolved = Math.floor((frame / steps) * len);
          let display = '';
          for (let i = 0; i < len; i++) {
            display += i < resolved
              ? target[i]
              : chars[Math.floor(Math.random() * chars.length)];
          }
          el.textContent = display;
          if (frame < steps) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
            resolve();
          }
        }

        requestAnimationFrame(tick);
      });
    }

    function pause(ms) {
      return new Promise(r => setTimeout(r, ms));
    }

    async function cycle() {
      while (true) {
        await scrambleTo(roles[current]);
        await pause(3200);
        current = (current + 1) % roles.length;
        el.textContent = '';
        await pause(180);
      }
    }

    cycle();
  }

  function initGlitchEffect() {
    const wrap    = document.getElementById('glitchWrap');
    const mainImg = document.getElementById('glitchMain');
    const rLayer  = document.getElementById('glitchR');
    const gLayer  = document.getElementById('glitchG');
    if (!wrap || !mainImg) return;

    function syncLayers() {
      const src = mainImg.src;
      if (rLayer) rLayer.style.backgroundImage = `url('${src}')`;
      if (gLayer) gLayer.style.backgroundImage = `url('${src}')`;
    }

    mainImg.addEventListener('load', syncLayers);
    if (mainImg.complete) syncLayers();

    let glitchTimer;

    function triggerGlitch() {
      if (wrap.classList.contains('glitch-active')) return;
      wrap.classList.add('glitch-active');
      clearTimeout(glitchTimer);
      glitchTimer = setTimeout(() => {
        wrap.classList.remove('glitch-active');
      }, 450);
    }

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
      let hoverInterval;
      wrap.addEventListener('mouseenter', () => {
        triggerGlitch();
        hoverInterval = setInterval(triggerGlitch, 900);
      });
      wrap.addEventListener('mouseleave', () => {
        clearInterval(hoverInterval);
        wrap.classList.remove('glitch-active');
      });
    }

    wrap.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerGlitch();
    }, { passive: false });

    function randomGlitch() {
      triggerGlitch();
      setTimeout(randomGlitch, 6000 + Math.random() * 6000);
    }
    setTimeout(randomGlitch, 4000);
  }

  function initParallax() {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const textCol  = document.getElementById('homeParallaxText');
    const imageCol = document.getElementById('homeParallaxImage');
    const home     = document.getElementById('home');
    if (!textCol || !imageCol || !home) return;

    const MAX_TILT = 9;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    home.addEventListener('mousemove', (e) => {
      const rect  = home.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2 * MAX_TILT;
      targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2 * MAX_TILT;
    });

    home.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateTilt() {
      currentX = lerp(currentX, targetX, 0.06);
      currentY = lerp(currentY, targetY, 0.06);

      textCol.style.transform = `translate(${-currentX * 0.6}px, ${-currentY * 0.4}px)`;
      imageCol.style.transform = `translate(${currentX * 1.2}px, ${currentY * 0.8}px) rotateX(${-currentY * 0.5}deg) rotateY(${currentX * 0.5}deg)`;

      requestAnimationFrame(updateTilt);
    }

    updateTilt();
  }

  function init() {
    initScrambleText();
    initGlitchEffect();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();