const { Markup } = require('telegraf');
const { getScreens, takeScreenshot, cleanupFile } = require('../utils/screenshot');

module.exports = (bot) => {
  // /screenshot command
  bot.command('screenshot', async (ctx) => {
    const screens = await getScreens();

    if (screens.length === 1) {
      // Directly take a screenshot if there's only one screen
      try {
        const filePath = await takeScreenshot(screens[0].id);
        await ctx.replyWithPhoto({ source: filePath });
        cleanupFile(filePath);
      } catch (error) {
        await ctx.reply('Failed to take a screenshot.');
      }
    } else {
      // Show an inline keyboard with the list of screens, indexed from 1
      const buttons = screens.map((screen, index) =>
        Markup.button.callback(`Screen ${index + 1}`, `screenshot_${screen.id}`)
      );
      await ctx.reply('Select a screen to capture:', Markup.inlineKeyboard(buttons));
    }
  });

  // Handle callback queries related to screenshots
  bot.action('select_screen', async (ctx) => {
    const screens = await getScreens();
    if (screens.length === 1) {
      try {
        const filePath = await takeScreenshot(screens[0].id);
        await ctx.replyWithPhoto({ source: filePath });
        cleanupFile(filePath);
      } catch (error) {
        await ctx.reply('Failed to take a screenshot.');
      }
    } else {
      const buttons = screens.map((screen, index) =>
        Markup.button.callback(`Screen ${index + 1}`, `screenshot_${screen.id}`)
      );
      await ctx.editMessageText('Select a screen to capture:', Markup.inlineKeyboard(buttons));
    }

    await ctx.answerCbQuery();
  });

  bot.action(/^screenshot_(.*)$/, async (ctx) => {
    const screenId = ctx.match[1]; // captured group from the regex
    try {
      const filePath = await takeScreenshot(screenId);
      await ctx.replyWithPhoto({ source: filePath });
      cleanupFile(filePath);
    } catch (error) {
      await ctx.reply('Failed to take a screenshot.');
    }
    await ctx.answerCbQuery();
  });
};
