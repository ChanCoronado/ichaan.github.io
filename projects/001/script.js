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
        "Transportation infrastructure development strengthens economic growth facilitating efficient movement of goods and services nationwide.",
        
        "Beautiful mountain landscapes provide breathtaking panoramic views attracting thousands of adventurous tourists throughout the year.",
        "Delicious homemade cooking requires quality ingredients patience creativity and traditional recipes passed down through generations.",
        "Historical monuments preserve ancient wisdom architectural marvels and cultural traditions for educational purposes worldwide.",
        "Passionate musicians practice countless hours perfecting complicated melodies harmonies rhythms and performing techniques daily.",
        "Effective leadership involves inspiring motivation strategic planning excellent communication and empowering team members consistently.",
        "Successful businesses prioritize customer satisfaction innovative products exceptional service quality and sustainable growth strategies.",
        "Modern healthcare systems integrate advanced technologies comprehensive treatments preventive care and personalized medicine approaches.",
        "International relationships strengthen through diplomatic dialogue mutual respect cultural exchange and collaborative partnership agreements.",
        "Outstanding athletes demonstrate exceptional discipline rigorous training mental toughness and unwavering commitment towards excellence.",
        "Kindergarten teachers nurture young children encouraging curiosity creativity social skills and foundational learning experiences everyday."
    ],
    medium: [
        
        "Interdisciplinary collaboration facilitates comprehensive understanding of multifaceted challenges requiring synchronized efforts across organizational boundaries and specialized knowledge domains.",
        "Technological advancements continuously revolutionize communication methodologies, enabling instantaneous information transmission across geographical boundaries while fundamentally transforming interpersonal interactions.",
        "Sophisticated analytical frameworks enable comprehensive evaluation of multidimensional problems through systematic examination of interconnected variables and interdependent relationships.",
        "Contemporary organizations prioritize adaptability, innovation, resilience, and sustainable development strategies for navigating increasingly complex competitive environments.",
        "Comprehensive documentation facilitates knowledge transfer, ensures procedural consistency, maintains operational transparency, and supports organizational learning initiatives.",
        "Strategic implementation of progressive methodologies enhances operational efficiency, optimizes resource allocation, and strengthens competitive positioning.",
        "Environmental consciousness necessitates responsible consumption, sustainable practices, renewable resources utilization, and comprehensive ecological awareness.",
        "Professional development encompasses continuous learning, skill enhancement, knowledge acquisition, networking opportunities, and career advancement strategies.",
        "Effective communication requires clarity, precision, contextual awareness, emotional intelligence, and comprehensive understanding of audience perspectives.",
        "Innovation ecosystems cultivate entrepreneurial thinking, facilitate collaborative problem-solving, and accelerate technological advancement through synergistic partnerships.",
        
        "Neuroscientific research methodologies investigate cognitive processes utilizing advanced neuroimaging technologies revealing intricate brain functionality mechanisms comprehensively.",
        "Geopolitical dynamics influence international trade agreements, diplomatic relationships, economic partnerships, and multinational cooperation frameworks significantly today.",
        "Cryptocurrency blockchain architecture implements decentralized consensus mechanisms ensuring transparent transactional verification and immutable ledger integrity constantly.",
        "Biomechanical engineering principles optimize prosthetic device functionality, enhancing mobility capabilities and improving quality of life substantially.",
        "Psycholinguistic studies examine language acquisition processes, cognitive development patterns, and communication disorders affecting neurological pathways extensively.",
        "Sustainable urban planning integrates green infrastructure, renewable energy systems, efficient transportation networks, and community-centric development approaches holistically.",
        "Epidemiological surveillance systems monitor infectious disease transmission patterns, enabling preventive intervention strategies and public health responses effectively.",
        "Quantum computing paradigms leverage superposition principles and entanglement phenomena to process complex calculations exponentially faster than classical methods.",
        "Sociocultural anthropology investigates behavioral patterns, belief systems, traditional practices, and evolutionary adaptations across diverse human societies comprehensively.",
        "Astronomical observations utilizing space-based telescopes reveal unprecedented cosmic phenomena, expanding understanding of universe formation and celestial mechanics profoundly.",
        
        "Pharmaceutical research laboratories develop innovative therapeutic solutions targeting previously untreatable medical conditions through rigorous clinical trials and experimental protocols.",
        "Digital transformation initiatives revolutionize traditional business operations enabling automated workflows streamlined processes enhanced productivity and competitive advantages.",
        "Cybersecurity frameworks establish comprehensive protection mechanisms safeguarding sensitive information preventing unauthorized access and mitigating potential security vulnerabilities.",
        "Organizational psychology examines workplace dynamics employee motivation leadership effectiveness team collaboration and performance optimization strategies systematically.",
        "Educational technology platforms facilitate personalized learning experiences adaptive curriculum delivery interactive engagement and measurable academic achievement outcomes.",
        "Climate change mitigation strategies encompass carbon emission reduction renewable energy adoption sustainable agriculture and international environmental policy coordination.",
        "Corporate governance structures ensure accountability transparency ethical decision-making stakeholder engagement and regulatory compliance throughout organizational operations.",
        "Artificial intelligence algorithms process massive datasets identifying patterns generating predictions automating decisions and enhancing operational capabilities significantly.",
        "Supply chain management optimizes inventory control logistics coordination vendor relationships quality assurance and delivery efficiency across global networks.",
        "Financial planning encompasses budgeting investment allocation risk management retirement preparation and wealth accumulation through disciplined strategic approaches."
    ],
    hard: [
        
        "const comprehensiveDataStructure = {userId: 'USER_12345', sessionToken: 'abc-def-ghi-jkl-mno', timestamp: Date.now(), performanceMetrics: [98.7, 99.2, 97.5]}; // Advanced implementation",
        "Interdisciplinary neuroscientific investigations utilizing electroencephalographic methodologies revealed unprecedented neuroplasticity phenomena: synaptic reorganization occurs continuously throughout developmental stages.",
        "function processComplexAlgorithm(dataSet, parameters) { return dataSet.filter(item => item.value > parameters.threshold).map(element => ({...element, processed: true})); }",
        "Quantum computational architectures leverage superposition principles and entanglement phenomena for exponentially accelerating cryptographic calculations: O(n) to O(log n) complexity reduction.",
        "https://api.enterprise-system.com/v2/endpoints/user-management?authentication=Bearer_TOKEN&queryParameters={filter: 'active', sortBy: 'timestamp', limit: 1000}",
        "Pharmacological interventions targeting serotonergic, dopaminergic, noradrenergic neurotransmitter systems demonstrate efficacy through receptor modulation mechanisms: 5-HT2A antagonism and dopamine reuptake inhibition.",
        "Biochemical synthesis protocols: C6H12O6 + 6O2 produces 6CO2 + 6H2O + ATP adenosine triphosphate; cellular respiration efficiency equals approximately 38 to 40 percent energy conservation.",
        "Machine learning architectures implement backpropagation algorithms: dL/dw = (dL/dy)(dy/dw) where L represents loss function, w denotes weights, y signifies output predictions.",
        "Cryptocurrency blockchain validation: SHA-256 hash function validates previousHash + timestamp + data + nonce less than target difficulty; decentralized consensus mechanisms ensure immutability and distributed trust.",
        "Electromagnetic wave propagation: lambda = c/f where wavelength equals speed of light divided by frequency; Maxwell equations describe fundamental electromagnetic relationships.",
        
        "import { useState, useEffect, useCallback } from 'react'; const [state, setState] = useState({data: [], loading: false, error: null}); useEffect(() => fetchData(), [dependency]);",
        "Neurochemical pathways: Glutamate excitatory plus GABA inhibitory equals synaptic transmission modulation; NMDA receptors facilitate long-term potentiation LTP via calcium influx mechanisms.",
        "SELECT users.id, COUNT(orders.order_id) AS total_orders FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.created_at >= '2024-01-01' GROUP BY users.id HAVING total_orders > 5;",
        "Thermodynamic principles: dS >= dQ/T Clausius inequality; Gibbs free energy: delta G = delta H minus T delta S determines spontaneity; equilibrium constant K equals exp(-delta G / RT) quantifies reaction favorability.",
        "class NeuralNetwork extends tf.layers.Layer { constructor(config) { super(config); this.dense1 = tf.layers.dense({units: 128, activation: 'relu'}); } call(inputs) { return this.dense1.apply(inputs); } }",
        "DNA replication: 5 prime ATGCGTACG 3 prime template strand produces 3 prime TACGCATGC 5 prime complementary; RNA polymerase synthesizes mRNA: promoter recognition, elongation 5 to 3 direction, termination at stop codons.",
        "Fourier transform analysis: f(t) equals integral of F(omega) times exponential i omega t d omega; discrete implementation: X[k] equals sum of x[n] times exponential negative i 2 pi k n / N enables frequency domain signal processing.",
        "async function fetchUserData(userId) { try { const response = await axios.get(`/api/users/${userId}`, {headers: {'Authorization': `Bearer ${token}`}}); return response.data; } catch(error) { throw new Error(error); } }",
        "Relativity equations: E equals mc squared mass-energy equivalence; time dilation: delta t prime equals delta t divided by square root of (1 minus v squared / c squared); Lorentz transformation describes spacetime coordinates.",
        "git checkout -b feature/user-authentication && git add src/auth/*.js && git commit -m 'feat: implement OAuth2 JWT-based authentication with refresh token rotation' && git push origin feature/user-authentication",
        
        "const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts'; fetch(apiEndpoint).then(response => response.json()).then(data => console.log(data)).catch(error => console.error('Error:', error));",
        "for (let i = 0; i < array.length; i++) { if (array[i] % 2 === 0) { evenNumbers.push(array[i]); } else { oddNumbers.push(array[i]); } } return {even: evenNumbers, odd: oddNumbers};",
        "def fibonacci(n): if n <= 1: return n else: return fibonacci(n-1) + fibonacci(n-2) # Recursive implementation with time complexity O(2^n) requires optimization using memoization technique",
        "CREATE TABLE employees (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE, department VARCHAR(50), salary DECIMAL(10,2), hire_date DATE);",
        "import pandas as pd; import numpy as np; df = pd.read_csv('data.csv'); df['new_column'] = df['existing_column'].apply(lambda x: x * 2 if x > 0 else 0); df.to_csv('output.csv', index=False);",
        "docker build -t myapp:latest . && docker run -d -p 8080:80 --name mycontainer -e NODE_ENV=production -v /host/path:/container/path myapp:latest",
        "interface UserProfile { id: number; username: string; email: string; roles: string[]; createdAt: Date; } const createUser = (profile: UserProfile): Promise<UserProfile> => { return api.post('/users', profile); }",
        "lambda x, y: x + y if x > 0 and y > 0 else 0 # Anonymous function implementation; map(lambda x: x ** 2, [1, 2, 3, 4, 5]) # Applies squaring operation to list elements",
        "package main; import \"fmt\"; func main() { numbers := []int{1, 2, 3, 4, 5}; for index, value := range numbers { fmt.Printf(\"Index: %d, Value: %d\\n\", index, value) } }",
        "const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/; const isValidEmail = (email) => regex.test(email); console.log(isValidEmail('test@example.com')); // Returns true or false"
    ]
};

