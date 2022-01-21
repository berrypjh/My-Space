class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  };
};

class BlockHeader {
  constructor(version, previousHash, timestamp, merkleRoot, bit, nonce) {
    this.version = version;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.merkleRoot = merkleRoot;
    this.bit = bit;
    this.nonce = nonce;
  };
};