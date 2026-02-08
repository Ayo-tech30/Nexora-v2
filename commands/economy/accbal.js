module.exports = async (context) => {
  const { sock, from, msg, userData } = context;
  
  const total = userData.balance + userData.bank;
  const balMsg = `╭━━𖣔 𝘽𝘼𝙇𝘼𝙉𝘾𝙀 𖣔━━╮\n│ 💰 𝙒𝙖𝙡𝙡𝙚𝙩: $${userData.balance.toLocaleString()}\n│ 🏦 𝘽𝙖𝙣𝙠: $${userData.bank.toLocaleString()}\n│ 💎 𝙏𝙤𝙩𝙖𝙡: $${total.toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(from, { text: balMsg }, { quoted: msg });
};