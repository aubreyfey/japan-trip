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
function ensurePrintPreview() {
  if (document.querySelector('#print-preview')) return;
  const preview = document.createElement('dialog');
  preview.id = 'print-preview';
  preview.innerHTML = '<div class="preview-toolbar"><strong>Itinerary print preview</strong><div><button id="preview-close" class="button quiet">Close preview</button><button id="preview-print-action" class="button primary">Print / Save PDF</button></div></div><div id="print-preview-content"></div>';
  document.body.append(preview);
  preview.querySelector('#preview-close').addEventListener('click', () => preview.close());
  preview.querySelector('#preview-print-action').addEventListener('click', () => window.print());
}
function openPrintPreview() {
  if (!printContent && window.tripContent) renderPrintGuide(window.tripContent);
  ensurePrintPreview();
  const guide = document.querySelector('#print-guide');
  const target = document.querySelector('#print-preview-content');
  target.innerHTML = guide ? guide.innerHTML : '<p>The itinerary is still loading. Please try again in a moment.</p>';
  document.querySelector('#print-preview').showModal();
}
document.querySelector('#print').addEventListener('click', () => { if (!printContent && window.tripContent) renderPrintGuide(window.tripContent); window.print(); });
document.querySelector('.hero-actions').insertAdjacentHTML('beforeend', '<button id="preview-print" class="button quiet">Itinerary print preview</button>');
document.querySelector('#preview-print').addEventListener('click', openPrintPreview);
const printPreviewStyle = document.createElement('style');
printPreviewStyle.textContent = '#print-preview{width:min(1180px,96vw);height:min(92vh,900px);max-width:none;background:#f7f1ec;color:#17201d;border:0;box-shadow:0 24px 80px #0008}#print-preview::backdrop{background:#0009}.preview-toolbar{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:#fff;border-bottom:1px solid #ddd}#print-preview-content{padding:12px;transform-origin:top center}#print-preview-content .print-hero{height:155px;padding:25px 35px;background:linear-gradient(90deg,#f7c9d1d9,#fff5eed9),url(\'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=72\') center/cover;border-bottom:3px solid #a84943}#print-preview-content .print-hero h1{font:600 30px Georgia,serif;margin:5px 0}#print-preview-content .print-day{display:grid;grid-template-columns:90px 1.55fr 160px 1fr;gap:7px;padding:7px 0;border-bottom:1px solid #dfd1c8}#print-preview-content .print-day aside{padding:9px;background:#f9dce0;text-align:center}#print-preview-content .print-plan h2{font:600 17px Georgia,serif;margin:0}#print-preview-content .print-day img{width:100%;height:120px;object-fit:cover}#print-preview-content .print-stay{padding:8px;background:#e8f0e5;font-size:11px}#print-preview-content .print-stay h3{margin:0}#print-preview-content .print-guide-footer{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding-top:9px}#print-preview-content .print-guide-footer article{padding:8px;background:#f8e9e4;font-size:10px}@media(max-width:680px){#print-preview{width:100vw;height:100dvh}.preview-toolbar{padding:10px}#print-preview-content{min-width:800px;transform:scale(.54);width:185%;padding:8px;transform-origin:top left}}';
document.head.append(printPreviewStyle);
