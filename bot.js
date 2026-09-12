//C:\Users\Stan\Desktop\Clarens2\telegram-bot\bot.js
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express'); // ✅ Добавили express для веб-сервера

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = 'https://front2-ochre.vercel.app';

// Логика бота
bot.start((ctx) => {
  ctx.reply(
    `Привет, ${ctx.from.first_name}!\nНажми кнопку для открытия Web App:`,
    Markup.inlineKeyboard([
      Markup.button.webApp('🚀 Открыть Web App', WEB_APP_URL)
    ])
  );
});

// ✅ СОЗДАЕМ МИНИ-СЕРВЕР ДЛЯ RENDER
// Это нужно, чтобы Render видел, что наш сервис "жив" (Health Check)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Telegram Bot is running smoothly! 🚀');
});

// Запуск веб-сервера и бота
app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
  
  bot.launch()
    .then(() => console.log('🚀 Telegram Bot successfully launched on Render!'))
    .catch((err) => console.error('❌ Error launching bot:', err));
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
