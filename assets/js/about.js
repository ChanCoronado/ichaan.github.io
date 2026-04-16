let aboutSectionInitialized = false;

function initAboutSection() {
    if (aboutSectionInitialized) return;
    aboutSectionInitialized = true;

    initAboutImageTouch();
    initHobbyLightbox();
    initAchievementLightbox();
    initAchievementsFilter();
    initAboutInViewAnimations();
    initFlipCards();
    initCounters();
    initScrollIndicator();
    initAboutScrollTop();
}

function initAboutImageTouch() {
    const wrapper = document.querySelector('.about-img-wrapper');
    if (!wrapper) return;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) {
        wrapper.addEventListener('click', function () {
            this.classList.toggle('touch-active');
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.about-img-wrapper')) {
                wrapper.classList.remove('touch-active');
            }
        });
    }
}

function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;
        const sectionInner = aboutSection.querySelector('.section-inner');
        if (!sectionInner) return;
        const target = document.querySelector('.timeline-section');
        if (target) {
            const offsetTop = target.offsetTop - 90;
            sectionInner.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
}

function createLightboxOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <button class="lightbox-nav-btn lightbox-prev" aria-label="Previous image">
            <i class='bx bx-chevron-left'></i>
        </button>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close gallery">
                <i class='bx bx-x'></i>
            </button>
            <img class="lightbox-img" id="lb-img" src="" alt="" />
            <div class="lightbox-dots" id="lb-dots"></div>
            <div class="lightbox-counter" id="lb-counter"></div>
            <div class="lightbox-thumbs" id="lb-thumbs"></div>
            <div class="lightbox-caption">
                <h4 id="lb-title"></h4>
                <p id="lb-desc"></p>
            </div>
        </div>
        <button class="lightbox-nav-btn lightbox-next" aria-label="Next image">
            <i class='bx bx-chevron-right'></i>
        </button>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function createAchievementLightboxOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay achievement-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <button class="lightbox-nav-btn lightbox-prev" aria-label="Previous image">
            <i class='bx bx-chevron-left'></i>
        </button>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close gallery">
                <i class='bx bx-x'></i>
            </button>
            <div class="achievement-lightbox-header">
                <div class="achievement-lightbox-icon">
                    <i id="lb-icon" class="bx bxs-trophy"></i>
                </div>
                <div class="achievement-lightbox-meta">
                    <div class="achievement-lightbox-title" id="lb-title"></div>
                    <div class="achievement-lightbox-date" id="lb-date"></div>
                </div>
            </div>
            <p class="achievement-lightbox-desc" id="lb-desc"></p>
            <img class="lightbox-img" id="lb-img" src="" alt="" />
            <div class="lightbox-dots" id="lb-dots"></div>
            <div class="lightbox-counter" id="lb-counter"></div>
            <div class="lightbox-thumbs" id="lb-thumbs"></div>
        </div>
        <button class="lightbox-nav-btn lightbox-next" aria-label="Next image">
            <i class='bx bx-chevron-right'></i>
        </button>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function initLightboxCore(overlay) {
    const lbImg = overlay.querySelector('#lb-img');
    const lbTitle = overlay.querySelector('#lb-title');
    const lbDesc = overlay.querySelector('#lb-desc');
    const lbDots = overlay.querySelector('#lb-dots');
    const lbCounter = overlay.querySelector('#lb-counter');
    const lbThumbs = overlay.querySelector('#lb-thumbs');
    const btnClose = overlay.querySelector('.lightbox-close');
    const btnPrev = overlay.querySelector('.lightbox-prev');
    const btnNext = overlay.querySelector('.lightbox-next');

    let images = [];
    let current = 0;

    function showImage(index) {
        current = (index + images.length) % images.length;

        const src = images[current];
        if (src) {
            lbImg.src = src;
            lbImg.alt = (lbTitle ? lbTitle.textContent : '') + ' — photo ' + (current + 1);
            lbImg.style.display = 'block';
        } else {
            lbImg.style.display = 'none';
        }

        lbDots.querySelectorAll('.lightbox-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        lbCounter.textContent = images.length > 1 ? (current + 1) + ' / ' + images.length : '';

        lbThumbs.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === current);
        });

        const showNav = images.length > 1;
        btnPrev.style.display = showNav ? '' : 'none';
        btnNext.style.display = showNav ? '' : 'none';
    }

    function buildStrip() {
        lbDots.innerHTML = '';
        lbThumbs.innerHTML = '';

        images.forEach((src, i) => {
            const dot = document.createElement('button');
            dot.className = 'lightbox-dot';
            dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
            dot.addEventListener('click', () => showImage(i));
            lbDots.appendChild(dot);

            const thumb = document.createElement('div');
            thumb.className = 'lightbox-thumb';
            if (src) {
                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Thumbnail ' + (i + 1);
                thumb.appendChild(img);
            } else {
                thumb.innerHTML = `<div class="lightbox-thumb-placeholder"><i class='bx bxs-image'></i></div>`;
            }
            thumb.addEventListener('click', () => showImage(i));
            lbThumbs.appendChild(thumb);
        });
    }

    function open(imgs, meta) {
        images = imgs.length ? imgs : [''];

        if (lbTitle) lbTitle.textContent = meta.title || '';
        if (lbDesc) lbDesc.textContent = meta.desc || '';

        buildStrip();
        showImage(0);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        btnClose.focus();
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });
    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(current - 1);
    });
    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(current + 1);
    });

    overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.classList.contains('lightbox-content')) {
            close();
        }
    });

    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') showImage(current - 1);
        if (e.key === 'ArrowRight') showImage(current + 1);
    });

    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) showImage(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    return { open, close };
}

