const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");

        const isOpen = navigation.classList.contains("open");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.textContent = isOpen ? "✕" : "☰";
    });
}

const yearElements = document.querySelectorAll(".current-year");

const currentYear = new Date().getFullYear();

yearElements.forEach((element) => {
    element.textContent = currentYear;
});

const timestamp = document.querySelector("#timestamp");

if (timestamp) {
    timestamp.value = new Date().toISOString();
}

const visitKey = "chospexLastVisit";
const previousVisit = localStorage.getItem(visitKey);

if (!previousVisit) {
    localStorage.setItem(visitKey, new Date().toISOString());
} else {
    localStorage.setItem(visitKey, new Date().toISOString());
}