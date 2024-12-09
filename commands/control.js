const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.command('control', (ctx) => {
    ctx.reply(
      'Use the buttons below to control your media playback or capture a screenshot.',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('⏯️ Play/Pause', 'play_pause'),
          Markup.button.callback('⏭️ Next', 'next'),
          Markup.button.callback('⏮️ Previous', 'previous'),
        ],
        [
          Markup.button.callback('🔊 Volume Up', 'volume_up'),
          Markup.button.callback('🔉 Volume Down', 'volume_down'),
          Markup.button.callback('🔇 Mute', 'mute'),
        ],
        [
          Markup.button.callback('🖼️ Screenshot', 'select_screen'),
        ],
      ])
    );
  });
};
