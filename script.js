(() => {
  const header = document.querySelector('#site-header');
  const progress = document.querySelector('#progress-bar');
  const menuButton = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    if (!opening) return closeMenu();
    document.body.classList.add('menu-open');
    menu.classList.add('open');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header.classList.toggle('scrolled', scrollY > 20);
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (reducedMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  document.querySelector('.copy-contact').addEventListener('click', async event => {
    const button = event.currentTarget;
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.querySelector('small').textContent = 'Copied to clipboard';
      status.textContent = 'Discord username copied';
    } catch {
      button.querySelector('small').textContent = 'Username: uh_luca';
      status.textContent = 'Discord username is uh_luca';
    }
    setTimeout(() => { button.querySelector('small').textContent = 'Click to copy'; }, 2200);
  });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxLabel = document.querySelector('#lightbox-label');
  const closeLightbox = document.querySelector('#lightbox-close');
  const portfolioImages = document.querySelectorAll('.featured-image img, .project-image img, .archive-grid img');

  const openImage = image => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxLabel.textContent = image.alt || 'Portfolio image';
    lightbox.showModal();
  };

  portfolioImages.forEach(image => {
    const target = image.closest('.featured-image, .project-image') || image;
    target.setAttribute('role', 'button');
    target.setAttribute('tabindex', '0');
    target.setAttribute('aria-label', `Expand image: ${image.alt || 'portfolio image'}`);
    target.addEventListener('click', () => openImage(image));
    target.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImage(image);
      }
    });
  });

  closeLightbox.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.querySelector('.lightbox-stage').addEventListener('click', event => {
    if (event.target === event.currentTarget) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
  });

  const visitorCount = document.querySelector('#visitor-count');
  const localHosts = new Set(['', 'localhost', '127.0.0.1']);
  if (localHosts.has(location.hostname)) {
    visitorCount.textContent = 'Preview';
  } else {
    fetch('https://counterapi.com/api/immabadliar.github.io/view/my-port?unique=true')
      .then(response => {
        if (!response.ok) throw new Error('Counter request failed');
        return response.json();
      })
      .then(data => {
        const value = Number(data.value);
        visitorCount.textContent = Number.isFinite(value) ? value.toLocaleString() : '—';
      })
      .catch(() => {
        visitorCount.textContent = '—';
        visitorCount.setAttribute('aria-label', 'Visitor count temporarily unavailable');
      });
  }
})();
