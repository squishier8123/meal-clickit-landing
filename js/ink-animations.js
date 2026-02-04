/**
 * Meal Clickit - Ink Animations
 * Handles animated handwritten reviews and decorative ink elements
 * that appear as the user scrolls or moves their mouse
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        scrollThreshold: 0.15,      // How much of viewport before triggering
        parallaxStrength: 0.03,     // Mouse parallax intensity
        animationDelay: 150,        // Delay between sequential animations (ms)
        observerThreshold: 0.1      // Intersection observer threshold
    };

    // ============================================
    // Scroll-Triggered Ink Reviews
    // ============================================
    function initScrollAnimations() {
        // Get all ink elements (works for both v1 and v2)
        const inkReviews = document.querySelectorAll('.ink-review, .ink-note');
        const inkDecos = document.querySelectorAll('.ink-deco, .ink-sketch');

        if (!inkReviews.length && !inkDecos.length) return;

        // Create intersection observer for reviews
        const reviewObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        animateInkElements(entry.target);
                    }, index * CONFIG.animationDelay);

                    reviewObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: '-10% 0px'
        });

        // Observe each review based on scroll position
        inkReviews.forEach((review) => {
            const trigger = parseFloat(review.dataset.scrollTrigger) || 0.2;

            // Use scroll position to trigger
            const scrollHandler = () => {
                const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

                if (scrollProgress >= trigger && !review.classList.contains('visible')) {
                    review.classList.add('visible');
                    animateInkElements(review);
                    window.removeEventListener('scroll', scrollHandler);
                }
            };

            window.addEventListener('scroll', scrollHandler, { passive: true });
            scrollHandler(); // Check initial position
        });

        // Observer for decorative elements
        const decoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    decoObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-5% 0px'
        });

        inkDecos.forEach(deco => decoObserver.observe(deco));
    }

    // ============================================
    // Animate Ink Elements Within a Container
    // ============================================
    function animateInkElements(container) {
        const lines = container.querySelectorAll('.ink-line, .ink-underline');
        const texts = container.querySelectorAll('.ink-text, .ink-handwriting');
        const signatures = container.querySelectorAll('.ink-signature, .ink-author');
        const dots = container.querySelectorAll('.ink-dot');

        // Animate lines first
        lines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, i * 100);
        });

        // Then text
        texts.forEach((text, i) => {
            setTimeout(() => {
                text.classList.add('visible');
            }, 300 + (i * 150));
        });

        // Then signatures
        signatures.forEach((sig, i) => {
            setTimeout(() => {
                sig.classList.add('visible');
            }, 600 + (i * 100));
        });

        // Then dots
        dots.forEach((dot, i) => {
            setTimeout(() => {
                dot.classList.add('visible');
            }, 800 + (i * 100));
        });
    }

    // ============================================
    // Mouse Parallax Effect
    // ============================================
    function initMouseParallax() {
        const inkNotes = document.querySelectorAll('[data-parallax]');

        if (!inkNotes.length) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateParallax() {
            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            inkNotes.forEach(note => {
                const strength = parseFloat(note.dataset.parallax) || CONFIG.parallaxStrength;
                const moveX = currentX * strength * 100;
                const moveY = currentY * strength * 100;

                note.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // ============================================
    // FAQ Accordion (for v1 style)
    // ============================================
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all others
                    faqItems.forEach(other => {
                        if (other !== item) {
                            other.classList.remove('active');
                        }
                    });

                    // Toggle current
                    item.classList.toggle('active', !isActive);
                });
            }
        });
    }

    // ============================================
    // Navigation Scroll Effect
    // ============================================
    function initNavScroll() {
        const nav = document.querySelector('.nav');

        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Animate Elements on Scroll
    // ============================================
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.step, .feature-card, .feat, .pricing-card, .price-card');

        if (!reveals.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });

        reveals.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            revealObserver.observe(el);
        });
    }

    // ============================================
    // Funding Progress Animation
    // ============================================
    function initProgressAnimation() {
        const progressFill = document.querySelector('.progress-fill, .funding-fill');

        if (!progressFill) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = progressFill.style.width;
                    progressFill.style.width = '0%';

                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 100);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(progressFill);
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initScrollAnimations();
        initMouseParallax();
        initFaqAccordion();
        initNavScroll();
        initSmoothScroll();
        initScrollReveal();
        initProgressAnimation();

        // Add loaded class for any initial transitions
        document.body.classList.add('loaded');
    }

    init();

})();
