// Hebrew Trivia Tower Game - Enhanced Edition
// מגדל הטריוויה העברי - מהדורה מורחבת

// Game state for multiple players
let gameState = {
    isPlaying: false,
    isPaused: false,
    gameMode: 'single', // 'single', 'multiplayer', 'learning', 'stories'
    currentPlayer: 0,
    players: [
        { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
    ],
    currentCard: null,
    selectedDifficulty: null,
    deck: [],
    timer: null,
    timeLeft: 30,
    questionsAnswered: 0,
    gameStartTime: null,
    selectedAnswer: null,
    usedQuestions: new Set(),
    learningMode: {
        wrongAnswers: [],
        reviewMode: false
    },
    stories: [],
    dictionary: {},
    currentStory: null
};

// Expanded Canadian Trivia Questions Database
const QUESTIONS_DATABASE = {
    geography: {
        junior: [
            {
                question: "מהי בירת קנדה?",
                options: ["טורונטו", "מונטריאול", "אוטווה", "ונקובר"],
                correct: 2,
                explanation: "אוטווה היא בירת קנדה ונמצאת במחוז אונטריו, על הגבול עם קוויבק."
            },
            {
                question: "איך קוראים לפרובינציה הגדולה ביותר בקנדה?",
                options: ["אונטריו", "קוויבק", "בריטיש קולומביה", "אלברטה"],
                correct: 1,
                explanation: "קוויבק היא הפרובינציה הגדולה ביותר בקנדה בשטחה."
            },
            {
                question: "כמה פרובינציות יש בקנדה?",
                options: ["8", "9", "10", "12"],
                correct: 2,
                explanation: "בקנדה יש 10 פרובינציות ו-3 טריטוריות."
            },
            {
                question: "מהי העיר הגדולה ביותר בקנדה?",
                options: ["מונטריאול", "טורונטו", "ונקובר", "קלגרי"],
                correct: 1,
                explanation: "טורונטו היא העיר הגדולה ביותר בקנדה."
            },
            {
                question: "באיזה אוקיינוס נמצאת קנדה במזרח?",
                options: ["השקט", "האטלנטי", "הארקטי", "ההודי"],
                correct: 1,
                explanation: "החוף המזרחי של קנדה נמצא על האוקיינוס האטלנטי."
            }
        ],
        expert: [
            {
                question: "איזו עיר מכונה 'עיר הגיר' בקנדה?",
                options: ["קינגסטון", "קוויבק סיטי", "האליפקס", "ויניפג"],
                correct: 0,
                explanation: "קינגסטון באונטריו מכונה 'עיר הגיר' בגלל בניינים מאבן גיר."
            },
            {
                question: "מהו הפארק הלאומי הגדול ביותר בקנדה?",
                options: ["בנף", "ג'ספר", "נחוק", "אלגונקין"],
                correct: 2,
                explanation: "פארק נחוק בטריטוריות הצפון-מערביות הוא הגדול ביותר."
            }
        ]
    },
    history: {
        junior: [
            {
                question: "באיזו שנה נוסדה קנדה?",
                options: ["1864", "1867", "1871", "1885"],
                correct: 1,
                explanation: "קנדה נוסדה ב-1867 עם חוק צפון אמריקה הבריטית."
            },
            {
                question: "מי היה ראש הממשלה הראשון?",
                options: ["ג'ון מקדונלד", "ויילפריד לוריר", "רוברט בורדן", "מקנזי קינג"],
                correct: 0,
                explanation: "ג'ון א. מקדונלד היה ראש הממשלה הראשון."
            }
        ],
        expert: [
            {
                question: "מי היה המנהיג של מרידת המטיס?",
                options: ["גבריאל דומון", "לואי ריאל", "ביג בר", "פאונדמייקר"],
                correct: 1,
                explanation: "לואי ריאל הוביל את מרידת המטיס."
            }
        ]
    },
    culture: {
        junior: [
            {
                question: "מהו הספורט הלאומי החורפי?",
                options: ["סקי", "הוקי", "החלקה", "קרלינג"],
                correct: 1,
                explanation: "הוקי קרח הוא הספורט הלאומי החורפי."
            },
            {
                question: "מהו סמל העלה הקנדי?",
                options: ["אדר", "אלון", "ליבנה", "בוק"],
                correct: 0,
                explanation: "עלה האדר הוא הסמל הלאומי."
            }
        ],
        expert: [
            {
                question: "מי כתב 'אן מהבית הירוק'?",
                options: ["מרגרט אטווד", "ל.מ. מונטגומרי", "מרדכי ריכלר", "רוברטסון דייויס"],
                correct: 1,
                explanation: "לוסי מוד מונטגומרי כתבה את הספר המפורסם."
            }
        ]
    },
    science: {
        junior: [
            {
                question: "מהו המטבע הרשמי?",
                options: ["דולר אמריקאי", "דולר קנדי", "פאונד", "יורו"],
                correct: 1,
                explanation: "הדולר הקנדי הוא המטבע הרשמי."
            }
        ],
        expert: [
            {
                question: "מי המציא את הטלפון?",
                options: ["אדיסון", "אלכסנדר בל", "טסלה", "מרקוני"],
                correct: 1,
                explanation: "אלכסנדר גרהם בל המציא את הטלפון בקנדה."
            }
        ]
    },
    sport: {
        junior: [
            {
                question: "איך קוראים לגביע ההוקי המפורסם?",
                options: ["גביע קנדה", "גביע סטנלי", "גביע המפלים", "גביע האדר"],
                correct: 1,
                explanation: "גביע סטנלי הוא הגביע החשוב ביותר בהוקי."
            },
            {
                question: "מהו הספורט הלאומי הקיצי?",
                options: ["בייסבול", "כדורגל", "לקרוס", "טניס"],
                correct: 2,
                explanation: "לקרוס הוא הספורט הלאומי הקיצי."
            }
        ],
        expert: [
            {
                question: "איזה קבוצת הוקי זכתה הכי הרבה בגביע סטנלי?",
                options: ["טורונטו", "מונטריאול", "אדמונטון", "קלגרי"],
                correct: 1,
                explanation: "מונטריאול קנדיינס זכו 24 פעמים בגביע סטנלי."
            }
        ]
    },
    food: {
        junior: [
            {
                question: "מהו המשקה המפורסם של קנדה?",
                options: ["בירה", "יין", "סירופ אדר", "קפה"],
                correct: 2,
                explanation: "קנדה מייצרת 75% מסירופ האדר בעולם."
            },
            {
                question: "איך קוראים למנה הקנדית עם תפוחי אדמה וגבינה?",
                options: ["פוטין", "נאצ'וס", "המבורגר", "הוט דוג"],
                correct: 0,
                explanation: "פוטין הוא מנה קנדית מפוארה עם צ'יפס, גבינה ורוטב."
            }
        ],
        expert: [
            {
                question: "מאיזה אזור בקנדה מגיע המנה Tourtière?",
                options: ["אונטריו", "קוויבק", "מריטיים", "פריריות"],
                correct: 1,
                explanation: "Tourtière היא עוגת בשר מסורתית מקוויבק."
            }
        ]
    },
    nature: {
        junior: [
            {
                question: "איך קוראים לבעל החיים הלאומי?",
                options: ["דוב", "בובר", "אייל", "לון"],
                correct: 1,
                explanation: "הבובר הוא בעל החיים הלאומי של קנדה."
            },
            {
                question: "מהו העץ הלאומי של קנדה?",
                options: ["אורן", "אדר", "ליבנה", "אלון"],
                correct: 1,
                explanation: "האדר הוא העץ הלאומי וסמל קנדה."
            }
        ],
        expert: [
            {
                question: "איזה דוב הוא הגדול ביותר בקנדה?",
                options: ["דוב שחור", "דוב חום", "דוב קוטב", "דוב קריזלי"],
                correct: 2,
                explanation: "הדוב הקוטב הוא הגדול ביותר ונמצא בארקטיק הקנדי."
            }
        ]
    },
    celebrities: {
        junior: [
            {
                question: "איזה זמר קנדי שר 'My Heart Will Go On'?",
                options: ["אלניס מוריסט", "סלין דיון", "שניה טוויין", "ג'ונס מיצ'ל"],
                correct: 1,
                explanation: "סלין דיון שרה את השיר המפורסם מטיטאניק."
            },
            {
                question: "איזה שחקן קנדי משחק את וולברין?",
                options: ["ריאן ריינולדס", "היו ג'קמן", "מייקל ג'יי פוקס", "ג'ים קרי"],
                correct: 1,
                explanation: "היו ג'קמן (אוסטרלי במקור) - למעשה ריאן ריינולדס הוא הקנדי."
            }
        ],
        expert: [
            {
                question: "איזה במאי קנדי ביים את 'אווטאר'?",
                options: ["דיויד קרוננברג", "ג'יימס קמרון", "דניס ארקנד", "אטום אגויאן"],
                correct: 1,
                explanation: "ג'יימס קמרון הקנדי ביים את אווטאר."
            }
        ]
    },
    indigenous: {
        junior: [
            {
                question: "איך קוראים לבתים מסורתיים של אינואיטים?",
                options: ["טיפי", "איגלו", "לונגהאוס", "וויגווהם"],
                correct: 1,
                explanation: "איגלו הוא בית קרח מסורתי של עמי האינואיטים."
            },
            {
                question: "איזה ספורט המציאו עמים ילידיים?",
                options: ["הוקי", "לקרוס", "קרלינג", "רוגבי"],
                correct: 1,
                explanation: "לקרוס המציאו עמים ילידיים בצפון אמריקה."
            }
        ],
        expert: [
            {
                question: "איך קוראים למערכת הכתיבה של האינואיטים?",
                options: ["אינוקטיטוט", "סילביקס", "לטינית", "ציריליקה"],
                correct: 0,
                explanation: "אינוקטיטוט היא מערכת כתיבה ייחודית לשפת האינואיטים."
            }
        ]
    }
};

// Canadian Stories Database
const STORIES_DATABASE = [
    {
        id: 'confederation',
        title: 'הקונפדרציה הקנדית',
        content: 'ב-1867, ארבע קולוניות בריטיות התאחדו ליצור את קנדה. זה היה רגע היסטורי שיצר את המדינה שאנחנו מכירים היום.',
        category: 'history',
        difficulty: 'junior'
    },
    {
        id: 'maple_syrup',
        title: 'סירופ האדר הקנדי',
        content: 'עמים ילידיים גילו לראשונה כיצד להפיק סירופ מעצי האדר. הם חתכו את העץ ואספו את המיץ המתוק בתקופת האביב.',
        category: 'food',
        difficulty: 'junior'
    },
    {
        id: 'residential_schools',
        title: 'בתי הספר הפנימיים',
        content: 'זהו פרק כואב בהיסטוריה הקנדית. בתי ספר פנימיים הוקמו כדי לחנך ילדים ילידיים, אך גרמו לנזק תרבותי עמוק.',
        category: 'indigenous',
        difficulty: 'expert'
    }
];

// Dictionary of Canadian Terms
const DICTIONARY = {
    'poutine': 'מנה קנדית המורכבת מצ׳יפס, גבינה וירקות חמים',
    'toonie': 'מטבע של 2 דולר קנדי',
    'loonie': 'מטבע של דולר קנדי אחד (עם ציור של לון)',
    'mountie': 'שוטר במשטרה המלכותית הקנדית',
    'toque': 'כובע צמר קנדי לחורף',
    'double-double': 'קפה עם 2 סוכר ו-2 חלב (טים הורטונס)',
    'eh': 'מילת שאלה קנדית אופיינית',
    'hoser': 'כינוי לקנדי (לא בהכרח מחמיא)',
    'chinook': 'רוח חמה בחורף באלברטה',
    'inukshuk': 'ציון דרך אבן מסורתי של האינואיטים'
};

// Game initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    resetGameState();
    updateUI();
    loadSavedGame();
    setupEventListeners();
    console.log('Hebrew Trivia Tower Enhanced Edition initialized!');
}

