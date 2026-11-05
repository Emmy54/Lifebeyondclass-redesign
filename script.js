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
