const { exec } = require("child_process");

module.exports = {
    name: ".whois",
    execute: async (sock, from, text) => {
        try {
            const domain = text.split(" ")[1];
            if (!domain) {
                return sock.sendMessage(from, { text: "❌ Usage: .whois <domain>" });
            }

            exec(`whois ${domain}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Whois error for ${domain}:`, error);
                    return sock.sendMessage(from, { text: `❌ Whois lookup failed: ${error.message}` });
                }
                sock.sendMessage(from, { text: stdout || "No WHOIS data found." });
            });
        } catch (error) {
            console.error("❌ Error in whois command:", error);
            await sock.sendMessage(from, { text: "❌ An error occurred while executing the whois command." });
        }
    }
};