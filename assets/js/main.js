/**
 * WEDS OF BOHEM — Clean Client Script
 * Inspired by Oaks Wedding (Minimalist, Responsive, Smooth)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCinematicLoader();
  initSmoothScroll();
  initCollectionFilter();
  initLightbox();
  initTestimonialSlider();
  initTopAnnouncementTicker();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
});

// Cinematic Website Loading Animation (Full-Screen Percentage Counter)
function initCinematicLoader() {
  const loader = document.getElementById('cinematicLoader');
  const counterWrap = document.getElementById('loaderCounterWrap');
  const numberEl = document.getElementById('loaderNumber');
  const footerEl = document.querySelector('.loader-footer');

  if (!loader || !counterWrap || !numberEl) return;

  // Step 1: Smooth upward entrance and blur-to-sharp reveal
  requestAnimationFrame(() => {
    counterWrap.classList.add('is-revealed');
    if (footerEl) footerEl.classList.add('is-revealed');
  });

  // Step 2 & 3: Smooth continuous count from 1% to 100% with subtle scaling
  const duration = 1900; // Duration in ms
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Cinematic smooth acceleration and deceleration curve
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Continuous number from 1 to 100 without leading zeros
    const currentNumber = Math.min(100, Math.max(1, Math.floor(1 + ease * 99)));
    numberEl.textContent = currentNumber;

    // Subtle scale effect during active counting
    const microScale = 1 + Math.sin(progress * Math.PI) * 0.024;
    numberEl.style.transform = `scale(${microScale})`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Step 4: Reached 100% -> hold briefly
      numberEl.textContent = 100;
      numberEl.style.transform = 'scale(1)';

      setTimeout(() => {
        // Step 5: Fade out the entire loading screen smoothly to reveal website
        loader.classList.add('is-fade-out');
        document.body.classList.remove('is-loading');

        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 350); // 350ms brief hold
    }
  }

  requestAnimationFrame(updateCounter);
}

// Testimonials Slider (Smooth Pause & Touch Interaction)
function initTestimonialSlider() {
  const container = document.getElementById('testimonialSlider');
  const track = document.getElementById('testimonialTrack');
  if (!container || !track) return;

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    container.classList.add('is-paused');
  });

  container.addEventListener('mouseleave', () => {
    container.classList.remove('is-paused');
  });

  // Pause on touch for mobile reading
  container.addEventListener('touchstart', () => {
    container.classList.add('is-paused');
  }, { passive: true });

  container.addEventListener('touchend', () => {
    setTimeout(() => {
      container.classList.remove('is-paused');
    }, 1200);
  }, { passive: true });
}

// Top Announcement Bar Ticker (Smooth Pause on Touch for Mobile)
function initTopAnnouncementTicker() {
  const bar = document.getElementById('topAnnouncement');
  if (!bar) return;

  bar.addEventListener('touchstart', () => {
    bar.classList.add('is-paused');
  }, { passive: true });

  bar.addEventListener('touchend', () => {
    setTimeout(() => {
      bar.classList.remove('is-paused');
    }, 1200);
  }, { passive: true });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if active
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.classList.contains('active')) {
          drawer.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// Collection Filter Pills
function initCollectionFilter() {
  const pills = document.querySelectorAll('.hero-pill-tab');
  const cards = document.querySelectorAll('.story-card');

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// Lightbox for Photos
function initLightbox() {
  const cards = document.querySelectorAll('.story-card');
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.story-names')?.textContent || 'Wedding Story';
      const meta = card.querySelector('.story-meta')?.textContent || 'Weds of Bohem';

      if (img && imgEl) {
        imgEl.src = img.src;
        if (captionEl) {
          captionEl.innerHTML = `<h3 style="font-size: 1.4rem; font-family: var(--font-display);">${title}</h3><p style="font-size: 0.8rem; color: var(--accent-gold); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.25rem;">${meta}</p>`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Mobile Menu Drawer
function initMobileMenu() {
  const trigger = document.getElementById('mobileMenuTrigger');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');

  if (!trigger || !drawer) return;

  trigger.addEventListener('click', () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Contact Form Handler & WhatsApp Submission
function initContactForm() {
  const form = document.getElementById('contactFormTrimmed');
  if (!form) return;

  const nameInput = document.getElementById('fullName') || form.querySelector('[name="name"]');
  const phoneInput = document.getElementById('contactPhone') || form.querySelector('[name="phone"]');
  const emailInput = document.getElementById('contactEmail') || form.querySelector('[name="email"]');
  const dateInput = document.getElementById('weddingDate') || form.querySelector('[name="date"]');
  const messageInput = document.getElementById('contactMessage') || form.querySelector('[name="message"]');

  const errorModal = document.getElementById('invalidNumberModal');
  const errorClose = document.getElementById('invalidNumberClose');
  const errorOk = document.getElementById('invalidNumberOkBtn');
  const errorBackdrop = document.getElementById('invalidNumberBackdrop');

  function openInvalidNumberModal() {
    if (!errorModal) return;
    errorModal.classList.add('active');
    errorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (errorOk) errorOk.focus();
  }

  function closeInvalidNumberModal() {
    if (!errorModal) return;
    errorModal.classList.remove('active');
    errorModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (phoneInput) phoneInput.focus();
  }

  if (errorClose) errorClose.addEventListener('click', closeInvalidNumberModal);
  if (errorOk) errorOk.addEventListener('click', closeInvalidNumberModal);
  if (errorBackdrop) errorBackdrop.addEventListener('click', closeInvalidNumberModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && errorModal && errorModal.classList.contains('active')) {
      closeInvalidNumberModal();
    }
  });

  // Enforce strictly 10-digit numbers only, blocking letters and symbols
  if (phoneInput) {
    phoneInput.addEventListener('keydown', (e) => {
      const allowedNav = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'Home', 'End'
      ];
      if (allowedNav.includes(e.key) || (e.ctrlKey || e.metaKey)) {
        return;
      }
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('input', () => {
      const sanitized = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (phoneInput.value !== sanitized) {
        phoneInput.value = sanitized;
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = nameInput ? nameInput.value.trim() : '';
    const rawPhone = phoneInput ? phoneInput.value.trim() : '';
    const phoneDigits = rawPhone.replace(/\D/g, '');

    // Validate Required Fields
    if (!fullName) {
      if (nameInput) {
        nameInput.focus();
        nameInput.reportValidity();
      }
      return;
    }

    // Validate Mobile Number: must contain exactly 10 digits
    if (phoneDigits.length !== 10) {
      openInvalidNumberModal();
      return;
    }

    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailDisplay = emailVal || 'Not specified';

    let dateDisplay = 'Not specified';
    if (dateInput && dateInput.value) {
      const dateVal = dateInput.value;
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (!isNaN(dObj.getTime())) {
          dateDisplay = dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } else {
          dateDisplay = dateVal;
        }
      } else {
        dateDisplay = dateVal;
      }
    }

    const customerMsg = messageInput ? messageInput.value.trim() : '';
    const messageDisplay = customerMsg || 'Not specified';

    // WhatsApp Message Format per requirement:
    const whatsappMessage = 
`Hello Team WOB!

I would like to enquire about your wedding photography and videography services.

Name: ${fullName}
Mobile Number: ${phoneDigits}
Email: ${emailDisplay}
Wedding Date: ${dateDisplay}
Message: ${messageDisplay}

Looking forward to hearing from you.

Thank you!`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=919292255734&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      const newTab = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    }

    setTimeout(() => {
      form.reset();
    }, 600);
  });
}

// Scroll Entrance Animation (Fade-Up)
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.animate-fade-up');
  if (!animatedEls.length) return;

  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach(el => el.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));
}
