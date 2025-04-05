const { Bot } = require("grammy");
const { autoQuote } = require("@roziscoding/grammy-autoquote");
const {
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsLastTraded
} = require("@zoralabs/coins-sdk");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
bot.use(autoQuote());

// Start the bot.
bot.start({
  onStart: (botInfo) => {
    console.info(`Bot @${botInfo.username} is up and running!`);
  }
});

// Handle the /ping command.
bot.command("ping", (ctx) => {
  console.log("Got a /ping command!");
  // Send a message to the chat.
  ctx.reply("Welcome! Up and running.");
});

// Handle the /help command.
bot.command("help", (ctx) => {
  console.log("Got a /help command!");
  // Send a message to the chat.
  ctx.reply(
    "Available commands:\n/ping - Check if the bot is responsive\n/help - Display this help message"
  );
});

// Handle the /topgainers command.
bot.command("topgainers", async (ctx) => {
  console.log("Got a /topgainers command!");
  try {
    const response = await getCoinsTopGainers({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);

    console.log(`Showing top ${tokens?.length} gainers:`);

    tokens?.forEach((coin, index) => {
      const percentChange = coin.marketCapDelta24h
        ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
        : "N/A";

      console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
      console.log(`   24h Change: ${percentChange}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log("-----------------------------------");
    });

    // For pagination
    // if (response.data?.exploreList?.pageInfo?.endCursor) {
    //   console.log(
    //     "Next page cursor:",
    //     response.data?.exploreList?.pageInfo?.endCursor
    //   );
    // }
    ctx.reply(
      `Top Gainers:\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    ctx.reply("Sorry, I couldn't fetch the top gainers at the moment.");
  }
});

// Handle the /topvolume command.

bot.command("topvolume", async (ctx) => {
  console.log("Got a /topvolume command!");
  try {
    const response = await getCoinsTopVolume24h({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);

    console.log(`Showing top ${tokens?.length} volume:`);

    tokens?.forEach((coin, index) => {
      const percentChange = coin.marketCapDelta24h
        ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
        : "N/A";

      console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
      console.log(`   24h Change: ${percentChange}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log(`   Holders: ${coin.uniqueHolders}`);
      console.log("-----------------------------------");
    });

    // For pagination
    // if (response.data?.exploreList?.pageInfo?.endCursor) {
    //   console.log(
    //     "Next page cursor:",
    //     response.data?.exploreList?.pageInfo?.endCursor
    //   );
    // }
    ctx.reply(
      `Top Volume:\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching top volume:", error);
    ctx.reply("Sorry, I couldn't fetch the top volume at the moment.");
  }
});

// Handle the /mostvaluable command.

bot.command("mostvaluable", async (ctx) => {
  console.log("Got a /mostvaluable command!");
  try {
    const response = await getCoinsMostValuable({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);

    console.log(`Showing top ${tokens?.length} valuable:`);

    tokens?.forEach((coin, index) => {
      const percentChange = coin.marketCapDelta24h
        ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
        : "N/A";

      console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
      console.log(`   24h Change: ${percentChange}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log("-----------------------------------");
    });

    // For pagination
    // if (response.data?.exploreList?.pageInfo?.endCursor) {
    //   console.log(
    //     "Next page cursor:",
    //     response.data?.exploreList?.pageInfo?.endCursor
    //   );
    // }
    ctx.reply(
      `Top Valuable:\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching most valuable:", error);
    ctx.reply("Sorry, I couldn't fetch the most valuable at the moment.");
  }
});

// Handle the /new command.
bot.command("new", async (ctx) => {
  console.log("Got a /new command!");
  try {
    const response = await getCoinsNew({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);

    console.log(`Showing top ${tokens?.length} new:`);

    tokens?.forEach((coin, index) => {
      const percentChange = coin.marketCapDelta24h
        ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
        : "N/A";

      const creationDate = new Date(coin.createdAt || "");
      const formattedDate = creationDate.toLocaleString();

      console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
      console.log(`   24h Change: ${percentChange}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log(`   Created: ${formattedDate}`);
      console.log(`   Creator: ${coin.creatorAddress}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log("-----------------------------------");
    });

    // For pagination
    // if (response.data?.exploreList?.pageInfo?.endCursor) {
    //   console.log(
    //     "Next page cursor:",
    //     response.data?.exploreList?.pageInfo?.endCursor
    //   );
    // }
    ctx.reply(
      `New:\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching new:", error);
    ctx.reply("Sorry, I couldn't fetch the new at the moment.");
  }
});

// Handle the /lasttraded command.

bot.command("lasttraded", async (ctx) => {
  console.log("Got a /lasttraded command!");
  try {
    const response = await getCoinsLastTraded({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);
    const creationDate = new Date(tokens?.createdAt || "");
    const formattedDate = creationDate.toLocaleString();
    console.log(`Showing top ${tokens?.length} last traded:`);
    tokens?.forEach((coin, index) => {
      const percentChange = coin.marketCapDelta24h
        ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
        : "N/A";

      console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
      console.log(`   24h Change: ${percentChange}`);
      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log(`   Created: ${formattedDate}`);
      console.log(`   Creator: ${coin.creatorAddress}`);
      console.log("-----------------------------------");
    });
    // For pagination
    // if (response.data?.exploreList?.pageInfo?.endCursor) {
    //   console.log(
    //     "Next page cursor:",
    //     response.data?.exploreList?.pageInfo?.endCursor
    //   );
    // }

    ctx.reply(
      `Last Traded:\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching last traded:", error);
    ctx.reply("Sorry, I couldn't fetch the last traded at the moment.");
  }
});
