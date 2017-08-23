
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
  api: require('./fixtures/output/api'),
  slack: require('./fixtures/output/slack'),
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

  it('api', () => {
    t.deepEqual(output.api(fixtures.active), fixtures.api)
  })

  it('slack', () => {
    t.deepEqual(output.slack(fixtures.active), fixtures.slack)
  })

  after((done) => {
    server.close(done)
  })
})
