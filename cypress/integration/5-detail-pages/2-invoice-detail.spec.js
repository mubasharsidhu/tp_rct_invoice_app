
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
    });

  });


  it("should display the invoice tables exist", () => {
    cy.visit(`/invoices/view/${invoiceID}`);
    cy.wait(1000);
    cy.get(`#billedTo`).should('be.visible');
    cy.get(`#invoiceInformation`).should('be.visible');
    cy.get(`#invoicesTableData`).should('be.visible');
    cy.get(`#summeryTable`).should('be.visible');
  });


  it('Print button renders & opens modal', () => {
    cy.visit(`/invoices/view/${invoiceID}`, {
      onBeforeLoad: win => {
        cy.stub(win, 'print').as('print');
      },
    });
    cy.wait(1000);
    cy.get("#printInvoice")
      .should('exist')
      .and('be.visible')
      .click();
    cy.wait(1000);
    cy.window().then(win => {
      win.print();
      expect(win.print).to.be.calledOnce;
    });

  });


});
