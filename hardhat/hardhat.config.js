/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

const INFURA_URL =
  "https://goerli.infura.io/v3/44758ed9fa2042658be46cc40fa77e7d";
const PRIVATE_KEY =
  "07cb3e244431233f25c88cbd1be5736364d914e9e627536608cea29017c533e5";

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
