(() => {
  const root = document.documentElement;
  const canvas = document.querySelector('#terminal-canvas');
  const toggle = document.querySelector('.effects-toggle');
  const heroWindow = document.querySelector('.hero-window');
  const context = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.hash));
  const storageKey = 'laranjo-animations';
  const commands = ['$ python pipeline.py', '> loading modules_', '$ git status', '> ready to explore_'];
  const glyphs = '01<>/{}[]:=+';
  let paused = false;
  let frameId = 0;
  let layoutFrame = 0;
  let lastTime = 0;
  let clock = 0;
  let width = 0;
  let height = 0;
  let progress = 0;
  let routes = [];
  let columns = [];

  try {
    paused = localStorage.getItem(storageKey) === 'paused';
  } catch {
    // The visual preference also works when browser storage is unavailable.
  }

  function motionEnabled() {
    return !paused && !reducedMotion.matches;
  }

  function updatePagePosition() {
    layoutFrame = 0;
    const range = Math.max(1, root.scrollHeight - root.clientHeight);
    progress = Math.min(1, Math.max(0, window.scrollY / range));
    root.style.setProperty('--scroll-position', progress.toFixed(4));
    heroWindow.style.setProperty('--hero-drift', Math.min(18, window.scrollY * .035) + 'px');

    const readingLine = window.innerHeight * .38;
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine) active = index;
    });
    navLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function schedulePagePosition() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(updatePagePosition);
  }

  function resizeBackground() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (context) {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    const count = Math.min(18, Math.ceil(width / 90));
    routes = Array.from({ length: count }, (_, index) => {
      const x = 20 + index * (width / count);
      const y = 50 + ((index * 137) % Math.max(1, height - 120));
      const direction = index % 2 ? 1 : -1;
      const points = [
        [x, y],
        [x + 20 * direction, y],
        [x + 20 * direction, y + 52],
        [x + 60 * direction, y + 52],
        [x + 60 * direction, y + 140],
      ];
      return { points, phase: index * 43, orange: index % 5 === 0 };
    });
    columns = Array.from({ length: Math.ceil(width / 88) }, (_, index) => ({
      x: index * 88 + 12,
      start: (index * 173) % Math.max(height, 1),
      speed: 8 + (index % 4) * 3,
      characters: Array.from({ length: 10 }, (_, row) => glyphs[(index * 3 + row * 7) % glyphs.length]),
    }));
    schedulePagePosition();
    if (context) renderBackground();
  }

  function renderBackground() {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    for (const route of routes) {
      const offset = progress * (route.orange ? -38 : 42);
      context.strokeStyle = route.orange ? '#d09b5e29' : '#5aa77c32';
      context.beginPath();
      route.points.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y + offset);
        else context.lineTo(x, y + offset);
      });
      context.stroke();

      const position = (clock * 21 + route.phase) % 252;
      let remaining = position;
      for (let index = 1; index < route.points.length; index++) {
        const [x0, y0] = route.points[index - 1];
        const [x1, y1] = route.points[index];
        const length = Math.abs(x1 - x0) + Math.abs(y1 - y0);
        if (remaining <= length) {
          const fraction = remaining / length;
          context.fillStyle = route.orange ? '#efa466b0' : '#7edbab96';
          context.fillRect(Math.round(x0 + (x1 - x0) * fraction), Math.round(y0 + (y1 - y0) * fraction + offset), 3, 3);
          break;
        }
        remaining -= length;
      }

      const [nodeX, nodeY] = route.points[route.points.length - 1];
      context.fillStyle = '#71bf8c42';
      context.fillRect(nodeX - 2, nodeY + offset - 2, 4, 4);
    }

    context.font = '11px monospace';
    for (const column of columns) {
      const top = (column.start + clock * column.speed + progress * 60) % (height + 200) - 150;
      column.characters.forEach((character, index) => {
        context.fillStyle = index === 9 ? '#8be5ae63' : '#4c9c7040';
        context.fillText(character, column.x, Math.round(top + index * 17));
      });
    }

    context.font = '10px monospace';
    context.fillStyle = '#70bd945e';
    context.fillText(commands[Math.floor(clock / 6) % commands.length], 22, height - 36);
    context.fillStyle = '#b9936060';
    context.fillText('0x' + Math.floor(progress * 4095).toString(16).padStart(3, '0').toUpperCase(), Math.max(20, width - 65), 95);
  }

  function tick(time) {
    frameId = 0;
    if (!motionEnabled() || document.hidden || !context) return;
    const elapsed = time - lastTime;
    if (elapsed >= 1000 / 24) {
      clock += Math.min(elapsed / 1000, .1);
      lastTime = time;
      renderBackground();
    }
    frameId = requestAnimationFrame(tick);
  }

  function syncMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    const enabled = motionEnabled();
    root.dataset.effects = enabled ? 'running' : 'paused';
    toggle.hidden = false;
    toggle.disabled = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', 'Animações');
    toggle.textContent = reducedMotion.matches ? 'FX reduzidos' : 'FX ' + (enabled ? 'ON' : 'OFF');
    toggle.title = reducedMotion.matches ? 'A preferência de movimento reduzido do sistema está ativa.' : (enabled ? 'Pausar animações' : 'Ativar animações');

    if (enabled && !document.hidden && context) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    } else {
      document.querySelectorAll('.click-sparks').forEach((burst) => burst.remove());
      if (context) context.clearRect(0, 0, width, height);
    }
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    try {
      localStorage.setItem(storageKey, paused ? 'paused' : 'running');
    } catch {
      // The button remains usable without saving this preference.
    }
    syncMotion();
  });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('scroll', schedulePagePosition, { passive: true });
  window.addEventListener('resize', resizeBackground, { passive: true });
  window.addEventListener('pageshow', () => {
    resizeBackground();
    syncMotion();
  });
  new ResizeObserver(schedulePagePosition).observe(document.body);

  document.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || !motionEnabled()) return;
    const card = event.target.closest('.project, .profile-panel, .proof-box, .contact-panel');
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--hover-x', Math.round(event.clientX - bounds.left) + 'px');
    card.style.setProperty('--hover-y', Math.round(event.clientY - bounds.top) + 'px');
  }, { passive: true });

  document.addEventListener('click', (event) => {
    if (!motionEnabled() || document.hidden) return;
    const target = event.target.closest('a, button, .project, .hero-window');
    if (!target) return;
    let x = event.clientX;
    let y = event.clientY;
    if (event.detail === 0) {
      const bounds = target.getBoundingClientRect();
      x = bounds.left + bounds.width / 2;
      y = bounds.top + bounds.height / 2;
    }
    const bursts = document.querySelectorAll('.click-sparks');
    if (bursts.length >= 6) bursts[0].remove();
    const burst = document.createElement('span');
    burst.className = 'click-sparks';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.setProperty('--spark-x', x + 'px');
    burst.style.setProperty('--spark-y', y + 'px');
    for (let index = 0; index < 8; index++) {
      const pixel = document.createElement('i');
      const angle = index * Math.PI / 4;
      const distance = index % 2 ? 27 : 38;
      pixel.style.setProperty('--spark-dx', Math.round(Math.cos(angle) * distance) + 'px');
      pixel.style.setProperty('--spark-dy', Math.round(Math.sin(angle) * distance) + 'px');
      burst.append(pixel);
    }
    document.body.append(burst);
    setTimeout(() => burst.remove(), 550);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: .05 });

    document.querySelectorAll('.section-heading, .project, .profile-panel, .proof-box, .contact-panel').forEach((element) => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }

  resizeBackground();
  syncMotion();
})();
