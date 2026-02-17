const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

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
    
    setTimeout(() => {
        themeToggle.classList.remove('rotating');
    }, 600);
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

const gridSize = 50;
let gridOffset = { x: 0, y: 0 };
let gridAnimationFrame;
let gridColor = 'rgba(0, 255, 159, 0.08)';

function updateCanvasColors(theme) {
    if (theme === 'light') {
    
        gridColor = 'rgba(184, 134, 11, 0.15)';
        fallingTextColor = 'rgba(184, 134, 11, 0.25)';
        console.log('✅ Light mode colors set');
    } else {
      
        gridColor = 'rgba(0, 255, 159, 0.08)';
        fallingTextColor = 'rgba(0, 255, 159, 0.15)';
        console.log('✅ Dark mode colors set');
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

    for (let x = -gridSize + (gridOffset.x % gridSize); x < gridWidth; x += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridHeight);
        gridCtx.stroke();
    }

    for (let y = -gridSize + (gridOffset.y % gridSize); y < gridHeight; y += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridWidth, y);
        gridCtx.stroke();
    }

    const speed = body.classList.contains('light-mode') ? 0.1 : 0.15;
    gridOffset.x += speed;
    gridOffset.y += speed;

    gridAnimationFrame = requestAnimationFrame(drawGrid);
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
    'portfolio', 'developer', 'frontend', 'backend', 'fullstack'
];

const columns = Math.floor(fallingWidth / 20);
const drops = [];
let fallingTextColor = 'rgba(0, 255, 159, 0.15)';

for (let i = 0; i < columns; i++) {
    drops[i] = {
        y: Math.random() * -800,
        speed: Math.random() * 1.5 + 0.5,
        text: textPool[Math.floor(Math.random() * textPool.length)],
        opacity: Math.random() * 0.15 + 0.08
    };
}

let fallingAnimationFrame;

function drawFallingText() {
    const isLightMode = body.classList.contains('light-mode');
    
    const bgColor = isLightMode 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.05)';
    
    fallingCtx.fillStyle = bgColor;
    fallingCtx.fillRect(0, 0, fallingWidth, fallingHeight);

    fallingCtx.font = '12px Inter, monospace';

    drops.forEach((drop, i) => {
        const x = i * 20;
        
        const baseOpacity = isLightMode ? 0.25 : 0.15;
        
        const color = isLightMode 
            ? `rgba(184, 134, 11, ${drop.opacity})` 
            : `rgba(0, 255, 159, ${drop.opacity})`;
        
        fallingCtx.fillStyle = color;
        fallingCtx.fillText(drop.text, x, drop.y);

        const speedMultiplier = isLightMode ? 0.8 : 1;
        drop.y += drop.speed * speedMultiplier;

        if (drop.y > fallingHeight) {
            drop.y = Math.random() * -300;
            drop.text = textPool[Math.floor(Math.random() * textPool.length)];
            drop.speed = Math.random() * 1.5 + 0.5;
            drop.opacity = Math.random() * baseOpacity + (baseOpacity / 2);
        }
    });

    fallingAnimationFrame = requestAnimationFrame(drawFallingText);
}

drawFallingText();

updateCanvasColors(currentTheme);


const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const barsBox = document.querySelector('.bars-box');

function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
}

function unlockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        menuToggle.classList.add('active');
        if (mobileMenu) {
            mobileMenu.classList.add('active');
        }
        lockScroll();
    });
}

function closeMobileMenu() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    
    if (menuToggle) {
        menuToggle.classList.remove('active');
    }
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    
    setTimeout(() => {
        unlockScroll();
    }, 100);
}

if (mobileClose) {
    mobileClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
}

