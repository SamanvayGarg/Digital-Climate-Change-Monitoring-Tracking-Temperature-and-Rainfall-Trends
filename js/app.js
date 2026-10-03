/**
 * Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends
 * Main Application Orchestration Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Weather Engine
  const weatherEngine = new WeatherSimulationEngine('weatherCanvas', 'rainfallSectionContainer');
  window.weatherEngine = weatherEngine;

  // 2. Initialize Charts Manager
  const chartsManager = new ClimateChartsManager();
  chartsManager.init();
  window.chartsManager = chartsManager;

  // 3. Initialize Climate Quiz
  const quiz = new ClimateQuiz('quizMountPoint');
  window.climateQuizInstance = quiz;

  // 4. Initialize Navigation and UI Interactions
  initNavigation();
  initMobileMenu();
  initStatCounters();
  initSmoothScrollButtons();
  initMapStations();
  initDisclaimerNotice();

  console.log('Digital Climate Change Monitoring system initialized successfully.');
});

/**
 * Sticky Navbar & Active Section Highlighting
 */
function initNavigation() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // IntersectionObserver for active link tracking
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Mobile Hamburger Menu
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinksList = document.getElementById('navLinksList');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navLinksList) return;

  function closeMenu() {
    navLinksList.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('active');
  }

  function openMenu() {
    navLinksList.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('active');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinksList.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking any nav item on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/**
 * Smooth Scroll Action Buttons
 */
function initSmoothScrollButtons() {
  const btnExplore = document.getElementById('btnHeroExplore');
  const btnLearn = document.getElementById('btnHeroLearn');

  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('monitoring');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnLearn) {
    btnLearn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('climate-change');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Interactive Map Stations Selection
 */
function initMapStations() {
  const stationCards = document.querySelectorAll('.station-map-card');
  stationCards.forEach(card => {
    card.addEventListener('click', () => {
      const locKey = card.getAttribute('data-location');
      if (locKey && window.chartsManager) {
        window.chartsManager.currentLocation = locKey;
        // Update all select dropdowns
        document.querySelectorAll('.climate-location-select').forEach(sel => {
          sel.value = locKey;
        });
        window.chartsManager.updateAll();
        window.chartsManager.updateActiveMapCard();
      }
    });
  });
}

/**
 * Animated Stat Counters
 */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 1600; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = (target * easeProgress).toFixed(decimals);
            counter.textContent = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toFixed(decimals) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('monitoring');
  if (statsSection) {
    countObserver.observe(statsSection);
  }
}

/**
 * Sample Data Disclaimer Toast / Notice
 */
function initDisclaimerNotice() {
  // If user clicks disclaimer badge in footer or nav, smooth scroll to disclaimer section
  const disclaimerTriggers = document.querySelectorAll('.trigger-disclaimer');
  disclaimerTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('disclaimer');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        target.classList.add('highlight-pulse');
        setTimeout(() => target.classList.remove('highlight-pulse'), 2500);
      }
    });
  });
}
