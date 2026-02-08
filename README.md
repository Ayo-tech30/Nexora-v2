# 🌟 NEXORA VIOLET WHATSAPP BOT 🌟

Advanced WhatsApp Bot with Cards System, Economy, Gambling & More!

## 📋 Features

✅ **Pairing Code Authentication** - No QR code needed!
✅ **Firebase Database** - Cloud-based data storage
✅ **Cards System** - Collect and trade cards
✅ **Economy System** - Full banking and currency system
✅ **Gambling Games** - 15+ casino-style games
✅ **Group Management** - Admin tools for group control
✅ **Private Mode** - Control bot responses in groups
✅ **Auto-ignore old messages** - Won't respond to commands from when bot was offline
✅ **Beautiful formatted responses** - Professional layouts

## 🚀 Installation

### 1. Prerequisites
- Node.js (v16 or higher)
- npm
- Firebase Account

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Open `firebase.js` and replace the `serviceAccount` object with your Firebase credentials

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Bot

```bash
npm start
```

### 5. Pair Your WhatsApp

When prompted, enter your WhatsApp number (with country code, without +):
Example: `1234567890`

The bot will display a pairing code. Enter this code in your WhatsApp:
1. Open WhatsApp
2. Go to Settings > Linked Devices
3. Link a Device > Link with Phone Number
4. Enter the pairing code shown in terminal

## 📱 Commands

### ⚙️ Main Commands
- `.menu` - Show all commands
- `.ping` - Check bot latency
- `.alive` - Bot status
- `.afk` - Set AFK status
- `.register` - Register to use bot
- `.leaderboard` - Top richest users

### 👤 Profile Commands
- `.profile [@user]` - View profile
- `.setprofile` - Set profile picture (with image)
- `.setprofilequote <text>` - Set profile quote
- `.setage <number>` - Set age
- `.setname <name>` - Set display name

### 🛡️ Group Admin Commands
- `.promote @user` - Promote to admin
- `.demote @user` - Remove admin
- `.mute @user` - Mute user
- `.unmute @user` - Unmute user
- `.warn @user` - Warn user
- `.kick @user` - Remove user
- `.delete` - Delete message (reply to message)
- `.tagall <message>` - Tag all members
- `.hidetag <message>` - Tag all (hidden)
- `.welcome <on/off>` - Welcome messages
- `.goodbye <on/off>` - Goodbye messages
- `.antilink <on/off>` - Anti-link protection
- `.groupinfo` - Group information
- `.mode private` - Enable private mode (bot won't respond in group)

### 🎴 Cards System
- `.mycards` - View your cards
- `.get <id>` - Get specific card
- `.deck` - View card deck
- `.givecard @user` - Give card to user
- `.sellcard` - Sell card
- `.auction` - Start card auction
- `.bid <amount>` - Bid on auction
- `.rollcard` - Roll for new card ($100)
- `.cards <on/off>` - Enable/disable cards in group (admin)

**Note:** To spawn a card, upload an image with the caption containing card info!

### 💰 Economy Commands
- `.accbal [@user]` - Check balance
- `.deposit <amount>` - Deposit to bank
- `.withdraw <amount>` - Withdraw from bank
- `.send @user <amount>` - Send money
- `.daily` - Daily reward
- `.weekly` - Weekly reward
- `.monthly` - Monthly reward
- `.inv` - View inventory
- `.work` - Work for money
- `.rob @user` - Rob user

### 🎰 Gambling Commands
- `.gamble <amount>` - Simple gamble
- `.slots <amount>` - Slot machine
- `.roulette <bet> <color/number>` - Roulette
- `.blackjack <amount>` - Blackjack
- `.coinflip <amount> <heads/tails>` - Coin flip
- `.dice <amount>` - Dice roll
- `.lottery` - Enter lottery
- `.jackpot` - Jackpot game
- `.crash <amount>` - Crash game
- `.race <amount>` - Race game
- `.wheel <amount>` - Spin wheel
- `.poker <amount>` - Poker
- `.mines <amount>` - Mines game
- `.plinko <amount>` - Plinko
- `.limbo <amount> <multiplier>` - Limbo game

### 🔍 Search Commands
- `.gpt <query>` - ChatGPT
- `.ai <query>` - AI response
- `.google <query>` - Google search

### 🖼️ Image Commands
- `.sticker` - Create sticker (reply to image)
- `.blur` - Blur image (reply to image)
- `.removebg` - Remove background (reply to image)

### 🌟 Fun Commands
- `.match [@user]` - Match percentage
- `.roast @user` - Roast someone
- `.simp @user` - Simp meter

### 🪷 Download Commands
- `.play <song>` - Download music
- `.instagram <url>` - Download IG content
- `.tiktok <url>` - Download TikTok

## 🔧 Configuration

### Bot Settings
Edit in `index.js`:
```javascript
const BOT_CONFIG = {
  botName: '𝗩𝗶𝗼𝗹𝗲𝘁',
  ownerName: '𝗞𝘆𝗻𝘅',
  prefix: '.',
  sessionName: 'nexora_session'
};
```

### Firebase Configuration
Edit in `firebase.js`:
- Add your Firebase service account credentials
- Update database URL

## 📁 Project Structure

```
whatsapp-bot/
├── index.js                 # Main bot file
├── firebase.js             # Firebase configuration
├── package.json            # Dependencies
├── handlers/
│   └── messageHandler.js   # Message processing
├── commands/
│   ├── index.js           # Command exports
│   ├── main/              # Main commands
│   ├── profile/           # Profile commands
│   ├── group/             # Group admin commands
│   ├── cards/             # Card system commands
│   ├── economy/           # Economy commands
│   ├── gambling/          # Gambling commands
│   ├── search/            # Search commands
│   ├── image/             # Image processing commands
│   ├── fun/               # Fun commands
│   └── download/          # Download commands
└── nexora_session/        # Auth session (auto-created)
```

## 🔒 Security Features

- Old message filtering (doesn't respond to commands from when bot was offline)
- Private mode for groups
- Admin-only commands
- Mute system
- Warn system

## 💡 Tips

1. **Private Mode**: Use `.mode private` in groups where you only want DMs to work
2. **Cards System**: Enable cards in your group with `.cards on`
3. **Economy**: Users must register with `.register` to use economy features
4. **Pairing Code**: If pairing fails, delete `nexora_session` folder and restart

## 🐛 Troubleshooting

**Bot not responding:**
- Check if bot has admin rights (for admin commands)
- Check if group is in private mode
- Verify Firebase connection

**Pairing code not working:**
- Make sure phone number is correct (include country code)
- Try deleting session folder and restarting
- Check internet connection

**Commands not working:**
- Make sure you're registered (`.register`)
- Check if you're using correct prefix (`.`)
- Verify you have sufficient balance for economy commands

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Check that WhatsApp is properly paired

## 📝 License

MIT License - Feel free to modify and use!

## 🎉 Credits

**Created by:** Kynx
**Bot Name:** Nexora Violet
**Powered by:** Baileys & Firebase

---

💜 **Enjoy using Nexora Violet!** 💜
