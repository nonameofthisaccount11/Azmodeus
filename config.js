require('dotenv').config();

module.exports = {
    botName: process.env.BOT_NAME || "Azmodeus-Bot",
    browser: [process.env.BOT_NAME, process.env.BROWSER_NAME, process.env.BROWSER_VERSION],
    maxReconnects: parseInt(process.env.MAX_RECONNECTS) || 5
};