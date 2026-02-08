module.exports = async (context) => {
  const { sock, from, msg, args, userData, database, senderNumber } = context;
  
  const amount = args[0] === 'all' ? userData.balance : parseInt(args[0]);
  
  if (!amount || amount < 1) return await sock.sendMessage(from, { text: '❌ Invalid amount!' }, { quoted: msg });
  if (amount > userData.balance) return await sock.sendMessage(from, { text: '❌ Insufficient balance!' }, { quoted: msg });
  
  await database.updateUser(senderNumber, {
    balance: userData.balance - amount,
    bank: (userData.bank || 0) + amount
  });
  
  await sock.sendMessage(from, { text: `╭━━𖣔 𝘿𝙀𝙋𝙊𝙎𝙄𝙏 𖣔━━╮\n│ ✅ Deposited: $${amount.toLocaleString()}\n│ 💰 Wallet: $${(userData.balance - amount).toLocaleString()}\n│ 🏦 Bank: $${((userData.bank || 0) + amount).toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};