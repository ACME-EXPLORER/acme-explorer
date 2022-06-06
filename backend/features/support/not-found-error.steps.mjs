import assert from 'assert';
import { When, Then, Given } from '@cucumber/cucumber'
import { NotFoundError } from '../../src/shared/errors/not-found-error.js'

let message = ''
let instance = null


Given('I have a NotFoundError', () => {
    instance = new NotFoundError()
})

When('I call the serializeErrors', () => {
    message = instance.serializeErrors()
});

Then('I should get a NotFoundError with the message {string}',
 (expectedResponse) => {
   assert.equal(message[0].message, expectedResponse)
});

