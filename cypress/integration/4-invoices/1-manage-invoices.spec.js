describe('The Add/Edit Invoice page', () => {

  let datasetInvoices;
  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.fixture('invoices.json').then(function (data) {
      datasetInvoices = data;
    });

  });


  it("should display empty-form validation", () => {

    cy.visit('/invoices/add');

    cy.get('#invoice-form').submit();
    cy.get('#clientID')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Client Name is a required field');
    cy.get('#invoiceDate')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Invoice Date is a required field and must be a valid date (mm/dd/yyyy)');
    cy.get('#invoiceDueDate')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Invoice Due Date is a required field and must be a valid date (mm/dd/yyyy)');
    cy.get('#invoiceNumber')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Invoice Number is a required field');
    cy.get('#projectCode')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Project Code is a required field');
    cy.get('.metaItems .item input')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Item is a required field');
    cy.get('.metaItems .price input')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Price must be a positive number');

  });



  it("should insert an invoice successfuly and redirect to invoices page", () => {

    cy.visit('/invoices/add');
    const invoice = datasetInvoices.invoices.invoicetester;
    cy.manageInvoice(invoice);
    cy.wait(1000);
    cy.url().should('include', '/invoices');
    cy.get('#invoice-page').should('be.visible');

  });



  it("should display validation error onSubmit", () => {

    cy.visit('/invoices/add');
    const invoice = datasetInvoices.invoices.invoicetester;
    cy.manageInvoice(invoice);
    cy.get('#invoice-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });



  // Add a few more invoices for pagination and other Testings
  it("should successfully add a few more invoices via API", () => {

    const moreinvoices = datasetInvoices.invoices.moreinvoices;

    cy.get2ClientsViaAPI().as('clients');
    cy.get('@clients').then((clients) => {

      cy.wrap(moreinvoices).each((invoice, index)=>{
        invoice.client_id = index >= 6 ? clients[0].id : clients[1].id;
        delete invoice.clientName;
        cy.addInvoiceViaAPI(invoice);
      });
    });

  });


  it("should edit the invoice and redirect to invoices page after successful invoice edit", () => {

    const invoices = cy.get2InvoicesViaAPI().as('invoices');
    cy.get('@invoices').then((invoices) => {
      const invoiceID = invoices[0].invoice.id;
      cy.visit(`/invoices/${invoiceID}`);
      const invoiceEdit = datasetInvoices.invoices.invoice6testerEdit;
      cy.manageInvoice(invoiceEdit, `${invoiceID}`);
      cy.url().should('include', '/invoices');
      cy.get('#invoice-page').should('be.visible');
    });

  });


});
