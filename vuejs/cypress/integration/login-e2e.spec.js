const sizes = ['macbook-15', 'ipad-mini', 'iphone-5']
describe('The Login Page', function () {
  beforeEach(function () {
  })

  sizes.forEach((size) => {
    it(`should be able to login - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      // destructuring assignment of the this.currentUser object
      const username = "admin";
      const password = "admin";

      cy.visit('/login')
      cy.get('[data-cy="registerLink"]').should('be.visible')
      // stub server
      cy.server()
      cy.route('POST', '/admin/auth/login',
        {
          "id": 1,
          "username": "admin",
          "email": "admin@localhost.com",
          "firstName": "Admin",
          "lastName": "Administrator",
          "lang": "en",
          "admin": true,
          "disabled": false,
          "gravatar": "e6d67fed862c439aa6e911ce49c7857d",
          "createdAt": "2018-10-27T01:59:31.197Z",
          "updatedAt": "2018-10-27T01:59:31.197Z",
          "groups": [
          ],
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AbG9jYWxob3N0LmNvbSIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJBZG1pbmlzdHJhdG9yIiwibGFuZyI6ImVuIiwiYWRtaW4iOnRydWUsImRpc2FibGVkIjpmYWxzZSwiZ3JhdmF0YXIiOiJlNmQ2N2ZlZDg2MmM0MzlhYTZlOTExY2U0OWM3ODU3ZCIsImNyZWF0ZWRBdCI6IjIwMTgtMTAtMjdUMDE6NTk6MzEuMTk3WiIsInVwZGF0ZWRBdCI6IjIwMTgtMTAtMjdUMDE6NTk6MzEuMTk3WiIsImdyb3VwcyI6W10sImlhdCI6MTU0MDYxMDU1MX0.oc6y450cpg_XZ9MR2poMHMMhHF2BFGYqNEkjxdRKAOI"
        }
      ).as('Login')

      cy.get('input[name=username]').type(username)

      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`)

      cy.wait('@Login').then(function (xhr) {
      }).its('status').should('equal', 200);

      // wait for right panel to collapse
      cy.wait(100)
      // we should be redirected to /
      cy.url().should('include', '/')
      // our auth cookie should be present
      cy.getCookie('Authorization').should('exist')

      cy.get('[data-cy="errorLogin"]').should('not.be.visible')
      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      if (size.indexOf("iphone") !== -1 || size.indexOf("ipad") !== -1) {
        // mobile and tablet
        cy.get('[data-cy="sidebar"]').should('not.be.visible')
      } else {
        cy.get('[data-cy="sidebar"]').should('be.visible')
      }

      cy.get('[data-cy="user.gravatar"]').click()
      cy.get('[data-cy="logout"]').should('be.visible').click()
      // cy.wait(100)
      cy.getCookie('Authorization').should('not.exist')
      cy.url().should('include', '/login')

    })

    it(`shouldnt be able to login - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      // destructuring assignment of the this.currentUser object
      const username = "admina";
      const password = "admina";

      cy.visit('/login')
      cy.get('[data-cy="registerLink"]').should('be.visible')
      // stub server
      cy.server()
      cy.route({
        method: 'POST',
        url: '/admin/auth/login',
        status: 401,
        response: {
          "error": { "message": "Login admina not found." }
        }
      }).as('Login')

      cy.get('input[name=username]').type(username)

      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`)

      cy.wait('@Login').then(function (xhr) {
      }).its('status').should('equal', 401);

      // wait for right panel to collapse
      cy.wait(100)
      // we should stay on /login
      cy.url().should('include', '/login')
      // our auth cookie shouldnt be present
      cy.getCookie('Authorization').should('not.exist')

      cy.get('[data-cy="errorLogin"]').should('be.visible')
      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      cy.get('[data-cy="sidebar"]').should('not.be.visible')
    })
  })
})
