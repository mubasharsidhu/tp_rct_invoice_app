describe('The Dashboard page', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it("should logout and redirect to login page", () => {
    cy.logout();
    cy.url().should('include', '/login');
    cy.get('#login-form').should('be.visible');
  })

});
