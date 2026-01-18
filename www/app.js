// ===== State Management =====
const appState = {
    questions: [],
    currentIndex: 0,
    isAnswerVisible: false,
    fileName: ''
};

const elements = {};

const STORAGE_KEY = 'flashcard_app_state';

// ===== State Persistence =====

function saveState() {
    try {
        const stateToSave = {
            questions: appState.questions,
            currentIndex: appState.currentIndex,
            fileName: appState.fileName
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

function loadState() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Failed to load state:', error);
    }
    return null;
}

function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear state:', error);
    }
}

// ===== File Parsing Functions =====

function parseXML(xmlString) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        const items = xmlDoc.querySelectorAll('item');
        const questions = [];

        items.forEach(item => {
            const questionEl = item.querySelector('question');
            const answerEl = item.querySelector('answer');

            if (questionEl && answerEl) {
                const question = questionEl.textContent.trim();
                const answer = answerEl.textContent.trim();

                if (question && answer) {
                    questions.push({ question, answer });
                }
            }
        });

        return questions;
    } catch (error) {
        throw new Error('Failed to parse XML: ' + error.message);
    }
}

function parseTXT(txtString) {
    try {
        // Normalize line endings (handle both \r\n and \n)
        const normalized = txtString.replace(/\r\n/g, '\n');
        const blocks = normalized.split('\n\n').filter(block => block.trim());
        const questions = [];

        blocks.forEach(block => {
            const lines = block.split('\n').map(line => line.trim());
            let question = '';
            let answer = '';

            lines.forEach(line => {
                if (line.startsWith('Q:')) {
                    question = line.substring(2).trim();
                } else if (line.startsWith('A:')) {
                    answer = line.substring(2).trim();
                }
            });

            if (question && answer) {
                questions.push({ question, answer });
            }
        });

        return questions;
    } catch (error) {
        throw new Error('Failed to parse TXT: ' + error.message);
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let questions = [];

            // Determine file type and parse accordingly
            if (file.name.endsWith('.xml')) {
                questions = parseXML(content);
            } else if (file.name.endsWith('.txt')) {
                questions = parseTXT(content);
            } else {
                throw new Error('Unsupported file format. Please use .xml or .txt files.');
            }

            if (questions.length === 0) {
                throw new Error('No valid questions found in the file.');
            }

            // Update state
            appState.questions = questions;
            appState.currentIndex = 0;
            appState.isAnswerVisible = false;
            appState.fileName = file.name;

            // Show quiz screen and render first card
            showQuizScreen();
            renderCurrentCard();

            // Save state to localStorage
            saveState();

        } catch (error) {
            alert('Error loading file: ' + error.message);
        }
    };

    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// ===== Card Rendering =====

function renderCurrentCard() {
    const current = appState.questions[appState.currentIndex];

    elements.questionText.textContent = current.question;
    elements.answerText.textContent = current.answer;
    elements.progressText.textContent = `Question ${appState.currentIndex + 1} of ${appState.questions.length}`;

    // Reset to question side
    hideAnswer();
}

function handleCardClick(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const cardWidth = rect.width;

    // Left-most 50px: go to previous question
    if (clickX < 50) {
        previousQuestion();
    }
    // Right-most 50px: go to next question
    else if (clickX > cardWidth - 50) {
        nextQuestion();
    }
    // Center area: toggle answer
    else {
        toggleAnswer();
    }
}

function toggleAnswer() {
    if (appState.isAnswerVisible) {
        hideAnswer();
    } else {
        showAnswer();
    }
}

function showAnswer() {
    appState.isAnswerVisible = true;
    elements.questionSide.classList.add('hidden');
    elements.answerSide.classList.remove('hidden');
}

function hideAnswer() {
    appState.isAnswerVisible = false;
    elements.questionSide.classList.remove('hidden');
    elements.answerSide.classList.add('hidden');
}

// ===== Navigation =====

function nextQuestion() {
    if (appState.currentIndex < appState.questions.length - 1) {
        appState.currentIndex++;
        renderCurrentCard();
        saveState();
        return true;
    }
    return false;
}

function previousQuestion() {
    if (appState.currentIndex > 0) {
        appState.currentIndex--;
        renderCurrentCard();
        saveState();
        return true;
    }
    return false;
}

function shuffleQuestions() {
    // Fisher-Yates shuffle
    const array = appState.questions;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    appState.currentIndex = 0;
    renderCurrentCard();
    saveState();
}

// ===== Touch Gestures =====

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

const SWIPE_THRESHOLD = 50;
const VERTICAL_THRESHOLD = 30;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Ignore vertical scrolls
    if (deltaY > VERTICAL_THRESHOLD) return;

    // Swipe left: next question
    if (deltaX < -SWIPE_THRESHOLD) {
        if (nextQuestion()) {
            elements.flashcard.classList.add('swipe-left');
            setTimeout(() => {
                elements.flashcard.classList.remove('swipe-left');
            }, 300);
        }
    }

    // Swipe right: previous question
    if (deltaX > SWIPE_THRESHOLD) {
        if (previousQuestion()) {
            elements.flashcard.classList.add('swipe-right');
            setTimeout(() => {
                elements.flashcard.classList.remove('swipe-right');
            }, 300);
        }
    }
}

// ===== Screen Management =====

function showWelcomeScreen() {
    elements.welcomeScreen.classList.remove('hidden');
    elements.quizScreen.classList.add('hidden');
}

function showQuizScreen() {
    elements.welcomeScreen.classList.add('hidden');
    elements.quizScreen.classList.remove('hidden');
}

function triggerFileInput() {
    elements.fileInput.click();
}

// ===== Initialization =====

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    elements.welcomeScreen = document.getElementById('welcomeScreen');
    elements.quizScreen = document.getElementById('quizScreen');
    elements.selectFileBtn = document.getElementById('selectFileBtn');
    elements.loadFileBtn = document.getElementById('loadFileBtn');
    elements.shuffleBtn = document.getElementById('shuffleBtn');
    elements.fileInput = document.getElementById('fileInput');
    elements.flashcard = document.getElementById('flashcard');
    elements.questionText = document.getElementById('questionText');
    elements.answerText = document.getElementById('answerText');
    elements.progressText = document.getElementById('progressText');
    elements.questionSide = document.querySelector('.question-side');
    elements.answerSide = document.querySelector('.answer-side');

    // Attach event listeners
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.selectFileBtn.addEventListener('click', triggerFileInput);
    elements.loadFileBtn.addEventListener('click', () => {
        showWelcomeScreen();
        triggerFileInput();
    });
    elements.shuffleBtn.addEventListener('click', shuffleQuestions);
    elements.flashcard.addEventListener('click', handleCardClick);
    elements.flashcard.addEventListener('touchstart', handleTouchStart);
    elements.flashcard.addEventListener('touchend', handleTouchEnd);

    // Try to load saved state
    const savedState = loadState();
    if (savedState && savedState.questions && savedState.questions.length > 0) {
        // Restore saved state
        appState.questions = savedState.questions;
        appState.currentIndex = savedState.currentIndex || 0;
        appState.fileName = savedState.fileName || '';
        appState.isAnswerVisible = false;

        // Show quiz screen with saved data
        showQuizScreen();
        renderCurrentCard();
    } else {
        // Show welcome screen if no saved state
        showWelcomeScreen();
    }
});
