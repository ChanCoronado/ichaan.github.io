const textSamples = {
  easy: [
    "The magnificent butterfly gracefully transformed throughout the beautiful springtime season.",
    "Everyone appreciates wonderful opportunities for developing extraordinary communication skills.",
    "Remarkable achievements require dedication, persistence, determination, and continuous improvement.",
    "Technology revolutionized international communication methodologies and information accessibility worldwide.",
    "Understanding complicated mathematical principles necessitates considerable concentration and practice.",
    "Extraordinary circumstances occasionally demand innovative solutions and creative thinking processes.",
    "Professional development opportunities strengthen organizational capabilities and employee satisfaction levels.",
    "Collaborative teamwork consistently generates outstanding results through combined intellectual contributions.",
    "Educational institutions continuously implement progressive teaching methodologies for student advancement.",
    "Environmental sustainability initiatives promote responsible consumption and conservation awareness globally.",
    "Magnificent architecture demonstrates remarkable engineering excellence throughout historical civilizations and modern developments.",
    "Scientific discoveries continuously revolutionize medical treatments improving healthcare accessibility for communities worldwide.",
    "Photographic documentation preserves memorable experiences creating lasting impressions for future generations to appreciate.",
    "Agricultural innovations significantly increase productivity ensuring sustainable food production for growing populations globally.",
    "Technological advancement facilitates instantaneous communication connecting individuals across geographical boundaries seamlessly today.",
    "Educational excellence requires passionate teachers dedicated resources and comprehensive curriculum development programs consistently.",
    "Environmental protection demands immediate action sustainable practices and global cooperation among nations worldwide.",
    "Financial literacy provides essential knowledge empowering individuals to make informed decisions about investments wisely.",
    "Creative expression through artistic endeavors enriches cultural heritage inspiring generations with timeless masterpieces beautifully.",
    "Transportation infrastructure development strengthens economic growth facilitating efficient movement of goods and services nationwide."
  ],
  medium: [
    "Interdisciplinary collaboration facilitates comprehensive understanding of multifaceted challenges requiring synchronized efforts across organizational boundaries.",
    "Technological advancements continuously revolutionize communication methodologies, enabling instantaneous information transmission across geographical boundaries while transforming interactions.",
    "Sophisticated analytical frameworks enable comprehensive evaluation of multidimensional problems through systematic examination of interconnected variables.",
    "Contemporary organizations prioritize adaptability, innovation, resilience, and sustainable development strategies for navigating increasingly complex competitive environments.",
    "Comprehensive documentation facilitates knowledge transfer, ensures procedural consistency, maintains operational transparency, and supports organizational learning initiatives.",
    "Strategic implementation of progressive methodologies enhances operational efficiency, optimizes resource allocation, and strengthens competitive positioning.",
    "Environmental consciousness necessitates responsible consumption, sustainable practices, renewable resources utilization, and comprehensive ecological awareness.",
    "Professional development encompasses continuous learning, skill enhancement, knowledge acquisition, networking opportunities, and career advancement strategies.",
    "Effective communication requires clarity, precision, contextual awareness, emotional intelligence, and comprehensive understanding of audience perspectives.",
    "Innovation ecosystems cultivate entrepreneurial thinking, facilitate collaborative problem-solving, and accelerate technological advancement through synergistic partnerships.",
    "Neuroscientific research methodologies investigate cognitive processes utilizing advanced neuroimaging technologies revealing intricate brain functionality mechanisms.",
    "Quantum computing paradigms leverage superposition principles and entanglement phenomena to process complex calculations exponentially faster than classical methods.",
    "Epidemiological surveillance systems monitor infectious disease transmission patterns, enabling preventive intervention strategies and public health responses effectively.",
    "Sociocultural anthropology investigates behavioral patterns, belief systems, traditional practices, and evolutionary adaptations across diverse human societies.",
    "Digital transformation initiatives revolutionize traditional business operations enabling automated workflows streamlined processes enhanced productivity and competitive advantages."
  ],
  hard: [
    "const comprehensiveDataStructure = {userId: 'USER_12345', sessionToken: 'abc-def-ghi-jkl-mno', timestamp: Date.now(), performanceMetrics: [98.7, 99.2, 97.5]}; // Advanced implementation",
    "function processComplexAlgorithm(dataSet, parameters) { return dataSet.filter(item => item.value > parameters.threshold).map(element => ({...element, processed: true})); }",
    "Quantum computational architectures leverage superposition principles and entanglement phenomena for exponentially accelerating cryptographic calculations: O(n) to O(log n) complexity reduction.",
    "https://api.enterprise-system.com/v2/endpoints/user-management?authentication=Bearer_TOKEN&queryParameters={filter: 'active', sortBy: 'timestamp', limit: 1000}",
    "Machine learning architectures implement backpropagation algorithms: dL/dw = (dL/dy)(dy/dw) where L represents loss function, w denotes weights, y signifies output predictions.",
    "Cryptocurrency blockchain validation: SHA-256 hash function validates previousHash + timestamp + data + nonce less than target difficulty; decentralized consensus mechanisms ensure immutability.",
    "import { useState, useEffect, useCallback } from 'react'; const [state, setState] = useState({data: [], loading: false, error: null}); useEffect(() => fetchData(), [dependency]);",
    "SELECT users.id, COUNT(orders.order_id) AS total_orders FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.created_at >= '2024-01-01' GROUP BY users.id HAVING total_orders > 5;",
    "class NeuralNetwork extends tf.layers.Layer { constructor(config) { super(config); this.dense1 = tf.layers.dense({units: 128, activation: 'relu'}); } call(inputs) { return this.dense1.apply(inputs); } }",
    "async function fetchUserData(userId) { try { const response = await axios.get(`/api/users/${userId}`, {headers: {'Authorization': `Bearer ${token}`}}); return response.data; } catch(error) { throw new Error(error); } }",
    "git checkout -b feature/user-authentication && git add src/auth/*.js && git commit -m 'feat: implement OAuth2 JWT-based authentication with refresh token rotation' && git push origin",
    "const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/; const isValidEmail = (email) => regex.test(email); console.log(isValidEmail('test@example.com')); // Returns true or false",
    "def fibonacci(n): if n <= 1: return n else: return fibonacci(n-1) + fibonacci(n-2) # Recursive implementation with time complexity O(2^n) requires optimization using memoization",
    "docker build -t myapp:latest . && docker run -d -p 8080:80 --name mycontainer -e NODE_ENV=production -v /host/path:/container/path myapp:latest",
    "interface UserProfile { id: number; username: string; email: string; roles: string[]; createdAt: Date; } const createUser = (profile: UserProfile): Promise<UserProfile> => { return api.post('/users', profile); }"
  ]
};
 
