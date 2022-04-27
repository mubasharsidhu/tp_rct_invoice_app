
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


  /* it("should display empty-form validation", () => {

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

  }); */



  it("should create new Invoice successfuly", () => {

    cy.visit('/invoices/add');

    const invoice = datasetInvoices.invoices.invoice1;
    cy.manageInvoice(invoice);

    cy.url().should('include', '/invoices');
    cy.get('#invoice-page').should('be.visible');

  });


  it("should display validation error onSubmit", () => {

    cy.visit('/invoices/add');

    const invoice = datasetInvoices.invoices.invoice1;
    cy.manageInvoice(invoice);

    cy.get('#invoice-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


});
