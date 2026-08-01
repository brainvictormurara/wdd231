const cardsContainer = document.querySelector("#discover-cards");
const visitorMessage = document.querySelector("#visitor-message");

async function getPlaces() {
    try {
        const response = await fetch("data/places.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        displayPlaces(data.places);
    } catch (error) {
        console.error("Unable to load the places:", error);

        cardsContainer.innerHTML =
            "<p>Sorry, the places of interest could not be loaded.</p>";
    }
}

function displayPlaces(places) {
    cardsContainer.innerHTML = "";

    places.forEach((place) => {
        const card = document.createElement("article");
        const title = document.createElement("h2");
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const address = document.createElement("address");
        const description = document.createElement("p");
        const button = document.createElement("button");

        card.classList.add("discover-card");

        title.textContent = place.name;

        image.src = place.image;
        image.alt = `View of ${place.name}`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 200;

        address.textContent = place.address;
        description.textContent = place.description;

        button.textContent = "Learn More";
        button.type = "button";
        button.setAttribute(
            "aria-label",
            `Learn more about ${place.name}`
        );

        button.addEventListener("click", () => {
            alert(
                `${place.name}\n\n` +
                `Location: ${place.address}\n\n` +
                place.description
            );
        });

        figure.appendChild(image);

        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(button);

        cardsContainer.appendChild(card);
    });
}

function displayVisitorMessage() {
    const currentVisit = Date.now();
    const previousVisit = Number(
        localStorage.getItem("lastDiscoverVisit")
    );

    if (!previousVisit) {
        visitorMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const daysBetweenVisits = Math.floor(
            (currentVisit - previousVisit) / millisecondsPerDay
        );

        if (daysBetweenVisits < 1) {
            visitorMessage.textContent =
                "Back so soon! Awesome!";
        } else if (daysBetweenVisits === 1) {
            visitorMessage.textContent =
                "You last visited 1 day ago.";
        } else {
            visitorMessage.textContent =
                `You last visited ${daysBetweenVisits} days ago.`;
        }
    }

    localStorage.setItem(
        "lastDiscoverVisit",
        currentVisit.toString()
    );
}

getPlaces();
displayVisitorMessage();