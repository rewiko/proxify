const sizes = ['macbook-15', 'ipad-mini', 'iphone-5']

describe('The Dashboard Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {

    it(`should have a Authorization cookie and firstname visible ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.visit('/')
      // our auth cookie should be present
      cy.getCookie('Authorization').should('exist')
      // UI should reflect this user being logged in
      cy.get('[data-cy="user.firstName"]').should('contain', 'Admin')

      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      if (size.indexOf("iphone") !== -1 || size.indexOf("ipad") !== -1) {
        // mobile and tablet
        cy.get('[data-cy="sidebar"]').should('not.be.visible')
      } else {
        cy.get('[data-cy="sidebar"]').should('be.visible')
      }
    })
  })
})

