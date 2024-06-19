context('App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('verify the title', () => {
    cy.clearLocalStorage();
    cy.title().should('eq', 'Pratham SCP Teachers app');
  });

  it('CSSLocator', () => {
    cy.clearLocalStorage();

    cy.get('input#username').type('roshini_pratham');
    cy.get('input#password').type('12345');
    cy.get('button[type="submit"]').click();

    // add wait time to load the page
    cy.wait(5000);
    // write the assertion to verify the text
    cy.get('p.joyride-step-1').should('have.text', 'Dashboard');
    cy.get('div.col.cell').should('have.length', 30);
  });

  it('Dashboard should have the 30 days cells', () => {
  });
});
