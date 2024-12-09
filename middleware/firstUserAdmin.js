const { getAdmin, setAdmin } = require('../utils/accessControl');

module.exports = (ctx, next) => {
  const currentAdmin = getAdmin();
  if (!currentAdmin && ctx.from && ctx.from.id) {
    const userId = ctx.from.id.toString();
    setAdmin(userId);
    ctx.reply('You are now the admin!');
  }
  return next();
};
