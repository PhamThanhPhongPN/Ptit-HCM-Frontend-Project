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
                <button class="btn btn-danger" onclick="openDeleteModal(${i})">Xoá</button>
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
    document.querySelector('#modal').style.display = 'none';
    document.querySelector('#modal').reset();
}

function openDeleteModal(index) {
    document.getElementById("deleteBtn").setAttribute("data-index", index);
    document.querySelector('#deleteModal').style.display = 'block';
}

function deleteTest() {
    const index = document.getElementById("deleteBtn").getAttribute("data-index");
    const tests = JSON.parse(localStorage.getItem('tests'));
    tests.splice(index, 1);
    saveTests(tests);
    document.querySelector('#deleteModal').style.display = 'none';
    renderTests();
}

function init() {
    document.querySelector('#openAddTestBtn').onclick = () => {
        document.querySelector('#modal').style.display = 'block';
    };

    document.querySelector('#closeAddTestBtn').onclick = () => {
        document.querySelector('#modal').style.display = 'none';
    };

    document.querySelector('#closeDeleteBtn').onclick = () => {
        document.querySelector('#deleteModal').style.display = 'none';
    };

    document.querySelector("#saveAddTestBtn").onclick = addTest;

    document.querySelector("#deleteBtn").onclick = deleteTest;

    renderTests();
}

document.addEventListener('DOMContentLoaded', init);
renderTests();