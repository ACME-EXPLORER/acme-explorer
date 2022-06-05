import assert from 'assert';
import { When, Then } from '@cucumber/cucumber'
import { Greeter } from '../../src/shared/greeter.js'

let whatIHeard = ''

When('the greeter says hello', () => {
  whatIHeard = new Greeter().sayHello()
});

Then('I should have heard {string}', (expectedResponse) => {
  assert.equal(whatIHeard, expectedResponse)
});
