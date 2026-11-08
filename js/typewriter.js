/**
 * Модуль машинописного ефекту (Typewriter)
 */
window.Typewriter = {
  currentTimer: null,

  /**
   * Запускає друк тексту в елементі container
   * @param {HTMLElement} textElement 
   * @param {string} fullText 
   * @param {number} speed Швидкість у мс між символами
   * @param {Function} onComplete Коллбек після завершення
   */
  start: function(textElement, fullText, speed = 35, onComplete = null) {
    this.stop();
    if (!textElement) return;

    textElement.textContent = '';
    let index = 0;

    const typeNextChar = () => {
      if (index < fullText.length) {
        textElement.textContent += fullText.charAt(index);
        index++;
        this.currentTimer = setTimeout(typeNextChar, speed);
      } else {
        this.currentTimer = null;
        if (typeof onComplete === 'function') onComplete();
      }
    };

    typeNextChar();
  },

  /**
   * Зупиняє поточний друк
   */
  stop: function() {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  },

  /**
   * Миттєво виводить весь текст без затримок
   */
  finishInstantly: function(textElement, fullText) {
    this.stop();
    if (textElement) {
      textElement.textContent = fullText;
    }
  }
};
