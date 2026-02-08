import { db } from '../config/firebase.js';
import { getMentionedJid, getGroupAdmins } from '../utils/helpers.js';

export async function promoteCommand(context) {
    const { sock, from, msg, isGroup, isAdmin, isBotAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: '❌ I need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    await sock.groupParticipantsUpdate(from, mentioned, 'promote');
    
    const text = `╭━━𖣔 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗 𖣔━━╮
│                       
│  ✅ User promoted to admin
│  
│  👤 @${mentioned[0].split('@')[0]}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function demoteCommand(context) {
    const { sock, from, msg, isGroup, isAdmin, isBotAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: '❌ I need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    await sock.groupParticipantsUpdate(from, mentioned, 'demote');
    
    const text = `╭━━𖣔 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 𖣔━━╮
│                       
│  ⬇️ Admin removed
│  
│  👤 @${mentioned[0].split('@')[0]}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function kickCommand(context) {
    const { sock, from, msg, isGroup, isAdmin, isBotAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: '❌ I need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    await sock.groupParticipantsUpdate(from, mentioned, 'remove');
    
    const text = `╭━━𖣔 𝗞𝗜𝗖𝗞𝗘𝗗 𖣔━━╮
│                       
│  👢 User removed from group
│  
│  👤 @${mentioned[0].split('@')[0]}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function muteCommand(context) {
    const { sock, from, msg, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    const userId = mentioned[0].replace('@s.whatsapp.net', '');
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({ muted: true });
    
    const text = `╭━━𖣔 𝗠𝗨𝗧𝗘𝗗 𖣔━━╮
│                       
│  🔇 User muted
│  
│  👤 @${userId}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function unmuteCommand(context) {
    const { sock, from, msg, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    const userId = mentioned[0].replace('@s.whatsapp.net', '');
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({ muted: false });
    
    const text = `╭━━𖣔 𝗨𝗡𝗠𝗨𝗧𝗘𝗗 𖣔━━╮
│                       
│  🔊 User unmuted
│  
│  👤 @${userId}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function warnCommand(context) {
    const { sock, from, msg, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    const userId = mentioned[0].replace('@s.whatsapp.net', '');
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || {};
    
    const warnings = (userData.warnings || 0) + 1;
    await userRef.update({ warnings });
    
    const text = `╭━━𖣔 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 𖣔━━╮
│                       
│  ⚠️ User warned
│  
│  👤 @${userId}
│  🔢 Warnings: ${warnings}/3
│  ${warnings >= 3 ? '🚨 Max warnings reached!' : ''}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function warnCountCommand(context) {
    const { sock, from, msg, isGroup } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    const userId = mentioned[0].replace('@s.whatsapp.net', '');
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || {};
    
    const warnings = userData.warnings || 0;
    
    const text = `╭━━𖣔 𝗪𝗔𝗥𝗡 𝗖𝗢𝗨𝗡𝗧 𖣔━━╮
│                       
│  👤 @${userId}
│  ⚠️ Warnings: ${warnings}/3
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function resetWarnCommand(context) {
    const { sock, from, msg, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const mentioned = getMentionedJid(msg);
    if (!mentioned.length) return await sock.sendMessage(from, { text: '❌ Please mention a user!' });
    
    const userId = mentioned[0].replace('@s.whatsapp.net', '');
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({ warnings: 0 });
    
    const text = `╭━━𖣔 𝗪𝗔𝗥𝗡 𝗥𝗘𝗦𝗘𝗧 𖣔━━╮
│                       
│  ✅ Warnings reset
│  
│  👤 @${userId}
│  ⚠️ Warnings: 0/3
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text, mentions: mentioned });
}

export async function deleteCommand(context) {
    const { sock, from, msg, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    if (!msg.message.extendedTextMessage) return await sock.sendMessage(from, { text: '❌ Reply to a message to delete it!' });
    
    const quotedMsg = msg.message.extendedTextMessage.contextInfo;
    await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: quotedMsg.stanzaId, participant: quotedMsg.participant }});
}

export async function tagAllCommand(context) {
    const { sock, from, args, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants;
    const message = args.join(' ') || 'No message';
    
    let tagText = `╭━━𖣔 𝙂𝙍𝙊𝙐𝙋 𝙏𝘼𝙂 𖣔━━╮
│                       
│  📢 𝘼𝙉𝙉𝙊𝙐𝙉𝘾𝙀𝙈𝙀𝙉𝙏
│  
│  💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙚:
│  ${message}
│
╰━━━━━━━━━━━━━━━━━━━╯

👥 𝙏𝘼𝙂𝙂𝙀𝘿 𝙈𝙀𝙈𝘽𝙀𝙍𝙎
━━━━━━━━━━━━━━━\n`;
    
    const mentions = [];
    participants.forEach((participant, index) => {
        tagText += `᯽ @${participant.id.split('@')[0]}\n`;
        mentions.push(participant.id);
    });
    
    tagText += `━━━━━━━━━━━━━━━\n\n💜 𝙏𝙤𝙩𝙖𝙡: ${participants.length} 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 𝙏𝙖𝙜𝙜𝙚𝙙`;
    
    await sock.sendMessage(from, { text: tagText, mentions });
}

export async function hideTagCommand(context) {
    const { sock, from, args, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants;
    const message = args.join(' ') || 'Hidden tag message';
    
    const mentions = participants.map(p => p.id);
    
    await sock.sendMessage(from, { text: message, mentions });
}

export async function welcomeCommand(context) {
    const { sock, from, args, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const status = args[0]?.toLowerCase();
    if (!status || !['on', 'off'].includes(status)) {
        return await sock.sendMessage(from, { text: '❌ Usage: .welcome <on/off>' });
    }
    
    const groupRef = db.ref(`groups/${from.replace('@g.us', '')}/settings`);
    await groupRef.update({ welcome: status === 'on' });
    
    const text = `╭━━𖣔 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𖣔━━╮
│                       
│  ${status === 'on' ? '✅ Enabled' : '❌ Disabled'}
│  
│  Welcome messages are now
│  ${status === 'on' ? 'ON' : 'OFF'}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text });
}

export async function goodbyeCommand(context) {
    const { sock, from, args, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const status = args[0]?.toLowerCase();
    if (!status || !['on', 'off'].includes(status)) {
        return await sock.sendMessage(from, { text: '❌ Usage: .goodbye <on/off>' });
    }
    
    const groupRef = db.ref(`groups/${from.replace('@g.us', '')}/settings`);
    await groupRef.update({ goodbye: status === 'on' });
    
    const text = `╭━━𖣔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𖣔━━╮
│                       
│  ${status === 'on' ? '✅ Enabled' : '❌ Disabled'}
│  
│  Goodbye messages are now
│  ${status === 'on' ? 'ON' : 'OFF'}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text });
}

export async function antiLinkCommand(context) {
    const { sock, from, args, isGroup, isAdmin } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    if (!isAdmin) return await sock.sendMessage(from, { text: '❌ You need to be an admin!' });
    
    const status = args[0]?.toLowerCase();
    if (!status || !['on', 'off'].includes(status)) {
        return await sock.sendMessage(from, { text: '❌ Usage: .antilink <on/off>' });
    }
    
    const groupRef = db.ref(`groups/${from.replace('@g.us', '')}/settings`);
    await groupRef.update({ antilink: status === 'on' });
    
    const text = `╭━━𖣔 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞 𖣔━━╮
│                       
│  ${status === 'on' ? '✅ Enabled' : '❌ Disabled'}
│  
│  Anti-link protection is now
│  ${status === 'on' ? 'ON' : 'OFF'}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text });
}

export async function groupInfoCommand(context) {
    const { sock, from, isGroup } = context;
    
    if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' });
    
    const groupMetadata = await sock.groupMetadata(from);
    const admins = groupMetadata.participants.filter(p => p.admin).length;
    
    const text = `╭━━𖣔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 𖣔━━╮
│                       
│  📛 Name: ${groupMetadata.subject}
│  👥 Members: ${groupMetadata.participants.length}
│  👑 Admins: ${admins}
│  📝 Description:
│  ${groupMetadata.desc || 'No description'}
│  
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(from, { text });
}
