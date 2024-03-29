describe('The signup page', () => {

  let dataset;
  beforeEach(() => {
    cy.fixture('users.json').then(function (data) {
      dataset = data;
    });
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

    const user = dataset.users.invalidEmailUser;
    cy.signup(user, 'misMatchIt');

    cy.get('#email').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Email must be a valid email');

    cy.get('#confirmPassword').
      parent().should('have.class', 'Mui-error')
      .next().should('have.text', 'Password Must match');

  });


  it("should sign up successfully and redirect to company form page", () => {

    const user = dataset.users.signupNewUser;
    cy.signup(user);
    cy.wait(1000)
    cy.url().should('include', '/signup/company');
    cy.getCookie('userToken').should('exist');
    cy.get('#signup-company-page').should('be.visible');

  });


  it("should display validation error when email already exists", () => {

    const user = dataset.users.signupNewUser;
    cy.signup(user);
    cy.wait(500);
    cy.get('#signup-form .MuiAlert-root .MuiAlert-message').should('be.visible');

  });


  it("should create another user and redirect to company form page on successful signup", () => {

    const user = dataset.users.signupNewUserNoCompany;
    cy.signup(user);
    cy.wait(500);
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
