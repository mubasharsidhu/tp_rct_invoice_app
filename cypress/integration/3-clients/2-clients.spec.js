
describe('The Client page', () => {

  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.completeDBUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.visit('/clients');

  });


  it("should display results sorted by clientName (ASC/DESC)", () => {
    cy.validateSorting("clientName", "Desc");
    cy.validateSorting("clientName", "Asc");
  });


  it("should display results sorted by invoicesCount (ASC/DESC)", () => {
    cy.validateSorting("invoicesCount", "Asc");
    cy.validateSorting("invoicesCount", "Desc");
  });


  it("should display pagination", () => {
    cy.validatePagination();
  });


  it("should click Add Client button and open client form", () => {
    cy.get("#AddClient").click();
    cy.url().should('include', `/clients/add`);
    cy.get(`#client-form`).should('be.visible');
  });


});
