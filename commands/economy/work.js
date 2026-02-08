module.exports = async (context) => {
  const { sock, from, msg, userData, database, senderNumber } = context;
  
  const now = Date.now();
  const cooldown = 60 * 60 * 1000;
  const lastWork = userData.lastWork || 0;
  
  if (now - lastWork < cooldown) {
    const remaining = cooldown - (now - lastWork);
    const minutes = Math.floor(remaining / 60000);
    return await sock.sendMessage(from, { text: `⏰ You can work again in ${minutes} minutes` }, { quoted: msg });
  }
  
  const jobs = [
    { name: 'Developer', min: 100, max: 300 },
    { name: 'Designer', min: 80, max: 250 },
    { name: 'Writer', min: 60, max: 200 },
    { name: 'Driver', min: 50, max: 150 }
  ];
  
  const job = jobs[Math.floor(Math.random() * jobs.length)];
  const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
  
  await database.updateUser(senderNumber, {
    balance: userData.balance + earned,
    lastWork: now
  });
  
  await sock.sendMessage(from, { text: `╭━━𖣔 𝙒𝙊𝙍𝙆 𖣔━━╮\n│ 💼 Job: ${job.name}\n│ ✅ Earned: $${earned}\n│ 💰 Balance: $${(userData.balance + earned).toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━╯` }, { quoted: msg });
};