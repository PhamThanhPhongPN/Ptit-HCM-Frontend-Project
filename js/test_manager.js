if (!localStorage.getItem('tests')) {
    localStorage.setItem('tests', JSON.stringify([
        { id: 1, name: 'Test 1', category: 'Category 1', questions: 10, time: 30 },
        { id: 2, name: 'Test 2', category: 'Category 2', questions: 20, time: 60 },
        { id: 3, name: 'Test 3', category: 'Category 3', questions: 15, time: 45 }
    ]));
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
            <td>${test.name}</td>
            <td>${test.category}</td>
            <td>${test.questions}</td>
            <td>${test.time} min</td>
            <td class="text-center">
                <button class="btn btn-warning">Sửa</button>
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

    modalAdd = new bootstrap.Modal(document.getElementById('modal'));
    modalDelete = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.querySelector('#openAddTestBtn').onclick = () => {
        modalAdd.show();
    };

    document.querySelector('#closeAddTestBtn').onclick = () => {
        modalAdd.hide();
    };

    document.querySelector('#closeDeleteBtn').onclick = () => {
        modalDelete.hide();
    };

    document.querySelector("#saveAddTestBtn").onclick = addTest;
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

function logOut() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function goCategoryManager() {
    window.location.href = "category_manager.html";
}

document.addEventListener('DOMContentLoaded', init);