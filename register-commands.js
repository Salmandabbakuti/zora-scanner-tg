const { Bot } = require("grammy");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const setCommands = async () => {
  try {
    await bot.api.setMyCommands([
      {
        command: "start",
        description: "Start the bot and display welcome message"
      },
      {
        command: "help",
        description: "Display available commands and their usage"
      },
      { command: "ping", description: "Check if the bot is responsive" },
      {
        command: "topgainers",
        description: "Show top gainers in the market"
      },
      {
        command: "topvolume",
        description: "Show top volume coins in the market"
      },
      {
        command: "mostvaluable",
        description: "Show most valuable coins in the market"
      },
      { command: "newcoins", description: "Show new coins in the market" },
      {
        command: "lasttraded",
        description: "Show last traded coins in the market"
      },
      {
        command: "coin",
        description:
          "Get details of a specific coin by address. Use /coin <address>"
      },
      {
        command: "profile",
        description:
          "Get profile details by address or handle. Use /profile <address/handle>"
      },
      {
        command: "balances",
        description:
          "Get token balances for a specific profile by address or handle. Use /balances <address/handle>"
      }
    ]);
    console.log("Bot commands set successfully.");
  } catch (error) {
    console.error("Error setting bot commands:", error);
  }
};

// Immediately invoked function expression (IIFE) to run the asynchronous function
setCommands();
