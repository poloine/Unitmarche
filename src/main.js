let cart = {};
let product_list = []
let displayed_product_list = []


/**
 * @typedef Product
 * @property {String} nom
 * @property {Number} quantite_stock
 * @property {Number} prix_unitaire
 */

/**
 * Load cart from localStorage, or creates new cart
 */
function loadCart() {
    let existing_cart = JSON.parse(localStorage.getItem('cart'));
    if (existing_cart) {
        cart = existing_cart;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Load a list of product from the path given. If no file is found, return an empty list.
 * @param path {String} The path of the file to load.
 * @returns {Promise<Array>} Promise of the file loading
 */
function loadProductsFile(path) {
    return fetch(path)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to load products file.');
            }
            return res.json();
        }).catch(err => {
        console.error(err);
        return [];
    })
}

/**
 * Adds an entry in the cart for the product, then add it to the cart in localStorage
 * @param productName {String}
 */
function addToCart(productName) {
    if (!productName || !productName in product_list) {
        return;
    }

    if (!cart[productName]) {
        cart[productName] = 0;
    }

    cart[productName]++;
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(JSON.parse(localStorage.getItem("cart")));
}

/**
 * Create a product card HTML element for the product in parameter
 * @param product {Product} A product
 * @returns {HTMLLIElement|null}
 */
function createProductCard(product) {
    if (!product) {
        return null;
    }
    const card = document.createElement('li')
    card.classList.add('product-card')

    card.innerHTML = `
    <h2 class="card-title">${product.nom}</h2>
    <p class="card-quantity"><b>Quantité en stock : </b>${product.quantite_stock}</p>
    <p class="card-price"><b>Prix unitaire : </b>${product.prix_unitaire} €</p>
    <button class="card-action">Ajouter à la liste</button>
    `

    const button = card.querySelector('.card-action');
    button.addEventListener('click', function() {
        addToCart(product.nom);
    });

    return card;
}

/**
 * Display a list of product into an HTML element with id "liste-produits"
 * @param products {Array<Product>}An array of product
 */
function displayProducts(products) {
    let list = document.getElementById("liste-produits");
    let count = document.getElementById("compteur-produits");

    if (!list) return;

    while (list.lastElementChild) {
        list.removeChild(list.firstChild);
    }

    for (const product of products) {
        list.append(createProductCard(product));
    }

    count.textContent = `${products.length} produits`;
}

/**
 * Sort product list and re-display them by select with id "tri"
 */
function sortProducts() {
    let sortValue = document.getElementById("tri").value;

    if (!sortValue in ["nom", "prix"]) {
        return;
    }
    if (sortValue === "prix") {
        displayed_product_list.sort((p1, p2) => p1.prix_unitaire - p2.prix_unitaire);
    }
    if (sortValue === "nom") {
        displayed_product_list.sort((p1, p2) => p1.nom.localeCompare(p2.nom));
    }

    displayProducts(displayed_product_list);
}

/**
 * Load products in HTML
 */
function loadProducts() {
    loadProductsFile("public/liste_produits_quotidien.json").then((res) => {
        product_list = res;
        displayed_product_list = res;

        displayProducts(displayed_product_list);
    });
}

/**
 * Reset filters (and reload product list)
 */
function resetFilter() {
    document.getElementById("tri").value = "";
    document.getElementById("recherche").value = "";

    displayed_product_list = product_list;

    displayProducts(displayed_product_list);
}

/**
 * Apply search parameter on input with id "recherche" to product list
 */
function searchProducts() {
    let searchValue = document.getElementById("recherche").value;

    displayed_product_list = displayed_product_list.filter((p) => p.nom.includes(searchValue))

    displayProducts(displayed_product_list);
}

loadCart();

document.getElementById("recherche").addEventListener("input", searchProducts);
document.getElementById("tri").addEventListener("change", sortProducts);
document.getElementById("#reset-filtres").addEventListener("click", resetFilter);

resetFilter();
loadProducts();


