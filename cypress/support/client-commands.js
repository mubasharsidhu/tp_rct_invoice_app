
Cypress.Commands.add('manageClient', (client) => {

  cy.get('#clientName').clear().type(`${client.name}`);
  cy.get('#email').clear().type(`${client.email}`);
  cy.get('#companyName').clear().type(`${client.companyDetails.name}`);
  cy.get('#companyAddress').clear().type(`${client.companyDetails.address}`);
  cy.get('#companyTaxNumber').clear().type(`${client.companyDetails.vatNumber}`);
  cy.get('#companyRegNumber').clear().type(`${client.companyDetails.regNumber}{enter}`);

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


Cypress.Commands.add('get2ClientsViaAPI', () => {

  cy.getCookie('userToken').should('exist').then((userToken) => {

    const queryParams = {
      offset: 1,
      limit : 2,
      sort  : {
        clientName: 'asc',
      }
    }

    const encodeParamsString = encodeURIComponent(JSON.stringify(queryParams));

    cy.request({
      method : 'GET',
      url    : `${Cypress.env('invoiceApiHost')}/clients?params=${encodeParamsString}`,
      auth: {
        'bearer': userToken.value
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('clients');
      return response.body.clients;
    });
  })

});


Cypress.Commands.add('invoiceForClient', () => {

  cy.get("#clientsTableData tr td .moreToolTip:first").click();
  cy.get(".dropDownMoreMenu").contains("Add a new invoice for the client").click();
  cy.wait(1200);
  cy.url().should('include', `/invoices/add?clientID=`);
  cy.get("#invoice-form").should('be.visible');
  cy.get("#invoice-form #clientID").should('be.ok');
  cy.get("#client-company-table").should("be.visible");

});
