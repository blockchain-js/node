const crypto = require('../utils/crypto')
const transaction = require('./Transaction')

class Block {
  static getBlockCandidate(minedBy, index, transactions, reward, prevBlockHash, difficulty) {
    const dateCreated = new Date().getTime()
    const blockDataHash = crypto.createHash({
      index,
      transactions,
      difficulty,
      prevBlockHash,
      minedBy,
      dateCreated
    })

    return {
      index,
      transactions,
      difficulty,
      prevBlockHash,
      minedBy,
      dateCreated,
      blockDataHash
    }
  }

  constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, blockHash, nonce, dateCreated) {
    this.index = index
    this.transactions = transactions
    this.difficulty = difficulty
    this.prevBlockHash = prevBlockHash
    this.minedBy = minedBy
    this.nonce = nonce
    this.dateCreated = dateCreated
    this.blockHash = blockHash
  }
}


module.exports = Block