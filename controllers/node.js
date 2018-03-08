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

    if (!blockchain.hasBalance(data.from, data.value)) {
      return res.sendStatus(400)
    }

    const transaction = blockchain.createTransaction(data)
    // Calculates the transaction hash
    // Checks for collisions  duplicated transactions are skipped
    // Checks for missing / invalid fields
    // Validates the transaction signature
    // Puts the transaction in the "pending transactions" pool
    // Sends the transaction to all peer nodes through the REST API
    // The transaction is sent from peer to peer until it reaches the entire network

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
        "address": addr,
        "confirmedBalance": 0,
        "lastMinedBalance": 0,
        "pendingBalance": 0
      })
    }

    const balance = blockchain.getBalance(addr)

    res.send({
      "address": address,
      "confirmedBalance": balance,// TODO
      "lastMinedBalance": balance,// TODO
      "pendingBalance": balance// TODO
    })
  }
}

module.exports.getMiningBlock = (blockchain) => {
  return (req, res) => {
    res.send(blockchain.getMiningBlock())
  }
}

module.exports.postPOW = (blockchain) => {
  return (req, res) => {
    const data = req.body
    const block = blockchain.createBlock(data)

    if (!block.isValid()) {
      res.sendStatus(400)
    }

    blockchain.addBlock(req.body)
    blockchain.incBalance(block.minedBy, blockchain.minerReward)

    this.notifyPeers(block.index, blockchain.getCummulativeDifficulty(block.difficulty))

    res.send({
      status: 'accepted',
      message: `Block accepted, expected reward: ${blockchain.minerReward} coins`
    })
  }
}

const notifyPeers = (index, cummulativeDifficulty) => {
  const peers = blockchain.getPeers()

  peers.forEach(url => {
    // Notify
  });
}
