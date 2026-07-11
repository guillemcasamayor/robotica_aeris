// Configuració de personatges i entorns
const avatars = {
    turtle: { emoji: '🐢', goal: '🥬', name: 'Tortuga', bgClass: 'bg-turtle', wallClass: 'wall-generic', wallEmoji: '🧱' },
    ballerina: { emoji: '💃', goal: '🎵', name: 'Ballerina', bgClass: 'bg-ballerina', wallClass: 'wall-generic', wallEmoji: '🧱' },
    robot: { emoji: '🛵', goal: '🔋', name: 'Moto Kawaii', bgClass: 'bg-robot', wallClass: 'wall-generic', wallEmoji: '🚧' },
    space: { emoji: '🚀', goal: '⭐', name: 'Nau Espacial', bgClass: 'bg-space', wallClass: 'wall-space', wallEmoji: '🪨' },
    rumi: { emoji: '<img src="https://ih1.redbubble.net/image.5955658826.6777/raf,360x360,075,t,fafafa:ca443f4786.jpg" class="avatar-img" alt="Rumi">', goal: '🍜', name: 'Rumi', bgClass: 'bg-rumi', wallClass: 'wall-generic', wallEmoji: '👹' }
};

let currentAvatarId = 'turtle';
let currentMode = 'programming'; // 'programming' o 'piloting'
let playMode = 'normal'; // 'normal' o 'random'

// Més nivells amb graelles grans
const levels = {
    // 4x4
    1: { title: "Nivell 1", gridSize: 4, start: { x: 0, y: 1 }, goal: { x: 2, y: 1 }, obstacles: [] },
    2: { title: "Nivell 2", gridSize: 4, start: { x: 1, y: 0 }, goal: { x: 1, y: 3 }, obstacles: [] },
    3: { title: "Nivell 3", gridSize: 4, start: { x: 0, y: 0 }, goal: { x: 2, y: 2 }, obstacles: [] },
    4: { title: "Nivell 4", gridSize: 4, start: { x: 0, y: 0 }, goal: { x: 3, y: 3 }, obstacles: [{x: 1, y: 1}] },
    // 5x5
    5: { title: "Nivell 5", gridSize: 5, start: { x: 0, y: 2 }, goal: { x: 4, y: 2 }, obstacles: [{x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}] },
    6: { title: "Nivell 6", gridSize: 5, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, obstacles: [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}] },
    7: { title: "Nivell 7", gridSize: 5, start: { x: 2, y: 0 }, goal: { x: 2, y: 4 }, obstacles: [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}] },
    8: { title: "Nivell 8", gridSize: 5, start: { x: 0, y: 4 }, goal: { x: 4, y: 0 }, obstacles: [{x: 1, y: 4}, {x: 1, y: 3}, {x: 1, y: 2}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0}] },
    // 6x6
    9: { title: "Nivell 9", gridSize: 6, start: { x: 0, y: 0 }, goal: { x: 5, y: 5 }, obstacles: [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 4, y: 5}, {x: 4, y: 4}] },
    10: { title: "Nivell 10", gridSize: 6, start: { x: 5, y: 0 }, goal: { x: 0, y: 5 }, obstacles: [{x: 4, y: 1}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 1, y: 4}] },
    11: { title: "Nivell 11", gridSize: 6, start: { x: 0, y: 3 }, goal: { x: 5, y: 3 }, obstacles: [{x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}] },
    // 7x7
    12: { title: "Nivell 12", gridSize: 7, start: { x: 0, y: 0 }, goal: { x: 6, y: 6 }, obstacles: [{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 3, y: 6}] },
    13: { title: "Nivell 13", gridSize: 7, start: { x: 3, y: 3 }, goal: { x: 0, y: 0 }, obstacles: [{x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 2, y: 3}, {x: 4, y: 3}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}] },
    14: { title: "Nivell 14", gridSize: 7, start: { x: 0, y: 6 }, goal: { x: 6, y: 0 }, obstacles: [{x: 1, y: 5}, {x: 2, y: 4}, {x: 3, y: 3}, {x: 4, y: 2}, {x: 5, y: 1}] },
    // 8x8
    15: { title: "Nivell 15", gridSize: 8, start: { x: 0, y: 0 }, goal: { x: 7, y: 7 }, obstacles: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}, {x: 6, y: 6}, {x: 1, y: 7}, {x: 2, y: 6}, {x: 3, y: 5}] },
    16: { title: "Nivell 16", gridSize: 8, start: { x: 4, y: 7 }, goal: { x: 4, y: 0 }, obstacles: [{x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 7, y: 4}] },
    17: { title: "Nivell 17", gridSize: 8, start: { x: 7, y: 0 }, goal: { x: 0, y: 7 }, obstacles: [{x: 6, y: 0}, {x: 6, y: 1}, {x: 6, y: 2}, {x: 4, y: 7}, {x: 4, y: 6}, {x: 4, y: 5}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}] },
    18: { title: "Nivell 18", gridSize: 8, start: { x: 0, y: 3 }, goal: { x: 7, y: 4 }, obstacles: [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6}, {x: 5, y: 7}] }
};

