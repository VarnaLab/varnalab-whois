
var t = require('assert')
var online = require('../lib/online')

var fixtures = {
  users: require('./fixtures/online/users'),
  devices: require('./fixtures/online/devices'),
  active: require('./fixtures/online/mikrotik').active,
  formatted: require('./fixtures/online/formatted'),
  filtered: require('./fixtures/online/filtered'),
}


describe('online', () => {

  it('format', () => {
    t.deepStrictEqual(
      online.format(fixtures),
      fixtures.formatted,
      'should format the online devices into known and unknown'
    )
  })

  it('filter', () => {
    t.deepStrictEqual(
      online.filter(online.format(fixtures)),
      fixtures.filtered,
      'should filter known and unknown device keys'
    )
  })

})