function resetGameState() {
    gameState = {
        isPlaying: false,
        isPaused: false,
        gameMode: 'single',
        currentPlayer: 0,
        players: [
            { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
        ],
        currentCard: null,
        selectedDifficulty: null,
        deck: [],
        timer: null,
        timeLeft: 30,
        questionsAnswered: 0,
        gameStartTime: null,
        selectedAnswer: null,
        usedQuestions: new Set(),
        learningMode: {
            wrongAnswers: [],
            reviewMode: false
        },
        stories: [...STORIES_DATABASE],
        dictionary: {...DICTIONARY},
        currentStory: null
    };
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (gameState.isPlaying && gameState.selectedDifficulty && gameState.selectedAnswer === null) {
            if (e.key >= '1' && e.key <= '4') {
                selectAnswer(parseInt(e.key) - 1);
                e.preventDefault();
            }
        }
    });
}

function setGameMode(mode) {
    gameState.gameMode = mode;
    
    switch(mode) {
        case 'single':
            setupSinglePlayer();
            break;
        case 'multiplayer':
            setupMultiplayer();
            break;
        case 'learning':
            setupLearningMode();
            break;
        case 'stories':
            showStories();
            break;
        case 'dictionary':
            showDictionary();
            break;
    }
    
    updateUI();
}

