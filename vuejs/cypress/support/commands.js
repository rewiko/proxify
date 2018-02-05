// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import cookies from 'js-cookie'
Cypress.Commands.add("login", (userType, options = {}) => {

  const types = {
    admin: {
      login: "admin",
      password: "admin",
    },
    user: {
      login: "user",
      password: "user",
    }
  };

  // grab the user
  const user = types[userType]

  cy.request({
    method: 'POST',
    url: 'http://localhost:8087/admin/auth/login',
    body: user
  }).then(function (response) {
    cookies.set('Authorization', response.body.token, { expires: 7 });
  })
})

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
