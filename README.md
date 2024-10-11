# Atividade Individual (Sprint 01) - Blockchain Simples

Projeto referente a Sprint 01 do programa de estágio da Compass UOL.

Foi implementado em Javascript uma blockchain básica. Ela cria uma cadeia simples de blocos, onde cada bloco contém dados de transações. A blockchain garante a integridade dos dados por meio da função hash e fornece funcionalidades para adicionar blocos e validar toda a cadeia.

---

## Como utilizar/rodar o projeto

Para utilizar este projeto:

1. É preciso ter o [Node.js](https://nodejs.org/pt/download/package-manager) instalado.

2. Clone esse repositório.
```bash
git clone https://github.com/SavioSayke/Atividade01_CompassUOL.git
```

3. Em seguida, navegue até o diretório dos arquivos pelo seu terminal e faça a instalação dos seguintes módulos abaixo:
```bash
npm install crypto-js
```
```bash
npm install date-fns
```

4. Execute o script utilizando.
```bash
node blockchain.js
```

---

## Funcionalidades

- **Criação do Bloco Gênesis**: Cria automaticamente o primeiro bloco da blockchain.
- **Adição de Blocos**: Permite adicionar novos blocos com dados de transações.
- **Cálculo de Hash**: Utiliza hashing SHA-256 para manter a integridade da blockchain.
- **Validação da Cadeia**: Verifica a validade da blockchain para garantir que não haja blocos adulterados.
- **Registro de Data e Hora**: Registra o momento em que cada bloco é criado.

---

## Tecnologias Utilizadas

- **JavaScript**: A linguagem de programação principal utilizada para construir a blockchain.
- **CryptoJS**: Uma biblioteca usada para funções criptográficas, especificamente para hashing.
- **date-fns**: Uma biblioteca para formatação de datas.

---

## Informações sobre o Código

### class Block

A classe `Block` representa cada bloco na blockchain e inclui propriedades como:

- `index`: A posição do bloco na cadeia.
- `timestamp`: O momento em que o bloco foi criado.
- `data`: Os dados da transação armazenados no bloco.
- `previousHash`: O hash do bloco anterior na cadeia.
- `hash`: O hash do bloco atual.

### class Blockchain

A classe `Blockchain` gerencia toda a cadeia de blocos. Métodos principais incluem:

- **createGenesisBlock()**: Cria o primeiro bloco com valores predefinidos.
- **calculateHash()**: Gera um hash para os dados de um bloco dado.
- **addBlock()**: Adiciona um novo bloco com os dados da transação fornecidos.
- **getLatestBlock()**: Recupera o bloco mais recente na cadeia.
- **validateChain()**: Valida a integridade da blockchain.

### Exemplos de Transações

```javascript
const transaction = new Blockchain();

transaction.addBlock(["Transação: Beatriz enviou 0.0054 BTC para Matheus"]);
transaction.addBlock(["Transação: Carlos enviou 0.00021 BTC para Wandreus"]);
transaction.addBlock(["Transação: Pedro enviou 0.9 BTC para Luiz"]);
```

### Exibindo a Blockchain

A função `showBlockchain` formata e exibe os detalhes de cada bloco no console, incluindo:

- Número do bloco
- Timestamp
- Dados da transação
- Hash anterior
- Hash atual