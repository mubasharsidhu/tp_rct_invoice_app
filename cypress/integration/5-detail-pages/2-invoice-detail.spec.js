
describe('The Invoice Detail page', () => {

  let invoiceID;
  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.get2InvoicesViaAPI().as('invoices');
    cy.get('@invoices').then((invoices) => {
      invoiceID    = invoices[0].invoice.id;
      cy.visit(`/invoices/view/${invoiceID}`);
    });

  });


  it("should display the invoice tables exist", () => {
    cy.get(`#billedTo`).should('be.visible');
    cy.get(`#invoiceInformation`).should('be.visible');
    cy.get(`#invoicesTableData`).should('be.visible');
    cy.get(`#summeryTable`).should('be.visible');
  });


  it("should click on 'Print Invoice' button to print invoice", () => {
    cy.wait(1000);
    cy.get("#printInvoice").should('exist').click();
  });

});
