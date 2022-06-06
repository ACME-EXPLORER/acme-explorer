import assert from 'assert';
import { When, Then, Given } from '@cucumber/cucumber'
import { RequestValidationError } from '../../src/shared/errors/request-validation-error.js'

let message = ''
let instance = null
const errors = [{ msg: 'Invalid request parameters', param: 'name' }]


Given('I have a RequestValidationError', () => {
    instance = new RequestValidationError(errors)
})

When('I call the toClient', () => {
    message = instance.toClient()
});

Then('I should get a RequestValidationError with the array of errors',
 () => {
   assert.equal(message[0].message, errors[0].msg)
});

