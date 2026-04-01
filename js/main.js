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

    // Game layer: XP, quests, and progression feedback.
    const gameApi = initGameMode();

    // Room traversal layer: move between sections like game zones.
    initRoomTravelMode(gameApi);

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

    function initGameMode() {
        body.classList.add('combo-live');

        const state = {
            xp: Number(localStorage.getItem('gameXP') || 0),
            level: Number(localStorage.getItem('gameLevel') || 1),
            streak: 0,
            completed: new Set(JSON.parse(localStorage.getItem('gameCompletedQuests') || '[]'))
        };

        const questTargets = [
            { id: 'about', label: 'Meet The Hero' },
            { id: 'experience', label: 'Unlock Work Arc' },
            { id: 'research', label: 'Research Dungeon' },
            { id: 'skills', label: 'Skill Tree Opened' },
            { id: 'projects', label: 'Project Boss Room' }
        ];

        const hud = document.createElement('aside');
        hud.className = 'game-hud';
        hud.innerHTML = '' +
            '<div class="hud-row"><span class="hud-label">LEVEL</span><span class="hud-value" id="hud-level">1</span></div>' +
            '<div class="hud-row"><span class="hud-label">COMBO</span><span class="hud-value" id="hud-combo">x0</span></div>' +
            '<div class="xp-track"><div class="xp-fill" id="hud-xp-fill"></div></div>' +
            '<div class="xp-caption" id="hud-xp-caption">0 / 100 XP</div>';

        const questBoard = document.createElement('aside');
        questBoard.className = 'quest-board';
        questBoard.innerHTML = '<div class="quest-title">ACTIVE QUESTS</div><ul class="quest-list" id="quest-list"></ul>';

        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.id = 'game-toast';

        document.body.appendChild(hud);
        document.body.appendChild(questBoard);
        document.body.appendChild(toast);

        const questList = document.getElementById('quest-list');
        const levelEl = document.getElementById('hud-level');
        const comboEl = document.getElementById('hud-combo');
        const xpFillEl = document.getElementById('hud-xp-fill');
        const xpCaptionEl = document.getElementById('hud-xp-caption');

        questTargets.forEach(function (quest) {
            const item = document.createElement('li');
            item.dataset.quest = quest.id;
            if (state.completed.has(quest.id)) {
                item.classList.add('completed');
            }
            item.innerHTML = '<span>' + quest.label + '</span><span class="quest-dot"></span>';
            questList.appendChild(item);
        });

        function getXpForNextLevel(level) {
            return level * 100;
        }

        function persistState() {
            localStorage.setItem('gameXP', String(state.xp));
            localStorage.setItem('gameLevel', String(state.level));
            localStorage.setItem('gameCompletedQuests', JSON.stringify(Array.from(state.completed)));
        }

        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(function () {
                toast.classList.remove('show');
            }, 1300);
        }

        function spawnXpFloat(amount) {
            const floatEl = document.createElement('div');
            floatEl.className = 'game-float';
            floatEl.textContent = '+' + amount + ' XP';
            floatEl.style.left = Math.max(16, Math.min(window.innerWidth - 120, window.innerWidth * 0.5 + (Math.random() * 240 - 120))) + 'px';
            floatEl.style.top = Math.max(16, Math.min(window.innerHeight - 60, window.innerHeight * 0.72 + (Math.random() * 60 - 30))) + 'px';
            document.body.appendChild(floatEl);
            setTimeout(function () {
                floatEl.remove();
            }, 900);
        }

        function refreshHud() {
            const requiredXp = getXpForNextLevel(state.level);
            const progressPercent = Math.min(100, (state.xp / requiredXp) * 100);
            levelEl.textContent = String(state.level);
            comboEl.textContent = 'x' + String(state.streak);
            xpFillEl.style.width = progressPercent.toFixed(2) + '%';
            xpCaptionEl.textContent = String(state.xp) + ' / ' + String(requiredXp) + ' XP';
        }

        function addXp(amount, reason) {
            state.xp += amount;
            state.streak += 1;

            let requiredXp = getXpForNextLevel(state.level);
            while (state.xp >= requiredXp) {
                state.xp -= requiredXp;
                state.level += 1;
                requiredXp = getXpForNextLevel(state.level);
                showToast('LEVEL UP! Lv.' + state.level);
            }

            if (reason) {
                showToast(reason + ' +' + amount + ' XP');
            }

            spawnXpFloat(amount);
            refreshHud();
            persistState();

            clearTimeout(initGameMode.comboResetTimer);
            initGameMode.comboResetTimer = setTimeout(function () {
                state.streak = 0;
                refreshHud();
            }, 3200);
        }

        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const sectionId = entry.target.id;
                if (!sectionId || state.completed.has(sectionId)) return;

                const questItem = questList.querySelector('[data-quest="' + sectionId + '"]');
                if (questItem) {
                    questItem.classList.add('completed');
                    state.completed.add(sectionId);
                    addXp(50, 'Quest Complete');
                }
            });
        }, { threshold: 0.45 });

        questTargets.forEach(function (quest) {
            const section = document.getElementById(quest.id);
            if (section) {
                sectionObserver.observe(section);
            }
        });

        document.querySelectorAll('.btn, .filter-btn, .project-item, .skill-item, .education-item, .social-icons a, .social-links a').forEach(function (node) {
            node.addEventListener('click', function () {
                addXp(8, 'Action');
            });
        });

        refreshHud();

        return {
            addXp: addXp,
            showToast: showToast
        };
    }

    function initRoomTravelMode(gameApiRef) {
        if (prefersReducedMotion) return;

        const levelSections = Array.from(document.querySelectorAll('main > section[id]'));
        if (levelSections.length < 2) return;

        body.classList.add('room-travel-mode');

        const overlay = document.createElement('div');
        overlay.className = 'level-transition-overlay';
        overlay.innerHTML = '<div class="level-transition-text" id="level-transition-text"></div>';
        document.body.appendChild(overlay);

        const transitionText = document.getElementById('level-transition-text');

        const roomGuide = document.createElement('div');
        roomGuide.className = 'room-guide';
        roomGuide.textContent = 'Explore this room: scroll inside to discover all content';
        document.body.appendChild(roomGuide);

        const playerLane = document.createElement('div');
        playerLane.className = 'player-lane';
        playerLane.innerHTML = '' +
            '<div class="player-avatar" id="player-avatar">' +
            '<div class="avatar-shadow"></div>' +
            '<div class="avatar-head"></div>' +
            '<div class="avatar-body"></div>' +
            '<div class="avatar-leg left"></div>' +
            '<div class="avatar-leg right"></div>' +
            '</div>';
        document.body.appendChild(playerLane);

        const playerAvatar = document.getElementById('player-avatar');

        const zoneMap = document.createElement('aside');
        zoneMap.className = 'zone-map';
        zoneMap.innerHTML = '<div class="zone-map-title">ZONE MAP</div><div class="zone-track" id="zone-track"></div>';
        document.body.appendChild(zoneMap);

        const zoneTrack = document.getElementById('zone-track');
        const zoneNodes = [];
        levelSections.forEach(function () {
            const node = document.createElement('div');
            node.className = 'zone-node';
            zoneTrack.appendChild(node);
            zoneNodes.push(node);
        });

        const encounterPanel = document.createElement('div');
        encounterPanel.className = 'encounter-panel';
        encounterPanel.innerHTML = '' +
            '<div class="encounter-title">ENCOUNTER</div>' +
            '<div class="encounter-sub" id="encounter-sub">A wild BUG BOSS appears.</div>' +
            '<div class="enemy-hp-track"><div class="enemy-hp-fill" id="enemy-hp-fill"></div></div>' +
            '<div class="encounter-actions">' +
            '<button class="btn boss-btn" id="attack-btn">Attack [F]</button>' +
            '<button class="btn secondary-btn" id="skip-btn">Escape</button>' +
            '</div>';
        document.body.appendChild(encounterPanel);

        const enemyHpFill = document.getElementById('enemy-hp-fill');
        const encounterSub = document.getElementById('encounter-sub');
        const attackBtn = document.getElementById('attack-btn');
        const skipBtn = document.getElementById('skip-btn');

        const startScreen = document.createElement('div');
        startScreen.className = 'game-start-screen';
        startScreen.innerHTML = '' +
            '<div class="start-card">' +
            '<div class="start-title">PORTFOLIO QUEST MODE</div>' +
            '<div class="start-sub">Travel zones, complete quests, defeat encounters.</div>' +
            '<div class="start-actions">' +
            '<button class="btn primary-btn" id="start-game-btn">Start Game</button>' +
            '<button class="btn secondary-btn" id="skip-game-btn">Free Roam</button>' +
            '</div>' +
            '</div>';
        document.body.appendChild(startScreen);

        const startGameBtn = document.getElementById('start-game-btn');
        const skipGameBtn = document.getElementById('skip-game-btn');

        let currentIndex = getClosestSectionIndex();
        let transitionLock = false;
        let lastWheelTime = 0;
        let touchStartY = null;
        let travelEnabled = false;
        let encounterActive = false;
        let enemyHp = 100;

        function getClosestSectionIndex() {
            let closest = 0;
            let smallestDistance = Number.POSITIVE_INFINITY;

            levelSections.forEach(function (section, index) {
                const distance = Math.abs(window.scrollY - section.offsetTop);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = index;
                }
            });

            return closest;
        }

        function getZoneTitle(section, index) {
            const heading = section.querySelector('.section-header h2');
            const baseName = heading ? heading.textContent.trim() : section.id;
            const zoneNumber = String(index + 1).padStart(2, '0');
            return 'Zone ' + zoneNumber + ' // ' + baseName;
        }

        function getCurrentRoomContainer() {
            const section = levelSections[currentIndex];
            if (!section) return null;
            return section.querySelector('.container');
        }

        function scrollInsideRoom(direction, amount) {
            const container = getCurrentRoomContainer();
            if (!container) return false;

            const maxScrollTop = container.scrollHeight - container.clientHeight;
            if (maxScrollTop <= 0) return false;

            const step = Math.max(70, Math.min(220, amount));
            const previous = container.scrollTop;
            container.scrollTop = Math.max(0, Math.min(maxScrollTop, previous + direction * step));

            return Math.abs(container.scrollTop - previous) > 1;
        }

        function updateRoomGuide() {
            const container = getCurrentRoomContainer();
            if (!container) {
                roomGuide.textContent = 'Move between zones with wheel, swipe, or W/S';
                return;
            }

            const maxScrollTop = container.scrollHeight - container.clientHeight;
            if (maxScrollTop <= 0) {
                roomGuide.textContent = 'Zone clear. Move to next zone';
                return;
            }

            if (container.scrollTop <= 4) {
                roomGuide.textContent = 'Explore down inside this room';
                return;
            }

            if (container.scrollTop >= maxScrollTop - 4) {
                roomGuide.textContent = 'Room explored. Move to next zone';
                return;
            }

            roomGuide.textContent = 'Exploring room...';
        }

        function updatePlayerPosition(isMoving) {
            const container = getCurrentRoomContainer();
            const zoneCount = Math.max(1, levelSections.length - 1);
            const zoneProgress = currentIndex / zoneCount;

            let roomProgress = 0;
            if (container && container.scrollHeight > container.clientHeight) {
                const roomMax = container.scrollHeight - container.clientHeight;
                roomProgress = Math.max(0, Math.min(1, container.scrollTop / roomMax));
            }

            // Zone progression controls major travel, room progression advances inside the zone.
            const totalProgress = Math.max(0, Math.min(1, (zoneProgress * 0.85) + (roomProgress * 0.15)));
            const laneWidth = Math.max(120, playerLane.clientWidth - 40);
            const x = Math.round(laneWidth * totalProgress);
            playerAvatar.style.transform = 'translateX(' + x + 'px)';

            if (isMoving) {
                playerAvatar.classList.add('walking');
                clearTimeout(updatePlayerPosition.walkStopTimer);
                updatePlayerPosition.walkStopTimer = setTimeout(function () {
                    playerAvatar.classList.remove('walking');
                }, 260);
            }
        }

        function syncLevelClasses() {
            levelSections.forEach(function (section, index) {
                section.classList.remove('level-before', 'level-after', 'level-active');

                if (index < currentIndex) {
                    section.classList.add('level-before');
                } else if (index > currentIndex) {
                    section.classList.add('level-after');
                } else {
                    section.classList.add('level-active');
                }
            });

            const activeSection = levelSections[currentIndex];
            if (activeSection) {
                body.setAttribute('data-zone', activeSection.id);
            }

            updateRoomGuide();
            updatePlayerPosition(false);

            zoneNodes.forEach(function (node, index) {
                node.classList.remove('active', 'cleared');
                if (index < currentIndex) {
                    node.classList.add('cleared');
                } else if (index === currentIndex) {
                    node.classList.add('active');
                }
            });
        }

        function startEncounter() {
            encounterActive = true;
            enemyHp = 100;
            encounterSub.textContent = 'A WILD BUG BOSS APPEARS IN THIS ZONE';
            enemyHpFill.style.width = '100%';
            encounterPanel.classList.add('active');
        }

        function endEncounter(won) {
            encounterActive = false;
            encounterPanel.classList.remove('active');
            if (won) {
                gameApiRef.addXp(70, 'Boss Defeated');
            }
        }

        function attackEncounter() {
            if (!encounterActive) return;
            const damage = 22 + Math.floor(Math.random() * 17);
            enemyHp = Math.max(0, enemyHp - damage);
            enemyHpFill.style.width = enemyHp + '%';
            encounterSub.textContent = 'HIT FOR ' + damage + ' DAMAGE';
            gameApiRef.addXp(10, 'Critical Hit');

            if (enemyHp <= 0) {
                encounterSub.textContent = 'BOSS DEFEATED';
                setTimeout(function () {
                    endEncounter(true);
                }, 360);
            }
        }

        attackBtn.addEventListener('click', attackEncounter);
        skipBtn.addEventListener('click', function () {
            if (!encounterActive) return;
            endEncounter(false);
            gameApiRef.showToast('Escaped Encounter');
        });

        function unlockTravel(startAsGame) {
            travelEnabled = true;
            startScreen.remove();
            if (startAsGame) {
                gameApiRef.addXp(25, 'Game Start');
                gameApiRef.showToast('Quest Mode Activated');
            } else {
                gameApiRef.showToast('Free Roam Activated');
            }
            syncLevelClasses();
            levelSections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        startGameBtn.addEventListener('click', function () {
            unlockTravel(true);
        });

        skipGameBtn.addEventListener('click', function () {
            unlockTravel(false);
        });

        function moveToLevel(nextIndex, trigger) {
            const clampedIndex = Math.max(0, Math.min(levelSections.length - 1, nextIndex));
            if (clampedIndex === currentIndex || transitionLock) return;

            transitionLock = true;
            currentIndex = clampedIndex;
            syncLevelClasses();

            transitionText.textContent = 'Entering ' + getZoneTitle(levelSections[currentIndex], currentIndex);
            overlay.classList.add('active');

            const targetContainer = levelSections[currentIndex].querySelector('.container');
            if (targetContainer) {
                targetContainer.scrollTop = 0;
            }

            levelSections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(function () {
                overlay.classList.remove('active');
            }, 420);

            setTimeout(function () {
                transitionLock = false;
            }, 700);

            if (!encounterActive && trigger !== 'init' && Math.random() < 0.45) {
                setTimeout(startEncounter, 240);
            }

            updatePlayerPosition(true);
        }

        syncLevelClasses();

        window.addEventListener('scroll', function () {
            if (!travelEnabled) return;
            if (transitionLock) return;
            const closest = getClosestSectionIndex();
            if (closest !== currentIndex) {
                currentIndex = closest;
                syncLevelClasses();
            }
        });

        window.addEventListener('wheel', function (event) {
            if (!body.classList.contains('room-travel-mode')) return;
            if (!travelEnabled) {
                event.preventDefault();
                return;
            }
            if (encounterActive) {
                event.preventDefault();
                return;
            }
            if (transitionLock) {
                event.preventDefault();
                return;
            }

            if (Math.abs(event.deltaY) < 16) return;

            const wheelDirection = event.deltaY > 0 ? 1 : -1;
            const consumedByRoom = scrollInsideRoom(wheelDirection, Math.abs(event.deltaY));
            if (consumedByRoom) {
                event.preventDefault();
                updateRoomGuide();
                updatePlayerPosition(true);
                return;
            }

            const now = Date.now();
            if (now - lastWheelTime < 250) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            lastWheelTime = now;

            moveToLevel(currentIndex + wheelDirection, 'wheel');
        }, { passive: false });

        document.addEventListener('keydown', function (event) {
            const tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
            if (tagName === 'input' || tagName === 'textarea') return;
            if (!body.classList.contains('room-travel-mode')) return;

            if (!travelEnabled && event.key.toLowerCase() === 'enter') {
                event.preventDefault();
                unlockTravel(true);
                return;
            }

            if (encounterActive && event.key.toLowerCase() === 'f') {
                event.preventDefault();
                attackEncounter();
                return;
            }

            if (!travelEnabled || encounterActive) return;

            const key = event.key.toLowerCase();
            if (key === 'arrowdown' || key === 's' || key === 'pagedown' || key === ' ') {
                event.preventDefault();
                if (scrollInsideRoom(1, 120)) {
                    updateRoomGuide();
                    updatePlayerPosition(true);
                    return;
                }
                moveToLevel(currentIndex + 1, 'keyboard');
            }

            if (key === 'arrowup' || key === 'w' || key === 'pageup') {
                event.preventDefault();
                if (scrollInsideRoom(-1, 120)) {
                    updateRoomGuide();
                    updatePlayerPosition(true);
                    return;
                }
                moveToLevel(currentIndex - 1, 'keyboard');
            }
        });

        window.addEventListener('touchstart', function (event) {
            if (!event.touches || event.touches.length === 0) return;
            touchStartY = event.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', function (event) {
            if (touchStartY === null || !event.changedTouches || event.changedTouches.length === 0) return;
            if (!body.classList.contains('room-travel-mode')) return;
            if (!travelEnabled || encounterActive) return;

            const endY = event.changedTouches[0].clientY;
            const deltaY = touchStartY - endY;
            touchStartY = null;

            if (Math.abs(deltaY) < 45) return;
            const swipeDirection = deltaY > 0 ? 1 : -1;
            if (scrollInsideRoom(swipeDirection, Math.abs(deltaY) * 1.4)) {
                updateRoomGuide();
                updatePlayerPosition(true);
                return;
            }
            moveToLevel(currentIndex + swipeDirection, 'swipe');
        }, { passive: true });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                const href = link.getAttribute('href') || '';
                if (!href.startsWith('#')) return;

                const zoneId = href.substring(1);
                const targetIndex = levelSections.findIndex(function (section) {
                    return section.id === zoneId;
                });

                if (targetIndex === -1) return;

                if (!travelEnabled) {
                    event.preventDefault();
                    unlockTravel(true);
                }

                if (encounterActive) {
                    event.preventDefault();
                    gameApiRef.showToast('Defeat encounter first');
                    return;
                }

                event.preventDefault();
                moveToLevel(targetIndex, 'nav');
            });
        });

        levelSections.forEach(function (section) {
            const container = section.querySelector('.container');
            if (!container) return;

            container.addEventListener('scroll', function () {
                if (levelSections[currentIndex] === section) {
                    updateRoomGuide();
                    updatePlayerPosition(true);
                }
            }, { passive: true });
        });

        updateRoomGuide();
        updatePlayerPosition(false);
    }
});
