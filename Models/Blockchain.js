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
    this.miners = {}
  }

  getCummulativeDifficulty(difficulty) {
    return difficulty + (2 ^ 64 / this.baseTarget)
  }

  createGenesisBlock() {
    const initialTransaction = {
      index: 0,
      from: '0x00',
      to: '0x00',
      value: 0,
      fee: 0,
      transactions: [],
      senderPubKey: '',
      senderSignature: '',
      transactionHash: '',
      minedInBlockIndex: '',
      transferSuccessful: true
    }
    return new Block(0, [initialTransaction], 0, '', '', '', '', '', '', new Date().getTime())
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  getBlockchain() {
    return this.blocks
  }

  addBlock(blockToAdd, minerData) {
    const block = new Block(
      blockToAdd.index, 
      blockToAdd.transactions, 
      blockToAdd.difficulty, 
      blockToAdd.prevBlockHash, 
      blockToAdd.minedBy, 
      minerData.blockHash,
      minerData.nonce,
      minerData.dateCreated
    )

    this.blocks.push(blockToAdd)

    this.transactions = this.transactions.concat(block.transactions)
    const transactionHashes = this.transactions.map(tr => tr.transactionHash)
    this.pendingTransactions = this.pendingTransactions.filter(tr => {
      return !transactionHashes.includes(tr.transactionHash)
    })

    return block
  }

  createTransaction(transactionData) {
    return new Transaction(transactionData.from, transactionData.to, transactionData.value, transactionData.fee, transactionData.senderPubKey, transactionData.dateCreated, transactionData.senderSignature)
  }

  hasTransaction(transactionHash) {
    return this.transactions.concat(this.pendingTransactions)
      .some(tr => tr.transactionHash === transactionHash)
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getPendingBalance(addr) {
    const balance = this.getBalance(addr)
    const pendingTransactionsBalance = (this.pendingTransactions || [])
      .reduce((val, tr) => {
        if (tr.from === addr) {
          val -= tr.value
        } 
        
        if (tr.to === addr) {
          val += tr.value
        }

        return val
      }, 0)

    return balance + pendingTransactionsBalance
  }

  getBalance(addr, confirmations) {
    let blocks = this.blocks || []
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
        } 
        
        if (tr.to === addr) {
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

  addPeer(url) {
    this.peers.push(url)
  }

  getPeers() {
    return this.peers
  }

  getMiningBlock(addr) {
    const index = this.blocks.length
    const transactions = this.pendingTransactions.map(tr => {
      return Object.assign({}, tr, {
        transferSuccessful: true,
        minedInBlockIndex: index
      })
    })
    const coinbaseTransaction = Transaction.getCoinbaseTransaction(addr, this.minerReward, index)
    const blockCandidate = Block.getBlockCandidate(addr, index, [coinbaseTransaction].concat(this.pendingTransactions), this.minerReward, this.getLatestBlock().blockHash, this.difficulty)
    this.miners[addr] = blockCandidate
    return blockCandidate
  }

  getTransactionInfo(hash) {
    return this.transactions.find(t => t.transactionHash === hash)
  }

  getBlockByAddr(addr) {
    return this.miners[addr]
  }

  isBlockValid(blockCandidate, minerData) {
    if(minerData.blockHash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      return false
    }
    return true
  }
}

module.exports = Blockchain