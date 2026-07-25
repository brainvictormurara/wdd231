const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const timestampInput = document.querySelector("#timestamp");

const modalButtons = document.querySelectorAll(".modal-button");
const closeButtons = document.querySelectorAll(".close-modal");
const dialogs = document.querySelectorAll("dialog");

/* MOBILE NAVIGATION */

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

/* FORM TIMESTAMP */

if (timestampInput) {
    timestampInput.value = new Date().toISOString();
}

/* OPEN MEMBERSHIP DIALOGS */

modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;

        if (!modalId) {
            return;
        }

        const dialog = document.getElementById(modalId);

        if (dialog instanceof HTMLDialogElement) {
            dialog.showModal();
        }
    });
});

/* CLOSE DIALOGS WITH CLOSE BUTTON */

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = button.closest("dialog");

        if (dialog instanceof HTMLDialogElement) {
            dialog.close();
        }
    });
});

/* CLOSE DIALOGS BY CLICKING THE BACKDROP */

dialogs.forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});