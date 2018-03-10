// server.js
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const port = process.env.PORT || 3030
const Blockchain = require('./models/Blockchain.js')
const nodeCtrl = require('./controllers/node')
const polifils = require('./polyfills.js')
const { celebrate, Joi } = require('celebrate')
const WebSocket = require('ws')
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []
const http = require('http')

// Blockchain instance
let blockchain = new Blockchain()
let sockets = []
var MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
}

// Config
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/info', nodeCtrl.getInfo(blockchain))
app.get('/blocks', nodeCtrl.getBlocks(blockchain))
app.get('/blocks/:index', nodeCtrl.getBlockByIndex(blockchain))
app.post('/blocks/notify',
  celebrate({
    body: Joi.object().keys({
      index: Joi.string().required(),
      cumulativeDifficulty: Joi.string().required()
    })
  }), nodeCtrl.notify(blockchain))
app.get('/peers', nodeCtrl.getPeers(blockchain))
app.post('/peers',
  celebrate({
    body: Joi.object().keys({
      url: Joi.string().required()
    })
  }), (req, res) => {
    const peer = req.body.url
    nodeCtrl.addPeer(blockchain, peer)
    connectToPeers([peer])
    res.sendStatus(200)
  })
app.post('/transactions/send',
  celebrate({
    body: Joi.object().keys({
      from: Joi.string().required(),
      to: Joi.string().required(),
      senderPubKey: Joi.string().required(),
      value: Joi.number().required(),
      fee: Joi.number().required(),
      dateCreated: Joi.date().required(),
      senderSignature: Joi.array().required()
    })
  }), nodeCtrl.createTransaction(blockchain))
app.get('/transactions/:transactionHash/info', nodeCtrl.getTransactionInfo(blockchain))
app.get('/balance/:address/confirmations/:confirmations', nodeCtrl.getBalance(blockchain))
app.get('/balance/:address', nodeCtrl.getBalance(blockchain))
app.get('/mining/get-block/:address', nodeCtrl.getMiningBlock(blockchain))
app.post('/mining/submit-block/:address',
  celebrate({
    body: Joi.object().keys({
      nonce: Joi.number().required(),
      dateCreated: Joi.number().required(),
      blockHash: Joi.string().required()
    })
  }), nodeCtrl.postPOW(blockchain))
app.all('*', (req, res) => res.sendStatus(404))

const server = http.createServer(app)

const queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST})
const queryAllMsg = () => ({'type': MessageType.QUERY_ALL})
const responseChainMsg = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain.getBlocks())
})
const responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([blockchain.getLatestBlock()])
})
const handleBlockchainResponse = (message) => {
  // TODO
}

const write = (ws, message) => ws.send(JSON.stringify(message))
const broadcast = (message) => sockets.forEach(socket => write(socket, message))

function initMessageHandler (ws) {
  ws.on('message', (data) => {
      const message = JSON.parse(data)
      console.log('Received message' + JSON.stringify(message))
      switch (message.type) {
          case MessageType.QUERY_LATEST:
              write(ws, responseLatestMsg())
              break
          case MessageType.QUERY_ALL:
              write(ws, responseChainMsg())
              break
          case MessageType.RESPONSE_BLOCKCHAIN:
              handleBlockchainResponse(message)
              break
      }
  })
}

function initErrorHandler (ws) {
  const closeConnection = (ws) => {
      console.log('Connection failed to peer: ' + ws.url)
      sockets.splice(sockets.indexOf(ws), 1)
  }
  ws.on('close', () => closeConnection(ws))
  ws.on('error', () => closeConnection(ws))
}

function connectToPeers (newPeers) {
  newPeers.forEach((peer) => {
      const ws = new WebSocket(peer)
      ws.on('open', () => initConnection(ws))
      ws.on('error', (e) => {
          console.log('Connection failed')
      })
  })
}

const ws = new WebSocket.Server({ server })
connectToPeers(initialPeers)

function initConnection (ws) {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryChainLengthMsg());
}

ws.on('connection', initConnection)

server.listen(port, function listening() {
  console.log('Listening on %d', port);
})
