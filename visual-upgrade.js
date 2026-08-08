(() => {
  let media;

  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const fallback = () => media?.fallback || { url: '', alt: 'Japan travel photo' };
  const hero = record => record?.hero || record || fallback();
  const destinationFor = name => {
    const destinations = media?.destinations || {};
    return destinations[name] || destinations[Object.keys(destinations).find(key => name.includes(key))];
  };
  const recordFor = name => media?.activities?.[name] || destinationFor(name);
  const imagesFor = record => record?.images || record?.gallery || (record ? [hero(record)] : [fallback()]);

  function imageMarkup(image, className) {
    const safeImage = image || fallback();
    return `<img class="${className}" src="${escapeHtml(safeImage.url)}" data-fallback="${escapeHtml(fallback().url)}" alt="${escapeHtml(safeImage.alt)}" loading="lazy" decoding="async">`;
  }

  function wireFallbacks(scope = document) {
    scope.querySelectorAll('img[data-fallback]').forEach(image => {
      if (image.dataset.fallbackWired) return;
      image.dataset.fallbackWired = 'true';
      image.addEventListener('error', () => {
        if (image.dataset.usedFallback || !image.dataset.fallback) {
          image.closest('.media-frame')?.classList.add('image-failed');
          return;
        }
        image.dataset.usedFallback = 'true';
        image.src = image.dataset.fallback;
      });
    });
  }

  function openLightbox(title, images, index = 0) {
    const dialog = document.querySelector('#media-lightbox');
    if (!dialog) return;
    const current = images[index] || images[0] || fallback();
    dialog.querySelector('.lightbox-title').textContent = title;
    dialog.querySelector('.lightbox-image').src = current.url;
    dialog.querySelector('.lightbox-image').alt = current.alt;
    dialog.querySelector('.lightbox-credit').innerHTML = current.sourceUrl ? `<a href="${escapeHtml(current.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(current.source || 'Image source')}</a>${current.license ? ` · ${escapeHtml(current.license)}` : ''}` : '';
    dialog.querySelector('.lightbox-count').textContent = `${index + 1} / ${images.length}`;
    dialog.dataset.images = JSON.stringify(images);
    dialog.dataset.index = String(index);
    dialog.showModal();
  }

  function decoratePlaces() {
    document.querySelectorAll('.place').forEach(card => {
      if (card.dataset.mediaReady) return;
      const name = card.querySelector('h3')?.textContent.trim();
      const record = destinationFor(name || '');
      if (!record) return;
      card.dataset.mediaReady = 'true';
      const image = hero(record);
      const visual = card.querySelector('.place-image');
      if (visual) {
        visual.style.backgroundImage = 'none';
        visual.innerHTML = `<button class="media-open media-cover" type="button" data-media-title="${escapeHtml(name)}">${imageMarkup(image, 'place-photo')}</button>`;
        visual.querySelector('button')._galleryImages = imagesFor(record);
      }
      const body = card.querySelector('.place-body');
      if (body && image.sourceUrl) body.insertAdjacentHTML('beforeend', `<small class="image-credit">Photo: <a href="${escapeHtml(image.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(image.source || 'Source')}</a>${image.license ? ` · ${escapeHtml(image.license)}` : ''}</small>`);
    });
  }

  function decorateStops() {
    document.querySelectorAll('#day-view .stop').forEach(stop => {
      if (stop.dataset.mediaReady) return;
      const name = stop.querySelector('h4')?.textContent.trim();
      const record = recordFor(name || '');
      if (!record) return;
      stop.dataset.mediaReady = 'true';
      stop.querySelector('.stop-visual')?.remove();
      const image = hero(record);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'stop-visual media-open';
      button.dataset.mediaTitle = name;
      button.innerHTML = imageMarkup(image, 'stop-photo');
      button._galleryImages = imagesFor(record);
      stop.append(button);
    });
  }

  function renderTourGalleries() {
    document.querySelector('#tour-photo-galleries')?.remove();
    const galleries = media?.tourGalleries || [];
    if (!galleries.length) return;
    const section = document.createElement('section');
    section.id = 'tour-photo-galleries';
    section.className = 'section photo-galleries';
    section.innerHTML = `<header class="section-head"><div><p class="eyebrow">Tour photos</p><h2>See the stops before you go.</h2><p class="subtle">Swipe through the route on mobile. Tap any photo for a larger view.</p></div></header><div class="tour-gallery-grid">${galleries.map(gallery => `<article class="tour-gallery"><div class="tour-gallery-head"><h3>${escapeHtml(gallery.title)}</h3><p>${escapeHtml(gallery.description)}</p></div><div class="tour-gallery-track">${gallery.images.map((image, index) => `<button class="media-open gallery-tile ${index === 0 ? 'gallery-hero' : ''}" type="button" data-media-title="${escapeHtml(gallery.title)}">${imageMarkup(image, 'gallery-photo')}<span>${escapeHtml(image.alt)}</span></button>`).join('')}</div><div class="gallery-attribution">${gallery.images.map(image => image.sourceUrl ? `<a href="${escapeHtml(image.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(image.source || 'Source')}</a>${image.license ? ` (${escapeHtml(image.license)})` : ''}` : '').filter(Boolean).join(' · ')}</div></article>`).join('')}</div>`;
    section.querySelectorAll('.tour-gallery').forEach((galleryNode, galleryIndex) => galleryNode.querySelectorAll('.media-open').forEach((button, imageIndex) => { button._galleryImages = galleries[galleryIndex].images; button._galleryIndex = imageIndex; }));
    document.querySelector('#itinerary').insertAdjacentElement('afterend', section);
  }

  function decorate() {
    if (!media) return;
    decoratePlaces();
    decorateStops();
    wireFallbacks();
  }

  document.addEventListener('trip-data-loaded', event => {
    media = event.detail.media;
    renderTourGalleries();
    requestAnimationFrame(decorate);
    new MutationObserver(() => requestAnimationFrame(decorate)).observe(document.querySelector('#main'), { childList: true, subtree: true });
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('.media-open');
    if (!button) return;
    openLightbox(button.dataset.mediaTitle || 'Travel photo', button._galleryImages || [fallback()], button._galleryIndex || 0);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.createElement('dialog');
    dialog.id = 'media-lightbox';
    dialog.innerHTML = `<button class="lightbox-close" type="button" aria-label="Close photo">×</button><button class="lightbox-prev" type="button" aria-label="Previous photo">‹</button><figure><img class="lightbox-image" alt=""><figcaption><strong class="lightbox-title"></strong><span class="lightbox-count"></span><small class="lightbox-credit"></small></figcaption></figure><button class="lightbox-next" type="button" aria-label="Next photo">›</button>`;
    document.body.append(dialog);
    dialog.querySelector('.lightbox-close').onclick = () => dialog.close();
    ['prev', 'next'].forEach(direction => dialog.querySelector(`.lightbox-${direction}`).onclick = () => {
      const images = JSON.parse(dialog.dataset.images || '[]');
      const next = direction === 'next' ? (Number(dialog.dataset.index) + 1) % images.length : (Number(dialog.dataset.index) - 1 + images.length) % images.length;
      openLightbox(dialog.querySelector('.lightbox-title').textContent, images, next);
    });
  });
})();
