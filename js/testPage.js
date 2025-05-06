let currentIndex = 0;
let selectedAnswers = [];
let testData = null;
let timerInterval = null;
let timeLeft = 0;

const navPanel = document.getElementById('question-nav');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const totalTime = document.getElementById('total-time');
const remainingTime = document.getElementById('remaining-time');

function loadTest() {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const testId = parseInt(new URLSearchParams(window.location.search).get("id"));

    testData = tests.find(t => t.id === testId);
    if (!testData) return alert("Không tìm thấy bài test");

    timeLeft = testData.playTime * 60; 
    totalTime.textContent = Math.floor(timeLeft / 60);
    remainingTime.textContent = timeLeft;
    selectedAnswers = Array(testData.questions.length).fill(null);

    document.getElementById("test-title").textContent = testData.testName;

    renderNavButtons();
    showQuestion(0);
    startTimer();
}

function renderNavButtons() {
    navPanel.innerHTML = '';
    testData.questions.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.onclick = () => showQuestion(i);
        navPanel.appendChild(btn);
    });
}

function showQuestion(index) {
    currentIndex = index;
    const question = testData.questions[index];

    questionNumber.textContent = `Câu hỏi ${index + 1} trên ${testData.questions.length}:`;
    questionText.textContent = question.content;

    answersContainer.innerHTML = '';
    question.answers.forEach((answer, i) => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="answer" value="${i}" ${selectedAnswers[index] == i ? 'checked' : ''}>
            ${answer.answer}
        `;
        answersContainer.appendChild(label);
    });
    
    

    answersContainer.querySelectorAll('input').forEach(input => {
        input.onchange = () => selectedAnswers[index] = parseInt(input.value);
    });
}


function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        remainingTime.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTest();
        }
    }, 1000);
}


document.getElementById('next-btn').onclick = () => {
    if (currentIndex < testData.questions.length - 1) showQuestion(currentIndex + 1);
};
document.getElementById('prev-btn').onclick = () => {
    if (currentIndex > 0) showQuestion(currentIndex - 1);
};
document.getElementById('finish-btn').onclick = finishTest;

function finishTest() {
    clearInterval(timerInterval);
    
    const correct = testData.questions.reduce((count, q, i) => {
        const correctIndex = q.answers.findIndex(ans => ans.isCorrect); 
        return count + (selectedAnswers[i] === correctIndex ? 1 : 0); 
    }, 0);

    const percent = Math.round(correct / testData.questions.length * 100);
    document.getElementById('result-text').textContent = `Bạn đúng ${correct}/${testData.questions.length} (${percent}%)`;
    document.getElementById('result-modal').style.display = 'flex';
}


function goHome() {
    window.location.href = "main.html";
}

window.onload = loadTest;
