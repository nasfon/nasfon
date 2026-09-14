// Cursor glow
const glow = document.getElementById('cursorGlow');
if (glow) {
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
}
if (mobileClose) {
    mobileClose.addEventListener('click', closeMobile);
}
function closeMobile() {
    if (mobileMenu) mobileMenu.classList.remove('active');
}
window.closeMobile = closeMobile;

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// Code typing animation
const codeLines = document.querySelectorAll('.code-line');
const codeBody = document.getElementById('codeBody');
if (codeBody && codeLines.length > 0) {
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeLines.forEach((line, i) => {
                    setTimeout(() => {
                        line.classList.add('visible');
                    }, i * 200);
                });
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    codeObserver.observe(codeBody);
}

// Counter animation
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.textContent.replace(/[0-9]/g, '').trim();
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.innerHTML = '<span class="blue">' + Math.floor(current) + '</span>' + suffix;
            }, 25);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll progress bar
const progressBar = document.getElementById('progressBar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// 3D tilt effect on cards
document.querySelectorAll('.service-card, .founder-card, .project-card').forEach(card => {
    card.classList.add('tilt-card');
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty('--mx', (x / rect.width * 100) + '%');
        card.style.setProperty('--my', (y / rect.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});

// Staggered reveal for grid children
const gridContainers = document.querySelectorAll('.services-grid, .values-grid, .founders-grid, .projects-grid, .blog-grid');
gridContainers.forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                siblings.forEach((child, i) => {
                    child.style.transitionDelay = (i * 100) + 'ms';
                    child.style.transform = 'translateY(40px) scale(0.97)';
                    setTimeout(() => {
                        child.classList.add('visible');
                        child.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                });
                siblings.forEach(s => staggerObserver.unobserve(s));
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    children.forEach(el => staggerObserver.observe(el));
});

// Process timeline animation
const processSection = document.querySelector('.process-steps');
const processSteps = document.querySelectorAll('.process-step');
if (processSection && processSteps.length > 0) {
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                processSteps.forEach((step, i) => {
                    setTimeout(() => {
                        step.classList.add('visible');
                        step.style.opacity = '1';
                        step.style.transform = 'translateY(0)';
                    }, i * 200);
                });
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    processObserver.observe(processSection);
}
