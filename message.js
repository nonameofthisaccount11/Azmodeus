const fs = require("fs");
const path = require("path");

const commands = new Map();

// Load all command files
fs.readdirSync("./commands").forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(path.join(__dirname, "commands", file));
        commands.set(command.name, command);
    }
});

async function handleMessage(sock, msg) {
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    console.log(`📩 Message from ${from}: ${text}`);

    const [cmd, ...args] = text.split(" ");

    if (commands.has(cmd)) {
        try {
            await commands.get(cmd).execute(sock, msg, args);
        } catch (error) {
            console.error("❌ Error executing command:", error);
        }
    }
}

module.exports = { handleMessage };