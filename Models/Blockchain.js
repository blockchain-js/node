const Block = require('./Block.js')
const Transaction = require('./Transaction.js')

class Blockchain {

  constructor() {
    this.blocks = [this.createGenesisBlock()]
    this.balances = []
    this.transactions = []
    this.pendingTransactions = []
    this.cummulativeDifficulty = []
    this.difficulty = 0
  }

  createGenesisBlock() {
    const initialTransaction = {
      from: '0x00',
      to: '0x00',
      value: 500,
      fee: 50,
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
    blockToAdd.prevBlockHash = this.getLatestBlock().blockHash
    blockToAdd.blockHash = blockToAdd.calculateHash()
    this.blocks.push(blockToAdd)
  }

  createTransaction(transactionData) {
    const transaction = new Transaction(transactionData.from, transactionData.to, transactionData.value, transactionData.fee, transactionData.senderPubKey, transactionData.date)
    this.pendingTransactions.push(transaction)
  } 
  
  getBalance(addr) {
    return this.balances[addr]
  }

  hasBalance(addr, value) {
    if (value) return (this.balances[addr] - value) > 0
    return this.balances[addr]
  }

  addPeer(url) {
    this.peers.push(url)
  }

  getPeers() {
    return this.peers
  } 
}

module.exports = Blockchain