if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([
            {name: "Bio Marine Life", emoji: "🐠" },
            {name: "Rock and Geography", emoji: "🗿" },
            {name: "Dinosaur", emoji: "🦖" },
    ]));
}

const maxItem = 4;
let curPage = 1;
let modalAdd, modalChange, modalDelete;

function saveStorage(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderCategory() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const tbodyEl = document.querySelector('#tbody');
    let dataHTML = '';
    const start = (curPage - 1) * maxItem;
    const end = start + maxItem;
    const paginatedCategories = categories.slice(start, end);
    for (let i = 0; i < paginatedCategories.length; i++) {
        dataHTML += `
        <tr>
            <td class="text-center">${start + i + 1}</td>
            <td>${paginatedCategories[i].emoji} ${paginatedCategories[i].name}</td>
            <td class="text-center">
                <button class="btn btn-warning" onclick="openChangeModal(${start + i})">Sửa</button>
                <button class="btn btn-danger" onclick="openDeleteModal(${start + i})">Xoá</button>
            </td>
        </tr>`;
    }
    tbodyEl.innerHTML = dataHTML;
}

function validateAddForm() {
    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    let isValid = true;

    const name = document.getElementById('categoryName').value.trim();
    const emoji = document.getElementById('emoji').value;

    if (name.length === 0) {
        document.getElementById('nameError').style.display = 'block';
        document.getElementById('nameError').innerText = 'Tên danh mục không được để trống';
        isValid = false;
    } else if (name.length < 3 || name.length > 20) {
        document.getElementById('nameError').style.display = 'block';
        document.getElementById('nameError').innerText = 'Tên danh mục phải từ 3 đến 20 ký tự';
        isValid = false;
    }

    if (emoji.length === 0) {
        document.getElementById('emojiError').style.display = 'block';
        document.getElementById('emojiError').innerText = 'Hãy chọn một emoji';
        isValid = false;
    } else if (emoji.length > 2) {
        document.getElementById('emojiError').style.display = 'block';
        document.getElementById('emojiError').innerText = 'Emoji không được quá 2 ký tự';
        isValid = false;
    }

    return isValid;
}

function validateChangeForm() {
    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    let isValid = true;

    const name = document.getElementById('categoryChangeName').value.trim();
    const emoji = document.getElementById('categoryChangeEmoji').value;

    if (name.length === 0) {
        document.getElementById('nameChangeError').style.display = 'block';
        document.getElementById('nameChangeError').innerText = 'Tên danh mục không được để trống';
        isValid = false;
    } else if (name.length < 3 || name.length > 20) {
        document.getElementById('nameChangeError').style.display = 'block';
        document.getElementById('nameChangeError').innerText = 'Tên danh mục phải từ 3 đến 20 ký tự';
        isValid = false;
    }

    if (emoji.length === 0) {
        document.getElementById('emojiChangeError').style.display = 'block';
        document.getElementById('emojiChangeError').innerText = 'Hãy chọn một emoji';
        isValid = false;
    } else if (emoji.length > 2) {
        document.getElementById('emojiChangeError').style.display = 'block';
        document.getElementById('emojiChangeError').innerText = 'Emoji không được quá 2 ký tự';
        isValid = false;
    }

    return isValid;
}


function renderPagin() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const countPage = Math.ceil(categories.length / maxItem);
    let paginHtml = ``;

    for (let i = 1; i <= countPage; i++) {
        paginHtml += `
            <button onclick="setPage(${i})" style="color: ${i === curPage ? "red" : ""}">${i}</button>
        `;
    }

    document.querySelector("#pagination").innerHTML = `
        <button onclick="setPage(${curPage - 1})">&lt</button>
        ${paginHtml}
        <button onclick="setPage(${curPage + 1})">&gt</button>
    `;
}

function setPage(pageNumber) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const countPage = Math.ceil(categories.length / maxItem);

    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > countPage) pageNumber = countPage;

    curPage = pageNumber;

    window.history.pushState({}, '', "?page=" + curPage);
    renderCategory();
    renderPagin();
}

function addCategory(event) {
    event.preventDefault();
    const nameEl = document.getElementById("categoryName").value.trim();
    const emoji = document.getElementById("emoji").value;
    const categories = JSON.parse(localStorage.getItem('categories'));
    if (validateAddForm()) {
        if (categories.find(c => c.name === nameEl)) {
            alert("Tên danh mục đã tồn tại");
            return;
        }
        categories.push({ name: nameEl , emoji: emoji });
        saveStorage(categories);
        setPage(Math.ceil(categories.length / maxItem)); 
        modalAdd.hide();
        document.getElementById("categoryName").value = '';
        document.getElementById("emoji").value = '';
    }
}

function changeCategory(event) {
    event.preventDefault();
    const index = parseInt(document.getElementById("saveChangeBtn").getAttribute("data-index"));
    const newName = document.getElementById("categoryChangeName").value.trim();
    const emoji = document.getElementById("categoryChangeEmoji").value;
    const categories = JSON.parse(localStorage.getItem('categories'));
    if (validateChangeForm()) {
        if (categories.find((c, i) => c.name === newName && i !== index)) {
            alert("Tên danh mục đã tồn tại");
            return;
        }
        categories[index].name = newName;
        categories[index].emoji = emoji;
        saveStorage(categories);
        renderCategory();
        modalChange.hide();
    }
}


function openDeleteModal(index) {
    document.getElementById("DeleteBtn").setAttribute("data-index", index);
    modalDelete.show();
}

function deleteCategory() {
    const index = parseInt(document.getElementById("DeleteBtn").getAttribute("data-index"));
    const categories = JSON.parse(localStorage.getItem('categories'));
    categories.splice(index, 1);
    saveStorage(categories);
    modalDelete.hide(); 
    const countPage = Math.ceil(categories.length / maxItem);
    if (curPage > countPage) {
        curPage = countPage;
    }
    setPage(curPage);
}


function openChangeModal(index) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    document.getElementById("categoryChangeName").value = categories[index].name;
    document.getElementById("categoryChangeEmoji").value = categories[index].emoji;
    document.getElementById("saveChangeBtn").setAttribute("data-index", index);
    modalChange.show();
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetPage = parseInt(urlParams.get('page'));
    if (targetPage) curPage = targetPage;

    modalAdd = new bootstrap.Modal(document.getElementById('modal'));
    modalChange = new bootstrap.Modal(document.getElementById('modal2'));
    modalDelete = new bootstrap.Modal(document.getElementById('modal3'));

    document.querySelector('#openAddBtn').onclick = () => {
        modalAdd.show();
    };

    document.querySelector('#closeAddBtn').onclick = () => {
        modalAdd.hide();
        document.getElementById("categoryName").value = '';
        document.getElementById("emoji").value = '';
        document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    };

    document.querySelector('#saveAddBtn').addEventListener('click', addCategory);

    document.querySelector('#closeChangeBtn').onclick = () => {
        modalChange.hide();
        document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    };

    document.querySelector('#saveChangeBtn').addEventListener('click', changeCategory);

    document.querySelector('#closeDeleteBtn').onclick = () => {
        modalDelete.hide();
    };

    document.querySelector('#DeleteBtn').onclick = deleteCategory;

    renderPagin();
    renderCategory();
}


document.addEventListener('DOMContentLoaded', init);

function logOut() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function goTestManager() {
    window.location.href = "test_manager.html";
}