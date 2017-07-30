
var t = require('assert')
var online = require('../lib/online')()

var fixtures = {
  users: require('./fixtures/online/users'),
  devices: require('./fixtures/online/devices'),
  mikrotik: require('./fixtures/online/mikrotik').active,
  filtered: require('./fixtures/online/filtered'),
}


describe('online', () => {

  it('filter', () => {
    var filtered = online.filter(
      fixtures.users,
      fixtures.devices,
      fixtures.mikrotik,
    )
    t.deepEqual(filtered, fixtures.filtered)
  })
})