let currentText = '';
let currentPosition = 0;
let startTime = null;
let timerInterval = null;
let timeRemaining = 30;
let selectedTime = 30;
let selectedDifficulty = 'easy';
let isTestActive = false;
let correctChars = 0;
let incorrectChars = 0;
let totalCharsTyped = 0;
let currentCombo = 0;
let maxCombo = 0;
let comboHideTimeout = null;
let lastWPM = 0;
 
const $ = id => document.getElementById(id);
 
const menuSection    = $('menuSection');
const gameSection    = $('gameSection');
const textDisplay    = $('textDisplay');
const typingInput    = $('typingInput');
const startBtn       = $('startBtn');
const resetBtn       = $('resetBtn');
const timerEl        = $('timer');
const wpmEl          = $('wpm');
const accuracyEl     = $('accuracy');
const errorsEl       = $('errorsDisplay');
const progressFill   = $('progressFill');
const progressPct    = $('progressPercent');
const comboDisplay   = $('comboDisplay');
const comboValue     = $('comboValue');
const hamburgerBtn   = $('hamburgerBtn');
const menuDropdown   = $('menuDropdown');
const closeMenuBtn   = $('closeMenu');
const menuOverlay    = $('menuOverlay');
const startGameBtn   = $('startGameBtn');
const applyCustomBtn = $('applyCustomTime');
const customTimeEl   = $('customTime');
const modalBackdrop  = $('modalBackdrop');
const typingZone     = $('typingZone');
 
document.addEventListener('DOMContentLoaded', () => {
  loadHighScores();
  initCanvas();
  setupEventListeners();
  showMenu();
});
 
