describe('The signup page', () => {

  beforeEach(() => {
    cy.visit('/signup');
  });


  it("should display empty-form validation errors", () => {

    cy.get('#signup-form').submit();
    cy.get('#name')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Name is a required field');
    cy.get('#email')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email is a required field');
    cy.get('#password')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Password is a required field');
    cy.get('#confirmPassword')
      .parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'You must confirm Password');

  });


  it("should display email and confirm-password validation", () => {

    const user = Cypress.env('users').invalidEmailUser;

    cy.get('#name').type(`${user.userName}`);
    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}`);
    cy.get('#confirmPassword').type(`misMatchIt${user.userPassword}{enter}`);

    cy.get('#email').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

    cy.get('#confirmPassword').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Password Must match');

  });


  it("should display validation error when email already exists", () => {

    const user = Cypress.env('users').completeDBUser;

    cy.get('#name').type(`${user.userName}`);
    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}`);
    cy.get('#confirmPassword').type(`${user.userPassword}{enter}`);

    cy.get('#signup-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  it("should redirect to company form page on successful signup", () => {

    const user = Cypress.env('users').signupNewUser;

    cy.get('#name').type(`${user.userName}`);
    cy.get('#email').type(`${user.userEmail}`);
    cy.get('#password').type(`${user.userPassword}`);
    cy.get('#confirmPassword').type(`${user.userPassword}{enter}`);

    cy.url().should('include', '/signup/company');
    cy.getCookie('userToken').should('exist');
    cy.get('#signup-company-page').should('be.visible');

  });


  it("should navigate to the login page", () => {

    cy.get('#navigate-to-login-button').click();
    cy.url().should('include', '/login');
    cy.get('#login-form').should('be.visible');

  });


});
