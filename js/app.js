/**
 * Головний контролер сайту «Наша маленька історія»
 * Агент 2: Повний аудит, стабільність, романтичні анімації та відповідність вимогам
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
      void screen.offsetWidth; // Reflow для запуску CSS-переходів
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

      // Якщо відкрито фінальний розділ — підсилюємо ніжні сердечка
      if (viewElement.id === 'view-final') {
        if (window.ParticlesManager) {
          window.ParticlesManager.boostHearts(true);
        }
      }
    }
  }

  function closeAllViews() {
    if (window.ParticlesManager) {
      window.ParticlesManager.boostHearts(false);
    }

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
  // 2. Вхід за паролем: 120623
  // =========================================================================
  const passwordInput = document.getElementById('password-input');
  const passwordBtn = document.getElementById('password-btn');
  const passwordError = document.getElementById('password-error');
  const passwordCard = document.getElementById('password-card');

  function checkPassword() {
    if (!passwordInput) return;
    const entered = passwordInput.value.trim();
    if (entered === '120623') {
      if (passwordError) {
        passwordError.classList.remove('visible');
        passwordError.textContent = '';
      }
      // Прямий перехід до екрану конверта без зайвих вікон привітання
      showScreen(screenEnvelope);
    } else {
      if (passwordError) {
        passwordError.textContent = 'Киця, неправильно 😔 Спробуй ще раз 🥰';
        passwordError.classList.add('visible');
      }
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
  // 3. Інтерактивний конверт “To My Princess” та Вступний лист
  // =========================================================================
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const introModal = document.getElementById('intro-letter-modal');
  const introContentEl = document.getElementById('intro-letter-content');
  const btnEnterStory = document.getElementById('btn-enter-story');

  function loadIntroLetter() {
    const fallback = window.LETTERS_DATA?.intro?.content || '';
    fetch('materials/letters/intro-letter.txt')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        if (introContentEl) introContentEl.textContent = text.trim();
      })
      .catch(() => {
        if (introContentEl) introContentEl.textContent = fallback;
      });
  }
  loadIntroLetter();

  let envelopeOpened = false;
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      if (envelopeOpened) return;
      envelopeOpened = true;
      envelopeWrapper.classList.add('opened');

      // Після плавної анімації відкриття конверта показуємо великий лист
      setTimeout(() => {
        if (introModal) introModal.classList.add('active');
      }, 750);
    });
  }

  if (btnEnterStory) {
    btnEnterStory.addEventListener('click', () => {
      if (introModal) introModal.classList.remove('active');
      showScreen(screenMain);

      // Запуск музики після першої взаємодії користувача
      if (window.MusicPlayer) {
        window.MusicPlayer.play();
        window.MusicPlayer.showFloatingBar();
      }
      window.scrollTo(0, 0);
    });
  }

  // =========================================================================
  // 4. Головна сторінка: Скрол до хабу та навігація
  // =========================================================================
  const btnScrollHub = document.getElementById('btn-scroll-hub');
  const hubSections = document.getElementById('hub-sections');

  if (btnScrollHub && hubSections) {
    btnScrollHub.addEventListener('click', () => {
      hubSections.scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-open-view]').forEach(card => {
    card.addEventListener('click', () => {
      const viewId = card.getAttribute('data-open-view');
      const targetView = document.getElementById(viewId);
      if (targetView) openSectionView(targetView);
    });
  });

  document.querySelectorAll('.btn-back-menu').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllViews();
      if (hubSections) {
        hubSections.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 5. Розділ: «Наші спогади» (Галерея, Лайтбокс та Повноекранне фото)
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
  const btnZoomPhoto = document.getElementById('btn-zoom-photo');

  const photoFullscreenModal = document.getElementById('photo-fullscreen-modal');
  const fullscreenPhotoImg = document.getElementById('fullscreen-photo-img');
  const btnCloseFullscreenPhoto = document.getElementById('btn-close-fullscreen-photo');

  let currentMemoryIndex = 0;
  let memoriesList = window.MEMORIES_DATA || [];

  // Спроба підвантажити з materials/personal-texts/memories.json
  fetch('materials/personal-texts/memories.json')
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        memoriesList = data;
        renderMemoriesGrid();
      }
    })
    .catch(() => {
      // Fallback вже в memoriesList
      renderMemoriesGrid();
    });

  function renderMemoriesGrid() {
    if (!memoriesGrid) return;
    memoriesGrid.innerHTML = '';

    memoriesList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'memory-thumb-card';
      const feelingHtml = item.feeling && item.feeling.trim() ? `<p class="memory-thumb-feeling">💭 «${item.feeling}»</p>` : '';
      card.innerHTML = `
        <div class="memory-thumb-img-wrap">
          <img src="${item.photo}" alt="Спогад ${item.id}" class="memory-thumb-img" loading="lazy">
          <span class="memory-thumb-badge">Спогад #${item.id}</span>
        </div>
        <div class="memory-thumb-info">
          <div class="memory-thumb-header">
            <h4 class="memory-thumb-title">Спогад #${item.id}</h4>
            <span class="memory-thumb-location">📍 ${item.location || 'Наш момент'}</span>
          </div>
          <p class="memory-thumb-story">${item.story || ''}</p>
          ${feelingHtml}
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

    // Друк тексту спогаду без технічних міток
    if (typewriterText && window.Typewriter) {
      window.Typewriter.start(typewriterText, mem.story || '', 28);
    }
  }

  function closeMemoryLightbox() {
    if (window.Typewriter) window.Typewriter.stop();
    if (memoryLightbox) memoryLightbox.classList.remove('active');
    closeFullscreenPhoto();
  }

  function openFullscreenPhoto() {
    if (!memoriesList || memoriesList.length === 0) return;
    const mem = memoriesList[currentMemoryIndex];
    if (fullscreenPhotoImg) fullscreenPhotoImg.src = mem.photo;
    if (photoFullscreenModal) photoFullscreenModal.classList.remove('hidden');
  }

  function closeFullscreenPhoto() {
    if (photoFullscreenModal) photoFullscreenModal.classList.add('hidden');
  }

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeMemoryLightbox);
  if (btnPrevMemory) btnPrevMemory.addEventListener('click', () => openMemoryLightbox(currentMemoryIndex - 1));
  if (btnNextMemory) btnNextMemory.addEventListener('click', () => openMemoryLightbox(currentMemoryIndex + 1));
  
  if (btnZoomPhoto) btnZoomPhoto.addEventListener('click', openFullscreenPhoto);
  if (lightboxImg) lightboxImg.addEventListener('click', openFullscreenPhoto);
  if (btnCloseFullscreenPhoto) btnCloseFullscreenPhoto.addEventListener('click', closeFullscreenPhoto);
  if (photoFullscreenModal) {
    photoFullscreenModal.addEventListener('click', (e) => {
      if (e.target !== fullscreenPhotoImg) closeFullscreenPhoto();
    });
  }

  if (memoryLightbox) {
    memoryLightbox.addEventListener('click', (e) => {
      if (e.target === memoryLightbox) closeMemoryLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (photoFullscreenModal && !photoFullscreenModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        closeFullscreenPhoto();
        return;
      }
    }
    if (!memoryLightbox || !memoryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeMemoryLightbox();
    if (e.key === 'ArrowLeft') openMemoryLightbox(currentMemoryIndex - 1);
    if (e.key === 'ArrowRight') openMemoryLightbox(currentMemoryIndex + 1);
  });

  renderMemoriesGrid();

  // =========================================================================
  // 6. Розділ: «365 причин, чому я тебе кохаю»
  // Вимоги: без повторів до перегляду всіх, перегляд відкритих, завершення
  // =========================================================================
  const loveJar = document.getElementById('love-jar');
  const btnPickReason = document.getElementById('btn-pick-reason');
  const btnViewOpenedReasons = document.getElementById('btn-view-opened-reasons');
  const reasonsOpenedCountEl = document.getElementById('reasons-opened-count');
  const reasonsTotalCountEl = document.getElementById('reasons-total-count');

  const reasonModal = document.getElementById('reason-modal');
  const reasonNumberEl = document.getElementById('reason-number');
  const reasonTextEl = document.getElementById('reason-text');
  const btnNextReason = document.getElementById('btn-next-reason');
  const btnCloseReason = document.getElementById('btn-close-reason');
  const reasonHistoryNav = document.getElementById('reason-history-nav');
  const btnReasonPrev = document.getElementById('btn-reason-prev');
  const btnReasonNext = document.getElementById('btn-reason-next');
  const reasonHistoryPos = document.getElementById('reason-history-pos');
  const reasonCompletionBanner = document.getElementById('reason-completion-banner');

  let activeReasonsList = window.REASONS_DATA || [];
  let unviewedIndices = [];
  let viewedHistory = [];
  let currentHistoryIndex = -1;

  function initReasonsPool() {
    unviewedIndices = activeReasonsList.map((_, i) => i);
    viewedHistory = [];
    currentHistoryIndex = -1;
    updateReasonsUI();
  }

  function updateReasonsUI() {
    if (reasonsTotalCountEl) reasonsTotalCountEl.textContent = activeReasonsList.length;
    if (reasonsOpenedCountEl) reasonsOpenedCountEl.textContent = viewedHistory.length;
    if (btnViewOpenedReasons) {
      if (viewedHistory.length > 0) {
        btnViewOpenedReasons.classList.remove('hidden');
      } else {
        btnViewOpenedReasons.classList.add('hidden');
      }
    }
  }

  // Завантаження з materials/reasons/reasons.json
  fetch('materials/reasons/reasons.json')
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        activeReasonsList = data;
        initReasonsPool();
      }
    })
    .catch(() => {
      initReasonsPool();
    });

  function drawNextReason() {
    if (!activeReasonsList || activeReasonsList.length === 0) return;

    if (unviewedIndices.length > 0) {
      // Вибираємо випадкову причину із пулу ще не бачених
      const randomPos = Math.floor(Math.random() * unviewedIndices.length);
      const chosenIndex = unviewedIndices.splice(randomPos, 1)[0];
      viewedHistory.push(chosenIndex);
      currentHistoryIndex = viewedHistory.length - 1;
      displayReasonAtHistory(currentHistoryIndex);
      updateReasonsUI();
    } else {
      // Усі доступні причини вже переглянуто — показуємо останню із завершальним посланням
      if (viewedHistory.length > 0) {
        currentHistoryIndex = viewedHistory.length - 1;
        displayReasonAtHistory(currentHistoryIndex, true);
      }
    }
  }

  function displayReasonAtHistory(historyIdx, forceShowCompletion = false) {
    if (historyIdx < 0 || historyIdx >= viewedHistory.length) return;
    currentHistoryIndex = historyIdx;
    const reasonIndex = viewedHistory[historyIdx];
    const item = activeReasonsList[reasonIndex];

    if (reasonNumberEl) {
      reasonNumberEl.textContent = `Причина #${item.id || (reasonIndex + 1)}`;
    }
    if (reasonTextEl) {
      reasonTextEl.textContent = item.text || item;
    }

    // Навігація відкритих записок
    if (reasonHistoryNav) {
      if (viewedHistory.length > 1) {
        reasonHistoryNav.classList.remove('hidden');
        if (reasonHistoryPos) {
          reasonHistoryPos.textContent = `${historyIdx + 1} з ${viewedHistory.length}`;
        }
        if (btnReasonPrev) btnReasonPrev.disabled = (historyIdx === 0);
        if (btnReasonNext) btnReasonNext.disabled = (historyIdx === viewedHistory.length - 1);
      } else {
        reasonHistoryNav.classList.add('hidden');
      }
    }

    // Повідомлення про відкриття всіх записок
    if (reasonCompletionBanner) {
      const allOpened = unviewedIndices.length === 0 || forceShowCompletion;
      if (allOpened) {
        reasonCompletionBanner.classList.remove('hidden');
        if (btnNextReason) {
          btnNextReason.innerHTML = '<span>Почати заново ❤️</span>';
        }
      } else {
        reasonCompletionBanner.classList.add('hidden');
        if (btnNextReason) {
          btnNextReason.innerHTML = '<span>Дістати ще одну ✨</span>';
        }
      }
    }

    if (reasonModal) {
      reasonModal.classList.add('active');
    }
  }

  function handleNextReasonBtnClick() {
    if (unviewedIndices.length === 0) {
      // Перезапуск пулу для повторного витягування
      initReasonsPool();
      drawNextReason();
    } else {
      drawNextReason();
    }
  }

  if (loveJar) loveJar.addEventListener('click', drawNextReason);
  if (btnPickReason) btnPickReason.addEventListener('click', drawNextReason);
  if (btnViewOpenedReasons) {
    btnViewOpenedReasons.addEventListener('click', () => {
      if (viewedHistory.length > 0) {
        displayReasonAtHistory(currentHistoryIndex >= 0 ? currentHistoryIndex : viewedHistory.length - 1);
      }
    });
  }
  if (btnNextReason) btnNextReason.addEventListener('click', handleNextReasonBtnClick);

  if (btnReasonPrev) {
    btnReasonPrev.addEventListener('click', () => {
      if (currentHistoryIndex > 0) {
        displayReasonAtHistory(currentHistoryIndex - 1);
      }
    });
  }

  if (btnReasonNext) {
    btnReasonNext.addEventListener('click', () => {
      if (currentHistoryIndex < viewedHistory.length - 1) {
        displayReasonAtHistory(currentHistoryIndex + 1);
      }
    });
  }

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
  // Автентичні тексти, збереження структури, емодзі та абзаців
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

      fetch(letterData.file)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.text();
        })
        .then(text => {
          let cleaned = text.trim();
          // Очищаємо лише технічний символ markdown заголовка '# ', якщо він присутній
          cleaned = cleaned.replace(/^#\s+/gm, '');
          if (openWhenBody) openWhenBody.textContent = cleaned;
        })
        .catch(() => {
          let fallbackCleaned = (letterData.content || '').replace(/^#\s+/gm, '');
          if (openWhenBody) openWhenBody.textContent = fallbackCleaned;
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
  // 8. Секретний фінал: «Ще дещо для тебе…»
  // Послідовність:
  // 1. Екран темніє
  // 2. З'являються ніжні сердечка
  // 3. Особисте послання
  // 4. Велике сяюче серце в центрі
  // 5. Відкриття серця
  // 6. Напис «Я тебе кохаю, моя дівчинко ❤️» та «Завжди твій ❤️»
  // =========================================================================
  const heartPortal = document.getElementById('heart-portal');
  const heartTouchHint = document.getElementById('heart-touch-hint');
  const finalMessageBody = document.getElementById('final-message-body');
  const finalConfessionCard = document.getElementById('final-confession-card');

  function loadFinalMessage() {
    const fallbackFinal = window.LETTERS_DATA?.final?.content || `Моя Киця…

Якби я міг подарувати тобі щось особливе, то подарував би можливість хоча б на мить побачити себе моїми очима. Тоді ти зрозуміла б, наскільки ти для мене дорога.

Дякую, що ти є в моєму житті. Дякую за ці три роки, за всі наші моменти й за те, що саме ти — моя кохана дівчинка.

І пам'ятай: серед мільйонів людей я щасливий, що зустрів саме тебе.`;

    fetch('materials/letters/final-message.txt')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        let cleaned = text.trim();
        // Відокремлюємо фінальні слова зізнання та підпис для кульмінаційного моменту розкриття серця
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

  let heartOpened = false;
  if (heartPortal) {
    heartPortal.addEventListener('click', () => {
      if (heartOpened) return;
      heartOpened = true;

      // 5. Анімація чарівного розкриття серця
      heartPortal.classList.add('opened');
      if (heartTouchHint) heartTouchHint.style.opacity = '0';

      setTimeout(() => {
        heartPortal.style.display = 'none';
        if (heartTouchHint) heartTouchHint.style.display = 'none';

        // 6. Поява надпису та підпису в сяйві
        if (finalConfessionCard) {
          finalConfessionCard.classList.remove('hidden');
        }
      }, 700);
    });
  }
});
