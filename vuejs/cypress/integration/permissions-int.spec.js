describe('The Login Api', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  it('should be able to get admin permission list', function () {

    cy.request({
      method: 'GET',
      url: 'http://localhost:8087/admin/permissions?offset=0&limit=10&order=name|DESC&filter={}',
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    })
  })
})
