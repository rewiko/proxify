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

describe('Projects Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {
    it(`should be able to create, update and delete project - viewport ${size}`, function () {
      defineViewPort(size)

      var uuid_name = uuidv1();
      cy.visit('/admin/project')
      // stub server
      cy.server()
      var idGenerated = 29;
      var payload = {
        "meta": { "count": 1 }, "data": {
          "active": true, "id": idGenerated,
          "name": "cy-mock" + uuid_name, "description": "cy-mock" + uuid_name, "url": "cy-mock" + uuid_name, "updatedAt": "2019-01-20T10:33:02.642Z", "createdAt": "2019-01-20T10:33:02.642Z"
        }
      }
      var payloadPut = {
        "meta": { "count": 1 }, "data": {
          "active": true, "id": idGenerated,
          "name": "cy-mock-update" + uuid_name, "description": "cy-mock" + uuid_name, "url": "cy-mock" + uuid_name, "updatedAt": "2019-01-20T10:33:02.642Z", "createdAt": "2019-01-20T10:33:02.642Z"
        }
      }
      cy.route({
        method: 'POST',
        url: '/proxy/application/',
        status: 200,
        response: payload
      }).as('Projects')
      cy.route({
        method: 'PUT',
        url: '/proxy/application/' + idGenerated,
        status: 200,
        response: payloadPut
      }).as('PutProjects')
      cy.route({
        method: 'GET',
        url: '/proxy/application/' + idGenerated,
        status: 200,
        response: payload
      }).as('GetProjects')
      cy.route({
        method: 'DELETE',
        url: '/proxy/application/' + idGenerated,
        status: 200,
      }).as('DeleteProjects')

      cy.wait(1000)

      cy.get('[data-cy="nameField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="descriptionField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="urlField"]').type("cy-mock" + uuid_name)
      cy.get('[data-cy="addLink"]').click()
      cy.wait(1000)
      cy.get('[data-cy="permissionTableLink"] table tr + tr > td:last-child button').first().click()
      cy.wait(1000)
      cy.get('[data-cy="permissionAssociation"] table > tbody').children().should('have.length.to.be.greaterThan', 0)

      cy.get('[data-cy="submitForm"]').click()

      cy.wait('@Projects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
      cy.url().should('include', '/admin/project/' + idGenerated)

      cy.wait(1000)

      cy.wait('@GetProjects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      cy.get('[data-cy="nameField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
      });
      cy.get('[data-cy="descriptionField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
      });
      cy.get('[data-cy="urlField"]').then((element) => {
        expect(element.val()).to.be.equal("cy-mock" + uuid_name)
      });

      cy.get('[data-cy="nameField"]').type("cy-mock-update" + uuid_name)
      cy.get('[data-cy="submitForm"]').click()
      cy.wait('@PutProjects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);


      cy.get('[data-cy="deleteForm"]').click()
      cy.wait(1000)
      cy.get('[data-cy="deleteModal"] footer button:last-child').click()
      cy.wait('@DeleteProjects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      cy.url().should('include', '/admin/projects/')

    })

  })
})
