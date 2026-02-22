function initAboutSection() {
    initAboutImageTouch();
    initLightbox();
    initAchievementModals();
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

let lightboxItems = [];
let lightboxCurrentIndex = 0;

function initLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;

    const lightboxImg = overlay.querySelector('.lightbox-img');
    const lightboxTitle = overlay.querySelector('.lightbox-caption h4');
    const lightboxDesc = overlay.querySelector('.lightbox-caption p');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    const galleryItems = document.querySelectorAll('.hobby-gallery-item');
    lightboxItems = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-src'),
        title: item.getAttribute('data-title'),
        desc: item.getAttribute('data-desc')
    }));

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    function openLightbox(index) {
        lightboxCurrentIndex = index;
        updateLightboxContent();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = lightboxItems[lightboxCurrentIndex];
        if (!item) return;
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxDesc) lightboxDesc.textContent = item.desc;
        if (prevBtn) prevBtn.style.display = lightboxCurrentIndex === 0 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = lightboxCurrentIndex === lightboxItems.length - 1 ? 'none' : 'flex';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (lightboxCurrentIndex > 0) {
                lightboxCurrentIndex--;
                updateLightboxContent();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (lightboxCurrentIndex < lightboxItems.length - 1) {
                lightboxCurrentIndex++;
                updateLightboxContent();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxCurrentIndex > 0) {
            lightboxCurrentIndex--;
            updateLightboxContent();
        }
        if (e.key === 'ArrowRight' && lightboxCurrentIndex < lightboxItems.length - 1) {
            lightboxCurrentIndex++;
            updateLightboxContent();
        }
    });
}

function initAchievementModals() {
    const overlay = document.getElementById('achievementModalOverlay');
    if (!overlay) return;

    const modalImg = overlay.querySelector('.achievement-modal-img');
    const modalImgPlaceholder = overlay.querySelector('.achievement-modal-img-placeholder');
    const modalIcon = overlay.querySelector('.achievement-modal-icon i');
    const modalTitle = overlay.querySelector('.achievement-modal-title');
    const modalDate = overlay.querySelector('.achievement-modal-date');
    const modalDesc = overlay.querySelector('.achievement-modal-desc');
    const closeBtn = overlay.querySelector('.achievement-modal-close');

    const cards = document.querySelectorAll('.achievement-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-img');
            const iconClass = card.getAttribute('data-icon');
            const title = card.getAttribute('data-title');
            const date = card.getAttribute('data-date');
            const desc = card.getAttribute('data-desc');

            if (modalIcon) modalIcon.className = iconClass || 'bx bxs-trophy';
            if (modalTitle) modalTitle.textContent = title || '';
            if (modalDate) modalDate.textContent = date || '';
            if (modalDesc) modalDesc.textContent = desc || '';

            if (imgSrc && modalImg) {
                modalImg.src = imgSrc;
                modalImg.style.display = 'block';
                if (modalImgPlaceholder) modalImgPlaceholder.style.display = 'none';
            } else {
                if (modalImg) modalImg.style.display = 'none';
                if (modalImgPlaceholder) {
                    modalImgPlaceholder.style.display = 'flex';
                    const placeholderIcon = modalImgPlaceholder.querySelector('i');
                    if (placeholderIcon) placeholderIcon.className = iconClass || 'bx bxs-trophy';
                }
            }

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
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