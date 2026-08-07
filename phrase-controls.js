(() => {
  const search = document.querySelector('#phrase-search');
  document.querySelector('.header nav')?.insertAdjacentHTML('beforeend', '<a href="#phrasebook">Phrasebook</a>');
  document.querySelector('#mobile-nav')?.insertAdjacentHTML('beforeend', '<a href="#phrasebook">Phrasebook</a>');
  const book = document.querySelector('#phrasebook');
  if (!search || !book) return;
  const bar = search.parentElement;
  bar.insertAdjacentHTML('beforeend', '<button id="phrase-audio-ready" class="filter">🔊 Audio ready</button><button id="phrase-collapse" class="filter">Hide phrases</button>');
  const note = document.createElement('p');
  note.className = 'phrase-audio-note';
  document.querySelector('#phrase-categories').before(note);
  let audioOnly = false;
  const hasJapaneseVoice = () => speechSynthesis.getVoices().some(voice => voice.lang.toLowerCase().startsWith('ja'));
  const update = () => {
    const available = hasJapaneseVoice();
    note.textContent = available ? 'Japanese audio is available on this device.' : 'Japanese audio is unavailable on this device. Speech buttons will disable.';
    const button = document.querySelector('#phrase-audio-ready');
    button.disabled = !available;
    button.classList.toggle('active', audioOnly);
    document.querySelectorAll('[data-speak-phrase]').forEach(item => item.disabled = !available);
  };
  document.querySelector('#phrase-audio-ready').addEventListener('click', () => { audioOnly = !audioOnly; document.querySelector('#phrase-list').classList.toggle('audio-ready-filter', audioOnly); update(); });
  document.querySelector('#phrase-collapse').addEventListener('click', () => { book.classList.toggle('collapsed'); const collapsed = book.classList.contains('collapsed'); document.querySelector('#phrase-collapse').textContent = collapsed ? 'Show phrases' : 'Hide phrases'; });
  speechSynthesis.addEventListener?.('voiceschanged', update);
  document.addEventListener('click', () => setTimeout(update, 0));
  update();
})();
