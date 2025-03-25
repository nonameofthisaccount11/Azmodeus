const { exec } = require("child_process");

module.exports = {
    name: ".whois",
    description: "Perform WHOIS lookup on a domain",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!args[0]) return sock.sendMessage(from, { text: "❌ Usage: .whois <domain>" });

        exec(`whois ${args[0]}`, async (error, stdout) => {
            if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
            await sock.sendMessage(from, { text: stdout || "No WHOIS data found." });
        });
    }
};