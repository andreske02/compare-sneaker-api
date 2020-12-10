
const Helpers = require('api/src/utils/helpers.js');

describe('stringlength tester', () => {
  test('if there is a string', () => {
    expect (Helpers.checkTitleLength()).toBeFalsy()
    expect (Helpers.checkTitleLength(102)).toBeFalsy()
    expect (Helpers.checkTitleLength([])).toBeFalsy()
  })

  test('if string length is good', () => {
    expect(Helpers.checkTitleLength("Hello world").length).toBeLessThan(51);
    expect(Helpers.checkTitleLength("Hello world, how is it going, this is a ti").length).toBeLessThan(51);
  })
  test('If string starts with a capital', () => {
    expect(Helpers.checkTitleLength("hello wolrd")).toBeFalsy();
  }) 
})

