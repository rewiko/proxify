var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

describe('The Register Api', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    // cy.exec('npm run db:reset && npm run db:seed')
  })

  it('should be able to register as user', function () {
    var guidData = guid();
    const user = {
      username: "userregister" + guidData,
      email: guidData + "user@useregister.com",
      password: "password" + guidData
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/admin/auth/signup',
      body: user
    }).then(function (response) {
      cy.expect(response.status).to.eq(200);
    //   {
    //     "meta":{
    //        "count":1
    //     },
    //     "data":{
    //        "firstName":"",
    //        "lastName":"",
    //        "lang":"en",
    //        "admin":false,
    //        "disabled":false,
    //        "gravatar":"b027dca067042b4d82f7ebd6b464b6ae",
    //        "id":5,
    //        "email":"user@emaik.com",
    //        "username":"userk",
    //        "updatedAt":"2018-10-31T17:58:54.088Z",
    //        "createdAt":"2018-10-31T17:58:54.088Z"
    //     },
    //     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiIiLCJsYXN0TmFtZSI6IiIsImxhbmciOiJlbiIsImFkbWluIjpmYWxzZSwiZGlzYWJsZWQiOmZhbHNlLCJncmF2YXRhciI6ImIwMjdkY2EwNjcwNDJiNGQ4MmY3ZWJkNmI0NjRiNmFlIiwiaWQiOjUsImVtYWlsIjoidXNlckBlbWFpay5jb20iLCJ1c2VybmFtZSI6InVzZXJrIiwidXBkYXRlZEF0IjoiMjAxOC0xMC0zMVQxNzo1ODo1NC4wODhaIiwiY3JlYXRlZEF0IjoiMjAxOC0xMC0zMVQxNzo1ODo1NC4wODhaIiwiaWF0IjoxNTQxMDA4NzM0fQ.gqAlufSfLrSZ--gjn0S-Tyns7tyF5Nvhgp-WuaSHLrs"
    //  }
      cy.expect(response.status).to.eq(200);
      cy.expect(response.body).to.have.property('token')
      cy.expect(response.body).to.have.property('data')
      cy.expect(response.body.data).to.have.property('email')
      cy.expect(response.body.data).to.have.property('username')
      cy.expect(response.body.data).to.have.property('id')
      cy.expect(response.body.data).to.have.property('lastName')
      cy.expect(response.body.data).to.have.property('firstName')
    })
  })

  it('shouldnt be able to register as admina', function () {
    const user = {
      username: "userregister",
      email: "user@useregister.com",
      password: "pass"
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:8087/admin/auth/signup',
      body: user,
      failOnStatusCode: false
    }).then(function (response) {
      cy.expect(response.status).to.eq(500);
    })
  })
})
