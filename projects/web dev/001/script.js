// Text samples for different difficulty levels
const textSamples = {
    easy: [
        "The cat sat on the mat and looked at the dog.",
        "I like to eat pizza and drink cold water.",
        "The sun is bright and the sky is blue today.",
        "She went to the store to buy some fresh milk.",
        "We can play games and have fun with friends.",
        "The bird flies high in the clear morning sky.",
        "He reads books and writes stories every day.",
        "They walk in the park and enjoy the weather.",
        "My dog likes to run and play in the yard.",
        "The tree has green leaves and pretty flowers."
    ],
    medium: [
        "Technology advances rapidly and changes how we communicate with others around the world.",
        "Learning new skills requires dedication, practice, and patience to achieve mastery.",
        "The ocean contains mysterious creatures that scientists continue to discover each year.",
        "Reading books expands your imagination and improves your vocabulary significantly over time.",
        "Exercise and healthy eating contribute to a better lifestyle and increased energy levels.",
        "Music has the power to influence our emotions and bring people together.",
        "Traveling to different countries exposes you to diverse cultures and perspectives.",
        "Problem solving skills are essential in both personal and professional environments.",
        "Creative thinking helps you find innovative solutions to challenging situations.",
        "Time management is crucial for achieving goals and maintaining work-life balance."
    ],
    hard: [
        "The quick brown fox jumps over the lazy dog while debugging a complex algorithm in the middle of the night.",
        "Programming is the art of telling another human what one wants the computer to do with precision and clarity.",
        "In the world of technology, every keystroke matters and every second counts when creating something amazing.",
        "Code is like humor. When you have to explain it, it is bad. Good code should be self-explanatory and elegant.",
        "The best way to predict the future is to implement it yourself through lines of carefully crafted code.",
        "Software development is a journey of continuous learning and improvement through dedication and practice.",
        "Clean code always looks like it was written by someone who cares deeply about their craft and their community.",
        "Testing leads to failure and failure leads to understanding. Understanding leads to better code and better solutions.",
        "Any developer can write code that a computer can understand. Great developers write code that humans can understand.",
        "The most important property of a program is whether it accomplishes the intention of its user and solves real problems."
    ]
};

// Game state variables
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
let totalGamesPlayed = 0;

// DOM Elements
const startMenuOverlay = document.getElementById('startMenuOverlay');
const gameContainer = document.getElementById('gameContainer');
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const resultModal = document.getElementById('resultModal');
const statsModal = document.getElementById('statsModal');
const comboDisplay = document.getElementById('comboDisplay');
const comboValue = document.getElementById('comboValue');

// Menu elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');
const closeMenuBtn = document.getElementById('closeMenu');

// Start menu elements
const startGameBtn = document.getElementById('startGameBtn');
const timeButtons = document.querySelectorAll('.time-btn');
const difficultyCards = document.querySelectorAll('.difficulty-card');
const customTimeInput = document.getElementById('customTime');
const applyCustomTimeBtn = document.getElementById('applyCustomTime');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHighScores();
    loadStatistics();
    createParticles();
    addButtonEffects();
    setupEventListeners();
    showStartMenu();
});

// Setup all event listeners
function setupEventListeners() {
    // Start menu events
    startGameBtn.addEventListener('click', startGameFromMenu);
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTime(btn));
    });
    difficultyCards.forEach(card => {
        card.addEventListener('click', () => selectDifficulty(card));
    });
    applyCustomTimeBtn.addEventListener('click', applyCustomTime);

    // Game events
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('paste', (e) => {
        e.preventDefault();
        showNotification('Pasting is not allowed! 😊', 'warning');
    });

    // Modal events
    document.getElementById('closeModal').addEventListener('click', closeResultModal);
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
    document.getElementById('closeStatsModal').addEventListener('click', closeStatsModal);

    // Hamburger menu events
    hamburgerBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => handleMenuAction(e.currentTarget.dataset.action));
    });
}

// Start Menu Functions
function showStartMenu() {
    startMenuOverlay.classList.remove('hidden');
    gameContainer.style.display = 'none';
}

function hideStartMenu() {
    startMenuOverlay.classList.add('hidden');
    gameContainer.style.display = 'block';
}

