const assert = require('assert')

describe('Maths', () => {
  describe('addition', () => {
    it('should not be broken', () => {
      assert.equal(2, 1 + 1)
    })
  })
  describe('subtraction', () => {
    it('should not be broken', () => {
      assert.equal(5, 10 - 5)
    })
  })
})
