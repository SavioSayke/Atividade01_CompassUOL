const CryptoJS = require('crypto-js');
const { format } = require('date-fns');

class Block {
    constructor(index, timestamp, data, previousHash, hash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0", this.calculateHash(0, "0", Date.now(), "Genesis Block"));
    }

    calculateHash(index, previousHash, timestamp, data) {
        return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();
    }

    addBlock(data) {
        const previousBlock = this.chain[this.chain.length - 1];
        const index = previousBlock.index + 1;
        const timestamp = Date.now();

        const hash = this.calculateHash(index, previousBlock.hash, timestamp, data);

        const newBlock = new Block(index, timestamp, data, previousBlock.hash, hash);
        this.chain.push(newBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    validateChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.data)) {
                return false;
            }
        }
        return true;
    }
}

const transaction = new Blockchain();

transaction.addBlock(["Transaction: Beatriz send 0.0054 BTC to Matheus"]);
transaction.addBlock(["Transaction: Carlos send 0.00021 BTC to Wandreus"]);
transaction.addBlock(["Transaction: Pedro send 0.9 BTC to Luiz"]);

function showBlockchain(blockchain) {
    blockchain.chain.forEach(block => {
        const boxWidth = 90;
        const line = '*'.repeat(boxWidth);
        
        console.log(line);
        console.log(`                                   Bloco #${block.index}`);
        console.log(`Timestamp: ${format(new Date(block.timestamp), 'yyyy-MM-dd HH:mm:ss')}`);
        console.log(`Dados: ${JSON.stringify(block.data)}`);
        console.log(`Hash Anterior: ${block.previousHash}`);
        console.log(`Hash: ${block.hash}`);
        console.log(line);
        console.log();
    });
}

showBlockchain(transaction);