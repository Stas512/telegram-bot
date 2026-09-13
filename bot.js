require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = 'https://front2-ochre.vercel.app';

// ✅ Настройте webhook для Render
const webhookPath = `/${process.env.BOT_TOKEN}`;
const webhookUrl = `https://telegram-bot-50n4.onrender.com${webhookPath}`;

bot.telegram.setWebhook(webhookUrl).then(() => {
  console.log('✅ Webhook установлен:', webhookUrl);
}).catch((err) => {
  console.error('❌ Ошибка установки webhook:', err);
});

// Логика бота
bot.start((ctx) => {
  ctx.reply(
    `Привет, ${ctx.from.first_name}!\nНажми кнопку для открытия Web App:`,
    Markup.inlineKeyboard([
      Markup.button.webApp('🚀 Открыть Web App', WEB_APP_URL, { start_param: 'auth' })
    ])
  );
});

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware для парсинга JSON
app.use(express.json());

// ✅ Обработчик webhook (только POST)
app.post(webhookPath, (req, res) => {
  // ✅ Проверка на пустой request (Telegram делает GET для проверки)
  if (!req.body || !req.body.update_id) {
    return res.status(200).send('OK');
  }
  
  bot.handleUpdate(req.body, res);
});

// Health check (GET)
app.get('/', (req, res) => {
  res.send('Telegram Bot is running smoothly! 🚀');
});

// Запуск веб-сервера
app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
  console.log('🚀 Telegram Bot successfully launched on Render!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));