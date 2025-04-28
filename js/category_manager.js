if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([]));
}

const maxItem = 4;
let curPage = 1;

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
            <td>${start + i + 1}</td>
            <td>${paginatedCategories[i].emoji} ${paginatedCategories[i].name}</td>
            <td>
                <button class="btn btn-warning" onclick="openChangeModal(${start + i})">Sửa</button>
                <button class="btn btn-danger" onclick="openDeleteModal(${start + i})">Xoá</button>
            </td>
        </tr>`;
    }
    tbodyEl.innerHTML = dataHTML;
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
        <button onclick="setPage(${curPage - 1})">pre</button>
        ${paginHtml}
        <button onclick="setPage(${curPage + 1})">next</button>
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

function addCategory() {
    const nameEl = document.getElementById("categoryName").value.trim();
    const emoji = document.getElementById("emoji").value;
    const categories = JSON.parse(localStorage.getItem('categories'));
    if (categories.find(c => c.name === nameEl)) {
        alert("Tên danh mục đã tồn tại");
        return;
    }
    categories.push({ name: nameEl , emoji: emoji });
    saveStorage(categories);
    setPage(Math.ceil(categories.length / maxItem)); 
    document.querySelector('#modal').style.display = 'none';
    document.getElementById("categoryName").value = '';
}

function openDeleteModal(index) {
    document.getElementById("DeleteBtn").setAttribute("data-index", index);
    document.querySelector('#modal3').style.display = 'block';
}

function deleteCategory() {
    const index = parseInt(document.getElementById("DeleteBtn").getAttribute("data-index"));
    const categories = JSON.parse(localStorage.getItem('categories'));
    categories.splice(index, 1);
    saveStorage(categories);
    document.querySelector('#modal3').style.display = 'none';
    setPage(curPage); 
}

function openChangeModal(index) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    document.getElementById("categoryChangeName").value = categories[index].name;
    document.getElementById("saveChangeBtn").setAttribute("data-index", index);
    document.querySelector('#modal2').style.display = 'block';
}

function changeCategory() {
    const index = parseInt(document.getElementById("saveChangeBtn").getAttribute("data-index"));
    const newName = document.getElementById("categoryChangeName").value.trim();
    const categories = JSON.parse(localStorage.getItem('categories'));

    if (categories.find((c, i) => c.name === newName && i !== index)) {
        alert("Tên danh mục đã tồn tại");
        return;
    }

    categories[index].name = newName;
    saveStorage(categories);
    renderCategory();
    document.querySelector('#modal2').style.display = 'none';
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetPage = parseInt(urlParams.get('page'));
    if (targetPage) curPage = targetPage;

    document.querySelector('#openAddBtn').onclick = () => {
        document.querySelector('#modal').style.display = 'block';
    };
    document.querySelector('#closeAddBtn').onclick = () => {
        document.querySelector('#modal').style.display = 'none';
    };
    document.querySelector('#saveAddBtn').onclick = addCategory;

    document.querySelector('#closeChangeBtn').onclick = () => {
        document.querySelector('#modal2').style.display = 'none';
    };
    document.querySelector('#saveChangeBtn').onclick = changeCategory;

    document.querySelector('#closeDeleteBtn').onclick = () => {
        document.querySelector('#modal3').style.display = 'none';
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