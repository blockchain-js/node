// HTTP status codes
const status = require('http-status')

module.exports.getInfo = (blockchain) => {
  return (req, res) => {
    res.send({
      about: "SoftUniChain/Blockchain",
      nodeName: "JS-Node",
      peers: blockchain.peers.length,
      blocks: blockchain.blocks.length,
      pendingTransactions: blockchain.pendingTransactions.length,
      confirmedTransactions: blockchain.confirmedTransactions.length,
      cummulativeDifficulty: blockchain.difficulty,
    })
  }
}

module.exports.getBlocks = (blockchain) => {
  return (req, res) => {
    res.send(blockchain.blocks)
  }
}

module.exports.getBlockByIndex = (blockchain) => {
  return (req, res) => {
    res.send(blockchain.blocks[req.params.index])
  }
}

module.exports.notify = (blockchain) => {
  return (req, res) => {
    const data = req.body
    const latestBlock = blockchain.getLatestBlock()

    if (data.index >= latestBlock.index &&
      data.cummulativeDifficulty > blockchain.getCummulativeDifficulty(latestBlock.difficulty)) {
      // Get the longer chain
    }
  }
}

module.exports.getPeers = (blockchain) => {
  return (req, res) => {
    res.send(blockchain.getPeers())
  }
}

module.exports.addPeer = (blockchain) => {
  return (req, res) => {
    blockchain.addPeer(req.body.url)
  }
}

module.exports.createTransaction = (blockchain) => {
  return (req, res) => {
    const data = req.body

    if (!blockchain.hasBalance(data.from, data.value | 0)) {
      return res.sendStatus(400)
    }

    const transaction = blockchain.createTransaction(data)
    if (blockchain.hasTransaction(transaction.hash) ||
      !transaction.isValid()) {
      return res.sendStatus(400)
    }

    blockchain.addTransaction(transaction)

    notifyPeersOnNewTransaction(blockchain, transaction)

    res.status(201).send({
      "transactionHash": transaction.transactionHash
    })
  }
}

module.exports.getTransactionInfo = (blockchain) => {
  return (req, res) => {
    const transaction = blockchain.getTransactionInfo(req.params.transactionHash)

    if (!transaction) {
      return res.sendstatus(404)
    }

    res.status(200).send(transaction)
  }
}

module.exports.getBalance = (blockchain) => {
  return (req, res) => {
    const addr = req.params.address
    if (!blockchain.hasBalance(addr)) {
      return res.send({
        balance: {
          "address": addr,
          "confirmedBalance": { confirmations: blockchain.confirmations, balance: 0 },
          "lastMinedBalance": { confirmations: 1, balance: 0 },
          "pendingBalance": { confirmations: 0, balance: 0 }
        }
      })
    }

    res.send({
      balance: {
        "address": addr,
        "confirmedBalance": { confirmations: blockchain.confirmations, balance: blockchain.getBalance(addr, req.params.confirmations || blockchain.confirmations) },
        "lastMinedBalance": { confirmations: 1, balance: blockchain.getBalance(addr) },
        "pendingBalance": { confirmations: 0, balance: blockchain.getPendingBalance(addr) }
      }
    })
  }
}

module.exports.getMiningBlock = (blockchain) => {
  return (req, res) => {
    const addr = req.params.address
    const miningBlock = blockchain.getMiningBlock(addr)
    res.send({
      index: miningBlock.index,
      transactionsIncluded: miningBlock.transactions.length,
      expectedReward: blockchain.minerReward,
      blockDataHash: miningBlock.blockDataHash
    })
  }
}

module.exports.postPOW = (blockchain) => {
  return (req, res) => {
    const data = req.body
    const addr = req.params.address
    const block = blockchain.getBlockByAddr(addr)

    if (!blockchain.isBlockValid(block, data)) {
      return res.sendStatus(400)
    }

    blockchain.addBlock(block, data)

    notifyPeersOnNewBlock(blockchain, block.index, blockchain.getCummulativeDifficulty(block.difficulty))

    res.send({
      status: 'accepted',
      message: `Block accepted, expected reward: ${blockchain.minerReward} coins`
    })
  }
}

const notifyPeersOnNewBlock = (blockchain, index, cummulativeDifficulty) => {
  const peers = blockchain.getPeers()

  peers.forEach(url => {
    // Notify
  });
}

const notifyPeersOnNewTransaction = (blockchain, transaction) => {
  const peers = blockchain.getPeers()

  peers.forEach(url => {
    // Notify
  });
}
