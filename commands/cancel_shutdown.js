const { exec } = require('child_process');

module.exports = (bot) => {
  bot.command('cancel_shutdown', async (ctx) => {
    const platform = process.platform; // 'win32', 'darwin', 'linux'

    let command;
    if (platform === 'win32') {
      command = 'shutdown /a';
    } else if (platform === 'darwin' || platform === 'linux') {
      command = 'sudo shutdown -c';
    } else {
      await ctx.reply('Unsupported platform for canceling shutdown.');
      return;
    }

    exec(command, (error) => {
      if (error) {
        console.error('Error canceling shutdown:', error);
        ctx.reply(`Failed to cancel shutdown: ${error.message}`);
        return;
      }
      ctx.reply('Successfully canceled the scheduled shutdown.');
    });
  });
};
