const { exec } = require('child_process');

module.exports = (bot) => {
  bot.command('killprocess', async (ctx) => {
    const messageText = ctx.message.text;
    const parts = messageText.split(' ');
    if (parts.length < 2) {
      return ctx.reply('Please provide a process name. Usage: /killprocess <process_name>');
    }

    const processName = parts.slice(1).join(' ');
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
      // On Windows, use taskkill
      // If the process name includes ".exe", keep it. Otherwise, append it if you know the exact process.
      // For generic usage, assume the user provides the full name:
      // Example: /killprocess notepad.exe
      command = `taskkill /IM "${processName}" /F`;
    } else if (platform === 'linux' || platform === 'darwin') {
      // On Linux/macOS, use pkill
      command = `pkill -f "${processName}"`;
    } else {
      return ctx.reply('Unsupported platform for killing processes.');
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error killing process:', error);
        return ctx.reply(`Failed to kill process: ${error.message}`);
      }

      // Check stdout/stderr for output that might indicate success or failure
      // If nothing is returned, just assume success.
      ctx.reply(`Attempted to kill process: ${processName}`);
    });
  });
};
