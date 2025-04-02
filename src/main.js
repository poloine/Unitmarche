

/**
 * Load a list of product from the path given. If no file is found, return an empty list.
 * @param path The path of the file to load.
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
 * Create a product card HTML element for the product in parameter
 * @param product A product
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

    return card;
}

/**
 * Display a list of product into a HTML element with id "product-list"
 * @param products An array of product
 */
function displayProducts(products) {
    let list = document.getElementById("product-list");

    if (!list) return;

    for (const product of products) {
        list.append(createProductCard(product));
    }
}

loadProductsFile("public/liste_produits_quotidien.json").then((res) => displayProducts(res));

