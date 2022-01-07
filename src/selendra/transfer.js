const db = require("../utils/db");
const { ethers } = require('ethers');
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
require('dotenv').config();

async function sendEtherToken(address, amount) {
    const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.testnet.selendra.org/", { chainId: 222 }
    );
    let wallet = new ethers.Wallet(process.env.PRIVATEKEY, provider);
    const tx = { to: address, value: ethers.utils.parseEther(amount) };
    console.log(`Sending ${amount} SEL to ${address}`);
    const createReceipt = await wallet.sendTransaction(tx);
    await createReceipt.wait();
    console.log("Transfer sent with hash", amount);
}

async function sendSubtrateToken(address, amount) {
    const ws = new WsProvider("wss://rpc1-testnet.selendra.org/");
    const api = await ApiPromise.create({ provider: ws });

    const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });
    const account = keyring.addFromMnemonic(process.env.MNEMONIC);

    const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));
    console.log(`Sending ${amount} SEL to ${address}`);
    const transfer = api.tx.balances.transfer(address, parsedAmount);
    const hash = await transfer.signAndSend(account);
    console.log("Transfer sent with hash", hash.toHex());
  }


module.exports.ethTransfer = async function transfer(bot, user_id, address) {
    const now = Date.now();
    const last = await db.query(user_id);
    if (last != 0){
        if (now - last > 24 * 1000 * 60 * 60) {
            db.update(user_id, now);
            try{
                await sendEtherToken(address, "10");
                bot.telegram.sendMessage(user_id, "balance have seen", {})
            }catch(e){
                console.log(e)
                bot.telegram.sendMessage(user_id, "Sorry problem occured, please come back later", {})
            }
        }else{
            bot.telegram.sendMessage(user_id, "Please come back later. Normally, you need 24 hours before you can claim again.", {})
        }
    } 
    else {
        db.insert(user_id, now);
        await sendEtherToken(address, "10");
        bot.telegram.sendMessage(user_id, "balance have seen", {}) 
    }
}

module.exports.subTransfer = async function transfer(bot, user_id, address) {
    const now = Date.now();
    const last = await db.query(user_id);
    if (last != 0){
        if (now - last > 24 * 1000 * 60 * 60) {
            db.update(user_id, now);
            try{
                await sendSubtrateToken(address, 1000);
                bot.telegram.sendMessage(user_id, "balance have seen", {})
            }catch(e){
                console.log(e)
                bot.telegram.sendMessage(user_id, "Sorry problem occured, please come back later", {})
            }
        }else{
            bot.telegram.sendMessage(user_id, "Please come back later. Normally, you need 24 hours before you can claim again.", {})
        }
    } 
    else {
        db.insert(user_id, now);
        await sendSubtrateToken(address, 1000);
        bot.telegram.sendMessage(user_id, "balance have seen", {}) 
    }
}