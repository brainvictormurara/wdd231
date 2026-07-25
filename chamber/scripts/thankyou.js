const params = new URLSearchParams(window.location.search);

const getValue = (key) => params.get(key) || "";

document.querySelector("#firstName").textContent = getValue("firstName");
document.querySelector("#lastName").textContent = getValue("lastName");
document.querySelector("#email").textContent = getValue("email");
document.querySelector("#phone").textContent = getValue("phone");
document.querySelector("#organization").textContent = getValue("organization");

const timestamp = getValue("timestamp");

if (timestamp) {
    const date = new Date(timestamp);

    document.querySelector("#timestampDisplay").textContent =
        date.toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "medium"
        });
} else {
    document.querySelector("#timestampDisplay").textContent = "";
}

/* MOBILE NAVIGATION */

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");

        const isOpen = navigation.classList.contains("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });
}