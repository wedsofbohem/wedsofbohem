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

// Contact Form Handler & WhatsApp Click-to-Chat Integration
function initContactForm() {
  const form = document.getElementById('contactFormTrimmed');
  const errorToast = document.getElementById('formErrorToast');
  const errorText = document.getElementById('formErrorText');
  const errorClose = document.getElementById('formErrorClose');
  if (!form) return;

  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const emailInput = form.querySelector('[name="email"]');
  const dateInput = form.querySelector('[name="date"]');
  const messageInput = form.querySelector('[name="message"]');

  let toastTimeout = null;

  function showError(msg, targetInput) {
    if (errorText) errorText.textContent = msg;
    if (errorToast) {
      errorToast.classList.add('active');
      errorToast.setAttribute('aria-hidden', 'false');
    }
    if (targetInput) {
      targetInput.classList.add('has-error');
      targetInput.focus();
    }
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(hideError, 4000);
  }

  function hideError() {
    if (errorToast) {
      errorToast.classList.remove('active');
      errorToast.setAttribute('aria-hidden', 'true');
    }
    if (nameInput) nameInput.classList.remove('has-error');
    if (phoneInput) phoneInput.classList.remove('has-error');
    if (emailInput) emailInput.classList.remove('has-error');
  }

  if (errorClose) {
    errorClose.addEventListener('click', hideError);
  }

  // Enforce strictly 10 digits on mobile number, block letters and symbols
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
      phoneInput.classList.remove('has-error');
      const sanitized = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (phoneInput.value !== sanitized) {
        phoneInput.value = sanitized;
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('has-error');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('has-error');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const date = dateInput ? dateInput.value.trim() : '';
    const userMsg = messageInput ? messageInput.value.trim() : '';

    // 1. Validate Full Name (Required)
    if (!name || name.length < 2) {
      showError('Please enter your Full Name.', nameInput);
      return;
    }

    // 2. Validate Mobile Number (Required - exactly 10 digits, valid Indian mobile prefix 6-9)
    if (!phone) {
      showError('Please enter your 10-digit Mobile Number.', phoneInput);
      return;
    }

    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(phone)) {
      showError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).', phoneInput);
      return;
    }

    // 3. Validate Email (Optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address or leave it blank.', emailInput);
      return;
    }

    // All validation passed: hide any error
    hideError();

    // Format Wedding Date nicely if present
    let formattedDate = 'Not specified';
    if (date) {
      try {
        const parts = date.split('-');
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          formattedDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        } else {
          formattedDate = date;
        }
      } catch (err) {
        formattedDate = date;
      }
    }

    const emailValue = email || 'Not specified';
    const messageValue = userMsg || 'None';

    // Format message exactly as required:
    const whatsappMessage = `Hello Team WOB!
I would like to enquire about your wedding photography and videography services.

Name: ${name}
Mobile: ${phone}
Email: ${emailValue}
Wedding Date: ${formattedDate}
Message: ${messageValue}

Looking forward to hearing from you.
Thank you!`;

    // Official WhatsApp Click-to-Chat URL with configured WOB business number
    const whatsappUrl = `https://wa.me/919292255734?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp in a new tab or trigger WhatsApp mobile app
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
