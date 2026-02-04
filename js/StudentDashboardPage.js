const menuBtn = document.getElementById("menuBtn");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");

function closeMenu() {
    userMenu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    const isOpen = userMenu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
}

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
});

// close when clicking outside
document.addEventListener("click", () => {
    closeMenu();
});

// prevent click inside menu from closing immediately
userMenu.addEventListener("click", (e) => {
    e.stopPropagation();
});

// close when pressing esc
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});

logoutBtn.addEventListener("click", () => {
    window.location.href = "../src/LoginPage.html";
});
