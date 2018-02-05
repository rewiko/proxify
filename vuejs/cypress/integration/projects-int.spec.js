describe('The Login Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
    cy.login('admin')
  })

  it('should be able to get admin project list', function () {

    cy.request({
      method: 'GET',
      url: 'http://localhost:8087/proxy/applications?offset=0&limit=10&order=name|DESC&filter={}',
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
