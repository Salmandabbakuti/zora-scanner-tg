# Zora Scanner Telegram Bot

## Overview

Zora Scanner Telegram Bot is a lightweight and fast Telegram bot built with grammY that brings real-time insights from the Zora Protocol directly to your Telegram chat.

This bot provides users with easy-to-access information about:

- Top performing coins (based on volume and price changes)

- Most traded assets

- Newly launched tokens

- Wallet profiles and token balances

- Last traded and uniquely traded coins

- Hourly updates on top gainers, top volume, most valuable coins, and newly launched coins are sent to the Telegram channel.
  It's designed to help users quickly monitor on-chain activity, discover new opportunities, and track wallet performance — all without leaving Telegram.

Whether you're a trader, analyst, or just curious about what's trending on Zora, this bot gives you the edge with on-demand insights in seconds.

[![Telegram Bot](https://img.shields.io/badge/Telegram-Join%20the%20Bot-blue?style=flat&logo=telegram)](https://t.me/zorapulse_bot)

[![Telegram Channel](https://img.shields.io/badge/Telegram-Join%20the%20Channel-blue?style=flat&logo=telegram)](https://t.me/+4ocUg0iJh1sxY2E9)

### Features & Commands

- `/help` – Get help and usage instructions.
- `/ping` – Check if the bot is alive.
- `/topgainers` – View top gaining coins in the last 24h.
- `/topvolume` – See coins with the highest trading volume.
- `/mostvaluable` – Discover the most valuable coins on Zora.
- `/newcoins` – List recently launched coins.
- `/lasttraded` – Fetch recently traded coins.
- `/lastunique` – Get coins with unique last trades.
- `/coin <coin_id>` – View detailed info on a specific coin.
- `/profile <address/zora handle>` – Show profile data of an address or Zora handle.
- `/balances <address/zora handle>` – Show list of coin balances of an address or Zora handle.

Hourly updates on top gainers, top volume, most valuable coins, and newly launched coins are sent to the channel [@ZoraPulse](https://t.me/+4ocUg0iJh1sxY2E9).

## Getting Started

You can visit the bot [@zorapulse_bot](https://t.me/zorapulse_bot), Channel [@ZoraPulse](https://t.me/+4ocUg0iJh1sxY2E9) to see updates or run your own instance of the bot.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Telegram Bot Account](https://t.me/BotFather)

> Copy .env.example to .env and fill in the required values.

1. Register Bot commands

```bash
node register-commands.js
```

2. Install dependencies and start the bot

```bash
npm install

npm start
```

### Screenshots

![Screenshot0](https://github.com/user-attachments/assets/3c92e093-2e8e-41b0-bbbd-7f563e028baf)
![Screenshot1](https://github.com/user-attachments/assets/ea267c57-7a79-4ca0-84ef-e07f9a592f34)
![Screenshot2](https://github.com/user-attachments/assets/68641b72-08a7-4a4d-a2d8-b0c76685718b)
![Screenshot3](https://github.com/user-attachments/assets/11ba94ec-a106-4d4a-b494-a7220ba7225d)
![Screenshot4](https://github.com/user-attachments/assets/d55f7321-f7b2-4ee2-ba6d-b9d9d0f244fe)
![Screenshot5](https://github.com/user-attachments/assets/3b33d1c0-bfc5-4278-b50b-65a56a053766)
![Screenshot6](https://github.com/user-attachments/assets/43b96d09-0fb9-4c9d-adc8-836b438a9f77)

## Changelog

- **v1.1.0** - Sending hourly market updates about top gainers, top volume, most valuable and newly launched coins added to the channel [@ZoraPulse](https://t.me/+4ocUg0iJh1sxY2E9).

- **v1.0.0** - Initial release with basic features and commands.

## Built With

- [Grammy](https://grammy.dev/guide/getting-started)
- [Zora Coin SDK](https://docs.zora.co/coins)
- [Viem](https://viem.sh/)
- [Node.js](https://nodejs.org/en/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
