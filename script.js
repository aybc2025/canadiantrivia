// משתני המשחק הגלובליים
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    spinResult: null,
    cities: [
        { id: 'ottawa', name: 'אוטווה', province: 'אוטווה', x: 75, y: 65, isStart: true },
        { id: 'toronto', name: 'טורונטו', province: 'אונטריו', x: 72, y: 68 },
        { id: 'montreal', name: 'מונטריאול', province: 'קוויבק', x: 78, y: 62 },
        { id: 'vancouver', name: 'ונקובר', province: 'קולומביה הבריטית', x: 15, y: 55 },
        { id: 'calgary', name: 'קלגרי', province: 'אלברטה', x: 35, y: 58 },
        { id: 'winnipeg', name: 'וויניפג', province: 'מניטובה', x: 55, y: 62 },
        { id: 'halifax', name: 'הליפקס', province: 'נובא סקוטיה', x: 88, y: 68 },
        { id: 'charlottetown', name: 'שארלוטטאון', province: 'אי הנסיך אדוארד', x: 85, y: 65 },
        { id: 'fredericton', name: 'פרדריקטון', province: 'ניו ברנזוויק', x: 82, y: 67 },
        { id: 'stjohns', name: 'סנט ג\'ונס', province: 'ניופאונדלנד ולברדור', x: 92, y: 58 },
        { id: 'regina', name: 'רג\'ינה', province: 'ססקצ\'ואן', x: 45, y: 65 },
        { id: 'whitehorse', name: 'ווייטהורס', province: 'יוקון', x: 10, y: 25 },
        { id: 'yellowknife', name: 'ילונייף', province: 'הטריטוריות הצפון-מערביות', x: 35, y: 35 }
    ]
};

// בנק שאלות - יטען מקובץ JSON
let questionBank = {};

// קטגוריות הרולטה
const spinnerCategories = [
    { name: 'geography', label: 'גיאוגרפיה', color: '#e74c3c' },
    { name: 'history', label: 'היסטוריה', color: '#3498db' },
    { name: 'general', label: 'כללי', color: '#27ae60' },
    { name: 'arts', label: 'אמנות', color: '#f39c12' },
    { name: 'choice', label: 'בחירה', color: '#9b59b6' },
    { name: 'move', label: 'תזוזה', color: '#34495e' }
];

// אתחול המשחק
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions().then(() => {
        initializeGame();
    }).catch(error => {
        console.error('שגיאה בטעינת השאלות:', error);
        alert('שגיאה בטעינת השאלות. אנא רענן את הדף.');
    });
});

// טעינת השאלות מקובץ JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        questionBank = await response.json();
        console.log('השאלות נטענו בהצלחה:', Object.keys(questionBank).map(category => 
            `${category}: ${Object.keys(questionBank[category]).map(level => 
                `${level} (${questionBank[category][level].length})`
            ).join(', ')}`
        ).join(' | '));
    } catch (error) {
        console.error('Error loading questions:', error);
        // פולבק לשאלות בסיסיות במקרה של שגיאה
        questionBank = {
            geography: {
                expert: [
                    {
                        question: "מהי הבירה של קנדה?",
                        answers: ["טורונטו", "מונטריאול", "אוטווה", "ונקובר"],
                        correct: 2,
                        fact: "אוטווה היא הבירה של קנדה."
                    }
                ],
                junior: [
                    {
                        question: "איזה צבע נמצא בדגל קנדה?",
                        answers: ["כחול", "ירוק", "אדום", "צהוב"],
                        correct: 2,
                        fact: "הדגל הקנדי הוא אדום ולבן עם עלה אדר אדום במרכז."
                    }
                ]
            },
            history: {
                expert: [
                    {
                        question: "באיזו שנה הוקמה הקונפדרציה הקנדית?",
                        answers: ["1865", "1867", "1869", "1871"],
                        correct: 1,
                        fact: "הקונפדרציה הקנדית הוקמה ב-1867."
                    }
                ],
                junior: [
                    {
                        question: "איזה חיה מופיעה על המטבע הקנדי?",
                        answers: ["דוב", "צבי", "כבשה", "אריה"],
                        correct: 1,
                        fact: "צבי מופיע על מטבעות קנדיים רבים."
                    }
                ]
            },
            general: {
                expert: [
                    {
                        question: "מהו הספורט הלאומי של קנדה בחורף?",
                        answers: ["סקי", "החלקה על קרח", "הוקי קרח", "קרלינג"],
                        correct: 2,
                        fact: "הוקי קרח הוא הספורט הלאומי של קנדה בחורף."
                    }
                ],
                junior: [
                    {
                        question: "איזה חיה גדולה חיה ביערות קנדה?",
                        answers: ["פיל", "דוב", "אריה", "ג'ירף"],
                        correct: 1,
                        fact: "דובים חיים ביערות קנדה."
                    }
                ]
            },
            arts: {
                expert: [
                    {
                        question: "איזה צייר קנדי מפורסם בציוריו של נופי קנדה?",
                        answers: ["טום תומסון", "לורן האריס", "A.Y. ג'קסון", "כולם"],
                        correct: 3,
                        fact: "כל אלה היו חברים בקבוצת השבעה."
                    }
                ],
                junior: [
                    {
                        question: "איזה סוג מוסיקה מפורסם מקוויבק?",
                        answers: ["רוק", "עממית צרפתית", "קלאסית", "ג'אז"],
                        correct: 1,
                        fact: "מוסיקה עממית צרפתית היא מסורת חשובה בקוויבק."
                    }
                ]
            }
        };
        throw error;
    }
}

