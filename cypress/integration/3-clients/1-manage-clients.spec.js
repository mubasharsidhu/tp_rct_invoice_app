describe('The Add/Edit Client page', () => {

  let datasetClients;
  let clientIDforEdit;
  beforeEach(() => {

    cy.fixture('users.json').then(function (data) {
      const user = data.users.signupNewUser;
      cy.loginViaAPI(user.userEmail, user.userPassword);
    });

    cy.fixture('clients.json').then(function (data) {
      datasetClients = data;
    });

  });

  it("should display empty-form validation", () => {

    cy.visit('/clients/add');
    cy.wait(500);
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


  it("should display email validation error", () => {

    cy.visit('/clients/add');
    const client = datasetClients.clients.missconfiguredClient;
    cy.manageClient(client);
    cy.wait(500);
    cy.get('#email')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

  });


  it("should insert a client successfuly and redirect to clients page", () => {

    cy.visit('/clients/add');
    const client = datasetClients.clients.merftester;
    cy.manageClient(client);
    cy.wait(1000);
    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });


  it("should display validation errors when client data already exists", () => {

    cy.visit('/clients/add');
    const client = datasetClients.clients.merftester;
    cy.manageClient(client);
    cy.wait(500);
    cy.get('#client-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  // Add a few more clients for pagination and other Testings
  it("should successfully add a few more clients via API", () => {

    const moreclients = datasetClients.clients.moreclients;
    cy.wrap(moreclients).each((client)=>{
      cy.addClientViaAPI(client).as('clientID');
      cy.get('@clientID').should((respClientID) => {
        clientIDforEdit = respClientID;
      });
    });

  });


  // Edit the client
  it("should edit the client and redirect to clients page after successful client edit", () => {

    cy.visit(`/clients/${clientIDforEdit}`);
    const clientEdit = datasetClients.clients.merf6testerEdit;
    cy.manageClient(clientEdit, `${clientIDforEdit}` );
    cy.wait(500);
    cy.url().should('include', '/clients');
    cy.get('#client-page').should('be.visible');

  });

});
