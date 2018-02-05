const sizes = ['macbook-15', 'ipad-mini', 'iphone-5']
describe('The Profile Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {


    it(`should be able to update his profile - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      // destructuring assignment of the this.currentUser object
      const username = "admin";
      const password = "admin";

      cy.visit('/profile')
      // stub server
      cy.server()
      cy.route('PUT', '/admin/user/me',
        {
          "id": 1,
        }
      ).as('Profile')

      cy.get('[data-cy="userField"]').type(username)

      // {enter} causes the form to submit
      cy.get('[data-cy="passwordField"]').type(`${password}`)
      cy.get('[data-cy="repasswordField"]').type(`${password}{enter}`)

      cy.wait('@Profile').then(function (xhr) {
      }).its('status').should('equal', 200);

      cy.get('[data-cy="errorUpdate"]').should('not.be.visible')
      cy.get('[data-cy="successUpdate"]').should('be.visible')

      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      if (size.indexOf("iphone") !== -1 || size.indexOf("ipad") !== -1) {
        // mobile and tablet
        cy.get('[data-cy="sidebar"]').should('not.be.visible')
      } else {
        cy.get('[data-cy="sidebar"]').should('be.visible')
      }

    })

    it(`shouldnt be able to update his profile - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      // destructuring assignment of the this.currentUser object
      const username = "admin";
      const password = "admin";
      const repassword = "adminre";

      cy.visit('/profile')

      cy.get('[data-cy="userField"]').type(username)

      // {enter} causes the form to submit
      cy.get('[data-cy="passwordField"]').type(`${password}`)
      cy.get('[data-cy="repasswordField"]').type(`${repassword}{enter}`)

      cy.get('[data-cy="errorUpdate"]').should('be.visible')
      cy.get('[data-cy="successUpdate"]').should('not.be.visible')

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
