const experienceStore = { get: (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }, set: (key, value) => localStorage.setItem(key, JSON.stringify(value)) };
function mapSearch(value) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`; }
function renderExperiences(content) {
  const saved = experienceStore.get('trip-experiences', content.experiences);
  const cards = document.querySelector('#experience-cards');
  cards.innerHTML = saved.map((item, index) => `<article class="experience-card"><div class="experience-image" style="background-image:url('https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=78')"></div><div class="experience-body"><p class="eyebrow">${item.date}</p><h3>${item.name}</h3><dl><div><dt>Time</dt><dd>${item.time}</dd></div><div><dt>Location</dt><dd>${item.location}</dd></div><div><dt>Status</dt><dd>${item.status}</dd></div><div><dt>Price</dt><dd>${item.price}</dd></div><div><dt>Confirmation</dt><dd>${item.confirmationNumber}</dd></div></dl><p>${item.notes}</p><div class="experience-actions"><a class="button quiet" target="_blank" rel="noreferrer" href="${mapSearch(item.location)}">Google Maps</a>${item.bookingLink ? `<a class="button primary" target="_blank" rel="noreferrer" href="${item.bookingLink}">Book experience</a>` : `<button class="button quiet" disabled title="Booking link to be confirmed">Booking link TBC</button>`}<button class="link-button" data-edit-experience="${index}">Edit</button></div></div></article>`).join('');
  document.querySelector('#experience-cards + .optional-shelf')?.remove();
  const optional = content.optional || [];
  cards.insertAdjacentHTML('afterend', `<section class="optional-shelf"><div><p class="eyebrow">Optional</p><h3>Save without scheduling</h3></div>${optional.map(item => `<article><strong>${item.name}</strong><span>${item.date} · ${item.timing}</span><p>${item.reason}</p><a target="_blank" rel="noreferrer" href="${mapSearch(item.map)}">Google Maps</a></article>`).join('')}</section>`);
  document.querySelectorAll('[data-edit-experience]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.editExperience), item = saved[index];
    const status = prompt('Booking status', item.status); if (status === null) return;
    const price = prompt('Price', item.price); if (price === null) return;
    const confirmationNumber = prompt('Confirmation number', item.confirmationNumber); if (confirmationNumber === null) return;
    const notes = prompt('Notes', item.notes); if (notes === null) return;
    const bookingLink = prompt('Booking link (leave blank if unconfirmed)', item.bookingLink); if (bookingLink === null) return;
    saved[index] = { ...item, status, price, confirmationNumber, notes, bookingLink };
    experienceStore.set('trip-experiences', saved); renderExperiences({ ...content, experiences: saved });
  }));
}
document.addEventListener('trip-data-loaded', event => renderExperiences(event.detail));
