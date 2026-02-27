function initAboutSection() {
    initAboutImageTouch();
    initHobbyLightbox();
    initAchievementLightbox();
    initAboutInViewAnimations();
    initFlipCards();
    initCounters();
    initScrollIndicator();
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
    const lbImg     = overlay.querySelector('#lb-img');
    const lbTitle   = overlay.querySelector('#lb-title');
    const lbDesc    = overlay.querySelector('#lb-desc');
    const lbDots    = overlay.querySelector('#lb-dots');
    const lbCounter = overlay.querySelector('#lb-counter');
    const lbThumbs  = overlay.querySelector('#lb-thumbs');
    const btnClose  = overlay.querySelector('.lightbox-close');
    const btnPrev   = overlay.querySelector('.lightbox-prev');
    const btnNext   = overlay.querySelector('.lightbox-next');

    let images  = [];
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
        lbDots.innerHTML   = '';
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
        if (lbDesc)  lbDesc.textContent  = meta.desc  || '';

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

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => showImage(current - 1));
    btnNext.addEventListener('click', () => showImage(current + 1));

    overlay.addEventListener('click', e => {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  showImage(current - 1);
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
                desc:  card.dataset.desc  || ''
            });
        });
    });
}

function initAchievementLightbox() {
    const cards = document.querySelectorAll('.achievement-card');
    if (!cards.length) return;

    const overlay = createAchievementLightboxOverlay();
    const lbIcon  = overlay.querySelector('#lb-icon');
    const lbDate  = overlay.querySelector('#lb-date');
    const { open } = initLightboxCore(overlay);

    cards.forEach(card => {
        const rawImgs = (card.dataset.imgs || '').trim();
        const imgList = rawImgs ? rawImgs.split(',').map(s => s.trim()).filter(Boolean) : [];

        if (imgList.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'achievement-img-badge';
            badge.innerHTML = `<i class='bx bx-images'></i> ${imgList.length}`;
            card.appendChild(badge);
        }

        card.addEventListener('click', () => {
            if (lbIcon) lbIcon.className = card.dataset.icon || 'bx bxs-trophy';
            if (lbDate) lbDate.textContent = card.dataset.date || '';
            open(imgList, {
                title: card.dataset.title || '',
                desc:  card.dataset.desc  || ''
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
                const delay = el.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    el.classList.add('in-view');
                    if (el.classList.contains('skill-logo-card')) {
                        const fill = el.querySelector('.skill-logo-level-fill');
                        if (fill) {
                            const level = fill.getAttribute('data-level');
                            fill.style.width = level + '%';
                        }
                    }
                }, parseInt(delay));
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    const targets = aboutSection.querySelectorAll(
        '.timeline-item, .skill-logo-card, .tool-tag, .hobby-gallery-item, ' +
        '.goal-roadmap-item, .achievement-card, .funfact-flip-card, .counter-item'
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
        const target    = parseInt(el.getAttribute('data-target'));
        const suffix    = el.getAttribute('data-suffix') || '';
        const duration  = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed  = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = Math.floor(eased * target);
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
    const hash = window.location.hash.substring(1) || 'home';
    if (hash === 'about') {
        setTimeout(initAboutSection, 600);
    }
});