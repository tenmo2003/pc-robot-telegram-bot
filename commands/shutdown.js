const { exec } = require('child_process');

async function scheduleShutdown(minutes) {
  const platform = process.platform;
  const time = parseInt(minutes, 10);

  if (isNaN(time) || time < 0) {
    throw new Error('Invalid time specified.');
  }

  if (platform === 'win32') {
    // Windows: shutdown /s /t X (X in seconds)
    return new Promise((resolve, reject) => {
      exec(`shutdown /s /t ${time * 60}`, (error) => {
        if (error) return reject(error);
        resolve(`System will shut down in ${time} minute(s).`);
      });
    });
  } else if (platform === 'darwin' || platform === 'linux') {
    // macOS/Linux: shutdown -h +M (M in minutes)
    return new Promise((resolve, reject) => {
      exec(`sudo shutdown -h +${time}`, (error) => {
        if (error) return reject(error);
        resolve(`System will shut down in ${time} minute(s).`);
      });
    });
  } else {
    throw new Error('Unsupported platform for shutdown command.');
  }
}

module.exports = (bot) => {
  bot.command('shutdown', async (ctx) => {
    const messageText = ctx.message.text.trim();
    const parts = messageText.split(' ');

    if (parts.length < 2) {
      return ctx.reply('Please specify the time in minutes. For example: /shutdown 30');
    }

    const minutes = parts[1];
    try {
      const resultMessage = await scheduleShutdown(minutes);
      await ctx.reply(resultMessage);
    } catch (error) {
      console.error('Error scheduling shutdown:', error);
      await ctx.reply(`Failed to schedule shutdown: ${error.message}`);
    }
  });
};
