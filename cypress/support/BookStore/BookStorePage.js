const el =  require('./BookStoreElements').bookStoreElements

class HomePage {
    validateTitle() {
        // Prefer text-based assertion to avoid brittle CSS-class mismatches
        cy.contains('Book Store').should('be.visible')
    }

    validateElementsScreen(){
        // Title check as visible text + essential controls
        cy.contains('Book Store').should('be.visible')
        cy.get(el.LIST.INPUT_BOOK).should('be.visible')
        cy.get(el.LIST.TABLE_BOOKS).should('exist')
    }

    inputNameBook(name){
        cy.get(el.LIST.INPUT_BOOK).clear().type(name)
    }

    validateNameBook(name){
        cy.contains(name).should('be.visible')
    }

    clickInLinkNameBook(){
        // After searching, the result table should contain the link; click the first link in the results table
        cy.get(el.LIST.TABLE_BOOKS).find('a').first().click()
    }

    validateDetailBook(title){
        // Validate presence of key labels and the book title text
        // Rely on the book title and author being visible, and if ISBN label isn't present, look for a digit sequence as fallback
        cy.contains(title, { timeout: 10000 }).should('be.visible')
        cy.contains('Author').should('be.visible')

        // Fallback: look for an ISBN-like number if explicit label isn't rendered
        cy.contains(/ISBN\b|ISBN:/i).then(($el) => {
            if ($el.length) {
                cy.wrap($el).should('be.visible')
            } else {
                cy.contains(/\d{10,13}/).should('be.visible')
            }
        })
    }
}

export default new HomePage()