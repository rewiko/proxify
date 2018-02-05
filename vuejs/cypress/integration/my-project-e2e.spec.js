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

describe('My Projects Page', function () {
  sizes.forEach((size) => {
    beforeEach(function () {
      // reset and seed the database prior to every test
      // cy.exec('npm run db:reset && npm run db:seed')
      cy.login('admin')
    })

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/proxy/projects')
      // stub server
      cy.server()
      cy.route('/proxy/applications?offset=10&limit=10&order=name|DESC&filter={}',
        {
          "meta": { "offset": 10, "limit": 10, "count": 14 }, "data": [{ "id": 13, "name": "user-mockl", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.237Z", "updatedAt": "2019-01-07T19:17:44.237Z", "permissions": [{ "id": 13, "name": "access-user-mockl", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.529Z", "updatedAt": "2019-01-07T19:17:44.537Z", "applicationId": 13, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMywicGVybWlzc2lvbklkIjoxMywiaWF0IjoxNTQ3MDYwNTkzfQ.9AYXjbFHvP_aMPFnwu6qnWMczc6nVX7s5jyW9Ql-5jc" }, { "id": 14, "name": "user-mockm", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.247Z", "updatedAt": "2019-01-07T19:17:44.247Z", "permissions": [{ "id": 14, "name": "access-user-mockj", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.549Z", "updatedAt": "2019-01-07T19:17:44.558Z", "applicationId": 14, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxNCwicGVybWlzc2lvbklkIjoxNCwiaWF0IjoxNTQ3MDYwNTkzfQ.jbPa4xE2huhQMaHM-oc4-bMRp69N8QCT389FkLzCx2s" }, { "id": 4, "name": "user-vuejs", "url": "vuejs:3333", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.132Z", "updatedAt": "2019-01-07T19:17:44.132Z", "permissions": [{ "id": 4, "name": "access-user-vuejs", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.341Z", "updatedAt": "2019-01-07T19:17:44.351Z", "applicationId": 4, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo0LCJwZXJtaXNzaW9uSWQiOjQsImlhdCI6MTU0NzA2MDU5M30.1XjTRKpyHzlsGtfLlfdz1drULy-EQrPcY1ZLCytYfzs" }, {
            "id": 1, "name": "user-webapp", "url": "user.website.io", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.098Z", "updatedAt": "2019-01-07T19:17:44.098Z", "permissions": [{
              "id": 1, "name": "access-user-webapp", "description": null, "active": null, "portalonly": true, "createdAt": "2019-01-07T19:17:44.264Z", "updatedAt": "2019-01-07T19:17:44.280Z", "applicationId": 1, "roles": [{
                "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.745Z", "updatedAt": "2019-01-07T19:17:44.745Z", "permissionId": 1, "roleId": 2 }, "groups": [{
                  "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{
                    "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": {
                      "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2
                    }
                  }]
                }]
              }]
            }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxLCJwZXJtaXNzaW9uSWQiOjEsImlhdCI6MTU0NzA2MDU5M30.P4gr8EbQ9XZ87Xgd-VmuWMQLG6geysmIKdVAKK1GAaA"
          }]
        }).as('Projects')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Projects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);

      testSidebar(size);

      cy.get('[data-cy="pagination-table"] > .active').contains('2')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 5)
      // cy.get('thead > tr > [aria-colindex="1"]').click();
      cy.wait(1000)
      cy.get('[data-cy="select-table"]').select('25')
      cy.get('.card-body > div > table > tbody').children().should(($div) => {
        expect($div).to.have.length.greaterThan(5)
      })

      cy.get('.card-body > div > table > tbody > tr + tr > td:last-child > span > a').first().click()
      cy.wait(1000)
      cy.url().should('include', '/proxy/project/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/proxy/projects')
      // stub server
      cy.server()
      cy.route('/proxy/applications?offset=0&limit=10&order=name|DESC&filter={"name":"mock"}',
        { "meta": { "offset": 0, "limit": 10, "count": 11 }, "data": [{ "id": 14, "name": "user-mockm", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.247Z", "updatedAt": "2019-01-07T19:17:44.247Z", "permissions": [{ "id": 14, "name": "access-user-mockj", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.549Z", "updatedAt": "2019-01-07T19:17:44.558Z", "applicationId": 14, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxNCwicGVybWlzc2lvbklkIjoxNCwiaWF0IjoxNTQ3NzU0MzcxfQ.ArIWxy2zPXrpDcEqSy57KjQO4LtoO6j_Ddw0qij-Esw" }, { "id": 13, "name": "user-mockl", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.237Z", "updatedAt": "2019-01-07T19:17:44.237Z", "permissions": [{ "id": 13, "name": "access-user-mockl", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.529Z", "updatedAt": "2019-01-07T19:17:44.537Z", "applicationId": 13, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMywicGVybWlzc2lvbklkIjoxMywiaWF0IjoxNTQ3NzU0MzcxfQ.BzJ6WFvS1aKle1Rspmq1j3Hys7Ko4GiXyykTG9fO3gc" }, { "id": 12, "name": "user-mocki", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.222Z", "updatedAt": "2019-01-07T19:17:44.222Z", "permissions": [{ "id": 12, "name": "access-user-mocki", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.508Z", "updatedAt": "2019-01-07T19:17:44.519Z", "applicationId": 12, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMiwicGVybWlzc2lvbklkIjoxMiwiaWF0IjoxNTQ3NzU0MzcxfQ.DJzdyroKbj_t4eXEH_1Nxe3EkkjIveJkA359JqNRGsg" }, { "id": 11, "name": "user-mockh", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.210Z", "updatedAt": "2019-01-07T19:17:44.210Z", "permissions": [{ "id": 11, "name": "access-user-mockh", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.484Z", "updatedAt": "2019-01-07T19:17:44.494Z", "applicationId": 11, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMSwicGVybWlzc2lvbklkIjoxMSwiaWF0IjoxNTQ3NzU0MzcxfQ.xK1Fi91nYL6S5oApXLidSLJlM7Yqo1PXNPB36o3DsBM" }, { "id": 10, "name": "user-mockg", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.201Z", "updatedAt": "2019-01-07T19:17:44.201Z", "permissions": [{ "id": 10, "name": "access-user-mockg", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.466Z", "updatedAt": "2019-01-07T19:17:44.475Z", "applicationId": 10, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMCwicGVybWlzc2lvbklkIjoxMCwiaWF0IjoxNTQ3NzU0MzcxfQ.5g90AoupADDTYFKY8R2KG0d-RlkRIsECGg6HpDOo6lM" }, { "id": 9, "name": "user-mockf", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.190Z", "updatedAt": "2019-01-07T19:17:44.190Z", "permissions": [{ "id": 9, "name": "access-user-mockf", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.445Z", "updatedAt": "2019-01-07T19:17:44.454Z", "applicationId": 9, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo5LCJwZXJtaXNzaW9uSWQiOjksImlhdCI6MTU0Nzc1NDM3MX0.FZS-jBhGr7UTDe2lZ9b48OuGW2QoJhncOVdFDWMzm2g" }, { "id": 8, "name": "user-mocke", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.177Z", "updatedAt": "2019-01-07T19:17:44.177Z", "permissions": [{ "id": 8, "name": "access-user-mocke", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.426Z", "updatedAt": "2019-01-07T19:17:44.435Z", "applicationId": 8, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo4LCJwZXJtaXNzaW9uSWQiOjgsImlhdCI6MTU0Nzc1NDM3MX0.dhgSiv9hw-1zHWt5QNOr0RcX7Mp28D9vGbT4iRCLxoo" }, { "id": 7, "name": "user-mockd", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.163Z", "updatedAt": "2019-01-07T19:17:44.163Z", "permissions": [{ "id": 7, "name": "access-user-mockd", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.403Z", "updatedAt": "2019-01-07T19:17:44.412Z", "applicationId": 7, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo3LCJwZXJtaXNzaW9uSWQiOjcsImlhdCI6MTU0Nzc1NDM3MX0.vZ16u2LMaNJScDKm9hnBHmGoPhsp0Mz8PFRHE_knvX4" }, { "id": 6, "name": "user-mockc", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.154Z", "updatedAt": "2019-01-07T19:17:44.154Z", "permissions": [{ "id": 6, "name": "access-user-mockc", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.384Z", "updatedAt": "2019-01-07T19:17:44.393Z", "applicationId": 6, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo2LCJwZXJtaXNzaW9uSWQiOjYsImlhdCI6MTU0Nzc1NDM3MX0.fI_vjWub2JX3yX685SDV9eyzCnyWC8SEsSHzgxVZ1Fc" }, { "id": 5, "name": "user-mockb", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.144Z", "updatedAt": "2019-01-07T19:17:44.144Z", "permissions": [{ "id": 5, "name": "access-user-mockb", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.361Z", "updatedAt": "2019-01-07T19:17:44.372Z", "applicationId": 5, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo1LCJwZXJtaXNzaW9uSWQiOjUsImlhdCI6MTU0Nzc1NDM3MX0.ak3IUjlCpL6WmxGIw8t60Z_QhtArzSGAlpIzZjSC928" }] }
      ).as('Projects')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`mock{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('mock')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Projects').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/proxy/projects')
      // stub server
      cy.server()
      cy.route('/proxy/applications?offset=0&limit=10&order=name|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 14 }, "data": [{ "id": 2, "name": "user-iframe", "url": "nodetest:1337", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.109Z", "updatedAt": "2019-01-07T19:17:44.109Z", "permissions": [{ "id": 2, "name": "access-user-iframe", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.295Z", "updatedAt": "2019-01-07T19:17:44.303Z", "applicationId": 2, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.692Z", "updatedAt": "2019-01-07T19:17:44.692Z", "permissionId": 2, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoyLCJwZXJtaXNzaW9uSWQiOjIsImlhdCI6MTU0Nzc1NjE4Nn0.0PKIvF9ABS5EafZfLqNgeXmJrv2iJc4C3_T3hhaAhws" }, { "id": 3, "name": "user-mock", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.120Z", "updatedAt": "2019-01-07T19:17:44.120Z", "permissions": [{ "id": 3, "name": "access-user-mock", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.315Z", "updatedAt": "2019-01-07T19:17:44.326Z", "applicationId": 3, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.729Z", "updatedAt": "2019-01-07T19:17:44.729Z", "permissionId": 3, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjozLCJwZXJtaXNzaW9uSWQiOjMsImlhdCI6MTU0Nzc1NjE4Nn0.O0Svd1n9lSZ3EJGXQ2o0CZw90QujMMv9hsluorxhSRA" }, { "id": 5, "name": "user-mockb", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.144Z", "updatedAt": "2019-01-07T19:17:44.144Z", "permissions": [{ "id": 5, "name": "access-user-mockb", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.361Z", "updatedAt": "2019-01-07T19:17:44.372Z", "applicationId": 5, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo1LCJwZXJtaXNzaW9uSWQiOjUsImlhdCI6MTU0Nzc1NjE4Nn0.WqnLFCfkf8vDysjZ96gwdaMYG0xuvO0SR2hbqqNOLrk" }, { "id": 6, "name": "user-mockc", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.154Z", "updatedAt": "2019-01-07T19:17:44.154Z", "permissions": [{ "id": 6, "name": "access-user-mockc", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.384Z", "updatedAt": "2019-01-07T19:17:44.393Z", "applicationId": 6, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo2LCJwZXJtaXNzaW9uSWQiOjYsImlhdCI6MTU0Nzc1NjE4Nn0.mGJKB5otorRfApfqucYIZ1uBidDw20zMUoGunMsMIKw" }, { "id": 7, "name": "user-mockd", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.163Z", "updatedAt": "2019-01-07T19:17:44.163Z", "permissions": [{ "id": 7, "name": "access-user-mockd", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.403Z", "updatedAt": "2019-01-07T19:17:44.412Z", "applicationId": 7, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo3LCJwZXJtaXNzaW9uSWQiOjcsImlhdCI6MTU0Nzc1NjE4Nn0.cIb6pppVXwcfogHPXH1Y6HbvH1iDh__lCRNHFZGM82g" }, { "id": 8, "name": "user-mocke", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.177Z", "updatedAt": "2019-01-07T19:17:44.177Z", "permissions": [{ "id": 8, "name": "access-user-mocke", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.426Z", "updatedAt": "2019-01-07T19:17:44.435Z", "applicationId": 8, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo4LCJwZXJtaXNzaW9uSWQiOjgsImlhdCI6MTU0Nzc1NjE4Nn0.M0le97pjuIuner4V79Kl2O5Tis8NZj3pfvG4Yo5ybm4" }, { "id": 9, "name": "user-mockf", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.190Z", "updatedAt": "2019-01-07T19:17:44.190Z", "permissions": [{ "id": 9, "name": "access-user-mockf", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.445Z", "updatedAt": "2019-01-07T19:17:44.454Z", "applicationId": 9, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjo5LCJwZXJtaXNzaW9uSWQiOjksImlhdCI6MTU0Nzc1NjE4Nn0.Z2EMuapUlp_7Zt4n24LPgU9e_DaMTNScLGohE4Vlsdo" }, { "id": 10, "name": "user-mockg", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.201Z", "updatedAt": "2019-01-07T19:17:44.201Z", "permissions": [{ "id": 10, "name": "access-user-mockg", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.466Z", "updatedAt": "2019-01-07T19:17:44.475Z", "applicationId": 10, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMCwicGVybWlzc2lvbklkIjoxMCwiaWF0IjoxNTQ3NzU2MTg2fQ.Khy7yB5Cs1ssefe6mzmYD8tqPMs2JU9yFNoJEJgmRoQ" }, { "id": 11, "name": "user-mockh", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.210Z", "updatedAt": "2019-01-07T19:17:44.210Z", "permissions": [{ "id": 11, "name": "access-user-mockh", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.484Z", "updatedAt": "2019-01-07T19:17:44.494Z", "applicationId": 11, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMSwicGVybWlzc2lvbklkIjoxMSwiaWF0IjoxNTQ3NzU2MTg2fQ.S3B8u-qKkCxVFBSb_UnHDxsgfVRp8Q_XaEHgrG12jgU" }, { "id": 12, "name": "user-mocki", "url": "mocks:8080", "description": null, "active": true, "createdAt": "2019-01-07T19:17:44.222Z", "updatedAt": "2019-01-07T19:17:44.222Z", "permissions": [{ "id": 12, "name": "access-user-mocki", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.508Z", "updatedAt": "2019-01-07T19:17:44.519Z", "applicationId": 12, "roles": [] }], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxMiwicGVybWlzc2lvbklkIjoxMiwiaWF0IjoxNTQ3NzU2MTg2fQ.8bzdBIkzTqhXXnIG2bceaEWJhwd3YlyAld2CMyS-Ynw" }] }
      ).as('Projects')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()


      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Projects').then(function (xhr) {
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
