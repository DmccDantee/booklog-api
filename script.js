'use strict';

///////////////////////////////////////
// Theme Switcher
///////////////////////////////////////

const initTheme = () => {
  const themeSwitcher = document.getElementById('theme-switcher');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Get saved theme or use system preference
  const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
  
  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Theme switcher click handler
  themeSwitcher?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a subtle animation to the page
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  });
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
};

///////////////////////////////////////
// Modal window
///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
};

// Open modal event listeners
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Close modal event listeners
btnCloseModal?.addEventListener('click', closeModal);
overlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
///////////////////////////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo?.addEventListener('click', function (e) {
  section1.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
});

///////////////////////////////////////
// Page Navigation with smooth scrolling
///////////////////////////////////////

document.querySelector('.nav__links')?.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link') && 
      e.target.getAttribute('href')?.startsWith('#')) {
    const id = e.target.getAttribute('href');
    const targetSection = document.querySelector(id);
    
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

///////////////////////////////////////
// Tabbed Component
///////////////////////////////////////

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer?.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  const activeTab = clicked.dataset.tab;
  document
    .querySelector(`.operations__content--${activeTab}`)
    ?.classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
///////////////////////////////////////

const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    if (logo) logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav?.addEventListener('mouseover', handleHover.bind(0.5));
nav?.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation with Intersection Observer
///////////////////////////////////////

const header = document.querySelector('.header');
const navHeight = nav?.getBoundingClientRect().height || 90;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav?.classList.add('sticky');
  else nav?.classList.remove('sticky');
};

if (header && nav) {
  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}

///////////////////////////////////////
// Reveal sections with Intersection Observer
///////////////////////////////////////

const allSections = document.querySelectorAll('.section--observe');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.add('section--visible');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

///////////////////////////////////////
// Lazy loading images
///////////////////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Enhanced Slider
///////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer?.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      ?.classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  // Event handlers
  btnRight?.addEventListener('click', nextSlide);
  btnLeft?.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer?.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      curSlide = Number(slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });

  // Auto-play slider
  let autoPlay;
  const startAutoPlay = () => {
    autoPlay = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlay);
  };

  // Pause auto-play on hover
  const sliderContainer = document.querySelector('.slider');
  sliderContainer?.addEventListener('mouseenter', stopAutoPlay);
  sliderContainer?.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe support for mobile
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  sliderContainer?.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  sliderContainer?.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    
    const deltaX = startX - endX;
    const deltaY = startY - endY;
    
    // Check if horizontal swipe is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
        if (deltaX > 0) {
          nextSlide(); // Swipe left - next slide
        } else {
          prevSlide(); // Swipe right - previous slide
        }
      }
    }
  });

  // Initialize
  if (slides.length > 0) {
    init();
    startAutoPlay();
  }
};

///////////////////////////////////////
// Parallax Scrolling Effect
///////////////////////////////////////

const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.header__img, .features__img');
  
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight && 
          element.getBoundingClientRect().bottom > 0) {
        element.style.transform = `translateY(${rate}px)`;
      }
    });
  };

  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
      setTimeout(() => ticking = false, 16); // ~60fps throttling
    }
  };

  window.addEventListener('scroll', requestTick);
};

///////////////////////////////////////
// Enhanced Button Animations
///////////////////////////////////////

const initButtonAnimations = () => {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(-1px) scale(0.98)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });
  });
};

///////////////////////////////////////
// Smooth Loading Animation
///////////////////////////////////////

const initLoadingAnimation = () => {
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger animations for elements with animate-in class
    const animateElements = document.querySelectorAll('.animate-in');
    animateElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animationDelay = `${index * 0.1}s`;
      }, 100);
    });
  });
};

///////////////////////////////////////
// Performance Optimizations
///////////////////////////////////////

const initPerformanceOptimizations = () => {
  // Preload critical images
  const criticalImages = [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop&crop=center'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Add loading states for dynamic content
  const loadingStates = document.querySelectorAll('[data-loading]');
  loadingStates.forEach(element => {
    element.addEventListener('click', function() {
      this.classList.add('loading');
      setTimeout(() => {
        this.classList.remove('loading');
      }, 1000);
    });
  });
};

///////////////////////////////////////
// Enhanced Error Handling
///////////////////////////////////////

const initErrorHandling = () => {
  // Global error handler for images
  document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
      e.target.style.display = 'none';
      console.warn('Image failed to load:', e.target.src);
    }
  }, true);

  // Handle offline/online states
  window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('Connection restored');
  });

  window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('Connection lost');
  });
};

///////////////////////////////////////
// Accessibility Enhancements
///////////////////////////////////////

const initAccessibility = () => {
  // Add keyboard navigation for slider
  document.addEventListener('keydown', function(e) {
    if (e.target.closest('.slider')) {
      e.preventDefault();
    }
  });

  // Add focus management for modal
  const focusableElements = modal?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements?.[0];
  const lastElement = focusableElements?.[focusableElements.length - 1];

  modal?.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Enhanced ARIA labels
  const themeSwitcher = document.getElementById('theme-switcher');
  if (themeSwitcher) {
    const updateAriaLabel = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      themeSwitcher.setAttribute('aria-label', `Switch to ${newTheme} mode`);
    };
    
    updateAriaLabel();
    themeSwitcher.addEventListener('click', () => {
      setTimeout(updateAriaLabel, 100);
    });
  }
};

///////////////////////////////////////
// Initialize All Features
///////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  // Core functionality
  initTheme();
  slider();
  
  // Enhanced features
  initParallax();
  initButtonAnimations();
  initLoadingAnimation();
  initPerformanceOptimizations();
  initErrorHandling();
  initAccessibility();
  
  console.log('🏦 Bankist modernization complete! All features loaded.');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initTheme,
    slider,
    initParallax,
    initButtonAnimations
  };
}