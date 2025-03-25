const { exec } = require("child_process");

module.exports = {
    name: ".portscan",
    description: "Scan open ports on an IP address",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!args[0]) return sock.sendMessage(from, { text: "❌ Usage: .portscan <IP>" });

        exec(`nmap ${args[0]}`, async (error, stdout) => {
            if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
            await sock.sendMessage(from, { text: stdout || "No open ports found." });
        });
    }
};