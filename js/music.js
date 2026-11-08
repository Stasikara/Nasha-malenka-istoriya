/**
 * Музичний програвач з вініловою платівкою (Adele — Lovesong)
 */
(function() {
  const audio = new Audio();
  audio.src = 'materials/music/lovesong.mp3';
  audio.preload = 'metadata';

  let isPlaying = false;
  let hasError = false;

  // Елементи інтерфейсу програвача
  const vinylRecord = document.getElementById('vinyl-record');
  const tonearm = document.getElementById('turntable-tonearm');
  const btnPlayMain = document.getElementById('btn-play-main');
  const progressFill = document.getElementById('track-progress-fill');
  const progressBar = document.getElementById('track-progress-bar');
  const timeCurrent = document.getElementById('track-time-current');
  const timeTotal = document.getElementById('track-time-total');
  const volumeSlider = document.getElementById('player-volume');
  const trackStatus = document.getElementById('track-status-text');

  // Елементи плаваючого міні-бару
  const floatingBar = document.getElementById('floating-music-bar');
  const miniDisc = document.getElementById('mini-disc');
  const miniBtnPlay = document.getElementById('mini-btn-play');
  const miniStatus = document.getElementById('mini-music-status');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updatePlayState(playing) {
    isPlaying = playing;

    if (playing) {
      if (vinylRecord) vinylRecord.classList.add('spinning');
      if (miniDisc) miniDisc.classList.add('spinning');
      if (tonearm) tonearm.classList.add('playing');
      if (btnPlayMain) btnPlayMain.innerHTML = '⏸';
      if (miniBtnPlay) miniBtnPlay.innerHTML = '⏸';
      if (trackStatus) trackStatus.textContent = 'Відтворюється...';
      if (miniStatus) miniStatus.textContent = 'Грає';
    } else {
      if (vinylRecord) vinylRecord.classList.remove('spinning');
      if (miniDisc) miniDisc.classList.remove('spinning');
      if (tonearm) tonearm.classList.remove('playing');
      if (btnPlayMain) btnPlayMain.innerHTML = '▶';
      if (miniBtnPlay) miniBtnPlay.innerHTML = '▶';
      if (trackStatus && !hasError) trackStatus.textContent = 'На паузі';
      if (miniStatus && !hasError) miniStatus.textContent = 'Пауза';
    }
  }

  function togglePlay() {
    if (hasError) {
      alert('Аудіофайл materials/music/lovesong.mp3 не знайдено або не може бути відтворено.');
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        updatePlayState(true);
        if (floatingBar) floatingBar.classList.remove('hidden');
      }).catch(err => {
        console.warn('Автоматичне відтворення заблоковане або файл недоступний:', err);
      });
    }
  }

  // Обробка подій аудіо
  audio.addEventListener('play', () => updatePlayState(true));
  audio.addEventListener('pause', () => updatePlayState(false));

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    updatePlayState(false);
    if (progressFill) progressFill.style.width = '0%';
    if (timeCurrent) timeCurrent.textContent = '0:00';
  });

  audio.addEventListener('error', (e) => {
    hasError = true;
    updatePlayState(false);
    if (trackStatus) trackStatus.textContent = 'Файл музики відсутній';
    if (miniStatus) miniStatus.textContent = 'Немає аудіо';
    console.warn('Не вдалося завантажити lovesong.mp3, сайт продовжує працювати без музики.');
  });

  // Клік на прогрес-бар
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      audio.currentTime = percent * audio.duration;
    });
  }

  // Гучність
  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
    });
  }

  // Прив'язка кнопок
  if (btnPlayMain) btnPlayMain.addEventListener('click', togglePlay);
  if (miniBtnPlay) miniBtnPlay.addEventListener('click', togglePlay);

  // Експорт у глобальну область для взаємодії
  window.MusicPlayer = {
    toggle: togglePlay,
    play: () => audio.play().then(() => updatePlayState(true)).catch(() => {}),
    pause: () => audio.pause(),
    showFloatingBar: () => {
      if (floatingBar) floatingBar.classList.remove('hidden');
    }
  };
})();
