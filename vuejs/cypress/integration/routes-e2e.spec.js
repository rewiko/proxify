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

describe('Routes Page', function () {
  beforeEach(function () {
    cy.login('admin')
  })

  sizes.forEach((size) => {

    it(`should be able to paginate - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/routes')
      // stub server
      cy.server()
      cy.route('/admin/routes?offset=10&limit=10&order=path|DESC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 63 }, "data": [{ "id": 61, "path": "/third_party/private", "method": "get", "uniqpathmethod": "/third_party/privateget", "createdAt": "2019-01-07T19:17:43.738Z", "updatedAt": "2019-01-07T19:17:43.738Z", "permissions": [] }, { "id": 64, "path": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "method": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "uniqpathmethod": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "createdAt": "2019-01-20T14:32:06.394Z", "updatedAt": "2019-01-20T14:32:06.394Z", "permissions": [] }, { "id": 63, "path": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "method": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "uniqpathmethod": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bbtest-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "createdAt": "2019-01-20T14:31:58.627Z", "updatedAt": "2019-01-20T14:31:58.627Z", "permissions": [] }, { "id": 62, "path": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "method": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "uniqpathmethod": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2btest-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "createdAt": "2019-01-20T14:31:28.014Z", "updatedAt": "2019-01-20T14:31:28.014Z", "permissions": [] }, { "id": 47, "path": "/proxy/applications", "method": "get", "uniqpathmethod": "/proxy/applicationsget", "createdAt": "2019-01-07T19:17:43.676Z", "updatedAt": "2019-01-07T19:17:43.676Z", "permissions": [] }, { "id": 51, "path": "/proxy/application/:id", "method": "patch", "uniqpathmethod": "/proxy/application/:idpatch", "createdAt": "2019-01-07T19:17:43.693Z", "updatedAt": "2019-01-07T19:17:43.693Z", "permissions": [] }, { "id": 48, "path": "/proxy/application/:id", "method": "get", "uniqpathmethod": "/proxy/application/:idget", "createdAt": "2019-01-07T19:17:43.676Z", "updatedAt": "2019-01-07T19:17:43.676Z", "permissions": [] }, { "id": 53, "path": "/proxy/application/:id", "method": "delete", "uniqpathmethod": "/proxy/application/:iddelete", "createdAt": "2019-01-07T19:17:43.699Z", "updatedAt": "2019-01-07T19:17:43.699Z", "permissions": [] }, { "id": 50, "path": "/proxy/application/:id", "method": "put", "uniqpathmethod": "/proxy/application/:idput", "createdAt": "2019-01-07T19:17:43.687Z", "updatedAt": "2019-01-07T19:17:43.687Z", "permissions": [] }, { "id": 49, "path": "/proxy/application", "method": "post", "uniqpathmethod": "/proxy/applicationpost", "createdAt": "2019-01-07T19:17:43.682Z", "updatedAt": "2019-01-07T19:17:43.682Z", "permissions": [] }] }
      ).as('Routes')

      cy.wait(1000)
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)
      cy.get('[data-cy="pagination-table"] > .active + li a').click()

      cy.wait('@Routes').then(function (xhr) {
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
      cy.url().should('include', '/admin/route/')

    })

    it(`should be able to filter - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/routes')
      // stub server
      cy.server()
      cy.route('/admin/routes?offset=0&limit=10&order=path|DESC&filter={"path":"p"}',
        { "meta": { "offset": 0, "limit": 10, "count": 29 }, "data": [{ "id": 61, "path": "/third_party/private", "method": "get", "uniqpathmethod": "/third_party/privateget", "createdAt": "2019-01-07T19:17:43.738Z", "updatedAt": "2019-01-07T19:17:43.738Z", "permissions": [] }, { "id": 64, "path": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "method": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "uniqpathmethod": "test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6test-app29285b40-1cc0-11e9-815a-138d3fb4b2a6", "createdAt": "2019-01-20T14:32:06.394Z", "updatedAt": "2019-01-20T14:32:06.394Z", "permissions": [] }, { "id": 63, "path": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "method": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "uniqpathmethod": "test-app24a01400-1cc0-11e9-b7b2-15630d4949bbtest-app24a01400-1cc0-11e9-b7b2-15630d4949bb", "createdAt": "2019-01-20T14:31:58.627Z", "updatedAt": "2019-01-20T14:31:58.627Z", "permissions": [] }, { "id": 62, "path": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "method": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "uniqpathmethod": "test-app125f6110-1cc0-11e9-9324-ed70453b2a2btest-app125f6110-1cc0-11e9-9324-ed70453b2a2b", "createdAt": "2019-01-20T14:31:28.014Z", "updatedAt": "2019-01-20T14:31:28.014Z", "permissions": [] }, { "id": 47, "path": "/proxy/applications", "method": "get", "uniqpathmethod": "/proxy/applicationsget", "createdAt": "2019-01-07T19:17:43.676Z", "updatedAt": "2019-01-07T19:17:43.676Z", "permissions": [] }, { "id": 51, "path": "/proxy/application/:id", "method": "patch", "uniqpathmethod": "/proxy/application/:idpatch", "createdAt": "2019-01-07T19:17:43.693Z", "updatedAt": "2019-01-07T19:17:43.693Z", "permissions": [] }, { "id": 48, "path": "/proxy/application/:id", "method": "get", "uniqpathmethod": "/proxy/application/:idget", "createdAt": "2019-01-07T19:17:43.676Z", "updatedAt": "2019-01-07T19:17:43.676Z", "permissions": [] }, { "id": 53, "path": "/proxy/application/:id", "method": "delete", "uniqpathmethod": "/proxy/application/:iddelete", "createdAt": "2019-01-07T19:17:43.699Z", "updatedAt": "2019-01-07T19:17:43.699Z", "permissions": [] }, { "id": 50, "path": "/proxy/application/:id", "method": "put", "uniqpathmethod": "/proxy/application/:idput", "createdAt": "2019-01-07T19:17:43.687Z", "updatedAt": "2019-01-07T19:17:43.687Z", "permissions": [] }, { "id": 49, "path": "/proxy/application", "method": "post", "uniqpathmethod": "/proxy/applicationpost", "createdAt": "2019-01-07T19:17:43.682Z", "updatedAt": "2019-01-07T19:17:43.682Z", "permissions": [] }] }
      ).as('Routes')

      cy.wait(1000)

      cy.get('.card-body > div > table > tbody > tr  > td').children().first().type(`p{enter}`)
      cy.get('.card-body > div > table > tbody > tr + tr> td').contains('p')
      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Routes').then(function (xhr) {
        console.log("xhr debug ", xhr)
      }).its('status').should('equal', 200);
      testSidebar(size);
    })

    it(`should be able to order - viewport ${size}`, function () {
      defineViewPort(size)

      cy.visit('/admin/routes')
      // stub server
      cy.server()
      cy.route('/admin/routes?offset=0&limit=10&order=path|ASC&filter={}',
        { "meta": { "offset": 0, "limit": 10, "count": 63 }, "data": [{ "id": 52, "path": "/", "method": "get", "uniqpathmethod": "/get", "createdAt": "2019-01-07T19:17:43.699Z", "updatedAt": "2019-01-07T19:17:43.699Z", "permissions": [] }, { "id": 45, "path": "/admin/auth/login", "method": "post", "uniqpathmethod": "/admin/auth/loginpost", "createdAt": "2019-01-07T19:17:43.667Z", "updatedAt": "2019-01-07T19:17:43.667Z", "permissions": [] }, { "id": 46, "path": "/admin/auth/signup", "method": "post", "uniqpathmethod": "/admin/auth/signuppost", "createdAt": "2019-01-07T19:17:43.670Z", "updatedAt": "2019-01-07T19:17:43.670Z", "permissions": [] }, { "id": 11, "path": "/admin/group", "method": "post", "uniqpathmethod": "/admin/grouppost", "createdAt": "2019-01-07T19:17:43.436Z", "updatedAt": "2019-01-07T19:17:43.436Z", "permissions": [] }, { "id": 13, "path": "/admin/group/:id", "method": "patch", "uniqpathmethod": "/admin/group/:idpatch", "createdAt": "2019-01-07T19:17:43.454Z", "updatedAt": "2019-01-07T19:17:43.454Z", "permissions": [] }, { "id": 10, "path": "/admin/group/:id", "method": "get", "uniqpathmethod": "/admin/group/:idget", "createdAt": "2019-01-07T19:17:43.436Z", "updatedAt": "2019-01-07T19:17:43.436Z", "permissions": [] }, { "id": 12, "path": "/admin/group/:id", "method": "put", "uniqpathmethod": "/admin/group/:idput", "createdAt": "2019-01-07T19:17:43.445Z", "updatedAt": "2019-01-07T19:17:43.445Z", "permissions": [] }, { "id": 14, "path": "/admin/group/:id", "method": "delete", "uniqpathmethod": "/admin/group/:iddelete", "createdAt": "2019-01-07T19:17:43.462Z", "updatedAt": "2019-01-07T19:17:43.462Z", "permissions": [] }, { "id": 9, "path": "/admin/groups", "method": "get", "uniqpathmethod": "/admin/groupsget", "createdAt": "2019-01-07T19:17:43.431Z", "updatedAt": "2019-01-07T19:17:43.431Z", "permissions": [] }, { "id": 41, "path": "/admin/language", "method": "post", "uniqpathmethod": "/admin/languagepost", "createdAt": "2019-01-07T19:17:43.651Z", "updatedAt": "2019-01-07T19:17:43.651Z", "permissions": [] }] }
      ).as('Routes')

      cy.wait(1000)
      var firstText = '';
      cy.get('.card-body > div > table > tbody > tr + tr> td').first().then((element) => {
        firstText = element.text()
      });
      cy.get('.card-body > div > table > thead > tr').children().first().click()


      cy.get('[data-cy="pagination-table"] > .active').contains('1')
      cy.get('.card-body > div > table > tbody').children().should('have.length', 11)

      cy.wait('@Routes').then(function (xhr) {
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
