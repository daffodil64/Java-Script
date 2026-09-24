const form = document.getElementById("registrationForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const birthday = document.getElementById("birthday");
const password = document.getElementById("password");
const rePassword = document.getElementById("rePassword");
const terms = document.getElementById("terms");
const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const birthdayError = document.getElementById("birthdayError");
const passwordError = document.getElementById("passwordError");
const rePasswordError = document.getElementById("rePasswordError");
const termsError = document.getElementById("termsError");
const successMessage = document.getElementById("successMessage");
firstName.addEventListener("focus", function () {
    firstName.style.backgroundColor = "#eef7ff";
});
lastName.addEventListener("focus", function () {
    lastName.style.backgroundColor = "#eef7ff";
});
email.addEventListener("focus", function () {
    email.style.backgroundColor = "#eef7ff";
});
password.addEventListener("focus", function () {
    password.style.backgroundColor = "#eef7ff";
});
rePassword.addEventListener("focus", function () {
    rePassword.style.backgroundColor = "#eef7ff";
});
email.addEventListener("change", function () {
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === "") {
        emailError.textContent = "Email is required.";
        emailError.style.color = "red";
    }
    else if (!emailPattern.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.color = "red";
    }
    else {
        emailError.textContent = "Valid email address.";
        emailError.style.color = "green";
    }
});
password.addEventListener("change", function () {
    if (password.value.length < 6) {
        passwordError.textContent =
            "Password must contain at least 6 characters.";
    }
    else {
        passwordError.textContent = "";
    }
});
rePassword.addEventListener("change", function () {
    if (rePassword.value !== password.value) {
        rePasswordError.textContent =
            "Passwords do not match.";
    }
    else {
        rePasswordError.textContent = "";
    }
});
form.addEventListener("submit", function (event) {
    event.preventDefault();
    firstNameError.textContent = "";
    lastNameError.textContent = "";
    emailError.textContent = "";
    birthdayError.textContent = "";
    passwordError.textContent = "";
    rePasswordError.textContent = "";
    termsError.textContent = "";
    successMessage.textContent = "";
    let isValid = true;
    if (firstName.value.trim() === "") {
        firstNameError.textContent =
            "First name is required.";
        isValid = false;
    }
    if (lastName.value.trim() === "") {
        lastNameError.textContent =
            "Last name is required.";
        isValid = false;
    }
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === "") {
        emailError.textContent =
            "Email is required.";
        isValid = false;
    }
    else if (!emailPattern.test(emailValue)) {
        emailError.textContent =
            "Please enter a valid email address.";
        isValid = false;
    }
    if (birthday.value === "") {
        birthdayError.textContent =
            "Birthday is required.";
        isValid = false;
    }
    if (password.value === "") {
        passwordError.textContent =
            "Password is required.";
        isValid = false;
    }
    else if (password.value.length < 6) {
        passwordError.textContent =
            "Password must contain at least 6 characters.";
        isValid = false;
    }
    if (rePassword.value === "") {
        rePasswordError.textContent =
            "Please re-enter your password.";
        isValid = false;
    }
    else if (password.value !== rePassword.value) {
        rePasswordError.textContent =
            "Passwords do not match.";
        isValid = false;
    }
    if (!terms.checked) {
        termsError.textContent =
            "You must agree to the Terms and Conditions.";
        isValid = false;
    }
    if (isValid) {
        successMessage.textContent =
            "Registration successful!";
        form.reset();
    }
});
