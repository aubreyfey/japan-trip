(() => {
  const $ = (s) => document.querySelector(s);
  const store = { get(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } }, set(k, v) { localStorage.setItem(k, JSON.stringify(v)); } };
  const fmt = (n) => `¥${Math.round(Number(n || 0)).toLocaleString('en-US')}`;
  const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  const stops = ['Tokyo hotel','Shibuya','Meiji Jingu','Harajuku','Shinjuku','Senso-ji Temple','Akihabara','Tokyo Station','Odaiba','Kyoto hotel','Fushimi Inari Taisha','Gion','Yasaka Shrine','Kiyomizu-dera','Ninenzaka & Sannenzaka','Arashiyama Bamboo Grove','Narita International Airport (NRT)'];
  const transport = {
    'Tokyo hotel|Shibuya':['JR / Metro','15-25 min','¥180-220','5-10 min walk from station'],
    'Shibuya|Meiji Jingu':['JR Yamanote','13 min','¥150','8 min walk from Harajuku Station'],
    'Meiji Jingu|Harajuku':['Walk','8 min','FREE','Direct forest approach'],
    'Harajuku|Shinjuku':['JR Yamanote','8 min','¥150','5 min station walk'],
    'Senso-ji Temple|Akihabara':['Metro + JR','25 min','¥220','8 min walk'],
    'Akihabara|Tokyo Station':['JR Yamanote','10 min','¥150','5 min station walk'],
    'Tokyo Station|Odaiba':['JR + Yurikamome','32 min','¥470','7 min walk'],
    'Tokyo Station|Kyoto hotel':['Tokaido Shinkansen Nozomi','2 hr 15 min','~¥14,500','Reserve oversized luggage space if needed'],
    'Kyoto hotel|Fushimi Inari Taisha':['JR Nara Line','18 min','¥150','3 min walk from Inari Station'],
    'Fushimi Inari Taisha|Gion':['Keihan Main Line','28 min','¥220','10 min walk'],
    'Gion|Yasaka Shrine':['Walk','8 min','FREE','Flat, easy evening connection'],
    'Yasaka Shrine|Kiyomizu-dera':['Walk / taxi','22 min walk','FREE / ~¥1,000 taxi','Hilly route; taxi is sensible in rain'],
    'Kiyomizu-dera|Ninenzaka & Sannenzaka':['Walk','6 min','FREE','Steep but direct'],
    'Kyoto hotel|Arashiyama Bamboo Grove':['JR Sagano Line','32 min','¥240','12 min walk from Saga-Arashiyama'],
    'Kyoto hotel|Narita International Airport (NRT)':['Shinkansen + Narita Express','4 hr 30 min–5 hr 30 min','~¥17,500','Kyoto Station → Nozomi to Tokyo → Narita Express. Build in a 90-minute airport buffer.']
  };
  const readiness = ['Passport / wallet / IC card','Phone and power bank','Weather layer or compact umbrella','Hotel key and offline route','Water and small trash bag'];

  function renderCalculator() {
    const values = ['calcTravelers','calcDays','calcFood','calcTransit','calcShopping','calcAttractions'].map(id => Number($(`#${id}`).value || 0));
    const [people, days, food, transit, shopping, attractions] = values;
    const variable = people * days * (food + transit);
    const personal = people * (shopping + attractions);
    $('#calculatorTotal').textContent = fmt(variable + personal);
    $('#calculatorBreakdown').textContent = `${fmt(variable)} daily essentials + ${fmt(personal)} shopping and attractions`;
    store.set('japan-calculator', values);
  }
  function renderConverter() {
    const rates = { JPY: 1, USD: 150, PHP: 2.6 };
    const amount = Number($('#currencyAmount').value || 0);
    const from = $('#currencyFrom').value, to = $('#currencyTo').value;
    const value = amount * rates[from] / rates[to];
    const prefix = { JPY:'¥', USD:'$', PHP:'₱' }[to];
    $('#currencyResult').textContent = `${prefix}${value.toLocaleString('en-US', { maximumFractionDigits: to === 'JPY' ? 0 : 2 })}`;
  }
  function renderTransport() {
    const from = $('#transportStart').value, to = $('#transportDestination').value;
    const result = transport[`${from}|${to}`] || transport[`${to}|${from}`] || ['Rail / walking','25-40 min','¥200-500','Check Google Maps on the day for disruption-aware routing'];
    $('#transportPlan').innerHTML = `<strong>${result[0]} · ${result[1]}</strong><span>Estimated fare: ${result[2]} · ${result[3]}</span>`;
  }
  function renderQr() {
    const place = $('#qrDestination').value, link = mapUrl(`${place}, Japan`), target = $('#qrCode');
    target.innerHTML = '';
    if (window.QRCode) new QRCode(target, { text: link, width: 132, height: 132, colorDark: '#18201e', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
    else target.textContent = 'QR generator unavailable.';
    $('#qrMapLink').href = link;
  }
  function renderChecklist(day = 1) {
    const saved = store.get('japan-daily-readiness', {});
    $('#dailyCheckTabs').innerHTML = Array.from({length:7}, (_,i) => `<button class="${day === i + 1 ? 'active':''}" data-ready-day="${i+1}">D${i+1}</button>`).join('');
    $('#dailyChecklist').innerHTML = readiness.map((item, i) => `<label><input data-ready-item="${i}" type="checkbox" ${saved[day]?.includes(i) ? 'checked':''}/> ${item}</label>`).join('');
    $('#dailyChecklist').dataset.day = day;
  }
  function renderFlights() {
    const defaults = { airline:'Add airline', outbound:'Add arrival flight', returnFlight:'Narita International Airport (NRT)', terminal:'Add terminal', notes:'Dec 10: Kyoto Station → Nozomi to Tokyo → Narita Express. Allow 4.5–5.5 hours.' };
    const f = { ...defaults, ...store.get('japan-flight', {}) };
    if (f.returnFlight === 'Add return flight') f.returnFlight = defaults.returnFlight;
    $('#flightDetails').innerHTML = `<span>Airline<strong>${f.airline}</strong></span><span>Outbound<strong>${f.outbound}</strong></span><span>Return<strong>${f.returnFlight}</strong></span><span>Terminal<strong>${f.terminal}</strong></span><span>Notes<strong>${f.notes}</strong></span>`;
  }
  function renderWeather() {
    $('#weatherRecommendations').innerHTML = [
      ['Thermometer','Tokyo: 8-14°C','Layer a knit or fleece under a light insulated jacket.'],
      ['Cloud-rain','Kyoto: 4-13°C','Carry a compact umbrella; evenings are materially colder.'],
      ['Footprints','Walking days','Broken-in waterproof shoes beat fashionable shoes.'],
      ['Sunset','After dark','Scarf, warm socks and a portable battery belong in the day bag.']
    ].map(([icon,title,text]) => `<div class="weather-row"><i data-lucide="${icon.toLowerCase()}"></i><div><strong>${title}</strong><span>${text}</span></div></div>`).join('');
  }
  function downloadItinerary() {
    const text = itinerary.map(d => `${d.date} - ${d.title}\n${d.blocks.map(([period,items]) => `${period}: ${items.map(i => i[0]).join(' → ')}`).join('\n')}\n`).join('\n') + '\nDec 10: Kyoto Station → Nozomi to Tokyo → Narita Express to Narita International Airport (NRT). Allow 4.5–5.5 hours door to terminal.';
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain'}));
    const a = Object.assign(document.createElement('a'), { href:url, download:'japan-escape-itinerary.txt' });
    a.click(); URL.revokeObjectURL(url);
  }
  function init() {
    const saved = store.get('japan-calculator', [2,7,6000,1500,30000,12000]);
    ['calcTravelers','calcDays','calcFood','calcTransit','calcShopping','calcAttractions'].forEach((id,i) => { $(`#${id}`).value = saved[i]; $(`#${id}`).addEventListener('input',renderCalculator); });
    renderCalculator();
    ['currencyAmount','currencyFrom','currencyTo'].forEach(id => $(`#${id}`).addEventListener('input',renderConverter)); renderConverter();
    ['transportStart','transportDestination','qrDestination','journalDay'].forEach(id => { $(`#${id}`).innerHTML = stops.map(x=>`<option>${x}</option>`).join(''); });
    $('#transportStart').value='Tokyo hotel'; $('#transportDestination').value='Shibuya'; $('#qrDestination').value='Shibuya';
    $('#transportStart').addEventListener('change',renderTransport); $('#transportDestination').addEventListener('change',renderTransport); $('#qrDestination').addEventListener('change',renderQr); renderTransport(); renderQr();
    renderWeather(); renderChecklist(); renderFlights();
    $('#dailyCheckTabs').addEventListener('click', e=> { const b=e.target.closest('[data-ready-day]'); if(b) renderChecklist(Number(b.dataset.readyDay)); });
    $('#dailyChecklist').addEventListener('change', e => { if(!e.target.matches('[data-ready-item]'))return; const day=$('#dailyChecklist').dataset.day, all=store.get('japan-daily-readiness',{}), item=Number(e.target.dataset.readyItem), current=all[day]||[]; all[day]=e.target.checked?[...new Set([...current,item])]:current.filter(x=>x!==item); store.set('japan-daily-readiness',all); });
    $('#journalDay').innerHTML = Array.from({length:7},(_,i)=>`<option value="${i+1}">Day ${i+1} · ${itinerary[i].date}</option>`).join('');
    const loadJournal=()=>{$('#journalEntry').value=store.get('japan-journal',{})[$('#journalDay').value]||''}; loadJournal(); $('#journalDay').addEventListener('change',loadJournal); let timer; $('#journalEntry').addEventListener('input', e=>{clearTimeout(timer);timer=setTimeout(()=>{const j=store.get('japan-journal',{});j[$('#journalDay').value]=e.target.value;store.set('japan-journal',j);$('#journalStatus').textContent='Saved locally'},250)});
    $('#editFlights').addEventListener('click',()=>{const old=store.get('japan-flight',{});const next={airline:prompt('Airline',old.airline||'')??old.airline,outbound:prompt('Outbound flight',old.outbound||'')??old.outbound,returnFlight:prompt('Return flight',old.returnFlight||'')??old.returnFlight,terminal:prompt('Terminal',old.terminal||'')??old.terminal,notes:prompt('Baggage / transfer notes',old.notes||'')??old.notes};store.set('japan-flight',next);renderFlights()});
    $('#expenseForm').addEventListener('submit',()=>setTimeout(()=>{const entries=store.get('japan-expenses',[]);const last=entries[entries.length-1];if(last){last.day=$('#expenseDay').value;store.set('japan-expenses',entries);document.querySelectorAll('.expense-item small').forEach((node,i)=>{const entry=entries.slice().reverse()[i];if(entry?.day)node.textContent=`${entry.category} · Day ${entry.day}`})}},0));
    $('#downloadItinerary').addEventListener('click',downloadItinerary); $('#printItinerary').addEventListener('click',()=>print());
    window.lucide?.createIcons();
  }
  init();
})();
