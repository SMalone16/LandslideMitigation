const narration = document.getElementById('narration');
const audioToggle = document.getElementById('audio-toggle');
const fontToggle = document.getElementById('font-toggle');
const contrastToggle = document.getElementById('contrast-toggle');
const strategyButtons = document.querySelectorAll('.filter-button');
const strategyCards = document.querySelectorAll('.strategy-card');
const earthForm = document.querySelector('.earth-form');
const earthInput = document.getElementById('earth-search');
const hotspotButtons = document.querySelectorAll('.hotspots button');
const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
const causeCards = document.querySelectorAll('.cause-card');
const ipccFrame = document.getElementById('ipcc-frame');
const ipccFallback = document.getElementById('ipcc-fallback');

if (ipccFrame && ipccFallback) {
  const revealFallback = () => {
    ipccFallback.hidden = false;
  };

  const fallbackTimer = window.setTimeout(revealFallback, 6000);

  ipccFrame.addEventListener('load', () => {
    window.clearTimeout(fallbackTimer);
    try {
      const doc = ipccFrame.contentDocument;
      if (!doc || !doc.body || doc.body.children.length === 0) {
        revealFallback();
      }
    } catch (error) {
      // Cross-origin access is expected when the embed loads successfully.
    }
  });

  ipccFrame.addEventListener('error', () => {
    window.clearTimeout(fallbackTimer);
    revealFallback();
  });
}

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

function buildEarthWebUrl({ latitude, longitude, altitude, query }) {
  if (query) {
    return `https://earth.google.com/web/search/${encodeURIComponent(query)}`;
  }

  const lat = Number(latitude);
  const lon = Number(longitude);
  const safeAltitude = Math.max(Number(altitude) || 5000, 500);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return `https://earth.google.com/web/@${lat},${lon},${safeAltitude}a,0d,60y,0h,0t,0r`;
  }

  return 'https://earth.google.com/web';
}

function openGoogleEarthDestination({ latitude, longitude, altitude, query, label }) {
  const destinationUrl = buildEarthWebUrl({ latitude, longitude, altitude, query });

  if (isIOSDevice) {
    const iosParams = [];
    if (Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))) {
      iosParams.push(`ll=${Number(latitude)},${Number(longitude)}`);
    }
    const searchLabel = label || query;
    if (searchLabel) {
      iosParams.push(`q=${encodeURIComponent(searchLabel)}`);
    }

    if (iosParams.length > 0) {
      const iosUrl = `comgoogleearth://?${iosParams.join('&')}`;
      const iosWindow = window.open(iosUrl, '_blank');
      if (!iosWindow) {
        window.location.href = iosUrl;
      }
      window.setTimeout(() => {
        const fallbackWindow = window.open(destinationUrl, '_blank', 'noopener');
        if (!fallbackWindow) {
          window.location.href = destinationUrl;
        }
      }, 1200);
      return;
    }
  }

  const webWindow = window.open(destinationUrl, '_blank', 'noopener');
  if (!webWindow) {
    window.location.href = destinationUrl;
  }
}

if (earthForm) {
  earthForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = earthInput.value.trim();
    if (!query) {
      alert('Type a place to visit in Google Earth!');
      return;
    }
    openGoogleEarthDestination({ query });
  });
}

hotspotButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const coords = button.dataset.coords;
    if (!coords) {
      return;
    }
    const [latitude, longitude] = coords.split(',').map((value) => value.trim());
    const altitude = button.dataset.alt;
    const label = button.dataset.label || button.textContent.trim();
    openGoogleEarthDestination({ latitude, longitude, altitude, label });
  });
});

causeCards.forEach((card) => {
  card.addEventListener('click', () => {
    alert(`${card.querySelector('.cause-term').textContent}:\n${card.querySelector('.cause-explain').textContent}`);
  });
});
