// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

const { buildRegistrationFormData } = require("../e2e/auth/registrationTestHelper");


Cypress.Commands.add("createUser", (overrides = {}) => {
  const { firstName, lastName, username, password } = buildRegistrationFormData(overrides);

  cy.request({
    url: `${Cypress.config().baseUrl}/api/users/`,
    method: "POST",
    body: { username, firstName, lastName, password, reCaptchaToken: "test-captcha" },
  }).then(response => ({
    ...response.body,
    user: { firstName, lastName, username, password },
  }));
});

Cypress.Commands.add("assertDashboard", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/dashboard`);
});

Cypress.Commands.add("manualLogin", ({ username, password }) => {
  cy.findByPlaceholderText("Neosmail").type(username || "");
  cy.findByPlaceholderText("Password").type(password || "");
  cy.findByRole("button", { name: "Login" }).click();
  cy.findByText("User logged successfully");
});

Cypress.Commands.add("login", ({ username, password }) => {
  const csrftoken = Cookies.get("csrftoken") || "";
  cy.request({
    url: `${Cypress.config().baseUrl}/api/login/`,
    method: "POST",
    body: { username, password, keepSignedIn: false },
    headers: { "X-CSRFToken": csrftoken },
  });
});

Cypress.Commands.add("manualLogout", () => {
  cy.findByTestId("open-user-menu").click();
  cy.findByText(/logout/i).click();
  cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
});

Cypress.Commands.add("logout", () => {
  const csrftoken = Cookies.get("csrftoken") || "";
  cy.request({
    url: `${Cypress.config().baseUrl}/api/logout/`,
    method: "GET",
    headers: { "X-CSRFToken": csrftoken },
  });
});

Cypress.Commands.add("findByPlaceholder", (placeholder) => {
  return cy.get(`input[placeholder="${placeholder}"]`);
});
