import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import readline from 'readline';
import { Boom } from '@hapi/boom';
import { initializeFirebase, db } from './config/firebase.js';
import { handleMessage } from './handlers/messageHandler.js';
import chalk from 'chalk';
import figlet from 'figlet';

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });

// Store for tracking processed messages
const processedMessages = new Set();
let botStartTime = Date.now();

// Question helper
const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

// Display banner
console.log(chalk.magenta(figlet.textSync('NEXORA', { font: 'ANSI Shadow' })));
console.log(chalk.cyan('╭━━━━━━━━━━━━━━━━━━━━━━━━━╮'));
console.log(chalk.cyan('│  ✦ Bot Name: Violet      │'));
console.log(chalk.cyan('│  ✦ Owner: Kynx           │'));
console.log(chalk.cyan('│  ✦ Version: 1.0.0        │'));
console.log(chalk.cyan('│  ✦ Database: Firebase 🔥 │'));
console.log(chalk.cyan('╰━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'));

async function startBot() {
    try {
        // Initialize Firebase
        await initializeFirebase();
        console.log(chalk.green('✓ Firebase initialized successfully!\n'));

        const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
        const { version } = await fetchLatestBaileysVersion();

        // Ask for pairing code
        const usePairingCode = await question(chalk.yellow('Use pairing code? (y/n): '));
        let phoneNumber = '';

        if (usePairingCode.toLowerCase() === 'y') {
            phoneNumber = await question(chalk.yellow('Enter WhatsApp number (with country code, e.g., 1234567890): '));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        }

        const sock = makeWASocket({
            version,
            logger,
            printQRInTerminal: !phoneNumber,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger)
            },
            browser: Browsers.ubuntu('Chrome'),
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg?.message || undefined;
                }
                return undefined;
            }
        });

        store?.bind(sock.ev);

        // Handle pairing code
        if (phoneNumber && !sock.authState.creds.registered) {
            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(phoneNumber);
                    console.log(chalk.green(`\n╭━━━━━━━━━━━━━━━━━━━━╮`));
                    console.log(chalk.green(`│  Pairing Code: ${code}  │`));
                    console.log(chalk.green(`╰━━━━━━━━━━━━━━━━━━━━╯\n`));
                } catch (error) {
                    console.log(chalk.red('Error requesting pairing code:', error));
                }
            }, 3000);
        }

        // Connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                    ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                    : true;

                console.log(chalk.red('Connection closed. Reconnecting:', shouldReconnect));

                if (shouldReconnect) {
                    // Update bot start time on reconnect to ignore old messages
                    botStartTime = Date.now();
                    startBot();
                }
            } else if (connection === 'open') {
                console.log(chalk.green('\n✓ Connected to WhatsApp successfully!'));
                console.log(chalk.cyan('╭━━━━━━━━━━━━━━━━━━━━━━━━━╮'));
                console.log(chalk.cyan('│  ✦ Status: Online ✓      │'));
                console.log(chalk.cyan('│  ✦ Bot is ready!         │'));
                console.log(chalk.cyan('╰━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'));
                botStartTime = Date.now();
            }
        });

        // Save credentials
        sock.ev.on('creds.update', saveCreds);

        // Handle messages
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            try {
                if (type !== 'notify') return;

                const msg = messages[0];
                if (!msg.message) return;

                // Ignore messages sent before bot started
                const messageTimestamp = msg.messageTimestamp * 1000;
                if (messageTimestamp < botStartTime) {
                    return;
                }

                // Prevent duplicate processing
                const messageId = msg.key.id;
                if (processedMessages.has(messageId)) return;
                
                processedMessages.add(messageId);

                // Clean up old processed messages (keep last 1000)
                if (processedMessages.size > 1000) {
                    const arr = Array.from(processedMessages);
                    processedMessages.clear();
                    arr.slice(-500).forEach(id => processedMessages.add(id));
                }

                // Handle the message
                await handleMessage(sock, msg);
            } catch (error) {
                console.error(chalk.red('Error processing message:'), error);
            }
        });

        // Handle group updates
        sock.ev.on('group-participants.update', async (update) => {
            try {
                const { id, participants, action } = update;
                
                // Get group settings
                const groupRef = db.ref(`groups/${id.replace('@g.us', '')}/settings`);
                const snapshot = await groupRef.once('value');
                const settings = snapshot.val() || {};

                if (action === 'add' && settings.welcome) {
                    for (const participant of participants) {
                        const welcomeMsg = `╭━━𖣔 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𖣔━━╮
│                       
│  👋 Welcome to the group!
│  
│  👤 @${participant.split('@')[0]}
│  
│  📝 Please read the group
│     description and rules
│
╰━━━━━━━━━━━━━━━━━━━╯`;
                        
                        await sock.sendMessage(id, {
                            text: welcomeMsg,
                            mentions: [participant]
                        });
                    }
                }

                if (action === 'remove' && settings.goodbye) {
                    for (const participant of participants) {
                        const goodbyeMsg = `╭━━𖣔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𖣔━━╮
│                       
│  👋 Goodbye!
│  
│  👤 @${participant.split('@')[0]}
│  
│  💜 Thanks for being part
│     of the group!
│
╰━━━━━━━━━━━━━━━━━━━╯`;
                        
                        await sock.sendMessage(id, {
                            text: goodbyeMsg,
                            mentions: [participant]
                        });
                    }
                }

                // Check if bot was promoted to admin
                if (action === 'promote' && participants.includes(sock.user.id.split(':')[0] + '@s.whatsapp.net')) {
                    await sock.sendMessage(id, {
                        text: '✨ Thank you for promoting me! I can now perform admin functions.'
                    });
                }
            } catch (error) {
                console.error(chalk.red('Error handling group update:'), error);
            }
        });

        return sock;
    } catch (error) {
        console.error(chalk.red('Error starting bot:'), error);
        process.exit(1);
    }
}

// Start the bot
startBot();

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\nShutting down bot...'));
    process.exit(0);
});
