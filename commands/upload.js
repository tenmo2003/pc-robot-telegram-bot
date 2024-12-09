const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.command('upload', async (ctx) => {
    const messageText = ctx.message.text.trim();
    const parts = messageText.split(' ');

    if (parts.length < 2) {
      return ctx.reply('Please specify a file path. Usage: /upload <file_path>');
    }

    const filePath = parts.slice(1).join(' ');
    const fullPath = path.resolve(filePath); // Resolve to absolute path if needed

    try {
      const stat = fs.statSync(fullPath);

      // Telegram maximum file size currently: 2GB = 2 * 1024 * 1024 * 1024 bytes
      const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

      if (stat.size > MAX_FILE_SIZE) {
        return ctx.reply('File is too large to send via Telegram (limit is 2GB).');
      }

      // Send the file as a document
      await ctx.replyWithDocument({ source: fullPath });
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.code === 'ENOENT') {
        ctx.reply('File not found. Please provide a valid file path.');
      } else {
        ctx.reply('An error occurred while uploading the file.');
      }
    }
  });
};
