// Configuració de personatges
const avatars = {
    turtle: { emoji: '🐢', goal: '🥬', name: 'Tortuga' },
    ballerina: { emoji: '💃', goal: '🎵', name: 'Ballerina' },
    robot: { emoji: '👾', goal: '🔋', name: 'Robot Kawaii' },
    space: { emoji: '🚀', goal: '⭐', name: 'Nau Espacial' }
};

let currentAvatarId = 'turtle';
let currentMode = 'programming'; // 'programming' o 'piloting'

// Dades dels nivells molt bàsics (per 4 anys)
const levels = {
    1: {
        title: "Nivell 1",
        gridSize: 4,
        start: { x: 0, y: 1, dir: 0 }, // dir: 0=Dreta, 1=Abaix, 2=Esquerra, 3=Dalt
        goal: { x: 2, y: 1 }
    },
    2: {
        title: "Nivell 2",
        gridSize: 4,
        start: { x: 0, y: 0, dir: 1 },
        goal: { x: 0, y: 3 }
    },
    3: {
        title: "Nivell 3",
        gridSize: 4,
        start: { x: 0, y: 0, dir: 0 },
        goal: { x: 2, y: 2 } 
    }
};

let currentLevel = 1;
let score = 0;
let sequence = [];
let isExecuting = false;

// Estat del personatge
let robotState = {
    x: 0,
    y: 0,
    dir: 0 // 0: est, 1: sud, 2: oest, 3: nord
};

// Elements del DOM
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const gridElement = document.getElementById('grid');
const sequenceQueue = document.getElementById('sequence-queue');
const scoreVal = document.getElementById('score-val');
const levelTitle = document.getElementById('level-title');

const progControls = document.getElementById('prog-controls');
const pilotControls = document.getElementById('pilot-controls');

// Gestió de selecció de personatge
document.querySelectorAll('.avatar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
        const btnElement = e.target.closest('.avatar-btn');
        btnElement.classList.add('selected');
        currentAvatarId = btnElement.dataset.avatar;
    });
});

// Gestió de selecció de mode
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
        const btnElement = e.target.closest('.mode-btn');
        btnElement.classList.add('selected');
        currentMode = btnElement.dataset.mode;
    });
});

// Inicialització de nivells
document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const btnElement = e.target.closest('.level-btn');
        currentLevel = parseInt(btnElement.dataset.level);
        startGame(currentLevel);
    });
});

document.getElementById('btn-back').addEventListener('click', showMainMenu);
document.getElementById('btn-clear').addEventListener('click', clearSequence);
document.getElementById('btn-play').addEventListener('click', executeSequence);

document.getElementById('btn-next-level').addEventListener('click', () => {
    document.getElementById('success-modal').classList.add('hidden');
    currentLevel++;
    if (levels[currentLevel]) {
        startGame(currentLevel);
    } else {
        alert("Has completat tots els nivells, ets una campiona!");
        showMainMenu();
    }
});

document.getElementById('btn-retry').addEventListener('click', () => {
    document.getElementById('fail-modal').classList.add('hidden');
    startGame(currentLevel); 
});

// Botons de programació
document.querySelectorAll('.prog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (isExecuting || currentMode !== 'programming') return;
        const cmdElement = e.target.closest('.cmd-btn');
        const cmd = cmdElement.dataset.cmd;
        addCommand(cmd);
    });
});

// Botons de pilotatge
document.querySelectorAll('.pilot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (isExecuting || currentMode !== 'piloting') return;
        const cmdElement = e.target.closest('.cmd-btn');
        const cmd = cmdElement.dataset.cmd;
        handlePilotMove(cmd);
    });
});

// Controls de teclat per Pilotatge
document.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('active') && currentMode === 'piloting' && !isExecuting) {
        if (e.key === 'ArrowUp') handlePilotMove('up');
        if (e.key === 'ArrowDown') handlePilotMove('down');
        if (e.key === 'ArrowLeft') handlePilotMove('left');
        if (e.key === 'ArrowRight') handlePilotMove('right');
    }
});

function showMainMenu() {
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    document.getElementById('success-modal').classList.add('hidden');
    document.getElementById('fail-modal').classList.add('hidden');
}

function startGame(levelId) {
    mainMenu.classList.remove('active');
    gameScreen.classList.add('active');
    
    // Configurar els controls segons el mode
    if (currentMode === 'programming') {
        progControls.classList.remove('hidden');
        pilotControls.classList.add('hidden');
    } else {
        progControls.classList.add('hidden');
        pilotControls.classList.remove('hidden');
    }
    
    const levelData = levels[levelId];
    levelTitle.textContent = levelData.title;
    
    // Reset state
    sequence = [];
    isExecuting = false;
    updateQueueUI();
    
    robotState = { ...levelData.start };
    
    renderGrid(levelData);
}

