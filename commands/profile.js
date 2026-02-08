import { db } from '../config/firebase.js';
import { getMentionedJid } from '../utils/helpers.js';

export async function profileCommand(context) {
    const { sock, from, sender, msg } = context;
    const mentioned = getMentionedJid(msg);
    const userId = (mentioned.length ? mentioned[0] : sender).replace('@s.whatsapp.net', '');
    
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || {};
    
    const text = `╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𖣔━━╮
│                       
│  👤 Name: ${userData.name || 'Not set'}
│  🎂 Age: ${userData.age || 'Not set'}
│  💰 Wallet: $${userData.wallet || 0}
│  🏦 Bank: $${userData.bank || 0}
│  🎴 Cards: ${(userData.cards || []).length}
│  ⭐ Level: ${userData.level || 1}
│  ✨ XP: ${userData.xp || 0}
│  📝 Quote: ${userData.quote || 'No quote'}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned.length ? mentioned : [] });
}

export async function setProfileCommand(context) {
    const { sock, from, sender, msg, quoted } = context;
    
    if (!quoted || !msg.message.imageMessage) {
        return await sock.sendMessage(from, { text: '❌ Reply to an image to set as profile!' });
    }
    
    await sock.sendMessage(from, { text: '✅ Profile picture updated!' });
}

export async function setProfileQuoteCommand(context) {
    const { sock, from, sender, args } = context;
    
    const quote = args.join(' ');
    if (!quote) return await sock.sendMessage(from, { text: '❌ Please provide a quote!' });
    
    const userRef = db.ref(`users/${sender.replace('@s.whatsapp.net', '')}`);
    await userRef.update({ quote });
    
    await sock.sendMessage(from, { text: '✅ Profile quote updated!' });
}

export async function setAgeCommand(context) {
    const { sock, from, sender, args } = context;
    
    const age = parseInt(args[0]);
    if (!age || age < 1 || age > 150) {
        return await sock.sendMessage(from, { text: '❌ Please provide a valid age!' });
    }
    
    const userRef = db.ref(`users/${sender.replace('@s.whatsapp.net', '')}`);
    await userRef.update({ age });
    
    await sock.sendMessage(from, { text: `✅ Age set to ${age}!` });
}

export async function setNameCommand(context) {
    const { sock, from, sender, args } = context;
    
    const name = args.join(' ');
    if (!name) return await sock.sendMessage(from, { text: '❌ Please provide a name!' });
    
    const userRef = db.ref(`users/${sender.replace('@s.whatsapp.net', '')}`);
    await userRef.update({ name });
    
    await sock.sendMessage(from, { text: `✅ Name set to ${name}!` });
}
