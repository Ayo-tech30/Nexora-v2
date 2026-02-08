module.exports = async (context) => {
  const { sock, from, msg, isGroup, isAdmin, isBotAdmin } = context;
  
  if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: '❌ Only admins can use this!' }, { quoted: msg });
  if (!isBotAdmin) return await sock.sendMessage(from, { text: '❌ Bot must be admin!' }, { quoted: msg });
  
  const user = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!user) return await sock.sendMessage(from, { text: '❌ Tag a user!' }, { quoted: msg });
  
  await sock.groupParticipantsUpdate(from, [user], 'demote');
  await sock.sendMessage(from, { text: `╭━━𖣔 𝘿𝙀𝙈𝙊𝙏𝙀 𖣔━━╮\n│ ✅ @${user.split('@')[0]} demoted!\n╰━━━━━━━━━━━━━━━━━━━╯`, mentions: [user] }, { quoted: msg });
};