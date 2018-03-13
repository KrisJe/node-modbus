'use strict'

let assert = require('assert')
let Modbus = require('../')
let sinon = require('sinon')
let EventEmitter = require('events')


describe('TCP Server Tests.', function () {
  let socket, server

  beforeEach(function () {
    socket = new EventEmitter()
    socket.write = function (response) { }

    server = new Modbus.server.TCP(socket, {
        coils: Buffer.from([0x55, 0x55, 0x55])
    })
  })

  describe('Write Single Coil Tests.', function () {
    it('should force a coil in the server buffer at address 1', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x06, // byte count
        0x02, // unit id
        0x05, // function code
        0x00, 0x01, // output address
        0xFF, 0x00 // output value
      ])

      socket.write = function (response) {
          assert.deepEqual(request, response)
          assert.deepEqual(Buffer.from([0x57, 0x55, 0x55]), server.coils)
          done()
      }

      socket.emit('connection', socket)
      socket.emit('data', request)

    })
    it('should force a coil in the server buffer at address 8', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x06, // byte count
        0x02, // unit id
        0x05, // function code
        0x00, 0x08, // output address
        0x00, 0x00 // output value
      ])

      socket.write = function (response) {
          assert.deepEqual(request, response)
          assert.deepEqual(Buffer.from([0x55, 0x54, 0x55]), server.coils)
          done()
      }

      socket.emit('connection', socket)
      socket.emit('data', request)

    })
  })

  describe('Write Multiple Coils Tests.', function () {
    it('should correctly write <0F> in the server buffer coils at address 0', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x08, // byte count
        0x02,       // unit id
        0x0F,       // function code
        0x00, 0x00, // address
        0x00, 0x04, // quantity
        0x01,       // byte count
        0x0F        // values
      ])

      socket.emit('connection', socket)
      socket.emit('data', request)

      assert.deepEqual(Buffer.from([0x5F, 0x55, 0x55]), server.coils)
      done()
    })
    it('should correctly write <FF> in the server buffer coils at address 0', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x08, // byte count
        0x02,       // unit id
        0x0F,       // function code
        0x00, 0x00, // address
        0x00, 0x08, // quantity
        0x01,       // byte count
        0xFF        // values
      ])
      
      socket.emit('connection', socket)
      socket.emit('data', request)

      assert.deepEqual(Buffer.from([0xFF, 0x55, 0x55]), server.coils)
      done()
    })
    it('should correctly write <FF 01> in the server buffer coils at address 0', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x09, // byte count
        0x02,       // unit id
        0x0F,       // function code
        0x00, 0x00, // address
        0x00, 0x09, // quantity
        0x02,       // byte count
        0xFF, 0x01  // values
      ])

      socket.emit('connection', socket)
      socket.emit('data', request)

      assert.deepEqual(Buffer.from([0xFF, 0x55, 0x55]), server.coils)
      done()
    })
    it('should correctly write <0F> in the server buffer coils at address 6', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x08, // byte count
        0x02,       // unit id
        0x0F,       // function code
        0x00, 0x06, // address
        0x00, 0x04, // quantity
        0x01,       // byte count
        0x0F        // values
      ])

      socket.emit('connection', socket)
      socket.emit('data', request)

      assert.deepEqual(Buffer.from([0xD5, 0x57, 0x55]), server.coils)
      done()
    })
    it('should correctly write <0F> in the server buffer coils at address 8', function (done) {
      let request = Buffer.from([
        0x00, 0x01, // transaction id
        0x00, 0x00, // protocol
        0x00, 0x08, // byte count
        0x02,       // unit id
        0x0F,       // function code
        0x00, 0x08, // address
        0x00, 0x04, // quantity
        0x01,       // byte count
        0x0F        // values
      ])

      socket.emit('connection', socket)
      socket.emit('data', request)

      assert.deepEqual(Buffer.from([0x55, 0x5F, 0x55]), server.coils)
      done()
    })
  })


})
