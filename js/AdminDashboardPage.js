const searchInput = document.getElementById("searchLabTech");
const labTechCards = document.querySelectorAll(".labtech-card");

searchInput.addEventListener("keyup", function () {
const searchValue = searchInput.value.toLowerCase();

labTechCards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(searchValue)) {
    card.style.display = "";
    } else {
    card.style.display = "none";
    }
});
});
