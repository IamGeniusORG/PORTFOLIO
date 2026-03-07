// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('is-active');
    
    // Animate hamburger to X
    const bars = document.querySelectorAll('.bar');
    if(navLinks.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Scroll Reveal Logic
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < triggerBottom) {
            el.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Initial check

// Three.js Background Initialization
const initThree = () => {
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);
    const particleGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#38bdf8',
        transparent: true,
        opacity: 0.5,
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
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Subtle rotation
        particleMesh.rotation.y += 0.001;
        particleMesh.rotation.x += 0.0005;

        // Mouse reaction: camera shifts based on mouse pos
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
};

initThree();

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with a slight delay for smooth "tail" effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor Hover Effects
const interactiveElements = document.querySelectorAll('a, button, .project-card, .menu-toggle');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
    });
});

// Subtle Parallax effect for the hero blob
document.addEventListener('mousemove', (e) => {
    const blob = document.querySelector('.blob');
    if(!blob) return;
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    blob.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
});

// --- Music Toggle & Wave Logic ---
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicWaves = document.getElementById('music-waves');

let isMusicPlaying = false;

if (musicToggle && bgMusic && musicWaves) {
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicWaves.classList.remove('playing');
        } else {
            bgMusic.play().catch(err => {
                console.warn("Audio playback was prevented. Interactions might be required first.", err);
            });
            musicWaves.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

// --- Random Project Selector ---
const projectRepos = [
    "https://github.com/IamGeniusORG/E-COMMERCE-STORE-JUST-FOR-THE-NAME",
    "https://github.com/IamGeniusORG/E-COMMERCE-ORIGINAL",
    "https://github.com/IamGeniusORG/BEN-10-UNIVERSE",
    "https://github.com/IamGeniusORG/COPY-BIRD-WEB-BASED-GAME",
    "https://github.com/IamGeniusORG/IamGeniusORG"
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

// --- Scroll-Linked Background Glow Movement ---
window.addEventListener('scroll', () => {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    
    // Calculate scroll percentage (0 to 1)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPerc = window.scrollY / scrollHeight;
    
    // Move across the screen based on scroll
    // Starts at right (-5vw), moves left across the screen
    const moveX = (scrollPerc * -100); 
    
    // Add a slight vertical curve
    const moveY = Math.sin(scrollPerc * Math.PI) * 15;
    
    heroVisual.style.transform = `translate(${moveX}vw, calc(-50% + ${moveY}vh))`;
});

// --- Preloader Logic ---
const preloader = document.getElementById('preloader');
const loaderText = document.getElementById('loader-text');
const bootSequence = [
    "Initializing TeddyOS core...",
    "Loading AI modules...",
    "Mounting PostgreSQL databases...",
    "Establishing neural connections...",
    "Boot sequence complete. Welcome."
];

let bootIndex = 0;
let charIndex = 0;

function typeBootSequence() {
    if (bootIndex < bootSequence.length) {
        if (charIndex < bootSequence[bootIndex].length) {
            loaderText.innerHTML += bootSequence[bootIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeBootSequence, 20); // Typing speed
        } else {
            loaderText.innerHTML += "<br>";
            bootIndex++;
            charIndex = 0;
            setTimeout(typeBootSequence, 200); // Pause between lines
        }
    } else {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger hero animations explicitly after load
                document.querySelectorAll('.reveal-text').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }, 500);
        }, 500);
    }
}

// Pause hero animations until preloader finishes
document.querySelectorAll('.reveal-text').forEach(el => {
    el.style.animationPlayState = 'paused';
});

window.addEventListener('load', () => {
    setTimeout(typeBootSequence, 500);
});

// --- Theme Switcher (Multi-Theme Cycle) ---
const themeSwitchBtn = document.getElementById('theme-switch');
const themes = ['theme-default', 'theme-cyberpunk', 'theme-deepsea', 'theme-lava'];
let currentThemeIndex = 0;

themeSwitchBtn.addEventListener('click', () => {
    // Remove current theme class
    document.body.classList.remove(themes[currentThemeIndex]);
    
    // Increment index
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    
    // Add new theme class (except for default which is the base style)
    if (themes[currentThemeIndex] !== 'theme-default') {
        document.body.classList.add(themes[currentThemeIndex]);
    }
    
    // Save preference (optional enhancement)
    console.log(`Theme switched to: ${themes[currentThemeIndex]}`);
});

// --- Timeline Scroll Logic ---
const timelineSection = document.querySelector('.journey-section');
const timelineProgress = document.getElementById('timeline-progress');
const timelineItems = document.querySelectorAll('.timeline-item');

window.addEventListener('scroll', () => {
    if(!timelineSection) return;
    
    const sectionTop = timelineSection.getBoundingClientRect().top;
    const sectionHeight = timelineSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate scroll percentage within the timeline section
    if (sectionTop < windowHeight * 0.8 && sectionTop > -sectionHeight) {
        let scrollPerc = (windowHeight * 0.8 - sectionTop) / sectionHeight * 100;
        scrollPerc = Math.max(0, Math.min(100, scrollPerc)); // Clamp between 0 and 100
        
        timelineProgress.style.height = `${scrollPerc}%`;
        
        // Highlight dots
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            if(itemTop < windowHeight * 0.8) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
});

// --- Terminal Easter Egg ---
let keyBuffer = '';
const secretCode = 'sudo';
const terminalEgg = document.getElementById('easter-egg-terminal');
const closeTerminal = document.getElementById('close-terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

window.addEventListener('keydown', (e) => {
    // Ignore if typing in an input (except the terminal input)
    if(e.target.tagName === 'INPUT' && e.target.id !== 'terminal-input') return;
    
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

closeTerminal.addEventListener('click', () => {
    terminalEgg.classList.add('hidden');
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        let response = '';
        
        switch(command) {
            case 'help':
                response = 'Available commands: help, clear, whoami, skills, matrix';
                break;
            case 'whoami':
                response = 'Tanmay Dey (Teddy) - B.Tech CSE (AIML) Student & Developer.';
                break;
            case 'skills':
                response = 'Python, PostgreSQL, TensorFlow, React, Three.js, COA concepts.';
                break;
            case 'matrix':
                document.body.classList.add('theme-cyberpunk');
                response = 'Wake up, Neo... Theme changed.';
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                terminalInput.value = '';
                return;
            case '':
                break;
            default:
                response = `Command not found: ${command}`;
        }
        
        if (command !== '') {
            terminalOutput.innerHTML += `<div><span class="prompt">teddy@aiml:~$</span> ${command}</div>`;
            if (response) {
                terminalOutput.innerHTML += `<div style="color: var(--secondary-accent)">${response}</div>`;
            }
        }
        
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
