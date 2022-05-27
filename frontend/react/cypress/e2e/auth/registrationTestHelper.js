const faker = require('@faker-js/faker');

export function buildRegistrationFormData(overrides = {}) {
  const password = faker.internet.password(8);

  return {
    email: faker.internet.email(),
    password,
    password_confirm: password,
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    phone: faker.phone.phoneNumber("##########"),
    address: faker.address.direction(),
    ...overrides,
  };
}