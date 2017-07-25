
var t = require('assert')
var http = require('http')
var resolve = require('../lib/mac-resolve')({
  method: 'GET',
  protocol: 'http:',
  host: 'localhost',
  port: 3000,
  timeout: 100,
})


describe('mac-resolve', () => {
  var server

  before((done) => {
    server = http.createServer()

    server.on('request', (req, res) => {
      if (req.url === '/mac1') {
        res.end('vendor1')
      }
      else if (req.url === '/mac2') {
        setTimeout(() => {}, 150)
      }
      else if (req.url === '/mac3') {
        res.end('Vendor not found\n')
      }
    })

    server.listen(3000, done)
  })

  it('resolve', (done) => {
    var list = [{mac: 'mac1'}, {mac: 'mac2'}, {mac: 'mac3'}]
    resolve(list, (err) => {
      if (err) {
        done(err)
      }
      t.deepEqual(list, [
        {mac: 'mac1', vendor: 'vendor1'},
        {mac: 'mac2', vendor: undefined},
        {mac: 'mac3', vendor: false},
      ])
      done()
    })
  })

  after((done) => {
    server.close(done)
  })
})
