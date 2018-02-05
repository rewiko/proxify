const sizes = ['macbook-15', 'ipad-mini', 'iphone-5']
describe('The Register Page', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
  })

  sizes.forEach((size) => {

    it(`should be able to register - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      const username = "useruser";
      const email = "useruser@email.com";
      const password = "useruser";

      cy.visit('/register')
      cy.get('[data-cy="loginLink"]').should('be.visible')
      // stub server
      cy.server()
      cy.route('POST', '/admin/auth/signup',
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
      ).as('SignUp')

      cy.get('[data-cy="userField"]').type(username)
      cy.get('[data-cy="emailField"]').type(email)

      // {enter} causes the form to submit
      cy.get('[data-cy="passwordField"]').type(password)
      cy.get('[data-cy="repasswordField"]').type(`${password}{enter}`)

      cy.wait('@SignUp').then(function (xhr) {
      }).its('status').should('equal', 200);

      // wait for right panel to collapse
      cy.wait(100)
      // we should be redirected to /
      cy.url().should('include', '/')
      // our auth cookie should be present
      cy.getCookie('Authorization').should('exist')

      cy.get('[data-cy="errorLogin"]').should('not.be.visible')
      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      cy.get('[data-cy="sidebar"]').should('not.be.visible')
    })

    it(`shouldnt be able to register - viewport ${size}`, function () {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      const username = "useruser";
      const email = "useruser@email.com";
      const password = "user";

      cy.visit('/register')
      cy.get('[data-cy="loginLink"]').should('be.visible')
      // stub server
      cy.server()
      cy.route({
        method: 'POST',
        url: '/admin/auth/signup',
        status: 401,
        response: {
          "error": "Login admina not found."
        }
      }).as('SignUp')

      cy.get('[data-cy="userField"]').type(username)
      cy.get('[data-cy="emailField"]').type(email)

      // {enter} causes the form to submit
      cy.get('[data-cy="passwordField"]').type(password)
      cy.get('[data-cy="repasswordField"]').type(`${password}{enter}`)

      cy.wait('@SignUp').then(function (xhr) {
      }).its('status').should('equal', 401);

      // wait for right panel to collapse
      cy.wait(100)
      // we should stay on /register
      cy.url().should('include', '/register')
      // our auth cookie shouldnt be present
      cy.getCookie('Authorization').should('not.exist')

      cy.get('[data-cy="errorRegistration"]').should('be.visible')
      cy.get('[data-cy="aside-menu"]').should('not.be.visible')
      cy.get('[data-cy="sidebar"]').should('not.be.visible')
    })
  })
})