let currentLevel = 1;
let score = 0;
let sequence = [];
let isExecuting = false;
let robotState = { x: 0, y: 0, dir: 0 }; 
let playerName = "Jugador/a";

const welcomeScreen = document.getElementById('welcome-screen');
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

// Start Flow
document.getElementById('btn-submit-name').addEventListener('click', () => {
    const input = document.getElementById('player-name-input').value.trim();
    if (input) {
        playerName = input;
    }
    welcomeScreen.classList.remove('active');
    mainMenu.classList.add('active');
    document.getElementById('menu-title').textContent = `✨ Aventures de ${playerName} ✨`;
    document.getElementById('success-message').textContent = `Ho has aconseguit, ${playerName}!`;
});

// Start Buttons
document.getElementById('btn-start-normal').addEventListener('click', () => {
    playMode = 'normal';
    currentLevel = 1;
    startGame(currentLevel);
});

document.getElementById('btn-start-random').addEventListener('click', () => {
    playMode = 'random';
    currentLevel = getRandomLevel();
    startGame(currentLevel);
});

document.getElementById('btn-back').addEventListener('click', showMainMenu);
document.getElementById('btn-clear').addEventListener('click', clearSequence);
document.getElementById('btn-play').addEventListener('click', executeSequence);

document.getElementById('btn-next-level').addEventListener('click', () => {
    document.getElementById('success-modal').classList.add('hidden');
    if (playMode === 'normal') {
        currentLevel++;
        if (levels[currentLevel]) {
            startGame(currentLevel);
        } else {
            alert("Has completat tots els nivells, ets una campiona!");
            showMainMenu();
        }
    } else {
        // Random mode
        currentLevel = getRandomLevel();
        startGame(currentLevel);
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

// Controls de teclat
document.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('active') && !isExecuting) {
        let cmd = null;
        if (e.key === 'ArrowUp') cmd = 'up';
        if (e.key === 'ArrowDown') cmd = 'down';
        if (e.key === 'ArrowLeft') cmd = 'left';
        if (e.key === 'ArrowRight') cmd = 'right';

        if (cmd) {
            if (currentMode === 'piloting') {
                handlePilotMove(cmd);
            } else if (currentMode === 'programming') {
                addCommand(cmd);
            }
        }
    }
});

function getRandomLevel() {
    const keys = Object.keys(levels);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return parseInt(keys[randomIndex]);
}

function showMainMenu() {
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    document.getElementById('success-modal').classList.add('hidden');
    document.getElementById('fail-modal').classList.add('hidden');
}

function startGame(levelId) {
    mainMenu.classList.remove('active');
    gameScreen.classList.add('active');
    
    if (currentMode === 'programming') {
        progControls.classList.remove('hidden');
        pilotControls.classList.add('hidden');
    } else {
        progControls.classList.add('hidden');
        pilotControls.classList.remove('hidden');
    }
    
    const levelData = levels[levelId];
    if (playMode === 'random') {
        levelTitle.textContent = `Nivell Aleatori (${levelData.gridSize}x${levelData.gridSize})`;
    } else {
        levelTitle.textContent = levelData.title;
    }
    
    sequence = [];
    isExecuting = false;
    updateQueueUI();
    
    robotState = { ...levelData.start, dir: 0 }; 
    
    renderGrid(levelData);
}

