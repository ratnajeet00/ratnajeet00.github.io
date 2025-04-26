// Main JavaScript for personal website

document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle mobile menu styling
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = 'var(--darker-bg)';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
            } else {
                navMenu.style.display = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#navbar ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navMenu.style.display = 'none';
            }
            
            // Update page title for better SEO when navigating sections
            const sectionId = link.getAttribute('href').substring(1);
            updatePageTitleForSection(sectionId);
        });
    });
    
    // SEO: Update page title based on current section
    function updatePageTitleForSection(sectionId) {
        const yourName = document.querySelector('header h1')?.textContent || 'Portfolio';
        let pageTitle = yourName;
        
        // Create descriptive titles based on section
        switch(sectionId) {
            case 'about':
                pageTitle = `About ${yourName} - Personal Portfolio`;
                break;
            case 'projects':
                pageTitle = `Projects by ${yourName} - Portfolio & Work Samples`;
                break;
            case 'skills':
                pageTitle = `Skills & Expertise - ${yourName}'s Professional Portfolio`;
                break;
            case 'experience':
                pageTitle = `Professional Experience - ${yourName}'s Career Timeline`;
                break;
            case 'contact':
                pageTitle = `Contact ${yourName} - Get In Touch`;
                break;
            default:
                pageTitle = `${yourName} - Personal Portfolio Website`;
        }
        
        // Update the page title
        document.title = pageTitle;
        
        // Also update canonical URL with hash for better indexing
        updateCanonicalUrl(sectionId);
    }
    
    // SEO: Update canonical URL based on current section
    function updateCanonicalUrl(sectionId) {
        // Get the base URL of the current page
        const baseUrl = window.location.href.split('#')[0];
        const newUrl = sectionId ? `${baseUrl}#${sectionId}` : baseUrl;
        
        // Update or create canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = newUrl;
        
        // Update browser URL without reload
        if (history.pushState && sectionId) {
            history.pushState(null, null, `#${sectionId}`);
        }
    }
    
    // SEO: Insert structured data for better search indexing
    function insertStructuredData() {
        const yourName = document.querySelector('header h1')?.textContent || '';
        const yourTitle = document.querySelector('header h2')?.textContent || '';
        const yourBio = document.querySelector('#about p')?.textContent || '';
        const yourImage = document.querySelector('#about img')?.src || '';
        
        // Create structured data for Person
        const personData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": yourName,
            "jobTitle": yourTitle,
            "description": yourBio,
            "image": yourImage,
            "url": window.location.href,
            "sameAs": [
                // Add your social profile URLs here
                // "https://linkedin.com/in/yourprofile",
                // "https://github.com/yourusername",
                // "https://twitter.com/yourusername"
            ]
        };
        
        // Insert the structured data into the page
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(personData);
        document.head.appendChild(scriptTag);
    }
    
    // SEO: Call structured data insertion once DOM is loaded
    insertStructuredData();
    
    // SEO: Update initial page title based on URL hash or default to homepage
    const initialSection = window.location.hash ? window.location.hash.substring(1) : '';
    updatePageTitleForSection(initialSection);
    
    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('current');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('current');
            }
        });
    });
    
    // Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filterValue = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
                
                // Add animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 200);
            });
        });
    });
    
    // Theme toggle (between dark mode and light mode)
    const themeToggle = document.querySelector('.theme-switch');
    const rootElement = document.documentElement;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.body.classList.toggle('light-mode', savedTheme === 'light');
        updateThemeIcon(savedTheme === 'light');
    } else {
        // Check if user prefers light mode
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            document.body.classList.add('light-mode');
            updateThemeIcon(true);
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            const isLightMode = document.body.classList.contains('light-mode');
            
            // Save theme preference
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            
            // Update icon and colors
            updateThemeIcon(isLightMode);
        });
    }
    
    function updateThemeIcon(isLightMode) {
        const themeToggle = document.querySelector('.theme-switch');
        if (!themeToggle) return;
        
        themeToggle.innerHTML = isLightMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // No need to manually set CSS variables as we're using class-based approach
    }
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message (you would implement this)
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Animation on scroll (basic implementation)
    const animatedElements = document.querySelectorAll('.project-item, .skill-item, .timeline-item, .education-item');
    
    // Initial setting
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    function checkIfInView() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is in viewport
            if (rect.top <= window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Check on load
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
});
