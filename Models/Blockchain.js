const Block = require('./Block.js')
const Transaction = require('./Transaction.js')

class Blockchain {

  constructor() {
    this.blocks = [this.createGenesisBlock()]
    this.transactions = []
    this.pendingTransactions = []
    this.baseTarget = 2
    this.difficulty = 5
    this.cummulativeDifficulty = this.getCummulativeDifficulty(this.difficulty)
    this.peers = []
    this.minerReward = 500
    this.confirmations = 8
  }

  getCummulativeDifficulty(difficulty) {
    return difficulty + (2 ^ 64 / this.baseTarget)
  }

  createGenesisBlock() {
    const initialTransaction = {
      from: '0x00',
      to: 'a5dc6bcbfeeab523ffc995e344725e6207b7f69f',
      value: 500,
      fee: 50,
      transactions: [],
      senderPubKey: '',
      senderSignature: '',
      transactionHash: '',
      minedInBlockIndex: '',
      transferSuccessful: true
    }
    return new Block(0, [initialTransaction], 5, '123', 'miner', 'abc1', 'block_data_hash', 'blockhash', 1, 1 / 2 / 2018)
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  getBlockchain() {
    return this.blocks
  }

  addBlock(blockToAdd) {
    // Filter pending transactions
    // Update the transactions

    blockToAdd.prevBlockHash = this.getLatestBlock().blockHash
    blockToAdd.blockHash = blockToAdd.calculateHash()
    this.blocks.push(blockToAdd)
  }

  createTransaction(transactionData) {
    const transaction = new Transaction(transactionData.from, transactionData.to, transactionData.value, transactionData.fee, transactionData.senderPubKey, transactionData.date)
    this.pendingTransactions.push(transaction)
    this.incBalance(transactionData.to, value)
    this.decBalance(transactionData.from, value)
  }

  getPendingBalance(addr) {
    const balance = this.getBalance(addr)
    const pendingTransactionsBalance = (this.pendingTransactions || [])
      .reduce((val, tr) => {
        if (tr.from === addr) {
          val -= tr.value
        } else if (tr.to === addr) {
          val += tr.value
        }

        return val
      }, 0)

    return balance + pendingTransactionsBalance
  }

  getBalance(addr, confirmations) {
    const blocks = this.blocks || []
    if (confirmations) {
      if (blocks.length < confirmations) {
        return 0
      }
      blocks = blocks.slice(0, blocks.length - confirmations)
    }

    return blocks
      .flatMap((block) => {
        return block.transactions || []
      })
      .reduce((val, tr) => {
        if (tr.from === addr) {
          val -= tr.value
        } else if (tr.to === addr) {
          val += tr.value
        }

        return val
      }, 0)
  }

  hasBalance(addr, value) {
    const balance = this.getBalance(addr)
    if (value) return (balance - value) > 0
    return balance
  }

  decBalance(addr, value) {
    // Create transaction
  }

  incBalance(addr, value) {
    // Create transaction
  }

  addPeer(url) {
    this.peers.push(url)
  }

  getPeers() {
    return this.peers
  }

  getMiningBlock() {

  }

  getTransactionInfo(hash) {
    return this.transactions.find(t => t.transactionHash === hash)
  }
}

module.exports = Blockchain