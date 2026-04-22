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
    initFunFactsSwipeStack();

    function initFunFactsSwipeStack() {
    const container = document.querySelector('.funfacts-swipe-stack');
    if (!container) return;

    const CARDS = [
        { icon: 'bx bx-code-block', front: 'Favorite Stack', back: 'HTML · CSS · JavaScript · PHP · Bootstrap · MySQL' },
        { icon: 'bx bx-bulb', front: 'How I Started', back: 'Started with TVL-ICT in SHS, fell in love with coding, then pursued BSIT at PUP Sto. Tomas.' },
        { icon: 'bx bx-heart', front: 'My Philosophy', back: '"Still learning, still building, still improving."' },
        { icon: 'bx bx-walk', front: 'How I Relax', back: 'Strolling with friends and catching up with my special person.' },
        { icon: 'bx bx-coffee', front: 'Off the Clock', back: 'Mobile games, relaxing, and hobbies outside of tech.' },
        { icon: 'bx bx-moon', front: 'Night Owl or Early Bird?', back: 'Night Owl 🦉' },
    ];

    const TILTS = [0, -3, 1.5, -2, 2, -1];
    const SCALES = [1, 0.97, 0.94, 0.91, 0.88, 0.85];
    const YOFFS = [0, 10, 20, 30, 40, 50];
    let current = 0, flipped = false, startX = 0, startY = 0, dragX = 0, isDragging = false;
    let topCard = null;

    const deckEl = container.querySelector('.ff-deck-area');
    const dotsEl = container.querySelector('.ff-swipe-dots');
    const counterEl = container.querySelector('.ff-swipe-counter');

    function buildDeck() {
        deckEl.innerHTML = '';
        const visible = Math.min(3, CARDS.length);
        for (let i = visible - 1; i >= 0; i--) {
            const idx = (current + i) % CARDS.length;
            const card = document.createElement('div');
            card.className = 'ff-swipe-card';
            card.style.zIndex = visible - i;
            if (i === 0) {
                card.style.transform = 'rotate(0deg) scale(1) translateY(0)';
                card.innerHTML = `
                    <span class="ff-swipe-label">tap to flip</span>
                    <div class="ff-swipe-icon"><i class='${CARDS[idx].icon}'></i></div>
                    <span class="ff-swipe-title">${CARDS[idx].front}</span>
                    <span class="ff-swipe-hint">swipe to skip</span>`;
                topCard = card;
            } else {
                card.style.transform = `rotate(${TILTS[i]}deg) scale(${SCALES[i]}) translateY(${YOFFS[i]}px)`;
                card.innerHTML = `<span class="ff-swipe-title" style="opacity:0.35">${CARDS[(current + i) % CARDS.length].front}</span>`;
            }
            deckEl.appendChild(card);
        }
        flipped = false;
        updateDots();
    }

    function updateDots() {
        dotsEl.innerHTML = '';
        CARDS.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'ff-swipe-dot' + (i === current ? ' active' : '');
            dotsEl.appendChild(d);
        });
        if (counterEl) counterEl.textContent = (current + 1) + ' / ' + CARDS.length;
    }

    function flipTop() {
        if (!topCard) return;
        flipped = !flipped;
        const idx = current;
        if (flipped) {
            topCard.innerHTML = `<span class="ff-swipe-back-text">${CARDS[idx].back}</span>`;
            topCard.style.borderColor = 'var(--accent-primary)';
            topCard.style.boxShadow = '0 12px 40px var(--accent-glow)';
        } else {
            topCard.innerHTML = `
                <span class="ff-swipe-label">tap to flip</span>
                <div class="ff-swipe-icon"><i class='${CARDS[idx].icon}'></i></div>
                <span class="ff-swipe-title">${CARDS[idx].front}</span>
                <span class="ff-swipe-hint">swipe to skip</span>`;
            topCard.style.borderColor = '';
            topCard.style.boxShadow = '';
        }
    }

    function goTo(dir) {
        current = (((current + dir) % CARDS.length) + CARDS.length) % CARDS.length;
        buildDeck();
    }

    function swipeOut(dir) {
        if (!topCard) return;
        topCard.style.transition = 'transform 0.35s ease, opacity 0.35s';
        topCard.style.transform = `translateX(${dir * 450}px) rotate(${dir * 18}deg)`;
        topCard.style.opacity = '0';
        setTimeout(() => goTo(dir), 320);
    }

    deckEl.addEventListener('mousedown', e => {
        isDragging = true; startX = e.clientX; startY = e.clientY; dragX = 0;
        if (topCard) topCard.style.transition = 'none';
    });
    deckEl.addEventListener('mousemove', e => {
        if (!isDragging || !topCard) return;
        dragX = e.clientX - startX;
        topCard.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.07}deg)`;
    });
    deckEl.addEventListener('mouseup', e => {
        if (!isDragging) return; isDragging = false;
        const movedY = Math.abs(e.clientY - startY);
        if (Math.abs(dragX) < 12 && movedY < 12) { flipTop(); if (topCard) topCard.style.transform = ''; return; }
        if (Math.abs(dragX) > 70) swipeOut(dragX > 0 ? 1 : -1);
        else if (topCard) { topCard.style.transition = 'transform 0.3s'; topCard.style.transform = ''; }
    });
    deckEl.addEventListener('mouseleave', () => {
        if (isDragging && topCard) { isDragging = false; topCard.style.transition = 'transform 0.3s'; topCard.style.transform = ''; }
    });
    deckEl.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY; dragX = 0;
        if (topCard) topCard.style.transition = 'none';
    }, { passive: true });
    deckEl.addEventListener('touchmove', e => {
        if (!topCard) return;
        dragX = e.touches[0].clientX - startX;
        topCard.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.07}deg)`;
    }, { passive: true });
    deckEl.addEventListener('touchend', e => {
        if (!topCard) return;
        const movedY = Math.abs(e.changedTouches[0].clientY - startY);
        if (Math.abs(dragX) < 12 && movedY < 12) { flipTop(); topCard.style.transform = ''; return; }
        if (Math.abs(dragX) > 70) swipeOut(dragX > 0 ? 1 : -1);
        else { topCard.style.transition = 'transform 0.3s'; topCard.style.transform = ''; }
    });

    buildDeck();
}
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