// GAME STATE VARIABLES
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

// COMBO AUTO-HIDE TIMER
let comboHideTimeout = null;

// DOM ELEMENTS
const menuSection = document.getElementById('menuSection');
const gameSection = document.getElementById('gameSection');
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const comboDisplay = document.getElementById('comboDisplay');
const comboValue = document.getElementById('comboValue');

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');
const closeMenuBtn = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');

// Start menu elements
const startGameBtn = document.getElementById('startGameBtn');
const timeButtons = document.querySelectorAll('.time-btn');
const difficultyCards = document.querySelectorAll('.difficulty-card');
const customTimeInput = document.getElementById('customTime');
const applyCustomTimeBtn = document.getElementById('applyCustomTime');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    loadHighScores();
    createParticles();
    setupEventListeners();
    showMenu();
});

// EVENT LISTENERS SETUP
function setupEventListeners() {
    // Menu interactions
    startGameBtn.addEventListener('click', startGameFromMenu);
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTime(btn));
    });
    
    difficultyCards.forEach(card => {
        card.addEventListener('click', () => selectDifficulty(card));
    });
    
    applyCustomTimeBtn.addEventListener('click', applyCustomTime);
    customTimeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyCustomTime();
    });
    
    // Game controls
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('paste', (e) => {
        e.preventDefault();
        showNotification('Pasting is not allowed! 😊', 'warning');
    });
    
    // Hamburger menu
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Modal close handlers
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
        });
    });
    
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
}