function setupEventListeners() {
  startGameBtn.addEventListener('click', startGameFromMenu);
 
  document.querySelectorAll('.pill[data-time]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill[data-time]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = parseInt(btn.dataset.time);
      customTimeEl.value = '';
      ripple(btn);
    });
  });
 
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.difficulty;
    });
  });
 
  applyCustomBtn.addEventListener('click', applyCustomTime);
  customTimeEl.addEventListener('keypress', e => { if (e.key === 'Enter') applyCustomTime(); });
 
  startBtn.addEventListener('click', startTest);
  resetBtn.addEventListener('click', resetTest);
  typingInput.addEventListener('input', handleTyping);
  typingInput.addEventListener('focus', () => typingZone.classList.add('zone-active'));
  typingInput.addEventListener('blur',  () => typingZone.classList.remove('zone-active'));
  typingInput.addEventListener('paste', e => { e.preventDefault(); showNotification('Pasting is disabled', 'warning'); });
 
  hamburgerBtn.addEventListener('click', e => { e.stopPropagation(); toggleDrawer(); });
  closeMenuBtn.addEventListener('click', closeDrawer);
  menuOverlay.addEventListener('click', closeDrawer);
 
  $('playAgainBtn').addEventListener('click', playAgain);
  $('mainMenuBtn').addEventListener('click', () => { closeModal('resultModal'); showMenu(); resetTest(); });
 
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
 
  modalBackdrop.addEventListener('click', () => {
    document.querySelectorAll('.modal-sheet.open').forEach(m => closeModal(m.id));
  });
}
 
function ripple(el) {
  const r = document.createElement('span');
  r.style.cssText = `position:absolute;border-radius:50%;transform:scale(0);animation:rippleAnim 0.5s ease-out;background:rgba(255,255,255,0.25);width:80px;height:80px;left:50%;top:50%;margin:-40px;pointer-events:none;z-index:10;`;
  el.style.position = 'relative';
  el.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}
 
function showMenu() {
  menuSection.classList.remove('hidden');
  gameSection.classList.remove('active');
  updateDrawerItems('menu');
  loadMenuRecords();
}
 
function hideMenu() {
  menuSection.classList.add('hidden');
  setTimeout(() => { gameSection.classList.add('active'); updateDrawerItems('game'); }, 320);
}
 
function loadMenuRecords() {
  $('menuEasyBest').textContent = localStorage.getItem('bestWPM_easy') || '0';
  $('menuMedBest').textContent  = localStorage.getItem('bestWPM_medium') || '0';
  $('menuHardBest').textContent = localStorage.getItem('bestWPM_hard') || '0';
}
 
function applyCustomTime() {
  const val = parseInt(customTimeEl.value);
  if (val >= 10 && val <= 300) {
    document.querySelectorAll('.pill[data-time]').forEach(b => b.classList.remove('active'));
    selectedTime = val;
    showNotification(`Custom time: ${val}s set!`, 'success');
  } else {
    showNotification('Enter a time between 10–300s', 'warning');
  }
}
 
function startGameFromMenu() {
  timeRemaining = selectedTime;
  updateGameMeta();
  hideMenu();
  setTimeout(() => initializeTest(), 420);
}
 
function updateGameMeta() {
  const names = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  $('gameMeta').textContent = `${names[selectedDifficulty]} · ${selectedTime}s`;
}
 
function updateDrawerItems(state) {
  const nav = $('drawerNav');
  const items = state === 'menu' ? [
    { action: 'stats', icon: 'fa-chart-bar', label: 'Statistics' },
    { action: 'reset', icon: 'fa-trash-alt', label: 'Reset All Data' }
  ] : [
    { action: 'menu',    icon: 'fa-home',     label: 'Back to Menu' },
    { action: 'newGame', icon: 'fa-redo',      label: 'Restart Game' },
    { action: 'pause',   icon: 'fa-pause',     label: 'Pause Test' },
    { action: 'stats',   icon: 'fa-chart-bar', label: 'Statistics' },
    { action: 'reset',   icon: 'fa-trash-alt', label: 'Reset All Data' }
  ];
  nav.innerHTML = items.map(i =>
    `<button class="drawer-item" data-action="${i.action}"><i class="fas ${i.icon}"></i> ${i.label}</button>`
  ).join('');
  nav.querySelectorAll('.drawer-item').forEach(item => {
    item.addEventListener('click', () => handleDrawerAction(item.dataset.action));
  });
}
 
function toggleDrawer() { menuDropdown.classList.toggle('show'); menuOverlay.classList.toggle('show'); }
function closeDrawer()  { menuDropdown.classList.remove('show'); menuOverlay.classList.remove('show'); }
 
