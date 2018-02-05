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

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/roles')
      // stub server
      cy.server()
      cy.route('/admin/roles?offset=10&limit=10&order=name|DESC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 13 }, "data": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.733Z", "updatedAt": "2019-01-20T14:59:43.733Z", "permissions": [{ "id": 2, "name": "access-user-iframe", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:43.259Z", "updatedAt": "2019-01-20T14:59:43.268Z", "applicationId": 2, "rolePermission": { "createdAt": "2019-01-20T14:59:43.920Z", "updatedAt": "2019-01-20T14:59:43.920Z", "permissionId": 2, "roleId": 2 } }, { "id": 15, "name": "test-admin", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:43.937Z", "updatedAt": "2019-01-20T14:59:43.937Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:43.953Z", "updatedAt": "2019-01-20T14:59:43.953Z", "permissionId": 15, "roleId": 2 } }, { "id": 3, "name": "access-user-mock", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:43.284Z", "updatedAt": "2019-01-20T14:59:43.296Z", "applicationId": 3, "rolePermission": { "createdAt": "2019-01-20T14:59:43.972Z", "updatedAt": "2019-01-20T14:59:43.972Z", "permissionId": 3, "roleId": 2 } }, { "id": 1, "name": "access-user-webapp", "description": null, "active": null, "portalonly": true, "createdAt": "2019-01-20T14:59:43.224Z", "updatedAt": "2019-01-20T14:59:43.242Z", "applicationId": 1, "rolePermission": { "createdAt": "2019-01-20T14:59:43.990Z", "updatedAt": "2019-01-20T14:59:43.990Z", "permissionId": 1, "roleId": 2 } }, { "id": 17, "name": "create-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.052Z", "updatedAt": "2019-01-20T14:59:44.052Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.150Z", "updatedAt": "2019-01-20T14:59:44.150Z", "permissionId": 17, "roleId": 2 } }, { "id": 20, "name": "modify-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.166Z", "updatedAt": "2019-01-20T14:59:44.166Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.177Z", "updatedAt": "2019-01-20T14:59:44.177Z", "permissionId": 20, "roleId": 2 } }, { "id": 21, "name": "project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.191Z", "updatedAt": "2019-01-20T14:59:44.191Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.205Z", "updatedAt": "2019-01-20T14:59:44.205Z", "permissionId": 21, "roleId": 2 } }, { "id": 18, "name": "view-all-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.080Z", "updatedAt": "2019-01-20T14:59:44.080Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.219Z", "updatedAt": "2019-01-20T14:59:44.219Z", "permissionId": 18, "roleId": 2 } }, { "id": 22, "name": "view-all-group", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.228Z", "updatedAt": "2019-01-20T14:59:44.228Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.242Z", "updatedAt": "2019-01-20T14:59:44.242Z", "permissionId": 22, "roleId": 2 } }, { "id": 23, "name": "view-all-role", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.255Z", "updatedAt": "2019-01-20T14:59:44.255Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.266Z", "updatedAt": "2019-01-20T14:59:44.266Z", "permissionId": 23, "roleId": 2 } }, { "id": 24, "name": "view-all-token", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.275Z", "updatedAt": "2019-01-20T14:59:44.275Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.286Z", "updatedAt": "2019-01-20T14:59:44.286Z", "permissionId": 24, "roleId": 2 } }, { "id": 25, "name": "projects-consultation", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.300Z", "updatedAt": "2019-01-20T14:59:44.300Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.312Z", "updatedAt": "2019-01-20T14:59:44.312Z", "permissionId": 25, "roleId": 2 } }, { "id": 26, "name": "models-consultation", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.321Z", "updatedAt": "2019-01-20T14:59:44.321Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.332Z", "updatedAt": "2019-01-20T14:59:44.332Z", "permissionId": 26, "roleId": 2 } }, { "id": 19, "name": "roomuser", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T14:59:44.111Z", "updatedAt": "2019-01-20T14:59:44.111Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T14:59:44.344Z", "updatedAt": "2019-01-20T14:59:44.344Z", "permissionId": 19, "roleId": 2 } }], "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-20T14:59:44.401Z", "updatedAt": "2019-01-20T14:59:44.401Z", "roleGroup": { "createdAt": "2019-01-20T14:59:44.411Z", "updatedAt": "2019-01-20T14:59:44.411Z", "groupId": 1, "roleId": 2 } }] }, { "id": 13, "name": "Mockj", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.891Z", "updatedAt": "2019-01-20T14:59:43.891Z", "permissions": [], "groups": [] }, { "id": 12, "name": "Mocki", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.877Z", "updatedAt": "2019-01-20T14:59:43.877Z", "permissions": [], "groups": [] }, { "id": 11, "name": "Mockh", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.862Z", "updatedAt": "2019-01-20T14:59:43.862Z", "permissions": [], "groups": [] }, { "id": 10, "name": "Mockg", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.845Z", "updatedAt": "2019-01-20T14:59:43.845Z", "permissions": [], "groups": [] }, { "id": 9, "name": "Mockf", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.829Z", "updatedAt": "2019-01-20T14:59:43.829Z", "permissions": [], "groups": [] }, { "id": 8, "name": "Mocke", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.816Z", "updatedAt": "2019-01-20T14:59:43.816Z", "permissions": [], "groups": [] }, { "id": 7, "name": "Mockd", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.802Z", "updatedAt": "2019-01-20T14:59:43.802Z", "permissions": [], "groups": [] }, { "id": 6, "name": "Mockc", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.788Z", "updatedAt": "2019-01-20T14:59:43.788Z", "permissions": [], "groups": [] }, { "id": 5, "name": "Mockb", "description": null, "active": null, "createdAt": "2019-01-20T14:59:43.776Z", "updatedAt": "2019-01-20T14:59:43.776Z", "permissions": [], "groups": [] }] }
      ).as('Roles')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Roles').then(function (xhr) {
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
      cy.url().should('include', '/admin/role/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/roles')
      // stub server
      cy.server()
      cy.route('/admin/roles?offset=0&limit=10&order=name|DESC&filter={"name":"o"}',
        { "meta": { "offset": 0, "limit": 10, "count": 11 }, "data": [{ "id": 1, "name": "Administrator", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.542Z", "updatedAt": "2019-01-20T18:45:42.542Z", "permissions": [{ "id": 19, "name": "roomuser", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.772Z", "updatedAt": "2019-01-20T18:45:42.772Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.782Z", "updatedAt": "2019-01-20T18:45:42.782Z", "permissionId": 19, "roleId": 1 } }, { "id": 17, "name": "create-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.736Z", "updatedAt": "2019-01-20T18:45:42.736Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.745Z", "updatedAt": "2019-01-20T18:45:42.745Z", "permissionId": 17, "roleId": 1 } }, { "id": 18, "name": "view-all-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.756Z", "updatedAt": "2019-01-20T18:45:42.756Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.764Z", "updatedAt": "2019-01-20T18:45:42.764Z", "permissionId": 18, "roleId": 1 } }, { "id": 16, "name": "create-user", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.718Z", "updatedAt": "2019-01-20T18:45:42.718Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.727Z", "updatedAt": "2019-01-20T18:45:42.727Z", "permissionId": 16, "roleId": 1 } }], "groups": [] }, { "id": 4, "name": "Mocka", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.571Z", "updatedAt": "2019-01-20T18:45:42.571Z", "permissions": [], "groups": [] }, { "id": 5, "name": "Mockb", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.579Z", "updatedAt": "2019-01-20T18:45:42.579Z", "permissions": [], "groups": [] }, { "id": 6, "name": "Mockc", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.588Z", "updatedAt": "2019-01-20T18:45:42.588Z", "permissions": [], "groups": [] }, { "id": 7, "name": "Mockd", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.598Z", "updatedAt": "2019-01-20T18:45:42.598Z", "permissions": [], "groups": [] }, { "id": 8, "name": "Mocke", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.607Z", "updatedAt": "2019-01-20T18:45:42.607Z", "permissions": [], "groups": [] }, { "id": 9, "name": "Mockf", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.615Z", "updatedAt": "2019-01-20T18:45:42.615Z", "permissions": [], "groups": [] }, { "id": 10, "name": "Mockg", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.624Z", "updatedAt": "2019-01-20T18:45:42.624Z", "permissions": [], "groups": [] }, { "id": 11, "name": "Mockh", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.634Z", "updatedAt": "2019-01-20T18:45:42.634Z", "permissions": [], "groups": [] }, { "id": 12, "name": "Mocki", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.643Z", "updatedAt": "2019-01-20T18:45:42.643Z", "permissions": [], "groups": [] }] }
      ).as('Roles')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`o{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('o')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Roles').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/roles')
      // stub server
      cy.server()
      cy.route('/admin/roles?offset=0&limit=10&order=name|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 13 }, "data": [{ "id": 1, "name": "Administrator", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.542Z", "updatedAt": "2019-01-20T18:45:42.542Z", "permissions": [{ "id": 16, "name": "create-user", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.718Z", "updatedAt": "2019-01-20T18:45:42.718Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.727Z", "updatedAt": "2019-01-20T18:45:42.727Z", "permissionId": 16, "roleId": 1 } }, { "id": 17, "name": "create-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.736Z", "updatedAt": "2019-01-20T18:45:42.736Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.745Z", "updatedAt": "2019-01-20T18:45:42.745Z", "permissionId": 17, "roleId": 1 } }, { "id": 18, "name": "view-all-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.756Z", "updatedAt": "2019-01-20T18:45:42.756Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.764Z", "updatedAt": "2019-01-20T18:45:42.764Z", "permissionId": 18, "roleId": 1 } }, { "id": 19, "name": "roomuser", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-20T18:45:42.772Z", "updatedAt": "2019-01-20T18:45:42.772Z", "applicationId": null, "rolePermission": { "createdAt": "2019-01-20T18:45:42.782Z", "updatedAt": "2019-01-20T18:45:42.782Z", "permissionId": 19, "roleId": 1 } }], "groups": [] }, { "id": 3, "name": "Manager", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.562Z", "updatedAt": "2019-01-20T18:45:42.562Z", "permissions": [], "groups": [] }, { "id": 4, "name": "Mocka", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.571Z", "updatedAt": "2019-01-20T18:45:42.571Z", "permissions": [], "groups": [] }, { "id": 5, "name": "Mockb", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.579Z", "updatedAt": "2019-01-20T18:45:42.579Z", "permissions": [], "groups": [] }, { "id": 6, "name": "Mockc", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.588Z", "updatedAt": "2019-01-20T18:45:42.588Z", "permissions": [], "groups": [] }, { "id": 7, "name": "Mockd", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.598Z", "updatedAt": "2019-01-20T18:45:42.598Z", "permissions": [], "groups": [] }, { "id": 8, "name": "Mocke", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.607Z", "updatedAt": "2019-01-20T18:45:42.607Z", "permissions": [], "groups": [] }, { "id": 9, "name": "Mockf", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.615Z", "updatedAt": "2019-01-20T18:45:42.615Z", "permissions": [], "groups": [] }, { "id": 10, "name": "Mockg", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.624Z", "updatedAt": "2019-01-20T18:45:42.624Z", "permissions": [], "groups": [] }, { "id": 11, "name": "Mockh", "description": null, "active": null, "createdAt": "2019-01-20T18:45:42.634Z", "updatedAt": "2019-01-20T18:45:42.634Z", "permissions": [], "groups": [] }] }
      ).as('Roles')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()


      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Roles').then(function (xhr) {
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
