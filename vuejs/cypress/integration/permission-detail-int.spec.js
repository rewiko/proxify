const uuidv1 = require('uuid/v1');

describe('Permission Api', function () {
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
        "portalonly": true,
      }
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/admin/permission/',
      body: payload,
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