function renderGrid(levelData) {
    gridElement.innerHTML = '';
    const size = levelData.gridSize;
    
    // Calcula la mida de cel·la de forma dinàmica segons la pantalla i el tamany del grid
    const maxGridWidth = Math.min(window.innerWidth * 0.9, 600); // 90vw o 600px max
    const calculatedCellSize = Math.floor((maxGridWidth - (size * 4)) / size); // Restem els gaps
    
    document.documentElement.style.setProperty('--cell-size', `${calculatedCellSize}px`);

    gridElement.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    gridElement.style.gridTemplateRows = `repeat(${size}, var(--cell-size))`;
    
    const avatarData = avatars[currentAvatarId];
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add(avatarData.bgClass);
            cell.id = `cell-${x}-${y}`;
            
            const isObstacle = levelData.obstacles && levelData.obstacles.some(obs => obs.x === x && obs.y === y);
            
            if (isObstacle) {
                cell.classList.remove(avatarData.bgClass);
                cell.classList.add('obstacle');
                cell.classList.add(avatarData.wallClass);
                cell.innerHTML = avatarData.wallEmoji;
            } else if (levelData.goal.x === x && levelData.goal.y === y) {
                cell.classList.add('goal');
                cell.innerHTML = avatarData.goal;
            }
            
            gridElement.appendChild(cell);
        }
    }
    
    const robot = document.createElement('div');
    robot.id = 'robot';
    robot.innerHTML = avatarData.emoji;
    gridElement.appendChild(robot);
    
    updateRobotPosition();
}

function updateRobotPosition() {
    const robot = document.getElementById('robot');
    const gap = 4;
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
        if (cmd === 'up') icon = '⬆️';
        if (cmd === 'down') icon = '⬇️';
        if (cmd === 'left') icon = '⬅️';
        if (cmd === 'right') icon = '➡️';
        
        div.innerHTML = `<span>${icon}</span> <button class="remove-cmd" onclick="removeCommand(${index})">❌</button>`;
        sequenceQueue.appendChild(div);
    });
    
    sequenceQueue.scrollTop = sequenceQueue.scrollHeight;
}

async function executeSequence() {
    if (sequence.length === 0 || isExecuting) return;
    isExecuting = true;
    
    robotState = { ...levels[currentLevel].start, dir: 0 };
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
        const success = await attemptMove(cmd);
        
        if (!success) {
            isExecuting = false;
            return;
        }
        
        await delay(600); 
    }
    
    document.querySelectorAll('.queue-item').forEach(el => el.classList.remove('active'));
    checkGoal();
    isExecuting = false;
}

async function attemptMove(dirName) {
    let nx = robotState.x;
    let ny = robotState.y;
    
    if (dirName === 'up') {
        robotState.dir = 3; 
        ny--;
    } else if (dirName === 'down') {
        robotState.dir = 1; 
        ny++;
    } else if (dirName === 'left') {
        robotState.dir = 2; 
        nx--;
    } else if (dirName === 'right') {
        robotState.dir = 0; 
        nx++;
    }

    const size = levels[currentLevel].gridSize;
    const isObstacle = levels[currentLevel].obstacles && levels[currentLevel].obstacles.some(obs => obs.x === nx && obs.y === ny);

    if (nx >= 0 && nx < size && ny >= 0 && ny < size && !isObstacle) {
        robotState.x = nx;
        robotState.y = ny;
        updateRobotPosition();
        return true;
    } else {
        robotState.x = nx;
        robotState.y = ny;
        updateRobotPosition();
        await delay(300);
        if (isObstacle) {
            showFail("Hem xocat amb un obstacle!");
        } else {
            showFail("No podem sortir de la graella!");
        }
        return false;
    }
}

async function handlePilotMove(dirName) {
    if (isExecuting) return;
    isExecuting = true; 

    const success = await attemptMove(dirName);
    if (!success) {
        isExecuting = false;
        return;
    }

    await delay(300); 
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
