
describe('The Dashboard page', () => {

  beforeEach(() => {
    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });
    cy.visit('/');
  });



  it("should logout and redirect to login page", () => {
    cy.logout();
    cy.url().should('include', '/login');
    cy.get('#login-form').should('be.visible');
  });


  it("should display clients and invoices table", () => {
    cy.url().should('include', '/');
    cy.get('#dashboard-page').should('be.visible');
    cy.get('#clientsTableData').should('be.visible');
    cy.get('#invoicesTableData').should('be.visible');
  });


  it("should click the dashboard in the menu and display the dashboard", () => {
    cy.get("#menu-dashboard").click();
    cy.wait(300);
    cy.url().should('include', '/');
    cy.get('#dashboard-page').should('be.visible');
  });


  it("should click clients in the menu and display the clients list", () => {
    cy.get("#menu-clients").click();
    cy.wait(2500);
    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');
  });


  it("should click invoices in the menu and display the invoices list", () => {
    cy.get("#menu-invoices").click();
    cy.wait(1000);
    cy.url().should('include', '/invoices');
    cy.get('#invoice-page').should('be.visible');
  });


  it("should click a client table row and open the client detail page", () => {
    cy.rowClickDetail('client');
  });


  it("should click the more:dots of a row and click on Edit link to open edit page", () => {
    cy.moreDotEdit('client');
  });


  it("should click the more:dots of a row and click on 'Add a new invoice for the client' link to open invoice form page", () => {
    cy.invoiceForClient();
  });


  it("should click a client table row and open the client detail page", () => {
    cy.rowClickDetail('invoice');
  });


  it("should click invoice table: the more:dots of a row and click on Edit link to open edit page", () => {
    cy.moreDotEdit('invoice');
  });


  it("should click invoice table: the more:dots of a row and click on 'Print Invoice' link to print invoice", () => {
    cy.get("#invoicesTableData tr td .moreToolTip:first").click();
    cy.get(".dropDownMoreMenu").contains("Print Invoice").click();
    cy.wait(300);
    cy.url().should('include', `/invoices/view/`);
    cy.url().should('include', `#print`);
    cy.get("#invoice-detail-page").should('be.visible');
  });

});
