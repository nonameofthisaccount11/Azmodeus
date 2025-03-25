const fs = require("fs");
const path = require("path");

const commands = new Map();

// Load all command files from the "commands" folder
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(`./commands/${file}`);
        commands.set(command.name, command.execute);
    }
});

// Debugging: Check if all commands are loaded
console.log(`✅ Loaded ${commands.size} commands:`, [...commands.keys()]);

async function handleMessage(sock, msg) {
    try {
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        console.log(`📩 Message from ${from}: ${text}`);

        // Execute command if it exists
        if (commands.has(text)) {
            await commands.get(text)(sock, from);
        }
    } catch (error) {
        console.error("❌ Error handling message:", error);
    }
}

module.exports = handleMessage;