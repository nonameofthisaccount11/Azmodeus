const { exec } = require("child_process");

module.exports = {
    name: ".ipinfo",
    description: "Retrieve IP address information",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!args[0]) return sock.sendMessage(from, { text: "❌ Usage: .ipinfo <IP>" });

        exec(`curl -s ipinfo.io/${args[0]}`, async (error, stdout) => {
            if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
            await sock.sendMessage(from, { text: stdout || "No IP info found." });
        });
    }
};