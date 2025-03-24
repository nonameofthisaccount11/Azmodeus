const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const { exec } = require("child_process");
const config = require("./config");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: Pino({ level: config.logging ? 'debug' : 'silent' }),
        browser: [config.botName, 'Chrome', '1.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const sender = msg.key.participant || msg.key.remoteJid;

            console.log(`📩 Message from ${from}: ${text}`);

            const commands = {
                ".menu": async () => {
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
                },
                ".whois": async () => {
                    const domain = text.split(" ")[1];
                    if (!domain) return sock.sendMessage(from, { text: "❌ Usage: .whois <domain>" });
                    exec(`whois ${domain}`, async (error, stdout) => {
                        if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
                        await sock.sendMessage(from, { text: stdout || "No WHOIS data found." });
                    });
                },
                ".portscan": async () => {
                    const ip = text.split(" ")[1];
                    if (!ip) return sock.sendMessage(from, { text: "❌ Usage: .portscan <IP>" });
                    exec(`nmap ${ip}`, async (error, stdout) => {
                        if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
                        await sock.sendMessage(from, { text: stdout || "No open ports found." });
                    });
                },
                ".ipinfo": async () => {
                    const ip = text.split(" ")[1];
                    if (!ip) return sock.sendMessage(from, { text: "❌ Usage: .ipinfo <IP>" });
                    exec(`curl -s ipinfo.io/${ip}`, async (error, stdout) => {
                        if (error) return sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
                        await sock.sendMessage(from, { text: stdout || "No IP info found." });
                    });
                },
                ".update": async () => {
                    await sock.sendMessage(from, { text: "🔄 Updating bot from GitHub..." });
                    exec("git pull && pm2 restart azmodeus", (error, stdout) => {
                        if (error) return sock.sendMessage(from, { text: "❌ Update failed:\n" + error.message });
                        sock.sendMessage(from, { text: "✅ Update successful! Bot restarted.\n" + stdout });
                    });
                }
            };

            if (commands[text]) {
                await commands[text]();
            }

            if (config.antiLink && text.match(/https?:\/\/\S+/gi)) {
                await sock.sendMessage(from, { text: `🚨 *No Links Allowed!* 🚨\n@${sender.split('@')[0]}, your message has been deleted.`, mentions: [sender] });
                await sock.sendMessage(from, { delete: msg.key });
            }

        } catch (error) {
            console.error("❌ Error handling message:", error);
        }
    });

    sock.ev.on('connection.update', async (update) => {
        try {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason === DisconnectReason.badSession) {
                    console.log('❌ Bad session, delete auth_info_baileys and restart.');
                } else {
                    console.log('🔄 Reconnecting...');
                    startBot();
                }
            }
        } catch (error) {
            console.error("❌ Connection error:", error);
        }
    });
}

startBot();