// server.js
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const port = process.env.PORT || 3000;
const Blockchain = require('./models/Blockchain.js')
const nodeCtrl = require('./controllers/node')

// Blockchain instance
let blockchain = new Blockchain();

// Config
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/info', nodeCtrl.getInfo(blockchain));
app.get('/blocks', nodeCtrl.getBlocks(blockchain));
app.get('/blocks/:index', nodeCtrl.getBlockByIndex(blockchain))
app.post('/blocks/notify', nodeCtrl.notify(blockchain));
app.get('/peers', nodeCtrl.getPeers(blockchain));
app.post('/peers', nodeCtrl.addPeer(blockchain));
app.post('/transactions/send', nodeCtrl.createTransaction(blockchain));
app.get('/transactions/:transactionHash', nodeCtrl.getTransaction(blockchain));
app.get('/transactions/:transactionHash/info', nodeCtrl.getTransactionInfo(blockchain));
app.get('/balance/:address/confirmations/:confirmations', nodeCtrl.getBalance(blockchain));

app.post('/mine', (req, res) => {
  //returm block at currentIndex
  res.send()
  // return peers array
});
app.post('/mine/submit/:blockNum', (req, res) => {
  //returm block at currentIndex
  res.send()
  // return peers array
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => (console.log('Express server listening on port ' + port)));