describe('The login page', () => {

  let dataset;
  beforeEach(() => {
    cy.fixture('users.json').then(function (data) {
      dataset = data;
    });
    cy.visit('/login');
  });

  it("should display empty-form validation", () => {

    cy.get('#login-form').submit();

    cy.get('#email')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email is a required field');
    cy.get('#password')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Password is a required field');

  });

  it("should displays email validation", () => {

    const user = dataset.users.invalidEmailUser;
    cy.login(user.userEmail, user.userPassword);
    cy.get('#email').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

  });


  it("should displays form validation when wrong email/password", () => {

    const user = dataset.users.notInDBUser;
    cy.login(user.userEmail, user.userPassword);
    cy.get('#login-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  it("should login successfully and redirect to Company form when company details are missing", () => {

    const user = dataset.users.incompleteDBUser;
    cy.loginWithSuccess(user.userEmail, user.userPassword);

    cy.wait(8000).url().should('include', '/signup/company');
    cy.get('#signup-company-form').should('be.visible');

  });


  it("should login successfully and redirect to dashboad on ", () => {

    const user = dataset.users.completeDBUser;
    cy.loginWithSuccess(user.userEmail, user.userPassword);
    cy.get('#dashboard-page').should('be.visible');

  });


  it("should navigate to the sign-up page", () => {

    cy.get('#navigate-to-signup-button').click();
    cy.url().should('include', '/signup');
    cy.get('#signup-form').should('be.visible');

  });


});
