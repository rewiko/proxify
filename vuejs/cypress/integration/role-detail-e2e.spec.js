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

describe('Roles Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {
    it(`should be able to create, update and delete role - viewport ${size}`, function () {
      defineViewPort(size)

      var uuid_name = uuidv1();
      cy.visit('/admin/role')
      // stub server
      cy.server()
      var idGenerated = 29;
      var payload = {
        "meta": { "count": 1 }, "data": {
          "active": true, "id": idGenerated,
          "name": "cy-mock" + uuid_name, "description": "cy-mock" + uuid_name, "updatedAt": "2019-01-20T10:33:02.642Z", "createdAt": "2019-01-20T10:33:02.642Z"
        }
      }
      var payloadPut = {
        "meta": { "count": 1 }, "data": {
          "active": true, "id": idGenerated,
          "name": "cy-mock-update" + uuid_name, "description": "cy-mock" + uuid_name, "updatedAt": "2019-01-20T10:33:02.642Z", "createdAt": "2019-01-20T10:33:02.642Z"
        }
      }
      cy.route({
        method: 'POST',
        url: '/admin/role/',
        status: 200,
        response: payload
      }).as('Post')
      cy.route({
        method: 'PUT',
        url: '/admin/role/' + idGenerated,
        status: 200,
        response: payloadPut
      }).as('Put')
      cy.route({
        method: 'GET',
        url: '/admin/role/' + idGenerated,
        status: 200,
        response: payload
      }).as('Get')
      cy.route({
        method: 'DELETE',
        url: '/admin/role/' + idGenerated,
        status: 200,
      }).as('Delete')

      cy.wait(1000)

      cy.get('[data-cy="nameField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="descriptionField"]').type("cy-mock" + uuid_name)
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
      cy.url().should('include', '/admin/role/' + idGenerated)

      cy.wait(1000)

      cy.wait('@Get').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      cy.get('[data-cy="nameField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
      });
      cy.get('[data-cy="descriptionField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
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
      cy.url().should('include', '/admin/roles/')

    })

  })
})
