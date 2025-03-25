module.exports = {
    name: ".menu",
    execute: async (sock, from) => {
        try {
            await sock.sendMessage(from, { text: `🌑 *Azmodeus Dark Web Menu* 🌑\n
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
` });
        } catch (error) {
            console.error("❌ Error in menu command:", error);
            await sock.sendMessage(from, { text: "❌ An error occurred while displaying the menu." });
        }
    }
};