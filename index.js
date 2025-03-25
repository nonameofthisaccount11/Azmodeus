const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const config = require("./config/config");
const handleMessage = require("./message");

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth');
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
                await handleMessage(sock, msg);
            } catch (error) {
                console.error("❌ Error processing message:", error);
            }
        });

        sock.ev.on('connection.update', async (update) => {
            try {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`🔄 Connection closed, reason: ${reason || "Unknown"}`);

                    if (reason === DisconnectReason.badSession) {
                        console.log('❌ Bad session, delete auth folder and restart.');
                    } else {
                        console.log('🔄 Reconnecting in 5 seconds...');
                        setTimeout(startBot, 5000);
                    }
                }
            } catch (error) {
                console.error("❌ Connection error:", error);
            }
        });

    } catch (error) {
        console.error("❌ Critical bot error:", error);
        console.log("🔄 Restarting bot in 10 seconds...");
        setTimeout(startBot, 10000);
    }
}

startBot();