function initializeGame() {
    setupEventListeners();
    setupPlayerInputs();
}

function setupEventListeners() {
    document.getElementById('addPlayer').addEventListener('click', addPlayer);
    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('spinButton').addEventListener('click', spinWheel);
    document.getElementById('menuButton').addEventListener('click', showMenu);
    document.getElementById('newGameButton').addEventListener('click', newGame);
    document.getElementById('exitButton').addEventListener('click', exitGame);
    document.getElementById('nextButton').addEventListener('click', nextQuestion);
}

function setupPlayerInputs() {
    // מקמות להוספת שחקנים נוספים
    updateAddPlayerButton();
}

function addPlayer() {
    const playerInputs = document.getElementById('playerInputs');
    const playerCount = playerInputs.children.length + 1;
    
    if (playerCount > 6) {
        alert('מקסימום 6 שחקנים');
        return;
    }
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const usedColors = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
        .map(input => input.value);
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-input';
    playerDiv.innerHTML = `
        <label>שחקן ${playerCount}:</label>
        <input type="text" id="player${playerCount}Name" placeholder="שם השחקן">
        <select id="player${playerCount}Age">
            <option value="junior">ילד (שאלות קלות)</option>
            <option value="expert">מבוגר (שאלות קשות)</option>
        </select>
        <div class="color-picker">
            ${availableColors.map((color, index) => `
                <input type="radio" name="player${playerCount}Color" value="${color}" id="p${playerCount}${color}" ${index === 0 ? 'checked' : ''}>
                <label for="p${playerCount}${color}" class="color-option ${color}"></label>
            `).join('')}
        </div>
    `;
    
    playerInputs.appendChild(playerDiv);
    updateAddPlayerButton();
}

function updateAddPlayerButton() {
    const playerCount = document.getElementById('playerInputs').children.length;
    const addButton = document.getElementById('addPlayer');
    addButton.style.display = playerCount >= 6 ? 'none' : 'block';
}

function startGame() {
    if (!validatePlayers()) return;
    
    createPlayersFromInputs();
    initializeGameBoard();
    switchToGameScreen();
    startGameLoop();
}

function validatePlayers() {
    const playerInputs = document.querySelectorAll('.player-input');
    
    if (playerInputs.length < 2) {
        alert('נדרשים לפחות 2 שחקנים');
        return false;
    }
    
    for (let input of playerInputs) {
        const nameInput = input.querySelector('input[type="text"]');
        if (!nameInput.value.trim()) {
            alert('אנא מלא את שמות כל השחקנים');
            return false;
        }
    }
    
    return true;
}

function createPlayersFromInputs() {
    gameState.players = [];
    const playerInputs = document.querySelectorAll('.player-input');
    
    playerInputs.forEach((input, index) => {
        const name = input.querySelector('input[type="text"]').value.trim();
        const difficulty = input.querySelector('select').value;
        const color = input.querySelector('input[type="radio"]:checked').value;
        
        gameState.players.push({
            id: index + 1,
            name: name,
            difficulty: difficulty,
            color: color,
            position: 'ottawa', // כולם מתחילים באוטווה
            tokens: [],
            score: 0
        });
    });
}

function initializeGameBoard() {
    createPlayerPawns();
    updatePlayersInfo();
    updateCurrentPlayerDisplay();
}

