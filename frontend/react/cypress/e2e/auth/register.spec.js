import { buildRegistrationFormData } from "./registrationTestHelper";

export const formInputConfigs = {
  email: {
    name: "email",
    placeholder: "correo@email.com",
  },
  password: {
    name: "password",
    placeholder: "contraseña",
  },
  password_confirm: {
    name: "password_confirm",
    placeholder: "confirma contraseña",
  },
  name: {
    name: "name",
    placeholder: "nombre",
  },
  surname: {
    name: "surname",
    placeholder: "apellido",
  },
  phone: {
    name: "phone",
    placeholder: "teléfono",
  },
  address: {
    name: "address",
    placeholder: "dirección completa ...",
  },
};

describe("registration", () => {
  it("should register a new user", () => {
    const userPayload = buildRegistrationFormData();
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/#/register");

    Object.values(formInputConfigs).forEach( value => {
      cy.findByPlaceholder(value.placeholder).type(userPayload[value.name]);
    });

    cy.findByRole("button", { name: /¡Regístrame!/i }).click();
    cy.contains("Hemos enviado un correo a");
    cy.url().should("eq", `${Cypress.config().baseUrl}/#/login`);
  });
});