// MENU FUNCTIONS
function showMenu() {
    menuSection.classList.remove('hidden');
    gameSection.classList.remove('active');
    updateBurgerMenuItems('menu');
}

function hideMenu() {
    menuSection.classList.add('hidden');
    setTimeout(() => {
        gameSection.classList.add('active');
        updateBurgerMenuItems('game');
    }, 300);
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
        showNotification(`Custom time set: ${customValue}s ⏱️`, 'success');
    } else {
        showNotification('Please enter a time between 10-300 seconds', 'warning');
    }
}

function selectDifficulty(card) {
    difficultyCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedDifficulty = card.dataset.difficulty;
}

function startGameFromMenu() {
    timeRemaining = selectedTime;
    hideMenu();
    updateDifficultyDisplay();
    
    // Typing transition effect
    setTimeout(() => {
        initializeTest();
        addTypingTransitionEffect();
    }, 400);
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

// TYPING TRANSITION EFFECT (FAST TYPING)
function addTypingTransitionEffect() {
    const textDisplayEl = document.getElementById('textDisplay');
    textDisplayEl.style.overflow = 'hidden';
    textDisplayEl.style.whiteSpace = 'nowrap';
    textDisplayEl.style.width = '0';
    textDisplayEl.classList.add('typing-transition');
    
    setTimeout(() => {
        textDisplayEl.style.overflow = '';
        textDisplayEl.style.whiteSpace = '';
        textDisplayEl.style.width = '';
        textDisplayEl.classList.remove('typing-transition');
    }, 900);
}

// BURGER MENU (DYNAMIC CONTENT)
function updateBurgerMenuItems(state) {
    const menuItems = document.querySelector('.menu-items');
    
    if (state === 'menu') {
        menuItems.innerHTML = `
            <button class="menu-item" data-action="stats">
                <i class="fas fa-chart-bar"></i>
                <span>View Statistics</span>
            </button>
            <button class="menu-item" data-action="reset">
                <i class="fas fa-trash-alt"></i>
                <span>Reset All Data</span>
            </button>
        `;
    } else {
        menuItems.innerHTML = `
            <button class="menu-item" data-action="menu">
                <i class="fas fa-home"></i>
                <span>Back to Menu</span>
            </button>
            <button class="menu-item" data-action="newGame">
                <i class="fas fa-redo"></i>
                <span>Restart Game</span>
            </button>
            <button class="menu-item" data-action="pause">
                <i class="fas fa-pause"></i>
                <span>Pause Test</span>
            </button>
            <button class="menu-item" data-action="stats">
                <i class="fas fa-chart-bar"></i>
                <span>View Statistics</span>
            </button>
            <button class="menu-item" data-action="reset">
                <i class="fas fa-trash-alt"></i>
                <span>Reset All Data</span>
            </button>
        `;
    }
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => handleMenuAction(e.currentTarget.dataset.action));
    });
}

