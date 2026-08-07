// Content layer: edit /data JSON files to update the trip without touching the app code.
async function loadTripContent() {
  const files = ['attractions','itinerary','budget','hotels','restaurants','experiences','optional'];
  const responses = await Promise.all(files.map(async file => {
    const response = await fetch(`data/${file}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not load ${file}.json`);
    return [file, await response.json()];
  }));
  const content = Object.fromEntries(responses);
  window.tripContent = content;
  const restaurants = content.restaurants;
  places.splice(0, places.length, ...content.attractions.map(place => ({
    ...place,
    restaurants: restaurants[place.name] || restaurants[place.city] || ['Nearby cafe', 'Convenience store', 'Station restroom'],
    image: `https://images.unsplash.com/${place.image}?auto=format&fit=crop&w=900&q=78`
  })));
  days.splice(0, days.length, ...content.itinerary.map(day => [day.date, day.city, day.title, day.leaveBy, day.note, day.image]));
  plan.splice(0, plan.length, ...content.itinerary.map(day => day.stops.map(stop => [stop.time, stop.name, stop.transport, stop.duration, stop.cost])));
  Object.keys(budget).forEach(key => delete budget[key]);
  Object.assign(budget, content.budget.categories);
  document.dispatchEvent(new CustomEvent('trip-data-loaded', { detail: content }));
  renderDay();
  renderPlaces();
  renderBudget();
  tools();
}
loadTripContent().catch(error => {
  console.warn('Trip JSON could not load; using offline fallback content.', error);
});
