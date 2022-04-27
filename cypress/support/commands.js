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
  cy.wait(300);
  cy.getCookie('userToken').should('exist');
  cy.url().should('include', '/');
});


Cypress.Commands.add('logout', () => {
  cy.get('#settings-menu').should('exist').click();
  cy.get('#account-menu .logout').click();
  cy.getCookie('userToken').should('not.exist');
});


Cypress.Commands.add('logoutViaAPI', () => {
  cy.clearCookie('userToken');
  cy.getCookie('userToken').should('not.exist');
});


Cypress.Commands.add('addClientViaAPI', (client) => {

  cy.getCookie('userToken').should('exist').then((userToken) => {

    cy.request({
      method : 'POST',
      url    : `${Cypress.env('invoiceApiHost')}/clients`,
      body   : client,
      auth: {
        'bearer': userToken.value
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.client).to.have.property('id');
      return response.body.client.id;
    });
  })


});


Cypress.Commands.add('manageClient', (client) => {

  cy.get('#clientName').clear().type(`${client.name}`);
  cy.get('#email').clear().type(`${client.email}`);
  cy.get('#companyName').clear().type(`${client.companyDetails.name}`);
  cy.get('#companyAddress').clear().type(`${client.companyDetails.address}`);
  cy.get('#companyTaxNumber').clear().type(`${client.companyDetails.vatNumber}`);
  cy.get('#companyRegNumber').clear().type(`${client.companyDetails.regNumber}{enter}`);

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


Cypress.Commands.add('manageInvoice', (client) => {

  cy.get("#clientID").clear().type(`${client.clientName}`);
  cy.wait(1000);
  cy.get("#clientID").type('{downarrow}{downarrow}{enter}');
  cy.get("#client-company-table").should("be.visible");

  cy.get('#invoiceDate').next().click();
  cy.wait(1000);
  cy.get('.MuiCalendarPicker-root div[role=grid] div[role=row] div[role=cell] button:not(:disabled)').first().click();

  cy.get('#invoiceDueDate').next().click();
  cy.wait(1000);
  cy.get('.MuiCalendarPicker-root div[role=grid] div[role=row] div[role=cell] button:not(:disabled)').any().click();

  cy.get('#invoiceNumber').clear().type(`${client.invoice_number}`);
  cy.get('#projectCode').clear().type(`${client.projectCode}`);

  cy.wrap(client.meta).each((data, index)=>{
    cy.get(".metaItems .item").eq(index).type(data.item);
    cy.get(".metaItems .price").eq(index).type(data.price);
    cy.get("#add-new-metaitem").click();
  });

  cy.get('.metaItems:last button').click();
  cy.wait(3000)
  cy.get('#invoice-form-submit-btn').click();

});


Cypress.Commands.add('any', { prevSubject: 'element' }, (subject, size = 1) => {
  cy.wrap(subject).then(elementList => {
    elementList = (elementList.jquery) ? elementList.get() : elementList;
    elementList = Cypress._.sampleSize(elementList, size);
    elementList = (elementList.length > 1) ? elementList : elementList[0];
    cy.wrap(elementList);
  });
});
