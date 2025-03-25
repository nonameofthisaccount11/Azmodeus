const fs = require("fs");
const path = require("path");

const commands = new Map();

// Load all command files
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith(".js")) {
        try {
            const command = require(`./commands/${file}`);
            commands.set(command.name, command.execute);
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error);
        }
    }
});

console.log(`✅ Loaded ${commands.size} commands:`, [...commands.keys()]);

async function handleMessage(sock, msg) {
    try {
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        console.log(`📩 Message from ${from}: ${text}`);

        if (commands.has(text)) {
            try {
                await commands.get(text)(sock, from);
            } catch (error) {
                console.error(`❌ Error executing command ${text}:`, error);
                await sock.sendMessage(from, { text: "❌ An error occurred while executing the command." });
            }
        }
    } catch (error) {
        console.error("❌ Error handling message:", error);
    }
}

module.exports = handleMessage;