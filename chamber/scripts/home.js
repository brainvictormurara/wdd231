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

    menuButton.setAttribute("aria-expanded", isOpen);
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

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather information could not be loaded.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {

        currentTemp.textContent = "Unavailable";
        weatherDescription.textContent = "Weather information unavailable";

        forecastContainer.innerHTML =
            "<p>The weather forecast could not be loaded.</p>";

        weatherIcon.hidden = true;

        console.error(error);
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

    weatherIcon.alt = description;
    weatherIcon.hidden = false;
}

function displayForecast(data) {

    forecastContainer.innerHTML = "";

    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecasts.slice(0, 3).forEach(day => {

        const date = new Date(day.dt_txt);

        const forecastCard = document.createElement("article");
        forecastCard.classList.add("forecast-day");

        forecastCard.innerHTML = `
            <h4>${date.toLocaleDateString("en-US", {
                weekday: "long"
            })}</h4>

            <p><strong>${Math.round(day.main.temp)}°C</strong></p>

            <p>${capitalizeWords(day.weather[0].description)}</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}

function capitalizeWords(text) {
    return text.replace(/\b\w/g, letter => letter.toUpperCase());
}

// ===============================
// Chamber Spotlights
// ===============================

async function getSpotlights() {

    try {

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member information.");
        }

        const members = await response.json();

        const qualifiedMembers = members.filter(member =>
            member.membership === 2 || member.membership === 3
        );

        const randomMembers = shuffleMembers(qualifiedMembers).slice(0, 3);

        displaySpotlights(randomMembers);

    } catch (error) {

        spotlightsContainer.innerHTML =
            "<p>Unable to load chamber spotlights.</p>";

        console.error(error);
    }
}

function shuffleMembers(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function displaySpotlights(members) {

    spotlightsContainer.innerHTML = "";

    members.forEach(member => {

        const card = document.createElement("section");
        card.classList.add("spotlight-card");

        card.innerHTML = `
            <h3>${member.name}</h3>

            <img
                src="${member.image}"
                alt="${member.name}"
                loading="lazy"
                width="150"
                height="100"
            >

            <p><strong>Address:</strong> ${member.address}</p>

            <p><strong>Phone:</strong> ${member.phone}</p>

            <p><strong>Membership:</strong> ${membershipLevel(member.membership)}</p>

            <a
                href="${member.website}"
                target="_blank"
                rel="noopener"
            >
                Visit Website
            </a>
        `;

        spotlightsContainer.appendChild(card);
    });
}

function membershipLevel(level) {

    if (level === 3) return "Gold";
    if (level === 2) return "Silver";

    return "Member";
}

// ===============================
// Initialize Page
// ===============================

getWeather();
getSpotlights();