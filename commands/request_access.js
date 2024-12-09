const { Markup } = require('telegraf');
const { isAdmin, isAllowedUser, getAdmin } = require('../utils/accessControl');

module.exports = (bot) => {
  bot.command('request_access', async (ctx) => {
    const fromId = ctx.from.id.toString();
    if (isAllowedUser(fromId) || isAdmin(fromId)) {
      return ctx.reply('You already have access.');
    }

    const adminId = getAdmin();
    if (!adminId) {
      return ctx.reply('No admin is set yet. Please try again later.');
    }

    const requestText = `User ID ${fromId} is requesting access. Approve?`;
    await ctx.telegram.sendMessage(
      adminId,
      requestText,
      Markup.inlineKeyboard([
        [Markup.button.callback('Approve', `approve_access_${fromId}`)]
      ])
    );

    ctx.reply('Your request has been sent to the admin. Please wait for approval.');
  });
};
