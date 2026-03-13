/**
 * AdminDashboardPage.js
 * ---------------------
 * This script manages the Admin Dashboard for laboratory technicians.
 *
 * Behavior:
 * - Fetches and renders lab technician cards dynamically from the server
 * - Handles creating new lab technicians securely
 * - Implements live search/filter functionality on the lab tech cards
 *
 * Features:
 * - Case-insensitive search
 * - Instant feedback (no page reload)
 * - Works on all text inside the lab tech card (name, email, phone, assigned lab)
 * - Automatically updates search functionality for newly created lab techs
 */

// ELEMENT SELECTION
const searchInput = document.getElementById("searchLabTech"); // Search input field
const createBtn = document.getElementById("createLabTechBtn"); // Button to create new lab tech
const labTechContainer = document.querySelector("#manage-labtechs .row"); // Container for lab tech cards

// FUNCTION: Fetch and render lab technicians
async function fetchLabTechs() {
    try {
        const res = await fetch("/labtechs"); // Fetch from backend
        const labTechs = await res.json();

        // Clear existing cards
        labTechContainer.innerHTML = "";

        // Render each lab tech as a card
        labTechs.forEach(tech => {
            labTechContainer.innerHTML += `
            <div class="col-xl-4 col-md-6 labtech-card">
                <div class="admin-card d-flex align-items-center">
                    <img src="../pictures/temp.jpeg" class="admin-avatar">
                    <div class="ms-3 labtech-info">
                        <h6 class="mb-1 fw-bold">${tech.firstName} ${tech.lastName}</h6>
                        <p class="mb-0 text-muted small">${tech.email}</p>
                        <p class="mb-0 text-muted small">${tech.contactNumber || ""}</p>
                        <p class="mb-0 text-muted small">Lab: ${tech.assignedLab}</p>
                        <p class="mb-0 text-muted small">Status: ${tech.status || "Offline"}</p>
                    </div>
                </div>
            </div>`;
        });
    } catch (err) {
        console.error("Error fetching lab technicians:", err);
    }
}

// EVENT LISTENER: Create Lab Technician
if (createBtn) {
    createBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const form = e.target.closest("form");

        // Collect form data
        const firstName = form.querySelector("input[placeholder='First Name']").value.trim();
        const lastName = form.querySelector("input[placeholder='Last Name']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const contactNumber = form.querySelector("input[placeholder='Contact Number']").value.trim();
        const password = form.querySelector("input[placeholder='Password']").value;
        const confirmPassword = form.querySelector("input[placeholder='Confirm Password']").value;
        const assignedLab = form.querySelector("select").value;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !assignedLab) {
            return alert("Please fill in all required fields.");
        }

        // Check password match
        if (password !== confirmPassword) {
            return alert("Passwords do not match. Please try again.");
        }

        // Prepare data object
        const data = { firstName, lastName, email, contactNumber, password, confirmPassword, assignedLab };
        
        try {
            const res = await fetch("/labtechs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            alert(result.message || result.error);

            if (res.ok) {
                form.reset();       // Clear the form
                fetchLabTechs();    // Refresh the lab tech cards
            }
        } catch (err) {
            console.error("Error creating lab technician:", err);
            alert("Server error. Please try again.");
        }
    });
}

// EVENT LISTENER: Live Search/Filter
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const searchValue = searchInput.value.toLowerCase();
        const labTechCards = document.querySelectorAll(".labtech-card"); // Query all current cards

        labTechCards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(searchValue) ? "" : "none";
        });
    });
}

// INITIALIZATION
// Fetch and display lab technicians when page loads
fetchLabTechs();