const { Bot } = require("grammy");
const { autoQuote } = require("@roziscoding/grammy-autoquote");
const {
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsLastTraded,
  getCoin,
  getProfile,
  getProfileBalances
} = require("@zoralabs/coins-sdk");
const { formatUnits } = require("viem");
const cron = require("node-cron");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const utc = require("dayjs/plugin/utc");
const express = require("express");
require("dotenv").config();

dayjs.extend(relativeTime);
dayjs.extend(utc);

const app = express();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
bot.use(autoQuote());

const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

const formatTokenAmount = (amount, decimals = 18) => {
  const formattedAmount = formatUnits(BigInt(amount), decimals);
  return formattedAmount.replace(/\.?0+$/, "");
};

bot.command("start", (ctx) =>
  ctx.reply(
    "👋 Welcome to the Zora Pulse Bot! This bot provides information about various coins insights and zora profiles on Base mainnet. Try /help to see available commands."
  )
);

cron.schedule("0 * * * *", async () => {
  console.log("Running hourly market update...");

  try {
    const [gainers, volume, valuable, newest, traded] = await Promise.all([
      getCoinsTopGainers({ count: 5 }),
      getCoinsTopVolume24h({ count: 5 }),
      getCoinsMostValuable({ count: 5 }),
      getCoinsNew({ count: 5 }),
      getCoinsLastTraded({ count: 5 })
    ]);

    const formatGainers = gainers.data?.exploreList?.edges?.map((e, i) => {
      const c = e.node;
      const change = c.marketCapDelta24h
        ? `${parseFloat(c.marketCapDelta24h).toFixed(2)}%`
        : "N/A";
      return `${i + 1}. ${c.name} (${c.symbol}) ${change}`;
    });

    const formatVolume = volume.data?.exploreList?.edges?.map((e, i) => {
      const c = e.node;
      return `${i + 1}. ${c.name} (${c.symbol}) $${parseFloat(
        c.volume24h
      ).toLocaleString()}`;
    });

    const formatValuable = valuable.data?.exploreList?.edges?.map((e, i) => {
      const c = e.node;
      return `${i + 1}. ${c.name} (${c.symbol}) $${parseFloat(
        c.marketCap
      ).toLocaleString()} MCap`;
    });

    const formatNew = newest.data?.exploreList?.edges?.map((e, i) => {
      const c = e.node;
      return `${i + 1}. ${c.name} (${c.symbol}) $${parseFloat(
        c.marketCap
      ).toLocaleString()} MCap - ${dayjs(c.createdAt).fromNow()}`;
    });

    const formatTraded = traded.data?.exploreList?.edges?.map((e, i) => {
      const c = e.node;
      const change = c.marketCapDelta24h
        ? `${parseFloat(c.marketCapDelta24h).toFixed(2)}%`
        : "N/A";
      return `${i + 1}. ${c.name} (${c.symbol}) $${parseFloat(
        c.marketCap
      ).toLocaleString()} MCap ${change}`;
    });

    const message = `📊 *Hourly Market Update*\n_Updated: ${dayjs
      .utc()
      .format("D MMM YY, h:mm A [UTC]")}_

🚀 *Top Gainers*  
${formatGainers?.join("\n") || "No data available"}

💸 *Top Volume*  
${formatVolume?.join("\n") || "No data available"}

🏆 *Most Valuable*  
${formatValuable?.join("\n") || "No data available"}

🆕 *New Coins*  
${formatNew?.join("\n") || "No data available"}

⏱️ *Last Traded*  
${formatTraded?.join("\n") || "No data available"}
`;

    await bot.api.sendMessage(TELEGRAM_CHANNEL_ID, message, {
      parse_mode: "Markdown"
    });

    console.log("Hourly update sent to channel.");
  } catch (err) {
    console.error("❌ Error during hourly update:", err);
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
    "Hey there👋, Welcome to the Zora Pulse Bot!\n" +
      "This bot provides information about various coins insights and zora profiles on Base mainnet.\n" + // corrected "insigths" to "insights"
      "\n" +
      "Here are some commands you can use:\n" +
      "/help - Show this help message\n" +
      "/ping - Check if the bot is running\n" +
      "/topgainers - Show top gainers\n" +
      "/topvolume - Show top coins by volume\n" +
      "/mostvaluable - Show most valuable coins\n" +
      "/newcoins - Show new coins\n" +
      "/lasttraded - Show last traded coins\n" +
      "/coin <address> - Get coin details\n" +
      "/profile <address/handle> - Get profile details\n" +
      "/balances <address/handle> - Get profile token balances\n"
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
      `Top Gainers:\n\n${tokens
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

    console.log(`Showing top ${tokens?.length} tokens by volume:`);

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
      `Top coins by volume:\n\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}\n   Holders: ${
            coin.uniqueHolders
          }\n   Created: ${new Date(coin.createdAt || "").toLocaleString()}`;
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
      `Most valuable coins by market cap:\n\n${tokens
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
bot.command("newcoins", async (ctx) => {
  console.log("Got a /newcoins command!");
  try {
    const response = await getCoinsNew({
      count: 10
    });
    const tokens = response.data?.exploreList?.edges?.map((edge) => edge.node);

    console.log(`Showing latest ${tokens?.length} new coins:`);

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
      `New Coins:\n\n${tokens
        ?.map((coin, index) => {
          const percentChange = coin.marketCapDelta24h
            ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
            : "N/A";
          return `${index + 1}. ${coin.name} (${
            coin.symbol
          })\n   24h Change: ${percentChange}\n   Market Cap: ${
            coin.marketCap
          }\n   Volume 24h: ${coin.volume24h}\n   Created: ${new Date(
            coin.createdAt || ""
          ).toLocaleString()}\n   Creator: ${coin.creatorAddress}`;
        })
        .join("\n-----------------------------------\n")}`
    );
  } catch (error) {
    console.error("Error fetching new:", error);
    ctx.reply("Sorry, I couldn't fetch the new coins at the moment.");
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
    console.log(`Showing top ${tokens?.length} last traded:`);
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
      `Last traded coins:\n\n${tokens
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

// Handle the /coin command.
bot.command("coin", async (ctx) => {
  console.log("Got a /coin command!");
  const coinAddress = ctx.match;
  if (!coinAddress) {
    ctx.reply("Please provide a coin address.");
    return;
  }
  try {
    const response = await getCoin({
      address: coinAddress,
      chain: 8453 // 8453 is the chain ID for Base
    });
    const coin = response.data?.zora20Token;
    if (!coin) {
      ctx.reply("Coin not found with the provided address.");
      console.log("Coin not found with the provided address.");
      return;
    }

    if (coin) {
      console.log("Coin Details:");
      console.log("- Name:", coin.name);
      console.log("- Symbol:", coin.symbol);
      console.log("- Description:", coin.description);
      console.log("- Total Supply:", coin.totalSupply);
      console.log("- Market Cap:", coin.marketCap);
      console.log("- 24h Volume:", coin.volume24h);
      console.log("- Creator:", coin.creatorAddress);
      console.log("- Created At:", coin.createdAt);
      console.log("- Unique Holders:", coin.uniqueHolders);

      // Access media if available
      if (coin.media?.previewImage) {
        console.log("- Preview Image:", coin.media.previewImage);
      }

      console.log(`Showing details for ${coin.name} (${coin.symbol}):`);

      console.log(`   Market Cap: ${coin.marketCap}`);
      console.log(`   Volume 24h: ${coin.volume24h}`);
      console.log(`   Holders: ${coin.uniqueHolders}`);
      console.log(`   Created At: ${coin.createdAt}`);
      console.log(`   Creator Address: ${coin.creatorAddress}`);
      console.log("-----------------------------------");

      ctx.reply(
        `Coin Details:
        ${coin.name} (${coin.symbol})
           Market Cap: ${coin.marketCap}
           Volume 24h: ${coin.volume24h}
           Holders: ${coin.uniqueHolders}
           Created At: ${coin.createdAt}
           Creator Address: ${coin.creatorAddress}`
      );
    }
  } catch (error) {
    console.error("Error fetching coin details:", error);
    ctx.reply("Sorry, I couldn't fetch the coin details at the moment.");
  }
});

// Handle the /profile command.

bot.command("profile", async (ctx) => {
  console.log("Got a /profile command!");

  const identifier = ctx.match;
  if (!identifier) {
    ctx.reply("Please provide a wallet address or zora handle.");
    return;
  }
  try {
    const response = await getProfile({
      identifier
    });
    // TODO: fix profile graphql types
    const profile = response?.data?.profile;
    console.log("profile", profile);

    if (profile) {
      console.log("Profile Details:");
      console.log("- Handle:", profile.handle);
      console.log("- Display Name:", profile.displayName);
      console.log("- Bio:", profile.bio);

      // Access profile image if available
      if (profile.avatar?.medium) {
        console.log("- Profile Image:", profile.avatar.medium);
      }

      // Access social links if available
      if (profile?.linkedWallets && profile?.linkedWallets?.edges?.length) {
        console.log("Linked Wallets:");
        profile?.linkedWallets?.edges?.forEach((link) => {
          console.log(
            `- ${link?.node?.walletType}: ${link?.node?.walletAddress}`
          );
        });
      }
      ctx.reply(
        `Profile Details for ${identifier}\nHandle: ${
          profile.handle
        }\nDisplay Name: ${profile.displayName}\nBio: ${
          profile.bio || "N/A"
        } \n Public Wallet: ${profile?.publicWallet?.walletAddress || "N/A"}`
      );
    } else {
      console.log("Profile not found or user has not set up a profile");
      ctx.reply("Profile not found or user has not set up a profile.");
    }
  } catch (error) {
    console.error("Error fetching profile details:", error);
    ctx.reply("Sorry, I couldn't fetch the profile details at the moment.");
  }
});

// Handle the /balances command.

bot.command("balances", async (ctx) => {
  console.log("Got a /balances command!");

  const identifier = ctx.match;
  if (!identifier) {
    ctx.reply("Please provide a wallet address or zora handle.");
    return;
  }
  try {
    const response = await getProfileBalances({
      identifier,
      count: 10
    });
    const profile = response?.data?.profile;
    if (!profile) {
      ctx.reply("Profile not found or user has not set up a profile.");
      return;
    }
    console.log("profile", profile);
    console.log(`Found ${profile.coinBalances?.count || 0} coin balances`);
    const balances = profile.coinBalances?.edges?.map((edge) => edge.node);
    balances?.forEach((balance, index) => {
      console.log(`Balance ${index + 1}:`, balance);
      // remove prefix zeros from balance
      // format the token amount for better readability
      console.log(
        `- ${balance?.coin?.name} (${
          balance?.coin?.symbol
        }): ${formatTokenAmount(balance?.balance)}`
      );
    });

    ctx.reply(
      `Balances of ${identifier}\n${balances
        ?.map((balance, i) => {
          return `${i + 1}. ${balance?.coin?.name} (${
            balance?.coin?.symbol
          }): ${formatTokenAmount(balance?.balance)}`;
        })
        .join("\n")}`
    );
  } catch (error) {
    console.error("Error fetching profile balances:", error);
    ctx.reply("Sorry, I couldn't fetch the profile balances at the moment.");
  }
});

bot.inlineQuery(/help/, async (ctx) => {
  console.log("Received help inline query");
  await ctx
    .answerInlineQuery([
      {
        type: "article",
        id: "help",
        title: "Try one of these:",
        description: "topgainers | topvolume | new | valuable | traded",
        input_message_content: {
          message_text:
            "Try one of these:\n" +
            "topgainers | topvolume | new | valuable | traded\n" +
            "You can also use /help to see all commands."
        }
      }
    ])
    .then(() => {
      console.log("Answered inline query successfully");
    })
    .catch((err) => {
      console.error("Error answering inline query:", err);
    });
});

// Start the bot.
bot.start({
  onStart: (botInfo) => {
    console.info(`Bot @${botInfo.username} is up and running!`);
  }
});

app.get("/", (req, res) => {
  res.send("Zora Pulse Bot is up and running!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
