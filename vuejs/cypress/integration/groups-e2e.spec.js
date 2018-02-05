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

describe('Groups Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/groups')
      // stub server
      cy.server()
      cy.route('/admin/groups?offset=10&limit=10&order=name|DESC&filter={}',
        { "meta": { "offset": 10, "limit": 10, "count": 12 }, "data": [{ "id": 12, "name": "Group-Mockj", "description": null, "active": true, "createdAt": "2019-01-20T15:39:18.163Z", "updatedAt": "2019-01-20T15:39:18.163Z", "users": [], "roles": [] }, { "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-20T15:39:18.040Z", "updatedAt": "2019-01-20T15:39:18.040Z", "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$NBDWP9G2S5l0BV4U4Z4j6uB632tWZY9Rb.jUnEuJnxJUjczAC.tPK", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-20T15:39:16.906Z", "updatedAt": "2019-01-20T15:39:16.906Z", "userGroup": { "createdAt": "2019-01-20T15:39:18.200Z", "updatedAt": "2019-01-20T15:39:18.200Z", "groupId": 1, "userId": 2 } }], "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-20T15:39:17.562Z", "updatedAt": "2019-01-20T15:39:17.562Z", "roleGroup": { "createdAt": "2019-01-20T15:39:18.048Z", "updatedAt": "2019-01-20T15:39:18.048Z", "groupId": 1, "roleId": 2 } }] }] }
      ).as('Groups')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Groups').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);

      testSidebar(size);

      cy.get('[data-cy="pagination-table"] > .active').contains('2')
      cy.get('.card-body > div > table > tbody').children().should('have.length.to.be.greaterThan', 0)
      // cy.get('thead > tr > [aria-colindex="1"]').click();
      cy.wait(1000)
      cy.get('[data-cy="select-table"]').select('25')
      cy.get('.card-body > div > table > tbody').children().should(($div) => {
        expect($div).to.have.length.greaterThan(5)
      })

      cy.wait(1000)
      cy.get('.card-body > div > table > tbody > tr + tr > td:last-child > span a.btn-info').first().click()
      cy.wait(1000)
      cy.url().should('include', '/admin/group/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/groups')
      // stub server
      cy.server()
      cy.route('/admin/groups?offset=0&limit=10&order=name|DESC&filter={"name":"o"}',
        { "meta": { "offset": 0, "limit": 10, "count": 2 }, "data": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-20T14:59:44.401Z", "updatedAt": "2019-01-20T14:59:44.401Z", "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$5vsAezIcHVRp3ip8mhl.PuwMWUBa2fKZR13M53fYt7Zpo9aDM/maS", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-20T14:59:42.786Z", "updatedAt": "2019-01-20T14:59:42.786Z", "userGroup": { "createdAt": "2019-01-20T14:59:44.462Z", "updatedAt": "2019-01-20T14:59:44.462Z", "groupId": 1, "userId": 2 } }], "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.733Z", "updatedAt": "2019-01-20T14:59:43.733Z", "roleGroup": { "createdAt": "2019-01-20T14:59:44.411Z", "updatedAt": "2019-01-20T14:59:44.411Z", "groupId": 1, "roleId": 2 } }] }, { "id": 2, "name": "Group-Admin", "description": null, "active": true, "createdAt": "2019-01-20T14:59:44.423Z", "updatedAt": "2019-01-20T14:59:44.423Z", "users": [], "roles": [] }] }
      ).as('Groups')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`o{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('o')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length.to.be.greaterThan', 0)

      cy.wait('@Groups').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/groups')
      // stub server
      cy.server()
      cy.route('/admin/groups?offset=0&limit=10&order=name|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 12 }, "data": [{ "id": 2, "name": "Group-Admin", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.020Z", "updatedAt": "2019-01-20T18:45:43.020Z", "users": [], "roles": [] }, { "id": 3, "name": "Group-Mocka", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.031Z", "updatedAt": "2019-01-20T18:45:43.031Z", "users": [], "roles": [] }, { "id": 4, "name": "Group-Mockb", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.041Z", "updatedAt": "2019-01-20T18:45:43.041Z", "users": [], "roles": [] }, { "id": 5, "name": "Group-Mockc", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.050Z", "updatedAt": "2019-01-20T18:45:43.050Z", "users": [], "roles": [] }, { "id": 6, "name": "Group-Mockd", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.060Z", "updatedAt": "2019-01-20T18:45:43.060Z", "users": [], "roles": [] }, { "id": 7, "name": "Group-Mocke", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.069Z", "updatedAt": "2019-01-20T18:45:43.069Z", "users": [], "roles": [] }, { "id": 8, "name": "Group-Mockf", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.079Z", "updatedAt": "2019-01-20T18:45:43.079Z", "users": [], "roles": [] }, { "id": 9, "name": "Group-Mockg", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.087Z", "updatedAt": "2019-01-20T18:45:43.087Z", "users": [], "roles": [] }, { "id": 10, "name": "Group-Mockh", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.095Z", "updatedAt": "2019-01-20T18:45:43.095Z", "users": [], "roles": [] }, { "id": 11, "name": "Group-Mocki", "description": null, "active": true, "createdAt": "2019-01-20T18:45:43.104Z", "updatedAt": "2019-01-20T18:45:43.104Z", "users": [], "roles": [] }] }
      ).as('Groups')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()


      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Groups').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);

      cy.wait(1000)
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        expect(element.text()).to.not.equal(firstText)
      });
      testSidebar(size);
    })

  })
})
