if (!localStorage.getItem("tests")) {
    localStorage.setItem("tests", JSON.stringify([]));
}
if (localStorage.getItem("currentUser") === null) {
    window.location.href = "login.html";
}

const ITEMS_PER_PAGE = 4;
let currentPage = 1;

function renderQuizCards(categoryId = null, page = 1) {
    const allTests = JSON.parse(localStorage.getItem('tests')) || [];
    const allCategories = JSON.parse(localStorage.getItem('categories')) || [];

    const filteredTests = categoryId
        ? allTests.filter(test => Number(test.categoryId) === Number(categoryId))
        : allTests;

    const container = document.querySelector('#quiz-card-container');
    const pagination = document.querySelector('.pagination');

    const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
    currentPage = Math.min(Math.max(1, page), totalPages || 1);

    container.innerHTML = '';
    pagination.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredTests.slice(start, end);

    pageItems.forEach(quiz => {
        const category = allCategories.find(cat => Number(cat.id) === Number(quiz.categoryId));
        const categoryLabel = category ? `${category.emoji || ''} ${category.name}` : '❓ Danh mục';

        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCnpeh7SUzk9TSVDajFLFDra2w9vIfLlrqXQ&s" alt="quiz image">
            <div class="quiz-info">
                <p>${categoryLabel}</p>
                <h5>${quiz.testName}</h5>
                <p>${quiz.questions?.length || 0} câu hỏi - ${quiz.playAmount || 0} lượt chơi</p>
            </div>
            <button class="play-btn" data-id="${quiz.id}">Chơi</button>
        `;
        container.appendChild(card);
    });

    container.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const allTests = JSON.parse(localStorage.getItem('tests')) || [];

            const testIndex = allTests.findIndex(t => Number(t.id) === id);
            if (testIndex !== -1) {
                allTests[testIndex].playAmount = (allTests[testIndex].playAmount || 0) + 1;
                localStorage.setItem('tests', JSON.stringify(allTests));
            }

            window.location.href = `testPage.html?id=${id}`;
        });
    });

    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '‹';
        prevBtn.addEventListener('click', () => renderQuizCards(categoryId, currentPage - 1));
        pagination.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => renderQuizCards(categoryId, i));
        pagination.appendChild(btn);
    }

    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '›';
        nextBtn.addEventListener('click', () => renderQuizCards(categoryId, currentPage + 1));
        pagination.appendChild(nextBtn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderQuizCards();
});
