const CryptoJS = require('crypto-js');
const { format } = require('date-fns');
const readline = require('readline');

class Block {
    constructor(index, timestamp, data, previousHash, hash, nonce) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
    }
}

class Blockchain {
    constructor(difficulty = 4) {
        this.difficulty = difficulty;
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0", this.calculateHash(0, "0", Date.now(), "Genesis Block", 0), 0);
    }

    calculateHash(index, previousHash, timestamp, data, nonce) {
        return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();
    }

    mineBlock(index, previousHash, timestamp, data) {
        let nonce = 0;
        let hash = this.calculateHash(index, previousHash, timestamp, data, nonce);

        const target = Array(this.difficulty + 1).join("0");

        while (!hash.startsWith(target)) {
            nonce++;
            hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
        }

        return {hash, nonce};
    }

    isValidAddress(address) {
        return /^yke[a-fA-F0-9]{47}$/.test(address);
    }

    addBlock(data) {
        const {from, to, value} = data;
        if (!this.isValidAddress(from) || !this.isValidAddress(to)) {
            console.log();
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log("X Endereço inválido. Transação rejeitada. X");
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            return;
        }

        const previousBlock = this.chain[this.chain.length - 1];
        const index = previousBlock.index + 1;
        const timestamp = Date.now();

        const {hash, nonce} = this.mineBlock(index, previousBlock.hash, timestamp, data);

        const newBlock = new Block(index, timestamp, data, previousBlock.hash, hash, nonce);
        this.chain.push(newBlock);
        console.log();
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
        console.log("✓ Bloco adicionado com sucesso! ✓");
        console.log('✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓');
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

            if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.data, currentBlock.nonce)) {
                return false;
            }
        }
        return true;
    }

    getTransactionHistory(address) {
        return this.chain
            .map(block => block.data)
            .filter(data => data.from === address || data.to === address);
    }
}

const transaction = new Blockchain(4);

function showBlockchain(blockchain) {
    blockchain.chain.forEach(block => {
        const boxWidth = 85;

        const line = '*'.repeat(boxWidth);

        function formatLine(text) {
            const availableSpace = boxWidth - 4;
            const leftSpace = ' '.repeat(Math.max(availableSpace - text.length, 0));
            return `* ${text}${leftSpace} *`;
        }

        console.log(line);
        console.log(formatLine(`Bloco #${block.index}`));
        console.log(formatLine(`Timestamp: ${format(new Date(block.timestamp), 'yyyy-MM-dd HH:mm:ss')}`));
        //console.log(formatLine(`Dados: ${JSON.stringify(block.data)}`));
        console.log(formatLine(`Dados: `));
        console.log(formatLine(`    From:  ${block.data.from}`));
        console.log(formatLine(`    To:    ${block.data.to}`));
        console.log(formatLine(`    Value: ${block.data.value}`));
        console.log(formatLine(`Hash Anterior: ${block.previousHash}`));
        console.log(formatLine(`Hash: ${block.hash}`));
        console.log(formatLine(`Nonce: ${block.nonce}`));
        console.log(line);
        console.log();
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    console.log();
    console.log("Menu - Yke's Blockchain");
    console.log();
    console.log("1 - Exibir blockchain");
    console.log("2 - Adicionar novo bloco");
    console.log("3 - Exibir histórico de transações por endereço");
    console.log("4 - Sair");
    console.log();

    rl.question("Informe a opção que deseja navegar: ", (option) => {
        console.log();
        switch (option) {
            case '1':
                showBlockchain(transaction);
                menu();
                break;

            case '2':
                rl.question("Digite o endereço de origem (from): ", (from) => {
                    rl.question("Digite o endereço de destino (to): ", (to) => {
                        rl.question("Digite o valor da transação: ", (value) => {
                            console.log();
                            console.log('Minerando...');
                            transaction.addBlock({from, to, value: parseFloat(value)});
                            menu();
                        });
                    });
                });
                break;

            case '3':
                rl.question("Digite o endereço para verificar o histórico de transações: ", (address) => {
                    if (!transaction.isValidAddress(address)) {
                        console.log();
                        console.log('<><><><><><><><><><><>');
                        console.log("< Endereço inválido. >");
                        console.log('<><><><><><><><><><><>');
                    } else {
                        const history = transaction.getTransactionHistory(address);
                        if (history.length === 0) {
                            console.log();
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log("X Nenhuma transação encontrada para este endereço. X");
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        } else {
                            console.log();
                            console.log("Histórico de transações:");
                            console.log('---------------------------------------------------------');
                            history.forEach((data, index) => {
                                console.log();
                                console.log(`#${index + 1}`);
                                console.log(`From:  ${data.from}`);
                                console.log(`To:    ${data.to}`);
                                console.log(`Value: ${data.value}`, 'YkeCoin');
                                console.log();
                            console.log('---------------------------------------------------------');
                            });
                        }
                    }
                    menu();
                });
                break;

            case '4':
                console.log("♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡");
                console.log("♡ Obrigado por utilizar. ♡");
                console.log("♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡");
                rl.close();
                break;

            default:
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                console.log("x Opção inválida. Por favor, escolha uma opção válida! x");
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                menu();
                break;
        }
    });
}

menu();

// yke1234567890abcdef1234567890abcdef1234567890abcde       true
// yke0abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd       true
// yke1a2b3c4d5e6f7890a1b2c3d4e5f6a7b8c9d0e1f2b3c4d50	    true

// yk1234567890abcdef1234567890abcdef1234567890abc	        false
// yke12345						                            false
// yke1234567890abcdef1234567890abcdef1234567890abcdefg	    false
// yke@1234567890abcdef1234567890abcdef1234567890abcd	    false