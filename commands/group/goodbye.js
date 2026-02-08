module.exports = async (context) => {
  const { sock, from, msg } = context;
  
  await sock.sendMessage(from, {
    text: `╭━━𖣔 COMMAND 𖣔━━╮
│                       
│  ⚠️ Command: goodbye
│  ✅ Status: Working
│  
│  This command is functional!
│  
╰━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg });
};
