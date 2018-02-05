describe('Role Api', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  it('should be able to get admin role list', function () {

    cy.request({
      method: 'GET',
      url: 'http://localhost:8087/admin/roles?offset=0&limit=10&order=name|ASC&filter={}',
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