function handleDrawerAction(action) {
  closeDrawer();
  switch (action) {
    case 'newGame': resetTest(); break;
    case 'pause':   pauseTest(); break;
    case 'menu':
      if (isTestActive) {
        if (confirm('Exit? Progress will be lost.')) { showMenu(); resetTest(); }
      } else { showMenu(); }
      break;
    case 'stats': updateStatsDisplay(); openModal('statsModal'); break;
    case 'reset': if (confirm('Reset all data? This cannot be undone.')) resetAllData(); break;
  }
}
 
function pauseTest() {
  if (!isTestActive) return;
  isTestActive = false;
  clearInterval(timerInterval);
  typingInput.disabled = true;
  startBtn.disabled = false;
  startBtn.style.opacity = '1';
  showNotification('Paused — click Start to resume', 'info');
}
 
function initializeTest() {
  const samples = textSamples[selectedDifficulty];
  currentText = samples[Math.floor(Math.random() * samples.length)];
 
  const words = currentText.split(' ');
  let charIndex = 0;
  let html = '';
 
  words.forEach((word, wi) => {
    html += '<span class="word">';
    for (let i = 0; i < word.length; i++) {
      const ch = word[i] === '<' ? '&lt;' : word[i] === '>' ? '&gt;' : word[i];
      html += `<span class="char" data-index="${charIndex}">${ch}</span>`;
      charIndex++;
    }
    html += '</span>';
    if (wi < words.length - 1) {
      html += `<span class="char space" data-index="${charIndex}">&nbsp;</span>`;
      charIndex++;
    }
  });
 
  textDisplay.innerHTML = html;
 
  currentPosition = 0; correctChars = 0; incorrectChars = 0;
  totalCharsTyped = 0; currentCombo = 0; maxCombo = 0; lastWPM = 0;
  timeRemaining = selectedTime;
 
  updateStats(); updateProgress(); hideComboDisplay(); highlightCurrentChar();
 
  timerEl.textContent = timeRemaining; timerEl.style.color = '';
  typingInput.value = ''; typingInput.disabled = true;
  startBtn.disabled = false; startBtn.style.opacity = '1';
  progressFill.style.width = '0%'; progressPct.textContent = '0%';
}
 
function startTest() {
  if (isTestActive) return;
  isTestActive = true;
  startTime = Date.now();
  typingInput.disabled = false;
  typingInput.value = '';
  typingInput.focus();
  startBtn.disabled = true;
  startBtn.style.opacity = '0.4';
  startTimer();
  showNotification('Go! 🚀', 'success');
}
 
function resetTest() {
  if (isTestActive) { isTestActive = false; clearInterval(timerInterval); }
  timerEl.style.color = '';
  hideComboDisplay();
  initializeTest();
}
 
function handleTyping() {
  if (!isTestActive) return;
  const inputVal = typingInput.value;
  const inputLen = inputVal.length;
  const chars = textDisplay.querySelectorAll('.char');
 
  if (inputLen > currentPosition) {
    for (let i = 0; i < inputLen - currentPosition; i++) {
      const pos = currentPosition + i;
      if (pos >= currentText.length) break;
      const typed = inputVal[pos], expected = currentText[pos];
      totalCharsTyped++;
      if (typed === expected) {
        chars[pos].classList.add('correct'); chars[pos].classList.remove('incorrect');
        correctChars++; currentCombo++;
        if (currentCombo > maxCombo) maxCombo = currentCombo;
        spawnParticle(chars[pos], 'correct');
      } else {
        chars[pos].classList.add('incorrect'); chars[pos].classList.remove('correct');
        incorrectChars++; currentCombo = 0;
        spawnParticle(chars[pos], 'incorrect');
      }
    }
    currentPosition = inputLen;
  } else if (inputLen < currentPosition) {
    for (let i = inputLen; i < currentPosition; i++) {
      const wasC = chars[i].classList.contains('correct');
      const wasI = chars[i].classList.contains('incorrect');
      chars[i].classList.remove('correct','incorrect');
      if (wasC) { correctChars--; currentCombo = Math.max(0,currentCombo-1); }
      if (wasI) incorrectChars--;
      totalCharsTyped--;
    }
    currentPosition = inputLen;
  }
 
  updateStats(); updateProgress(); updateComboDisplay(); highlightCurrentChar();
  if (currentPosition >= currentText.length) endTest();
}
 
