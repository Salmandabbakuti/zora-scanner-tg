const { Bot } = require("grammy");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const setCommands = async () => {
  try {
    await bot.api.setMyCommands([
      {
        command: "help",
        description: "Display available commands and their usage"
      },
      { command: "ping", description: "Check if the bot is responsive" }
    ]);
    console.log("Bot commands set successfully.");
  } catch (error) {
    console.error("Error setting bot commands:", error);
  }
};

// Immediately invoked function expression (IIFE) to run the asynchronous function
setCommands();