if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu || e.target.classList.contains('mobile-menu-bg')) {
            closeMobileMenu();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isTransitioning) return;
        
        if (navigator.vibrate) {
            navigator.vibrate(15);
        }
        
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            
            navLinks.forEach(l => l.classList.remove('active'));
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            
            const desktopLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            if (desktopLink) {
                desktopLink.classList.add('active');
            }
            link.classList.add('active');
            
            closeMobileMenu();
            
            setTimeout(() => {
                switchSection(targetSection);
                history.pushState(null, null, `#${sectionId}`);
            }, 400);
        }
    });
    
   
    link.addEventListener('touchstart', () => {
        link.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    link.addEventListener('touchend', () => {
        link.style.transition = '';
    });
});

mobileNavLinks.forEach((link) => {
    let pressTimer;
    
    link.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
            
        }, 500);
    });
    
    link.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
    });
    
    link.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
    });
});

function checkSectionOverflow() {
    sections.forEach(section => {
        const sectionInner = section.querySelector('.section-inner');
        if (sectionInner) {
            const hasOverflow = sectionInner.scrollHeight > sectionInner.clientHeight;
            
            if (hasOverflow) {
                sectionInner.style.overflowY = 'auto';
            } else {
                sectionInner.style.overflowY = 'hidden';
            }
        }
    });
}

window.addEventListener('load', checkSectionOverflow);
window.addEventListener('resize', debounce(checkSectionOverflow, 250));

let isTransitioning = false;

function switchSection(targetSection) {
    const currentSection = document.querySelector('.section.active');
    if (isTransitioning || currentSection === targetSection) {
        return;
    }

    isTransitioning = true;

    closeMobileMenu();

    if (currentSection) {
        currentSection.classList.add('transitioning-out');
    }

    setTimeout(() => {
        barsBox.classList.add('active');
    }, 200);

    setTimeout(() => {
        sections.forEach(section => {
            section.classList.remove('active', 'transitioning-out');
        });

        targetSection.classList.add('active');
        
        const sectionInner = targetSection.querySelector('.section-inner');
        if (sectionInner) {
            sectionInner.scrollTop = 0;
        }

        checkSectionOverflow();
    }, 600);

    setTimeout(() => {
        barsBox.classList.remove('active');
        isTransitioning = false;
    }, 1200);
}

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isTransitioning) return;
        
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            switchSection(targetSection);
            
            history.pushState(null, null, `#${sectionId}`);
        }
    });
});

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isTransitioning) return;
        
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[0].classList.add('active');
        
        switchSection(sections[0]);
        history.pushState(null, null, '#home');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1) || 'home';
    const targetSection = document.getElementById(hash);
    
    if (targetSection) {
        const navLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
        if (navLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
            
            sections.forEach(s => {
                s.classList.remove('active');
            });
            
            targetSection.classList.add('active');
            
            const sectionInner = targetSection.querySelector('.section-inner');
            if (sectionInner) {
                sectionInner.scrollTop = 0;
            }
        }
    } else {
        sections[0].classList.add('active');
        const sectionInner = sections[0].querySelector('.section-inner');
        if (sectionInner) {
            sectionInner.scrollTop = 0;
        }
    }

    checkSectionOverflow();
    initAnimatedText();
    
    initScrollAnimations();
    initSkillBars();
    initEnhancements();
});

window.addEventListener('popstate', () => {
    if (isTransitioning) return;
    
    const hash = window.location.hash.substring(1) || 'home';
    const targetSection = document.getElementById(hash);
    
    if (targetSection) {
        const navLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
        if (navLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }
        
        switchSection(targetSection);
    }
});

function initAnimatedText() {
    const containers = document.querySelectorAll('.animated-text-container');
    
    containers.forEach(container => {
        const textItems = container.querySelectorAll('.text-item');
        
        if (textItems.length === 0) return;
        
        let maxWidth = 0;
        textItems.forEach(item => {
            
            item.style.opacity = '1';
            item.style.position = 'static';
            const width = item.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
            
            item.style.opacity = '';
            item.style.position = 'absolute';
        });
        
        
        if (maxWidth > 0) {
            container.style.minWidth = `${maxWidth + 5}px`;
        }
    });
}

window.addEventListener('resize', debounce(initAnimatedText, 250));
 
const imageContainer = document.querySelector('.image-container');

