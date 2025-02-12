// import LocalTable from './index.svelte';
// import { render, fireEvent } from '@testing-library/svelte';
// import { exclude_internal_props } from 'svelte/internal';

describe('CheckTable', () => {
  it('Check if table is loaded', () => {
    cy.visit('http://localhost:5000/'); // load a page
    cy.contains('Sample Information'); // check if the table title is loaded
    cy.get('table > thead > tr > th').contains('Phase'); // check if the table header is loaded
    cy.get('table > thead > tr > th').contains('Arm'); // check if the table header is loaded
    cy.get('table > thead > tr > th').contains('Subject'); // check if the table header is loaded
    cy.get('table > thead > tr > th').contains('Timepoint'); // check if the table header is loaded
    cy.get('table > thead > tr > th').contains('Sample'); // check if the table header is loaded
  });
});
