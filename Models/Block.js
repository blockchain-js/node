const crypto = require('crypto')
const transaction = require('./Transaction')

class Block {
  constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, blockHash, nonce, dateCreated) {
    this.index = index
    this.transactions = transactions
    this.difficulty = difficulty
    this.prevBlockHash = prevBlockHash
    this.minedBy = minedBy
    this.blockDataHash = blockDataHash
    this.nonce = nonce
    this.dateCreated = dateCreated
    this.blockHash = this.calculateHash()
  }

  calculateHash() {
    return crypto.createHash('sha256').update({
      index: this.index,
      transactions: this.transactions,
      difficulty: this.difficulty,
      prevBlockHash: this.prevBlockHash,
      minedBy: this.minedBy,
      blockDataHash: this.blockDataHash,
      nonce: this.nonce,
      dateCreated: this.dateCreated
    }.toString()).digest('hex')
  }
}


module.exports = Block