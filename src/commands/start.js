const bot = require('../utils/bot');

bot.command('start', ctx => {
    console.log(ctx.from)
    let message = `Hello ${ctx.from.first_name}, Welcome to the @SelendraChain Bot!.`;
    bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "faucet",
                    callback_data: 'faucet'
                }],
            ]
        }
    })
})
