
var t = require('assert')
var http = require('http')
var resolve = require('../lib/resolve')


describe('resolve', () => {
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
        res.writeHead(404)
        res.end('not found')
      }
    })

    server.listen(3000, done)
  })

  it('resolve', async () => {
    var devices = [
      {id: 1, mac: 'mac1', host: 1},
      {id: 2, mac: 'mac2', host: 2},
      {id: 3, mac: 'mac3', host: 3},
    ]
    var options = {
      url: 'http://localhost:3000',
      timeout: 100,
    }
    var output = await resolve({devices, options})
    t.deepStrictEqual(
      output,
      [
        {id: 1, mac: 'mac1', host: 1, vendor: 'vendor1'},
        {id: 2, mac: 'mac2', host: 2, vendor: null},
        {id: 3, mac: 'mac3', host: 3, vendor: false},
      ],
      'mac1 - resolved, mac2 - timeout/error, mac3 - not found'
    )
    t.notDeepStrictEqual(
      devices,
      output,
      'should return a new object'
    )
  })

  after((done) => {
    server.close(done)
  })
})
