describe('Navigation vers la liste de courses', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.visit('/liste.html');
    });

    it('Vérifier que les produits ajoutés s’affichent dans le tableau #liste-course-body', () => {
        cy.get('#liste-course-body').children().should('have.length.greaterThan', 0);
    });

    it('Vérifier que le total général s’affiche dans #total-general', () => {
        cy.get('#total-general').should('be.visible');
        cy.get('#total-general').invoke('text').should('match', /Total général : \d+.\d{2} €$/);
    });
});

describe('Modification de la quantité', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.visit('/liste.html');
    });

    it('Vérifier que la quantité est modifiée', () => {
        cy.get('input[type="number"]').first().clear().type('2');
        cy.get('input[type="number"]').first().should('have.value', '2');
    });

    it('Vérifier que le sous-total et le total général sont mis à jour', () => {
        cy.get('input[type="number"]').first().clear().type('2');
        cy.get('body').click();
        cy.get('#sous-total').first().invoke('text').should('match', /\d+.\d{2} €$/);
        cy.get('#total-general').invoke('text').should('match', /Total général : \d+.\d+ €$/);
    });
});

describe('Suppression d’un produit', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.visit('/liste.html');
    });

    it('Vérifier que la ligne est supprimée', () => {
        cy.get('.delete-product-btn').first().click();
        cy.get('#liste-course-body').children().should('have.length', 0);
    });

    it('Vérifier que le localStorage est mis à jour', () => {
        cy.get('.delete-product-btn').first().click();
        cy.window().then((win) => {
            const cart = JSON.parse(win.localStorage.getItem('cart'));
            expect(cart).to.be.empty;
        });
    });
});

describe('Vider la liste', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/index.html');
        cy.get('#recherche').type('Ail');
        cy.get('.card-action').first().click();
        cy.visit('/liste.html');
    });

    it('Simuler la confirmation', () => {
        cy.get('#vider-liste').click();
        cy.on('window:confirm', () => true);
    });

    it('Vérifier que toutes les lignes sont supprimées', () => {
        cy.get('#vider-liste').click();
        cy.on('window:confirm', () => true);
        cy.get('#liste-course-body').children().should('have.length', 0);
    });

    it('Vérifier que total-general revient à zéro', () => {
        cy.get('#vider-liste').click();
        cy.on('window:confirm', () => true);
        cy.get('#total-general').invoke('text').should('match', /Total général : 0 €$/);
    });
});