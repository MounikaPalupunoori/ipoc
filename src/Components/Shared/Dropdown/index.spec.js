describe('Check Dropdown', () => {
  it('Check if dropdown is loaded', () => {
    cy.visit('http://localhost:5000/'); // load a page
    cy.get('select > option').contains('Subject'); // check if the dropdown has an option
    cy.get('select > option').contains('Timepoint'); // check if the dropdown has an option
    cy.get('select > option').contains('Analyzed Group'); // check if the dropdown has an option
    cy.get('select > option').contains('Gender'); // check if the dropdown has an option
    cy.get('select > option').contains('Age'); // check if the dropdown has an option
    cy.get('select > option').contains('Phase'); // check if the dropdown has an option
    cy.get('select > option').contains('Arm'); // check if the dropdown has an option
  });
});