function selectTime(button) {
    timeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedTime = parseInt(button.dataset.time);
    customTimeInput.value = '';
}

function applyCustomTime() {
    const customValue = parseInt(customTimeInput.value);
    if (customValue >= 10 && customValue <= 300) {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        selectedTime = customValue;
        showNotification(`Custom time set: ${customValue}s`, 'info');
    } else {
        showNotification('Please enter a time between 10 and 300 seconds', 'warning');
    }
}

function selectDifficulty(card) {
    difficultyCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedDifficulty = card.dataset.difficulty;
}

function startGameFromMenu() {
    timeRemaining = selectedTime;
    hideStartMenu();
    updateDifficultyDisplay();
    initializeTest();
}

function updateDifficultyDisplay() {
    const difficultyNames = {
        easy: 'Easy Mode',
        medium: 'Medium Mode',
        hard: 'Difficult Mode'
    };
    document.getElementById('currentDifficultyDisplay').textContent = difficultyNames[selectedDifficulty];
    document.getElementById('currentTimeDisplay').textContent = selectedTime;
}

// Hamburger Menu Functions
function toggleMenu() {
    menuDropdown.classList.toggle('show');
}

function handleMenuAction(action) {
    toggleMenu();
    
    switch(action) {
        case 'newGame':
            showStartMenu();
            break;
        case 'difficulty':
            showStartMenu();
            break;
        case 'stats':
            showStatsModal();
            break;
        case 'reset':
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                resetAllData();
            }
            break;
    }
}

// Game Initialization
function initializeTest() {
    const samples = textSamples[selectedDifficulty];
    currentText = samples[Math.floor(Math.random() * samples.length)];
    
    textDisplay.innerHTML = currentText
        .split('')
        .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
        .join('');
    
    currentPosition = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalCharsTyped = 0;
    currentCombo = 0;
    maxCombo = 0;
    timeRemaining = selectedTime;
    
    updateStats();
    updateProgress();
    updateComboDisplay();
    highlightCurrentChar();
    
    timerElement.textContent = timeRemaining;
    typingInput.value = '';
    typingInput.disabled = true;
}

// Test Control Functions
function startTest() {
    if (isTestActive) return;
    
    isTestActive = true;
    startTime = Date.now();
    
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    startBtn.style.pointerEvents = 'none';
    
    startTimer();
    animateStartButton();
}

function handleTyping(e) {
    if (!isTestActive) return;
    
    const inputValue = typingInput.value;
    const inputLength = inputValue.length;
    
    const chars = textDisplay.querySelectorAll('.char');
    
    if (inputLength > currentPosition) {
        const newChars = inputLength - currentPosition;
        
        for (let i = 0; i < newChars; i++) {
            const pos = currentPosition + i;
            if (pos >= currentText.length) break;
            
            const typedChar = inputValue[pos];
            const expectedChar = currentText[pos];
            
            totalCharsTyped++;
            
            if (typedChar === expectedChar) {
                chars[pos].classList.add('correct');
                chars[pos].classList.remove('incorrect');
                correctChars++;
                currentCombo++;
                if (currentCombo > maxCombo) {
                    maxCombo = currentCombo;
                }
                createCharEffect(chars[pos], 'correct');
            } else {
                chars[pos].classList.add('incorrect');
                chars[pos].classList.remove('correct');
                incorrectChars++;
                currentCombo = 0;
                createCharEffect(chars[pos], 'incorrect');
            }
        }
        
        currentPosition = inputLength;
    } 
    else if (inputLength < currentPosition) {
        for (let i = inputLength; i < currentPosition; i++) {
            const wasCorrect = chars[i].classList.contains('correct');
            const wasIncorrect = chars[i].classList.contains('incorrect');
            
            chars[i].classList.remove('correct', 'incorrect');
            
            if (wasCorrect) {
                correctChars--;
                currentCombo--;
            }
            if (wasIncorrect) incorrectChars--;
            totalCharsTyped--;
        }
        
        currentPosition = inputLength;
    }
    
    updateStats();
    updateProgress();
    updateComboDisplay();
    highlightCurrentChar();
    
    if (currentPosition >= currentText.length) {
        endTest();
    }
}

