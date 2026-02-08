module.exports = async (context) => {
  const { sock, from, msg, userData } = context;
  
  const cards = userData.cards || [];
  
  if (cards.length === 0) {
    return await sock.sendMessage(from, { text: '╭━━𖣔 𝙈𝙔 𝘾𝘼𝙍𝘿𝙎 𖣔━━╮\n│ ❌ No cards yet!\n│ Use .rollcard to get cards\n╰━━━━━━━━━━━━━━━━━━━╯' }, { quoted: msg });
  }
  
  let cardsList = `╭━━𖣔 𝙈𝙔 𝘾𝘼𝙍𝘿𝙎 𖣔━━╮\n│ 🎴 Total: ${cards.length} cards\n│\n`;
  
  cards.slice(0, 10).forEach((cardId, i) => {
    cardsList += `│ ${i + 1}. ${cardId.substring(0, 15)}...\n`;
  });
  
  if (cards.length > 10) {
    cardsList += `│ ... and ${cards.length - 10} more\n`;
  }
  
  cardsList += `╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(from, { text: cardsList }, { quoted: msg });
};