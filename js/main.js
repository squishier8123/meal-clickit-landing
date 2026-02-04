/**
 * Meal Clickit Landing Page - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initScrollAnimations();
    initFAQ();
    initStickyCTA();
    initSmoothScroll();
    initEmailForm();
});

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        ...document.querySelectorAll('.step'),
        ...document.querySelectorAll('.feature'),
        ...document.querySelectorAll('.animate-on-scroll')
    ];

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grouped elements
                const delay = entry.target.dataset.step
                    ? (parseInt(entry.target.dataset.step) - 1) * 150
                    : index * 100;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Sticky mobile CTA visibility
 */
function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    const footer = document.querySelector('.footer');

    if (!stickyCTA || !hero) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === hero) {
                // Hide sticky CTA when hero is visible
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    observer.observe(hero);

    // Also hide when near footer
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        footerObserver.observe(footer);
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
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
 * Email form handling
 */
function initEmailForm() {
    const form = document.getElementById('email-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('.email-input');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value;

        // Disable form while submitting
        emailInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        try {
            // Simulate API call - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success state
            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = '#22C55E';
            emailInput.value = '';

            // Reset after delay
            setTimeout(() => {
                submitBtn.textContent = 'Get Updates';
                submitBtn.style.background = '';
                emailInput.disabled = false;
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            // Error state
            submitBtn.textContent = 'Try Again';
            submitBtn.style.background = '#EF4444';
            emailInput.disabled = false;
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.textContent = 'Get Updates';
                submitBtn.style.background = '';
            }, 2000);
        }
    });
}

/**
 * Navigation scroll behavior
 * Adds shadow to nav on scroll
 */
(function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow after scrolling down
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            nav.style.boxShadow = '';
        }

        lastScroll = currentScroll;
    }, { passive: true });
})();

/**
 * Shopify Buy Button placeholder
 * Replace this with actual Shopify Buy Button SDK integration
 */
document.querySelectorAll('.shopify-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.dataset.product;

        // Placeholder alert - replace with Shopify checkout
        alert(`Shopify checkout for ${product} bundle would open here.\n\nTo enable:\n1. Set up Shopify store\n2. Create products\n3. Generate Buy Button code\n4. Replace this function with Shopify SDK`);
    });
});

/**
 * Preload critical images
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

// Preload after page load
window.addEventListener('load', preloadImages);

/**
 * Performance: Lazy load non-critical images
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
