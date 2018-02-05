const uuidv1 = require('uuid/v1');

describe('User Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
    cy.login('admin')
  })

  it('should be able to create user', function () {

    var uuid_name = uuidv1();

    var payload = {
      "data": {
        "username": "test-app" + uuid_name,
        "password": "test-app" + uuid_name,
        "email": "test-app" + uuid_name + "@test.com",
      }
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/admin/user/',
      body: payload,
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
