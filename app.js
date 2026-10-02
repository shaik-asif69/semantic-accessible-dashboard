import { getProducts } from "./api.js";


// ========================================
// APPLICATION STATE
// ========================================

let products = [];

let filteredProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ========================================
// GET HTML ELEMENTS
// ========================================

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const categoryContainer = document.getElementById("categoryContainer");

const sortSelect = document.getElementById("sortSelect");

const loadingMessage = document.getElementById("loadingMessage");

const errorMessage = document.getElementById("errorMessage");

const cartCount = document.getElementById("cartCount");


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    showLoading();

    hideError();

    try {

        products = await getProducts();

        filteredProducts = [...products];

        createCategoryButtons();

        displayProducts();

        updateCartCount();

    } catch (error) {

        showError(
            "Sorry, we could not load the products. Please try again."
        );

    } finally {

        hideLoading();

    }
}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts() {

    productContainer.innerHTML = "";

    if (filteredProducts.length === 0) {

        productContainer.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }


    filteredProducts.forEach(function(product) {

        const article = document.createElement("article");

        article.className = "card";


        article.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.title}"
                width="150"
            >

            <h3>${product.title}</h3>

            <p>Category: ${product.category}</p>

            <p>
                Price:
                $${product.price.toFixed(2)}
            </p>

            <button
                type="button"
                class="add-cart-button"
                data-id="${product.id}"
            >
                Add to Cart
            </button>
        `;


        productContainer.appendChild(article);

    });


    addCartButtonEvents();
}


// ========================================
// CATEGORY BUTTONS
// ========================================

function createCategoryButtons() {

    categoryContainer.innerHTML = "";


    const allButton = document.createElement("button");

    allButton.type = "button";

    allButton.textContent = "All";

    allButton.addEventListener("click", function() {

        filteredProducts = [...products];

        applyCurrentSearch();

    });


    categoryContainer.appendChild(allButton);


    const categories = [
        ...new Set(
            products.map(function(product) {
                return product.category;
            })
        )
    ];


    categories.forEach(function(category) {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = category;


        button.addEventListener("click", function() {

            filteredProducts = products.filter(
                function(product) {
                    return product.category === category;
                }
            );

            applyCurrentSearch();

        });


        categoryContainer.appendChild(button);

    });

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function() {

    applyCurrentSearch();

});


function applyCurrentSearch() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    if (searchText === "") {

        displayProducts();

        return;
    }


    const searchResults = filteredProducts.filter(
        function(product) {

            return product.title
                .toLowerCase()
                .includes(searchText);

        }
    );


    const oldProducts = filteredProducts;

    filteredProducts = searchResults;

    displayProducts();

    filteredProducts = oldProducts;

}


// ========================================
// SORTING
// ========================================

sortSelect.addEventListener("change", function() {

    const sortValue = sortSelect.value;


    if (sortValue === "low") {

        filteredProducts.sort(
            function(a, b) {
                return a.price - b.price;
            }
        );

    }


    if (sortValue === "high") {

        filteredProducts.sort(
            function(a, b) {
                return b.price - a.price;
            }
        );

    }


    if (sortValue === "name") {

        filteredProducts.sort(
            function(a, b) {
                return a.title.localeCompare(b.title);
            }
        );

    }


    displayProducts();

});


// ========================================
// CART
// ========================================

function addCartButtonEvents() {

    const buttons =
        document.querySelectorAll(".add-cart-button");


    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            const productId =
                Number(button.dataset.id);


            const product =
                products.find(
                    function(item) {
                        return item.id === productId;
                    }
                );


            if (product) {

                cart.push(product);

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );

                updateCartCount();

            }

        });

    });

}


// ========================================
// CART COUNT
// ========================================

function updateCartCount() {

    cartCount.textContent = cart.length;

}


// ========================================
// LOADING
// ========================================

function showLoading() {

    loadingMessage.hidden = false;

}


function hideLoading() {

    loadingMessage.hidden = true;

}


// ========================================
// ERROR
// ========================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.hidden = false;

}


function hideError() {

    errorMessage.hidden = true;

}


// ========================================
// START APPLICATION
// ========================================

loadProducts();