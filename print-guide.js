let printContent;
function guideImage(name, attractions) {
  const match = attractions.find(item => item.name === name);
  return match ? `https://images.unsplash.com/${match.image}?auto=format&fit=crop&w=700&q=72` : '';
}
function renderPrintGuide(content) {
  printContent = content;
  const hotels = content.hotels;
  const budget = Object.entries(content.budget.categories).map(([name,value]) => `<li><b>${name}</b> ${value.toLocaleString('en-US')} JPY</li>`).join('');
  document.querySelector('#print-guide').innerHTML = `<header class="print-hero"><div><p>JAPAN 2026</p><h1>Tokyo · Kyoto · Osaka Day Trip</h1><span>December 3–10, 2026</span><small>Seven-day travel guide · actual itinerary</small></div></header><main>${content.itinerary.map((day,index) => { const hotel = day.city.includes('Kyoto') || day.city.includes('Osaka') ? hotels.Kyoto : hotels.Tokyo; const photo = guideImage(day.image, content.attractions); return `<article class="print-day"><aside><span>DAY ${index + 1}</span><strong>${day.date.replace(', 2026','')}</strong><b>${day.city}</b><i>${index === 3 ? '→' : '◉'}</i></aside><section class="print-plan"><h2>${day.title}</h2><ul>${day.stops.map(stop => `<li><b>${stop.time}</b> ${stop.name} <em class="${stop.cost === 'FREE' ? 'free' : 'paid'}">${stop.cost}</em><small>${stop.transport} · ${stop.duration}</small></li>`).join('')}</ul></section><figure>${photo ? `<img src="${photo}" alt="${day.title}">` : ''}</figure><section class="print-stay"><h3>Stay + notes</h3><b>${hotel.name}</b><p>${hotel.dates}</p><p><strong>Station:</strong> ${hotel.station}</p><p>${day.note}</p></section></article>`; }).join('')}</main><footer class="print-guide-footer"><article><h3>Getting around</h3><p>Use Suica, PASMO or ICOCA for city transit. Reserve Shinkansen space for oversized luggage. Kyoto to Osaka is a day trip by rail.</p></article><article><h3>Budget guide</h3><ul>${budget}</ul></article><article><h3>Packing</h3><p>Winter jacket, thermals, walking shoes, gloves/scarf, power bank, adapter, passport and IC card.</p></article><article><h3>Travel tips</h3><p>Queue for trains, keep calls quiet, carry cash and a small rubbish bag, and follow shrine photography signs.</p></article><article><h3>Must-try food</h3><p>Sushi · ramen · tempura · takoyaki · okonomiyaki · matcha desserts</p></article></footer>`;
}
document.addEventListener('trip-data-loaded', event => renderPrintGuide(event.detail));
document.querySelector('#print').addEventListener('click', () => { if (!printContent) return; window.print(); });
