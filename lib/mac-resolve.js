
var https = require('https')


module.exports = (config) => {
  var options = config || {
    method: 'GET',
    protocol: 'https:',
    host: 'api.macvendors.com',
    agent: new https.Agent({
      keepAlive: true,
      maxSockets: 1,
    }),
    timeout: 3000,
  }

  var client = require(options.protocol.replace(':', ''))

  function get (mac, done) {
    var req = client.request(Object.assign({}, options, {path: '/' + mac}))

    req.on('error', (err) => {
      done(err)
    })

    req.on('timeout', () => {
      req.abort()
    })

    req.on('response', (res) => {
      var body = ''
      res.on('error', (err) => {
        done(err)
      })
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        done(null, (body === 'Vendor not found\n') ? false : body)
      })
    })

    req.end()
  }

  var resolve = (list, done) => {
    ;(function next (index) {
      if (index === list.length) {
        done()
        return
      }
      get(list[index].mac.slice(0, 8), (err, vendor) => {
        list[index].vendor = vendor === undefined ? null : vendor
        next(++index)
      })
    })(0)
  }

  return resolve
}
