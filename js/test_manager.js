if (!localStorage.getItem('tests')) {
    localStorage.setItem('tests', JSON.stringify([]));
}

function saveTests(tests) {
    localStorage.setItem('tests', JSON.stringify(tests));
}

function renderTests() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    const tbody = document.querySelector('tbody');
    let html = '';

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${test.name}</td>
            <td>${test.category}</td>
            <td>${test.questions}</td>
            <td>${test.time}</td>
            <td>
                <button class="btn btn-warning">Sửa</button>
                <button class="btn btn-danger" onclick="deleteTest(${i})">Xoá</button>
            </td>
        </tr>`;
    }

    tbody.innerHTML = html;
}

function addTest() {
    const name = document.getElementById('testName').value.trim();
    const category = document.getElementById('testCategory').value.trim();
    const questions = document.getElementById('testQuestions').value.trim();
    const time = document.getElementById('testTime').value.trim();

    if (!name || !category || !questions || !time) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    const tests = JSON.parse(localStorage.getItem('tests'));
    tests.push({ name, category, questions, time });
    saveTests(tests);
    renderTests();

    document.getElementById('testName').value = '';
    document.getElementById('testCategory').value = '';
    document.getElementById('testQuestions').value = '';
    document.getElementById('testTime').value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal'));
    modal.hide();
}

function init() {
    document.getElementById('openAddTestBtn').onclick = () => {
        const modal = new bootstrap.Modal(document.getElementById('modal'));
        modal.show();
    };

    document.getElementById('closeAddTestBtn').onclick = () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal'));
        modal.hide();
    };

    document.getElementById('saveAddTestBtn').onclick = addTest;

    renderTests();
}

function deleteTest(index) {
    const tests = JSON.parse(localStorage.getItem('tests'));
    tests.splice(index, 1);
    saveTests(tests);
    renderTests();
}

document.addEventListener('DOMContentLoaded', init);
