
describe('The Invoice page', () => {

  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.completeDBUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.visit('/invoices');

  });


  it("should display results sorted by Client Name (ASC/DESC)", () => {
    cy.validateSorting("clientName", "Desc");
    cy.validateSorting("clientName", "Asc");
  });


  it("should display results sorted by Invoice Number (ASC/DESC)", () => {
    cy.validateSorting("invoiceNumber", "Asc");
    cy.validateSorting("invoiceNumber", "Desc");
  });


  it("should display results sorted by Due Date (ASC/DESC)", () => {
    cy.validateSorting("dueDate", "Asc");
    cy.validateSorting("dueDate", "Desc");
  });


  it("should display pagination", () => {
    cy.validatePagination();
  });


  it("should click Add Invoice button and open Invoice form", () => {
    cy.get("#AddInvoice").click();
    cy.url().should('include', `/invoices/add`);
    cy.get(`#invoice-form`).should('be.visible');
  });


});
