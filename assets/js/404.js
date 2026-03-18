const body = document.body;

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.remove('bx-sun');
    themeIcon.classList.add('bx-moon');
}

themeToggle.addEventListener('click', () => {
    themeToggle.classList.add('rotating');
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
        localStorage.setItem('theme', 'light');
        updateCanvasColors('light');
        clearAndRedrawCanvas();
    } else {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
        localStorage.setItem('theme', 'dark');
        updateCanvasColors('dark');
        clearAndRedrawCanvas();
    }

    setTimeout(() => themeToggle.classList.remove('rotating'), 600);

    setTimeout(() => {
        spawnCodeBurst(mouseX, mouseY);
    }, 200);
    setTimeout(() => {
        spawnCodeBurst(mouseX, mouseY);
    }, 380);
});

const gridCanvas = document.getElementById('gridCanvas');
const gridCtx = gridCanvas.getContext('2d');
let gridWidth, gridHeight;

function resizeGrid() {
    gridWidth = gridCanvas.width = window.innerWidth;
    gridHeight = gridCanvas.height = window.innerHeight;
}
resizeGrid();
window.addEventListener('resize', resizeGrid);

const GRID_SIZE = 50;
let gridOffset = { x: 0, y: 0 };
let gridAnimFrame;
let gridColor = 'rgba(0, 255, 159, 0.08)';

function updateCanvasColors(theme) {
    if (theme === 'light') {
        gridColor = 'rgba(184, 134, 11, 0.15)';
        fallingTextColor = 'rgba(184, 134, 11, 0.25)';
    } else {
        gridColor = 'rgba(0, 255, 159, 0.08)';
        fallingTextColor = 'rgba(0, 255, 159, 0.15)';
    }
}

function clearAndRedrawCanvas() {
    gridCtx.clearRect(0, 0, gridWidth, gridHeight);
    fallingCtx.clearRect(0, 0, fallingWidth, fallingHeight);
    gridOffset = { x: 0, y: 0 };
    drawGrid();
    drawFallingText();
}

function drawGrid() {
    gridCtx.clearRect(0, 0, gridWidth, gridHeight);
    gridCtx.strokeStyle = gridColor;
    gridCtx.lineWidth = 1;

    for (let x = -GRID_SIZE + (gridOffset.x % GRID_SIZE); x < gridWidth; x += GRID_SIZE) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridHeight);
        gridCtx.stroke();
    }

    for (let y = -GRID_SIZE + (gridOffset.y % GRID_SIZE); y < gridHeight; y += GRID_SIZE) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridWidth, y);
        gridCtx.stroke();
    }

    const speed = body.classList.contains('light-mode') ? 0.1 : 0.15;
    gridOffset.x += speed;
    gridOffset.y += speed;

    gridAnimFrame = requestAnimationFrame(drawGrid);
}
drawGrid();

const fallingCanvas = document.getElementById('fallingTextCanvas');
const fallingCtx = fallingCanvas.getContext('2d');
let fallingWidth, fallingHeight;

function resizeFalling() {
    fallingWidth = fallingCanvas.width = window.innerWidth;
    fallingHeight = fallingCanvas.height = window.innerHeight;
}
resizeFalling();
window.addEventListener('resize', resizeFalling);

const textPool = [
    'CHRISTIAN', 'CORONADO', 'CHAN', 'IT', 'STUDENT', 'WEB', 'DEV',
    'HTML', 'CSS', 'JS', 'REACT', 'NODE', 'CODE', 'PYTHON', 'JAVA',
    'SQL', 'API', 'UI', 'UX', 'DESIGN', 'BUILD', 'CREATE',
    '010', '101', '001', '110', '011', '100', '111', '000',
    '{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '+', '-', '=',
    'function', 'const', 'let', 'var', 'return', 'class', 'async', 'await',
    '0x', '0b', '&&', '||', '=>', '!=', '==', '===', '/*', '*/', '//',
    'portfolio', 'developer', 'frontend', 'backend', 'fullstack',
    '404', 'null', 'void', 'undefined', 'NaN', 'err'
];

const fallingCols = Math.floor(window.innerWidth / 20);
const drops = [];
let fallingTextColor = 'rgba(0, 255, 159, 0.15)';

