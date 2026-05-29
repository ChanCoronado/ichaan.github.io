document.addEventListener('DOMContentLoaded', () => {
  initAssistantPanel();
  initDashboardWidgets();
  initFeatureCardTilt();
  initSmoothScroll();
});

function initAssistantPanel() {
  const input = document.getElementById('assistant-input');
  const sendBtn = document.getElementById('assistant-send');
  const chatBody = document.getElementById('assistant-chat');
  const quickBtns = document.querySelectorAll('.quick-prompt-btn');

  if (!input || !sendBtn || !chatBody) return;

  const responses = {
    default: [
      "I understand. Let me analyze that for you with care and precision.",
      "Based on my assessment, everything appears to be within optimal parameters.",
      "I am programmed to assist you. Your wellbeing is my primary concern.",
      "That is an excellent question. Allow me to process and provide you with the best guidance.",
      "I have analyzed the data. Here is what I recommend for your situation.",
    ],
    greeting: "Hello! I am Baymax, your personal AI companion. I am here to help. How can I assist you today?",
    health: "I have run a diagnostic. Your vitals are stable. I recommend staying hydrated and getting adequate rest tonight.",
    status: "All systems are operating at 98.7% efficiency. No critical alerts detected. You are in good health.",
    help: "I can assist you with health monitoring, data analysis, personal scheduling, and much more. What would you like to explore?",
  };

  function addMessage(text, isUser = false, delay = 0) {
    setTimeout(() => {
      const msgWrap = document.createElement('div');
      msgWrap.classList.add('assistant-message-wrap', isUser ? 'user-wrap' : 'bot-wrap');
      msgWrap.style.opacity = '0';
      msgWrap.style.transform = 'translateY(12px)';
      msgWrap.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      const msg = document.createElement('div');
      msg.classList.add('assistant-message', isUser ? 'user-message' : 'bot-message');
      msg.textContent = text;

      if (!isUser) {
        const avatar = document.createElement('div');
        avatar.classList.add('bot-avatar');
        avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="11" r="1.5" fill="white"/><circle cx="15.5" cy="11" r="1.5" fill="white"/><path d="M8 15.5c1.333 1 6.667 1 8 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;
        msgWrap.appendChild(avatar);
      }

      msgWrap.appendChild(msg);
      chatBody.appendChild(msgWrap);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          msgWrap.style.opacity = '1';
          msgWrap.style.transform = 'translateY(0)';
        });
      });

      chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator-wrap');
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="bot-avatar">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="11" r="1.5" fill="white"/><circle cx="15.5" cy="11" r="1.5" fill="white"/><path d="M8 15.5c1.333 1 6.667 1 8 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>
      </div>
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) indicator.remove();
  }

  function getResponse(text) {
    const lower = text.toLowerCase();
    if (lower.match(/hello|hi|hey|good/)) return responses.greeting;
    if (lower.match(/health|feel|pain|sick|wellness|vital/)) return responses.health;
    if (lower.match(/status|system|diagnostic|check/)) return responses.status;
    if (lower.match(/help|assist|what can|capability/)) return responses.help;
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, true);
    input.value = '';

    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator(typingIndicator);
      addMessage(getResponse(text));
    }, 1200 + Math.random() * 600);
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });
}

function initDashboardWidgets() {
  const healthScore = document.getElementById('health-score-ring');
  if (!healthScore) return;

  const circumference = 2 * Math.PI * 54;
  healthScore.style.strokeDasharray = circumference;
  healthScore.style.strokeDashoffset = circumference;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const score = 87;
        const offset = circumference - (score / 100) * circumference;
        healthScore.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
        healthScore.style.strokeDashoffset = offset;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(healthScore);

  const sparkline = document.getElementById('heartrate-sparkline');
  if (sparkline) {
    animateSparkline(sparkline);
  }
}

function animateSparkline(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  let offset = 0;

  function getPoints(o) {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * w;
      const base = 0.5;
      const wave = Math.sin((i + o) * 0.4) * 0.2
        + Math.sin((i + o) * 0.9) * 0.1
        + Math.sin((i + o) * 0.15) * 0.15;
      const y = (base + wave) * h;
      points.push({ x, y });
    }
    return points;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const points = getPoints(offset);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cp = points[i - 1];
      const curr = points[i];
      ctx.quadraticCurveTo(cp.x, cp.y, (cp.x + curr.x) / 2, (cp.y + curr.y) / 2);
    }

    ctx.strokeStyle = '#1E1E1C';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    offset += 0.3;
    requestAnimationFrame(draw);
  }

  draw();
}

function initFeatureCardTilt() {
  const cards = document.querySelectorAll('.feature-card-tilt');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}