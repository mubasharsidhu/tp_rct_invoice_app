
describe('The Client page', () => {

  let datasetClients;
  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.completeDBUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.fixture('clients.json').then(function (data) {
      datasetClients = data;
    });

  });


  it("should display empty-form validation", () => {


    cy.visit('/clients/add');

    cy.get('#client-form').submit();
    cy.get('#clientName')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Client Name is a required field');
    cy.get('#email')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email is a required field');
    cy.get('#companyName')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Company Name is a required field');
    cy.get('#companyAddress')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Company Address is a required field');
    cy.get('#companyTaxNumber')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Tax Number is a required field');
    cy.get('#companyRegNumber')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Reg Number is a required field');

  });


  it("should display email validation", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.missconfiguredClient;
    cy.manageClient(client);

    cy.get('#email')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

  });


  it("should display validation errors when data already exists", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.alice;
    cy.manageClient(client);

    cy.get('#client-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merftester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf1tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf2tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf3tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf4tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf5tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should redirect to clients page after successful client insertion", () => {

    cy.visit('/clients/add');

    const client = datasetClients.clients.merf6tester;
    cy.manageClient(client);

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should edit the cliet and redirect to clients page after successful client edit", () => {

    const alice = datasetClients.clients.alice;

    cy.visit(`/clients/${alice.id}`);

    const aliceEdit = datasetClients.clients.aliceEdit;
    cy.manageClient(aliceEdit, `${alice.id}` );

    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });

});
