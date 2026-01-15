const el =  require('./HomeElements').homeElements

class HomePage {
    validateMessagemWelcome() {
        // Prefer text-based assertion so small DOM changes don't break the test
        cy.contains('Profile').should('be.visible')
    }
}

export default new HomePage()