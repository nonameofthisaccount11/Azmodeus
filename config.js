require('dotenv').config();

module.exports = {
    botName: process.env.BOT_NAME || "Azmodeus-Bot",
    browser: [process.env.BOT_NAME, process.env.BROWSER_NAME, process.env.BROWSER_VERSION],
    maxReconnects: parseInt(process.env.MAX_RECONNECTS) || 5,
    hackerMode: process.env.HACKER_MODE === "true",
    ownerNumber: process.env.OWNER_NUMBER || "1234567890@s.whatsapp.net"  // Replace with your number
};