/**
 * Головний контролер сайту «Наша маленька історія»
 */
document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Стан і навігація між екранами
  // =========================================================================
  const screenPassword = document.getElementById('screen-password');
  const screenEnvelope = document.getElementById('screen-envelope');
  const screenMain = document.getElementById('screen-main');

  const viewMemories = document.getElementById('view-memories');
  const viewReasons = document.getElementById('view-reasons');
  const viewOpenWhen = document.getElementById('view-open-when');
  const viewFinal = document.getElementById('view-final');

  const views = [viewMemories, viewReasons, viewOpenWhen, viewFinal];

  function showScreen(screen) {
    [screenPassword, screenEnvelope, screenMain].forEach(s => {
      if (s) {
        s.classList.remove('active');
        s.classList.add('hidden');
      }
    });
    if (screen) {
      screen.classList.remove('hidden');
      // Примусовий reflow для плавної анімації
      void screen.offsetWidth;
      screen.classList.add('active');
    }
  }

  function openSectionView(viewElement) {
    views.forEach(v => {
      if (v) {
        v.classList.remove('active');
        v.style.display = 'none';
      }
    });
    if (viewElement) {
      viewElement.style.display = 'block';
      void viewElement.offsetWidth;
      viewElement.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  function closeAllViews() {
    views.forEach(v => {
      if (v) {
        v.classList.remove('active');
        setTimeout(() => {
          v.style.display = 'none';
        }, 300);
      }
    });
  }

  // =========================================================================
  // 2. Вхід за паролем
  // Пароль: 120623
  // =========================================================================
  const passwordInput = document.getElementById('password-input');
  const passwordBtn = document.getElementById('password-btn');
  const passwordError = document.getElementById('password-error');
  const passwordCard = document.getElementById('password-card');

  function checkPassword() {
    const entered = passwordInput.value.trim();
    if (entered === '120623') {
      passwordError.classList.remove('visible');
      passwordError.textContent = '';
      
      // Перехід одразу до конверта
      showScreen(screenEnvelope);
    } else {
      passwordError.textContent = 'Киця, неправильно 😔 Спробуй ще раз 🥰';
      passwordError.classList.add('visible');
      if (passwordCard) {
        passwordCard.classList.remove('shake');
        void passwordCard.offsetWidth;
        passwordCard.classList.add('shake');
      }
      passwordInput.focus();
    }
  }

  if (passwordBtn) passwordBtn.addEventListener('click', checkPassword);
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkPassword();
    });
  }

  // =========================================================================
  // 3. Інтерактивний конверт “To My Princess”
  // =========================================================================
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const introModal = document.getElementById('intro-letter-modal');
  const introContentEl = document.getElementById('intro-letter-content');
  const btnEnterStory = document.getElementById('btn-enter-story');

  // Завантаження тексту вступного листа
  function loadIntroLetter() {
    const fallbackText = window.LETTERS_DATA?.intro?.content || 'Моя принцесо... З днем народження!';
    fetch('materials/letters/intro-letter.txt')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        if (introContentEl) introContentEl.textContent = text.trim();
      })
      .catch(() => {
        if (introContentEl) introContentEl.textContent = fallbackText;
      });
  }
  loadIntroLetter();

  let envelopeOpened = false;
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      if (envelopeOpened) return;
      envelopeOpened = true;
      envelopeWrapper.classList.add('opened');

      // Через коротку затримку для завершення анімації показуємо лист для зручного читання
      setTimeout(() => {
        if (introModal) introModal.classList.add('active');
      }, 750);
    });
  }

  if (btnEnterStory) {
    btnEnterStory.addEventListener('click', () => {
      if (introModal) introModal.classList.remove('active');
      showScreen(screenMain);
      if (window.MusicPlayer) {
        window.MusicPlayer.showFloatingBar();
      }
      window.scrollTo(0, 0);
    });
  }

  // =========================================================================
  // 4. Головна сторінка та меню
  // =========================================================================
  const btnScrollHub = document.getElementById('btn-scroll-hub');
  const hubSections = document.getElementById('hub-sections');

  if (btnScrollHub && hubSections) {
    btnScrollHub.addEventListener('click', () => {
      hubSections.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Клік по картках меню
  document.querySelectorAll('[data-open-view]').forEach(card => {
    card.addEventListener('click', () => {
      const viewId = card.getAttribute('data-open-view');
      const targetView = document.getElementById(viewId);
      if (targetView) openSectionView(targetView);
    });
  });

  // Кнопки повернення в меню з розділів
  document.querySelectorAll('.btn-back-menu').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllViews();
      if (hubSections) {
        hubSections.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 5. Розділ: «Наші спогади» (Галерея + Лайтбокс з друкуванням)
  // =========================================================================
  const memoriesGrid = document.getElementById('memories-grid');
  const memoryLightbox = document.getElementById('memory-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const typewriterText = document.getElementById('typewriter-text');
  const lightboxFeeling = document.getElementById('lightbox-feeling');
  const btnPrevMemory = document.getElementById('btn-prev-memory');
  const btnNextMemory = document.getElementById('btn-next-memory');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  let currentMemoryIndex = 0;
  const memoriesList = window.MEMORIES_DATA || [];

  function renderMemoriesGrid() {
    if (!memoriesGrid) return;
    memoriesGrid.innerHTML = '';

    memoriesList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'memory-thumb-card';
      card.innerHTML = `
        <div class="memory-thumb-img-wrap">
          <img src="${item.photo}" alt="Спогад ${item.id}" class="memory-thumb-img" loading="lazy">
          <span class="memory-thumb-badge">Спогад #${item.id}</span>
        </div>
        <div class="memory-thumb-info">
          <h4 class="memory-thumb-title">Спогад #${item.id}</h4>
          <p class="memory-thumb-location">📍 ${item.location || 'Наш момент'}</p>
        </div>
      `;
      card.addEventListener('click', () => openMemoryLightbox(index));
      memoriesGrid.appendChild(card);
    });
  }

  function openMemoryLightbox(index) {
    if (!memoriesList || memoriesList.length === 0) return;
    currentMemoryIndex = (index + memoriesList.length) % memoriesList.length;
    const mem = memoriesList[currentMemoryIndex];

    if (lightboxImg) lightboxImg.src = mem.photo;
    if (lightboxBadge) lightboxBadge.textContent = `Спогад ${mem.id} з ${memoriesList.length}`;
    if (lightboxLocation) {
      if (mem.location) {
        lightboxLocation.textContent = `📍 ${mem.location}`;
        lightboxLocation.style.display = 'inline-flex';
      } else {
        lightboxLocation.style.display = 'none';
      }
    }

    if (lightboxFeeling) {
      if (mem.feeling && mem.feeling.trim().length > 0) {
        lightboxFeeling.textContent = `💭 «${mem.feeling}»`;
        lightboxFeeling.style.display = 'block';
      } else {
        lightboxFeeling.style.display = 'none';
      }
    }

    if (memoryLightbox) {
      memoryLightbox.classList.add('active');
    }

    // Запуск машинописного друку тексту спогаду
    if (typewriterText && window.Typewriter) {
      window.Typewriter.start(typewriterText, mem.story || '', 30);
    }
  }

  function closeMemoryLightbox() {
    if (window.Typewriter) window.Typewriter.stop();
    if (memoryLightbox) memoryLightbox.classList.remove('active');
  }

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeMemoryLightbox);
  if (btnPrevMemory) btnPrevMemory.addEventListener('click', () => openMemoryLightbox(currentMemoryIndex - 1));
  if (btnNextMemory) btnNextMemory.addEventListener('click', () => openMemoryLightbox(currentMemoryIndex + 1));

  // Клік на фон лайтбоксу для закриття
  if (memoryLightbox) {
    memoryLightbox.addEventListener('click', (e) => {
      if (e.target === memoryLightbox) closeMemoryLightbox();
    });
  }

  // Керування клавіатурою для лайтбоксу
  document.addEventListener('keydown', (e) => {
    if (!memoryLightbox || !memoryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeMemoryLightbox();
    if (e.key === 'ArrowLeft') openMemoryLightbox(currentMemoryIndex - 1);
    if (e.key === 'ArrowRight') openMemoryLightbox(currentMemoryIndex + 1);
  });

  renderMemoriesGrid();

  // =========================================================================
  // 6. Розділ: «365 причин, чому я тебе кохаю»
  // =========================================================================
  const loveJar = document.getElementById('love-jar');
  const btnPickReason = document.getElementById('btn-pick-reason');
  const reasonModal = document.getElementById('reason-modal');
  const reasonNumberEl = document.getElementById('reason-number');
  const reasonTextEl = document.getElementById('reason-text');
  const btnNextReason = document.getElementById('btn-next-reason');
  const btnCloseReason = document.getElementById('btn-close-reason');

  let activeReasonsList = window.REASONS_DATA || [];

  // Спроба підвантажити з materials/reasons/reasons.json
  fetch('materials/reasons/reasons.json')
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        activeReasonsList = data;
      }
    })
    .catch(() => {
      // Використовується fallback з window.REASONS_DATA
    });

  function showRandomReason() {
    if (!activeReasonsList || activeReasonsList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * activeReasonsList.length);
    const item = activeReasonsList[randomIndex];

    if (reasonNumberEl) {
      reasonNumberEl.textContent = `Причина #${item.id || (randomIndex + 1)}`;
    }
    if (reasonTextEl) {
      reasonTextEl.textContent = item.text || item;
    }
    if (reasonModal) {
      reasonModal.classList.add('active');
    }
  }

  if (loveJar) loveJar.addEventListener('click', showRandomReason);
  if (btnPickReason) btnPickReason.addEventListener('click', showRandomReason);
  if (btnNextReason) btnNextReason.addEventListener('click', showRandomReason);
  if (btnCloseReason) {
    btnCloseReason.addEventListener('click', () => {
      if (reasonModal) reasonModal.classList.remove('active');
    });
  }
  if (reasonModal) {
    reasonModal.addEventListener('click', (e) => {
      if (e.target === reasonModal) reasonModal.classList.remove('active');
    });
  }

  // =========================================================================
  // 7. Розділ: «Відкрий, коли…» (5 листів)
  // =========================================================================
  const openWhenModal = document.getElementById('open-when-modal');
  const openWhenTitle = document.getElementById('open-when-modal-title');
  const openWhenBody = document.getElementById('open-when-modal-body');
  const btnCloseOpenWhen = document.getElementById('btn-close-open-when');

  const openWhenLetters = window.LETTERS_DATA?.openWhen || [];

  document.querySelectorAll('.envelope-card').forEach(card => {
    card.addEventListener('click', () => {
      const letterId = card.getAttribute('data-letter-id');
      const letterData = openWhenLetters.find(l => l.id === letterId);
      if (!letterData) return;

      if (openWhenTitle) openWhenTitle.textContent = letterData.title;

      // Спроба прочитати окремий файл з materials/letters/
      fetch(letterData.file)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.text();
        })
        .then(text => {
          if (openWhenBody) openWhenBody.textContent = text.trim();
        })
        .catch(() => {
          if (openWhenBody) openWhenBody.textContent = letterData.content;
        });

      if (openWhenModal) openWhenModal.classList.add('active');
    });
  });

  if (btnCloseOpenWhen) {
    btnCloseOpenWhen.addEventListener('click', () => {
      if (openWhenModal) openWhenModal.classList.remove('active');
    });
  }
  if (openWhenModal) {
    openWhenModal.addEventListener('click', (e) => {
      if (e.target === openWhenModal) openWhenModal.classList.remove('active');
    });
  }

  // =========================================================================
  // 8. Фінальний розділ: «Ще дещо для тебе…»
  // Серце, що пульсує і розкриває фінальне послання
  // =========================================================================
  const heartPortal = document.getElementById('heart-portal');
  const heartTouchHint = document.getElementById('heart-touch-hint');
  const finalMessageCard = document.getElementById('final-message-card');
  const finalMessageBody = document.getElementById('final-message-body');

  function loadFinalMessage() {
    const fallbackFinal = window.LETTERS_DATA?.final?.content || `Моя кохана, кожен день, проведений поруч із тобою — це справжнє диво. Дякую тобі за твою ніжність, за твою чарівну посмішку і за все те світло, яке ти принесла в моє життя. Я щасливий бути поруч із тобою і розділяти нашу спільну історію крок за кроком.`;

    fetch('materials/letters/final-message.txt')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        let cleaned = text.trim();
        // Запобігаємо дублюванню підпису, якщо користувач уже додав його в кінець файлу
        cleaned = cleaned.replace(/Я тебе кохаю,\s*моя дівчинко\s*❤️?/gi, '')
                         .replace(/Завжди твій\s*❤️?/gi, '')
                         .trim();
        if (finalMessageBody) finalMessageBody.textContent = cleaned;
      })
      .catch(() => {
        if (finalMessageBody) finalMessageBody.textContent = fallbackFinal;
      });
  }
  loadFinalMessage();

  if (heartPortal) {
    heartPortal.addEventListener('click', () => {
      heartPortal.style.transform = 'scale(1.35)';
      heartPortal.style.opacity = '0';
      if (heartTouchHint) heartTouchHint.style.display = 'none';

      setTimeout(() => {
        heartPortal.style.display = 'none';
        if (finalMessageCard) {
          finalMessageCard.classList.add('revealed');
        }
      }, 500);
    });
  }
});
