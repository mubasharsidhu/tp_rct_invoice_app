
describe('The Client page', () => {

  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.visit('/clients');

  });


  it("should display results sorted by Client Name (ASC/DESC)", () => {
    cy.validateSorting("clientName", "Desc");
    cy.validateSorting("clientName", "Asc");
  });


  it("should display results sorted by Invoices Count (ASC/DESC)", () => {
    cy.validateSorting("invoicesCount", "Asc");
    cy.validateSorting("invoicesCount", "Desc");
  });


  it("should display/validate pagination", () => {
    cy.validatePagination();
  });


  it("should click the 'Add Client' button and open client form", () => {
    cy.get("#AddClient").click();
    cy.url().should('include', `/clients/add`);
    cy.get(`#client-form`).should('be.visible');
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


});
