const SHA256 = require('crypto-js/sha256')
const transaction = require('./Transaction')

class Block {
    constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, blockHash, nonce, dateCreated) {
        this.index = index // number
        this.transactions = transactions // Transaction[]
        this.transactionsHash = SHA256(transactions)
        this.difficulty = difficulty // number
        this.prevBlockHash = prevBlockHash // hex_number
        this.minedBy = minedBy // address
        this.blockDataHash = blockDataHash // hex_number
        this.nonce = nonce // number
        this.dateCreated = dateCreated // timestamp
        this.blockHash = this.calculateHash() // hex_number
    }

    calculateHash() {
        return SHA256(this.index +
            this.transactions +
            this.difficulty +
            this.prevBlockHash +
            this.minedBy +
            this.blockDataHash +
            this.nonce +
            this.dateCreated
        );
    }

    logHash() {
        console.log(this.blockHash)
    }
}


module.exports = Block