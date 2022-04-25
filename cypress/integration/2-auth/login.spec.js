describe('The login page', () => {

  beforeEach(() => {
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

    const user = Cypress.env('users').invalidEmailUser;

    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}{enter}`);
    cy.get('#email').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

  });


  it("should displays form validation when wrong email/password", () => {

    const user = Cypress.env('users').notInDBUser;

    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}{enter}`);
    cy.get('#login-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  it("should login successfully and redirect to Company form when company details are missing", () => {

    const user = Cypress.env('users').incompleteDBUser;

    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}{enter}`);

    cy.wait(8000).url().should('include', '/signup/company');
    cy.getCookie('userToken').should('exist');
    cy.get('#signup-company-form').should('be.visible');

  });


  it("should login successful and redirect to dashboad on ", () => {

    const user = Cypress.env('users').completeDBUser;

    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}{enter}`);

    cy.url().should('include', '/');
    cy.getCookie('userToken').should('exist');
    cy.get('#dashboard-page').should('be.visible');

  });

  it("should navigate to the sign-up page", () => {

    cy.get('#navigate-to-signup-button').click();
    cy.url().should('include', '/signup');
    cy.get('#signup-form').should('be.visible');

  });


});
