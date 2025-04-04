import {loadCart, loadProductsFile} from "./common.js";

/**
 * @typedef Product
 * @property {String} nom
 * @property {Number} quantite_stock
 * @property {Number} prix_unitaire
 */

/**
 * User's selection of products
 * @type {{key: String, value: Number}}
 */
let user_selection = {};

/**
 * The product list
 * @type {Product[]}
 */
let product_list = []

/**
 * User's cart (with real Products)
 * @type {Map<Product, Number>}
 */
let user_cart = new Map();

/**
 *
 * @param user_selection {{key: String, value: Number}}
 * @param product_list {Product[]}
 * @returns {Map<Product, Number>}
 */
function createUserCart(user_selection, product_list) {
    user_cart = new Map();
    if (!user_selection || !product_list) {
        return user_cart;
    }
    for (const productName in user_selection) {
        if (!productName in product_list.map(product => product.nom)) {
            continue;
        }

        let product = product_list.find(product => product.nom === productName);

        if (!product) {
            continue;
        }

        user_cart.set(product, user_selection[productName]);
    }

    return user_cart;
}

/**
 * Create a row of the product
 * @param product {Product} a product
 * @param quantity quantity of the product
 */
function createProductRow(product, quantity) {
    if (!product || !quantity) {
        return;
    }

    let row = document.createElement('tr');
    row.innerHTML = `
    <td>${product.nom}</td>
    <td>${product.prix_unitaire.toString().replace('.', ',')}</td>
    <td><input type="number" name="${product.nom.toLowerCase().replace(' ', '')}-input" value="${quantity}" min="1"/></td>
    <td>${(Math.round(quantity * product.prix_unitaire*100)/100).toString().replace('.', ',')} €</td>
    <td><button class="delete-product-btn">Supprimer</button></td>
    `

    const input = row.querySelector('input');
    input.addEventListener('change', function() {
        changeProductQuantity(product, input.value);
    })

    const button = row.querySelector('button');
    button.addEventListener('click', function() {
        changeProductQuantity(product, 0);
    })
    return row;
}

/**
 * Change a product's quantity in the user's cart. If quantity is 0 then delete.
 * @param product {Product} a product
 * @param quantity {Number} its new quantity
 */
function changeProductQuantity(product, quantity) {
    if (!product || quantity === null) {
        return;
    }
    if (quantity !== 0) {
        user_cart.set(product, quantity);
    } else {
        user_cart.delete(product);
    }
    displayUserCart(user_cart);
}

/**
 * Rebuild user_selection from user_cart and saves back into the localStorage
 * @param user_cart {Map<Product, Number>} the user's cart
 */
function saveBackUserCartToSelection(user_cart) {
    let new_user_selection = {};
    for (const [product, quantity] of user_cart) {
        new_user_selection[product.nom] = quantity;
    }
    user_selection = new_user_selection;
    localStorage.setItem("cart", JSON.stringify(new_user_selection));
}

/**
 * Display the list of user's product into an HTML table element with id "liste-course-body"
 * @param user_cart {Map<Product, Number>}
 */
function displayUserCart(user_cart) {
    let tableElement = document.getElementById("liste-course-body");

    let countElement = document.getElementById("total-general");

    if (!tableElement || !countElement) {
        return;
    }

    while (tableElement.lastElementChild) {
        tableElement.removeChild(tableElement.lastElementChild);
    }

    let count = 0;

    for (const [product, quantity] of user_cart) {
        tableElement.append(createProductRow(product, quantity));
        count += quantity * product.prix_unitaire;
    }

    countElement.innerText = `Total général : ${count} €`;

    saveBackUserCartToSelection(user_cart);
}

/**
 * Clear and user's cart
 */
function clearUserCart() {
    user_cart.clear();
    displayUserCart(user_cart);
}

loadProductsFile("public/liste_produits_quotidien.json")
    .then(res => {
        product_list = res;
        user_selection = loadCart();
        user_cart = createUserCart(user_selection, product_list);
        displayUserCart(user_cart);
    });

document.getElementById("vider-liste").addEventListener("click", clearUserCart);