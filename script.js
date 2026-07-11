// Configuració de personatges i entorns
const avatars = {
    turtle: { emoji: '🐢', goal: '🥬', itemEmoji: '🍓', name: 'Tortuga', bgClass: 'bg-turtle', wallClass: 'wall-generic', wallEmoji: '🧱' },
    ballerina: { emoji: '💃', goal: '🎵', itemEmoji: '🎀', name: 'Ballerina', bgClass: 'bg-ballerina', wallClass: 'wall-generic', wallEmoji: '🧱' },
    robot: { emoji: '🛵', goal: '🔋', itemEmoji: '⛽', name: 'Moto Kawaii', bgClass: 'bg-robot', wallClass: 'wall-generic', wallEmoji: '🚧' },
    space: { emoji: '🚀', goal: '⭐', itemEmoji: '☄️', name: 'Nau Espacial', bgClass: 'bg-space', wallClass: 'wall-space', wallEmoji: '🪨' },
    rumi: { emoji: '<img src="https://ih1.redbubble.net/image.5955658826.6777/raf,360x360,075,t,fafafa:ca443f4786.jpg" class="avatar-img" alt="Rumi">', goal: '<img src="https://ih1.redbubble.net/image.5869498024.3067/st,large,507x507-pad,600x600,f8f8f8.jpg" class="avatar-img" alt="Ramen">', itemEmoji: '🥟', name: 'Rumi', bgClass: 'bg-rumi', wallClass: 'wall-generic', wallEmoji: '👹' }
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
    13: { title: "Nivell 13", gridSize: 7, start: { x: 3, y: 3 }, goal: { x: 0, y: 0 }, obstacles: [{x: 2, y: 2}, {x: 4, y: 2}, {x: 2, y: 3}, {x: 4, y: 3}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}] }, // Fixed impossible wall
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

let collectedItems = 0;
let totalItems = 0;
let levelItems = [];

const welcomeScreen = document.getElementById('welcome-screen');
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const gridElement = document.getElementById('grid');
const sequenceQueue = document.getElementById('sequence-queue');
const scoreVal = document.getElementById('score-val');
const levelTitle = document.getElementById('level-title');
const progControls = document.getElementById('prog-controls');
const pilotControls = document.getElementById('pilot-controls');

// Generador de laberints procedurals amb ítems
function generateProceduralLevel(size) {
    while (true) {
        let level = {
            title: `Nivell Aleatori (${size}x${size})`,
            gridSize: size,
            start: { x: 0, y: 0 },
            goal: { x: size - 1, y: size - 1 },
            obstacles: [],
            items: []
        };
        
        // Posa obstacles aleatoris
        let numObstacles = Math.floor(size * 1.5);
        for (let i = 0; i < numObstacles; i++) {
            let ox = Math.floor(Math.random() * size);
            let oy = Math.floor(Math.random() * size);
            if ((ox === 0 && oy === 0) || (ox === size - 1 && oy === size - 1)) continue;
            if (!level.obstacles.some(o => o.x === ox && o.y === oy)) {
                level.obstacles.push({ x: ox, y: oy });
            }
        }
        
        // Posa ítems aleatoris (entre 2 i 4)
        let numItems = Math.floor(Math.random() * 3) + 2; 
        let placedItems = 0;
        let attempts = 0;
        while (placedItems < numItems && attempts < 100) {
            attempts++;
            let ix = Math.floor(Math.random() * size);
            let iy = Math.floor(Math.random() * size);
            if ((ix === 0 && iy === 0) || (ix === size - 1 && iy === size - 1)) continue;
            if (level.obstacles.some(o => o.x === ix && o.y === iy)) continue;
            if (level.items.some(i => i.x === ix && i.y === iy)) continue;
            level.items.push({ x: ix, y: iy });
            placedItems++;
        }
        
        // Valida amb BFS que tot sigui accessible
        let reachable = getReachableCells(level, size);
        let goalReachable = reachable.some(r => r.x === level.goal.x && r.y === level.goal.y);
        let itemsReachable = level.items.every(item => reachable.some(r => r.x === item.x && r.y === item.y));
        
        if (goalReachable && itemsReachable) {
            return level;
        }
    }
}

