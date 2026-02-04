/**
 * Meal Clickit - Urban Graffiti Surrealism Effects
 * Street Art meets Corporate - Edgy but Trustworthy
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFAQ();
    initStickyCTA();
    initSmoothScroll();
    initEmailForm();
    initGraffitiEffects();
    initSurrealistFloaters();
    initSprayPaintCursor();
    initParallaxSplatters();
});

/**
 * Scroll-triggered animations with stagger
 */
function initScrollAnimations() {
    const animatedElements = [
        ...document.querySelectorAll('.step'),
        ...document.querySelectorAll('.feature'),
        ...document.querySelectorAll('.testimonial'),
        ...document.querySelectorAll('.benefit-card'),
        ...document.querySelectorAll('.pricing-card'),
        ...document.querySelectorAll('.animate-on-scroll')
    ];

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.step
                    ? (parseInt(entry.target.dataset.step) - 1) * 200
                    : index * 80;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Add spray effect on reveal
                    createSprayReveal(entry.target);
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Create spray paint reveal effect
 */
function createSprayReveal(element) {
    const spray = document.createElement('div');
    spray.className = 'spray-reveal';
    spray.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255, 107, 0, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        pointer-events: none;
        animation: spray-burst 0.6s ease-out forwards;
        z-index: 10;
    `;

    // Only add if element has position relative/absolute
    const position = window.getComputedStyle(element).position;
    if (position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(spray);

    setTimeout(() => spray.remove(), 600);
}

// Add spray-burst animation
const sprayStyle = document.createElement('style');
sprayStyle.textContent = `
    @keyframes spray-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(3); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
    }

    @keyframes float-surreal {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(5deg); }
        50% { transform: translateY(-5px) rotate(-3deg); }
        75% { transform: translateY(-20px) rotate(2deg); }
    }

    .surreal-floater {
        position: fixed;
        pointer-events: none;
        z-index: 0;
        opacity: 0.15;
        animation: float-surreal 8s ease-in-out infinite;
    }

    .paint-drip {
        position: absolute;
        width: 4px;
        background: linear-gradient(180deg, currentColor 0%, transparent 100%);
        border-radius: 0 0 4px 4px;
        animation: drip-fall 3s ease-in infinite;
        opacity: 0.7;
    }

    @keyframes drip-fall {
        0% { height: 0; opacity: 1; }
        70% { height: 60px; opacity: 0.7; }
        100% { height: 80px; opacity: 0; }
    }

    .cursor-splatter {
        position: fixed;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: transform 0.1s ease-out;
        mix-blend-mode: screen;
    }
