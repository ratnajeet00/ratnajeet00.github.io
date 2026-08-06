// ============================================
// RATNAJEET PATIL — DARK MINIMAL PORTFOLIO
// Premium Animation Engine — GSAP + Custom Cursor
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Footer year ──
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ── Theme toggle (matte light/dark) ──
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let theme = savedTheme || (systemDark ? 'dark' : 'light');

        function applyTheme(t) {
            document.documentElement.setAttribute('data-theme', t);
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.setAttribute('content', t === 'dark' ? '#121216' : '#f2f1ee');
            }
        }

        applyTheme(theme);

        themeToggle.addEventListener('click', function () {
            theme = theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    }

    // ── Register GSAP Plugins ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        // Set default GSAP ease for entire project
        gsap.defaults({ ease: 'power2.out' });
    }

    // ============================================
    // PAGE LOADER
    // ============================================
    const loader = document.getElementById('loader');

    if (loader && !prefersReducedMotion) {
        setTimeout(function () {
            loader.classList.add('reveal');
        }, 80);

        setTimeout(function () {
            loader.classList.add('loaded');
            body.style.overflow = '';
        }, 800);

        setTimeout(function () {
            loader.remove();
            initAnimations();
            // Refresh scroll positions after loader is gone
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 1300);
    } else {
        if (loader) loader.remove();
        body.style.overflow = '';
        initAnimations();
    }

    // ============================================
    // NAVBAR — Auto-hide + Scroll Background
    // ============================================
    var navbar = document.getElementById('navbar');
    var siteHeader = document.getElementById('site-header');
    var lastScrollY = 0;
    var ticking = false;

    function handleNavbar() {
        var currentScrollY = window.scrollY;

        if (navbar) {
            if (currentScrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (siteHeader) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                siteHeader.classList.add('nav-hidden');
            } else {
                siteHeader.classList.remove('nav-hidden');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(handleNavbar);
            ticking = true;
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        mobileNavLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#navbar ul li a');

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.remove('current');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('current');
                    }
                });
                updatePageTitleForSection(id);
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    function updatePageTitleForSection(sectionId) {
        var baseName = 'Ratnajeet Patil';
        var pageTitle = baseName;

        switch (sectionId) {
            case 'about': pageTitle = 'About — ' + baseName; break;
            case 'projects': pageTitle = 'Projects — ' + baseName; break;
            case 'skills': pageTitle = 'Skills — ' + baseName; break;
            case 'experience': pageTitle = 'Experience — ' + baseName; break;
            case 'education': pageTitle = 'Education — ' + baseName; break;
            case 'research': pageTitle = 'Research — ' + baseName; break;
            default: pageTitle = baseName + ' | Software Engineer';
        }

        document.title = pageTitle;
    }

    // ============================================
    // PROJECT FILTERING
    // ============================================
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filterValue = btn.getAttribute('data-filter');
            var visibleIndex = 0;

            projectItems.forEach(function (item) {
                var shouldShow = filterValue === 'all' || item.getAttribute('data-category') === filterValue;

                if (typeof gsap !== 'undefined') {
                    if (shouldShow) {
                        item.style.display = 'block';
                        gsap.fromTo(item,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.35, delay: visibleIndex * 0.04 }
                        );
                        visibleIndex++;
                    } else {
                        gsap.to(item, {
                            opacity: 0, y: 10, duration: 0.2,
                            onComplete: function () { item.style.display = 'none'; }
                        });
                    }
                } else {
                    item.style.display = shouldShow ? 'block' : 'none';
                    item.style.opacity = shouldShow ? '1' : '0';
                }
            });
        });
    });

    // ============================================
    // SMOOTH ANCHOR SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // ANIMATIONS INIT
    // ============================================
    function initAnimations() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal-element').forEach(function (el) {
                el.classList.add('revealed');
            });
            document.querySelectorAll('.stagger-children').forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        initHeroTextReveal();

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initGSAPAnimations();
        } else {
            initFallbackAnimations();
        }
    }

    // ============================================
    // HERO TEXT REVEAL
    // ============================================
    function initHeroTextReveal() {
        var heroHeading = document.getElementById('hero-heading');
        if (!heroHeading) return;

        var text = heroHeading.textContent;
        var words = text.split(' ');

        heroHeading.innerHTML = '';

        words.forEach(function (word, index) {
            var wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';

            var wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = word;

            wrapper.appendChild(wordSpan);
            heroHeading.appendChild(wrapper);

            if (index < words.length - 1) {
                heroHeading.appendChild(document.createTextNode(' '));
            }

            setTimeout(function () {
                wordSpan.classList.add('revealed');
            }, 150 + index * 80);
        });

        // Also animate the subtitle and paragraph
        var heroH2 = document.querySelector('.hero-content h2');
        var heroP = document.querySelector('.hero-content p');
        var heroCTA = document.querySelector('.cta-buttons');
        var heroSocial = document.querySelector('.social-icons');

        if (typeof gsap !== 'undefined') {
            var heroTimeline = gsap.timeline({ delay: 0.3 });

            if (heroH2) {
                heroTimeline.fromTo(heroH2,
                    { opacity: 0, y: 10 },
                    { opacity: 0.45, y: 0, duration: 0.5 },
                    0
                );
            }
            if (heroP) {
                heroTimeline.fromTo(heroP,
                    { opacity: 0, y: 10 },
                    { opacity: 0.5, y: 0, duration: 0.5 },
                    0.1
                );
            }
            if (heroCTA) {
                heroTimeline.fromTo(heroCTA,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    0.15
                );
            }
            if (heroSocial) {
                heroTimeline.fromTo(heroSocial,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    0.2
                );
            }
        }
    }

    // ============================================
    // GSAP SCROLL ANIMATIONS
    // ============================================
    function initGSAPAnimations() {

        // ── Section reveal elements — smooth fade + slide ──
        gsap.utils.toArray('.reveal-element').forEach(function (el) {
            gsap.fromTo(el,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Stagger children (skill tags, etc.) ──
        gsap.utils.toArray('.stagger-children').forEach(function (container) {
            var items = container.querySelectorAll('.stagger-item');

            gsap.fromTo(items,
                { y: 12, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.35,
                    stagger: 0.03,
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Project items ──
        gsap.utils.toArray('.project-item').forEach(function (item, index) {
            gsap.fromTo(item,
                { y: 16, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    delay: index * 0.03,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 94%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Timeline items ──
        gsap.utils.toArray('.timeline-item').forEach(function (item) {
            gsap.fromTo(item,
                { x: -16, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.45,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Education items ──
        gsap.utils.toArray('.education-item').forEach(function (item) {
            gsap.fromTo(item,
                { y: 12, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Accent lines ──
        gsap.utils.toArray('.accent-line').forEach(function (line) {
            gsap.fromTo(line,
                { scaleX: 0, opacity: 0 },
                {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.4,
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 94%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Scroll indicator fade out ──
        var scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            gsap.to(scrollIndicator, {
                opacity: 0,
                y: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: '20% top',
                    scrub: true
                }
            });
        }

        // ── Marquee ──
        var marqueeInner = document.querySelector('.marquee-inner');
        if (marqueeInner) {
            gsap.to(marqueeInner, {
                x: '-50%',
                ease: 'none',
                duration: 25,
                repeat: -1
            });
        }

        // ── Hero content parallax on scroll ──
        var heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.to(heroContent, {
                y: -80,
                opacity: 0.2,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // ── Section labels subtle slide ──
        gsap.utils.toArray('.section-label').forEach(function (label) {
            gsap.fromTo(label,
                { x: -10, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    scrollTrigger: {
                        trigger: label,
                        start: 'top 94%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // ── Smooth Section Snapping ──
        // This will softly glide to the nearest section after you stop scrolling
        ScrollTrigger.create({
            snap: {
                snapTo: "section[id]", 
                duration: { min: 0.4, max: 0.8 }, 
                delay: 0.15, // Wait a tiny bit after scrolling stops before snapping
                ease: "power2.inOut"
            }
        });
    }

    // ============================================
    // FALLBACK ANIMATIONS (no GSAP)
    // ============================================
    function initFallbackAnimations() {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal-element').forEach(function (el) {
            revealObserver.observe(el);
        });

        document.querySelectorAll('.stagger-children').forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    // ============================================
    // SEO — Structured Data + Canonical
    // ============================================
    function updateCanonicalUrl(sectionId) {
        var baseUrl = window.location.href.split('#')[0];
        var newUrl = sectionId ? baseUrl + '#' + sectionId : baseUrl;

        var canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }

        canonicalLink.href = newUrl;

        if (history.pushState && sectionId) {
            history.pushState(null, null, '#' + sectionId);
        }
    }

    // Call on initial hash
    var initialSection = window.location.hash ? window.location.hash.substring(1) : '';
    if (initialSection) {
        updatePageTitleForSection(initialSection);
    }
});
