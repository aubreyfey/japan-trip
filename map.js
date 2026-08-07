(() => {
  const board = document.querySelector('#map-board');
  if (!board) return;
  let mode = 'day';
  const render = () => {
    const active = plan[state.day - 1].map(item => item[1]);
    const visible = mode === 'day' ? places.filter(place => active.includes(place.name)) : places.filter(place => place.city === mode);
    document.querySelector('#map-filters').innerHTML = [['day','Active day'],['Tokyo','Tokyo'],['Kyoto','Kyoto']].map(([value,label]) => `<button class="filter ${mode === value ? 'active' : ''}" data-map-mode="${value}">${label}</button>`).join('');
    board.innerHTML = `<span class="map-city tokyo">Tokyo</span><span class="map-city kyoto">Kyoto</span>${visible.map((place,index) => `<button class="map-pin ${place.city.toLowerCase()}" style="left:${18 + (index * 17) % 68}%;top:${24 + (index * 23) % 54}%" data-map-place="${place.name}" aria-label="View ${place.name}"><b>●</b><span>${place.name}</span></button>`).join('')}`;
    const day = days[state.day - 1];
    document.querySelector('#map-summary').innerHTML = `<p class="eyebrow">${day[0]} · ${day[1]}</p><h3>${day[2]}</h3><p>${active.length} anchors with walking and train guidance.</p>${plan[state.day - 1].map(item => `<div><b>${item[1]}</b><span>${item[2]} · ${item[3]}</span></div>`).join('')}<a class="button primary" target="_blank" rel="noreferrer" href="${maps(active.join(' to '))}">Open route in Google Maps</a>`;
  };
  document.addEventListener('click', event => {
    const filter = event.target.closest('[data-map-mode]');
    if (filter) { mode = filter.dataset.mapMode; render(); }
    const pin = event.target.closest('[data-map-place]');
    if (pin) dialog(pin.dataset.mapPlace);
    if (event.target.closest('[data-day]')) render();
    if (event.target.closest('[data-mode="trip"]')) document.querySelector('#budget-caption').textContent = 'Full trip';
  });
  document.addEventListener('trip-data-loaded', render);
  render();
})();
