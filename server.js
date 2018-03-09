// server.js
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const port = process.env.PORT || 3030
const Blockchain = require('./models/Blockchain.js')
const nodeCtrl = require('./controllers/node')
const polifils = require('./polyfills.js')
const { celebrate, Joi } = require('celebrate')

// Blockchain instance
let blockchain = new Blockchain()

// Config
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/info', nodeCtrl.getInfo(blockchain))
app.get('/blocks', nodeCtrl.getBlocks(blockchain))
app.get('/blocks/:index', nodeCtrl.getBlockByIndex(blockchain))
app.post('/blocks/notify', nodeCtrl.notify(blockchain))
app.get('/peers', nodeCtrl.getPeers(blockchain))
app.post('/peers', nodeCtrl.addPeer(blockchain))

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
app.post('/mining/get-block/:minerAddr', nodeCtrl.getMiningBlock)
app.post('/mining/submit-block/:minerAddr', nodeCtrl.postPOW)
app.all('*', (req, res) => res.sendStatus(404))

app.listen(port, () => (console.log('Express server listening on port ' + port)))