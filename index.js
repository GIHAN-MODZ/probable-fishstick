const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = '8025378224:AAHUAhgqJ-adKEKCcm7JZuhD5MQYFIEknQk';
const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.static('public'));
app.use(express.json());

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const link = `https://probable-fishstick-gu43.onrender.com/capture?chat_id=${chatId}`;
  bot.sendMessage(chatId, `Click this link to upload your photo: ${link}`);
});

app.get('/capture', (req, res) => {
  const chatId = req.query.chat_id;
  res.sendFile(path.join(__dirname, 'public', 'capture.html'));
});

app.post('/upload', (req, res) => {
  const { chatId, photoData } = req.body;
  // send photo back to Telegram chat
  bot.sendPhoto(chatId, Buffer.from(photoData, 'base64'));
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on port 3000'));