function getReachableCells(level, size) {
    let visited = Array.from({length: size}, () => Array(size).fill(false));
    let queue = [{x: 0, y: 0}];
    visited[0][0] = true;
    let reachable = [];
    
    let dirs = [[-1,0], [1,0], [0,-1], [0,1]];
    
    while(queue.length > 0) {
        let curr = queue.shift();
        reachable.push(curr);
        
        for (let d of dirs) {
            let nx = curr.x + d[0];
            let ny = curr.y + d[1];
            
            if (nx >= 0 && nx < size && ny >= 0 && ny < size && !visited[nx][ny]) {
                if (!level.obstacles.some(o => o.x === nx && o.y === ny)) {
                    visited[nx][ny] = true;
                    queue.push({x: nx, y: ny});
                }
            }
        }
    }
    return reachable;
}

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
    startGame('random');
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
        startGame('random');
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
    
    let levelData;
    if (playMode === 'random') {
        let randomSize = Math.floor(Math.random() * 3) + 6; // 6, 7 o 8
        levelData = generateProceduralLevel(randomSize);
        levels['random'] = levelData;
        currentLevel = 'random';
    } else {
        levelData = levels[levelId];
    }
    
    levelTitle.textContent = levelData.title;
    
    sequence = [];
    isExecuting = false;
    updateQueueUI();
    
    robotState = { ...levelData.start, dir: 0 }; 
    levelItems = levelData.items ? [...levelData.items] : [];
    totalItems = levelItems.length;
    collectedItems = 0;
    
    updateItemCounterUI();
    renderGrid(levelData);
}

function updateItemCounterUI() {
    const container = document.getElementById('item-counter-container');
    const val = document.getElementById('items-val');
    const emojiDisplay = document.getElementById('item-emoji-display');
    
    if (totalItems > 0) {
        container.classList.remove('hidden');
        emojiDisplay.textContent = avatars[currentAvatarId].itemEmoji || '💎';
        val.textContent = `${collectedItems} / ${totalItems}`;
    } else {
        container.classList.add('hidden');
    }
}

function renderGrid(levelData) {
    gridElement.innerHTML = '';
    const size = levelData.gridSize;
    
    const maxGridWidth = Math.min(window.innerWidth * 0.9, 600); 
    const calculatedCellSize = Math.floor((maxGridWidth - (size * 4)) / size); 
    
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
            } else {
                let hasItem = levelItems.some(i => i.x === x && i.y === y);
                if (hasItem) {
                    let itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.innerHTML = avatarData.itemEmoji || '💎';
                    cell.appendChild(itemDiv);
                }
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
    
    // Reset state before running
    robotState = { ...levels[currentLevel].start, dir: 0 };
    levelItems = levels[currentLevel].items ? [...levels[currentLevel].items] : [];
    collectedItems = 0;
    updateItemCounterUI();
    renderGrid(levels[currentLevel]);
    
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
        
        // Comprovar si recollim ítem
        let itemIndex = levelItems.findIndex(i => i.x === nx && i.y === ny);
        if (itemIndex !== -1) {
            levelItems.splice(itemIndex, 1);
            collectedItems++;
            updateItemCounterUI();
            
            // Eliminar ítem del DOM
            let cell = document.getElementById(`cell-${nx}-${ny}`);
            let itemEl = cell.querySelector('.item');
            if (itemEl) itemEl.remove();
        }

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
        if (collectedItems === totalItems) {
            score += 10;
            scoreVal.textContent = score;
            document.getElementById('success-message').textContent = `Ho has aconseguit, ${playerName}!`;
            document.getElementById('success-modal').classList.remove('hidden');
        } else {
            showFail(`Et falten ${totalItems - collectedItems} objectes per recollir!`);
        }
    } else if (currentMode === 'programming') {
        showFail(`No hem arribat a l'objectiu!`);
    }
}

function showFail(msg) {
    document.getElementById('fail-message').textContent = msg;
    document.getElementById('fail-modal').classList.remove('hidden');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
