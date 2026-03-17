// --- PARTICLE BACKGROUND ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.grow = Math.random() > 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Twinkle effect
        if (this.grow) {
            this.opacity += 0.005;
            if (this.opacity >= 0.8) this.grow = false;
        } else {
            this.opacity -= 0.005;
            if (this.opacity <= 0.2) this.grow = true;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();


// --- COVER PAGE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const viewBtn = document.getElementById('view-invitation-btn');
    
    let isCoverVisible = true;

    const openInvitation = () => {
        if (!isCoverVisible) return;
        isCoverVisible = false;
        
        // Lock scroll initially
        document.body.style.overflow = 'hidden';
        
        coverPage.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            initRevealAnimations();
        }, 100);

        setTimeout(() => {
            coverPage.style.display = 'none';
        }, 1000);
    };

    viewBtn.addEventListener('click', openInvitation);

    // Auto-transition after 6 seconds
    setTimeout(openInvitation, 6000);
});


// --- COUNTDOWN TIMER ---
const countdown = () => {
    const countDate = new Date('April 19, 2026 12:00:00').getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    const updateEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val < 10 ? '0' + val : val;
    };

    if (gap < 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => updateEl(id, 0));
        return;
    }

    updateEl('days', d);
    updateEl('hours', h);
    updateEl('minutes', m);
    updateEl('seconds', s);
};

setInterval(countdown, 1000);
countdown();


// --- REVEAL ON SCROLL ---
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));
    
    // Stagger check - manually trigger for items already in view
    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 200);
}


// --- ACTIVE NAVIGATION ---
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
            item.classList.add('active');
        }
    });
});
