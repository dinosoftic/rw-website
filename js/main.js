/**
 * Range Water Conditioning - Main JavaScript
 * Handles navigation, modals, component includes, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initComponentIncludes();
  initStickyHeader();
  initMobileNav();
  initModals();
  initDropdowns();
  initScrollReveal();
  initStatCounters();
  initHeroReveal();
  initCardTilt();
  initHeroParallax();
});

/**
 * Component Include System
 * Loads HTML components into elements with data-include attribute
 */
async function initComponentIncludes() {
  const includes = document.querySelectorAll('[data-include]');
  
  for (const el of includes) {
    const file = el.getAttribute('data-include');
    try {
      const response = await fetch(file);
      if (response.ok) {
        el.innerHTML = await response.text();
      } else {
        console.error(`Failed to load component: ${file}`);
      }
    } catch (err) {
      console.error(`Error loading component: ${file}`, err);
    }
  }
  
  // Re-initialize interactive elements after components load
  setTimeout(() => {
    initStickyHeader();
    initMobileNav();
    initModals();
    initDropdowns();
  }, 100);
}

/**
 * Sticky Header
 * Adds scrolled class to header when page is scrolled
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  
  const scrollThreshold = 50;
  
  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/**
 * Mobile Navigation
 * Handles hamburger menu toggle
 */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!menuToggle || !mainNav) return;
  
  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    this.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}

/**
 * Dropdown Menus (Mobile)
 * Handles click-to-open dropdowns on mobile
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      // Only prevent default on mobile
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const parent = this.parentElement;
        
        // Close other open dropdowns at same level
        const siblings = parent.parentElement.querySelectorAll(':scope > .has-dropdown.open');
        siblings.forEach(sibling => {
          if (sibling !== parent) {
            sibling.classList.remove('open');
          }
        });
        
        parent.classList.toggle('open');
      }
    });
  });
}

/**
 * Modal System
 * Handles opening and closing of modals
 */
function initModals() {
  // Open modal triggers
  const modalTriggers = document.querySelectorAll('[data-modal]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });
  
  // Close modal buttons
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close modal on overlay click
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus first input
  const firstInput = modal.querySelector('input, textarea, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Smooth Scroll for Anchor Links
 */
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    
    if (target) {
      e.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile nav if open
      const mainNav = document.getElementById('main-nav');
      const menuToggle = document.getElementById('menu-toggle');
      if (mainNav?.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    }
  }
});

/**
 * Form Handling
 * Basic form validation and submission feedback
 */
document.addEventListener('submit', function(e) {
  const form = e.target;
  
  // Add loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Reset button after form submission (for Formspree redirect)
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }
});

/**
 * Lazy Load Images
 * Uses Intersection Observer for performance
 */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoad);

/**
 * Scroll Reveal Animation
 * Uses IntersectionObserver to trigger CSS animations on scroll
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal');
  
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/**
 * Stat Counter Animation
 * Animates numbers counting up when stats section enters viewport
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;
  
  if (!('IntersectionObserver' in window)) {
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      el.textContent = target + suffix;
    });
    return;
  }
  
  let counted = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        animateCounters(statNumbers);
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.3
  });
  
  statNumbers.forEach(el => observer.observe(el));
}

function animateCounters(elements) {
  elements.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      
      el.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

/**
 * Hero Reveal Animation
 * Triggers staggered entrance animation for hero elements
 */
function initHeroReveal() {
  const heroElements = document.querySelectorAll('.hero .reveal');
  
  // Staggered entrance — each element appears slightly after the previous
  setTimeout(() => {
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('is-visible');
      }, i * 120);
    });
  }, 250);
}

/**
 * Card Tilt Micro-Interaction
 * Adds subtle 3D tilt effect on product cards on hover
 */
function initCardTilt() {
  const cards = document.querySelectorAll('.product-card, .product-featured');
  if (!cards.length || window.matchMedia('(max-width: 768px)').matches) return;
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Hero Parallax
 * Subtle parallax movement on hero content during scroll
 */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroOrb = document.querySelector('.hero-orb');
  if (!hero || !heroContent) return;
  
  // Use passive listener for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
          const ratio = scrolled / heroHeight;
          heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
          heroContent.style.opacity = 1 - ratio * 0.6;
          
          if (heroOrb) {
            heroOrb.style.transform = `translateY(${scrolled * 0.08}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
