let loadedItinerary = [];
function renderActivityDetails() {
  const day = loadedItinerary[state.day - 1];
  if (!day) return;
  document.querySelectorAll('#day-view .stop').forEach((node, index) => {
    const item = day.stops[index];
    if (!item || node.querySelector('.activity-detail')) return;
    const booking = item.bookingRequired ? '<span class="booking-badge">Booking required</span>' : '';
    node.insertAdjacentHTML('beforeend', `<div class="activity-detail">${booking}<span><b>Station:</b> ${item.station}</span><span><b>Travel:</b> ${item.travelTime}</span><span><b>Price:</b> ${item.price}</span><span><b>Best time:</b> ${item.bestTime}</span><span><b>Photo:</b> ${item.photoTip}</span><p>${item.notes}</p><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.city + ' Japan')}">Google Maps</a>${item.bookingRequired ? '<button class="book-button" type="button" title="Booking details to be confirmed">Book experience</button>' : ''}</div>`);
  });
}
document.addEventListener('trip-data-loaded', event => { loadedItinerary = event.detail.itinerary; setTimeout(renderActivityDetails, 0); });
document.addEventListener('click', event => { if (event.target.closest('[data-day]')) setTimeout(renderActivityDetails, 0); if (event.target.closest('.book-button')) document.querySelector('#bookings').scrollIntoView({ behavior: 'smooth' }); });
