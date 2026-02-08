module.exports = async (context) => {
  const { sock, from, msg, isGroup, groupData, database, senderNumber, userData } = context;
  
  if (!isGroup) return await sock.sendMessage(from, { text: '❌ This command is only for groups!' }, { quoted: msg });
  if (!groupData?.cardsEnabled) return await sock.sendMessage(from, { text: '❌ Cards are disabled in this group!' }, { quoted: msg });
  
  const cost = 100;
  if (userData.balance < cost) {
    return await sock.sendMessage(from, { text: `❌ You need $${cost} to roll a card!` }, { quoted: msg });
  }
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const cardId = `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const card = {
    id: cardId,
    name: `Card #${Math.floor(Math.random() * 10000)}`,
    rarity,
    owner: senderNumber,
    obtainedAt: Date.now()
  };
  
  await database.setCard(cardId, card);
  
  const userCards = userData.cards || [];
  userCards.push(cardId);
  
  await database.updateUser(senderNumber, {
    cards: userCards,
    balance: userData.balance - cost
  });
  
  await sock.sendMessage(from, { text: `╭━━𖣔 𝘾𝘼𝙍𝘿 𝙍𝙊𝙇𝙇 𖣔━━╮\n│ 🎴 ${card.name}\n│ ⭐ ${rarity}\n│ 🆔 ${cardId.substr(0, 10)}...\n│ 💰 -$${cost}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};