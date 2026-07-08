const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member data.");
        }

        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        membersContainer.innerHTML = "<p>Business directory information could not be loaded.</p>";
        console.error(error);
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("card");

        card.innerHTML = `
            <h2>${member.name}</h2>
            <p class="tagline">${membershipLevel(member.membership)} Member</p>

            <div class="card-body">
                <img src="${member.image}" alt="${member.name} storefront" loading="lazy" width="95" height="80">

                <div class="member-info">
                    <p><strong>ADDRESS:</strong> ${member.address}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="${member.website}" target="_blank" rel="noopener">Website</a></p>
                </div>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

function membershipLevel(level) {
    if (level === 3) return "Gold";
    if (level === 2) return "Silver";
    return "Member";
}

gridButton.addEventListener("click", () => {
    membersContainer.classList.remove("list-view");
    membersContainer.classList.add("grid-view");

    gridButton.classList.add("active-view");
    listButton.classList.remove("active-view");
});

listButton.addEventListener("click", () => {
    membersContainer.classList.remove("grid-view");
    membersContainer.classList.add("list-view");

    listButton.classList.add("active-view");
    gridButton.classList.remove("active-view");
});

getMembers();