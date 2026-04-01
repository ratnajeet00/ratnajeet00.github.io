// Main JavaScript for personal website

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        body.classList.add('reduced-motion');
    }

    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '4px 4px 0 rgba(2, 8, 28, 0.75)';
            } else {
                navbar.style.padding = '14px 0';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = 'var(--surface-bg)';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '8px 8px 0 rgba(2, 8, 28, 0.75)';
                navMenu.style.borderBottom = '2px solid var(--primary-color)';
            } else {
                navMenu.style.display = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#navbar ul li a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (hamburger && navMenu && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navMenu.style.display = 'none';
            }

            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                updatePageTitleForSection(sectionId);
            }
        });
    });

    function updatePageTitleForSection(sectionId) {
        const yourName = document.querySelector('header h1') ? document.querySelector('header h1').textContent : 'Portfolio';
        let pageTitle = yourName;

        switch (sectionId) {
            case 'about':
                pageTitle = 'About ' + yourName + ' - Personal Portfolio';
                break;
            case 'projects':
                pageTitle = 'Projects by ' + yourName + ' - Portfolio & Work Samples';
                break;
            case 'skills':
                pageTitle = 'Skills & Expertise - ' + yourName + '\'s Professional Portfolio';
                break;
            case 'experience':
                pageTitle = 'Professional Experience - ' + yourName + '\'s Career Timeline';
                break;
            case 'contact':
                pageTitle = 'Contact ' + yourName + ' - Get In Touch';
                break;
            default:
                pageTitle = yourName + ' - Personal Portfolio Website';
        }

        document.title = pageTitle;
        updateCanonicalUrl(sectionId);
    }

    function updateCanonicalUrl(sectionId) {
        const baseUrl = window.location.href.split('#')[0];
        const newUrl = sectionId ? baseUrl + '#' + sectionId : baseUrl;

        let canonicalLink = document.querySelector('link[rel="canonical"]');
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

    function insertStructuredData() {
        const yourName = document.querySelector('header h1') ? document.querySelector('header h1').textContent : '';
        const yourTitle = document.querySelector('header h2') ? document.querySelector('header h2').textContent : '';
        const yourBio = document.querySelector('#about p') ? document.querySelector('#about p').textContent : '';
        const yourImage = document.querySelector('#about img') ? document.querySelector('#about img').src : '';

        const personData = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: yourName,
            jobTitle: yourTitle,
            description: yourBio,
            image: yourImage,
            url: window.location.href,
            sameAs: []
        };

        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(personData);
        document.head.appendChild(scriptTag);
    }

    insertStructuredData();

    const initialSection = window.location.hash ? window.location.hash.substring(1) : '';
    updatePageTitleForSection(initialSection);

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar ul li a');

    window.addEventListener('scroll', function () {
        let current = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('current');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('current');
            }
        });
    });

    // Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    let projectItems = Array.from(document.querySelectorAll('.project-item'));

    // Keep the first matching project card and remove duplicate titles.
    const seenProjectTitles = new Set();
    projectItems = projectItems.filter(function (item) {
        const titleNode = item.querySelector('h3');
        const normalizedTitle = titleNode ? titleNode.textContent.trim().toLowerCase() : '';

        if (!normalizedTitle || !seenProjectTitles.has(normalizedTitle)) {
            if (normalizedTitle) {
                seenProjectTitles.add(normalizedTitle);
            }
            return true;
        }

        item.remove();
        return false;
    });

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(function (item, index) {
                const shouldShow = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                item.style.display = shouldShow ? 'block' : 'none';

                setTimeout(function () {
                    item.style.opacity = shouldShow ? '1' : '0';
                    item.style.transform = shouldShow ? 'scale(1)' : 'scale(0.98)';
                }, 80 + index * 12);
            });
        });
    });

    // Theme toggle (between dark mode and light mode)
    const themeToggle = document.querySelector('.theme-switch');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.body.classList.toggle('light-mode', savedTheme === 'light');
        updateThemeIcon(savedTheme === 'light');
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            document.body.classList.add('light-mode');
            updateThemeIcon(true);
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('light-mode');
            const isLightMode = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            updateThemeIcon(isLightMode);
        });
    }

    function updateThemeIcon(isLightMode) {
        const iconTarget = document.querySelector('.theme-switch');
        if (!iconTarget) return;

        iconTarget.innerHTML = isLightMode
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            console.log('Form submitted:', { name: name, email: email, subject: subject, message: message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.project-item, .skill-item, .timeline-item, .education-item');

    animatedElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s steps(5, end), transform 0.4s steps(5, end)';
    });

    function checkIfInView() {
        animatedElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight - 90) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }

    checkIfInView();
    window.addEventListener('scroll', checkIfInView);

    if (!prefersReducedMotion) {
        startLiveEffects();
    }

    function startLiveEffects() {
        let flickerFrames = 0;

        setInterval(function () {
            body.classList.add('palette-shift');
            setTimeout(function () {
                body.classList.remove('palette-shift');
            }, 220);
        }, 9000);

        function flickerTick() {
            flickerFrames += 1;
            if (flickerFrames % 2 === 0) {
                body.classList.add('crt-flicker');
                setTimeout(function () {
                    body.classList.remove('crt-flicker');
                }, 90);
            }
            const nextTick = 1600 + Math.random() * 2600;
            setTimeout(flickerTick, nextTick);
        }

        flickerTick();

        const hero = document.querySelector('.hero');

        window.addEventListener('mousemove', function (event) {
            if (!hero) return;
            const x = (event.clientX / window.innerWidth - 0.5) * 24;
            const y = (event.clientY / window.innerHeight - 0.5) * 20;
            hero.style.setProperty('--parallax-x', x.toFixed(2) + 'px');
            hero.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
        });

        window.addEventListener('scroll', function () {
            if (!hero) return;
            const depthY = Math.min(window.scrollY * 0.06, 24);
            hero.style.setProperty('--parallax-y', depthY.toFixed(2) + 'px');
        });
    }
});
