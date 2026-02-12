document.addEventListener("DOMContentLoaded", () => {
    const sidebarEl = document.getElementById("profileSidebar");
    const logoutBtn = document.getElementById("logoutBtn");

    if (sidebarEl && window.bootstrap) {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);

        sidebarEl.addEventListener("click", (e) => {
            const link = e.target.closest("a.sidebar-link");
            if (link) offcanvas.hide();
        });
    }

    // Logout 
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "../src/IndexPage.html";
        });
    }
});
