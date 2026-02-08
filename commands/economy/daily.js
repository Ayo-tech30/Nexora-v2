module.exports = async (context) => {
  const { sock, from, msg, userData, database, senderNumber } = context;
  
  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;
  const lastDaily = userData.lastDaily || 0;
  
  if (now - lastDaily < cooldown) {
    const remaining = cooldown - (now - lastDaily);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return await sock.sendMessage(from, { text: `⏰ Daily claim available in ${hours}h ${minutes}m` }, { quoted: msg });
  }
  
  const amount = 500;
  await database.updateUser(senderNumber, {
    balance: userData.balance + amount,
    lastDaily: now
  });
  
  await sock.sendMessage(from, { text: `╭━━𖣔 𝘿𝘼𝙄𝙇𝙔 𖣔━━╮\n│ ✅ +$${amount}\n│ 💰 New Balance: $${(userData.balance + amount).toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};