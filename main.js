const readline = require('readline');
const Blockchain = require('./blockchain');

const blockchain = new Blockchain(3);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        console.log(formatLine(`Timestamp: ${new Date(block.timestamp).toLocaleString()}`));
        console.log(formatLine(`Dados: `));
        console.log(formatLine(`    From:  ${block.data.from}`));
        console.log(formatLine(`    To:    ${block.data.to}`));
        console.log(formatLine(`    Value: ${block.data.value}`));
        console.log(formatLine(`    Fee:   ${block.data.fee || 0}`));
        console.log(formatLine(`Hash Anterior: ${block.previousHash}`));
        console.log(formatLine(`Hash: ${block.hash}`));
        console.log(formatLine(`Nonce: ${block.nonce}`));
        console.log(line);
        console.log();
    });
}

function isValidNumber(value) {
    return !isNaN(value) && parseFloat(value) > 0;
}

function menu() {
    console.log();
    console.log("Menu - Yke's Blockchain");
    console.log();
    console.log("1 - Exibir blockchain");
    console.log("2 - Adicionar novo bloco");
    console.log("3 - Exibir histórico de transações por endereço");
    console.log("4 - Exibir informações de um endereço");
    console.log("5 - Sair");
    console.log();

    rl.question("Informe a opção que deseja navegar: ", (option) => {
        console.log();
        switch (option) {
            case '1':
                showBlockchain(blockchain);
                menu();
                break;

            case '2':
                rl.question("Digite o endereço de origem (from): ", (from) => {
                    if (!blockchain.isValidAddress(from)) {
                        console.log();
                        console.log('<><><><><><><><><><><><><><><><>');
                        console.log("< Endereço de origem inválido. >");
                        console.log('<><><><><><><><><><><><><><><><>');
                        return menu();
                    }
                    rl.question("Digite o endereço de destino (to): ", (to) => {
                        if (!blockchain.isValidAddress(to)) {
                            console.log();
                            console.log('<><><><><><><><><><><><><><><><><>');
                            console.log("< Endereço de destino inválido. >");
                            console.log('<><><><><><><><><><><><><><><><><>');
                            return menu();
                        }
                        rl.question("Digite o valor da transação: ", (value) => {
                            if (!isValidNumber(value)) {
                                console.log();
                                console.log('XXXXXXXXXXXXXXXXXXX');
                                console.log("X Valor inválido. X");
                                console.log('XXXXXXXXXXXXXXXXXXX');
                                return menu();
                            }
                            rl.question("Digite a taxa da transação (fee): ", (fee) => {
                                if (!isValidNumber(fee)) {
                                    console.log();
                                    console.log('XXXXXXXXXXXXXXXXXX');
                                    console.log("X Taxa inválida. X");
                                    console.log('XXXXXXXXXXXXXXXXXX');
                                    return menu();
                                }
                                console.log();
                                console.log('Minerando...');
                                blockchain.addBlock({ from, to, value: parseFloat(value), fee: parseFloat(fee) });
                                menu();
                            });
                        });
                    });
                });
                break;

            case '3':
                rl.question("Digite o endereço para verificar o histórico de transações: ", (address) => {
                    if (!blockchain.isValidAddress(address)) {
                        console.log();
                        console.log('<><><><><><><><><><><>');
                        console.log("< Endereço inválido. >");
                        console.log('<><><><><><><><><><><>');
                    } else {
                        const history = blockchain.getTransactionHistory(address);
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
                                console.log(`Fee:   ${data.fee || 0}`);
                                console.log();
                                console.log('---------------------------------------------------------');
                            });
                        }
                    }
                    menu();
                });
                break;

            case '4':
                rl.question("Digite o endereço para exibir informações: ", (address) => {
                    if (!blockchain.isValidAddress(address)) {
                        console.log();
                        console.log('<><><><><><><><><><><>');
                        console.log("< Endereço inválido. >");
                        console.log('<><><><><><><><><><><>');
                    } else {
                        const { balance, transactions } = blockchain.getAddressInfo(address);
                        console.log();
                        console.log("Informações do endereço:");
                        console.log('---------------------------------------------------------');
                        console.log(`Saldo: ${balance} YkeCoin`);
                        console.log("Histórico de transações:");
                        if (transactions.length === 0) {
                            console.log("Nenhuma transação encontrada.");
                        } else {
                            transactions.forEach((data, index) => {
                                console.log(`#${index + 1} - De: ${data.from} Para: ${data.to}, Valor: ${data.value}, Taxa: ${data.fee || 0}`);
                            });
                        }
                        console.log('---------------------------------------------------------');
                    }
                    menu();
                });
                break;

            case '5':
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