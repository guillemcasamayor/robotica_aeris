// Configuració de personatges i entorns
const avatars = {
    turtle: { emoji: '🐢', goal: '🥬', name: 'Tortuga', bgClass: 'bg-turtle', wallClass: 'wall-generic', wallEmoji: '🧱' },
    ballerina: { emoji: '💃', goal: '🎵', name: 'Ballerina', bgClass: 'bg-ballerina', wallClass: 'wall-generic', wallEmoji: '🧱' },
    robot: { emoji: '👾', goal: '🔋', name: 'Robot Kawaii', bgClass: 'bg-robot', wallClass: 'wall-generic', wallEmoji: '🚧' },
    space: { emoji: '🚀', goal: '⭐', name: 'Nau Espacial', bgClass: 'bg-space', wallClass: 'wall-space', wallEmoji: '🪨' }
};

let currentAvatarId = 'turtle';
let currentMode = 'programming'; // 'programming' o 'piloting'

// Nivells de dificultat progressiva (Sense girs relatius, tot direccional)
const levels = {
    1: { title: "Nivell 1: Tot recte", gridSize: 4, start: { x: 0, y: 1 }, goal: { x: 2, y: 1 }, obstacles: [] },
    2: { title: "Nivell 2: Baixem", gridSize: 4, start: { x: 1, y: 0 }, goal: { x: 1, y: 3 }, obstacles: [] },
    3: { title: "Nivell 3: En diagonal", gridSize: 4, start: { x: 0, y: 0 }, goal: { x: 2, y: 2 }, obstacles: [] },
    4: { title: "Nivell 4: Un petit obstacle", gridSize: 4, start: { x: 0, y: 0 }, goal: { x: 3, y: 3 }, 
         obstacles: [{x: 1, y: 1}] },
    5: { title: "Nivell 5: El mur curt", gridSize: 5, start: { x: 0, y: 2 }, goal: { x: 4, y: 2 }, 
         obstacles: [{x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}] },
    6: { title: "Nivell 6: Corba perillosa", gridSize: 5, start: { x: 0, y: 0 }, goal: { x: 4, y: 4 }, 
         obstacles: [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}] },
    7: { title: "Nivell 7: Dos camins", gridSize: 5, start: { x: 2, y: 0 }, goal: { x: 2, y: 4 }, 
         obstacles: [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}] },
    8: { title: "Nivell 8: El gran laberint", gridSize: 5, start: { x: 0, y: 4 }, goal: { x: 4, y: 0 }, 
         obstacles: [{x: 1, y: 4}, {x: 1, y: 3}, {x: 1, y: 2}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0}] }
};

let currentLevel = 1;
let score = 0;
let sequence = [];
let isExecuting = false;

// Estat del personatge (ja no cal 'dir' perquè no mirem cap on està encarat visualment per moure'ns, sempre mirem "a la dreta" per defecte, o podem actualitzar-ho si volem)
let robotState = { x: 0, y: 0, dir: 0 }; 

const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const gridElement = document.getElementById('grid');
const sequenceQueue = document.getElementById('sequence-queue');
const scoreVal = document.getElementById('score-val');
const levelTitle = document.getElementById('level-title');
const progControls = document.getElementById('prog-controls');
const pilotControls = document.getElementById('pilot-controls');
const levelSelectorContainer = document.getElementById('level-selector-container');

// Inicialitzar botons de nivells
function initLevelsMenu() {
    levelSelectorContainer.innerHTML = '';
    for(let i = 1; i <= Object.keys(levels).length; i++) {
        const btn = document.createElement('button');
        btn.classList.add('level-btn');
        btn.dataset.level = i;
        btn.innerText = `Nivell ${i}`;
        btn.addEventListener('click', () => {
            currentLevel = i;
            startGame(i);
        });
        levelSelectorContainer.appendChild(btn);
    }
}
initLevelsMenu();

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

// Botons de programació (ara amb direccions absolutes)
document.querySelectorAll('.prog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (isExecuting || currentMode !== 'programming') return;
        const cmdElement = e.target.closest('.cmd-btn');
        const cmd = cmdElement.dataset.cmd; // 'up', 'down', 'left', 'right'
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
    
    const levelData = levels[levelId];
    levelTitle.textContent = levelData.title;
    
    sequence = [];
    isExecuting = false;
    updateQueueUI();
    
    robotState = { ...levelData.start, dir: 0 }; 
    
    renderGrid(levelData);
}

function renderGrid(levelData) {
    gridElement.innerHTML = '';
    const size = levelData.gridSize;
    gridElement.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    gridElement.style.gridTemplateRows = `repeat(${size}, var(--cell-size))`;
    
    const avatarData = avatars[currentAvatarId];
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add(avatarData.bgClass); // Afegeix la textura de fons
            cell.id = `cell-${x}-${y}`;
            
            // Comprovem si és un obstacle
            const isObstacle = levelData.obstacles && levelData.obstacles.some(obs => obs.x === x && obs.y === y);
            
            if (isObstacle) {
                cell.classList.remove(avatarData.bgClass);
                cell.classList.add('obstacle');
                cell.classList.add(avatarData.wallClass);
                cell.innerHTML = avatarData.wallEmoji;
            } else if (levelData.goal.x === x && levelData.goal.y === y) {
                // Check goal
                cell.classList.add('goal');
                cell.innerHTML = avatarData.goal;
            }
            
            gridElement.appendChild(cell);
        }
    }
    
    // Create player element
    const robot = document.createElement('div');
    robot.id = 'robot';
    robot.innerHTML = avatarData.emoji;
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

// Intentar moure el robot en una direcció absoluta
async function attemptMove(dirName) {
    let nx = robotState.x;
    let ny = robotState.y;
    
    if (dirName === 'up') {
        robotState.dir = 3; // Nord (270deg)
        ny--;
    } else if (dirName === 'down') {
        robotState.dir = 1; // Sud (90deg)
        ny++;
    } else if (dirName === 'left') {
        robotState.dir = 2; // Oest (180deg)
        nx--;
    } else if (dirName === 'right') {
        robotState.dir = 0; // Est (0deg)
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
        // Xoc o cau fora
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

// Lògica de Pilotatge (Direct Move)
async function handlePilotMove(dirName) {
    if (isExecuting) return;
    isExecuting = true; 

    const success = await attemptMove(dirName);
    if (!success) {
        isExecuting = false;
        return;
    }

    await delay(300); // Temps per animació curta
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
