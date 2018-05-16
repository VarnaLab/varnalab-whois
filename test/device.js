
require('uuid')
require.cache[require.resolve('uuid')].exports = () => 'hey'

var t = require('assert')
var device = require('../lib/device')

var fixtures = {
  devices: require('./fixtures/device/devices'),
  active: require('./fixtures/device/mikrotik').active,
  created: require('./fixtures/device/created'),
  updated: require('./fixtures/device/updated'),
}


describe('device', () => {

  it('create', () => {
    t.deepStrictEqual(
      device.create(fixtures),
      fixtures.created,
      'should create missing devices'
    )
  })

  it('update', () => {
    fixtures.devices = fixtures.devices.concat(device.create(fixtures))
    t.equal(
      device.update(fixtures),
      true,
      'should mark the collection as dirty'
    )
    t.deepStrictEqual(
      fixtures.devices,
      fixtures.updated,
      'should update missing devices'
    )
  })
})
