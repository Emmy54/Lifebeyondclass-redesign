document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const scoreTable = document.querySelector('.score-table');

if (scoreTable && !reduceMotion) {
  const scoreBars = [...scoreTable.querySelectorAll('progress')].map((bar, index) => ({
    bar,
    target: Number(bar.value),
    delay: index * 110,
  }));

  scoreBars.forEach(({ bar }) => { bar.value = 0; });

  const animateScores = () => {
    const duration = 900;
    const startedAt = performance.now();
    const easeOutCubic = (value) => 1 - ((1 - value) ** 3);

    const update = (now) => {
      let complete = true;

      scoreBars.forEach(({ bar, target, delay }) => {
        const elapsed = Math.max(0, now - startedAt - delay);
        const progress = Math.min(elapsed / duration, 1);
        bar.value = target * easeOutCubic(progress);
        if (progress < 1) complete = false;
      });

      if (!complete) window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const scoreObserver = new IntersectionObserver((entries, currentObserver) => {
      if (entries[0].isIntersecting) {
        animateScores();
        currentObserver.unobserve(scoreTable);
      }
    }, { threshold: 0.3 });
    scoreObserver.observe(scoreTable);
  } else {
    animateScores();
  }
}

const coursesCarousel = document.querySelector('#courses-carousel');

if (coursesCarousel) {
  const carouselButtons = coursesCarousel.parentElement.querySelectorAll('[data-carousel-control]');
  const carouselDots = coursesCarousel.parentElement.querySelectorAll('[data-carousel-dot]');
  const updateCarouselControls = () => {
    const maximumScroll = coursesCarousel.scrollWidth - coursesCarousel.clientWidth;
    carouselButtons.forEach((button) => {
      if (button.dataset.carouselControl === 'previous') {
        button.disabled = coursesCarousel.scrollLeft <= 1;
      } else {
        button.disabled = coursesCarousel.scrollLeft >= maximumScroll - 1;
      }
    });
    const activeDot = maximumScroll > 0 ? Math.round((coursesCarousel.scrollLeft / maximumScroll) * (carouselDots.length - 1)) : 0;
    carouselDots.forEach((dot, index) => {
      const isActive = index === activeDot;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  };

  carouselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = coursesCarousel.querySelector('.courses-item');
      const gap = Number.parseFloat(getComputedStyle(coursesCarousel).columnGap) || 0;
      const distance = (card?.getBoundingClientRect().width || coursesCarousel.clientWidth) + gap;
      const direction = button.dataset.carouselControl === 'previous' ? -1 : 1;
      coursesCarousel.scrollBy({
        left: distance * direction,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
  });

  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const maximumScroll = coursesCarousel.scrollWidth - coursesCarousel.clientWidth;
      const position = Number(dot.dataset.carouselDot) / (carouselDots.length - 1);
      coursesCarousel.scrollTo({
        left: maximumScroll * position,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
  });

  coursesCarousel.addEventListener('scroll', updateCarouselControls, { passive: true });
  window.addEventListener('resize', updateCarouselControls);
  updateCarouselControls();
}
