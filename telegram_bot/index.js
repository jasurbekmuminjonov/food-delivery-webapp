require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const GET_URL = "http://localhost:8080/api/v1/basic/user/get";
const POST_URL = "http://localhost:8080/api/v1/basic/user/create";

const userStates = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  try {
    await axios.get(`${GET_URL}?telegram_id=${telegramId}`);
    bot.sendMessage(chatId, "Boshlash uchun quyidagi tugmani bosing:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Boshlash",
              web_app: {
                url: `https://kwmkqg1t-5173.euw.devtunnels.ms?start=${telegramId}`,
              },
            },
          ],
        ],
      },
    });
  } catch (error) {
    if (error.response?.data?.message === "Foydalanuvchi topilmadi") {
      await axios.post(POST_URL, { telegram_id: telegramId });

      bot.sendMessage(chatId, "Iltimos, telefon raqamingizni yuboring 👇", {
        reply_markup: {
          keyboard: [
            [{ text: "📞 Telefon raqamni yuborish", request_contact: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });

      userStates[telegramId] = { stage: "awaiting_phone" };
    } else {
      bot.sendMessage(chatId, "Xatolik: " + error.message);
    }
  }
});

bot.on("contact", async (msg) => {
  const telegramId = msg.from.id;
  const chatId = msg.chat.id;

  if (userStates[telegramId]?.stage === "awaiting_phone") {
    const phone = msg.contact.phone_number;

    await axios.post(POST_URL, {
      telegram_id: telegramId,
      user_phone: phone,
    });

    userStates[telegramId] = { stage: "awaiting_name" };

    bot.sendMessage(chatId, "Ismingizni kiriting:", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  const state = userStates[telegramId];

  if (state?.stage === "awaiting_name") {
    await axios.post(POST_URL, {
      telegram_id: telegramId,
      user_name: text,
    });

    userStates[telegramId] = { stage: "awaiting_gender" };

    bot.sendMessage(chatId, "Jinsingizni tanlang:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Erkak", callback_data: "gender_male" }],
          [{ text: "Ayol", callback_data: "gender_female" }],
        ],
      },
    });
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const telegramId = query.from.id;
  const data = query.data;

  if (userStates[telegramId]?.stage === "awaiting_gender") {
    const gender = data === "gender_male" ? "male" : "female";

    await axios.post(POST_URL, {
      telegram_id: telegramId,
      user_gender: gender,
    });

    bot.sendMessage(chatId, "Boshlash uchun quyidagi tugmani bosing:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Boshlash",
              web_app: {
                url: `https://kwmkqg1t-5173.euw.devtunnels.ms?start=${telegramId}`,
              },
            },
          ],
        ],
      },
    });
    userStates[telegramId] = null;
  }

  bot.answerCallbackQuery(query.id);
});