function setupSinglePlayer() {
    gameState.players = [
        { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
    ];
    gameState.currentPlayer = 0;
}

function setupMultiplayer() {
    const numPlayers = parseInt(prompt('כמה שחקנים? (2-4)', '2'));
    if (numPlayers < 2 || numPlayers > 4) return;
    
    gameState.players = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = prompt(`שם שחקן ${i + 1}:`, `שחקן ${i + 1}`);
        gameState.players.push({
            name: name || `שחקן ${i + 1}`,
            score: 0,
            tower: [],
            categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 }
        });
    }
    gameState.currentPlayer = 0;
}

function setupLearningMode() {
    gameState.learningMode.reviewMode = true;
    if (gameState.learningMode.wrongAnswers.length === 0) {
        alert('אין שאלות לחזרה. שחק תחילה במצב רגיל כדי לאסוף שאלות לחזרה.');
        setGameMode('single');
        return;
    }
    gameState.deck = [...gameState.learningMode.wrongAnswers];
}

function startGame() {
    if (gameState.gameMode === 'stories') {
        showStories();
        return;
    }
    
    if (gameState.gameMode === 'dictionary') {
        showDictionary();
        return;
    }
    
    gameState.isPlaying = true;
    gameState.gameStartTime = Date.now();
    
    if (gameState.gameMode !== 'learning') {
        createBalancedDeck();
        shuffleDeck();
    }
    
    drawCard();
    updateUI();
    updateButtonStates();
    saveGame();
}

