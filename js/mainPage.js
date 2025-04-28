if (!localStorage.getItem("tests")) {
    localStorage.setItem("tests", JSON.stringify([]));
}


function renderQuizCards() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    const container = document.querySelector('#quiz-card-container');
    container.innerHTML = '';
    for (let i = 0; i < tests.length; i++) {
        const quiz = tests[i];
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCnpeh7SUzk9TSVDajFLFDra2w9vIfLlrqXQ&s" alt="quiz image">
            <div class="quiz-info">
                <p>${quiz.category || '❓ Danh mục'}</p>
                <h5>${quiz.name}</h5>
                <p>${quiz.questions} câu hỏi - ${quiz.testPlayCount || 0} lượt chơi</p>
            </div>
            <button class="play-btn">Chơi</button>
        `;
        container.appendChild(card);
    }
}

document.addEventListener('DOMContentLoaded', renderQuizCards);
renderQuizCards();