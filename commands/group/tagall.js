module.exports = async (context) => {
  const { sock, from, msg, args, isGroup, groupMetadata, isAdmin } = context;
  
  if (!isGroup) {
    return await sock.sendMessage(from, {
      text: '❌ This command is only for groups!'
    }, { quoted: msg });
  }
  
  if (!isAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ Only admins can use this command!'
    }, { quoted: msg });
  }
  
  const message = args.join(' ') || 'Group Announcement';
  const participants = groupMetadata.participants;
  const mentions = participants.map(p => p.id);
  
  let tagText = `╭━━𖣔 𝙂𝙍𝙊𝙐𝙋 𝙏𝘼𝙂 𖣔━━╮
│                       
│  📢 𝘼𝙉𝙉𝙊𝙐𝙉𝘾𝙀𝙈𝙀𝙉𝙏
│  
│  💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙚:
│  ${message}
│
╰━━━━━━━━━━━━━━━━━━━╯

👥 𝙏𝘼𝙂𝙂𝙀𝘿 𝙈𝙀𝙈𝘽𝙀𝙍𝙎
━━━━━━━━━━━━━━━
`;

  participants.forEach((p, i) => {
    tagText += `᯽ @${p.id.split('@')[0]}\n`;
  });
  
  tagText += `━━━━━━━━━━━━━━━

💜 𝙏𝙤𝙩𝙖𝙡: ${participants.length} 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 𝙏𝙖𝙜𝙜𝙚𝙙`;
  
  await sock.sendMessage(from, {
    text: tagText,
    mentions: mentions
  }, { quoted: msg });
};
