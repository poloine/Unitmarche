/**
 * J'AI LE DROIT DU 3ÈME FICHIER
 */

/**
 * Load cart from localStorage, or creates new cart
 * @returns {{key: String, value: Number}|any}
 */
export function loadCart() {
    let existing_cart = JSON.parse(localStorage.getItem('cart'));
    if (existing_cart) {
        return existing_cart;
    }
    return {};
}

/**
 * Load a list of product from the path given. If no file is found, return an empty list.
 * @param path {String} The path of the file to load.
 * @returns {Promise<Array>} Promise of the file loading
 */
export function loadProductsFile(path) {
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