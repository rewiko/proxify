const uuidv1 = require('uuid/v1');
const sizes = ['macbook-15', 'ipad-mini', 'iphone-5']
var testSidebar = function (size) {
  cy.get('[data-cy="aside-menu"]').should('not.be.visible')
  if (size.indexOf("iphone") !== -1 || size.indexOf("ipad") !== -1) {
    // mobile and tablet
    cy.get('[data-cy="sidebar"]').should('not.be.visible')
  } else {
    cy.get('[data-cy="sidebar"]').should('be.visible')
  }
}

var defineViewPort = function (size) {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1])
  } else {
    cy.viewport(size)
  }
}

describe('Users Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {
    it(`should be able to create, update and delete user - viewport ${size}`, function () {
      defineViewPort(size)

      var uuid_name = uuidv1();
      cy.visit('/admin/user')
      // stub server
      cy.server()
      var idGenerated = 29;
      var payload = {
        "meta": { "count": 1 }, "data": {
          "id": idGenerated,
          "username": "cy-mock" + uuid_name,
          "email": "cy-mock" + uuid_name + "@test.com",
          "firstName": "",
          "lastName": "",
          "lang": "en",
          "admin": false,
          "disabled": false,
          "gravatar": "735e8111b5c0fd9284b42075ef33b193", "createdAt": "2019-01-20T17:33:04.805Z", "updatedAt": "2019-01-20T17:33:04.805Z", "groups": [{ "id": 12, "name": "Group-Mockj", "description": null, "active": true, "createdAt": "2019-01-20T15:39:18.163Z", "updatedAt": "2019-01-20T15:39:18.163Z", "userGroup": { "createdAt": "2019-01-20T17:33:04.932Z", "updatedAt": "2019-01-20T17:33:04.932Z", "groupId": 12, "userId": 3 } }]
        }
      }
      var payloadPut = {
        "meta": { "count": 1 }, "data": {
          "id": idGenerated,
          "username": "cy-mock-update" + uuid_name,
          "email": "cy-mock" + uuid_name + "@test.com",
          "firstName": "",
          "lastName": "",
          "lang": "en",
          "admin": false,
          "disabled": false,
          "gravatar": "735e8111b5c0fd9284b42075ef33b193", "createdAt": "2019-01-20T17:33:04.805Z", "updatedAt": "2019-01-20T17:33:04.805Z", "groups": [{ "id": 12, "name": "Group-Mockj", "description": null, "active": true, "createdAt": "2019-01-20T15:39:18.163Z", "updatedAt": "2019-01-20T15:39:18.163Z", "userGroup": { "createdAt": "2019-01-20T17:33:04.932Z", "updatedAt": "2019-01-20T17:33:04.932Z", "groupId": 12, "userId": 3 } }]
        }
      }

      cy.route({
        method: 'POST',
        url: '/admin/user/',
        status: 200,
        response: payload
      }).as('Post')
      cy.route({
        method: 'PUT',
        url: '/admin/user/' + idGenerated,
        status: 200,
        response: payloadPut
      }).as('Put')
      cy.route({
        method: 'GET',
        url: '/admin/user/' + idGenerated,
        status: 200,
        response: payload
      }).as('Get')
      cy.route({
        method: 'DELETE',
        url: '/admin/user/' + idGenerated,
        status: 200,
      }).as('Delete')

      cy.wait(1000)

      cy.get('[data-cy="nameField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="emailField"]').type("cy-mock" + uuid_name + "@test.com")
      cy.get('[data-cy="passwordField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="rePasswordField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="addLink"]').click()
      cy.wait(1000)
      cy.get('[data-cy="tableLink"] table tr + tr > td:last-child button').first().click()
      cy.wait(1000)
      cy.get('[data-cy="associationLink"] table > tbody').children().should('have.length.to.be.greaterThan', 0)

      cy.get('[data-cy="submitForm"]').click()

      cy.wait('@Post').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
      cy.url().should('include', '/admin/user/' + idGenerated)

      cy.wait(1000)

      cy.wait('@Get').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      cy.get('[data-cy="nameField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
      });
      cy.get('[data-cy="emailField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name + "@test.com")
      });

      cy.get('[data-cy="nameField"]').type("cy-mock-update" + uuid_name)
      cy.get('[data-cy="submitForm"]').click()
      cy.wait('@Put').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);

      cy.get('[data-cy="deleteForm"]').click()
      cy.wait(1000)
      cy.get('[data-cy="deleteModal"] footer button:last-child').click()
      cy.wait('@Delete').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      cy.url().should('include', '/admin/users/')

    })

  })
})
