
require('uuid')
require.cache[require.resolve('uuid')].exports = () => 'hey'

var t = require('assert')
var http = require('http')
var online = require('../lib/online')()
var unknown = require('../lib/unknown')()
var output = require('../lib/output')()
var resolve = require('../lib/mac-resolve')({
  method: 'GET',
  protocol: 'http:',
  host: 'localhost',
  port: 3000,
  timeout: 100,
})

var config = {
  known: require('./fixtures/known'),
  unknown: require('./fixtures/unknown'),
}
var fixtures = {
  unknown: require('./fixtures/unknown-update'),
  whois: require('./fixtures/whois'),
}
var json = require('./fixtures/varnalab-whois')


describe('output', () => {
  var server

  before((done) => {
    server = http.createServer()

    server.on('request', (req, res) => {
      if (req.url === '/11:22:33') {
        res.end('vendor1')
      }
      else if (req.url === '/22:33:44') {
        setTimeout(() => {}, 150)
      }
      else if (req.url === '/33:44:55') {
        res.end('Vendor not found\n')
      }
    })

    server.listen(3000, done)
  })

  it('whois', (done) => {
    var active = online.filter(config, json)

    if (active.unknown.length) {
      unknown.update(config, active, resolve, () => {
        unknown.active(config, active)
        var whois = output.whois(config, active)

        t.deepEqual(config.unknown, fixtures.unknown)
        t.deepEqual(whois, fixtures.whois)

        done()
      })
    }
  })

  after((done) => {
    server.close(done)
  })
})
