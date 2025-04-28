if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}

let admin = {
    name: "Phong",
    email: "thanhphong102006@gmail.com",
    password: "123123123",
    role: "admin"
};

function saveStorage(users) {
    localStorage.setItem("users", JSON.stringify(users))
}

localStorage.removeItem("currentUser");

let users = JSON.parse(localStorage.getItem("users"));

if (!users.some(user => user.email === admin.email)) {
    users.push(admin);
    saveStorage(users);
}

function validateRegister(event) {
    event.preventDefault(); 

    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    let isValid = true;

    const fullName = document.getElementById('fullName').value;
    if (fullName.trim() === '') {
        document.getElementById('fullNameError').style.display = 'block';
        document.getElementById('fullNameError').innerText = 'Họ và tên không được để trống';
        isValid = false;
    }

    const email = document.getElementById('email').value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('emailError').innerText = 'Email không hợp lệ';
        isValid = false;
    }

    const password = document.getElementById('password').value;
    if (password.length < 8) {
        document.getElementById('passwordError').style.display = 'block';
        document.getElementById('passwordError').innerText = 'Mật khẩu phải có ít nhất 8 ký tự';
        isValid = false;
    }

    const confirmPassword = document.getElementById('confirmPassword').value;
    if (confirmPassword !== password) {
        document.getElementById('confirmPasswordError').style.display = 'block';
        document.getElementById('confirmPasswordError').innerText = 'Mật khẩu xác nhận không khớp';
        isValid = false;
    }

    if (isValid) {
        alert('Đăng ký thành công!');
        return true;
    } else {
        return false;
    }
};

function register(event) {
    event.preventDefault()
    if (validateRegister(event)) {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem("users"))
        users.push({name: fullName, email: email, password: password, role: "user"})
        saveStorage(users)
        window.location.href = "main.html"
    }
    event.target.reset()
}
