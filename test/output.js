
require('uuid')
require.cache[require.resolve('uuid')].exports = () => 'hey'

var t = require('assert')
var http = require('http')
var online = require('../lib/online')()
var resolve = require('../lib/mac-resolve')({
  method: 'GET',
  protocol: 'http:',
  host: 'localhost',
  port: 3000,
  timeout: 100,
})
var device = require('../lib/device')(resolve)
var output = require('../lib/output')(device.sort)

var fixtures = {
  active: require('./fixtures/output/active'),
  whois: require('./fixtures/output/whois'),
}


describe('output', () => {
  var server

  before((done) => {
    server = http.createServer()

    server.on('request', (req, res) => {
      res.end('Vendor not found\n')
    })

    server.listen(3000, done)
  })

  it('whois', () => {
    var whois = output.whois(fixtures.active)
    t.deepEqual(whois, fixtures.whois)
  })

  after((done) => {
    server.close(done)
  })
})