function initHobbyLightbox() {
    const cards = document.querySelectorAll('.hobby-gallery-item');
    if (!cards.length) return;

    const overlay = createLightboxOverlay();
    const { open } = initLightboxCore(overlay);

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const rawImgs = (card.dataset.imgs || card.dataset.src || '').trim();
            const imgs = rawImgs ? rawImgs.split(',').map(s => s.trim()).filter(Boolean) : [];
            open(imgs, {
                title: card.dataset.title || '',
                desc: card.dataset.desc || ''
            });
        });
    });
}

function initAchievementLightbox() {
    const cards = document.querySelectorAll('.ach-frame-wrap');
    if (!cards.length) return;

    const overlay = createAchievementLightboxOverlay();
    const lbIcon = overlay.querySelector('#lb-icon');
    const lbDate = overlay.querySelector('#lb-date');
    const { open } = initLightboxCore(overlay);

    cards.forEach(card => {
        const rawImgs = (card.dataset.imgs || '').trim();
        const imgList = rawImgs ? rawImgs.split(',').map(s => s.trim()).filter(Boolean) : [];

        card.addEventListener('click', () => {
            if (lbIcon) lbIcon.className = card.dataset.icon || 'bx bxs-trophy';
            if (lbDate) lbDate.textContent = card.dataset.date || '';
            open(imgList, {
                title: card.dataset.title || '',
                desc: card.dataset.desc || ''
            });
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX 1: Achievements filter
//
// Problems in original:
//   a) animationend sometimes never fires (if element is already hidden /
//      display:none), so cards get stuck and never receive .hidden.
//   b) After un-hiding a card, .filtering-in plays but the card still has
//      opacity:0 + transform from the base .ach-frame-wrap rule, AND it
//      may have lost .in-view — so it appears blank after the animation.
//   c) Rapid filter clicks cause overlapping animation states (race condition).
//
// Fix strategy:
//   • Use a short setTimeout fallback instead of relying solely on animationend.
//   • After showing a card, ensure .in-view is present and inline opacity/
//     transform are cleared so the CSS tilt + visible state applies correctly.
//   • Cancel any pending timers on each new filter click to avoid race conditions.
// ─────────────────────────────────────────────────────────────────────────────
function initAchievementsFilter() {
    const filterBtns = document.querySelectorAll('.ach-filter-btn');
    const wall = document.getElementById('achievementsWall');
    if (!filterBtns.length || !wall) return;

    // Keep track of pending timers so we can cancel on rapid clicks
    let pendingTimers = [];

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cancel any in-flight timers from previous filter clicks
            pendingTimers.forEach(id => clearTimeout(id));
            pendingTimers = [];

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const cards = wall.querySelectorAll('.ach-frame-wrap');

            cards.forEach((card, idx) => {
                const match = filter === 'all' || card.dataset.category === filter;

                // Clean up any leftover animation classes from previous runs
                card.classList.remove('filtering-in', 'filtering-out');

                if (!match) {
                    // ── HIDE ──
                    // Only animate out if currently visible
                    if (!card.classList.contains('hidden')) {
                        card.classList.add('filtering-out');

                        const ANIM_DURATION = 260; // slightly longer than CSS 0.25s
                        const timerId = setTimeout(() => {
                            card.classList.remove('filtering-out');
                            card.classList.add('hidden');
                            // Reset inline styles so next show starts clean
                            card.style.opacity = '';
                            card.style.transform = '';
                        }, ANIM_DURATION);
                        pendingTimers.push(timerId);
                    }
                } else {
                    // ── SHOW ──
                    card.classList.remove('hidden');

                    // Make sure .in-view is set so the card has correct base styles
                    // (without it, opacity stays 0 from the base .ach-frame-wrap rule)
                    card.classList.add('in-view');

                    // Stagger each visible card slightly so they don't all pop at once
                    const stagger = idx * 40;
                    const timerId = setTimeout(() => {
                        card.classList.add('filtering-in');

                        const onDone = () => {
                            card.classList.remove('filtering-in');
                            // Ensure final state is correct (tilt + fully visible)
                            card.style.opacity = '';
                            card.style.transform = '';
                        };

                        // Primary: animationend
                        card.addEventListener('animationend', onDone, { once: true });

                        // Fallback: if animationend never fires (e.g. display issues)
                        const fallbackId = setTimeout(() => {
                            card.removeEventListener('animationend', onDone);
                            onDone();
                        }, 500);
                        pendingTimers.push(fallbackId);
                    }, stagger);
                    pendingTimers.push(timerId);
                }
            });
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX 2: IntersectionObserver for about section animations
//
// Problem: skill-logo-card level bars used `data-level` attribute in HTML but
// the CSS transition rule uses `var(--level)`. The JS set `fill.style.width`
// directly which works, but `--level` CSS variable was never updated, so on
// re-observation the CSS override would win with an undefined variable (0%).
//
// Fix: Set BOTH the inline width AND the --level CSS variable to be safe,
// and also handle the case where data-level is missing but --level is already
// defined inline via the style attribute.
// ─────────────────────────────────────────────────────────────────────────────
function initAboutInViewAnimations() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const sectionInner = aboutSection.querySelector('.section-inner');
    if (!sectionInner) return;

    const observerOptions = {
        root: sectionInner,
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

                setTimeout(() => {
                    el.classList.add('in-view');

                    if (el.classList.contains('skill-logo-card')) {
                        const fill = el.querySelector('.skill-logo-level-fill');
                        if (fill) {
                            // Support both data-level attribute AND inline --level CSS var
                            const dataLevel = fill.getAttribute('data-level');
                            if (dataLevel) {
                                const pct = dataLevel + '%';
                                // Set CSS variable used by the stylesheet rule
                                fill.style.setProperty('--level', pct);
                                // Also set width directly as a reliable fallback
                                fill.style.width = pct;
                            } else {
                                // Fallback: trigger width from existing --level var
                                const existingLevel = fill.style.getPropertyValue('--level');
                                if (existingLevel) {
                                    fill.style.width = existingLevel;
                                }
                            }
                        }
                    }
                }, delay);

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    const targets = aboutSection.querySelectorAll(
        '.timeline-item, .skill-logo-card, .tool-tag, .hobby-gallery-item, ' +
        '.goal-roadmap-item, .ach-frame-wrap, .funfact-flip-card, .counter-item'
    );

    targets.forEach(el => observer.observe(el));
}

function initFlipCards() {
    const flipCards = document.querySelectorAll('.funfact-flip-card');
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (isTouchDevice) {
        flipCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
}

function initCounters() {
    const counterNumbers = document.querySelectorAll('.counter-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const sectionInner = aboutSection.querySelector('.section-inner');
    if (!sectionInner) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { root: sectionInner, threshold: 0.5 });

    counterNumbers.forEach(el => counterObserver.observe(el));
}

function initAboutScrollTop() {
    const btn = document.getElementById('aboutScrollTop');
    const aboutSection = document.getElementById('about');
    if (!btn || !aboutSection) return;

    const sectionInner = aboutSection.querySelector('.section-inner');
    if (!sectionInner) return;

    const THRESHOLD = 250;
    let ticking = false;

    function updateVisibility() {
        if (sectionInner.scrollTop > THRESHOLD) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
        ticking = false;
    }

    sectionInner.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateVisibility);
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        sectionInner.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// BUG FIX 3: Filter button click detection on mobile
//
// Problem: `.ach-frame-wrap` cards have a z-index stacking context and the
// `.ach-pin` / `.ach-ribbon` pseudo-elements can sit on top of the filter
// buttons if the achievements wall overflows or the layout shifts.
// The filter bar also had no `position: relative` / `z-index`, so on some
// viewports the card hover shadow would render over the buttons, blocking clicks.
//
// Fix: Ensure the filter bar sits above achievement cards by injecting a
// runtime style that guarantees correct stacking. This avoids touching the
// existing CSS file.
// ─────────────────────────────────────────────────────────────────────────────
function fixFilterBarStacking() {
    const style = document.createElement('style');
    style.textContent = `
        .achievements-filter-bar {
            position: relative;
            z-index: 10;
        }
        .ach-frame-wrap:hover {
            z-index: 5 !important;
        }
    `;
    document.head.appendChild(style);
}

const aboutNavLink = document.querySelector('.nav-link[data-section="about"]');
if (aboutNavLink) {
    aboutNavLink.addEventListener('click', () => {
        setTimeout(() => {
            initAboutSection();
        }, 900);
    });
}

const mobileAboutLink = document.querySelector('.mobile-nav-link[data-section="about"]');
if (mobileAboutLink) {
    mobileAboutLink.addEventListener('click', () => {
        setTimeout(() => {
            initAboutSection();
        }, 1300);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    // Fix filter bar stacking immediately on load
    fixFilterBarStacking();

    const hash = window.location.hash.substring(1) || 'home';
    if (hash === 'about') {
        setTimeout(initAboutSection, 600);
    }
});

function initSkillsCollapse() {
    const grids = document.querySelectorAll('.skills-logo-grid');

    grids.forEach(grid => {
        const cards = grid.querySelectorAll('.skill-logo-card');
        if (cards.length <= 6) return;

        const btn = document.createElement('button');
        btn.className = 'skills-show-more-btn';
        btn.innerHTML = `<i class='bx bx-chevron-down'></i><span>Show More (${cards.length - 6} more)</span>`;

        btn.addEventListener('click', () => {
            const isExpanded = grid.classList.toggle('expanded');
            btn.classList.toggle('expanded', isExpanded);
            btn.innerHTML = isExpanded
                ? `<i class='bx bx-chevron-down'></i><span>Show Less</span>`
                : `<i class='bx bx-chevron-down'></i><span>Show More (${cards.length - 6} more)</span>`;
        });

        grid.insertAdjacentElement('afterend', btn);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSkillsCollapse();
});