function createBalancedDeck() {
    gameState.deck = [];
    gameState.usedQuestions.clear();
    
    const categories = Object.keys(QUESTIONS_DATABASE);
    const difficulties = ['junior', 'expert'];
    
    categories.forEach(category => {
        difficulties.forEach(difficulty => {
            const questions = QUESTIONS_DATABASE[category][difficulty];
            
            questions.forEach((questionData, index) => {
                const questionId = `${category}_${difficulty}_${index}`;
                
                if (gameState.usedQuestions.has(questionId)) return;
                
                if (!questionData.question || !questionData.options || 
                    !Array.isArray(questionData.options) || 
                    questionData.options.length !== 4 || 
                    typeof questionData.correct !== 'number' ||
                    questionData.correct < 0 || questionData.correct > 3) {
                    return;
                }
                
                gameState.deck.push({
                    id: questionId,
                    category: category,
                    difficulty: difficulty,
                    question: questionData.question,
                    options: [...questionData.options],
                    correct: questionData.correct,
                    explanation: questionData.explanation || 'אין הסבר זמין'
                });
                
                gameState.usedQuestions.add(questionId);
            });
        });
    });
    
    console.log(`Created deck with ${gameState.deck.length} cards`);
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function drawCard() {
    if (gameState.deck.length === 0) {
        endGame('gameWon', 'כל הכבוד! סיימת את כל השאלות!');
        return;
    }
    
    gameState.currentCard = gameState.deck.pop();
    gameState.selectedAnswer = null;
    
    if (!gameState.currentCard || !gameState.currentCard.question || !gameState.currentCard.options) {
        if (gameState.deck.length > 0) {
            drawCard();
            return;
        } else {
            endGame('error', 'שגיאה בטעינת השאלות!');
            return;
        }
    }
    
    displayCurrentCard();
    showDifficultySelection();
}

function displayCurrentCard() {
    const categoryNames = {
        geography: '🌍 גיאוגרפיה',
        history: '📚 היסטוריה', 
        culture: '🎨 תרבות',
        science: '🔬 מדע',
        sport: '⚽ ספורט',
        food: '🍁 אוכל',
        nature: '🌲 טבע',
        celebrities: '⭐ מפורסמים',
        indigenous: '🪶 עמים ילידיים'
    };
    
    document.getElementById('card-category').textContent = categoryNames[gameState.currentCard.category];
    document.getElementById('card-question').textContent = 'בחר רמת קושי כדי לראות את השאלה';
}

function selectDifficulty(difficulty) {
    gameState.selectedDifficulty = difficulty;
    gameState.selectedAnswer = null;
    
    document.getElementById('difficulty-selector').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    
    const difficultyText = difficulty === 'junior' ? 'רמה קלה' : 'רמה קשה';
    document.getElementById('question-title').textContent = difficultyText;
    document.getElementById('question-text').textContent = gameState.currentCard.question;
    
    displayAnswerOptions();
    startTimer();
}

function displayAnswerOptions() {
    const options = gameState.currentCard.options;
    
    for (let i = 0; i < 4; i++) {
        const optionBtn = document.getElementById(`option-${i}`);
        if (optionBtn && options[i]) {
            optionBtn.textContent = options[i];
            optionBtn.className = 'option-btn';
            optionBtn.disabled = false;
        }
    }
}

function selectAnswer(answerIndex) {
    if (!gameState.isPlaying || gameState.selectedAnswer !== null || !gameState.currentCard) return;
    
    gameState.selectedAnswer = answerIndex;
    
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        if (index === answerIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    setTimeout(() => {
        submitAnswer();
    }, 800);
}

function startTimer() {
    gameState.timeLeft = 30;
    updateTimer();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            gameState.timer = null;
            gameState.selectedAnswer = null; 
            submitAnswer();
        }
    }, 1000);
}

