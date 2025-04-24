if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([]));
}

function saveStorage(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderCategory() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const tbodyEl = document.querySelector('#tbody')
    let dataHTML = ''
    for (let i = 0; i < categories.length; i++) {
        dataHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${categories[i].name}</td>
            <td>
                <button class="btn btn-warning" onclick="openChangeModal(${i})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteCategory(${i})">Xoá</button>
            </td>
        </tr>`
    }
    tbodyEl.innerHTML = dataHTML
}

function addCategory() {
    const nameEl = document.getElementById("categoryName").value
    const categories = JSON.parse(localStorage.getItem('categories'));
    let viableName = categories.find(category => category.name === nameEl);
    if (viableName) {
        alert("Tên danh mục đã tồn tại")
    } else {
        categories.push({ name: nameEl });
        saveStorage(categories);
        renderCategory()
        document.querySelector('#modal').style.display = 'none'
    }
    document.getElementById("categoryName").value = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const modalAddEl = document.querySelector('#modal')
    const openAddBtn = document.querySelector('#openAddBtn')
    const closeAddBtn = document.querySelector('#closeAddBtn')
    const saveAddBtn = document.querySelector('#saveAddBtn')
    const closeChangeBtn = document.querySelector('#closeChangeBtn')
    const saveChangeBtn = document.querySelector('#saveChangeBtn')
    const modalChangeEl = document.querySelector('#modal2')

    openAddBtn.addEventListener('click', function () {
        modalAddEl.style.display = 'block'
    });

    closeAddBtn.addEventListener('click', function () {
        modalAddEl.style.display = 'none'
    });

    saveAddBtn.addEventListener('click', addCategory);

    closeChangeBtn.addEventListener('click', function () {
        modalChangeEl.style.display = 'none'
    });

    saveChangeBtn.addEventListener('click', changeCategory);
})

function deleteCategory(index) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    if (confirm("Bạn có muốn xoá danh mục này không?")) {
        categories.splice(index, 1);
        saveStorage(categories);
        alert("Xoá thành công")
    }
    renderCategory()
}

function openChangeModal(index) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const modalChangeEl = document.querySelector('#modal2');
    document.getElementById("categoryChangeName").value = categories[index].name;
    document.getElementById("saveChangeBtn").setAttribute("data-index", index);
    modalChangeEl.style.display = 'block';
}

function changeCategory() {
    const index = document.getElementById("saveChangeBtn").getAttribute("data-index");
    const nameEl = document.getElementById("categoryChangeName").value;
    const categories = JSON.parse(localStorage.getItem('categories'));
    let viableName = categories.find((category, i) => category.name === nameEl && i != index);
    if (viableName) {
        alert("Tên danh mục đã tồn tại");
    } else {
        categories[index].name = nameEl;
        saveStorage(categories);
        renderCategory();
        document.querySelector('#modal2').style.display = 'none';
    }
}
const categories = JSON.parse(localStorage.getItem('categories'));
const urlParams = new URLSearchParams(window.location.search);
const targetPage = urlParams.get('page');

const maxItem = 6;
const countPage = Math.ceil(categories.length / maxItem);
let curPage = targetPage ? parseInt(targetPage) : 1;

let paginBoxEL = document.querySelector("pagination")

function renderPagin() {
    let paginHtml = ``

    for (let i = 1; i <= countPage; i++) {
        paginHtml += `
             <button onclick="setPage(${i})" style="color: ${i == curPage ? "red" : ""}">${i}</button>
        `
    }
    paginBoxEL.innerHTML = `
    <button onclick="setPage(${curPage - 1})">pre</button>
        ${paginHtml}
    <button onclick="setPage(${curPage + 1})">next</button>
`

}


function renderData() {

    let ulHTML = ``;

    let data =  categories.slice(curPage*maxItem - maxItem, curPage*maxItem)

    for (let i = 0; i < data.length; i++) {
        ulHTML += `
            <li>Name: 
            ${data[i].name}, Id: ${data[i].id}
            <button onclick="deleteStudent(${i})">delete</button>   
             <button onclick="editStudent(${i})">edit</button>
            </li>
        `
    }

    ulEL.innerHTML = ulHTML
}

function setPage(pageNumber) {
    if (pageNumber == 0 ) {
        pageNumber = 1
    }

    if (pageNumber > countPage) {
        pageNumber = countPage
    }

    curPage = pageNumber

    window.history.pushState({}, '', "http://127.0.0.1:5500/?page=" + curPage);
    renderData()
    renderPagin()
}



renderPagin()
renderCategory()