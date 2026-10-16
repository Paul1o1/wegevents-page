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


  // 8. Couple 3x3 Gallery Modal & Fullscreen Photo Viewer
  const coupleModal = document.getElementById('weg-couple-gallery-modal');
  const cgmClose = document.getElementById('cgm-close');
  const cgmCloseBtn = document.getElementById('cgm-close-btn');
  const cgmBackdrop = document.getElementById('cgm-backdrop');
  const cgmTitle = document.getElementById('cgm-title');
  const cgmCategory = document.getElementById('cgm-category');
  const cgmDesc = document.getElementById('cgm-desc');
  const cgmGrid = document.getElementById('cgm-grid');

  const fsLightbox = document.getElementById('weg-fullscreen-lightbox');
  const fsClose = document.getElementById('fs-close');
  const fsPrev = document.getElementById('fs-prev');
  const fsNext = document.getElementById('fs-next');
  const fsImg = document.getElementById('fs-img');
  const fsCaption = document.getElementById('fs-caption');

  let currentPhotos = [];
  let currentPhotoIdx = 0;
  let currentCoupleTitle = '';

  function closeCoupleModal() {
    if (coupleModal) {
      coupleModal.classList.remove('active');
      coupleModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function openCoupleModal(title, category, desc, photos) {
    if (!coupleModal || !cgmGrid) return;
    currentPhotos = photos || [];
    currentCoupleTitle = title || 'Celebration Gallery';
    
    if (cgmTitle) cgmTitle.textContent = title;
    if (cgmCategory) cgmCategory.textContent = category;
    if (cgmDesc) cgmDesc.textContent = desc;

    // Render 3x3 photo grid
    cgmGrid.innerHTML = '';
    currentPhotos.forEach((src, idx) => {
      const cell = document.createElement('div');
      cell.className = 'couple-photo-cell';
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('aria-label', `${title} - Photo ${idx + 1}`);
      cell.innerHTML = `
        <img src="${src}" alt="${title} photo ${idx + 1}" loading="lazy">
        <div class="couple-photo-overlay">
          <span>Enlarge</span>
        </div>
      `;
      cell.addEventListener('click', () => openFsLightbox(idx));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFsLightbox(idx);
        }
      });
      cgmGrid.appendChild(cell);
    });

    coupleModal.classList.add('active');
    coupleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openFsLightbox(idx) {
    if (!fsLightbox || !fsImg || currentPhotos.length === 0) return;
    currentPhotoIdx = (idx + currentPhotos.length) % currentPhotos.length;
    fsImg.src = currentPhotos[currentPhotoIdx];
    if (fsCaption) {
      fsCaption.textContent = `${currentCoupleTitle} • Photo ${currentPhotoIdx + 1} of ${currentPhotos.length}`;
    }
    fsLightbox.classList.add('active');
    fsLightbox.setAttribute('aria-hidden', 'false');
  }

  function closeFsLightbox() {
    if (fsLightbox) {
      fsLightbox.classList.remove('active');
      fsLightbox.setAttribute('aria-hidden', 'true');
    }
  }

  // Attach triggers for gallery cards & buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action="open-couple-gallery"]');
    if (trigger) {
      e.preventDefault();
      const title = trigger.getAttribute('data-title') || '';
      const category = trigger.getAttribute('data-category') || '';
      const desc = trigger.getAttribute('data-desc') || '';
      let photos = [];
      try {
        photos = JSON.parse(trigger.getAttribute('data-photos') || '[]');
      } catch (err) {
        photos = [];
      }
      openCoupleModal(title, category, desc, photos);
    }
  });

  // Modal close handlers
  if (cgmClose) cgmClose.addEventListener('click', closeCoupleModal);
  if (cgmCloseBtn) cgmCloseBtn.addEventListener('click', closeCoupleModal);
  if (cgmBackdrop) cgmBackdrop.addEventListener('click', closeCoupleModal);

  // Lightbox close handlers & navigation
  if (fsClose) fsClose.addEventListener('click', closeFsLightbox);
  if (fsLightbox) {
    fsLightbox.addEventListener('click', (e) => {
      if (e.target === fsLightbox) closeFsLightbox();
    });
  }
  if (fsPrev) {
    fsPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      openFsLightbox(currentPhotoIdx - 1);
    });
  }
  if (fsNext) {
    fsNext.addEventListener('click', (e) => {
      e.stopPropagation();
      openFsLightbox(currentPhotoIdx + 1);
    });
  }

  // Keyboard navigation (Escape, Left, Right)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fsLightbox && fsLightbox.classList.contains('active')) {
        closeFsLightbox();
      } else if (coupleModal && coupleModal.classList.contains('active')) {
        closeCoupleModal();
      }
    } else if (fsLightbox && fsLightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        openFsLightbox(currentPhotoIdx - 1);
      } else if (e.key === 'ArrowRight') {
        openFsLightbox(currentPhotoIdx + 1);
      }
    }
  });

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
            if (nameEl) nameEl.textContent = formPayload.name;
            if (serviceEl) serviceEl.textContent = formPayload.service;
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




