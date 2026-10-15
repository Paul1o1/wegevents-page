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
  const backToTopBtn = document.querySelector('.back-to-top-btn');
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

  // 12. Luxury Contact Form Handler (cPanel PHP Backend)
  const contactForm = document.getElementById('weg-contact-form');
  if (contactForm) {
    const feedbackBox = document.getElementById('contact-form-feedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Inquiry...';
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'none';
        feedbackBox.className = '';
      }

      const formData = new FormData(contactForm);
      const formPayload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        event_date: formData.get('event_date') || 'Not specified',
        guest_count: formData.get('guest_count') || 'Not specified',
        service: formData.get('service') || 'General Inquiry',
        message: formData.get('message') || '',
        _subject: `💍 New Wedding Inquiry: ${formData.get('name') || 'Client'} (${formData.get('service') || 'General'})`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        // Primary: FormSubmit guaranteed delivery to info@wegevents.et
        const response = await fetch('https://formsubmit.co/ajax/info@wegevents.et', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formPayload)
        });

        // Background backup to local server
        fetch('/api/contact.php', { method: 'POST', body: formData }).catch(() => {});

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          const formInner = document.getElementById('contact-form-inner');
          const successState = document.getElementById('contact-success-state');
          if (formInner && successState) {
            formInner.style.display = 'none';
            const nameEl = document.getElementById('success-client-name');
            const serviceEl = document.getElementById('success-service-name');
            const emailEl = document.getElementById('success-client-email');
            const phoneEl = document.getElementById('success-client-phone');
            if (nameEl) nameEl.textContent = formPayload.name;
            if (serviceEl) serviceEl.textContent = formPayload.service;
            if (emailEl) emailEl.textContent = formPayload.email;
            if (phoneEl) phoneEl.textContent = formPayload.phone;
            successState.style.display = 'block';

            const formPanel = document.getElementById('contact-form-panel');
            if (formPanel) {
              formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            const sendAnotherBtn = document.getElementById('btn-send-another');
            if (sendAnotherBtn) {
              sendAnotherBtn.onclick = () => {
                contactForm.reset();
                successState.style.display = 'none';
                formInner.style.display = 'block';
              };
            }
          }
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Unable to deliver message right now.');
        }
      } catch (err) {
        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.style.backgroundColor = '#fff5f5';
          feedbackBox.style.border = '1px solid #feb2b2';
          feedbackBox.style.color = '#9b2c2c';
          feedbackBox.innerHTML = `
            <strong>Submission issue:</strong> ${err.message || 'Please try again or email us directly at <a href="mailto:info@wegevents.com" style="text-decoration: underline; color: inherit;">info@wegevents.com</a>.'}
          `;
          feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});




