let questions = [];
let currentEditId = null;
let currentDeleteIndex = null;

window.addEventListener('DOMContentLoaded', () => {
    initCategorySelect();
    initEventListeners();
    loadEditTest();
    renderQuestions();
});

function initEventListeners() {
    document.getElementById('addAnswerBtn').addEventListener('click', addAnswerRow);
    document.getElementById('answersContainer').addEventListener('click', handleAnswerDelete);
    document.getElementById('deleteBtn').addEventListener('click', confirmDeleteQuestion);
    document.getElementById('closeDeleteBtn').addEventListener('click', closeDeleteModal);
}

function initCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.emoji} ${category.name}`;
        categorySelect.appendChild(option);
    });
}

function renderQuestions() {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    questions.forEach((q, index) => {
        tbody.innerHTML += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${q.content}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-2" onclick="editQuestion(${index})">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion(${index})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function addAnswerRow() {
    const container = document.getElementById('answersContainer');
    container.insertAdjacentHTML('beforeend', `
        <div class="input-group mb-2 answer-row">
            <div class="input-group-text">
                <input class="form-check-input mt-0" type="checkbox">
            </div>
            <input type="text" class="form-control" placeholder="Nhập câu trả lời">
            <button class="btn btn-link text-danger btn-sm delete-answer" type="button">🗑️</button>
        </div>
    `);
}

function handleAnswerDelete(e) {
    if (e.target.closest('.delete-answer')) {
        e.target.closest('.answer-row').remove();
    }
}

function deleteQuestion(index) {
    currentDeleteIndex = index;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

function confirmDeleteQuestion() {
    if (currentDeleteIndex !== null) {
        questions.splice(currentDeleteIndex, 1);
        renderQuestions();
        currentDeleteIndex = null;
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
}

function closeDeleteModal() {
    currentDeleteIndex = null;
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
}

function editQuestion(index) {
    currentEditId = index;
    const question = questions[index];

    document.getElementById('questionInput').value = question.content;

    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    question.answers.forEach(ans => {
        answersContainer.insertAdjacentHTML('beforeend', `
            <div class="input-group mb-2 answer-row">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" ${ans.isCorrect ? 'checked' : ''}>
                </div>
                <input type="text" class="form-control" value="${ans.answer}">
                <button class="btn btn-link text-danger btn-sm delete-answer" type="button">🗑️</button>
            </div>
        `);
    });

    document.getElementById('errorDiv').textContent = "";
    new bootstrap.Modal(document.getElementById('modal')).show();
}

function saveQuestion() {
    if (!validateQuestion()) return;

    const questionText = document.getElementById('questionInput').value.trim();
    const answerRows = document.querySelectorAll('.answer-row');
    const answers = Array.from(answerRows).map(row => ({
        answer: row.querySelector('input[type="text"]').value.trim(),
        isCorrect: row.querySelector('input[type="checkbox"]').checked
    })).filter(ans => ans.answer);

    const questionData = { content: questionText, answers };

    if (currentEditId !== null) {
        questions[currentEditId] = questionData;
        currentEditId = null;
    } else {
        questionData.id = questions.length + 1;
        questions.push(questionData);
    }

    renderQuestions();
    clearQuestionModal();
    bootstrap.Modal.getInstance(document.getElementById('modal')).hide();
}

function validateQuestion() {
    const errorDiv = document.getElementById('errorDiv');
    const questionText = document.getElementById('questionInput').value.trim();
    const answerRows = document.querySelectorAll('.answer-row');

    const answers = Array.from(answerRows).map(row => ({
        answer: row.querySelector('input[type="text"]').value.trim(),
        isCorrect: row.querySelector('input[type="checkbox"]').checked
    })).filter(ans => ans.answer);

    const hasCorrect = answers.some(ans => ans.isCorrect);

    if (!questionText || answers.length < 2 || !hasCorrect) {
        errorDiv.textContent = "Câu hỏi không hợp lệ";
        return false;
    }

    errorDiv.textContent = "";
    return true;
}

function clearQuestionModal() {
    document.getElementById('questionInput').value = '';
    document.getElementById('answersContainer').innerHTML = '';
}

function validateTest() {
    const testName = document.getElementById("testName").value.trim();
    const categoryId = document.getElementById("categorySelect").value;
    const playTime = parseInt(document.getElementById("testTime").value);
    const existingTests = JSON.parse(localStorage.getItem("tests")) || [];
    const errorDiv = document.getElementById("testError");

    errorDiv.textContent = "";

    if (!testName || testName.length < 3) {
        errorDiv.textContent = "Tên bài test không được để trống và phải dài tối thiểu 3 ký tự.";
        return false;
    }

    const isDuplicate = existingTests.some(t => t.testName.toLowerCase() === testName.toLowerCase());
    if (isDuplicate) {
        errorDiv.textContent = "Tên bài test đã tồn tại. Vui lòng chọn tên khác.";
        return false;
    }

    if (!categoryId) {
        errorDiv.textContent = "Vui lòng chọn danh mục.";
        return false;
    }

    if (!playTime || isNaN(playTime) || playTime <= 0) {
        errorDiv.textContent = "Thời gian phải là số nguyên dương.";
        return false;
    }

    if (questions.length < 1) {
        errorDiv.textContent = "Bài test phải có ít nhất một câu hỏi.";
        return false;
    }

    return true;
}

function saveTest() {
    if (!validateTest()) return;

    const testName = document.getElementById("testName").value.trim();
    const categoryId = parseInt(document.getElementById("categorySelect").value);
    const playTime = parseInt(document.getElementById("testTime").value);
    const existingTests = JSON.parse(localStorage.getItem("tests")) || [];

    const editId = localStorage.getItem("editTestId");
    let updatedTests;

    if (editId) {
        updatedTests = existingTests.map(t => {
            if (t.id === parseInt(editId)) {
                return {
                    ...t,
                    testName,
                    categoryId,
                    playTime,
                    questions
                };
            }
            return t;
        });
        localStorage.removeItem("editTestId");
    } else {
        const newId = existingTests.length ? Math.max(...existingTests.map(t => t.id)) + 1 : 1;
        const newTest = {
            id: newId,
            testName,
            categoryId,
            playTime,
            playAmount: 0,
            questions
        };
        updatedTests = [...existingTests, newTest];
    }

    localStorage.setItem("tests", JSON.stringify(updatedTests));
    alert("Bài test đã được lưu!");
    window.location.href = "test_manager.html";
}


function loadEditTest() {
    const editId = localStorage.getItem("editTestId");
    if (!editId) return;
    const tests = JSON.parse(localStorage.getItem("tests")) || [];
    const test = tests.find(t => t.id === parseInt(editId));
    if (!test) return;
    document.getElementById("formTitle").textContent = "Sửa bài test";
    document.getElementById("testName").value = test.testName;
    document.getElementById("categorySelect").value = test.categoryId;
    document.getElementById("testTime").value = test.playTime;

    questions = test.questions.map(q => ({ ...q }));
    renderQuestions();
}


document.getElementById('saveBtn').addEventListener('click', saveTest);

function logOut() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function goCategoryManager() {
    window.location.href = "category_manager.html";
}

function goTestManager() {
    window.location.href = "test_manager.html";
}
