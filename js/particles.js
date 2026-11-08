/**
 * Частинки фону: мерехтливі зірки, м'які світлячки та ніжні романтичні серця
 */
(function() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const stars = [];
  const hearts = [];

  const STAR_COUNT = Math.min(80, Math.floor(width / 16));
  const HEART_COUNT = Math.min(18, Math.floor(width / 60));

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initParticles() {
    stars.length = 0;
    hearts.length = 0;

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomRange(0.6, 1.8),
        alpha: randomRange(0.2, 0.9),
        speed: randomRange(0.005, 0.02),
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    for (let i = 0; i < HEART_COUNT; i++) {
      hearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: randomRange(8, 16),
        speedY: randomRange(0.3, 0.8),
        speedX: randomRange(-0.2, 0.2),
        alpha: randomRange(0.15, 0.45),
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: randomRange(0.01, 0.03)
      });
    }
  }

  function drawHeart(ctx, x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff4d6d';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#e63956';

    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -15, -25, 0, 0, 25);
    ctx.bezierCurveTo(25, 0, 10, -15, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Зірочки
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.speed * s.direction;
      if (s.alpha > 0.95 || s.alpha < 0.15) {
        s.direction *= -1;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      ctx.fillStyle = '#ffeaeb';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#f5b5c0';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Сердечка, які плавно пливуть угору
    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      h.y -= h.speedY;
      h.oscillation += h.oscillationSpeed;
      h.x += Math.sin(h.oscillation) * 0.5 + h.speedX;

      if (h.y < -30) {
        h.y = height + 30;
        h.x = Math.random() * width;
      }

      drawHeart(ctx, h.x, h.y, h.size, h.alpha);
    }

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
})();