function renderGrid(levelData) {
    gridElement.innerHTML = '';
    const size = levelData.gridSize;
    gridElement.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    gridElement.style.gridTemplateRows = `repeat(${size}, var(--cell-size))`;
    
    const goalEmoji = avatars[currentAvatarId].goal;
    const playerEmoji = avatars[currentAvatarId].emoji;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${x}-${y}`;
            
            // Check goal
            if (levelData.goal.x === x && levelData.goal.y === y) {
                cell.classList.add('goal');
                cell.innerHTML = goalEmoji;
            }
            
            gridElement.appendChild(cell);
        }
    }
    
    // Create player element
    const robot = document.createElement('div');
    robot.id = 'robot';
    robot.innerHTML = playerEmoji;
    gridElement.appendChild(robot);
    
    updateRobotPosition();
}

function updateRobotPosition() {
    const robot = document.getElementById('robot');
    const gap = 8;
    const cellSizeStr = getComputedStyle(document.documentElement).getPropertyValue('--cell-size').trim();
    const cellSize = parseInt(cellSizeStr);
    
    const xPos = robotState.x * (cellSize + gap);
    const yPos = robotState.y * (cellSize + gap);
    const rotation = robotState.dir * 90;
    
    robot.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotation}deg)`;
}

// Lògica de Programació
function addCommand(cmd) {
    sequence.push(cmd);
    updateQueueUI();
}

function removeCommand(index) {
    if (isExecuting) return;
    sequence.splice(index, 1);
    updateQueueUI();
}

function clearSequence() {
    if (isExecuting) return;
    sequence = [];
    updateQueueUI();
}

function updateQueueUI() {
    sequenceQueue.innerHTML = '';
    sequence.forEach((cmd, index) => {
        const div = document.createElement('div');
        div.classList.add('queue-item');
        div.id = `queue-item-${index}`;
        
        let icon = '';
        if (cmd === 'forward') { icon = '⬆️'; }
        else if (cmd === 'left') { icon = '↩️'; }
        else if (cmd === 'right') { icon = '↪️'; }
        
        div.innerHTML = `<span>${icon}</span> <button class="remove-cmd" onclick="removeCommand(${index})">❌</button>`;
        sequenceQueue.appendChild(div);
    });
    
    sequenceQueue.scrollTop = sequenceQueue.scrollHeight;
}

async function executeSequence() {
    if (sequence.length === 0 || isExecuting) return;
    isExecuting = true;
    
    robotState = { ...levels[currentLevel].start };
    updateRobotPosition();
    await delay(500); 
    
    for (let i = 0; i < sequence.length; i++) {
        document.querySelectorAll('.queue-item').forEach(el => el.classList.remove('active'));
        const currentItem = document.getElementById(`queue-item-${i}`);
        if (currentItem) {
            currentItem.classList.add('active');
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        const cmd = sequence[i];
        if (cmd === 'forward') {
            let nx = robotState.x;
            let ny = robotState.y;
            
            if (robotState.dir === 0) nx++; // Est
            else if (robotState.dir === 1) ny++; // Sud
            else if (robotState.dir === 2) nx--; // Oest
            else if (robotState.dir === 3) ny--; // Nord
            
            const size = levels[currentLevel].gridSize;
            if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
                await delay(300);
                showFail("Hem sortit del camí!");
                isExecuting = false;
                return;
            }
            
            robotState.x = nx;
            robotState.y = ny;
            
        } else if (cmd === 'left') {
            robotState.dir = (robotState.dir + 3) % 4;
        } else if (cmd === 'right') {
            robotState.dir = (robotState.dir + 1) % 4;
        }
        
        updateRobotPosition();
        await delay(800); 
    }
    
    document.querySelectorAll('.queue-item').forEach(el => el.classList.remove('active'));
    checkGoal();
    isExecuting = false;
}

// Lògica de Pilotatge (Direct Move)
async function handlePilotMove(dirName) {
    if (isExecuting) return;
    isExecuting = true; // Prevé multi-press ràpid

    let nx = robotState.x;
    let ny = robotState.y;
    
    if (dirName === 'up') {
        robotState.dir = 3; // Nord
        ny--;
    } else if (dirName === 'down') {
        robotState.dir = 1; // Sud
        ny++;
    } else if (dirName === 'left') {
        robotState.dir = 2; // Oest
        nx--;
    } else if (dirName === 'right') {
        robotState.dir = 0; // Est
        nx++;
    }

    const size = levels[currentLevel].gridSize;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        robotState.x = nx;
        robotState.y = ny;
    } else {
        // Reproduir animació de que xoca, però no donem el nivell per perdut
        robotState.x = nx;
        robotState.y = ny;
        updateRobotPosition();
        await delay(300);
        showFail("No podem sortir de la graella!");
        isExecuting = false;
        return;
    }

    updateRobotPosition();
    await delay(400); // Wait for animation
    
    checkGoal();
    isExecuting = false;
}

function checkGoal() {
    const goal = levels[currentLevel].goal;
    if (robotState.x === goal.x && robotState.y === goal.y) {
        score += 10;
        scoreVal.textContent = score;
        document.getElementById('success-modal').classList.remove('hidden');
    } else if (currentMode === 'programming') {
        // En mode programació falles si no arribes a la fita al final
        showFail(`No hem arribat a ${avatars[currentAvatarId].goal}`);
    }
}

function showFail(msg) {
    document.getElementById('fail-message').textContent = msg;
    document.getElementById('fail-modal').classList.remove('hidden');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
