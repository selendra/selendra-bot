const { ethers } = require('ethers');
const UtilCrypto = require("@polkadot/util-crypto");

function isvalidEvmAddress(address) {
    const check = ethers.utils.isAddress(address);
    if (check) {
      return true;
    } else {
      return false;
    }
}

function isvalidSubstrateAddress(address) {
    const check = UtilCrypto.checkAddress(address, 42);
    if (check[0]) {
        return true;
    } else {
        return false;
    }
}

module.exports.isvalidEvmAddress = isvalidEvmAddress;
module.exports.isvalidSubstrateAddress = isvalidSubstrateAddress;