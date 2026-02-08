module.exports = async (context) => {
  const { sock, from, msg, args, userData, database, senderNumber } = context;
  
  const bet = parseInt(args[0]);
  if (!bet || bet < 10) return await sock.sendMessage(from, { text: '❌ Minimum bet: $10' }, { quoted: msg });
  if (bet > userData.balance) return await sock.sendMessage(from, { text: '❌ Insufficient balance!' }, { quoted: msg });
  
  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
  const slots = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  
  let winAmount = 0;
  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    winAmount = slots[0] === '7️⃣' ? bet * 10 : bet * 5;
  } else if (slots[0] === slots[1] || slots[1] === slots[2]) {
    winAmount = bet * 2;
  }
  
  const newBalance = userData.balance - bet + winAmount;
  await database.updateUser(senderNumber, { balance: newBalance });
  
  const result = winAmount > 0 ? `✅ WIN +$${winAmount - bet}` : `❌ LOST -$${bet}`;
  await sock.sendMessage(from, { text: `╭━━𖣔 𝙎𝙇𝙊𝙏𝙎 𖣔━━╮\n│ ${slots[0]} ${slots[1]} ${slots[2]}\n│ ${result}\n│ 💰 Balance: $${newBalance.toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};