function initAchievementsFilter() {
    const track = document.getElementById('achPillTrack');
    const slider = document.getElementById('achPillSlider');
    const wall = document.getElementById('achievementsWall');
    if (!track || !wall) return;

    const filterBtns = track.querySelectorAll('.ach-filter-btn');
    let pendingTimers = [];

    function moveSlider(btn) {
        const trackRect = track.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        slider.style.left = (btnRect.left - trackRect.left + track.scrollLeft) + 'px';
        slider.style.width = btnRect.width + 'px';
    }

    // Init slider position after fonts load
    requestAnimationFrame(() => {
        const active = track.querySelector('.ach-filter-btn.active');
        if (active) moveSlider(active);
    });
    window.addEventListener('resize', () => {
        const active = track.querySelector('.ach-filter-btn.active');
        if (active) moveSlider(active);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pendingTimers.forEach(id => clearTimeout(id));
            pendingTimers = [];

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            moveSlider(btn);
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            const filter = btn.dataset.filter;
            const cards = wall.querySelectorAll('.ach-frame-wrap');

            cards.forEach((card, idx) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.remove('filtering-in', 'filtering-out');

                if (!match) {
                    if (!card.classList.contains('hidden')) {
                        card.classList.add('filtering-out');
                        const timerId = setTimeout(() => {
                            card.classList.remove('filtering-out');
                            card.classList.add('hidden');
                            card.style.opacity = '';
                            card.style.transform = '';
                        }, 260);
                        pendingTimers.push(timerId);
                    }
                } else {
                    card.classList.remove('hidden');
                    card.classList.add('in-view');
                    const stagger = idx * 40;
                    const timerId = setTimeout(() => {
                        card.classList.add('filtering-in');
                        const onDone = () => {
                            card.classList.remove('filtering-in');
                            card.style.opacity = '';
                            card.style.transform = '';
                        };
                        card.addEventListener('animationend', onDone, { once: true });
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