function toggleMenu() {
    menuDropdown.classList.toggle('show');
    menuOverlay.classList.toggle('show');
}

function closeMenu() {
    menuDropdown.classList.remove('show');
    menuOverlay.classList.remove('show');
}

function handleMenuAction(action) {
    closeMenu();
    
    switch(action) {
        case 'newGame':
            resetTest();
            break;
        case 'pause':
            pauseTest();
            break;
        case 'menu':
            if (isTestActive) {
                if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                    showMenu();
                    resetTest();
                }
            } else {
                showMenu();
            }
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

function pauseTest() {
    if (isTestActive) {
        isTestActive = false;
        clearInterval(timerInterval);
        typingInput.disabled = true;
        
        // SHOW START BUTTON AGAIN
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        
        showNotification('Test paused. Click Start to resume.', 'info');
    }
}

// GAME INITIALIZATION
function initializeTest() {
    const samples = textSamples[selectedDifficulty];
    currentText = samples[Math.floor(Math.random() * samples.length)];
    
    // ⚡ FIXED: Render text with word-grouping to prevent word breaks
    const words = currentText.split(' ');
    let charIndex = 0;
    let html = '';
    
    words.forEach((word, wordIdx) => {
        // Create word wrapper
        html += '<span class="word">';
        
        // Add characters for this word
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            html += `<span class="char" data-index="${charIndex}">${char}</span>`;
            charIndex++;
        }
        
        html += '</span>';
        
        // Add space after word (except last word)
        if (wordIdx < words.length - 1) {
            html += `<span class="char space" data-index="${charIndex}">&nbsp;</span>`;
            charIndex++;
        }
    });
    
    textDisplay.innerHTML = html;
    
    currentPosition = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalCharsTyped = 0;
    currentCombo = 0;
    maxCombo = 0;
    timeRemaining = selectedTime;
    
    updateStats();
    updateProgress();
    hideComboDisplay(); // Ensure combo is hidden on init
    highlightCurrentChar();
    
    timerElement.textContent = timeRemaining;
    typingInput.value = '';
    typingInput.disabled = true;
    
    startBtn.disabled = false;
}

