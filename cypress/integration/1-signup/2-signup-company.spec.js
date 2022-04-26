describe('The signup-company Page', () => {

  it('should redirect to login-page when user is not logged in', function () {
    cy.visit('/signup/company');
    cy.url().should('include', '/login');
    cy.get('#login-form').should('be.visible');
  });


  it('should redirect to company details form page when company details are missing', function () {

    const user = dataset.users.signupNewUser;
    cy.login(user.userEmail, user.userPassword);

    cy.visit('/');
    cy.url().should('include', '/signup/company');
    cy.get('#signup-company-form').should('be.visible');

  });


  it('should display empty-form validation errors', function () {

    cy.logout();

    const user = dataset.users.signupNewUser;
    cy.login(user.userEmail, user.userPassword);

    cy.visit('/signup/company');

    cy.get('#signup-company-form').submit();
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


  it('should succefully add company details and redirect to dashboard', function () {

    cy.logout();

    const user = dataset.users.signupNewUser;
    cy.login(user.userEmail, user.userPassword);

    cy.visit('/signup/company');

    cy.get('#companyName').type(`${user.companyDetails.name}`);
    cy.get('#companyAddress').type(`${user.companyDetails.address}`);
    cy.get('#companyTaxNumber').type(`${user.companyDetails.vatNumber}`);
    cy.get('#companyRegNumber').type(`${user.companyDetails.regNumber}`);
    cy.get('#iban').type(`${user.companyDetails.iban}`);
    cy.get('#swift').type(`${user.companyDetails.swift}{enter}`);
    cy.get('#dashboard-page').should('be.visible');

  });


  it('should succefully edit company details and redirect to dashboard', function () {

    cy.logout();

    const user = dataset.users.signupNewUser; // it is now a complete user with company details added in previous test
    cy.login(user.userEmail, user.userPassword);

    cy.visit('/signup/edit/company');

    cy.get('#companyName').clear().type(`${user.companyDetails.name}`);
    cy.get('#companyAddress').clear().type(`${user.companyDetails.address}`);
    cy.get('#companyTaxNumber').clear().type(`${user.companyDetails.vatNumber}`);
    cy.get('#companyRegNumber').clear().type(`${user.companyDetails.regNumber}`);
    cy.get('#iban').clear().type(`${user.companyDetails.iban}`);
    cy.get('#swift').clear().type(`${user.companyDetails.swift}{enter}`);

    cy.get('#dashboard-page').should('be.visible');

  });


});