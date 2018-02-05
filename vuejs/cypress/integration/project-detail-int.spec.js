const uuidv1 = require('uuid/v1');

describe('Project Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
    cy.login('admin')
  })

  it('should be able to create project', function () {

    var uuid_name = uuidv1();

    var payload = {
      "data": {
        "name": "test-app" + uuid_name,
        "description": "test-app" + uuid_name,
        "permissions": [{ "id": 24, "name": "view-all-token", "description": null, "active": null, "portalonly": false, "createdAt": "2019-01-07T19:17:44.955Z", "updatedAt": "2019-01-20T09:11:21.990Z", "applicationId": 15, "roles": [{ "id": 2, "name": "User", "description": null, "active": null, "createdAt": "2019-01-07T19:17:44.661Z", "updatedAt": "2019-01-07T19:17:44.661Z", "rolePermission": { "createdAt": "2019-01-07T19:17:44.966Z", "updatedAt": "2019-01-07T19:17:44.966Z", "permissionId": 24, "roleId": 2 }, "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-07T19:17:45.080Z", "updatedAt": "2019-01-07T19:17:45.080Z", "roleGroup": { "createdAt": "2019-01-07T19:17:45.089Z", "updatedAt": "2019-01-07T19:17:45.089Z", "groupId": 1, "roleId": 2 }, "users": [{ "id": 2, "username": "user", "email": "user@localhost.com", "password": "$2a$10$x.c5VkAceRyhqbZ4zV9XH.48kXawpfhqiCbsdVtUN6vBb.0HShI6.", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-07T19:17:43.944Z", "updatedAt": "2019-01-07T19:17:43.944Z", "userGroup": { "createdAt": "2019-01-07T19:17:45.140Z", "updatedAt": "2019-01-07T19:17:45.140Z", "groupId": 1, "userId": 2 } }] }] }], "application": { "id": 15, "name": "greg", "url": "rgeregre", "description": "greg", "active": true, "createdAt": "2019-01-20T09:11:21.975Z", "updatedAt": "2019-01-20T09:11:21.975Z" }, "routes": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoxNSwicGVybWlzc2lvbklkIjoyNCwiaWF0IjoxNTQ3OTc1NTI1fQ.bZ3okS4JXkbfm4s0u9AlGlV22X7M-y7XVgxlt3BTCRU", "actions": [{ "class": "btn btn-info", "path": "/admin/permission/24", "icon": "fa fa-edit", "id": 24, "show": true }, { "class": "btn btn-danger", "path": "/admin/permission/24", "icon": "fa fa-trash-o", "id": 24, "removeItem": true, "show": true }] }],
        "url": "test-app:8080"
      }
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/proxy/application/',
      body: payload,
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
