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

describe('Users Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/users')
      // stub server
      cy.server()
      cy.route('/admin/users?offset=10&limit=10&order=username|DESC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 13 }, "data": [{ "id": 13, "username": "User-k", "email": "userk@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "25d9a7c61c2ab1c2fedc61c21c2e80a2", "createdAt": "2019-01-20T17:51:10.185Z", "updatedAt": "2019-01-20T17:51:10.185Z", "groups": [] }, { "id": 12, "username": "User-j", "email": "userj@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "bf1284ecb3ea09f7e9132d2c22abc971", "createdAt": "2019-01-20T17:51:10.048Z", "updatedAt": "2019-01-20T17:51:10.048Z", "groups": [] }, { "id": 11, "username": "User-i", "email": "useri@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "503feac720cf579045d2defd195291b7", "createdAt": "2019-01-20T17:51:09.916Z", "updatedAt": "2019-01-20T17:51:09.916Z", "groups": [] }, { "id": 10, "username": "User-h", "email": "userh@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "21f4863fadfb182d012bbc35f55d279d", "createdAt": "2019-01-20T17:51:09.785Z", "updatedAt": "2019-01-20T17:51:09.785Z", "groups": [] }, { "id": 9, "username": "User-g", "email": "userg@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "92163c477ced54d91700bab6d4208799", "createdAt": "2019-01-20T17:51:09.656Z", "updatedAt": "2019-01-20T17:51:09.656Z", "groups": [] }, { "id": 8, "username": "User-f", "email": "userf@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7edfccadb93284611fbebfc83dbfd7e3", "createdAt": "2019-01-20T17:51:09.525Z", "updatedAt": "2019-01-20T17:51:09.525Z", "groups": [] }, { "id": 7, "username": "User-e", "email": "usere@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "b6ed6ff728d049e218c23e965d3d7836", "createdAt": "2019-01-20T17:51:09.389Z", "updatedAt": "2019-01-20T17:51:09.389Z", "groups": [] }, { "id": 6, "username": "User-d", "email": "userd@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "ca2d6e9d362dae824b7d7d3e42760c80", "createdAt": "2019-01-20T17:51:09.253Z", "updatedAt": "2019-01-20T17:51:09.253Z", "groups": [] }, { "id": 5, "username": "User-c", "email": "userc@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "11115476da2de7f41572a1e123eeffb1", "createdAt": "2019-01-20T17:51:09.120Z", "updatedAt": "2019-01-20T17:51:09.120Z", "groups": [] }, { "id": 4, "username": "User-b", "email": "userb@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7e6fd3f71a90106da2898cbb115a465f", "createdAt": "2019-01-20T17:51:08.971Z", "updatedAt": "2019-01-20T17:51:08.971Z", "groups": [] }] }
      ).as('Users')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Users').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);

      testSidebar(size);

      cy.get('[data-cy="pagination-table"] > .active').contains('2')
      cy.get('.card-body > div > table > tbody').children().should('have.length.to.be.greaterThan', 0)
      // cy.get('thead > tr > [aria-colindex="1"]').click();
      cy.wait(1000)
      cy.get('[data-cy="select-table"]').select('25')
      cy.get('.card-body > div > table > tbody').children().should(($div) => {
        expect($div).to.have.length.greaterThan(5)
      })

      cy.wait(1000)
      cy.get('.card-body > div > table > tbody > tr + tr > td:last-child > span a.btn-info').first().click()
      cy.wait(1000)
      cy.url().should('include', '/admin/user/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/users')
      // stub server
      cy.server()
      cy.route('/admin/users?offset=0&limit=10&order=username|DESC&filter={"username":"s"}',
        { "meta": { "offset": 0, "limit": 10, "count": 12 }, "data": [{ "id": 13, "username": "User-k", "email": "userk@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "25d9a7c61c2ab1c2fedc61c21c2e80a2", "createdAt": "2019-01-20T17:51:10.185Z", "updatedAt": "2019-01-20T17:51:10.185Z", "groups": [] }, { "id": 12, "username": "User-j", "email": "userj@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "bf1284ecb3ea09f7e9132d2c22abc971", "createdAt": "2019-01-20T17:51:10.048Z", "updatedAt": "2019-01-20T17:51:10.048Z", "groups": [] }, { "id": 11, "username": "User-i", "email": "useri@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "503feac720cf579045d2defd195291b7", "createdAt": "2019-01-20T17:51:09.916Z", "updatedAt": "2019-01-20T17:51:09.916Z", "groups": [] }, { "id": 10, "username": "User-h", "email": "userh@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "21f4863fadfb182d012bbc35f55d279d", "createdAt": "2019-01-20T17:51:09.785Z", "updatedAt": "2019-01-20T17:51:09.785Z", "groups": [] }, { "id": 9, "username": "User-g", "email": "userg@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "92163c477ced54d91700bab6d4208799", "createdAt": "2019-01-20T17:51:09.656Z", "updatedAt": "2019-01-20T17:51:09.656Z", "groups": [] }, { "id": 8, "username": "User-f", "email": "userf@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7edfccadb93284611fbebfc83dbfd7e3", "createdAt": "2019-01-20T17:51:09.525Z", "updatedAt": "2019-01-20T17:51:09.525Z", "groups": [] }, { "id": 7, "username": "User-e", "email": "usere@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "b6ed6ff728d049e218c23e965d3d7836", "createdAt": "2019-01-20T17:51:09.389Z", "updatedAt": "2019-01-20T17:51:09.389Z", "groups": [] }, { "id": 6, "username": "User-d", "email": "userd@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "ca2d6e9d362dae824b7d7d3e42760c80", "createdAt": "2019-01-20T17:51:09.253Z", "updatedAt": "2019-01-20T17:51:09.253Z", "groups": [] }, { "id": 5, "username": "User-c", "email": "userc@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "11115476da2de7f41572a1e123eeffb1", "createdAt": "2019-01-20T17:51:09.120Z", "updatedAt": "2019-01-20T17:51:09.120Z", "groups": [] }, { "id": 4, "username": "User-b", "email": "userb@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7e6fd3f71a90106da2898cbb115a465f", "createdAt": "2019-01-20T17:51:08.971Z", "updatedAt": "2019-01-20T17:51:08.971Z", "groups": [] }] }
      ).as('Users')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`s{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('s')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length.to.be.greaterThan', 0)

      cy.wait('@Users').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/users')
      // stub server
      cy.server()
      cy.route('/admin/users?offset=0&limit=10&order=username|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 13 }, "data": [{ "id": 1, "username": "admin", "email": "admin@localhost.com", "firstName": "Admin", "lastName": "Administrator", "lang": "en", "admin": true, "disabled": false, "gravatar": "e6d67fed862c439aa6e911ce49c7857d", "createdAt": "2019-01-20T17:51:07.362Z", "updatedAt": "2019-01-20T17:51:07.362Z", "groups": [] }, { "id": 2, "username": "user", "email": "user@localhost.com", "firstName": "User", "lastName": "User", "lang": "en", "admin": false, "disabled": false, "gravatar": "e379f0e6bf0223cdeecb9e444b0a62e7", "createdAt": "2019-01-20T17:51:07.514Z", "updatedAt": "2019-01-20T17:51:07.514Z", "groups": [{ "id": 1, "name": "Group-User", "description": null, "active": true, "createdAt": "2019-01-20T17:51:08.644Z", "updatedAt": "2019-01-20T17:51:08.644Z", "userGroup": { "createdAt": "2019-01-20T17:51:08.811Z", "updatedAt": "2019-01-20T17:51:08.811Z", "groupId": 1, "userId": 2 } }] }, { "id": 3, "username": "User-a", "email": "usera@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "d4cfa68643a0124cbf096819848a8876", "createdAt": "2019-01-20T17:51:08.832Z", "updatedAt": "2019-01-20T17:51:08.832Z", "groups": [] }, { "id": 4, "username": "User-b", "email": "userb@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7e6fd3f71a90106da2898cbb115a465f", "createdAt": "2019-01-20T17:51:08.971Z", "updatedAt": "2019-01-20T17:51:08.971Z", "groups": [] }, { "id": 5, "username": "User-c", "email": "userc@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "11115476da2de7f41572a1e123eeffb1", "createdAt": "2019-01-20T17:51:09.120Z", "updatedAt": "2019-01-20T17:51:09.120Z", "groups": [] }, { "id": 6, "username": "User-d", "email": "userd@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "ca2d6e9d362dae824b7d7d3e42760c80", "createdAt": "2019-01-20T17:51:09.253Z", "updatedAt": "2019-01-20T17:51:09.253Z", "groups": [] }, { "id": 7, "username": "User-e", "email": "usere@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "b6ed6ff728d049e218c23e965d3d7836", "createdAt": "2019-01-20T17:51:09.389Z", "updatedAt": "2019-01-20T17:51:09.389Z", "groups": [] }, { "id": 8, "username": "User-f", "email": "userf@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "7edfccadb93284611fbebfc83dbfd7e3", "createdAt": "2019-01-20T17:51:09.525Z", "updatedAt": "2019-01-20T17:51:09.525Z", "groups": [] }, { "id": 9, "username": "User-g", "email": "userg@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "92163c477ced54d91700bab6d4208799", "createdAt": "2019-01-20T17:51:09.656Z", "updatedAt": "2019-01-20T17:51:09.656Z", "groups": [] }, { "id": 10, "username": "User-h", "email": "userh@user.com", "firstName": "", "lastName": "", "lang": "en", "admin": false, "disabled": false, "gravatar": "21f4863fadfb182d012bbc35f55d279d", "createdAt": "2019-01-20T17:51:09.785Z", "updatedAt": "2019-01-20T17:51:09.785Z", "groups": [] }] }
      ).as('Users')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()

      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Users').then(function (xhr) {
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
