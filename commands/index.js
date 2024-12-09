const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  const commandsPath = __dirname;
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'index.js');

  for (const file of commandFiles) {
    const commandPath = path.join(commandsPath, file);
    const command = require(commandPath);
    command(bot);
  }
};
