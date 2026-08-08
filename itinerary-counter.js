(() => {
  const update = () => {
    const counter = document.querySelector('#day-progress');
    const count = window.tripContent?.itinerary?.length;
    if (!counter || !count) return;
    const current = counter.textContent.match(/Day\s+(\d+)/i)?.[1] || '1';
    counter.textContent = `Day ${current} of ${count}`;
  };

  document.addEventListener('trip-data-loaded', () => setTimeout(update, 0));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-day]')) setTimeout(update, 0);
  });
})();
