require("dotenv").config();
const { Telegraf } = require("telegraf");
const { initUsers } = require("./utils/accessControl");
const approveAccessHandler = require("./callback_handlers/approveAccess");

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
if (!BOT_TOKEN) {
  console.error("Error: TELEGRAM_TOKEN is not defined in .env file");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

initUsers();

const firstUserAdminMiddleware = require("./middleware/firstUserAdmin");
const accessMiddleware = require("./middleware/access");

bot.use(firstUserAdminMiddleware);
bot.use(accessMiddleware);

require("./commands")(bot);

bot.on("callback_query", async (ctx) => approveAccessHandler(ctx, bot));
bot.catch((err, ctx) => {
  console.error(`Bot Error: ${err}`, ctx.updateType);
});

console.log("Launching bot");

async function startBot() {
  try {
    await bot.telegram.setMyCommands([
      { command: "request_access", description: "Request access to the bot" },
      { command: "secret", description: "Access secret command (if allowed)" },
      {
        command: "upload",
        description: "Send file from server: /upload [path]",
      },
      {
        command: "control",
        description: "Control media playback and take screenshots",
      },
      { command: "screenshot", description: "Take a screenshot of a screen" },
      {
        command: "cancel_shutdown",
        description: "Cancel a scheduled shutdown",
      },
      { command: "stats", description: "Show system stats and top processes" },
      { command: "getip", description: "Show public IP of the server" },
    ]);
  } catch (err) {
    console.error("Error setting bot commands:", err);
  }
  try {
    console.log("Bot started successfully.");
    bot.launch();
  } catch (error) {
    console.error("Bot has an error:", error);
  }
}

startBot();
