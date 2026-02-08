module.exports = async (context) => {
  const { sock, from, msg, args, userData, database, senderNumber } = context;
  
  const bet = parseInt(args[0]);
  const choice = args[1]?.toLowerCase();
  
  if (!bet || !choice || !['heads', 'tails'].includes(choice)) {
    return await sock.sendMessage(from, { text: '❌ Usage: .coinflip <amount> <heads/tails>' }, { quoted: msg });
  }
  
  if (bet < 10) return await sock.sendMessage(from, { text: '❌ Minimum bet: $10' }, { quoted: msg });
  if (bet > userData.balance) return await sock.sendMessage(from, { text: '❌ Insufficient balance!' }, { quoted: msg });
  
  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  const won = result === choice;
  const amount = won ? bet : -bet;
  
  await database.updateUser(senderNumber, { balance: userData.balance + amount });
  
  await sock.sendMessage(from, { text: `╭━━𖣔 𝘾𝙊𝙄𝙉𝙁𝙇𝙄𝙋 𖣔━━╮\n│ 🪙 Result: ${result}\n│ ${won ? '✅ YOU WIN!' : '❌ YOU LOSE!'}\n│ ${won ? '+' : ''}$${amount.toLocaleString()}\n│ 💰 Balance: $${(userData.balance + amount).toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};