function updateTimer() {
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');
    
    timerText.textContent = gameState.timeLeft;
    
    const percentage = (gameState.timeLeft / 30) * 100;
    timerFill.style.width = percentage + '%';
}

function submitAnswer() {
    if (!gameState.isPlaying || !gameState.currentCard) return;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    const userAnswerIndex = gameState.selectedAnswer;
    const correctAnswerIndex = gameState.currentCard.correct;
    const isCorrect = userAnswerIndex !== null && userAnswerIndex === correctAnswerIndex;
    
    gameState.questionsAnswered++;
    
    showAnswerFeedback(userAnswerIndex, correctAnswerIndex, isCorrect);
    
    let correctAnswerText = gameState.currentCard.options[correctAnswerIndex] || 'לא זמין';
    
    setTimeout(() => {
        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
            // Add to learning mode for review
            if (gameState.gameMode !== 'learning') {
                gameState.learningMode.wrongAnswers.push(gameState.currentCard);
            }
        }
        
        showFeedback(isCorrect, correctAnswerText);
        updateUI();
        saveGame();
    }, 1500);
}

function showAnswerFeedback(userAnswerIndex, correctAnswerIndex, isCorrect) {
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        btn.classList.remove('selected');
        
        if (index === correctAnswerIndex) {
            btn.classList.add('correct');
        } else if (userAnswerIndex !== null && index === userAnswerIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
}

function handleCorrectAnswer() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    const card = {
        category: gameState.currentCard.category,
        difficulty: gameState.selectedDifficulty,
        question: gameState.currentCard.question.substring(0, 50) + '...'
    };
    
    // Build tower from bottom to top
    currentPlayer.tower.unshift(card);
    currentPlayer.categoryCount[gameState.currentCard.category]++;
    
    const points = gameState.selectedDifficulty === 'expert' ? 10 : 5;
    currentPlayer.score += points;
    
    addCardToTowerDisplay(card);
    
    if (currentPlayer.tower.length >= 10) {
        if (checkWinConditions()) {
            endGame('victory', `${currentPlayer.name} ניצח! בנה מגדל של 10 כרטיסים!`);
            return;
        }
    }
    
    // Switch to next player in multiplayer
    if (gameState.gameMode === 'multiplayer') {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    }
}