function highlightCurrentChar() {
  const chars = textDisplay.querySelectorAll('.char');
  chars.forEach(c => c.classList.remove('current'));
  if (currentPosition < chars.length) chars[currentPosition].classList.add('current');
}
 
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.textContent = timeRemaining;
    if (timeRemaining <= 10) {
      timerEl.style.color = 'var(--red)';
      if (timeRemaining <= 5) shakeElement(timerEl.closest('.stat-chip'));
    }
    if (timeRemaining <= 0) endTest();
  }, 1000);
}
 
function updateStats() {
  const elapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
  const wpm = elapsed > 0 ? Math.round((correctChars / 5) / elapsed) : 0;
  const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
 
  if (wpm !== lastWPM) {
    wpmEl.classList.remove('wpm-boost');
    requestAnimationFrame(() => wpmEl.classList.add('wpm-boost'));
    lastWPM = wpm;
  }
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + '%';
  if (errorsEl) errorsEl.textContent = incorrectChars;
}
 
function updateProgress() {
  const pct = (currentPosition / currentText.length) * 100;
  progressFill.style.width = pct + '%';
  progressPct.textContent  = Math.round(pct) + '%';
}
 
function updateComboDisplay() {
  if (comboHideTimeout) { clearTimeout(comboHideTimeout); comboHideTimeout = null; }
  if (currentCombo >= 5) {
    comboValue.textContent = currentCombo;
    comboDisplay.classList.remove('hiding'); comboDisplay.classList.add('show');
    comboHideTimeout = setTimeout(hideComboDisplay, 2500);
  } else { hideComboDisplay(); }
}
 
function hideComboDisplay() {
  if (comboHideTimeout) { clearTimeout(comboHideTimeout); comboHideTimeout = null; }
  comboDisplay.classList.remove('show'); comboDisplay.classList.add('hiding');
  setTimeout(() => comboDisplay.classList.remove('hiding'), 500);
}
 
function endTest() {
  if (!isTestActive) return;
  isTestActive = false; clearInterval(timerInterval); hideComboDisplay();
  typingInput.disabled = true; startBtn.disabled = false; startBtn.style.opacity = '1';
  const elapsed  = (Date.now() - startTime) / 60000;
  const finalWPM = Math.round((correctChars / 5) / elapsed);
  const finalAcc = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
  saveStatistics(finalWPM, finalAcc);
  updateHighScores(finalWPM);
  showResultModal(finalWPM, finalAcc, totalCharsTyped, maxCombo);
}
 
function showResultModal(wpm, accuracy, chars, combo) {
  $('finalWPM').textContent      = wpm;
  $('finalAccuracy').textContent = accuracy + '%';
  $('finalChars').textContent    = chars;
  $('finalCombo').textContent    = combo;
  const bestWPM = parseInt(localStorage.getItem(`bestWPM_${selectedDifficulty}`) || '0');
  const badge   = $('newRecordBadge');
  badge.style.display = wpm > bestWPM ? 'flex' : 'none';
  if (wpm > bestWPM) celebrate();
  openModal('resultModal');
}
 
function openModal(id) { $(id).classList.add('open'); modalBackdrop.classList.add('show'); }
function closeModal(id) {
  $(id).classList.remove('open');
  if (!document.querySelector('.modal-sheet.open')) modalBackdrop.classList.remove('show');
}
 
function playAgain() { closeModal('resultModal'); resetTest(); }
 
function updateHighScores(wpm) {
  const key  = `bestWPM_${selectedDifficulty}`;
  const best = parseInt(localStorage.getItem(key) || '0');
  if (wpm > best) localStorage.setItem(key, wpm.toString());
  loadHighScores();
}
 
function loadHighScores() {
  $('bestWPMEasy').textContent   = localStorage.getItem('bestWPM_easy')   || '0';
  $('bestWPMMedium').textContent = localStorage.getItem('bestWPM_medium') || '0';
  $('bestWPMHard').textContent   = localStorage.getItem('bestWPM_hard')   || '0';
}
 
function saveStatistics(wpm, accuracy) {
  const total    = parseInt(localStorage.getItem('totalGames')    || '0') + 1;
  const totalWPM = parseInt(localStorage.getItem('totalWPM')      || '0') + wpm;
  const totalAcc = parseInt(localStorage.getItem('totalAccuracy') || '0') + accuracy;
  localStorage.setItem('totalGames',    total.toString());
  localStorage.setItem('totalWPM',      totalWPM.toString());
  localStorage.setItem('totalAccuracy', totalAcc.toString());
}
 
