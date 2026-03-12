(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';

    const trailCanvas = document.createElement('canvas');
    trailCanvas.id = 'cursor-trail-canvas';

    document.body.appendChild(trailCanvas);
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    const ctx = trailCanvas.getContext('2d');

    function resizeTrailCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    const CODE_CHARS = [
        '0', '1', '{', '}', '[', ']', '<', '>', '/', '*', '+', '-', '=',
        'fn', 'if', '=>', '&&', '||', '!=', '==', '01', '10', '00', '11',
        'js', 'px', 'var', 'let', 'div', '()', '::', '//', '/*', '*/',
        '0x', '++', '--', '%%', '##', '@@'
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let particles = [];
    let frameId;
    let moveTimer = null;
    let isMoving = false;

    function getAccentColor() {
        return document.body.classList.contains('light-mode')
            ? { r: 184, g: 134, b: 11 }
            : { r: 16, g: 185, b: 129 };
    }

    function randomChar() {
        return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }

    function isOverlayActive() {
        return !!document.querySelector('.lightbox-overlay.active, .achievement-modal-overlay.active, .mobile-menu.active');
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';

        isMoving = true;
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => { isMoving = false; }, 80);

        if (!isOverlayActive() && Math.random() < 0.55) spawnCodeChar(mouseX, mouseY);
    });

    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
        spawnCodeBurst(mouseX, mouseY);
    });

    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    const HOVER_SELECTORS = 'a, button, [role="button"], .nav-link, .mobile-nav-link, .icon-btn, .project-link, .social-link, .achievement-card, .hobby-gallery-item, .skill-logo-card, .carousel-btn, .btn, label, .theme-toggle, .logo, .lightbox-close, .lightbox-nav-btn, .lightbox-dot, .lightbox-thumb';
    const TEXT_SELECTORS  = 'input, textarea, [contenteditable]';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(HOVER_SELECTORS)) {
            document.body.classList.add('cursor-hover');
        } else if (e.target.closest(TEXT_SELECTORS)) {
            document.body.classList.add('cursor-text');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(HOVER_SELECTORS)) {
            document.body.classList.remove('cursor-hover');
        } else if (e.target.closest(TEXT_SELECTORS)) {
            document.body.classList.remove('cursor-text');
        }
    });

    function spawnCodeChar(x, y) {
        const c = getAccentColor();
        const char = randomChar();
        const fontSize = Math.random() * 8 + 9;
        const angle = (Math.random() - 0.5) * 0.8;
        const speed = Math.random() * 1.0 + 0.4;

        particles.push({
            x: x + (Math.random() - 0.5) * 14,
            y: y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.4 + 0.5),
            char,
            fontSize,
            alpha: Math.random() * 0.45 + 0.45,
            decay: Math.random() * 0.016 + 0.012,
            r: c.r, g: c.g, b: c.b,
            type: 'code',
            glowPulse: Math.random() * Math.PI * 2
        });
    }

    function spawnCodeBurst(x, y) {
        const c = getAccentColor();
        const count = 14;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = Math.random() * 5 + 2.5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                char: randomChar(),
                fontSize: Math.random() * 7 + 10,
                alpha: 0.95,
                decay: Math.random() * 0.022 + 0.016,
                r: c.r, g: c.g, b: c.b,
                type: 'burst',
                glowPulse: Math.random() * Math.PI * 2
            });
        }
    }

    function animate() {
        frameId = requestAnimationFrame(animate);

        const ease = 0.11;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';

        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        particles = particles.filter(p => p.alpha > 0.01);

        particles.forEach(p => {
            p.glowPulse += 0.12;
            const glowAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.glowPulse));

            ctx.save();
            ctx.font = `bold ${p.fontSize}px 'Outfit', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},${glowAlpha})`;
            ctx.shadowBlur = p.type === 'burst' ? 14 : 10;

            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${glowAlpha})`;
            ctx.fillText(p.char, p.x, p.y);

            ctx.shadowBlur = 0;
            ctx.restore();

            p.x     += p.vx;
            p.y     += p.vy;
            p.vy    += 0.035;
            p.vx    *= 0.975;
            p.alpha -= p.decay;
            p.fontSize *= 0.988;
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frameId);
        } else {
            animate();
        }
    });

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTimeout(() => spawnCodeBurst(mouseX, mouseY), 200);
            setTimeout(() => spawnCodeBurst(mouseX, mouseY), 380);
        });
    }

    animate();
})();