`;
document.head.appendChild(sprayStyle);

/**
 * FAQ accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Sticky mobile CTA
 */
function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    const footer = document.querySelector('.footer');

    if (!stickyCTA || !hero) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === hero) {
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    observer.observe(hero);

    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        footerObserver.observe(footer);
    }
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Email form
 */
function initEmailForm() {
    const form = document.getElementById('email-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('.email-input');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value;

        emailInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'TAGGING...';

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            submitBtn.textContent = 'TAGGED!';
            submitBtn.style.background = '#22C55E';
            submitBtn.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
            emailInput.value = '';

            setTimeout(() => {
                submitBtn.textContent = 'GET UPDATES';
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                emailInput.disabled = false;
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            submitBtn.textContent = 'TRY AGAIN';
            submitBtn.style.background = '#EF4444';
            emailInput.disabled = false;
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.textContent = 'GET UPDATES';
                submitBtn.style.background = '';
            }, 2000);
        }
    });
}

/**
 * Graffiti-specific visual effects
 */
function initGraffitiEffects() {
    // Add random paint drips to section titles
    const titles = document.querySelectorAll('.section-title, .hero-title');
    titles.forEach(title => {
        title.classList.add('drip');
    });

    // Add hover glitch effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'none';
            btn.offsetHeight; // Trigger reflow
            btn.style.animation = null;
        });
    });

    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }
}

/**
 * Surrealist floating shapes - Dali/Magritte inspired
 */
function initSurrealistFloaters() {
    const colors = ['#FF6B00', '#00F5FF', '#FF00FF', '#ADFF2F'];
    const shapes = ['circle', 'blob', 'triangle'];

    // Create 3-5 floating surreal shapes
    const numFloaters = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numFloaters; i++) {
        const floater = document.createElement('div');
        floater.className = 'surreal-floater';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 40 + Math.random() * 80;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        let borderRadius;
        switch(shape) {
            case 'circle':
                borderRadius = '50%';
                break;
            case 'blob':
                borderRadius = `${30 + Math.random() * 40}% ${60 - Math.random() * 30}% ${50 + Math.random() * 20}% ${40 + Math.random() * 30}%`;
                break;
            case 'triangle':
                borderRadius = '50% 0 50% 50%';
                break;
        }

        floater.style.cssText = `
            left: ${10 + Math.random() * 80}%;
            top: ${10 + Math.random() * 80}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(ellipse, ${color}40 0%, transparent 70%);
            border-radius: ${borderRadius};
            animation-delay: ${Math.random() * -8}s;
            animation-duration: ${6 + Math.random() * 6}s;
            filter: blur(${2 + Math.random() * 4}px);
        `;

        document.body.appendChild(floater);
    }
}

/**
 * Spray paint cursor trail effect (desktop only)
 */
function initSprayPaintCursor() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor-splatter';
    cursor.style.opacity = '0';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Burst effect on click
    document.addEventListener('click', (e) => {
        createClickBurst(e.clientX, e.clientY);
    });
}

/**
 * Create click burst effect
 */
function createClickBurst(x, y) {
    const burst = document.createElement('div');
    const colors = ['#FF6B00', '#00F5FF', '#FF00FF', '#ADFF2F'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    burst.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%) scale(0);
        animation: click-burst 0.5s ease-out forwards;
        z-index: 9998;
    `;

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
}

// Add click burst animation
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes click-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
    }
`;
document.head.appendChild(burstStyle);

/**
 * Parallax paint splatters on scroll
 */
function initParallaxSplatters() {
    const splatters = document.querySelectorAll('.hero-overlay::before, .hero-overlay::after');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero) {
            const heroHeight = hero.offsetHeight;
            const scrollPercent = Math.min(scrollY / heroHeight, 1);

            // Parallax effect on hero background
            const bgImage = document.querySelector('.hero-bg-image');
            if (bgImage) {
                bgImage.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
            }
        }
    }, { passive: true });
}

/**
 * Shopify Buy Button placeholder
 */
document.querySelectorAll('.shopify-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.dataset.product;

        // Visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        alert(`Shopify checkout for ${product} bundle would open here.\n\nTo enable:\n1. Set up Shopify store\n2. Create products\n3. Generate Buy Button code\n4. Replace this function with Shopify SDK`);
    });
});

/**
 * Preload images
 */
function preloadImages() {
    const criticalImages = [
        'images/optimized/product-removable.webp',
        'images/logo.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

window.addEventListener('load', preloadImages);

/**
 * Lazy load images
 */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Console art - because why not?
 */
console.log(`
%c
    ███╗   ███╗███████╗ █████╗ ██╗
    ████╗ ████║██╔════╝██╔══██╗██║
    ██╔████╔██║█████╗  ███████║██║
    ██║╚██╔╝██║██╔══╝  ██╔══██║██║
    ██║ ╚═╝ ██║███████╗██║  ██║███████╗
    ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝

    ██████╗██╗     ██╗ ██████╗██╗  ██╗██╗████████╗
   ██╔════╝██║     ██║██╔════╝██║ ██╔╝██║╚══██╔══╝
   ██║     ██║     ██║██║     █████╔╝ ██║   ██║
   ██║     ██║     ██║██║     ██╔═██╗ ██║   ██║
   ╚██████╗███████╗██║╚██████╗██║  ██╗██║   ██║
    ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝

    🎨 Urban Graffiti Surrealism Edition

`, 'color: #FF6B00; font-weight: bold;');