// TEST CONTROL
function startTest() {
    if (isTestActive) return;
    
    isTestActive = true;
    startTime = Date.now();
    
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    
    startTimer();
    showNotification('Test started! Type fast! 🚀', 'success');
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
    
    timerElement.textContent = selectedTime;
    timerElement.style.color = '';
    
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    
    hideComboDisplay();
    
    initializeTest();
}

// TYPING HANDLER
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
                createParticleEffect(chars[pos], 'correct');
            } else {
                chars[pos].classList.add('incorrect');
                chars[pos].classList.remove('correct');
                incorrectChars++;
                currentCombo = 0;
                createParticleEffect(chars[pos], 'incorrect');
            }
        }
        
        currentPosition = inputLength;
    } else if (inputLength < currentPosition) {
        for (let i = inputLength; i < currentPosition; i++) {
            const wasCorrect = chars[i].classList.contains('correct');
            const wasIncorrect = chars[i].classList.contains('incorrect');
            
            chars[i].classList.remove('correct', 'incorrect');
            
            if (wasCorrect) {
                correctChars--;
                currentCombo = Math.max(0, currentCombo - 1);
            }
            if (wasIncorrect) incorrectChars--;
            totalCharsTyped--;
        }
        
        currentPosition = inputLength;
    }
    
    updateStats();
    updateProgress();
    updateComboDisplay(); // NEW: Handles auto-hide
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

// TIMER
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 10) {
            timerElement.style.color = 'var(--error)';
            if (timeRemaining <= 5) {
                createShakeEffect(timerElement.closest('.stat-box'));
            }
        }
        
        if (timeRemaining <= 0) {
            endTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = timeRemaining;
}

// STATS UPDATE
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