function createPlayerPawns() {
    const playersContainer = document.getElementById('players');
    playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const pawn = document.createElement('div');
        pawn.className = `player-pawn ${player.color}`;
        pawn.id = `pawn-${player.id}`;
        
        // מיקום התחלתי באוטווה
        const startCity = gameState.cities.find(city => city.id === 'ottawa');
        pawn.style.left = `${startCity.x}%`;
        pawn.style.top = `${startCity.y + (index * 2)}%`; // הסטה קלה למניעת חפיפה
        
        playersContainer.appendChild(pawn);
    });
    
    updateCurrentPlayerHighlight();
}

function updatePlayersInfo() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerInfo = document.createElement('div');
        playerInfo.className = `player-info ${index === gameState.currentPlayerIndex ? 'current' : ''}`;
        playerInfo.innerHTML = `
            <div class="player-info-header">
                <div class="player-color-indicator ${player.color}"></div>
                <strong>${player.name}</strong>
            </div>
            <div class="player-tokens">טוקנים: ${player.tokens.length}/5</div>
        `;
        playersList.appendChild(playerInfo);
    });
}

function updateCurrentPlayerDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    
    // עדכון טוקנים של השחקן הנוכחי
    const tokensContainer = document.getElementById('currentPlayerTokens');
    tokensContainer.innerHTML = '';
    
    currentPlayer.tokens.forEach(token => {
        const tokenElement = document.createElement('span');
        tokenElement.className = 'token';
        tokenElement.textContent = token;
        tokensContainer.appendChild(tokenElement);
    });
}

function updateCurrentPlayerHighlight() {
    // הסרת הדגשה מכל השחקנים
    document.querySelectorAll('.player-pawn').forEach(pawn => {
        pawn.classList.remove('current');
    });
    
    // הוספת הדגשה לשחקן הנוכחי
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPawn = document.getElementById(`pawn-${currentPlayer.id}`);
    if (currentPawn) {
        currentPawn.classList.add('current');
    }
}

function switchToGameScreen() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    gameState.gameStarted = true;
}

function startGameLoop() {
    updateCurrentPlayerHighlight();
    enableSpinner();
}

function enableSpinner() {
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = false;
    spinButton.textContent = 'סובב!';
}

function spinWheel() {
    const spinner = document.getElementById('spinner');
    const spinButton = document.getElementById('spinButton');
    
    spinButton.disabled = true;
    spinButton.textContent = 'מסתובב...';
    
    // סיבוב אקראי
    const spins = Math.random() * 360 + 1440; // לפחות 4 סיבובים מלאים
    spinner.style.transform = `rotate(${spins}deg)`;
    
    setTimeout(() => {
        const result = Math.floor(Math.random() * 6);
        gameState.spinResult = spinnerCategories[result];
        handleSpinResult();
    }, 3000);
}

function handleSpinResult() {
    const result = gameState.spinResult;
    
    if (result.name === 'move') {
        // תזוזה ללא שאלה
        movePlayer(2);
        nextTurn();
    } else if (result.name === 'choice') {
        // בחירת קטגוריה
        showCategoryChoice();
    } else {
        // שאלה רגילה
        showQuestion(result.name);
    }
}

