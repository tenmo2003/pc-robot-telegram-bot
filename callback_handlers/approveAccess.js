const { isAdmin, addAllowedUser } = require('../utils/accessControl');

module.exports = async (ctx, bot) => {
  const callbackData = ctx.callbackQuery.data;
  const fromId = ctx.from.id.toString();

  // Only admin can approve
  if (!isAdmin(fromId)) {
    await ctx.answerCbQuery('You are not authorized to approve.', { show_alert: true });
    return;
  }

  if (callbackData.startsWith('approve_access_')) {
    const userIdToApprove = callbackData.replace('approve_access_', '');
    addAllowedUser(userIdToApprove);

    await ctx.answerCbQuery('User approved!', { show_alert: false });
    await ctx.editMessageText(`User ID ${userIdToApprove} has been granted access!`);
    await bot.telegram.sendMessage(userIdToApprove, 'Your access request has been approved!');
  }
};
