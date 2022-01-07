const bot = require('../utils/bot');
const selendra = require("../selendra/transfer.js");
const { isvalidEvmAddress, isvalidSubstrateAddress } = require('../utils/validAddress');

bot.action('faucet', ctx => {
    console.log(ctx.from)
    let message = `Please, select address type you want to get balance`;
    bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "substrate-address",
                        callback_data: 'substrate-address'
                    },
                    {
                        text: "evm-address",
                        callback_data: 'evm-address'
                    }
                ],

            ]
        }
    })
})

bot.action('evm-address', async (ctx, next) => {
    bot.telegram.sendMessage(ctx.chat.id, "Send me EVM address format: 0xx...", {})
})

bot.action('substrate-address', async (ctx, next) => {
    bot.telegram.sendMessage(ctx.chat.id, "Send me Substrate address format: 5xx...", {})
})

bot.hears(/0(.+)/, async (ctx, next) => {
    const valid = isvalidEvmAddress(ctx.message.text);
    if (valid) {
        const user_id = ctx.chat.id;
        await selendra.ethTransfer(bot, user_id, ctx.message.text);
    }else {
        bot.telegram.sendMessage(ctx.chat.id, "your evm address is invalid", {})
    }
})

bot.hears(/5(.+)/, async (ctx, next) => {
    const valid = isvalidSubstrateAddress(ctx.message.text);
    if (valid) {
        const user_id = ctx.chat.id;
        await selendra.subTransfer(bot, user_id, ctx.message.text);
    }else {
        bot.telegram.sendMessage(ctx.chat.id, "your substrate address is invalid", {})
    }
    
})
