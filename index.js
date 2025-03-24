const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const Pino = require('pino')
const { exec } = require("child_process")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: Pino({ level: 'silent' }),
        browser: ['Azmodeus-Bot', 'Chrome', '1.0']
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        const sender = msg.key.participant || msg.key.remoteJid

        console.log(`📩 Message from ${from}: ${text}`)

        // 📜 Dark Web Themed Menu
        if (text && text.toLowerCase() === ".menu") {
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
- 🕵️ Deep Web Search  
- 🛠 SQL Injection Testing  
- 🔐 Hide Messages in Images  
- 💰 Crypto Price Check  

🔹 *System Control*  
- 🔄 .update - Pull latest bot updates  
- 📊 .status - Check bot status  
` })
        }

        // 🛑 Anti-Link Feature (Deletes Links)
        if (text && text.match(/https?:\/\/\S+/gi)) {
            await sock.sendMessage(from, { text: `🚨 *No Links Allowed!* 🚨\n@${sender.split('@')[0]}, your message has been deleted.`, mentions: [sender] })
            await sock.sendMessage(from, { delete: msg.key })
            return
        }

        // 🤖 Auto-Reply Feature
        if (text && text.toLowerCase() === "hi") {
            await sock.sendMessage(from, { text: "Hello! How can I assist you today?" })
        }

        // 🛠 Admin Commands
        if (text && text.startsWith("!kick")) {
            if (!msg.key.fromMe) return
            const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
            if (!mentioned) return sock.sendMessage(from, { text: "❌ Mention a user to kick." })
            await sock.groupParticipantsUpdate(from, mentioned, "remove")
        }

        if (text && text.startsWith("!promote")) {
            if (!msg.key.fromMe) return
            const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
            if (!mentioned) return sock.sendMessage(from, { text: "❌ Mention a user to promote." })
            await sock.groupParticipantsUpdate(from, mentioned, "promote")
        }

        // 🔄 Auto-Updater Command (Updates Bot from GitHub)
        if (text && text.toLowerCase() === ".update") {
            await sock.sendMessage(from, { text: "🔄 Updating bot from GitHub..." })
            exec("git pull && pm2 restart azmodeus", (error, stdout, stderr) => {
                if (error) {
                    sock.sendMessage(from, { text: "❌ Update failed:\n" + error.message })
                    return
                }
                sock.sendMessage(from, { text: "✅ Update successful! Bot restarted.\n" + stdout })
            })
        }
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log('❌ Bad session, delete auth_info_baileys and restart.')
            } else {
                console.log('🔄 Reconnecting...')
                startBot()
            }
        }
    })
}

startBot()