for (let i = 0; i < fallingCols; i++) {
    drops[i] = {
        y: Math.random() * -800,
        speed: Math.random() * 1.5 + 0.5,
        text: textPool[Math.floor(Math.random() * textPool.length)],
        opacity: Math.random() * 0.05 + 0.02
    };
}

let fallingAnimFrame;

function drawFallingText() {
    const isLight = body.classList.contains('light-mode');
    fallingCtx.fillStyle = isLight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
    fallingCtx.fillRect(0, 0, fallingWidth, fallingHeight);
    fallingCtx.font = '12px monospace';

    drops.forEach((drop, i) => {
        const x = i * 20;
        const baseOpacity = isLight ? 0.06 : 0.04;
        fallingCtx.fillStyle = isLight
            ? `rgba(184, 134, 11, ${drop.opacity})`
            : `rgba(0, 255, 159, ${drop.opacity})`;
        fallingCtx.fillText(drop.text, x, drop.y);

        drop.y += drop.speed * (isLight ? 0.8 : 1);

        if (drop.y > fallingHeight) {
            drop.y = Math.random() * -300;
            drop.text = textPool[Math.floor(Math.random() * textPool.length)];
            drop.speed = Math.random() * 1.5 + 0.5;
            drop.opacity = Math.random() * baseOpacity + baseOpacity / 2;
        }
    });

    fallingAnimFrame = requestAnimationFrame(drawFallingText);
}
drawFallingText();
updateCanvasColors(currentTheme);

