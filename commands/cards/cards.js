module.exports = async (context) => {
  const { sock, from, msg, args, isGroup, isAdmin, database } = context;
  
  if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: '❌ Only admins can use this!' }, { quoted: msg });
  
  const action = args[0]?.toLowerCase();
  
  if (action === 'on') {
    await database.updateGroup(from, { cardsEnabled: true });
    await sock.sendMessage(from, { text: '╭━━𖣔 𝘾𝘼𝙍𝘿𝙎 𖣔━━╮\n│ ✅ Cards enabled!\n╰━━━━━━━━━━━━━━━━━━━╯' }, { quoted: msg });
  } else if (action === 'off') {
    await database.updateGroup(from, { cardsEnabled: false });
    await sock.sendMessage(from, { text: '╭━━𖣔 𝘾𝘼𝙍𝘿𝙎 𖣔━━╮\n│ ❌ Cards disabled!\n╰━━━━━━━━━━━━━━━━━━━╯' }, { quoted: msg });
  } else {
    await sock.sendMessage(from, { text: '❌ Usage: .cards <on/off>' }, { quoted: msg });
  }
};