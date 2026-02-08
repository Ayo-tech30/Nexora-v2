module.exports = async (context) => {
  const { sock, from, msg, args, isGroup, isAdmin, groupData, database } = context;
  
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
  
  const mode = args[0]?.toLowerCase();
  
  if (mode === 'private') {
    await database.updateGroup(from, { privateMode: true });
    
    await sock.sendMessage(from, {
      text: `╭━━𖣔 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝙈𝙊𝘿𝙀 𖣔━━╮
│                       
│  🔒 𝙋𝙧𝙞𝙫𝙖𝙩𝙚 𝙈𝙤𝙙𝙚 𝙀𝙣𝙖𝙗𝙡𝙚𝙙
│  
│  Bot will not respond to
│  commands in this group.
│  
│  Use .mode public to disable
│  
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
  } else if (mode === 'public') {
    await database.updateGroup(from, { privateMode: false });
    
    await sock.sendMessage(from, {
      text: `╭━━𖣔 𝙋𝙐𝘽𝙇𝙄𝘾 𝙈𝙊𝘿𝙀 𖣔━━╮
│                       
│  🔓 𝙋𝙪𝙗𝙡𝙞𝙘 𝙈𝙤𝙙𝙚 𝙀𝙣𝙖𝙗𝙡𝙚𝙙
│  
│  Bot will respond to commands
│  
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
  } else {
    await sock.sendMessage(from, {
      text: '❌ Usage: .mode <private/public>'
    }, { quoted: msg });
  }
};
