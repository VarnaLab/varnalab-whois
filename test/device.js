
require('uuid')
require.cache[require.resolve('uuid')].exports = () => 'hey'

var t = require('assert')
var http = require('http')
var resolve = require('../lib/mac-resolve')({
  method: 'GET',
  protocol: 'http:',
  host: 'localhost',
  port: 3000,
  timeout: 100,
})
var device = require('../lib/device')(resolve)

var fixtures = {
  devices: require('./fixtures/device/devices'),
  mikrotik: require('./fixtures/device/mikrotik').active,
  updated: require('./fixtures/device/updated'),
}


describe('device', () => {
  var server

  before((done) => {
    server = http.createServer()

    server.on('request', (req, res) => {
      res.end('Vendor not found\n')
    })

    server.listen(3000, done)
  })

  it('update', (done) => {
    device.update(
      fixtures.devices,
      fixtures.mikrotik,
      (updated) => {
        t.deepEqual(updated, fixtures.updated)
        done()
      })
  })

  after((done) => {
    server.close(done)
  })
})
