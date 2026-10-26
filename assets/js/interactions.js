/* INTERACTIONS: About sub-navigation, skill usage panel, scroll reveal, copy email */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ABOUT SUB-NAVIGATION (smooth jump and scroll spy) */
    function initAboutSubnav() {
        var nav = document.getElementById('aboutSubnav');
        var scroller = document.querySelector('#about .section-inner');
        if (!nav || !scroller) return;

        var links = Array.prototype.slice.call(nav.querySelectorAll('a'));

        function setActive(id) {
            links.forEach(function (a) {
                a.classList.toggle('active', a.dataset.target === id);
            });
        }

        links.forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.getElementById(a.dataset.target);
                if (!target) return;
                var top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
                var offset = window.getComputedStyle(nav).position === 'fixed' ? 100 : 130;
                scroller.scrollTo({ top: top - offset, behavior: reduceMotion ? 'auto' : 'smooth' });
                setActive(a.dataset.target);
            });
        });

        if (!('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { root: scroller, rootMargin: '-25% 0px -65% 0px', threshold: 0 });

        links.forEach(function (a) {
            var section = document.getElementById(a.dataset.target);
            if (section) observer.observe(section);
        });
    }

    /* SKILL USAGE: click a skill to see which work used it (only stacks I have listed on this site) */
    var PROJECTS = [
        'Saisyd Café',
        'Notarial Document System',
        'The Fourth Lens',
        "Chan's Typing Test",
        'Student Life Organizer',
        'NEONBREAK'
    ];

    var SKILL_USE = {
        'HTML': { projects: [0, 3, 4, 5] },
        'CSS': { projects: [0, 3, 4, 5] },
        'JavaScript': { projects: [0, 1, 3, 4, 5] },
        'Bootstrap': { projects: [0, 3, 4] },
        'PHP': { projects: [0, 1] },
        'MySQL': { projects: [0, 1] },
        'Git': { projects: [1] },
        'GitHub Actions (CI)': { projects: [1] },
        'WordPress': { experience: 'Knowles Training Institute internship' },
        'Google Search Console': { experience: 'Knowles Training Institute internship' }
    };

    function goTo(sectionId, afterMs, callback) {
        var nav = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        if (nav) nav.click();
        if (callback) setTimeout(callback, afterMs);
    }

    function initSkillUsage() {
        var panel = document.getElementById('skillUsage');
        var chips = document.querySelectorAll('.skill-chip');
        if (!panel || !chips.length) return;

        var defaultHtml = panel.innerHTML;
        var activeChip = null;

        function clear() {
            if (activeChip) {
                activeChip.classList.remove('is-selected');
                activeChip.setAttribute('aria-pressed', 'false');
            }
            activeChip = null;
            panel.innerHTML = defaultHtml;
        }

        function show(chip, name, use) {
            if (activeChip === chip) {
                clear();
                return;
            }
            clear();
            activeChip = chip;
            chip.classList.add('is-selected');
            chip.setAttribute('aria-pressed', 'true');

            var html = '<p class="skill-usage-title">Where I have used <strong>' + name + '</strong></p>' +
                '<div class="skill-usage-list">';

            if (use.projects) {
                use.projects.forEach(function (idx) {
                    html += '<button type="button" class="skill-usage-link" data-project="' + idx + '">' +
                        PROJECTS[idx] + ' <i class="bx bx-right-arrow-alt" aria-hidden="true"></i></button>';
                });
            }
            if (use.experience) {
                html += '<button type="button" class="skill-usage-link" data-experience="1">' + use.experience +
                    ' <i class="bx bx-right-arrow-alt" aria-hidden="true"></i></button>';
            }
            html += '</div>';
            panel.innerHTML = html;
        }

        chips.forEach(function (chip) {
            var name = chip.textContent.trim();
            var use = SKILL_USE[name];
            if (!use) return;

            chip.classList.add('skill-chip-link');
            chip.setAttribute('role', 'button');
            chip.setAttribute('tabindex', '0');
            chip.setAttribute('aria-pressed', 'false');

            chip.addEventListener('click', function () { show(chip, name, use); });
            chip.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    show(chip, name, use);
                }
            });
        });

        panel.addEventListener('click', function (e) {
            var btn = e.target.closest('.skill-usage-link');
            if (!btn) return;

            if (btn.dataset.experience) {
                goTo('experience');
            } else if (btn.dataset.project !== undefined) {
                var idx = parseInt(btn.dataset.project, 10);
                goTo('projects', 750, function () {
                    if (typeof switchProject === 'function') switchProject(idx);
                });
            }
        });
    }

    /* SCROLL REVEAL (experience cards); only hidden once JS is confirmed running */
    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) return;

        var scroller = document.querySelector('#experience .section-inner');
        document.body.classList.add('js-reveal');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: scroller, threshold: 0.15 });

        // Show everything even if the observer never fires (for example, the section is still hidden)
        items.forEach(function (el, i) {
            el.style.transitionDelay = (i * 120) + 'ms';
            observer.observe(el);
        });
        setTimeout(function () {
            items.forEach(function (el) { el.classList.add('is-visible'); });
        }, 4000);
    }

    /* COPY EMAIL */
    function initCopyEmail() {
        var btn = document.getElementById('copyEmail');
        var link = document.getElementById('emailLink');
        if (!btn || !link) return;

        var label = btn.querySelector('span');
        var original = label.textContent;

        btn.addEventListener('click', function () {
            var address = link.dataset.user + '@' + link.dataset.domain;

            function done(ok) {
                label.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy';
                setTimeout(function () { label.textContent = original; }, 2000);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(function () { done(true); }, function () {
                    window.location.href = 'mailto:' + address;
                });
            } else {
                window.location.href = 'mailto:' + address;
            }
        });
    }

    /* PUP LOGO: requested only when the education card is on screen (and removed if the file is missing) */
    function initDeferredImages() {
        var imgs = document.querySelectorAll('img[data-src]');
        if (!imgs.length) return;

        function load(img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        if (!('IntersectionObserver' in window)) {
            imgs.forEach(load);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    load(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { root: document.querySelector('#about .section-inner'), rootMargin: '200px' });

        imgs.forEach(function (img) { observer.observe(img); });
    }

    /* ABOUT SCROLL PROGRESS */
    function initAboutProgress() {
        var bar = document.querySelector('#aboutProgress span');
        var scroller = document.querySelector('#about .section-inner');
        if (!bar || !scroller) return;

        var ticking = false;
        scroller.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var max = scroller.scrollHeight - scroller.clientHeight;
                bar.style.transform = 'scaleX(' + (max > 0 ? scroller.scrollTop / max : 0) + ')';
                ticking = false;
            });
        }, { passive: true });
    }

    function init() {
        initAboutProgress();
        initDeferredImages();
        initAboutSubnav();
        initSkillUsage();
        initReveal();
        initCopyEmail();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
