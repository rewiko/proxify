describe('The Profile Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
    cy.login('admin')
  })

  it('shouldnt be able to update my profile', function () {

    const user = {
      data : {
        username: "admin",
        email: "admin@localhost.com",
        password: "admin",
      }
    }

    cy.request({
      method: 'PUT',
      url: 'http://localhost:8087/admin/user/me',
      body: user
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
