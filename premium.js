(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  function enrichPlaces() {
    $$('.activity').forEach((card, index) => {
      if (card.querySelector('.place-intel')) return;
      const place = card.querySelector('h4')?.textContent || 'this stop';
      const walk = index % 3 === 0 ? '5-10 min walk' : index % 3 === 1 ? '12-18 min walk' : '8 min walk';
      card.insertAdjacentHTML('beforeend', `<div class="place-intel"><span><i data-lucide="camera"></i> Best photo: ${place.includes('Fushimi') ? 'Past the first torii gates' : place.includes('Shibuya') ? 'Magnet rooftop crossing view' : 'Arrival-side street angle'}</span><span><i data-lucide="footprints"></i> ${walk} to next stop</span><span><i data-lucide="coffee"></i> Cafe nearby</span><span><i data-lucide="store"></i> Konbini + restroom nearby</span></div>`);
    });
    window.lucide?.createIcons();
  }

  function addWeatherState() {
    const weather = $('.weather-card');
    if (!weather || weather.querySelector('.weather-status')) return;
    weather.insertAdjacentHTML('beforeend', '<span class="weather-status">Forecast placeholder · refresh before departure</span>');
  }

  function wireLightbox() {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'modal image-lightbox';
    lightbox.innerHTML = '<button class="icon-button dialog-close" aria-label="Close image" title="Close"><i data-lucide="x"></i></button><img alt="Attraction photo" />';
    document.body.append(lightbox);
    document.addEventListener('click', (event) => {
      const image = event.target.closest('.attraction-image');
      if (image) {
        const url = image.style.backgroundImage.slice(5, -2);
        const img = lightbox.querySelector('img');
        img.src = url;
        img.alt = image.closest('.attraction-card')?.querySelector('h3')?.textContent || 'Attraction photo';
        lightbox.showModal();
      }
      if (event.target.closest('.image-lightbox .dialog-close')) lightbox.close();
    });
  }

  function setScrollState() {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#scrollProgress').style.width = `${max ? Math.min(100, scrollY / max * 100) : 0}%`;
    $('.floating-nav')?.classList.toggle('visible', scrollY > 420);
    let current;
    $$('main section[id]').forEach((section) => { if (scrollY >= section.offsetTop - 120) current = section.id; });
    $$('.floating-nav a').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }

  function init() {
    addWeatherState();
    enrichPlaces();
    wireLightbox();
    const observer = new MutationObserver(enrichPlaces);
    observer.observe($('#dayCard'), { childList: true, subtree: true });
    addEventListener('scroll', setScrollState, { passive: true });
    addEventListener('resize', setScrollState);
    setScrollState();
    requestAnimationFrame(() => $('#appLoader')?.classList.add('done'));
  }
  init();
})();
