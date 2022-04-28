
describe('The Invoice page', () => {

  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.visit('/invoices');

  });


  it("should display filtered results", () => {
    const clients = cy.get2ClientsViaAPI().as('clients');
    cy.get('@clients').then((clients) => {
      const clientID   = clients[0].id;
      const clientLbel = clients[0].name;

      cy.get("#clientFilter").click().type(`${clientLbel}`, { delay: 0});
      cy.wait(300);
      cy.get("#clientFilter").type('{moveToEnd}');
      cy.wait(100);
      cy.get("#clientFilter").type('{downarrow}{enter}');
      cy.wait(300);

      cy.url().should('include', '/invoices?');
      cy.url().should('include', `clientID=${clientID}`);
      cy.get('#invoice-page').should('be.visible');
    });
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


  it("should click an invoice table row and open the invoice detail page", () => {
    cy.rowClickDetail('invoice');
  });


  it("should click the more:dots of a row and click on Edit link to open edit page", () => {
    cy.moreDotEdit('invoice');
  });


  it("should click the more:dots of a row and click on 'Print Invoice' link to print invoice", () => {
    cy.get("#invoicesTableData tr td .moreToolTip:first").click();
    cy.get(".dropDownMoreMenu").contains("Print Invoice").click();
    cy.wait(300);
    cy.url().should('include', `/invoices/view/`);
    cy.url().should('include', `#print`);
    cy.get("#invoice-detail-page").should('be.visible');
  });


});
