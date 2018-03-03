// server.js
const app = require('./index.js')
const block = require('./Models/Block.js')
const blockchain = require('./Models/Blockchain.js')

const port = process.env.PORT || 3000;

let my_blockchain = new blockchain();
console.log(JSON.stringify(my_blockchain))


//ENDPOINTS
app.get('/', function(req, res) {
    res.send('Welcome to blockchain.js!')
})


app.get('/info', (req, res) => {
    const info = {
        about: "SoftUniChain/0.0009-nodeJs",
        nodeName: "JS-Node-1",
        confirmedTransactions: [],
        peers: [],
        blocks: [],
        pendingTransactions: [],
        addresses: [],
        coins: 100
    };

    res.send(info);
});

app.get('/blocks', (req, res) => {
    const blockInfo = {
        index: block.index,
        transactions: block.transactions,
        difficulty: block.difficulty,
        prevBlockHash: block.prevBlockHash,
        minedBy: block.minedBy,
        blockDataHash: block.blockDataHash,
        nonce: block.nonce,
        dateCreated: block.dateCreated,
        blockHash: block.blockHash
    };

    res.send(blockInfo);
})

app.get('/blocks:index', (req, res) => {
    //returm block at currentIndex
    res.send()
})

app.post('/blocks/notify', (req, res) => {
    //returm block at currentIndex
    res.send()
});

app.get('/peers', (req, res) => {
    //returm block at currentIndex
    res.send()
        // return peers array
});

app.post('/peers', (req, res) => {
    //returm block at currentIndex
    res.send()
        // return peers array
});

app.get('/transactions/:transactionHash', (req, res) => {
    //returm block at currentIndex
    res.send()
        // return peers array
});
app.post('/transactions', (req, res) => {
    //returm block at currentIndex
    res.send()
        // return peers array
});
app.get('/balance/:transactionHash/confirmations/:confirmationNum', (req, res) => {
    //returm block at currentIndex
    res.send()
        // return peers array
});
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
    res.status(404);
    res.send('404 Not Found');
    res.end();
});




app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});