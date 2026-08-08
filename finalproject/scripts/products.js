const productContainer =
    document.querySelector("#product-container");

const categoryFilter =
    document.querySelector("#category-filter");

const productCount =
    document.querySelector("#product-count");

const productDialog =
    document.querySelector("#product-dialog");

const closeDialogButton =
    document.querySelector("#close-dialog");

let products = [];

async function getProducts() {
    try {
        const response = await fetch("data/products.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load products: ${response.status}`
            );
        }

        products = await response.json();

        setInitialFilter();

    } catch (error) {
        console.error("Product loading error:", error);

        productContainer.innerHTML = `
            <p class="error-message">
                Product information is currently unavailable.
                Please try again later.
            </p>
        `;
    }
}

function setInitialFilter() {
    const parameters =
        new URLSearchParams(window.location.search);

    const urlCategory =
        parameters.get("category");

    const savedCategory =
        localStorage.getItem("chospexProductFilter");

    let selectedCategory = "all";

    if (
        urlCategory === "industrial" ||
        urlCategory === "laboratory"
    ) {
        selectedCategory = urlCategory;
    } else if (savedCategory) {
        selectedCategory = savedCategory;
    }

    categoryFilter.value = selectedCategory;

    displayFilteredProducts(selectedCategory);
}

function displayFilteredProducts(category) {
    const filteredProducts =
        category === "all"
            ? products
            : products.filter(
                (product) => product.category === category
            );

    displayProducts(filteredProducts);

    productCount.textContent =
        `${filteredProducts.length} products displayed`;
}

function displayProducts(productList) {
    productContainer.innerHTML = "";

    productList.forEach((product) => {
        const card = document.createElement("article");

        card.classList.add("product-card");

        const categoryName =
            product.category === "industrial"
                ? "Industrial Chemical"
                : "Laboratory Reagent";

        card.innerHTML = `
            <p class="product-category">
                ${categoryName}
            </p>

            <h2>${product.name}</h2>

            <p>
                <strong>Grade:</strong>
                ${product.grade}
            </p>

            <p>
                <strong>Packaging:</strong>
                ${product.packaging}
            </p>

            <p>
                ${product.description}
            </p>

            <button
                type="button"
                class="details-button"
                data-id="${product.id}">
                View Details
            </button>
        `;

        productContainer.appendChild(card);
    });

    const detailButtons =
        document.querySelectorAll(".details-button");

    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId =
                Number(button.dataset.id);

            openProductDialog(productId);
        });
    });
}

function openProductDialog(productId) {
    const selectedProduct =
        products.find(
            (product) => product.id === productId
        );

    if (!selectedProduct) {
        return;
    }

    const categoryName =
        selectedProduct.category === "industrial"
            ? "Industrial Chemical"
            : "Laboratory Reagent";

    document.querySelector("#dialog-name").textContent =
        selectedProduct.name;

    document.querySelector("#dialog-category").textContent =
        categoryName;

    document.querySelector("#dialog-grade").textContent =
        selectedProduct.grade;

    document.querySelector("#dialog-packaging").textContent =
        selectedProduct.packaging;

    document.querySelector("#dialog-description").textContent =
        selectedProduct.description;

    productDialog.showModal();
}

categoryFilter.addEventListener("change", () => {
    const selectedCategory =
        categoryFilter.value;

    localStorage.setItem(
        "chospexProductFilter",
        selectedCategory
    );

    displayFilteredProducts(selectedCategory);
});

closeDialogButton.addEventListener("click", () => {
    productDialog.close();
});

productDialog.addEventListener("click", (event) => {
    if (event.target === productDialog) {
        productDialog.close();
    }
});

getProducts();