function showCategoryChoice() {
    const categories = ['geography', 'history', 'general', 'arts'];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // סינון קטגוריות לפי קושי
    const availableCategories = categories.filter(cat => {
        return questionBank[cat] && questionBank[cat][currentPlayer.difficulty];
    });
    
    const modal = document.getElementById('questionModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <h3>בחר קטגוריה</h3>
        <div id="categoryButtons">
            ${availableCategories.map(cat => {
                const categoryData = spinnerCategories.find(sc => sc.name === cat);
                return `<button class="answer-button" onclick="selectCategory('${cat}')">${categoryData.label}</button>`;
            }).join('')}
        </div>
    `;
    
    modal.style.display = 'flex';
}

function selectCategory(category) {
    document.getElementById('questionModal').style.display = 'none';
    showQuestion(category);
}

function showQuestion(category) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const questions = questionBank[category][currentPlayer.difficulty];
    
    if (!questions || questions.length === 0) {
        alert('אין שאלות זמינות בקטגוריה זו');
        nextTurn();
        return;
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const modal = document.getElementById('questionModal');
    const categoryElement = document.getElementById('questionCategory');
    const difficultyElement = document.getElementById('questionDifficulty');
    const questionElement = document.getElementById('questionText');
    const answersElement = document.getElementById('questionAnswers');
    const resultElement = document.getElementById('questionResult');
    const nextButton = document.getElementById('nextButton');
    
    // איפוס התצוגה
    resultElement.style.display = 'none';
    nextButton.style.display = 'none';
    
    // הצגת השאלה
    categoryElement.textContent = spinnerCategories.find(sc => sc.name === category).label;
    difficultyElement.textContent = currentPlayer.difficulty === 'expert' ? 'מתקדם' : 'מתחיל';
    questionElement.textContent = randomQuestion.question;
    
    // הצגת תשובות
    answersElement.innerHTML = '';
    randomQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index, randomQuestion);
        answersElement.appendChild(button);
    });
    
    modal.style.display = 'flex';
}

function selectAnswer(selectedIndex, question) {
    const answerButtons = document.querySelectorAll('.answer-button');
    const resultElement = document.getElementById('questionResult');
    const nextButton = document.getElementById('nextButton');
    
    // השבתת כל הכפתורים
    answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    // הצגת התוצאה
    const isCorrect = selectedIndex === question.correct;
    resultElement.className = isCorrect ? 'correct' : 'incorrect';
    resultElement.innerHTML = `
        <div>${isCorrect ? '✅ תשובה נכונה!' : '❌ תשובה לא נכונה'}</div>
        <div style="margin-top: 10px; font-size: 14px;">${question.fact}</div>
    `;
    resultElement.style.display = 'block';
    nextButton.style.display = 'block';
    
    // שמירת התוצאה למשחק
    gameState.lastQuestionResult = isCorrect;
}

function nextQuestion() {
    document.getElementById('questionModal').style.display = 'none';
    
    const isCorrect = gameState.lastQuestionResult;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (isCorrect) {
        currentPlayer.score += 10;
        movePlayer(2); // תזוזה של 2 מקומות
        
        // בדיקה אם השחקן נמצא בעיר שיכול לאסוף בה טוקן
        checkForTokenCollection();
    } else {
        movePlayer(1); // תזוזה של מקום אחד
    }
    
    updatePlayersInfo();
    updateCurrentPlayerDisplay();
    
    // בדיקת ניצחון
    if (currentPlayer.tokens.length >= 5) {
        showWinModal(currentPlayer);
        return;
    }
    
    nextTurn();
}

function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentCityIndex = gameState.cities.findIndex(city => city.id === currentPlayer.position);
    
    // תזוזה במעגל
    const newCityIndex = (currentCityIndex + steps) % gameState.cities.length;
    const newCity = gameState.cities[newCityIndex];
    
    currentPlayer.position = newCity.id;
    
    // עדכון מיקום השחקן על הלוח
    const pawn = document.getElementById(`pawn-${currentPlayer.id}`);
    pawn.style.left = `${newCity.x}%`;
    pawn.style.top = `${newCity.y}%`;
}

function checkForTokenCollection() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentCity = gameState.cities.find(city => city.id === currentPlayer.position);
    
    // בדיקה אם זה לא המקום ההתחלתי ואם השחקן עוד לא אסף את הטוקן
    if (!currentCity.isStart && !currentPlayer.tokens.includes(currentCity.province)) {
        currentPlayer.tokens.push(currentCity.province);
        
        // הודעה על איסוף טוקן
        setTimeout(() => {
            alert(`🎉 אספת טוקן: ${currentCity.province}!`);
        }, 500);
    }
}

function nextTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateCurrentPlayerDisplay();
    updateCurrentPlayerHighlight();
    updatePlayersInfo();
    enableSpinner();
}

function showWinModal(winner) {
    const modal = document.getElementById('winModal');
    const messageElement = document.getElementById('winMessage');
    
    messageElement.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 20px;">
            השחקן <strong>${winner.name}</strong> ניצח!
        </div>
        <div>אסף ${winner.tokens.length} טוקנים וקיבל ${winner.score} נקודות</div>
        <div style="margin-top: 15px;">הטוקנים שנאספו:</div>
        <div style="margin-top: 10px;">
            ${winner.tokens.map(token => `<span class="token">${token}</span>`).join(' ')}
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showMenu() {
    if (confirm('האם אתה בטוח שאתה רוצה לחזור לתפריט הראשי?')) {
        newGame();
    }
}

function newGame() {
    // איפוס המשחק
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        spinResult: null,
        cities: gameState.cities // שמירה על נתוני הערים
    };
    
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('winModal').style.display = 'none';
    document.getElementById('questionModal').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    
    // איפוס טפסי השחקנים
    const playerInputs = document.getElementById('playerInputs');
    while (playerInputs.children.length > 2) {
        playerInputs.removeChild(playerInputs.lastChild);
    }
    
    // איפוס שדות הקלט
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    
    updateAddPlayerButton();
}

function exitGame() {
    if (confirm('האם אתה בטוח שאתה רוצה לצאת?')) {
        window.close();
    }
}