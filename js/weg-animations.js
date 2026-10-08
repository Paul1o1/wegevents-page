/**
 * WEG Events - Premium Motion, Scrolling & Hover Animation Engine
 * Features:
 * - Scroll progress indicator bar (luxurious gold gradient)
 * - Staggered scroll-triggered entrance reveals
 * - Card & image hover elevation and smooth zoom physics
 * - Button scale, glow, and sheen interactions
 * - Floating smooth back-to-top button
 */
(function() {
    'use strict';

    // 1. Create Scroll Progress Bar
    function initScrollProgressBar() {
        if (document.getElementById('weg-scroll-progress')) return;
        const bar = document.createElement('div');
        bar.id = 'weg-scroll-progress';
        bar.className = 'weg-scroll-progress-bar';
        document.body.appendChild(bar);

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = `${progress}%`;
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // 2. Elements excluded from scroll reveals
    function isExcluded(el) {
        if (!el) return true;
        const name = el.getAttribute('data-framer-name');
        if (
            name === 'Overlay' ||
            name === 'Backdrop' ||
            name === 'BG' ||
            name === 'BG Image' ||
            name === 'BG Video' ||
            el.classList.contains('framer-navigation-overlay') ||
            el.id === 'weg-scroll-progress'
        ) {
            return true;
        }

        if (el.tagName === 'HEADER' || el.closest('header')) {
            if (!el.hasAttribute('data-framer-appear-id') && !el.classList.contains('framer-text')) {
                return true;
            }
        }
        return false;
    }

    const ANIMATED_SELECTORS = [
        '[data-framer-appear-id]',
        '[data-styles-preset]',
        '[data-framer-name="Card"]',
        '[data-framer-name="Item"]',
        '[data-framer-name="Service"]',
        '[data-framer-name="Service 01"]',
        '[data-framer-name="Service 02"]',
        '[data-framer-name="Service 03"]',
        '[data-framer-name="Service 04"]',
        '[data-framer-name="Step"]',
        '[data-framer-name="Steps"]',
        '[data-framer-name="Testimonial"]',
        '[data-framer-name="Review"]',
        '[data-framer-name="Post"]',
        '[data-framer-name="Blog"]',
        '[data-framer-name="Case"]',
        '[data-framer-name="Award"]',
        '[data-framer-name="Instagram Card"]',
        '[data-framer-name="Social Card"]',
        '[data-framer-name="Stats Items"]',
        '[data-framer-name="FAQs"]',
        '[data-framer-name="Founder Story"]',
        '.framer-1szqze0',
        '.framer-11ml2k',
        '.framer-1yeejbm-container',
        '.framer-1m2wxu5-container',
        '.framer-1doazyd-container',
        '.framer-1qkn2p9',
        '.framer-7qs6in',
        '.framer-n647jl'
    ].join(',');

    // 4. Scroll Reveal Setup
    function setupAnimationTargets() {
        const candidates = document.querySelectorAll(ANIMATED_SELECTORS);
        const processedParents = new Set();

        candidates.forEach((el) => {
            if (isExcluded(el)) return;
            if (el.dataset.wegInit === 'true') return;

            el.dataset.wegInit = 'true';
            el.classList.add('weg-reveal');

            // Stagger siblings in grids
            const parent = el.parentElement;
            if (parent && !processedParents.has(parent)) {
                processedParents.add(parent);
                const siblingCards = parent.querySelectorAll(':scope > .weg-reveal');
                siblingCards.forEach((child, index) => {
                    const delay = Math.min(index * 0.12, 0.48);
                    child.style.setProperty('--weg-stagger-delay', `${delay}s`);
                });
            }
        });
    }

    function initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.weg-reveal').forEach(el => el.classList.add('weg-revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.style.getPropertyValue('--weg-stagger-delay');
                    if (delay && parseFloat(delay) > 0) {
                        setTimeout(() => {
                            el.classList.add('weg-revealed');
                        }, parseFloat(delay) * 1000);
                    } else {
                        el.classList.add('weg-revealed');
                    }
                    obs.unobserve(el);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.08
        });

        document.querySelectorAll('.weg-reveal:not(.weg-revealed)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight * 0.85) {
                const delay = Math.min(Math.max((rect.top / window.innerHeight) * 0.4, 0.05), 0.4);
                setTimeout(() => {
                    el.classList.add('weg-revealed');
                }, delay * 1000);
            } else {
                observer.observe(el);
            }
        });
    }

    // 5. Interactive Hover Physics for Cards, Images & Buttons
    function setupHoverInteractions() {
        // Enhance interactive cards
        const hoverCards = document.querySelectorAll(`
            [data-framer-name="Card"],
            [data-framer-name="Item"],
            [data-framer-name="Instagram Card"],
            [data-framer-name="Social Card"],
            .framer-1yeejbm-container,
            .framer-1m2wxu5-container,
            .framer-1doazyd-container,
            .framer-n647jl,
            .framer-1qkn2p9,
            .framer-7qs6in
        `);

        hoverCards.forEach(card => {
            if (card.dataset.wegHoverInit === 'true') return;
            card.dataset.wegHoverInit = 'true';
            card.classList.add('weg-hover-card');
        });

        // Enhance buttons
        const buttons = document.querySelectorAll(`
            a[href*="./contact"],
            a[href*="./service"],
            [data-framer-name="Button"],
            [data-framer-name="Button Link"],
            [data-framer-name="CTA"],
            .framer-7etbgt,
            .framer-1th5987
        `);

        buttons.forEach(btn => {
            if (btn.dataset.wegBtnInit === 'true') return;
            btn.dataset.wegBtnInit = 'true';
            btn.classList.add('weg-hover-btn');
        });
    }

    function start() {
        initScrollProgressBar();
        setupAnimationTargets();
        initIntersectionObserver();
        setupHoverInteractions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    window.addEventListener('load', () => {
        start();
    });

    setTimeout(start, 200);
    setTimeout(start, 800);
})();