function updateStatsDisplay() {
  const total  = parseInt(localStorage.getItem('totalGames')    || '0');
  const totWPM = parseInt(localStorage.getItem('totalWPM')      || '0');
  const totAcc = parseInt(localStorage.getItem('totalAccuracy') || '0');
  $('totalGames').textContent  = total;
  $('avgWPM').textContent      = total > 0 ? Math.round(totWPM / total) : 0;
  $('avgAccuracy').textContent = (total > 0 ? Math.round(totAcc / total) : 0) + '%';
  $('statsEasyWPM').textContent   = (localStorage.getItem('bestWPM_easy')   || '0') + ' WPM';
  $('statsMediumWPM').textContent = (localStorage.getItem('bestWPM_medium') || '0') + ' WPM';
  $('statsHardWPM').textContent   = (localStorage.getItem('bestWPM_hard')   || '0') + ' WPM';
}
 
function resetAllData() {
  localStorage.clear(); loadHighScores(); updateStatsDisplay();
  showNotification('All data reset', 'success');
}
 
function spawnParticle(el, type) {
  const rect = el.getBoundingClientRect();
  const p = document.createElement('div');
  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * 25 + 10;
  p.style.cssText = `
    position:fixed;left:${rect.left + rect.width/2}px;top:${rect.top}px;
    width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:9999;
    background:${type === 'correct' ? 'var(--green)' : 'var(--red)'};
    animation:particlePop 0.45s ease-out forwards;
    --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist - 15}px;
  `;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 450);
}
 
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  requestAnimationFrame(() => { el.style.animation = 'chipShake 0.35s ease'; });
}
 
function celebrate() {
  const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    const size = Math.random() * 8 + 4;
    c.style.cssText = `
      position:fixed;left:${Math.random()*100}%;top:-10px;
      width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events:none;z-index:9999;opacity:0.9;
      animation:confettiFall ${Math.random()*2.5+1.5}s linear forwards;
      animation-delay:${Math.random()*0.5}s;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}
 
function showNotification(msg, type = 'info') {
  const existing = document.querySelector('.notif-toast');
  if (existing) existing.remove();
  const n = document.createElement('div');
  const colors = { warning: 'var(--amber)', success: 'var(--green)', info: 'var(--accent)' };
  n.className = 'notif-toast';
  n.style.cssText = `
    position:fixed;top:16px;left:50%;transform:translateX(-50%);
    padding:9px 18px;background:${colors[type] || colors.info};
    color:var(--bg);border-radius:100px;box-shadow:0 4px 28px rgba(0,0,0,0.45);
    z-index:9999;font-weight:700;font-family:var(--font-display);font-size:0.8rem;
    animation:notifIn 0.3s var(--ease-spring);white-space:nowrap;letter-spacing:0.3px;
  `;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = 'notifOut 0.28s ease forwards';
    setTimeout(() => n.remove(), 280);
  }, 2200);
}
 
function initCanvas() {
  const canvas = $('bgCanvas');
  const ctx    = canvas.getContext('2d');
 
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
 
  const dots = Array.from({ length: 35 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    a: Math.random() * 0.35 + 0.08
  }));
 
  const lines = Array.from({ length: 8 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: Math.random() * 80 + 30,
    angle: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.005,
    a: Math.random() * 0.04 + 0.01
  }));
 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(l => {
      l.angle += l.va;
      const x2 = l.x + Math.cos(l.angle) * l.len;
      const y2 = l.y + Math.sin(l.angle) * l.len;
      ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(99,102,241,${l.a})`; ctx.lineWidth = 1; ctx.stroke();
    });
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${d.a})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
 
const dynStyles = document.createElement('style');
dynStyles.textContent = `
  @keyframes particlePop {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--dx,0), var(--dy,-20px)) scale(2.5); opacity: 0; }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0.9; }
    100% { transform: translateY(105vh) rotate(640deg); opacity: 0; }
  }
  @keyframes chipShake {
    0%,100% { transform: translateX(0); }
    25%     { transform: translateX(-5px); }
    75%     { transform: translateX(5px); }
  }
  @keyframes notifIn {
    from { opacity:0; transform:translateX(-50%) translateY(-10px) scale(0.9); }
    to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
  }
  @keyframes notifOut {
    from { opacity:1; transform:translateX(-50%) scale(1); }
    to   { opacity:0; transform:translateX(-50%) scale(0.88); }
  }
  @keyframes rippleAnim {
    to { transform: scale(4); opacity: 0; }
  }
  @keyframes wpmPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.18); color: var(--primary); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(dynStyles);