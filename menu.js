module.exports = {
    name: ".menu",
    description: "Display bot commands",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, {
            text: `🌑 *Azmodeus Dark Menu* 🌑\n
🔹 *Admin Commands*  
- 🚫 !kick [@user] - Remove user  
- 👑 !promote [@user] - Make admin  
- ❌ !demote [@user] - Remove admin  

🔹 *Security & Anti-Spam*  
- 🔗 Anti-Link Protection (Auto-Deletes Links)  
- 🔥 Anti-Delete Messages  
- 📸 Anti-View Once  

🔹 *Hacker Tools*  
- 🕵️ .whois [domain] - Domain lookup  
- 🛠 .portscan [IP] - Open port scanner  
- 🔐 .ipinfo [IP] - IP address info  

🔹 *System Control*  
- 🔄 .update - Pull latest bot updates  
- 📊 .status - Check bot status  
`
        });
    }
};