// ⚡ IMPROVED COMBO DISPLAY WITH AUTO-HIDE
function updateComboDisplay() {
    // Clear existing timeout
    if (comboHideTimeout) {
        clearTimeout(comboHideTimeout);
        comboHideTimeout = null;
    }
    
    if (currentCombo >= 5) {
        comboValue.textContent = currentCombo;
        
        // Remove hiding class and show
        comboDisplay.classList.remove('hiding');
        comboDisplay.classList.add('show');
        
        // Set auto-hide after 2.5 seconds
        comboHideTimeout = setTimeout(() => {
            hideComboDisplay();
        }, 2500);
    } else {
        hideComboDisplay();
    }
}

function hideComboDisplay() {
    if (comboHideTimeout) {
        clearTimeout(comboHideTimeout);
        comboHideTimeout = null;
    }
    
    comboDisplay.classList.remove('show');
    comboDisplay.classList.add('hiding');
    
    // After animation completes, reset classes
    setTimeout(() => {
        comboDisplay.classList.remove('hiding');
    }, 500);
}

// END TEST
function endTest() {
    if (!isTestActive) return;
    
    isTestActive = false;
    clearInterval(timerInterval);
    hideComboDisplay();
    
    typingInput.disabled = true;
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = correctChars / 5;
    const finalWPM = Math.round(wordsTyped / timeElapsed);
    const finalAccuracy = totalCharsTyped > 0 
        ? Math.round((correctChars / totalCharsTyped) * 100) 
        : 100;
    
    saveStatistics(finalWPM, finalAccuracy);
    updateHighScores(finalWPM, finalAccuracy);
    
    showResultsModal(finalWPM, finalAccuracy, totalCharsTyped, maxCombo);
}

// MODALS
function showResultsModal(wpm, accuracy, chars, combo) {
    document.getElementById('finalWPM').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalChars').textContent = chars;
    document.getElementById('finalCombo').textContent = combo;
    
    const difficultyKey = `bestWPM_${selectedDifficulty}`;
    const bestWPM = parseInt(localStorage.getItem(difficultyKey) || '0');
    
    const newRecordBadge = document.getElementById('newRecordBadge');
    if (wpm > bestWPM) {
        newRecordBadge.style.display = 'block';
        celebrateRecord();
    } else {
        newRecordBadge.style.display = 'none';
    }
    
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
}

function showStatsModal() {
    updateStatsDisplay();
    const statsModal = new bootstrap.Modal(document.getElementById('statsModal'));
    statsModal.show();
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

function playAgain() {
    bootstrap.Modal.getInstance(document.getElementById('resultModal')).hide();
    resetTest();
}

// STORAGE
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

function resetAllData() {
    localStorage.clear();
    loadHighScores();
    updateStatsDisplay();
    showNotification('All data has been reset! 🔄', 'success');
}

// VISUAL EFFECTS
function createParticles() {
    const particlesBg = document.getElementById('particlesBg');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 15 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesBg.appendChild(particle);
    }
}

function createParticleEffect(charElement, type) {
    const rect = charElement.getBoundingClientRect();
    const effect = document.createElement('div');
    
    effect.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${type === 'correct' ? 'var(--success)' : 'var(--error)'};
        pointer-events: none;
        z-index: 1000;
        animation: particlePop 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 600);
}

function createShakeEffect(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.4s ease';
    }, 10);
}

function celebrateRecord() {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -10px;
            width: ${Math.random() * 12 + 6}px;
            height: ${Math.random() * 12 + 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 10000;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            opacity: 0.9;
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    const difference = targetNumber - currentNumber;
    const duration = 250;
    const steps = 15;
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'warning' ? 'var(--warning)' : type === 'success' ? 'var(--success)' : 'var(--accent-primary)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.4s ease;
        max-width: 320px;
        font-size: 0.95rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

// DYNAMIC ANIMATIONS (CSS IN JS)
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
    
    @keyframes particlePop {
        0% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(3.5) translateY(-25px);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    
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
document.head.appendChild(dynamicStyles);