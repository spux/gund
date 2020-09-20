#!/usr/bin/env node

'use strict'

// IMPORTS
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var Gun = require('gun')
var https = require('https')
var http = require('http')
var fs = require('fs')

// MODEL
globalThis.data = {
  port: 8765,
  key: './privkey.pem',
  cert: './fullchain.pem',
  scheme: 'http'
}

// INIT
data.port = argv.port || data.port
data.key = argv.key || data.key
data.cert = argv.cert || data.cert
data.scheme = argv.scheme || data.scheme

console.log('data', data)

// MAIN
if (data.scheme === 'https') {
  var options = {
    key: fs.readFileSync(data.key),
    cert: fs.readFileSync(data.cert)
  }
  var server = https.createServer(options)
} else {
  var options = {}
  var server = http.createServer(options)
}

// Serves up /index.html
server.on('request', function (req, res) {
  if (Gun.serve(req, res)) {
    return
  }
  if (req.url === '/' || req.url === '/index.html') {
    fs.createReadStream('index.html').pipe(res)
  }
})

// add gun
Gun({ web: server })

server.listen(data.port, function () {
  console.log(`\nApp listening on`, data.port)
})
