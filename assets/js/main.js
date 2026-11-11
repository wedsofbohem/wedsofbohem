/**
 * WEDS OF BOHEM — Clean Client Script
 * Inspired by Oaks Wedding (Minimalist, Responsive, Smooth)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCollectionFilter();
  initLightbox();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
});

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

// Contact Form Handler & Thank You Popup
function initContactForm() {
  const form = document.getElementById('contactFormTrimmed');
  const modal = document.getElementById('thankYouModal');
  const closeBtn = document.getElementById('thankYouClose');
  const okBtn = document.getElementById('thankYouOkBtn');
  const backdrop = document.getElementById('thankYouBackdrop');
  if (!form) return;

  const phoneInput = form.querySelector('[name="phone"]');

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
      if (phoneInput.value.length === 10) {
        phoneInput.setCustomValidity('');
      }
    });
  }

  function openThankYouModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeThankYouModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeThankYouModal);
  if (okBtn) okBtn.addEventListener('click', closeThankYouModal);
  if (backdrop) backdrop.addEventListener('click', closeThankYouModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeThankYouModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check validity of contact number (strictly 10 digits)
    if (phoneInput && phoneInput.value.trim().length !== 10) {
      phoneInput.setCustomValidity('Please enter a valid 10-digit mobile number.');
      phoneInput.reportValidity();
      return;
    } else if (phoneInput) {
      phoneInput.setCustomValidity('');
    }

    // Check validity of required inputs
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    // Process submission cleanly on page with smooth feedback
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      form.reset();
      openThankYouModal();
    }, 350);
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
