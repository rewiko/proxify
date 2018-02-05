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

describe('Permissions Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/permissions')
      // stub server
      cy.server()
      cy.route('/admin/permissions?offset=10&limit=10&order=name|DESC&filter={}',
        {
          "meta": { "offset": 0, "limit": 10, "count": 26 }, "data": [{ "id": 24, "name": "view-all-token", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.955Z", "updatedAt": "2019-01-20T10:58:41.484Z", "applicationId": 30, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.966Z", "updatedAt": "2019-01-07T19:17:44.966Z", "permissionId": 24, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": { "id": 30, "name": "fezfez", "url": "fezfez", "description": "fezfezf", "active": true, "createdAt": "2019-01-20T10:58:41.474Z", "updatedAt": "2019-01-20T10:58:41.474Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjozMCwicGVybWlzc2lvbklkIjoyNCwiaWF0IjoxNTQ3OTg5NDI4fQ.9uOEGJTnBoM-xnVmcj9CFdkfPe5QUjpJVnI5n4MiQZE" }, { "id": 23, "name": "view-all-role", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.935Z", "updatedAt": "2019-01-07T19:17:44.935Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.944Z", "updatedAt": "2019-01-07T19:17:44.944Z", "permissionId": 23, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }, { "id": 18, "name": "view-all-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.798Z", "updatedAt": "2019-01-07T19:17:44.798Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.899Z", "updatedAt": "2019-01-07T19:17:44.899Z", "permissionId": 18, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }, { "id": 1, "name": "Administrator", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.650Z", "updatedAt": "2019-01-07T19:17:44.650Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.807Z", "updatedAt": "2019-01-07T19:17:44.807Z", "permissionId": 18, "roleId": 1 }, "groups": [] }], "application": null, "routes": [] }, { "id": 22, "name": "view-all-group", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.913Z", "updatedAt": "2019-01-07T19:17:44.913Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.924Z", "updatedAt": "2019-01-07T19:17:44.924Z", "permissionId": 22, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }, { "id": 15, "name": "test-admin", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.705Z", "updatedAt": "2019-01-07T19:17:44.705Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.716Z", "updatedAt": "2019-01-07T19:17:44.716Z", "permissionId": 15, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [{ "id": 2, "path": "/admin/user/me", "method": "get", "uniqpathmethod": "/admin/user/meget", "createdAt": "2019-01-07T19:17:43.387Z", "updatedAt": "2019-01-07T19:17:43.387Z", "permissionRoute": { "createdAt": "2019-01-07T19:17:45.052Z", "updatedAt": "2019-01-07T19:17:45.052Z", "permissionId": 15, "routeId": 2 } }, { "id": 3, "path": "/admin/user/me", "method": "put", "uniqpathmethod": "/admin/user/meput", "createdAt": "2019-01-07T19:17:43.396Z", "updatedAt": "2019-01-07T19:17:43.396Z", "permissionRoute": { "createdAt": "2019-01-07T19:17:45.068Z", "updatedAt": "2019-01-07T19:17:45.068Z", "permissionId": 15, "routeId": 3 } }, { "id": 58, "path": "/private/authpolicies", "method": "get", "uniqpathmethod": "/private/authpoliciesget", "createdAt": "2019-01-07T19:17:43.727Z", "updatedAt": "2019-01-07T19:17:43.727Z", "permissionRoute": { "createdAt": "2019-01-07T19:17:45.039Z", "updatedAt": "2019-01-07T19:17:45.039Z", "permissionId": 15, "routeId": 58 } }] }, { "id": 19, "name": "roomuser", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.818Z", "updatedAt": "2019-01-07T19:17:44.818Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:45.022Z", "updatedAt": "2019-01-07T19:17:45.022Z", "permissionId": 19, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }, { "id": 1, "name": "Administrator", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.650Z", "updatedAt": "2019-01-07T19:17:44.650Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.830Z", "updatedAt": "2019-01-07T19:17:44.830Z", "permissionId": 19, "roleId": 1 }, "groups": [] }], "application": null, "routes": [] }, { "id": 25, "name": "projects-consultation", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.977Z", "updatedAt": "2019-01-07T19:17:44.977Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.986Z", "updatedAt": "2019-01-07T19:17:44.986Z", "permissionId": 25, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }, { "id": 21, "name": "project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.877Z", "updatedAt": "2019-01-07T19:17:44.877Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.887Z", "updatedAt": "2019-01-07T19:17:44.887Z", "permissionId": 21, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }, { "id": 20, "name": "modify-project", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.855Z", "updatedAt": "2019-01-07T19:17:44.855Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.865Z", "updatedAt": "2019-01-07T19:17:44.865Z", "permissionId": 20, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }, { "id": 26, "name": "models-consultation", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.996Z", "updatedAt": "2019-01-07T19:17:44.996Z", "applicationId": null, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:45.007Z", "updatedAt": "2019-01-07T19:17:45.007Z", "permissionId": 26, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": null, "routes": [] }]
        }
      ).as('Permissions')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Permissions').then(function (xhr) {
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
      cy.url().should('include', '/admin/permission/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/permissions')
      // stub server
      cy.server()
      cy.route('/admin/permissions?offset=0&limit=10&order=name|DESC&filter={"name":"mock"}',

        { "meta": { "offset": 0, "limit": 10, "count": 11 }, "data": [{ "id": 13, "name": "access-user-mockl", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.529Z", "updatedAt": "2019-01-07T19:17:44.537Z", "applicationId": 13, "roles": [], "application": { "id": 13, "name": "user-mockl", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.237Z", "updatedAt": "2019-01-07T19:17:44.237Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMywicGVybWlzc2lvbklkIjoxMywiaWF0IjoxNTQ3OTkxMDg1fQ.IItoO06HTyCEjJqXxZChve0h5UZCR0GEn8c1xjWlYlQ" }, { "id": 14, "name": "access-user-mockj", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.549Z", "updatedAt": "2019-01-07T19:17:44.558Z", "applicationId": 14, "roles": [], "application": { "id": 14, "name": "user-mockm", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.247Z", "updatedAt": "2019-01-07T19:17:44.247Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxNCwicGVybWlzc2lvbklkIjoxNCwiaWF0IjoxNTQ3OTkxMDg1fQ.D36uwsMuOiIcGt2SByD5hSTKoZFW-22ZlxoQ2Cznq2Y" }, { "id": 12, "name": "access-user-mocki", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.508Z", "updatedAt": "2019-01-07T19:17:44.519Z", "applicationId": 12, "roles": [], "application": { "id": 12, "name": "user-mocki", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.222Z", "updatedAt": "2019-01-07T19:17:44.222Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMiwicGVybWlzc2lvbklkIjoxMiwiaWF0IjoxNTQ3OTkxMDg1fQ.vv8TKQg3AZGPS3wT3Od87RTIcduCWqhG3OF3rccfNT4" }, { "id": 11, "name": "access-user-mockh", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.484Z", "updatedAt": "2019-01-07T19:17:44.494Z", "applicationId": 11, "roles": [], "application": { "id": 11, "name": "user-mockh", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.210Z", "updatedAt": "2019-01-07T19:17:44.210Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMSwicGVybWlzc2lvbklkIjoxMSwiaWF0IjoxNTQ3OTkxMDg1fQ.5z11LkRF8XTcO70xygG0SkLUhopMTH6xTo7A_sCArqg" }, { "id": 10, "name": "access-user-mockg", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.466Z", "updatedAt": "2019-01-07T19:17:44.475Z", "applicationId": 10, "roles": [], "application": { "id": 10, "name": "user-mockg", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.201Z", "updatedAt": "2019-01-07T19:17:44.201Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMCwicGVybWlzc2lvbklkIjoxMCwiaWF0IjoxNTQ3OTkxMDg1fQ.5Hd3qDOfAv5sIfwy377a-QMVtnv2UCT4bgi8IJDJU-M" }, { "id": 9, "name": "access-user-mockf", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.445Z", "updatedAt": "2019-01-07T19:17:44.454Z", "applicationId": 9, "roles": [], "application": { "id": 9, "name": "user-mockf", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.190Z", "updatedAt": "2019-01-07T19:17:44.190Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo5LCJwZXJtaXNzaW9uSWQiOjksImlhdCI6MTU0Nzk5MTA4NX0.sR4o6h2a3SiFMynTYuVor9_CJU3OseZIs8nd_GfR_i4" }, { "id": 8, "name": "access-user-mocke", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.426Z", "updatedAt": "2019-01-07T19:17:44.435Z", "applicationId": 8, "roles": [], "application": { "id": 8, "name": "user-mocke", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.177Z", "updatedAt": "2019-01-07T19:17:44.177Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo4LCJwZXJtaXNzaW9uSWQiOjgsImlhdCI6MTU0Nzk5MTA4NX0.281FzqpIpYPwhnVuzRHwRuvlMeU-QsQlpG3j2rwvG5c" }, { "id": 7, "name": "access-user-mockd", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.403Z", "updatedAt": "2019-01-07T19:17:44.412Z", "applicationId": 7, "roles": [], "application": { "id": 7, "name": "user-mockd", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.163Z", "updatedAt": "2019-01-07T19:17:44.163Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo3LCJwZXJtaXNzaW9uSWQiOjcsImlhdCI6MTU0Nzk5MTA4NX0.aAplUuKcV_u2sOQ30d57Nfi-7gI0BS3asCc3n1K81SM" }, { "id": 6, "name": "access-user-mockc", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.384Z", "updatedAt": "2019-01-07T19:17:44.393Z", "applicationId": 6, "roles": [], "application": { "id": 6, "name": "user-mockc", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.154Z", "updatedAt": "2019-01-07T19:17:44.154Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo2LCJwZXJtaXNzaW9uSWQiOjYsImlhdCI6MTU0Nzk5MTA4NX0.u5VVQ9K9R6g4drPDGo2yTTFAbfzM6uDwe5kz4ne6dgk" }, { "id": 5, "name": "access-user-mockb", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.361Z", "updatedAt": "2019-01-07T19:17:44.372Z", "applicationId": 5, "roles": [], "application": { "id": 5, "name": "user-mockb", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.144Z", "updatedAt": "2019-01-07T19:17:44.144Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo1LCJwZXJtaXNzaW9uSWQiOjUsImlhdCI6MTU0Nzk5MTA4NX0.FIUCJpvS4795Wbborm5PxojTBy-NwF_0IVHkpSnHifk" }] }
      ).as('Permissions')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`mock{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('mock')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Permissions').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/permissions')
      // stub server
      cy.server()
      cy.route('/admin/permissions?offset=0&limit=10&order=name|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 11 }, "data": [{ "id": 3, "name": "access-user-mock", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.315Z", "updatedAt": "2019-01-07T19:17:44.326Z", "applicationId": 3, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.729Z", "updatedAt": "2019-01-07T19:17:44.729Z", "permissionId": 3, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": { "id": 3, "name": "user-mock", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.120Z", "updatedAt": "2019-01-07T19:17:44.120Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjozLCJwZXJtaXNzaW9uSWQiOjMsImlhdCI6MTU0Nzk5MTM1M30.d8Hre7v3Y2iN-FhehDUg1laaYWS_cXkRtDs6fLzptoI" }, { "id": 5, "name": "access-user-mockb", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.361Z", "updatedAt": "2019-01-07T19:17:44.372Z", "applicationId": 5, "roles": [], "application": { "id": 5, "name": "user-mockb", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.144Z", "updatedAt": "2019-01-07T19:17:44.144Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo1LCJwZXJtaXNzaW9uSWQiOjUsImlhdCI6MTU0Nzk5MTM1M30.Ohaxev7o5kgV8kmQZdFSn_RPqB0TExNOMJkTtGNLE6U" }, { "id": 6, "name": "access-user-mockc", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.384Z", "updatedAt": "2019-01-07T19:17:44.393Z", "applicationId": 6, "roles": [], "application": { "id": 6, "name": "user-mockc", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.154Z", "updatedAt": "2019-01-07T19:17:44.154Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo2LCJwZXJtaXNzaW9uSWQiOjYsImlhdCI6MTU0Nzk5MTM1M30.MdrFNiZs4AZ6eQP74JTZy2Nk2VeahTrueOfX_NLv88I" }, { "id": 7, "name": "access-user-mockd", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.403Z", "updatedAt": "2019-01-07T19:17:44.412Z", "applicationId": 7, "roles": [], "application": { "id": 7, "name": "user-mockd", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.163Z", "updatedAt": "2019-01-07T19:17:44.163Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo3LCJwZXJtaXNzaW9uSWQiOjcsImlhdCI6MTU0Nzk5MTM1M30.gakoAhYX68NeaE--Ai4jf0XdT0PuO3dieM__H88lTv0" }, { "id": 8, "name": "access-user-mocke", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.426Z", "updatedAt": "2019-01-07T19:17:44.435Z", "applicationId": 8, "roles": [], "application": { "id": 8, "name": "user-mocke", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.177Z", "updatedAt": "2019-01-07T19:17:44.177Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo4LCJwZXJtaXNzaW9uSWQiOjgsImlhdCI6MTU0Nzk5MTM1M30.XoF6_R4Sutyi7R-yz63NYOsW7DnEAGhJMm07c_AXeWY" }, { "id": 9, "name": "access-user-mockf", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.445Z", "updatedAt": "2019-01-07T19:17:44.454Z", "applicationId": 9, "roles": [], "application": { "id": 9, "name": "user-mockf", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.190Z", "updatedAt": "2019-01-07T19:17:44.190Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo5LCJwZXJtaXNzaW9uSWQiOjksImlhdCI6MTU0Nzk5MTM1M30.h9Wa2tDwWBpQhIYkubxag3iFMYsuqRcbuRaoVsqUggU" }, { "id": 10, "name": "access-user-mockg", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.466Z", "updatedAt": "2019-01-07T19:17:44.475Z", "applicationId": 10, "roles": [], "application": { "id": 10, "name": "user-mockg", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.201Z", "updatedAt": "2019-01-07T19:17:44.201Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMCwicGVybWlzc2lvbklkIjoxMCwiaWF0IjoxNTQ3OTkxMzUzfQ.7k4Swm_Yc4ovWXDkpOZUElvA50vikZR1667FXOFRY-4" }, { "id": 11, "name": "access-user-mockh", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.484Z", "updatedAt": "2019-01-07T19:17:44.494Z", "applicationId": 11, "roles": [], "application": { "id": 11, "name": "user-mockh", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.210Z", "updatedAt": "2019-01-07T19:17:44.210Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMSwicGVybWlzc2lvbklkIjoxMSwiaWF0IjoxNTQ3OTkxMzUzfQ.KW8T8_x57lrK5h_Kf6vnTlykL6K99xbkC3J5CIawK7Q" }, { "id": 12, "name": "access-user-mocki", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.508Z", "updatedAt": "2019-01-07T19:17:44.519Z", "applicationId": 12, "roles": [], "application": { "id": 12, "name": "user-mocki", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.222Z", "updatedAt": "2019-01-07T19:17:44.222Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMiwicGVybWlzc2lvbklkIjoxMiwiaWF0IjoxNTQ3OTkxMzUzfQ.aKE86RCyv-ddRjhZlqiMjLHwA72PJz2CjJoeLhP6vnU" }, { "id": 14, "name": "access-user-mockj", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.549Z", "updatedAt": "2019-01-07T19:17:44.558Z", "applicationId": 14, "roles": [], "application": { "id": 14, "name": "user-mockm", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.247Z", "updatedAt": "2019-01-07T19:17:44.247Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxNCwicGVybWlzc2lvbklkIjoxNCwiaWF0IjoxNTQ3OTkxMzUzfQ.2ebHsJcUWlodS-hFNCU62Fhq4cQ9qX2TrHOfAzHBtzs" }] }
      ).as('Permissions')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()


      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Permissions').then(function (xhr) {
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
