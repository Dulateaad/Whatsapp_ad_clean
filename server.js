import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { detectAd } from "./utils/detectAd.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Главная проверка
app.post("/whatsapp", async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body || "";
    const mediaUrl = req.body.MediaUrl0;

    console.log(`📩 Сообщение от ${from}: ${body}`);

    let isAd = detectAd(body);

    if (mediaUrl) {
        const imgRes = await fetch(mediaUrl);
        const imgBuffer = await imgRes.arrayBuffer();
        // Здесь можно подключить распознавание рекламы на фото через ИИ
        // Сейчас просто делаем вид, что проверяем
        if (Math.random() < 0.3) isAd = true; 
    }

    if (isAd) {
        console.log(`🚫 Реклама обнаружена у ${from}`);
        // Отправка предупреждения
        await sendMessage(from, "⚠️ Ваше сообщение удалено, так как содержит рекламу.");
        return res.sendStatus(200);
    }

    res.sendStatus(200);
});

// Функция отправки сообщений в WhatsApp
async function sendMessage(to, text) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

    const params = new URLSearchParams();
    params.append("To", to);
    params.append("From", `whatsapp:${process.env.TWILIO_NUMBER}`);
    params.append("Body", text);

    const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");

    await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
}

app.listen(PORT, () => console.log(`🚀 Бот запущен на порту ${PORT}`));
