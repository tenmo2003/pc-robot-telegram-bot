const { exec } = require('child_process');

async function scheduleShutdown(minutes, force = true) {
  const platform = process.platform;
  const time = parseInt(minutes, 10);

  if (isNaN(time) || time < 0) {
    throw new Error('Invalid time specified.');
  }

  if (platform === 'win32') {
    const forceFlag = force ? ' /f' : '';
    return new Promise((resolve, reject) => {
      exec(`shutdown /s /t ${time * 60}${forceFlag}`, (error) => {
        if (error) return reject(error);
        resolve(`System will shut down in ${time} minute(s).${force ? ' (Forced)' : ''}`);
      });
    });
  } else if (platform === 'darwin' || platform === 'linux') {
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
      return ctx.reply('Please specify the time in minutes. Usage: /shutdown <minutes>');
    }

    const minutes = parts[1];

    try {
      const resultMessage = await scheduleShutdown(minutes, true);
      await ctx.answerCbQuery(resultMessage, { show_alert: true });
    } catch (error) {
      console.error('Error scheduling shutdown:', error);
      await ctx.answerCbQuery(`Failed to schedule shutdown: ${error.message}`, { show_alert: true });
    }
  });
};