function highlightCurrentChar() {
    const chars = textDisplay.querySelectorAll('.char');
    chars.forEach(char => char.classList.remove('current'));
    
    if (currentPosition < chars.length) {
        chars[currentPosition].classList.add('current');
    }
}

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 10) {
            timerElement.style.color = 'var(--error)';
            timerElement.parentElement.style.animation = 'shake 0.5s ease';
        }
        
        if (timeRemaining <= 0) {
            endTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = timeRemaining;
    
    timerElement.style.animation = 'none';
    setTimeout(() => {
        timerElement.style.animation = 'pulse 0.3s ease';
    }, 10);
}

function updateStats() {
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0;
    const wordsTyped = correctChars / 5;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    
    const accuracy = totalCharsTyped > 0 
        ? Math.round((correctChars / totalCharsTyped) * 100) 
        : 100;
    
    animateNumber(wpmElement, wpm);
    accuracyElement.textContent = accuracy + '%';
}

function updateProgress() {
    const progress = (currentPosition / currentText.length) * 100;
    progressFill.style.width = progress + '%';
    progressPercent.textContent = Math.round(progress) + '%';
}

function updateComboDisplay() {
    if (currentCombo >= 5) {
        comboDisplay.style.display = 'flex';
        comboValue.textContent = currentCombo;
    } else {
        comboDisplay.style.display = 'none';
    }
}

function endTest() {
    if (!isTestActive) return;
    
    isTestActive = false;
    clearInterval(timerInterval);
    
    typingInput.disabled = true;
    
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    startBtn.style.pointerEvents = 'auto';
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = correctChars / 5;
    const finalWPM = Math.round(wordsTyped / timeElapsed);
    const finalAccuracy = totalCharsTyped > 0 
        ? Math.round((correctChars / totalCharsTyped) * 100) 
        : 100;
    
    totalGamesPlayed++;
    saveStatistics(finalWPM, finalAccuracy);
    
    showResults(finalWPM, finalAccuracy, totalCharsTyped, maxCombo);
    updateHighScores(finalWPM, finalAccuracy);
}

function resetTest() {
    if (isTestActive) {
        isTestActive = false;
        clearInterval(timerInterval);
    }
    
    typingInput.value = '';
    typingInput.disabled = true;
    
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    startBtn.style.pointerEvents = 'auto';
    
    timerElement.textContent = selectedTime;
    timerElement.style.color = '';
    timerElement.parentElement.style.animation = '';
    
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    
    comboDisplay.style.display = 'none';
    
    initializeTest();
    addResetAnimation();
}

// Results and Modals
function showResults(wpm, accuracy, chars, combo) {
    document.getElementById('finalWPM').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalChars').textContent = chars;
    document.getElementById('finalCombo').textContent = combo;
    
    const difficultyKey = `bestWPM_${selectedDifficulty}`;
    const bestWPM = parseInt(localStorage.getItem(difficultyKey) || '0');
    
    if (wpm > bestWPM) {
        document.getElementById('newRecordBadge').style.display = 'flex';
        celebrateRecord();
    } else {
        document.getElementById('newRecordBadge').style.display = 'none';
    }
    
    resultModal.classList.add('show');
}

function closeResultModal() {
    resultModal.classList.remove('show');
}

function playAgain() {
    closeResultModal();
    resetTest();
}

function showStatsModal() {
    updateStatsDisplay();
    statsModal.classList.add('show');
}

function closeStatsModal() {
    statsModal.classList.remove('show');
}

function updateStatsDisplay() {
    const totalGames = parseInt(localStorage.getItem('totalGames') || '0');
    const totalWPM = parseInt(localStorage.getItem('totalWPM') || '0');
    const totalAcc = parseInt(localStorage.getItem('totalAccuracy') || '0');
    
    const avgWPM = totalGames > 0 ? Math.round(totalWPM / totalGames) : 0;
    const avgAcc = totalGames > 0 ? Math.round(totalAcc / totalGames) : 0;
    
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('avgWPM').textContent = avgWPM;
    document.getElementById('avgAccuracy').textContent = avgAcc + '%';
    
    document.getElementById('statsEasyWPM').textContent = 
        (localStorage.getItem('bestWPM_easy') || '0') + ' WPM';
    document.getElementById('statsMediumWPM').textContent = 
        (localStorage.getItem('bestWPM_medium') || '0') + ' WPM';
    document.getElementById('statsHardWPM').textContent = 
        (localStorage.getItem('bestWPM_hard') || '0') + ' WPM';
}

