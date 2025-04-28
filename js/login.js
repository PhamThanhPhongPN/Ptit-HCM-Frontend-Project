if (!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify([]))
}

function saveStorage(users) {
    localStorage.setItem("users", JSON.stringify(users))
}

function validateLogin(event) {
    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
    let isValid = true;

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

    if (isValid) {
        return true;
    } else {
        return false;
    }
};

function login(event) {
    event.preventDefault()
    if (validateLogin(event)){
        let logEmail = document.getElementById("email").value;
        let logPass = document.getElementById("password").value;
        let users = JSON.parse(localStorage.getItem("users"));
        let viableUser = users.find(user => user.email === logEmail && user.password === logPass);
        if (viableUser) {
            alert('Đăng nhập thành công!');
            localStorage.setItem("currentUser", JSON.stringify(viableUser));
            window.location.href = "main.html";
        } else {
            alert("Email hoặc mật khẩu không đúng");
        }
    }
}