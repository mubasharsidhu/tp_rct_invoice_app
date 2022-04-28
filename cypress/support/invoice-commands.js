
Cypress.Commands.add('manageInvoice', (invoice) => {

  cy.get("#clientID").clear().type(`${invoice.clientName}`, { delay: 0});
  cy.wait(300);
  cy.get("#clientID").type('{moveToEnd}');
  cy.wait(300);
  cy.get("#clientID").type('{downarrow}{enter}');
  cy.wait(1000);
  cy.get("#client-company-table").should("be.visible");

  cy.get('#invoiceDate').click();
  cy.get('#invoiceDate').next().click("topRight");
  cy.wait(200);

  cy.get('.MuiCalendarPicker-root div[role=grid] div[role=row] div[role=cell] button:not(:disabled)').first().click();

  cy.get('#invoiceDueDate').next().click();
  cy.wait(300);
  cy.get('.MuiCalendarPicker-root div[role=grid] div[role=row] div[role=cell] button:not(:disabled)').any().click();

  cy.get('#invoiceNumber').clear().type(`${invoice.invoice_number}`);
  cy.get('#projectCode').clear().type(`${invoice.projectCode}`);

  cy.get(".metaItems button").each(($el, index, $list)=>{
    if ( index < ($list.length-1)  ) {
      cy.wrap($el).click();
    }
  });

  cy.wrap(invoice.meta).each((data, index)=>{
    cy.get(".metaItems .item").eq(index).type("{selectall}{backspace}{selectall}{backspace}");
    cy.get(".metaItems .item").eq(index).type(data.item);
    cy.get(".metaItems .price").eq(index).clear("{selectall}{backspace}{selectall}{backspace}");
    cy.get(".metaItems .price").eq(index).type(data.price);
    cy.get("#add-new-metaitem").click();
  });

  cy.get('.metaItems:last button').click();
  cy.wait(300);
  cy.get('#invoice-form-submit-btn').click();

});


Cypress.Commands.add('addInvoiceViaAPI', (invoice) => {

  cy.getCookie('userToken').should('exist').then((userToken)=>{
    cy.request({
      method : 'POST',
      url    : `${Cypress.env('invoiceApiHost')}/invoices`,
      body   : invoice,
      auth: {
        'bearer': userToken.value
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.invoice).to.have.property('id');
      return response.body.invoice.id;
    });
  });

});


Cypress.Commands.add('get2InvoicesViaAPI', () => {

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
      url    : `${Cypress.env('invoiceApiHost')}/invoices?params=${encodeParamsString}`,
      auth: {
        'bearer': userToken.value
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('invoices');
      return response.body.invoices;
    });
  })

});