// Storage Functions
function updateHighScores(wpm, accuracy) {
    const difficultyKey = `bestWPM_${selectedDifficulty}`;
    const bestWPM = parseInt(localStorage.getItem(difficultyKey) || '0');
    
    if (wpm > bestWPM) {
        localStorage.setItem(difficultyKey, wpm.toString());
    }
    
    loadHighScores();
}

function loadHighScores() {
    const easyBest = localStorage.getItem('bestWPM_easy') || '0';
    const mediumBest = localStorage.getItem('bestWPM_medium') || '0';
    const hardBest = localStorage.getItem('bestWPM_hard') || '0';
    
    document.getElementById('bestWPMEasy').textContent = easyBest;
    document.getElementById('bestWPMMedium').textContent = mediumBest;
    document.getElementById('bestWPMHard').textContent = hardBest;
}

function saveStatistics(wpm, accuracy) {
    const totalGames = parseInt(localStorage.getItem('totalGames') || '0') + 1;
    const totalWPM = parseInt(localStorage.getItem('totalWPM') || '0') + wpm;
    const totalAcc = parseInt(localStorage.getItem('totalAccuracy') || '0') + accuracy;
    
    localStorage.setItem('totalGames', totalGames.toString());
    localStorage.setItem('totalWPM', totalWPM.toString());
    localStorage.setItem('totalAccuracy', totalAcc.toString());
}

function loadStatistics() {
    // Statistics are loaded when needed in updateStatsDisplay
}

function resetAllData() {
    localStorage.clear();
    loadHighScores();
    updateStatsDisplay();
    showNotification('All data has been reset!', 'info');
}

// Visual Effects
function createParticles() {
    const particlesBg = document.getElementById('particlesBg');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(99, 102, 241, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesBg.appendChild(particle);
    }
    
    if (!document.getElementById('particleStyle')) {
        const style = document.createElement('style');
        style.id = 'particleStyle';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createCharEffect(charElement, type) {
    const rect = charElement.getBoundingClientRect();
    const effect = document.createElement('div');
    
    effect.style.position = 'fixed';
    effect.style.left = rect.left + rect.width / 2 + 'px';
    effect.style.top = rect.top + 'px';
    effect.style.width = '4px';
    effect.style.height = '4px';
    effect.style.borderRadius = '50%';
    effect.style.background = type === 'correct' ? 'var(--success)' : 'var(--error)';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    effect.style.animation = 'charEffectPop 0.5s ease-out forwards';
    
    document.body.appendChild(effect);
    
    setTimeout(() => effect.remove(), 500);
    
    if (!document.getElementById('charEffectStyle')) {
        const style = document.createElement('style');
        style.id = 'charEffectStyle';
        style.textContent = `
            @keyframes charEffectPop {
                0% {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(3) translateY(-20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    const difference = targetNumber - currentNumber;
    const duration = 300;
    const steps = 20;
    const stepValue = difference / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.round(currentNumber + (stepValue * currentStep));
        element.textContent = newValue;
        
        if (currentStep >= steps) {
            clearInterval(interval);
            element.textContent = targetNumber;
        }
    }, stepDuration);
}

function animateStartButton() {
    startBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        startBtn.style.transform = '';
    }, 150);
}

function addResetAnimation() {
    const cards = document.querySelectorAll('.stat-box');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        }, 10);
    });
}

function celebrateRecord() {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.opacity = '0.8';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addButtonEffects() {
    const buttons = document.querySelectorAll('.main-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.background = type === 'warning' ? 'var(--warning)' : 'var(--accent-primary)';
    notification.style.color = 'white';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.zIndex = '10000';
    notification.style.fontWeight = '500';
    notification.style.animation = 'slideInRight 0.3s ease';
    notification.style.maxWidth = '300px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
    
    if (!document.getElementById('notificationStyle')) {
        const style = document.createElement('style');
        style.id = 'notificationStyle';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}