function handleWrongAnswer() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    const cardsToRemove = gameState.selectedDifficulty === 'expert' ? 2 : 1;
    
    for (let i = 0; i < cardsToRemove && currentPlayer.tower.length > 0; i++) {
        const removedCard = currentPlayer.tower.shift(); // Remove from bottom
        if (removedCard && removedCard.category) {
            currentPlayer.categoryCount[removedCard.category]--;
        }
        removeCardFromTowerDisplay();
    }
    
    if (currentPlayer.tower.length === 0 && gameState.questionsAnswered > 3) {
        endGame('defeat', `מגדל של ${currentPlayer.name} קרס!`);
        return;
    }
    
    // Switch to next player in multiplayer
    if (gameState.gameMode === 'multiplayer') {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    }
}

function addCardToTowerDisplay(card) {
    const towerCards = document.getElementById('tower-cards');
    const cardElement = document.createElement('div');
    
    cardElement.className = `tower-card ${card.category}`;
    cardElement.innerHTML = `
        <div class="card-content">
            <span class="card-category-icon">${getCategoryIcon(card.category)}</span>
            <span class="card-question-text">${card.question}</span>
            <span class="card-difficulty-badge">${card.difficulty === 'expert' ? 'קשה' : 'קל'}</span>
        </div>
    `;
    
    // Add at the bottom (visually at the top due to flex-direction: column-reverse)
    towerCards.insertBefore(cardElement, towerCards.firstChild);
}

function removeCardFromTowerDisplay() {
    const towerCards = document.getElementById('tower-cards');
    const firstCard = towerCards.firstElementChild;
    
    if (firstCard) {
        firstCard.classList.add('fall');
        setTimeout(() => {
            if (firstCard.parentNode) {
                firstCard.parentNode.removeChild(firstCard);
            }
        }, 800);
    }
}

function getCategoryIcon(category) {
    const icons = {
        geography: '🌍',
        history: '📚',
        culture: '🎨',
        science: '🔬',
        sport: '⚽',
        food: '🍁',
        nature: '🌲',
        celebrities: '⭐',
        indigenous: '🪶'
    };
    return icons[category] || '❓';
}

function checkWinConditions() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    return currentPlayer.tower.length >= 10;
}

function showFeedback(isCorrect, correctAnswer) {
    const title = isCorrect ? '✅ תשובה נכונה!' : '❌ תשובה שגויה';
    const message = isCorrect ? 
        'כל הכבוד! הכרטיס נוסף למגדל.' : 
        `התשובה הנכונה היא: ${correctAnswer}`;
    
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-text').textContent = message;
    
    const explanation = gameState.currentCard?.explanation || 'אין הסבר זמין';
    document.getElementById('feedback-explanation').textContent = explanation;
    
    const modal = document.getElementById('feedback-modal');
    modal.style.display = 'block';
}

function closeFeedback() {
    document.getElementById('feedback-modal').style.display = 'none';
    
    if (gameState.isPlaying) {
        drawCard();
    }
}

function showStories() {
    const storiesModal = document.getElementById('stories-modal');
    const storiesList = document.getElementById('stories-list');
    
    storiesList.innerHTML = '';
    
    gameState.stories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.className = 'story-item';
        storyElement.innerHTML = `
            <h3>${story.title}</h3>
            <p class="story-category">${getCategoryName(story.category)} - ${story.difficulty === 'expert' ? 'מתקדם' : 'בסיסי'}</p>
            <button onclick="readStory('${story.id}')">קרא את הסיפור</button>
        `;
        storiesList.appendChild(storyElement);
    });
    
    storiesModal.style.display = 'block';
}

