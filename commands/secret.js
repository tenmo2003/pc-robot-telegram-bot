module.exports = (bot) => {
  bot.command('secret', (ctx) => {
    ctx.reply('You have access to the secret command!');
  });
};
