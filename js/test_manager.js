if (!localStorage.getItem('tests')) {
    const tests = [
        {
            id: 1,
            testName: "Test 1",
            categoryId: 1,
            playTime: 30,
            playAmount: 0,
            questions: [
                {
                    content: "What is 2 + 2?",
                    answers: [
                        { answer: "3" },
                        { answer: "4", isCorrect: true },
                        { answer: "5" },
                        { answer: "22" }
                    ]
                }
            ]
        },
        {
            id: 2,
            testName: "Test 2",
            categoryId: 2,
            playTime: 45,
            playAmount: 0,
            questions: [
                {
                    content: "What is the capital of France?",
                    answers: [
                        { answer: "Berlin" },
                        { answer: "Paris", isCorrect: true },
                        { answer: "Madrid" },
                        { answer: "Rome" }
                    ]
                }
            ]
        },
        {
            id: 3,
            testName: "Test 3",
            categoryId: 3,
            playTime: 60,
            playAmount: 0,
            questions: [
                {
                    content: "Which planet is known as the Red Planet?",
                    answers: [
                        { answer: "Earth" },
                        { answer: "Venus" },
                        { answer: "Mars", isCorrect: true },
                        { answer: "Jupiter" }
                    ]
                }
            ]
        }
    ];

    localStorage.setItem('tests', JSON.stringify(tests));
}


const maxItem = 4;
let curPage = 1;
let modalAdd, modalChange, modalDelete;

const tests = JSON.parse(localStorage.getItem('tests')) || [];

function saveTests(tests) {
    localStorage.setItem('tests', JSON.stringify(tests));
}

function renderTests(searchTests = null) {
    const tests = JSON.parse(localStorage.getItem('tests')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const tbody = document.querySelector('tbody');
    const selectValue = document.querySelector('#filter').value;

    if (selectValue === 'time') {
        tests.sort((a, b) => a.time - b.time);
    } else if (selectValue === 'questions') {
        tests.sort((a, b) => a.questions - b.questions);
    } else if (selectValue === 'all') {
        tests.sort((a, b) => a.id - b.id);
    }

    const dataToRender = searchTests ?? tests;
    const start = (curPage - 1) * maxItem;
    const end = start + maxItem;
    const paginatedTests = dataToRender.slice(start, end);

    let html = '';
    for (let i = 0; i < paginatedTests.length; i++) {
        const test = paginatedTests[i];
        html += `
        <tr>
            <td class="text-center">${test.id}</td>
            <td>${test.testName}</td>
            <td>
                ${(() => {
                    const category = categories.find(cat => cat.id === test.categoryId);
                    return category ? `${category.emoji} ${category.name}` : 'Unknown';
                })()}
            </td>
            <td>${test.questions.length}</td>
            <td>${test.playTime} min</td>
            <td class="text-center">
                <button class="btn btn-sm btn-warning" onclick="editTest(${test.id})">Sửa</button>
                <button class="btn btn-danger" onclick="openDeleteModal(${i})">Xoá</button>
            </td>
        </tr>`;
    }

    tbody.innerHTML = html;
}

function renderPagin() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    const countPage = Math.ceil(tests.length / maxItem);
    let paginHtml = ``;

    for (let i = 1; i <= countPage; i++) {
        paginHtml += `
            <button onclick="setPage(${i})" style="background-color: ${i === curPage ? 'blue' : ''}; color: ${i === curPage ? 'white' : ''};">${i}</button>
        `;
    }

    document.querySelector("#pagination").innerHTML = `
        <button onclick="setPage(${curPage - 1})">&lt</button>
        ${paginHtml}
        <button onclick="setPage(${curPage + 1})">&gt</button>
    `;
}

function setPage(pageNumber) {
    const tests = JSON.parse(localStorage.getItem('tests'));
    const countPage = Math.ceil(tests.length / maxItem);

    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > countPage) pageNumber = countPage;

    curPage = pageNumber;

    window.history.pushState({}, '', "?page=" + curPage);
    renderTests();
    renderPagin();
}

function addTest() {
    const name = document.getElementById('testName').value.trim();
    const category = document.getElementById('testCategory').value.trim();
    const questions = parseInt(document.getElementById('testQuestions').value.trim());
    const time = parseInt(document.getElementById('testTime').value.trim());

    if (!name || !category || isNaN(questions) || isNaN(time)) {
        alert('Vui lòng điền đầy đủ thông tin hợp lệ.');
        return;
    }

    const tests = JSON.parse(localStorage.getItem('tests'));
    let id = tests.length ? tests[tests.length - 1].id + 1 : 1;
    tests.push({ id, name, category, questions, time });
    saveTests(tests);
    setPage(Math.ceil(tests.length / maxItem));
    renderTests();

    document.getElementById('testName').value = '';
    document.getElementById('testCategory').value = '';
    document.getElementById('testQuestions').value = '';
    document.getElementById('testTime').value = '';
    modalAdd.hide();
}

function goTestEditor() {
    window.location.href = "test_editor.html";
}

function openDeleteModal(index) {
    document.getElementById("deleteBtn").setAttribute("data-index", index);
    modalDelete.show();
}

function deleteTest() {
    const index = document.getElementById("deleteBtn").getAttribute("data-index");
    const tests = JSON.parse(localStorage.getItem('tests'));
    tests.splice(index, 1);
    saveTests(tests);
    modalDelete.hide();
    renderTests();

    const countPage = Math.ceil(tests.length / maxItem);
    if (curPage > countPage) {
        curPage = countPage;
    }
    setPage(curPage);
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetPage = parseInt(urlParams.get('page'));
    if (targetPage) curPage = targetPage;

    modalDelete = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.querySelector('#closeDeleteBtn').onclick = () => {
        modalDelete.hide();
    };

    document.querySelector("#deleteBtn").onclick = deleteTest;

    renderTests();
    renderPagin();
}

function searchTests() {
    const search = document.getElementById("searchInput").value;
    const tests = JSON.parse(localStorage.getItem('tests'));
    let searchResult = [];
    for (let i = 0; i < tests.length; i++) {
        if (tests[i].name.toLowerCase().includes(search.toLowerCase())) {
            searchResult.push(tests[i]);
        }
    }
    renderTests(searchResult);
}

function editTest(testId) {
    localStorage.setItem("editTestId", testId);
    window.location.href = "test_editor.html";
}

function logOut() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function goCategoryManager() {
    window.location.href = "category_manager.html";
}

document.addEventListener('DOMContentLoaded', init);