if (imageContainer) {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (isTouchDevice) {
        imageContainer.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.image-container')) {
                imageContainer.classList.remove('active');
            }
        });
    }
}

const aboutImageWrapper = document.querySelector('.about-image-wrapper');

if (aboutImageWrapper) {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (isTouchDevice) {
        aboutImageWrapper.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.about-image-wrapper')) {
                aboutImageWrapper.classList.remove('active');
            }
        });
    }
}

const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectDetails = document.querySelectorAll('.project-detail');

let currentProjectIndex = 0;
const totalProjects = projectDetails.length;

function updateCarousel() {
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
    }

    projectDetails.forEach((detail, index) => {
        if (index === currentProjectIndex) {
            detail.classList.add('active');
            setTimeout(() => {
                detail.style.opacity = '1';
            }, 150);
        } else {
            detail.classList.remove('active');
            detail.style.opacity = '0';
        }
    });

    if (prevBtn) {
        prevBtn.disabled = currentProjectIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentProjectIndex === totalProjects - 1;
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentProjectIndex < totalProjects - 1) {
            currentProjectIndex++;
            updateCarousel();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            updateCarousel();
        }
    });
}

document.addEventListener('keydown', (e) => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection && projectsSection.classList.contains('active')) {
        if (e.key === 'ArrowRight' && currentProjectIndex < totalProjects - 1) {
            currentProjectIndex++;
            updateCarousel();
        } else if (e.key === 'ArrowLeft' && currentProjectIndex > 0) {
            currentProjectIndex--;
            updateCarousel();
        }
    }
});

updateCarousel();

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        
        alert(`Thank you for your message, ${name}! I will get back to you soon.`);
        
        contactForm.reset();
    });
}
 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

function observeElements() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const contactCards = document.querySelectorAll('.contact-card-compact');
    
    [...timelineItems, ...contactCards].forEach(el => {
        if (!el.hasAttribute('data-observed')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            scrollObserver.observe(el);
            el.setAttribute('data-observed', 'true');
        }
    });
}

observeElements();

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(observeElements, 800);
    });
});

function initScrollAnimations() {
    const aboutObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, aboutObserverOptions);

    const animatedElements = document.querySelectorAll(
        '[data-aos], .skill-category, .interest-card, .goal-card, .achievement-card, .funfact-item'
    );

    animatedElements.forEach(el => aboutObserver.observe(el));
}

function animateSkillBars(skillCategory) {
    const progressBars = skillCategory.querySelectorAll('.skill-progress');
    
    progressBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
            bar.style.setProperty('--progress-width', progress + '%');
            bar.style.width = progress + '%';
        }, index * 100);
    });
}

function initSkillBars() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const progressBars = category.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.setProperty('--progress-width', progress + '%');
        });
    });
}

function staggerToolTags() {
    const toolTagContainers = document.querySelectorAll('.tool-tags');
    
    const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.tool-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animation = `popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    }, index * 100);
                });
                tagObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    toolTagContainers.forEach(container => tagObserver.observe(container));
}

function addHoverSounds() {
    const cards = document.querySelectorAll(
        '.skill-category, .interest-card, .goal-card, .achievement-card, .funfact-item'
    );
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

function initEnhancements() {
    staggerToolTags();
    addHoverSounds();
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeGrid();
        resizeFalling();
        
       
        const animatedElements = document.querySelectorAll('.aos-animate');
        animatedElements.forEach(el => {
            
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = '';
            }, 10);
        });
    }, 150);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gridAnimationFrame) cancelAnimationFrame(gridAnimationFrame);
        if (fallingAnimationFrame) cancelAnimationFrame(fallingAnimationFrame);
    } else {
        drawGrid();
        drawFallingText();
    }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    if (gridAnimationFrame) cancelAnimationFrame(gridAnimationFrame);
    if (fallingAnimationFrame) cancelAnimationFrame(fallingAnimationFrame);
    gridOffset = { x: 0, y: 0 };
    
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
