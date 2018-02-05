describe('The Login Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
  })

  it('should be able to login as admin', function () {
    cy.login('admin')
  })
  it('should be able to login as user', function () {
    cy.login('user')
  })

  it('shouldnt be able to login as admina', function () {

    const user = {
      login: "admina",
      password: "admina",
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/admin/auth/login',
      body: user,
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(401);
      cy.expect(response.body.error.message).to.eq("Login admina not found.");
    })
  })
})
