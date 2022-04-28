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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('any', { prevSubject: 'element' }, (subject, size = 1) => {
  cy.wrap(subject).then(elementList => {
    elementList = (elementList.jquery) ? elementList.get() : elementList;
    elementList = Cypress._.sampleSize(elementList, size);
    elementList = (elementList.length > 1) ? elementList : elementList[0];
    cy.wrap(elementList);
  });
});


Cypress.Commands.add('signup', (user, misMatchIt="") => {

  cy.get('#name').type(`${user.userName}`);
  cy.get('#email').type(`${user.userEmail}`);
  cy.get('#password').type(`${user.userPassword}`);
  cy.get('#confirmPassword').type(`${misMatchIt}${user.userPassword}{enter}`);

});


Cypress.Commands.add('login', (email, password) => {
  cy.get('#email').type(`${email}`);
  cy.get('#password').type(`${password}{enter}`);
});


Cypress.Commands.add('loginViaAPI', (email, password) => {

  const url  = `${Cypress.env('invoiceApiHost')}/login`;
  const body = { email: email, password: password };

  cy.request('POST', url, body).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    cy.setCookie('userToken', response.body.token);
  });

});


Cypress.Commands.add('loginWithSuccess', (email, password) => {
  cy.login(email, password);
  cy.wait(1000);
  cy.getCookie('userToken').should('exist');
  cy.url().should('include', '/');
});


Cypress.Commands.add('logout', () => {
  cy.get('#settings-menu').should('exist').click();
  cy.get('#account-menu .logout').click();
  cy.wait(500);
  cy.getCookie('userToken').should('not.exist');
});


Cypress.Commands.add('logoutViaAPI', () => {
  cy.clearCookie('userToken');
  cy.getCookie('userToken').should('not.exist');
});


Cypress.Commands.add('validateSorting', (field, order) => {
  cy.get(`#${field}`).click();
  cy.url().should('include', `orderBy=${field}&order=${order.toLowerCase()}`);
  cy.get(`#${field} .MuiTableSortLabel-iconDirection${order}`).should('be.visible');
});


Cypress.Commands.add('validatePagination', () => {
  cy.get('#pagination li button').each(($el)=>{
    if ($el.hasClass('Mui-disabled') || $el.text() === "") {
      return;
    }
    cy.wrap($el).click();
    cy.url().should('include', `page=${$el.text()}`);
  });
});


Cypress.Commands.add('moreDotEdit', (includeStr) => {
  cy.get(`#${includeStr}sTableData tr td .moreToolTip:first`).click();
  cy.get(".dropDownMoreMenu").contains("Edit").click();
  cy.wait(500);
  cy.url().should('include', `/${includeStr}s`);
  cy.get(`#${includeStr}-form`).should('be.visible');
});


Cypress.Commands.add('rowClickDetail', (includeStr) => {
  cy.get(`#${includeStr}sTableData tbody tr:first`).click();
  cy.wait(500);
  cy.url().should('include', `${includeStr}s/view`);
  cy.get(`#${includeStr}-detail-page`).should('be.visible');
});
