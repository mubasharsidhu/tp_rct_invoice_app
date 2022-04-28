
describe('The Client Detail page', () => {

  let clientID;
  let clientLabel;
  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.get2ClientsViaAPI().as('clients');
    cy.get('@clients').then((clients) => {
      clientID    = clients[0].id;
      clientLabel = clients[0].name;
      cy.visit(`/clients/view/${clientID}`);
    });

  });


  it("should display the client tables exist", () => {
    cy.get(`#clientDetail`).should('be.visible');
    cy.get(`#clientCompanyDetail`).should('be.visible');
    cy.get(`#invoicesTableData`).should('be.visible');
  });


  it("should click the 'Add Invoice' button to open invoice form page", () => {
    cy.get("#addInvoice").click();
    cy.wait(1000);
    cy.url().should('include', `/invoices/add?clientID=${clientID}`);
    cy.get("#invoice-form").should('be.visible');
    cy.wait(300);
    cy.get("#invoice-form #clientID").should('be.ok');
    cy.get("#client-company-table").should("be.visible");
  });


  it("should click the 'View More Invoices' button to open invoices list of that client", () => {
    cy.wait(1000);
    cy.get("#invoicesListButton").click();
    cy.wait(1000);
    cy.url().should('include', `/invoices?clientID=${clientID}`);
    cy.get('#invoice-page').should('be.visible');

    cy.get("#clientFilter").click().type(`${clientLabel}`, { delay: 0});
    cy.wait(300);
    cy.get("#clientFilter").type('{moveToEnd}');
    cy.wait(200);
    cy.get("#clientFilter").type('{downarrow}{enter}');
    cy.wait(300);
  });


  it("should click an invoice table row and open the invoice detail page", () => {
    cy.rowClickDetail('invoice');
  });


  it("should click the more:dots of a row and click on Edit link to open edit page", () => {
    cy.moreDotEdit('invoice');
  });


  it("should click the more:dots of a row and click on 'Print Invoice' link to print invoice", () => {
    cy.get("#invoicesTableData tr td .moreToolTip:first").click();
    cy.wait(1000);
    cy.get(".dropDownMoreMenu").contains("Print Invoice").click();
    cy.wait(300);
    cy.url().should('include', `/invoices/view/`);
    cy.url().should('include', `#print`);
    cy.get("#invoice-detail-page").should('be.visible');
  });

});
