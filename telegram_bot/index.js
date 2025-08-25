require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const GET_URL = "https://bimserver.richman.uz/api/v1/basic/user/get";
const POST_URL = "https://bimserver.richman.uz/api/v1/basic/user/create";

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  try {
    await axios.get(`${GET_URL}?telegram_id=${telegramId}`);

    bot.sendMessage(chatId, "Hush kelibsiz! Xaridlarni boshlashingiz mumkin", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Boshlash🛒",
              web_app: {
                url: `https://bimwebapp.richman.uz?start=${telegramId}`,
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
    } else {
      bot.sendMessage(chatId, "Xatolik: " + error.message);
    }
  }
});

bot.on("contact", async (msg) => {
  const telegramId = msg.from.id;
  const chatId = msg.chat.id;
  const phone = msg.contact.phone_number;

  try {
    await axios.post(POST_URL, {
      telegram_id: telegramId,
      user_phone: phone,
    });

    bot.sendMessage(chatId, "Ajoyib! Xaridlarni boshlashingiz mumkin", {
      reply_markup: {
        remove_keyboard: true,
        inline_keyboard: [
          [
            {
              text: "Boshlash🛒",
              web_app: {
                url: `https://bimwebapp.richman.uz?start=${telegramId}`,
              },
            },
          ],
        ],
      },
    });
  } catch (err) {
    bot.sendMessage(chatId, "Xatolik: " + err.message);
  }
});

// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");
// const axios = require("axios");

// const token = process.env.BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// const GET_URL = "https://bimserver.richman.uz/api/v1/basic/user/get";
// const POST_URL = "https://bimserver.richman.uz/api/v1/basic/user/create";

// const userStates = {};

// // START komandasi
// bot.onText(/\/start/, async (msg) => {
//   const chatId = msg.chat.id;
//   const telegramId = msg.from.id;

//   try {
//     await axios.get(`${GET_URL}?telegram_id=${telegramId}`);

//     bot.sendMessage(chatId, "Boshlash uchun quyidagi tugmani bosing:", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Boshlash",
//               web_app: {
//                 url: `https://bimwebapp.richman.uz?start=${telegramId}`,
//               },
//             },
//           ],
//         ],
//       },
//     });
//   } catch (error) {
//     if (error.response?.data?.message === "Foydalanuvchi topilmadi") {
//       await axios.post(POST_URL, { telegram_id: telegramId });

//       bot.sendMessage(chatId, "Iltimos, telefon raqamingizni yuboring 👇", {
//         reply_markup: {
//           keyboard: [
//             [{ text: "📞 Telefon raqamni yuborish", request_contact: true }],
//           ],
//           resize_keyboard: true,
//           one_time_keyboard: true,
//         },
//       });

//       userStates[telegramId] = { stage: "awaiting_phone" };
//     } else {
//       bot.sendMessage(chatId, "Xatolik: " + error.message);
//     }
//   }
// });

// // CONTACT bosqichi
// bot.on("contact", async (msg) => {
//   const telegramId = msg.from.id;
//   const chatId = msg.chat.id;

//   if (userStates[telegramId]?.stage === "awaiting_phone") {
//     const phone = msg.contact.phone_number;

//     await axios.post(POST_URL, {
//       telegram_id: telegramId,
//       user_phone: phone,
//     });

//     userStates[telegramId] = { stage: "awaiting_name" };

//     bot.sendMessage(chatId, "Ismingizni kiriting:", {
//       reply_markup: { remove_keyboard: true },
//     });
//   }
// });

// // NAME bosqichi
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const telegramId = msg.from.id;
//   const text = msg.text;

//   if (!text || text.startsWith("/")) return;

//   const state = userStates[telegramId];

//   if (state?.stage === "awaiting_name") {
//     await axios.post(POST_URL, {
//       telegram_id: telegramId,
//       user_name: text,
//     });

//     userStates[telegramId] = { stage: "awaiting_gender" };

//     bot.sendMessage(chatId, "Jinsingizni tanlang:", {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: "Erkak", callback_data: "gender_male" }],
//           [{ text: "Ayol", callback_data: "gender_female" }],
//         ],
//       },
//     });
//   }
// });

// // GENDER bosqichi
// bot.on("callback_query", async (query) => {
//   const chatId = query.message.chat.id;
//   const telegramId = query.from.id;
//   const data = query.data;

//   if (userStates[telegramId]?.stage === "awaiting_gender") {
//     const gender = data === "gender_male" ? "male" : "female";

//     await axios.post(POST_URL, {
//       telegram_id: telegramId,
//       user_gender: gender,
//     });

//     userStates[telegramId] = { stage: "awaiting_location" };

//     bot.sendMessage(chatId, "Iltimos, joylashuvingizni yuboring 📍", {
//       reply_markup: {
//         keyboard: [
//           [{ text: "📍 Lokatsiyani yuborish", request_location: true }],
//         ],
//         resize_keyboard: true,
//         one_time_keyboard: true,
//       },
//     });
//   }

//   bot.answerCallbackQuery(query.id);
// });

// // LOCATION bosqichi
// bot.on("location", async (msg) => {
//   const chatId = msg.chat.id;
//   const telegramId = msg.from.id;

//   if (userStates[telegramId]?.stage === "awaiting_location") {
//     const { latitude, longitude } = msg.location;

//     await axios.post(POST_URL, {
//       telegram_id: telegramId,
//       default_address: {
//         lat: latitude,
//         long: longitude,
//       },
//     });

//     // Yakuniy tugma
//     bot.sendMessage(chatId, "Boshlash uchun quyidagi tugmani bosing:", {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Boshlash",
//               web_app: {
//                 url: `https://bimwebapp.richman.uz?start=${telegramId}`,
//               },
//             },
//           ],
//         ],
//       },
//     });

//     userStates[telegramId] = null;
//   }
// });
