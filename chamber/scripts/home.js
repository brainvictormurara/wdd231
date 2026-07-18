const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

const currentTemp = document.querySelector("#current-temp");
const weatherDescription = document.querySelector("#weather-description");
const weatherIcon = document.querySelector("#weather-icon");
const forecastContainer = document.querySelector("#forecast-container");
const spotlightsContainer = document.querySelector("#spotlights");

// ===============================
// Mobile Navigation
// ===============================

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.setAttribute("aria-expanded", String(isOpen));
});

// ===============================
// OpenWeatherMap Configuration
// ===============================

const apiKey = "a3ffdba38428c728979161450ce24484";
const city = "Marondera,ZW";
const units = "metric";

const currentWeatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

// ===============================
// Weather
// ===============================

async function getWeather() {
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok) {
            throw new Error(
                `Current weather request failed: ${currentResponse.status}`
            );
        }

        if (!forecastResponse.ok) {
            throw new Error(
                `Forecast request failed: ${forecastResponse.status}`
            );
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        currentTemp.textContent = "Unavailable";
        weatherDescription.textContent =
            "Weather information unavailable";

        forecastContainer.innerHTML =
            "<p>The weather forecast could not be loaded.</p>";

        weatherIcon.hidden = true;

        console.error("Weather error:", error);
    }
}

function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    currentTemp.textContent = `${temperature}°C`;
    weatherDescription.textContent = capitalizeWords(description);

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherIcon.alt =
        `${capitalizeWords(description)} weather icon`;

    weatherIcon.hidden = false;
}

function displayForecast(data) {
    forecastContainer.innerHTML = "";

    const middayForecasts = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
    );

    const nextThreeDays = middayForecasts.slice(0, 3);

    if (nextThreeDays.length === 0) {
        forecastContainer.innerHTML =
            "<p>No forecast information is currently available.</p>";
        return;
    }

    nextThreeDays.forEach((day) => {
        const date = new Date(day.dt * 1000);

        const forecastCard = document.createElement("article");
        forecastCard.classList.add("forecast-day");

        const heading = document.createElement("h4");
        heading.textContent = date.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const temperature = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${Math.round(day.main.temp)}°C`;
        temperature.appendChild(strong);

        const description = document.createElement("p");
        description.textContent =
            capitalizeWords(day.weather[0].description);

        forecastCard.appendChild(heading);
        forecastCard.appendChild(temperature);
        forecastCard.appendChild(description);

        forecastContainer.appendChild(forecastCard);
    });
}

function capitalizeWords(text) {
    return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// ===============================
// Chamber Spotlights
// ===============================

async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(
                `Member request failed: ${response.status}`
            );
        }

        const members = await response.json();

        const qualifiedMembers = members.filter(
            (member) =>
                member.membership === 2 ||
                member.membership === 3
        );

        const numberToDisplay = Math.min(
            3,
            qualifiedMembers.length
        );

        const randomMembers = shuffleMembers(
            qualifiedMembers
        ).slice(0, numberToDisplay);

        displaySpotlights(randomMembers);
    } catch (error) {
        spotlightsContainer.innerHTML =
            "<p>Unable to load chamber member spotlights.</p>";

        console.error("Spotlight error:", error);
    }
}

function shuffleMembers(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function displaySpotlights(members) {
    spotlightsContainer.innerHTML = "";

    if (members.length === 0) {
        spotlightsContainer.innerHTML =
            "<p>No qualified member spotlights are available.</p>";
        return;
    }

    members.forEach((member) => {
        const card = document.createElement("article");
        card.classList.add("spotlight-card");

        const heading = document.createElement("h3");
        heading.textContent = member.name;

        const image = document.createElement("img");
        image.src = member.image;
        image.alt = `${member.name} business`;
        image.loading = "lazy";
        image.width = 150;
        image.height = 100;

        const address = createInformationParagraph(
            "Address:",
            member.address
        );

        const phone = createInformationParagraph(
            "Phone:",
            member.phone
        );

        const membership = createInformationParagraph(
            "Membership:",
            membershipLevel(member.membership)
        );

        const website = document.createElement("a");
        website.href = member.website;
        website.target = "_blank";
        website.rel = "noopener";
        website.textContent = "Visit Website";

        card.appendChild(heading);
        card.appendChild(image);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(membership);
        card.appendChild(website);

        spotlightsContainer.appendChild(card);
    });
}

function createInformationParagraph(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label} `;
    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(value));

    return paragraph;
}

function membershipLevel(level) {
    if (level === 3) {
        return "Gold";
    }

    if (level === 2) {
        return "Silver";
    }

    return "Member";
}

// ===============================
// Initialize Page
// ===============================

getWeather();
getSpotlights();