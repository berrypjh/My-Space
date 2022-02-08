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
  
  if (isValidNewBlock(newBlock, getLastBlock())) {
    Blocks.push(newBlock)
    return true;
  };

  return false;
};

module.exports = {
  createHash,
  getBlocks,
  getVersion,
  nextBlock,
  addBlock,
};