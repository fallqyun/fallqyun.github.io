// Matrix Rain Effect
function createMatrixRain() {
    const matrixContainer = document.getElementById('matrixRain');
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDelay = Math.random() * 10 + 's';
        column.style.animationDuration = (Math.random() * 10 + 5) + 's';
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
        }
        column.innerHTML = text;
        matrixContainer.appendChild(column);
    }
}



// Robot eye tracking
let mouseX = 0;
let mouseY = 0;
let leftPupil, rightPupil, robotContainer;

document.addEventListener('DOMContentLoaded', () => {
    createMatrixRain();
    // Initialize robot eye tracking
    leftPupil = document.getElementById('leftPupil');
    rightPupil = document.getElementById('rightPupil');
    robotContainer = document.getElementById('robot3D');
});

// Mouse movement tracking with robot eye following
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Update interactive background gradient
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroSection.style.setProperty('--mouse-x', x + '%');
        heroSection.style.setProperty('--mouse-y', y + '%');
    }
    // Robot eye tracking
    if (robotContainer && leftPupil && rightPupil) {
        const robotRect = robotContainer.getBoundingClientRect();
        const robotCenterX = robotRect.left + robotRect.width / 2;
        const robotCenterY = robotRect.top + robotRect.height / 2;
        // Calculate angle from robot to cursor
        const deltaX = mouseX - robotCenterX;
        const deltaY = mouseY - robotCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        // Limit pupil movement within eye bounds
        const maxMovement = 4; // Maximum pixels the pupil can move from center
        const moveX = Math.max(-maxMovement, Math.min(maxMovement, (deltaX / distance) * maxMovement));
        const moveY = Math.max(-maxMovement, Math.min(maxMovement, (deltaY / distance) * maxMovement));
        // Apply movement to both pupils
        if (leftPupil) {
            leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        if (rightPupil) {
            rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }
});

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('-translate-x-full');
}

// Contact form modal (demo)
function openContactForm() {
    alert('QUANTUM LINK INITIALIZED: Contact interface would activate here. This is a demonstration of the neural portfolio system.');
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize observers
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => skillObserver.observe(bar));
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = ['home', 'about', 'projects', 'skills', 'contact'];
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const element = document.getElementById(section);
        const navLink = document.querySelector(`a[href="#${section}"]`);
        if (element && navLink) {
            const offsetTop = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('text-cyan-400');
                });
                navLink.classList.add('text-cyan-400');
            }
        }
    });
});

// Hide robot on very small screens
if (window.innerWidth <= 480) {
    const robot = document.getElementById('robot3D');
    if (robot) {
        robot.style.display = 'none';
    }
}

// Full-Page Scroll: 1 scroll = 1 halaman
let isScrolling = false;
let currentSectionIndex = 0;
const sections = ['home', 'about', 'documents', 'projects', 'skills', 'contact'];

function getCurrentSection() {
    const scrollPos = window.scrollY + 100;
    for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el) {
            const offsetTop = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
                return i;
            }
        }
    }
    return 0;
}

// Deteksi scroll
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    // Tentukan arah scroll
    const direction = e.deltaY > 0 ? 1 : -1;
    currentSectionIndex = getCurrentSection();
    
    // Hitung index berikutnya
    let nextIndex = currentSectionIndex + direction;
    nextIndex = Math.max(0, Math.min(nextIndex, sections.length - 1));
    
    // Scroll ke section berikutnya
    document.getElementById(sections[nextIndex]).scrollIntoView({
        behavior: 'smooth'
    });
    
    // Tunggu sebentar sebelum scroll berikutnya
    setTimeout(() => {
        isScrolling = false;
    }, 800); // Sesuaikan durasi dengan animasi scroll
}, { passive: false });


// Keyboard Navigation
window.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    isScrolling = true;

    let nextIndex = currentSectionIndex;
    if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    } else if (e.key === 'ArrowUp') {
        nextIndex = Math.max(currentSectionIndex - 1, 0);
    } else {
        isScrolling = false;
        return;
    }

    document.getElementById(sections[nextIndex]).scrollIntoView({
        behavior: 'smooth'
    });

    setTimeout(() => {
        isScrolling = false;
    }, 800);
});

// Variabel untuk menyimpan URL dokumen yang ingin dibuka
let pendingDocumentUrl = '';

// Buka modal password
function requestAccess(url) {
    pendingDocumentUrl = url;
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('docPassword').value = '';
    document.getElementById('passwordError').classList.add('hidden');
}

// Cek password
function checkPassword() {
    const password = document.getElementById('docPassword').value;
    const correctPassword = 'zinkirin312'; // Ganti dengan password kamu

    if (password === correctPassword) {
        window.open(pendingDocumentUrl, '_blank');
        closePasswordModal();
    } else {
        document.getElementById('passwordError').classList.remove('hidden');
    }
}

// Tutup modal
function closePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
}