(function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const trailCanvas = document.getElementById('cursor-trail-canvas');
    if (!dot || !ring || !trailCanvas) return;

    const ctx = trailCanvas.getContext('2d');

    function resizeTrail() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    resizeTrail();
    window.addEventListener('resize', resizeTrail);

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
    let cursorFrameId;

    function getAccentColor() {
        return body.classList.contains('light-mode')
            ? { r: 184, g: 134, b: 11 }
            : { r: 16, g: 185, b: 129 };
    }

    function randomChar() {
        return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        if (Math.random() < 0.55) spawnCodeChar(mouseX, mouseY);
    });

    document.addEventListener('mouseleave', () => body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => body.classList.remove('cursor-hidden'));

    document.addEventListener('mousedown', () => {
        body.classList.add('cursor-click');
        spawnCodeBurst(mouseX, mouseY);
    });
    document.addEventListener('mouseup', () => body.classList.remove('cursor-click'));

    const HOVER_SEL = 'a, button, [role="button"], .social-link, .icon-btn, .logo, .btn';
    const TEXT_SEL = 'input, textarea, [contenteditable]';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(HOVER_SEL)) body.classList.add('cursor-hover');
        else if (e.target.closest(TEXT_SEL)) body.classList.add('cursor-text');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(HOVER_SEL)) body.classList.remove('cursor-hover');
        else if (e.target.closest(TEXT_SEL)) body.classList.remove('cursor-text');
    });

    function spawnCodeChar(x, y) {
        const c = getAccentColor();
        particles.push({
            x: x + (Math.random() - 0.5) * 14,
            y: y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.4 + 0.5),
            char: randomChar(),
            fontSize: Math.random() * 8 + 9,
            alpha: Math.random() * 0.45 + 0.45,
            decay: Math.random() * 0.016 + 0.012,
            r: c.r, g: c.g, b: c.b,
            type: 'code',
            glowPulse: Math.random() * Math.PI * 2
        });
    }

    function spawnCodeBurst(x, y) {
        const c = getAccentColor();
        for (let i = 0; i < 14; i++) {
            const angle = (i / 14) * Math.PI * 2;
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

    window._cursorBurst = spawnCodeBurst;

    function animateCursor() {
        cursorFrameId = requestAnimationFrame(animateCursor);
        const ease = 0.11;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        particles = particles.filter(p => p.alpha > 0.01);

        particles.forEach(p => {
            p.glowPulse += 0.12;
            const ga = p.alpha * (0.7 + 0.3 * Math.sin(p.glowPulse));

            ctx.save();
            ctx.font = `bold ${p.fontSize}px 'Outfit', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},${ga})`;
            ctx.shadowBlur = p.type === 'burst' ? 14 : 10;
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${ga})`;
            ctx.fillText(p.char, p.x, p.y);
            ctx.shadowBlur = 0;
            ctx.restore();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.035;
            p.vx *= 0.975;
            p.alpha -= p.decay;
            p.fontSize *= 0.988;
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(cursorFrameId);
        else animateCursor();
    });

    animateCursor();
})();

function spawnCodeBurst(x, y) {
    if (window._cursorBurst) window._cursorBurst(x, y);
}

const glitchWrapper = document.getElementById('glitchWrapper');

function triggerGlitch() {
    if (!glitchWrapper || glitchWrapper.classList.contains('glitching')) return;
    glitchWrapper.classList.add('glitching');
    setTimeout(() => glitchWrapper.classList.remove('glitching'), 700);
}

let autoGlitchTimer;
function scheduleAutoGlitch() {
    const delay = 4000 + Math.random() * 7000;
    autoGlitchTimer = setTimeout(() => {
        triggerGlitch();
        scheduleAutoGlitch();
    }, delay);
}
scheduleAutoGlitch();

const btnGlitch = document.getElementById('btnGlitch');
if (btnGlitch) btnGlitch.addEventListener('click', triggerGlitch);

const CMD_TEXT = 'find / -name "this-page" 2>/dev/null';
const OUT_LINES = [
    { text: 'Searching all routes...', cls: '' },
    { text: 'find: this-page: No such file or directory', cls: 't-err' },
    { text: 'HTTP 404 — Route not matched', cls: 't-err' },
    { text: 'Checking fallback handlers...', cls: 't-warn' },
    { text: '[ WARN ] 0 matches found', cls: 't-warn' },
    { text: '[ OK ]   Rendering 404 boundary...', cls: 't-ok' },
];

const tTyped = document.getElementById('tTyped');
const tCaret = document.getElementById('tCaret');
const tOutput = document.getElementById('tOutput');
const terminal = document.getElementById('errTerminal');
const errContent = document.getElementById('errContent');
const konamiHint = document.getElementById('konamiHint');

function typeCommand(text, cb) {
    let i = 0;
    if (tCaret) tCaret.style.display = 'inline';
    const iv = setInterval(() => {
        if (i < text.length) {
            tTyped.textContent += text[i++];
        } else {
            clearInterval(iv);
            if (tCaret) tCaret.style.display = 'none';
            if (cb) cb();
        }
    }, 52);
}

function showOutputLines() {
    OUT_LINES.forEach((line, idx) => {
        const span = document.createElement('span');
        span.className = 't-out-line' + (line.cls ? ' ' + line.cls : '');
        span.textContent = '> ' + line.text;
        tOutput.appendChild(span);
        setTimeout(() => span.classList.add('show'), idx * 290);
    });

    const totalDelay = OUT_LINES.length * 290 + 200;
    setTimeout(() => {
        if (errContent) errContent.classList.add('visible');
        if (konamiHint) konamiHint.classList.add('visible');
    }, totalDelay);
}

function startTerminal() {
    if (terminal) terminal.classList.add('visible');
    setTimeout(() => {
        typeCommand(CMD_TEXT, () => {
            setTimeout(showOutputLines, 350);
        });
    }, 500);
}

document.addEventListener('DOMContentLoaded', startTerminal);

const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIdx = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
            konamiIdx = 0;
            activateKonami();
        }
    } else {
        konamiIdx = (e.key === KONAMI[0]) ? 1 : 0;
    }
});

const konamiOverlay = document.getElementById('konamiOverlay');
const konamiBar = document.getElementById('konamiBar');

function activateKonami() {
    if (!konamiOverlay) return;
    clearTimeout(autoGlitchTimer);
    triggerGlitch();

    konamiOverlay.classList.add('active');
    konamiOverlay.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
        if (konamiBar) konamiBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3200);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(gridAnimFrame);
        cancelAnimationFrame(fallingAnimFrame);
        clearTimeout(autoGlitchTimer);
    } else {
        drawGrid();
        drawFallingText();
        scheduleAutoGlitch();
    }
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
    cancelAnimationFrame(gridAnimFrame);
    cancelAnimationFrame(fallingAnimFrame);
}

window.addEventListener('resize', () => {
    resizeGrid();
    resizeFalling();
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});