function readStory(storyId) {
    const story = gameState.stories.find(s => s.id === storyId);
    if (!story) return;
    
    gameState.currentStory = story;
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-content').textContent = story.content;
    document.getElementById('story-reader-modal').style.display = 'block';
}

function showDictionary() {
    const dictionaryModal = document.getElementById('dictionary-modal');
    const dictionaryList = document.getElementById('dictionary-list');
    
    dictionaryList.innerHTML = '';
    
    Object.entries(gameState.dictionary).forEach(([term, definition]) => {
        const termElement = document.createElement('div');
        termElement.className = 'dictionary-item';
        termElement.innerHTML = `
            <h3>${term}</h3>
            <p>${definition}</p>
        `;
        dictionaryList.appendChild(termElement);
    });
    
    dictionaryModal.style.display = 'block';
}

function getCategoryName(category) {
    const names = {
        geography: 'גיאוגרפיה',
        history: 'היסטוריה',
        culture: 'תרבות',
        science: 'מדע',
        sport: 'ספורט',
        food: 'אוכל',
        nature: 'טבע',
        celebrities: 'מפורסמים',
        indigenous: 'עמים ילידיים'
    };
    return names[category] || category;
}

function endGame(result, message) {
    gameState.isPlaying = false;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    document.getElementById('game-over-title').textContent = result === 'victory' ? '🏆 ניצחון!' : '😞 המשחק הסתיים';
    document.getElementById('game-over-content').innerHTML = `<p>${message}</p>`;
    document.getElementById('game-over-modal').style.display = 'block';
    
    updateButtonStates();
}

function updateUI() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    document.getElementById('current-player').textContent = currentPlayer.name;
    document.getElementById('tower-height').textContent = currentPlayer.tower.length;
    document.getElementById('current-score').textContent = currentPlayer.score;
    document.getElementById('cards-remaining').textContent = gameState.deck.length;
    
    updateCategoryProgress();
    updatePlayersDisplay();
}

function updateCategoryProgress() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const categories = Object.keys(currentPlayer.categoryCount);
    
    categories.forEach(category => {
        const count = currentPlayer.categoryCount[category];
        const countElement = document.getElementById(`${category}-count`);
        const progressElement = document.getElementById(`${category}-progress`);
        
        if (countElement) countElement.textContent = count;
        if (progressElement) {
            const percentage = Math.min((count / 3) * 100, 100);
            progressElement.style.width = percentage + '%';
        }
    });
}

function updatePlayersDisplay() {
    const playersContainer = document.getElementById('players-container');
    if (!playersContainer) return;
    
    playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.className = `player-info ${index === gameState.currentPlayer ? 'active' : ''}`;
        playerElement.innerHTML = `
            <h4>${player.name}</h4>
            <p>ניקוד: ${player.score}</p>
            <p>מגדל: ${player.tower.length}</p>
        `;
        playersContainer.appendChild(playerElement);
    });
}

function updateButtonStates() {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (gameState.isPlaying) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveGame() {
    try {
        localStorage.setItem('hebrewTriviaGameState', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Could not save game state:', e);
    }
}

function loadSavedGame() {
    try {
        const saved = localStorage.getItem('hebrewTriviaGameState');
        if (saved) {
            const savedState = JSON.parse(saved);
            if (savedState.isPlaying && confirm('נמצא משחק שמור. האם ברצונך להמשיך?')) {
                gameState = { ...gameState, ...savedState };
                gameState.timer = null;
                updateUI();
            }
        }
    } catch (e) {
        console.warn('Could not load saved game:', e);
    }
}

function showDifficultySelection() {
    document.getElementById('difficulty-selector').style.display = 'block';
    document.getElementById('question-section').style.display = 'none';
}

function resetGame() {
    if (confirm('האם אתה בטוח שברצונך להתחיל משחק חדש?')) {
        resetGameState();
        updateUI();
        updateButtonStates();
        
        document.getElementById('tower-cards').innerHTML = '';
        localStorage.removeItem('hebrewTriviaGameState');
    }
}

console.log('Hebrew Trivia Tower Enhanced Edition loaded successfully!');