const fs = require('fs');
const merkle = require('merkle');
const cryptojs = require('crypto-js');

class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  };
};

class BlockHeader {
  constructor (version, index, previousHash, timestamp, merkleRoot, bit, nonce) {
    this.version = version;
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.merkleRoot = merkleRoot;
    this.bit = bit;
    this.nonce = nonce;
  };
};

const getVersion = () => {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
};

const createGenesisBlock = () => {
  const version = getVersion();
  const index = 0;
  const previousHash = '0'.repeat(64);
  const timestamp = 1231006505;  // 2009/01/03 6:15pm (UTC)
  const body = ['hello block'];
  const tree = merkle('sha256').sync(body);
  const merkleRoot = tree.root() || '0'.repeat(64);
  const bit = 0;
  const nonce = 0;

  const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, bit, nonce);

  return new Block(header, body);
};

let Blocks = [createGenesisBlock()];

const getBlocks = () => {
  return Blocks;
};

const getLastBlock = () => {
  return Blocks[Blocks.length - 1];
};

const createHash = (data) => {
  const { version, index, previousHash, timestamp, merkleRoot, bit, nonce } = data.header;
  const blockString = version + index + previousHash + timestamp + merkleRoot + bit + nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
};

const getTimestamp = () => {
  return Math.round(new Date().getTime() / 1000);
};

const nextBlock = (bodyData) => {
  const prevBlock = getLastBlock();
  const version = getVersion();
  const index = prevBlock.header.index + 1;
  const previousHash = createHash(prevBlock);
  const timestamp = getTimestamp();
  const tree = merkle('sha256').sync(bodyData);
  const merkleRoot = tree.root() || '0'.repeat(64);
  const bit = 0;
  const nonce = 0;

  const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, bit, nonce)
  return new Block(header, bodyData);
};

const addBlock = (newBlock) => {
  const { isValidNewBlock } = require('./checkValidBlock');
  const { broadcast, responseLatestMsg } = require("./p2pServer");

  if (isValidNewBlock(newBlock, getLastBlock())) {
    Blocks.push(newBlock);
    broadcast(responseLatestMsg());
    return true;
  };

  return false;
};

const isValidChain = (blockchainToValidate) => {
  const { isValidNewBlock } = require('./checkValidBlock');

  const isValidGenesis = (block) => {
    return JSON.stringify(block) === JSON.stringify(createGenesisBlock());
  };

  if (!isValidGenesis(blockchainToValidate[0])) {
    console.log(
      "The candidateChains's genesisBlock is not the same as our genesisBlock"
    );
    return false;
  };

  for (let i = 1; i < blockchainToValidate.length; i++) {
    if (i !== 0 && !isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
      return null;
    };
  };
  return true;
};

const replaceChain = (candidateChain) => {
  const { broadcast, responseLatestMsg } = require("./p2pServer");

  const foreignUTxOuts = isValidChain(candidateChain);
  const validChain = foreignUTxOuts !== null;
  if (validChain) {
    Blocks = candidateChain;
    broadcast(responseLatestMsg());
    return true;
  } else {
    return false;
  };
};

module.exports = {
  createHash,
  getBlocks,
  getVersion,
  nextBlock,
  addBlock,
  getLastBlock,
  replaceChain,
};