/* WEG Events - Main Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const headers = document.querySelectorAll('.header-fixed, [data-framer-name="Desktop Nav"], [data-framer-name="Phone Nav"], .framer-11hb6jp-container');
  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 40;
    headers.forEach(h => {
      if (isScrolled) {
        h.classList.add('scrolled');
        h.classList.remove('transparent');
      } else {
        h.classList.remove('scrolled');
        h.classList.add('transparent');
      }
    });
  }, { passive: true });

  // 2. Mobile Nav Toggle
  const mobileToggles = document.querySelectorAll('.mobile-toggle, [data-framer-name="Icon / Menu"], .framer-r6qs09');
  const navMenus = document.querySelectorAll('.nav-links, .nav-links-center, .framer-c4ow5d-container, [data-framer-name="Links"]');
  
  mobileToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenus.forEach(menu => {
        menu.classList.toggle('mobile-open');
      });
    });
  });

  navMenus.forEach(menu => {
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('mobile-open');
      });
    });
  });

  document.addEventListener('click', (e) => {
    const clickedInsideNav = e.target.closest('.nav-links-center, .nav-links, .mobile-toggle, .header-right');
    if (!clickedInsideNav) {
      navMenus.forEach(menu => menu.classList.remove('mobile-open'));
    }
  });

  // 3. Hero Slideshow Auto Crossfade
  const slides = document.querySelectorAll('.slideshow-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // 4. Video Viewport Auto-Play Observer
  const videos = document.querySelectorAll('video');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.15 });

    videos.forEach(vid => {
      vid.muted = true;
      vid.playsInline = true;
      videoObserver.observe(vid);
      // Play immediately if already visible
      const rect = vid.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        vid.play().catch(() => {});
      }
    });
  } else {
    videos.forEach(vid => {
      vid.muted = true;
      vid.playsInline = true;
      vid.play().catch(() => {});
    });
  }

  // 5. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question, [data-framer-name="Question"]');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item, [data-framer-name*="Accordion"]');
      if (faqItem) {
        const isActive = faqItem.classList.contains('active');
        document.querySelectorAll('.faq-item, [data-framer-name*="Accordion"]').forEach(item => item.classList.remove('active'));
        if (!isActive) {
          faqItem.classList.add('active');
        }
      }
    });
  });

  // 6. Back To Top Button
  const backToTopBtn = document.querySelector('.back-to-top-btn, #weg-back-to-top');
  if (backToTopBtn) {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Contact Form Submission Handling
  const contactForms = document.querySelectorAll('#weg-contact-form, form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent || submitBtn.value;
        submitBtn.disabled = true;
        if (submitBtn.tagName === 'INPUT') submitBtn.value = 'Sending...';
        else submitBtn.textContent = 'Sending Message...';

        setTimeout(() => {
          alert('Thank you! Your message has been sent to WEG Events. We will get back to you shortly.');
          form.reset();
          submitBtn.disabled = false;
          if (submitBtn.tagName === 'INPUT') submitBtn.value = originalText;
          else submitBtn.textContent = originalText;
        }, 1000);
      }
    });
  });

  // 8. Gallery Lightbox Modal
  const lightbox = document.getElementById('weg-lightbox');
  const lightboxImg = document.getElementById('weg-lightbox-img');
  const lightboxCaption = document.getElementById('weg-lightbox-caption');
  const lightboxClose = document.getElementById('weg-lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-card, [data-gallery-img]').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const couple = card.querySelector('.gallery-couple');
        const date = card.querySelector('.gallery-date');
        if (img) {
          lightboxImg.src = img.src;
          if (lightboxCaption) {
            let cap = '';
            if (couple) cap += couple.textContent;
            if (date) cap += ' • ' + date.textContent;
            lightboxCaption.textContent = cap;
          }
          lightbox.classList.add('active');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // 9. Ethos Video Reel Modal Handler
  const reelModal = document.getElementById('weg-reel-modal');
  const reelVideo = document.getElementById('weg-modal-reel-video');
  const reelClose = document.getElementById('weg-reel-close');
  const reelTriggers = document.querySelectorAll('#ethosReelTrigger, .ethos-btn-play-reel');

  if (reelModal && reelVideo) {
    reelTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        reelModal.classList.add('active');
        reelVideo.play().catch(() => {});
      });
    });

    const closeReel = () => {
      reelModal.classList.remove('active');
      reelVideo.pause();
      reelVideo.currentTime = 0;
    };

    if (reelClose) {
      reelClose.addEventListener('click', closeReel);
    }

    reelModal.addEventListener('click', (e) => {
      if (e.target === reelModal) {
        closeReel();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reelModal.classList.contains('active')) {
        closeReel();
      }
    });
  }

  // 10. Testimonial Hero Carousel Controller
  const testimonialSlides = document.querySelectorAll('.testimonial-hero-slide');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  
  if (testimonialSlides.length > 0) {
    let currentTestimonialIndex = 0;
    let autoRotateTimer = null;

    const showSlide = (index) => {
      testimonialSlides.forEach(slide => slide.classList.remove('active'));
      currentTestimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;
      testimonialSlides[currentTestimonialIndex].classList.add('active');
    };

    const nextSlide = () => showSlide(currentTestimonialIndex + 1);
    const prevSlide = () => showSlide(currentTestimonialIndex - 1);

    const startAutoRotate = () => {
      stopAutoRotate();
      autoRotateTimer = setInterval(nextSlide, 7000);
    };

    const stopAutoRotate = () => {
      if (autoRotateTimer) clearInterval(autoRotateTimer);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoRotate();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoRotate();
      });
    }

    // Pause auto-rotate on hover
    const heroSection = document.querySelector('.testimonial-hero-section');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoRotate);
      heroSection.addEventListener('mouseleave', startAutoRotate);
    }

    startAutoRotate();
  }

  // 11. Floating Photos Scroll Parallax Effect
  const floatingPhotos = document.querySelectorAll('.floating-photo[data-speed]');
  const specialSection = document.getElementById('special-moments');

  if (floatingPhotos.length > 0 && specialSection) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = specialSection.getBoundingClientRect();
          const viewHeight = window.innerHeight;

          if (rect.top < viewHeight && rect.bottom > 0) {
            const scrollPercent = (viewHeight - rect.top) / (viewHeight + rect.height);
            const translateY = (scrollPercent - 0.5) * 60; // Smooth 60px range shift

            floatingPhotos.forEach(photo => {
              const speed = parseFloat(photo.getAttribute('data-speed')) || 1;
              const isCenter = photo.classList.contains('float-bottom-center');
              if (isCenter) {
                photo.style.transform = `translateX(-50%) translateY(${translateY * speed}px)`;
              } else {
                photo.style.transform = `translateY(${translateY * speed}px)`;
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});




