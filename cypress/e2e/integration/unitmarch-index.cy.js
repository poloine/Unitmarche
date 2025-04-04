describe('Affichage initial', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
    });

    it('Les produits sont affichés dans #liste-produits', () => {
        cy.get('#liste-produits').should('be.visible');
        cy.get('#liste-produits').children().should('have.length.greaterThan', 0);
    });

    it('Le nombre de produits doit être le bon dans #compteur-produits', () => {
        cy.get('#compteur-produits').should('be.visible');
        cy.get('#compteur-produits').invoke('text').then((text) => {
            const productCount = parseInt(text, 10);
            cy.get('#liste-produits').children().should('have.length', productCount);
        });
    });
});

describe('Recherche de produit', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
    });

    it('Écriture dans la zone de recherche', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#liste-produits').children().should('have.length', 1);
        cy.get('#liste-produits').children().first().should('contain.text', 'Ail');
    });
});

describe('Tri de produit', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
    });

    it('Tri ordre alphabétique', () => {
        cy.get("#tri").select("nom")
        cy.get('#liste-produits').children().then((products) => {
            const productNames = [...products].map(product => product.querySelector('.card-title').innerText);
            const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
            expect(productNames).to.deep.equal(sortedNames);
        });
    });

    it('Tri par prix', () => {
        cy.get('#tri').select('prix');
        cy.get('#liste-produits').children().then((products) => {
            const productPrices = [...products].map(product => parseFloat(product.querySelector('.card-price').innerText.replace('€', '').trim()));
            const sortedPrices = [...productPrices].sort((a, b) => a - b);
            expect(productPrices).to.deep.equal(sortedPrices);
        });
    });
});

describe('Réinitialisation des filtres', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
    });

    it('Vérifier que le champ #recherche est vidé', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#reset-filtres').click();
        cy.get('#recherche').should('have.value', '');
    });

    it('Vérifier que #tri revient à son état initial', () => {
        cy.get('#tri').select('nom');
        cy.get('#reset-filtres').click();
        cy.get('#tri').should('have.value', '');
    });

    it('Vérifier que tous les produits sont de nouveau affichés', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#reset-filtres').click();
        cy.get('#liste-produits').children().should('have.length.greaterThan', 0);
    });
});

describe('Ajout d’un produit à la liste', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
    });

    it('Vérifier que le produit est bien ajouté au localStorage (listeCourse)', () => {
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.window().then((win) => {
            const cart = JSON.parse(win.localStorage.getItem('cart'));
            expect(cart).to.have.property('Ail');
            expect(cart['Ail']).to.equal(1);
        });
    });

    it('Vérifier la structure des données ajoutées (nom, prix, quantite)', () => {
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.window().then((win) => {
            const cart = JSON.parse(win.localStorage.getItem('cart'));
            expect(cart).to.have.property('Ail');
            expect(cart['Ail']).to.be.a('number');
        });
    });
});