// ==========================================================================
// TEDDY'S SPACE // PERSONAL PORTFOLIO SCRIPT
// Features: Three.js Particles, Music Visualizer, Custom Cursor,
// Project Category Filtering, Random Project Selector,
// Multi-Theme Switcher, TeddyOS Terminal
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');

            // Animate hamburger to X
            const bars = menuToggle.querySelectorAll('.bar');
            if (bars.length >= 3) {
                if (navLinks.classList.contains('active')) {
                    bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('is-active');
                const bars = menuToggle.querySelectorAll('.bar');
                if (bars.length >= 3) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });
        });
    }

    // --- 3. Scroll Reveal Logic ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Initial check

    // --- 4. Three.js Background Initialization ---
    const initThree = () => {
        const canvas = document.querySelector('#bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles spanning the full canvas dynamically across all aspect ratios
        const particlesCount = 2200;
        const positions = new Float32Array(particlesCount * 3);
        const particleGeometry = new THREE.BufferGeometry();

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 16;     // x spread covers wide screens
            positions[i + 1] = (Math.random() - 0.5) * 16; // y spread
            positions[i + 2] = (Math.random() - 0.5) * 12; // z depth
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#38bdf8',
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
        });

        const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleMesh);

        camera.position.z = 3;

        // Mouse Interaction for Background
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        const animate = () => {
            requestAnimationFrame(animate);

            // Subtle rotation
            particleMesh.rotation.y += 0.0008;
            particleMesh.rotation.x += 0.0004;

            // Mouse reaction: camera shifts based on mouse pos
            camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 0.45 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        // Dynamically adjust whole canvas on resize or orientation change
        const handleCanvasResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('orientationchange', handleCanvasResize);

        animate();
    };

    initThree();

    // --- 5. Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);

    if (cursorDot && cursorOutline) {
        if (isTouchDevice) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        } else {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // Dot follows immediately
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // Outline follows with smooth damping
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 380, fill: "forwards" });
            }, { passive: true });

            // Cursor Hover Effects
            const attachCursorHover = () => {
                const interactiveElements = document.querySelectorAll(
                    'a, button, .project-card, .creator-card, .menu-toggle, .btn-achievements-nav, .btn-achievements-hero, .btn-drive-launch, .filter-btn, .btn-project-link, .stat-box, .contribution-card, .milestone-box'
                );
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        document.body.classList.add('cursor-active');
                    });
                    el.addEventListener('mouseleave', () => {
                        document.body.classList.remove('cursor-active');
                    });
                });
            };

            attachCursorHover();
        }
    }

    // --- 6. Hero Visual Blob Parallax ---
    const blob = document.querySelector('.blob');
    if (blob) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            blob.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        }, { passive: true });
    }

    // --- 7. Music Toggle & Wave Logic (Web Audio API Sync with CSS Fallback) ---
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) bgMusic.volume = 0.5;
    const musicToggle = document.getElementById('music-toggle');
    const musicWaves = document.getElementById('music-waves');
    const waveBars = musicWaves ? musicWaves.querySelectorAll('span') : [];

    let isMusicPlaying = false;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let animationFrameId = null;
    let useWebAudio = false;

    function initAudioContext() {
        if (audioContext) return true;

        if (window.location.protocol === 'file:') {
            useWebAudio = false;
            return false;
        }

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return false;
            audioContext = new AudioCtx();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.9;
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            const source = audioContext.createMediaElementSource(bgMusic);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            useWebAudio = true;
            return true;
        } catch (e) {
            useWebAudio = false;
            return false;
        }
    }

    function animateWaves() {
        if (!isMusicPlaying) return;

        if (useWebAudio && analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray);

            const bassStart = 0;
            const bassEnd = Math.floor(analyser.frequencyBinCount * 0.15);
            let bassSum = 0;
            for (let i = bassStart; i < bassEnd; i++) {
                bassSum += dataArray[i];
            }
            const bassAvg = bassSum / Math.max(1, (bassEnd - bassStart));
            const normalizedBass = bassAvg / 255;

            const midStart = bassEnd;
            const midEnd = Math.floor(analyser.frequencyBinCount * 0.4);
            let midSum = 0;
            for (let i = midStart; i < midEnd; i++) {
                midSum += dataArray[i];
            }
            const midAvg = midSum / Math.max(1, (midEnd - midStart));
            const normalizedMid = midAvg / 255;

            const heights = [
                normalizedBass,
                normalizedMid,
                normalizedBass * 0.8,
                normalizedMid * 0.6
            ];

            waveBars.forEach((bar, i) => {
                const h = heights[i] || 0;
                const minH = 5;
                const maxH = 22;
                bar.style.height = `${minH + h * (maxH - minH)}px`;
            });
        }

        animationFrameId = requestAnimationFrame(animateWaves);
    }

    if (musicToggle && bgMusic && musicWaves) {
        musicToggle.addEventListener('click', async () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicWaves.classList.remove('playing');
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                if (audioContext && audioContext.state !== 'closed') {
                    audioContext.suspend();
                }
            } else {
                if (!audioContext) initAudioContext();
                if (audioContext && audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                try {
                    await bgMusic.play();
                    musicWaves.classList.add('playing');
                    animateWaves();
                } catch (err) {
                    console.warn("Audio playback failed:", err);
                }
            }
            isMusicPlaying = !isMusicPlaying;
        });

        bgMusic.addEventListener('ended', () => {
            isMusicPlaying = false;
            musicWaves.classList.remove('playing');
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        });

        bgMusic.addEventListener('error', () => {
            useWebAudio = false;
        });
    }

    // --- 8. Featured Projects Category Filtering & Mobile View Optimization ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');
    const toggleProjectsBtn = document.getElementById('toggle-more-projects-btn');
    const mobileProjectsActionBar = document.getElementById('mobile-projects-action-bar');
    
    let isProjectsExpanded = false;
    let activeFilter = 'all';

    function updateProjectVisibility() {
        const isMobile = window.innerWidth <= 768;
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const matchesFilter = (activeFilter === 'all' || category.includes(activeFilter));

            if (!matchesFilter) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
                card.style.display = 'none';
            } else {
                visibleCount++;
                if (isMobile && activeFilter === 'all' && !isProjectsExpanded && visibleCount > 3) {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                } else {
                    card.style.display = 'grid';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 30);
                }
            }
        });

        // Update mobile action bar / toggle button
        if (mobileProjectsActionBar && toggleProjectsBtn) {
            if (isMobile && activeFilter === 'all') {
                mobileProjectsActionBar.style.display = 'flex';
                const toggleText = toggleProjectsBtn.querySelector('.btn-toggle-text');
                const toggleIcon = toggleProjectsBtn.querySelector('.toggle-icon');
                if (isProjectsExpanded) {
                    if (toggleText) toggleText.textContent = 'Close Projects Dropdown';
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-down');
                        toggleIcon.classList.add('fa-chevron-up');
                    }
                    toggleProjectsBtn.setAttribute('aria-expanded', 'true');
                } else {
                    if (toggleText) toggleText.textContent = 'More Projects Dropdown (6 More)';
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-up');
                        toggleIcon.classList.add('fa-chevron-down');
                    }
                    toggleProjectsBtn.setAttribute('aria-expanded', 'false');
                }
            } else {
                mobileProjectsActionBar.style.display = 'none';
            }
        }
    }

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.getAttribute('data-filter') || 'all';
                updateProjectVisibility();
            });
        });
    }

    if (toggleProjectsBtn) {
        toggleProjectsBtn.addEventListener('click', () => {
            isProjectsExpanded = !isProjectsExpanded;
            updateProjectVisibility();
            if (!isProjectsExpanded) {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    const topPos = projectsSection.getBoundingClientRect().top + window.pageYOffset - 70;
                    window.scrollTo({ top: topPos, behavior: 'smooth' });
                }
            }
        });
    }

    window.addEventListener('resize', () => {
        updateProjectVisibility();
    });

    updateProjectVisibility();

    // --- 9. Random Project Selector ---
    const projectRepos = [
        "https://github.com/IamGeniusORG/TripGenius",
        "https://github.com/IamGeniusORG/Vernacular-AI",
        "https://github.com/IamGeniusORG/Snaptube-Clone",
        "https://github.com/IamGeniusORG/CodeAlpha_RestaurantManagement",
        "https://github.com/IamGeniusORG/CodeAlpha_EventRegistration",
        "https://github.com/IamGeniusORG/CodeAlpha_UrlShortener",
        "https://github.com/IamGeniusORG/BACKGROUND-REMOVER",
        "https://github.com/IamGeniusORG/Fanmade-windows-12",
        "https://github.com/IamGeniusORG/Canvas-Based-Decentralized-Gossip-Protocol-Visualizer",
        "https://github.com/IamGeniusORG/Quorum-Locked-Timelocked-Access-Vault",
        "https://github.com/IamGeniusORG/Semantic-Search-for-Local-Notes",
        "https://github.com/IamGeniusORG/Stack-Based-Micro-Virtual-Machine",
        "https://github.com/IamGeniusORG/Vector-Based-Local-Log-Anomaly-Predictor",
        "https://github.com/IamGeniusORG/AgriBridge",
        "https://github.com/IamGeniusORG/BEN-10-UNIVERSE",
        "https://github.com/IamGeniusORG/Blog-Generator",
        "https://github.com/IamGeniusORG/COPY-BIRD-WEB-BASED-GAME",
        "https://github.com/IamGeniusORG/focus-ghost-extension",
        "https://github.com/IamGeniusORG/VibeForge",
        "https://github.com/IamGeniusORG/Weather-Application"
    ];

    const randomLinks = document.querySelectorAll('.random-project-link');
    randomLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const randomIndex = Math.floor(Math.random() * projectRepos.length);
            const randomRepo = projectRepos[randomIndex];
            window.open(randomRepo, '_blank');
        });
    });

    // --- 10. Scroll-Linked Background Glow Movement ---
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;
            const scrollPerc = window.scrollY / scrollHeight;
            const moveX = (scrollPerc * -100);
            const moveY = Math.sin(scrollPerc * Math.PI) * 15;
            heroVisual.style.transform = `translate(${moveX}vw, calc(-50% + ${moveY}vh))`;
        }, { passive: true });
    }

    // --- 11. Multi-Theme Switcher ---
    const themeSwitchBtn = document.getElementById('theme-switch');
    if (themeSwitchBtn) {
        const themes = ['theme-default', 'theme-cyberpunk', 'theme-deepsea', 'theme-lava'];
        let currentThemeIndex = 0;

        themeSwitchBtn.addEventListener('click', () => {
            document.body.classList.remove(themes[currentThemeIndex]);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;

            if (themes[currentThemeIndex] !== 'theme-default') {
                document.body.classList.add(themes[currentThemeIndex]);
            }
        });
    }

    // --- 12. TeddyOS Terminal Easter Egg ('sudo' keyboard sequence) ---
    let keyBuffer = '';
    const secretCode = 'sudo';
    const terminalEgg = document.getElementById('easter-egg-terminal');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (terminalEgg && terminalInput && terminalOutput) {
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.id !== 'terminal-input') return;

            keyBuffer += e.key.toLowerCase();
            if (keyBuffer.length > secretCode.length) {
                keyBuffer = keyBuffer.slice(-secretCode.length);
            }

            if (keyBuffer === secretCode && terminalEgg.classList.contains('hidden')) {
                terminalEgg.classList.remove('hidden');
                terminalInput.focus();
                keyBuffer = '';
            }
        });

        if (closeTerminal) {
            closeTerminal.addEventListener('click', () => {
                terminalEgg.classList.add('hidden');
            });
        }

        const driveUrl = "https://drive.google.com/drive/u/2/folders/1WCBFacdoeScxKV_LrQQ5cZ3-Mho308Ll";

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                let response = '';

                switch (command) {
                    case 'help':
                        response = 'Available commands: help, whoami, skills, achievements, projects, resume, matrix, clear';
                        break;
                    case 'whoami':
                        response = 'Tanmay Dey (Teddy) - B.Tech CSE (AIML) at Brainware University (CGPA 8.4/10) & Oracle Certified Agentic AI Foundations Associate.';
                        break;
                    case 'skills':
                        response = 'Core Stack: Python, LangGraph, TensorFlow, TypeScript, Next.js, Go, PostgreSQL, Supabase, Docker, FFmpeg.';
                        break;
                    case 'achievements':
                    case 'certs':
                    case 'drive':
                        response = 'Opening Google Drive Certificates & Achievements archive (14+ verified credentials)...';
                        window.open(driveUrl, '_blank');
                        break;
                    case 'projects':
                        response = '30+ Production Repositories: TripGenius (Live), Vernacular AI (PWA), Snaptube-Clone, CodeAlpha Restaurant Management, ZipLink, EventMaster, and more.';
                        break;
                    case 'resume':
                        response = 'Initiating download of Tanmay_Dey_Resume_2026.pdf...';
                        const dlLink = document.createElement('a');
                        dlLink.href = 'Tanmay_Dey_Resume_2026.pdf';
                        dlLink.download = 'Tanmay_Dey_Resume_2026.pdf';
                        document.body.appendChild(dlLink);
                        dlLink.click();
                        document.body.removeChild(dlLink);
                        break;
                    case 'matrix':
                        document.body.classList.add('theme-cyberpunk');
                        response = 'Wake up, Neo... Cyberpunk protocol initialized.';
                        break;
                    case 'clear':
                        terminalOutput.innerHTML = '';
                        terminalInput.value = '';
                        return;
                    case '':
                        break;
                    default:
                        response = `Command not recognized: '${command}'. Type 'help' for available commands.`;
                }

                if (command !== '') {
                    terminalOutput.innerHTML += `<div><span class="prompt">teddy@aiml:~$</span> ${command}</div>`;
                    if (response) {
                        terminalOutput.innerHTML += `<div style="color: var(--secondary-accent);">${response}</div>`;
                    }
                }

                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }

});
