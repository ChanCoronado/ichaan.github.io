//  ANIMATED GRID BACKGROUND 
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

function drawGrid() {
    gridCtx.clearRect(0, 0, gridWidth, gridHeight);
    
    gridCtx.strokeStyle = 'rgba(0, 255, 159, 0.08)';
    gridCtx.lineWidth = 1;

    // Vertical lines
    for (let x = -gridSize + (gridOffset.x % gridSize); x < gridWidth; x += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridHeight);
        gridCtx.stroke();
    }

    // Horizontal lines
    for (let y = -gridSize + (gridOffset.y % gridSize); y < gridHeight; y += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridWidth, y);
        gridCtx.stroke();
    }

    // Smooth continuous movement
    gridOffset.x += 0.15;
    gridOffset.y += 0.15;

    gridAnimationFrame = requestAnimationFrame(drawGrid);
}

drawGrid();

//  FALLING TEXT BACKGROUND 
const fallingCanvas = document.getElementById('fallingTextCanvas');
const fallingCtx = fallingCanvas.getContext('2d');

let fallingWidth, fallingHeight;

function resizeFalling() {
    fallingWidth = fallingCanvas.width = window.innerWidth;
    fallingHeight = fallingCanvas.height = window.innerHeight;
}

resizeFalling();
window.addEventListener('resize', resizeFalling);

// Enhanced text pool
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
    
    fallingCtx.fillStyle = 'rgba(34, 34, 34, 0.05)';
    fallingCtx.fillRect(0, 0, fallingWidth, fallingHeight);

    fallingCtx.font = '12px Inter, monospace';

    drops.forEach((drop, i) => {
        const x = i * 20;
        
        fallingCtx.fillStyle = `rgba(0, 255, 159, ${drop.opacity})`;
        fallingCtx.fillText(drop.text, x, drop.y);

        drop.y += drop.speed;

        
        if (drop.y > fallingHeight) {
            drop.y = Math.random() * -300;
            drop.text = textPool[Math.floor(Math.random() * textPool.length)];
            drop.speed = Math.random() * 1.5 + 0.5;
            drop.opacity = Math.random() * 0.15 + 0.08;
        }
    });

    fallingAnimationFrame = requestAnimationFrame(drawFallingText);
}

drawFallingText();

// NAVIGATION & MOBILE MENU 
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const barsBox = document.querySelector('.bars-box');


menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('header') && mainNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

//  SMART SCROLL DETECTION
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

//  IMPROVED SECTION SWITCHING 
let isTransitioning = false;

function switchSection(targetSection) {
    const currentSection = document.querySelector('.section.active');
    if (isTransitioning || currentSection === targetSection) {
        return;
    }

    isTransitioning = true;

    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');

    
    if (currentSection) {
        currentSection.classList.add('transitioning-out');
    }

    // Show bars animation after brief delay
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

// Navigation link handlers
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Don't proceed if transitioning
        if (isTransitioning) return;
        
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Switch section
            switchSection(targetSection);
            
            // Update URL hash
            history.pushState(null, null, `#${sectionId}`);
        }
    });
});

// Logo click 
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

// Handle hash navigation on page load
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
});

// Handle browser back/forward buttons
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

//  PROJECT CAROUSEL 
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectDetails = document.querySelectorAll('.project-detail');

let currentProjectIndex = 0;
const totalProjects = projectDetails.length;

function updateCarousel() {
    // Slide carousel
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

// Next button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentProjectIndex < totalProjects - 1) {
            currentProjectIndex++;
            updateCarousel();
        }
    });
}

// Previous button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            updateCarousel();
        }
    });
}

// Keyboard navigation for projects
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

//  CONTACT FORM 
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        
        // Show success message
        alert(`Thank you for your message, ${name}! I will get back to you soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

//  SMOOTH SCROLL ANIMATIONS 
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

// Observe timeline items and contact cards when About/Contact sections are active
function observeElements() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const contactCards = document.querySelectorAll('.contact-card');
    
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

//  ANIMATED TEXT CENTER FIX 
function centerAnimatedText() {
    const animatedTexts = document.querySelectorAll('.animated-text');
    
    animatedTexts.forEach(container => {
        const textItems = container.querySelectorAll('.text-item');
        
        let maxWidth = 0;
        textItems.forEach(item => {
            const width = item.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        
        if (maxWidth > 0) {
            container.style.minWidth = `${maxWidth + 10}px`;
        }
    });
}

// Center animated text on load and resize
window.addEventListener('load', centerAnimatedText);
window.addEventListener('resize', debounce(centerAnimatedText, 250));

//  PERFORMANCE OPTIMIZATIONS

// Throttle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeGrid();
        resizeFalling();
    }, 150);
});

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        
        if (gridAnimationFrame) cancelAnimationFrame(gridAnimationFrame);
        if (fallingAnimationFrame) cancelAnimationFrame(fallingAnimationFrame);
    } else {
        
        drawGrid();
        drawFallingText();
    }
});

// Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
   
    if (gridAnimationFrame) cancelAnimationFrame(gridAnimationFrame);
    if (fallingAnimationFrame) cancelAnimationFrame(fallingAnimationFrame);
    gridOffset = { x: 0, y: 0 };
}

//  ACCESSIBILITY ENHANCEMENTS 

// Add focus visible styles
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

//  UTILITY FUNCTIONS 

// Debounce function
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

// Throttle function
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

