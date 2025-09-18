const narration = document.getElementById('narration');
const audioToggle = document.getElementById('audio-toggle');
const fontToggle = document.getElementById('font-toggle');
const contrastToggle = document.getElementById('contrast-toggle');
const strategyButtons = document.querySelectorAll('.filter-button');
const strategyCards = document.querySelectorAll('.strategy-card');
const earthForm = document.querySelector('.earth-form');
const earthInput = document.getElementById('earth-search');
const hotspotButtons = document.querySelectorAll('.hotspots button');
const causeCards = document.querySelectorAll('.cause-card');

if (audioToggle && narration) {
  audioToggle.addEventListener('click', () => {
    const isPlaying = !narration.paused;
    if (isPlaying) {
      narration.pause();
      audioToggle.setAttribute('aria-pressed', 'false');
      audioToggle.textContent = '🔊 Read Aloud';
    } else {
      narration
        .play()
        .then(() => {
          audioToggle.setAttribute('aria-pressed', 'true');
          audioToggle.textContent = '⏸ Pause Audio';
        })
        .catch(() => {
          alert('Audio narration is not available right now.');
        });
    }
  });

  narration.addEventListener('ended', () => {
    audioToggle.setAttribute('aria-pressed', 'false');
    audioToggle.textContent = '🔊 Read Aloud';
  });
}

if (fontToggle) {
  fontToggle.addEventListener('click', () => {
    const isLarge = document.body.classList.toggle('large-text');
    fontToggle.setAttribute('aria-pressed', String(isLarge));
  });
}

if (contrastToggle) {
  contrastToggle.addEventListener('click', () => {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    contrastToggle.setAttribute('aria-pressed', String(isHighContrast));
  });
}

function filterStrategies(tag) {
  strategyCards.forEach((card) => {
    const tags = card.dataset.tags.split(' ');
    const shouldShow = tag === 'all' || tags.includes(tag);
    card.style.display = shouldShow ? 'flex' : 'none';
  });
}

strategyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    strategyButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    filterStrategies(button.dataset.filter);
  });
});

if (earthForm) {
  earthForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = earthInput.value.trim();
    if (!query) {
      alert('Type a place to visit in Google Earth!');
      return;
    }
    const url = new URL('https://earth.google.com/web');
    url.searchParams.set('q', query);
    window.open(url.toString(), '_blank', 'noopener');
  });
}

hotspotButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const coords = button.dataset.coords;
    if (!coords) return;
    const url = new URL('https://earth.google.com/web');
    url.searchParams.set('flyto', coords);
    window.open(url.toString(), '_blank', 'noopener');
  });
});

causeCards.forEach((card) => {
  card.addEventListener('click', () => {
    alert(`${card.querySelector('.cause-term').textContent}:\n${card.querySelector('.cause-explain').textContent}`);
  });
});
