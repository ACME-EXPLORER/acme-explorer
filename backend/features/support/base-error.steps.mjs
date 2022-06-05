// Generate Base Error cucumber step definitions
// Language: javascript
// Path: backend\features\support\base-error.steps.mjs
import assert from 'assert';
import { When, Then, Given } from '@cucumber/cucumber'
import { BaseError } from '../../src/shared/errors/base-error.js'

let message = ''
let instance = null

Given('I have a BaseError', () => {
    instance = new BaseError('BaseError')
})

When('I call toClient', () => {
    message = instance.toClient()
});

Then('I get a Array with the error message', () => {
   assert.equal(message[0].message, 'BaseError')
});

