const https = require('https');

function fetchPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.ip) {
            resolve(json.ip);
          } else {
            reject(new Error('No IP found in response'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = (bot) => {
  bot.command('getip', async (ctx) => {
    try {
      const publicIP = await fetchPublicIP();
      await ctx.reply(`Your server's public IP is: ${publicIP}`);
    } catch (error) {
      console.error('Error fetching public IP:', error);
      await ctx.reply('Failed to retrieve public IP.');
    }
  });
};
