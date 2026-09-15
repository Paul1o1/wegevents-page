/* WEG Events - Main Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.header-fixed');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
        header.classList.remove('transparent');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('transparent');
      }
    });
  }

  // 2. Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksLeft = document.querySelector('.nav-links.left');
  const navLinksRight = document.querySelector('.nav-links.right');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksLeft?.classList.contains('mobile-open');
      if (isOpen) {
        navLinksLeft?.classList.remove('mobile-open');
        navLinksRight?.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinksLeft?.classList.add('mobile-open');
        navLinksRight?.classList.add('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

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

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all active FAQs
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

      // If item was not active, open it
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // 5. Back To Top Button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Contact Form Submission Handling
  const contactForm = document.getElementById('weg-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        setTimeout(() => {
          alert('Thank you! Your message has been sent to WEG Events. We will get back to you shortly.');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1200);
      }
    });
  }
});
